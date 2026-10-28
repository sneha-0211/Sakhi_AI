"""
SafetyConversationEngine – Qwen3-8B powered with deterministic safety layers.

Architecture:
  1. Input sanitization & PII scrubbing            (always)
  2. Deterministic concern classification          (always – feeds Qwen3 context)
  3. Deterministic risk / urgency assessment       (always – feeds Qwen3 context)
  4. Qwen3-8B response generation via HF API      (primary when HF_TOKEN set)
     └─ Falls back to rule-based generator if LLM unavailable
  5. Post-generation safety validation & filter    (always – output wrapped)
  6. Next-steps derivation from guidance engine    (always)
"""
import logging
from typing import Any, Dict, List, Optional, Tuple

from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.assessment import AssessmentResponse
from app.core.security import scrub_pii, sanitize_input
from app.core.config import settings
from app.services.concern_classifier import classify_concern
from app.services.risk_assessor import assess_risk
from app.services.safety_validator import validate_response
from app.services.guidance_engine import generate_guidance

logger = logging.getLogger("sakhi_ai.engine")


# ---------------------------------------------------------------------------
# Rule-based dialogue generator (fallback / offline mode)
# ---------------------------------------------------------------------------
class RuleBasedDialogueGenerator:
    """
    Deterministic rule-based dialogue generator – operates 100% offline.
    Used as fallback when Qwen3 is unavailable.
    """

    @staticmethod
    def generate_reply(
        message: str,
        concern_type: str,
        urgency: str,
        history: List[str] = None,
    ) -> Tuple[str, List[str], Optional[str]]:
        """Returns: (reply_text, suggested_chips, clarifying_question)"""
        lower = message.lower()

        # 1. Urgent response
        if urgency == "urgent":
            reply = (
                "🚨 SAKHI URGENT SAFETY ALERT: If you are in immediate danger right now, please do not stay silent. "
                "Move to a populated, safe area if possible, or lock the door securely and call out loudly. "
                "Dial Emergency 112 or Childline 1098 immediately. A trusted adult or security officer near you must be alerted right now. "
                "(Note: SAKHI AI cannot dispatch emergency responders for you)."
            )
            chips = [
                "I am calling 112 now",
                "I am alerting a teacher nearby",
                "Show emergency contacts directory",
                "I am safe now",
            ]
            return reply, chips, None

        # 2. High urgency
        if urgency == "high" or concern_type in ["personal_boundaries", "threats_and_coercion"]:
            if any(kw in lower for kw in ["money", "fake pictures", "leak", "blackmail"]):
                reply = (
                    "Please take a deep breath. What this person is doing is illegal blackmail, and you have done nothing wrong. "
                    "Do NOT give in to demands, send money, or send more messages. "
                    "Adults and cyber authorities deal with this every day and know how to stop them. "
                    "Have you saved screenshots of the conversation so we can help you show a trusted adult?"
                )
                chips = [
                    "Yes, I have screenshots saved",
                    "I am scared to tell my parents",
                    "Help me write what to say to an adult",
                    "Skip this question",
                ]
                clarifying = "Are they threatening you online, at school, or both?"
                return reply, chips, clarifying

            reply = (
                "I hear you, and I want you to know: your personal space and body belong entirely to you. "
                "When someone makes uncomfortable remarks, stands too close, or asks you to keep secrets, they are crossing safe boundaries. "
                "You are never required to keep secrets that make you feel uncomfortable or unsafe. "
                "Would you like help planning what to say to a parent, counselor, or teacher today?"
            )
            chips = [
                "Yes, help me talk to an adult",
                "Who should I tell first?",
                "What if he waits for me tomorrow?",
                "Skip this question",
            ]
            clarifying = "Does this happen during school, tuition, or on your commute?"
            return reply, chips, clarifying

        # 3. Moderate urgency
        if urgency == "moderate" or concern_type in ["bullying", "cyberbullying"]:
            if concern_type == "cyberbullying" or any(kw in lower for kw in ["instagram", "whatsapp", "group chat"]):
                reply = (
                    "I'm really sorry you're facing this. Group chats and online harassment can feel suffocating because they follow you into your room. "
                    "Remember this clearly: cruelty online reflects the person posting it, never your value. "
                    "The best first step is not to reply directly to them. Have you been able to capture screenshots of the posts or messages?"
                )
                chips = [
                    "Yes, I took screenshots",
                    "I don't want people finding out I reported",
                    "How do I report the account?",
                    "Skip this question",
                ]
                clarifying = "Is this happening inside a private group chat or on public accounts?"
                return reply, chips, clarifying

            reply = (
                "I'm really sorry you're experiencing this. Being teased or excluded every day hurts deeply, and you don't deserve that treatment. "
                "School should be a place where you feel respected and safe. "
                "Because this is happening repeatedly, having adult support can make a major difference so you don't carry this alone. "
                "Can you tell me whether a teacher or staff member is usually nearby when this happens?"
            )
            chips = [
                "No, it happens when teachers aren't looking",
                "I sit alone during lunch",
                "I want help approaching a counselor",
                "Skip this question",
            ]
            clarifying = "Has this been going on for days, weeks, or longer?"
            return reply, chips, clarifying

        # 4. Low urgency
        if concern_type == "academic_stress":
            reply = (
                "It is completely natural to feel anxious when exams or expectations pile up. Your feelings are real, "
                "but please remember: exam marks do not define your intelligence, worth, or future possibilities. "
                "When you feel overwhelmed, your brain is signaling that it needs rest and structure, not self-criticism. "
                "Would you like to try a 3-minute calming breathing exercise or learn how to break your study schedule into 25-minute focus blocks?"
            )
            chips = [
                "Show me the 25-minute study method",
                "I can't sleep at night because of stress",
                "How do I explain pressure to my parents?",
                "Skip this question",
            ]
            clarifying = "Is the pressure mostly coming from upcoming board exams, parents, or your own expectations?"
            return reply, chips, clarifying

        if concern_type == "friendship_conflicts":
            reply = (
                "Friendship disagreements can feel heavy, especially when someone you care about starts acting differently or distant. "
                "Sometimes people need a little space to cool off, but your feelings deserve respect too. "
                "Would you like some ideas on how to send a calm, honest message to your friend, or talk through what happened?"
            )
            chips = [
                "How do I send a calm message?",
                "They stopped talking to me completely",
                "I feel lonely at school",
                "Skip this question",
            ]
            clarifying = "Did a specific argument happen, or did they just start ignoring you?"
            return reply, chips, clarifying

        # Default
        reply = (
            "Thank you for sharing that with me. It takes courage to open up, and you have reached a safe, private space. "
            "Whatever problem you are facing, you don't have to navigate it alone. "
            "Can you tell me a little more about what has been happening, or would you prefer to explore safety resources together?"
        )
        chips = [
            "Tell me more about what I can do",
            "Show me safety resources",
            "Help me talk to a trusted adult",
            "Skip this question",
        ]
        return reply, chips, None


