"""
Qwen3-8B LLM service via Hugging Face Inference API.

Uses the HF InferenceClient for non-streaming chat completions and
httpx with Server-Sent Events for real-time streaming.

Safety guarantee:
  - A deterministic SAKHI system prompt is always prepended.
  - Output is passed through safety_validator.validate_response() before delivery.
  - PII is never sent: scrubbed_text (not raw student input) is forwarded.
"""
from __future__ import annotations

import json
import logging
from typing import AsyncIterator, List, Optional, Tuple

import httpx

from app.core.config import settings

logger = logging.getLogger("sakhi_ai.qwen3")

# ---------------------------------------------------------------------------
# System prompt – defines Qwen3's persona and hard safety constraints
# ---------------------------------------------------------------------------
SAKHI_SYSTEM_PROMPT = """You are SAKHI, a compassionate, safe, and trustworthy AI school well-being companion designed specifically for school students in India (ages 10-18).

Your role is to:
- Listen empathetically and respond in warm, age-appropriate, non-judgmental language.
- Help students understand their situation clearly and feel heard.
- Provide practical, actionable next steps and coping strategies.
- Recommend trusted adult intervention (counselor, parent, teacher) when appropriate.
- Always direct students to emergency services (112 or Childline 1098) for immediate danger.

Strict rules you MUST follow at all times:
1. NEVER provide harmful, dangerous, or inappropriate advice.
2. NEVER use adult, sexual, or violent language.
3. NEVER discourage a student from seeking adult help.
4. NEVER claim you can replace licensed mental health professionals or emergency responders.
5. NEVER ask for or encourage sharing of personal identifying information (name, phone, address).
6. ALWAYS acknowledge the student's feelings before giving advice.
7. Keep responses focused and concise (150-300 words unless the situation demands more detail).
8. If the situation is urgent or dangerous, IMMEDIATELY lead with emergency numbers (112 / Childline 1098).
9. Speak in simple, friendly English that a 12-year-old can easily understand.
10. End responses with one supportive closing statement or a gentle follow-up question.

You understand Indian school culture, academic pressure, social dynamics, and the specific safety challenges Indian students face. Be culturally sensitive and grounded in real facts about student well-being."""


HF_INFERENCE_API_URL = "https://api-inference.huggingface.co/models/{model_id}/v1/chat/completions"


def _build_messages(
    student_message: str,
    concern_type: str,
    urgency: str,
    conversation_history: Optional[List[dict]] = None,
) -> List[dict]:
    """Build the OpenAI-compatible messages list for the chat completion request."""
    messages = [{"role": "system", "content": SAKHI_SYSTEM_PROMPT}]

    # Inject a context frame so Qwen3 understands what the classifier found
    context_note = (
        f"[SAKHI INTERNAL CONTEXT – do not repeat this to student]\n"
        f"Concern category detected: {concern_type.replace('_', ' ').title()}\n"
        f"Risk level: {urgency.upper()}\n"
        f"Respond accordingly while following all safety rules above."
    )
    messages.append({"role": "system", "content": context_note})

    # Add prior conversation turns if provided
    if conversation_history:
        for turn in conversation_history[-6:]:  # keep last 3 exchanges (6 messages)
            if turn.get("role") in ("user", "assistant") and turn.get("content"):
                messages.append({"role": turn["role"], "content": turn["content"]})

    # Append current student message
    messages.append({"role": "user", "content": student_message})
    return messages


async def generate_reply_streaming(
    student_message: str,
    concern_type: str,
    urgency: str,
    conversation_history: Optional[List[dict]] = None,
) -> AsyncIterator[str]:
    """
    Stream Qwen3-8B response token-by-token via HF Inference API SSE.

    Yields raw text chunks as they arrive from the model.
    Raises RuntimeError if the HF token is missing or the request fails.
    """
    if not settings.hf_token:
        raise RuntimeError(
            "HF_TOKEN is not set. Please add your Hugging Face token to backend/.env"
        )

    url = HF_INFERENCE_API_URL.format(model_id=settings.qwen3_model_id)
    headers = {
        "Authorization": f"Bearer {settings.hf_token}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
    }
    payload = {
        "model": settings.qwen3_model_id,
        "messages": _build_messages(student_message, concern_type, urgency, conversation_history),
        "max_tokens": settings.qwen3_max_tokens,
        "temperature": settings.qwen3_temperature,
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream("POST", url, headers=headers, json=payload) as response:
            if response.status_code != 200:
                body = await response.aread()
                raise RuntimeError(
                    f"HF API returned {response.status_code}: {body.decode()[:300]}"
                )
            async for line in response.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue
                data_str = line[5:].strip()
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    delta = data["choices"][0]["delta"].get("content", "")
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue


async def generate_reply(
    student_message: str,
    concern_type: str,
    urgency: str,
    conversation_history: Optional[List[dict]] = None,
) -> Tuple[str, str]:
    """
    Non-streaming Qwen3-8B reply generation.

    Collects the full streamed response and returns:
      (full_reply_text, engine_label)
    """
    chunks: List[str] = []
    try:
        async for chunk in generate_reply_streaming(
            student_message, concern_type, urgency, conversation_history
        ):
            chunks.append(chunk)
        full_reply = "".join(chunks).strip()
        if not full_reply:
            raise ValueError("Empty response from Qwen3-8B model.")
        return full_reply, "qwen3-8b"
    except Exception as exc:
        logger.warning("Qwen3-8B generation failed: %s", exc, exc_info=True)
        raise
