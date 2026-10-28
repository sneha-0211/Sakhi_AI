"""FastAPI Route Handlers for SAKHI AI."""
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from typing import List, Optional, Dict, Any, AsyncIterator
import json

from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.assessment import AssessmentRequest, AssessmentResponse
from app.schemas.guidance import GuidanceRequest, GuidanceResponse
from app.schemas.safety import SafetyCheckRequest, SafetyCheckResponse
from app.schemas.resources import SafetyResource, EmergencyContact
from app.schemas.scenarios import DemoScenario

from app.services.conversation_engine import conversation_engine
from app.services.guidance_engine import generate_guidance
from app.services.safety_validator import validate_response
from app.services.resource_service import (
    load_resources,
    load_emergency_contacts,
    search_resources,
    load_scenarios,
)
from app.core.config import settings
from app.core.security import scrub_pii, sanitize_input
from app.services.concern_classifier import classify_concern
from app.services.risk_assessor import assess_risk

api_router = APIRouter(prefix="/api")


@api_router.get("/health", tags=["System"])
async def health_check():
    """Returns application health and operational parameters."""
    llm_ready = bool(settings.hf_token) and settings.ai_engine_mode == "llm"
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.version,
        "engine_mode": settings.ai_engine_mode,
        "llm_model": settings.qwen3_model_id if llm_ready else None,
        "llm_ready": llm_ready,
        "deterministic_engine_ready": True,
        "deterministic_safety_layer": True,
        "privacy_mode": "session_ephemeral_no_db",
        "strict_safety_filter": settings.strict_safety_filter,
    }


@api_router.get("/resources", response_model=List[SafetyResource], tags=["Resources"])
async def get_resources(
    query: Optional[str] = Query(None, description="Search term across titles, summary, and content"),
    category: Optional[str] = Query(None, description="Filter by category"),
):
    """Retrieve safety articles and educational guides."""
    return search_resources(query=query, category=category)


@api_router.get("/resources/emergency", response_model=List[EmergencyContact], tags=["Resources"])
async def get_emergency_contacts():
    """Retrieve verified official emergency helplines and crisis contacts."""
    return load_emergency_contacts()


@api_router.get("/scenarios", response_model=List[DemoScenario], tags=["Demo"])
async def get_demo_scenarios():
    """Retrieve 6 preconfigured judge scenarios across urgency tiers."""
    return load_scenarios()


@api_router.post("/chat", response_model=ChatResponse, tags=["Conversation"])
async def handle_chat(payload: ChatRequest):
    """Process student message through the SafetyConversationEngine (non-streaming)."""
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty.",
        )
    if len(payload.message) > settings.max_message_length:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Message exceeds maximum allowed length of {settings.max_message_length} characters.",
        )
    return await conversation_engine.process_message(payload)


