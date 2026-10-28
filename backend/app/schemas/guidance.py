"""Guidance request and response schemas."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class GuidanceRequest(BaseModel):
    concern_type: str
    urgency: str
    target_adult: Optional[str] = "teacher"  # "parent", "teacher", "counsellor", "trusted_adult"
    student_summary: Optional[str] = None

class AdultOption(BaseModel):
    role: str
    why_consider: str
    good_for: str

class GuidanceResponse(BaseModel):
    what_we_understood: str
    what_you_can_do_next: List[str]
    who_could_help: List[AdultOption]
    conversation_starter: str
    if_situation_worsens: List[str]
    safe_boundaries_note: str