# ---------------------------------------------------------------------------
# Suggested chips derivation (concern-aware) – used after Qwen3 reply
# ---------------------------------------------------------------------------
def _get_chips_for_concern(concern_type: str, urgency: str) -> List[str]:
    """Return context-appropriate quick-reply chips."""
    if urgency == "urgent":
        return ["I am calling 112 now", "I am alerting a teacher nearby", "Show emergency contacts directory", "I am safe now"]
    if urgency == "high":
        return ["Yes, help me talk to an adult", "Who should I tell first?", "Show me safety resources", "Skip this question"]
    if concern_type == "cyberbullying":
        return ["Yes, I took screenshots", "How do I report the account?", "I want to block them", "Skip this question"]
    if concern_type == "bullying":
        return ["Help me approach a counselor", "How do I stay safe at school?", "I sit alone during lunch", "Skip this question"]
    if concern_type == "academic_stress":
        return ["Show me the 25-minute study method", "I can't sleep because of stress", "How do I talk to my parents?", "Skip this question"]
    if concern_type == "friendship_conflicts":
        return ["How do I send a calm message?", "They stopped talking to me", "I feel lonely at school", "Skip this question"]
    if concern_type == "personal_boundaries":
        return ["Yes, help me talk to an adult", "I am scared to tell anyone", "What happens after I report?", "Skip this question"]
    return ["Tell me more", "Show me safety resources", "Help me talk to a trusted adult", "Skip this question"]


