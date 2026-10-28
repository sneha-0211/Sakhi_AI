"""Demo scenario models."""
from pydantic import BaseModel
from typing import List, Dict

class DemoScenario(BaseModel):
    id: str
    title: str
    description: str
    expected_urgency: str  # "low", "moderate", "high", "urgent"
    concern_type: str
    initial_message: str
    sample_dialogue: List[Dict[str, str]]
    tags: List[str]
    learning_takeaway: str
