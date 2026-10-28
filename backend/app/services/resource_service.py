"""Resource and emergency directory service."""
import json
import os
from pathlib import Path
from typing import List, Optional
from app.schemas.resources import SafetyResource, EmergencyContact
from app.schemas.scenarios import DemoScenario

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def load_resources() -> List[SafetyResource]:
    file_path = DATA_DIR / "safety_resources.json"
    if not file_path.exists():
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [SafetyResource(**item) for item in data]

def load_emergency_contacts() -> List[EmergencyContact]:
    file_path = DATA_DIR / "emergency_contacts.json"
    if not file_path.exists():
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [EmergencyContact(**item) for item in data]

def load_scenarios() -> List[DemoScenario]:
    file_path = DATA_DIR / "demo_scenarios.json"
    if not file_path.exists():
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [DemoScenario(**item) for item in data]

def search_resources(query: Optional[str] = None, category: Optional[str] = None) -> List[SafetyResource]:
    resources = load_resources()
    if category and category.lower() != "all":
        resources = [r for r in resources if category.lower() in r.category.lower() or category.lower() in [t.lower() for t in r.tags]]
    if query:
        q = query.lower()
        resources = [
            r for r in resources
            if q in r.title.lower() or q in r.summary.lower() or q in r.content.lower() or any(q in t.lower() for t in r.tags)
        ]
    return resources