@api_router.post("/chat/stream", tags=["Conversation"])
async def handle_chat_stream(payload: ChatRequest):
    """
    Stream a Qwen3-8B response via Server-Sent Events.

    The client receives:
      - data: {"type":"meta", ...}          — concern/urgency metadata (first event)
      - data: {"type":"token", "token":"…"} — streamed text tokens
      - data: {"type":"done", ...}          — final metadata (next_steps, chips, etc.)
      - data: [DONE]                        — SSE termination signal
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty.",
        )
    if len(payload.message) > settings.max_message_length:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Message exceeds maximum allowed length of {settings.max_message_length} characters.",
        )

    async def event_stream() -> AsyncIterator[str]:
        # Step 1-3: sanitize, classify, assess (deterministic – fast)
        sanitized = sanitize_input(payload.message, settings.max_message_length)
        scrubbed, pii_detected = scrub_pii(sanitized)
        concern_key, _, confidence = classify_concern(scrubbed, payload.category_hint)
        urgency, indicators, human_rec, is_emergency = assess_risk(scrubbed, concern_key)

        # Send metadata first
        meta = {
            "type": "meta",
            "concern_type": concern_key,
            "urgency": urgency,
            "indicators": indicators,
            "human_support_recommended": human_rec,
            "emergency_guidance": is_emergency,
            "pii_redacted": pii_detected,
        }
        yield f"data: {json.dumps(meta)}\n\n"

        # Step 4: Stream Qwen3 response
        full_reply_parts: list[str] = []
        engine_used = "rule_based_fallback"

        if settings.hf_token and settings.ai_engine_mode == "llm":
            try:
                from app.services.qwen3_service import generate_reply_streaming
                history = None
                if payload.context and payload.context.get("history"):
                    history = payload.context["history"]

                engine_used = "qwen3-8b"
                async for token in generate_reply_streaming(scrubbed, concern_key, urgency, history):
                    full_reply_parts.append(token)
                    yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
            except Exception as exc:
                import logging
                logging.getLogger("sakhi_ai").warning("Stream fallback triggered: %s", exc)
                engine_used = "rule_based_fallback"
                full_reply_parts = []  # reset for rule-based below

        if engine_used != "qwen3-8b" or not full_reply_parts:
            # Rule-based fallback — emit as a single token block
            from app.services.conversation_engine import RuleBasedDialogueGenerator
            rb_reply, _, _ = RuleBasedDialogueGenerator.generate_reply(
                scrubbed, concern_key, urgency
            )
            full_reply_parts = [rb_reply]
            yield f"data: {json.dumps({'type': 'token', 'token': rb_reply})}\n\n"

        # Step 5: safety validation
        candidate = "".join(full_reply_parts)
        _, _, validated_reply = validate_response(candidate, urgency_tier=urgency)

        # Step 6: guidance / chips
        from app.services.guidance_engine import generate_guidance
        from app.services.conversation_engine import _get_chips_for_concern
        guidance = generate_guidance(concern_key, urgency)
        next_steps = guidance.what_you_can_do_next[:3]
        chips = _get_chips_for_concern(concern_key, urgency)

        done_event = {
            "type": "done",
            "full_reply": validated_reply,
            "next_steps": next_steps,
            "suggested_chips": chips,
            "engine_mode": engine_used,
            "disclaimer": "This AI provides safe guidance and is not a substitute for human intervention or emergency services.",
        }
        yield f"data: {json.dumps(done_event)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@api_router.post("/assess", response_model=AssessmentResponse, tags=["Assessment"])
async def handle_assessment(payload: AssessmentRequest):
    """Generate structured concern assessment, urgency rating, and indicators."""
    return conversation_engine.generate_assessment(
        session_id=payload.session_id,
        messages=payload.messages,
        concern_hint=payload.concern_type_hint,
    )


@api_router.post("/guidance", response_model=GuidanceResponse, tags=["Guidance"])
async def handle_guidance(payload: GuidanceRequest):
    """Generate personalized 5-part guidance plan and conversation starter script."""
    return generate_guidance(
        concern_type=payload.concern_type,
        urgency=payload.urgency,
        target_adult=payload.target_adult or "teacher",
        student_summary=payload.student_summary,
    )


@api_router.post("/safety/check", response_model=SafetyCheckResponse, tags=["Safety"])
async def check_safety(payload: SafetyCheckRequest):
    """Validate content against safety rules."""
    is_safe, violations, sanitized = validate_response(
        response_text=payload.content,
        urgency_tier=payload.context_urgency or "low",
    )
    return SafetyCheckResponse(
        is_safe=is_safe,
        violations=violations,
        sanitized_content=sanitized,
        requires_override=not is_safe,
        safe_replacement=sanitized if not is_safe else None,
    )


@api_router.get("/privacy", tags=["Privacy"])
async def get_privacy_statement():
    """Returns transparent privacy, confidentiality limits, and data retention guarantees."""
    llm_active = bool(settings.hf_token) and settings.ai_engine_mode == "llm"
    return {
        "data_retention_policy": "Zero conversation storage. No chat histories are written to disk, database, or analytics.",
        "pii_handling": "Real student names, phone numbers, and IDs are forbidden. Ephemeral regex scrubbing removes accidental numbers.",
        "anonymous_sessions": "Temporary client-generated UUIDs used for ephemeral in-memory context only.",
        "clear_session_guarantee": "Clicking 'Clear Conversation' or refreshing immediately clears all active memory buffers.",
        "external_ai_disclosure": (
            f"AI responses are generated by Qwen3-8B ({settings.qwen3_model_id}) via Hugging Face Inference API. "
            f"Only scrubbed, PII-free message text is transmitted. No raw student data is sent externally."
            if llm_active
            else "100% of reasoning occurs locally in deterministic Python rules. No external AI provider receives messages."
        ),
        "limits_of_confidentiality": (
            "SAKHI AI is an AI-powered educational and self-advocacy guide. "
            "It cannot physically dispatch emergency workers, guarantee 100% confidentiality in real-world schools, "
            "or replace licensed child welfare professionals."
        ),
    }