# ---------------------------------------------------------------------------
# Core conversation engine
# ---------------------------------------------------------------------------
class SafetyConversationEngine:
    """
    Core AI Conversation Engine.

    Coordinates:
    - Input sanitization & PII scrubbing
    - Deterministic concern classification
    - Contextual risk/urgency assessment
    - Qwen3-8B response generation (primary) or rule-based fallback
    - Post-generation safety validation & replacement
    """

    def __init__(self):
        self.dialogue_generator = RuleBasedDialogueGenerator()

    async def process_message(self, request: ChatRequest) -> ChatResponse:
        # Step 1: Sanitize & scrub PII
        sanitized_text = sanitize_input(request.message, settings.max_message_length)
        scrubbed_text, pii_detected = scrub_pii(sanitized_text)

        # Step 2: Classify concern (deterministic – provides Qwen3 context)
        concern_key, concern_label, confidence = classify_concern(
            scrubbed_text, category_hint=request.category_hint
        )

        # Step 3: Assess urgency & indicators (deterministic)
        urgency, indicators, human_rec, is_emergency = assess_risk(
            scrubbed_text, concern_key
        )

        # Step 4: Generate response
        engine_used = "rule_based"
        candidate_reply: str = ""
        chips: List[str] = []
        clarifying: Optional[str] = None

        if settings.ai_engine_mode == "llm" and settings.hf_token:
            try:
                from app.services.qwen3_service import generate_reply as qwen3_reply
                # Build minimal conversation history from request context
                history = None
                if request.context and request.context.get("history"):
                    history = request.context["history"]
                candidate_reply, engine_used = await qwen3_reply(
                    scrubbed_text, concern_key, urgency, history
                )
                chips = _get_chips_for_concern(concern_key, urgency)
            except Exception as exc:
                logger.warning("Qwen3 unavailable, falling back to rule-based: %s", exc)
                candidate_reply, chips, clarifying = self.dialogue_generator.generate_reply(
                    scrubbed_text, concern_key, urgency
                )
                engine_used = "rule_based_fallback"
        else:
            candidate_reply, chips, clarifying = self.dialogue_generator.generate_reply(
                scrubbed_text, concern_key, urgency
            )

        # Step 5: Post-processing safety validation
        is_safe, violations, validated_reply = validate_response(
            candidate_reply, urgency_tier=urgency
        )

        # Step 6: Next steps
        guidance = generate_guidance(concern_key, urgency)
        next_steps = guidance.what_you_can_do_next[:3]

        return ChatResponse(
            reply=validated_reply,
            concern_type=concern_key,
            urgency=urgency,
            indicators=indicators,
            next_steps=next_steps,
            suggested_chips=chips,
            human_support_recommended=human_rec,
            emergency_guidance=is_emergency,
            clarifying_question=clarifying,
            engine_mode=engine_used,
            pii_redacted=pii_detected,
        )

    def generate_assessment(
        self,
        session_id: str,
        messages: List[str],
        concern_hint: Optional[str] = None,
    ) -> AssessmentResponse:
        """Generates structured assessment from recent conversation messages."""
        combined_text = (
            " ".join([sanitize_input(m) for m in messages])
            if messages
            else "General student well-being inquiry"
        )

        concern_key, concern_label, confidence = classify_concern(combined_text, concern_hint)
        urgency, indicators, human_rec, is_emergency = assess_risk(
            combined_text, concern_key, messages
        )
        guidance = generate_guidance(concern_key, urgency)

        resource_map = {
            "bullying": ["res-bullying", "res-talk-adult"],
            "cyberbullying": ["res-cyberbullying", "res-talk-adult"],
            "personal_boundaries": ["res-boundaries", "res-talk-adult"],
            "threats_and_coercion": ["res-boundaries", "res-talk-adult"],
            "academic_stress": ["res-exam-stress", "res-talk-adult"],
            "friendship_conflicts": ["res-friendship", "res-talk-adult"],
            "immediate_danger": ["res-boundaries"],
        }
        relevant_res = resource_map.get(concern_key, ["res-talk-adult"])

        conf_note = (
            f"Assessed via SAKHI AI (engine: Qwen3-8B + Deterministic Safety Layer, "
            f"confidence {int(confidence * 100)}%). "
            f"Based on detected context and safety indicators."
        )

        return AssessmentResponse(
            concern_type=concern_key,
            neutral_summary=guidance.what_we_understood,
            urgency=urgency,
            indicators=indicators,
            recommended_next_steps=guidance.what_you_can_do_next,
            immediate_human_support_advisable=human_rec,
            relevant_resource_ids=relevant_res,
            confidence_note=conf_note,
        )


# Global singleton
conversation_engine = SafetyConversationEngine()
