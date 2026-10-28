"""Safety checking schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional

class SafetyCheckRequest(BaseModel):
    content: str = Field(..., max_length=2000)
    context_urgency: Optional[str] = "low"

class SafetyCheckResponse(BaseModel):
    is_safe: bool
    violations: List[str] = Field(default_factory=list)
    sanitized_content: str
    requires_override: bool = False
    safe_replacement: Optional[str] = None
