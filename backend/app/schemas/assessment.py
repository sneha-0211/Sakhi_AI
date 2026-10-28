"""Assessment request and response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional

class AssessmentRequest(BaseModel):
    session_id: str
    messages: List[str] = Field(default_factory=list, description="Recent conversation messages")
    concern_type_hint: Optional[str] = None

class AssessmentResponse(BaseModel):
    concern_type: str
    neutral_summary: str
    urgency: str  # "low", "moderate", "high", "urgent"
    indicators: List[str]
    recommended_next_steps: List[str]
    immediate_human_support_advisable: bool
    relevant_resource_ids: List[str]
    confidence_note: str
    disclaimer: str = (
        "This assessment is an informational guide to help determine appropriate steps, "
        "not a clinical diagnosis or definitive prediction."
    )
