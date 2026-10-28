"""Safety resources and emergency contact schemas."""
from pydantic import BaseModel
from typing import List, Optional

class SafetyResource(BaseModel):
    id: str
    title: str
    category: str
    summary: str
    content: str
    actionable_tips: List[str]
    tags: List[str]
    urgency_relevance: List[str]

class EmergencyContact(BaseModel):
    id: str
    name: str
    number: str
    description: str
    category: str
    official_portal: Optional[str] = None
    availability: str = "24/7"
    verification_status: str = "Official Verified Govt/Public Helpline"
    disclaimer: str = "General emergency service directory. This application does not dispatch emergency services."
