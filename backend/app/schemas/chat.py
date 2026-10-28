"""Chat request and response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Ephemeral anonymous session identifier")
    message: str = Field(..., min_length=1, max_length=1500, description="Student's message")
    category_hint: Optional[str] = Field(None, description="Optional chosen category")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Conversation context flags")

class ChatResponse(BaseModel):
    reply: str
    concern_type: str
    urgency: str  # "low", "moderate", "high", "urgent"
    indicators: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
    suggested_chips: List[str] = Field(default_factory=list)
    human_support_recommended: bool = False
    emergency_guidance: bool = False
    clarifying_question: Optional[str] = None
    disclaimer: str = "This AI provides safe guidance and is not a substitute for human intervention or emergency services."
    engine_mode: str = "rule_based"
    pii_redacted: bool = False
