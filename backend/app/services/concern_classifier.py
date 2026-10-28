"""Context-aware concern classifier."""
import re
from typing import Dict, Any, Tuple, List, Optional

CONCERN_CATEGORIES = {
    "academic_stress": {
        "label": "Academic & Exam Stress",
        "keywords": ["exam", "exams", "test", "tests", "study", "studying", "marks", "grades", "failure", "homework", "tuition", "board exam", "board exams", "syllabus", "rank"],
    },
    "bullying": {
        "label": "Bullying & Teasing",
        "keywords": ["tease", "teasing", "teased", "make fun", "making fun", "mock", "mocking", "bully", "bullied", "bullying", "exclude", "excluded", "laugh at", "laughed at", "name calling", "loser", "push around", "steal lunch"],
    },
    "cyberbullying": {
        "label": "Cyberbullying & Online Harassment",
        "keywords": ["instagram", "whatsapp", "group chat", "online", "meme", "memes", "fake account", "dm", "dms", "leaked", "post", "posts", "troll", "cyber", "screenshot", "screenshots", "doxing", "tagged"],
    },
    "personal_boundaries": {
        "label": "Personal Boundaries & Unwanted Attention",
        "keywords": ["touch", "touched", "touching", "body", "inappropriate", "private part", "private parts", "stand close", "following me", "stalking", "uncomfortable look", "bus stop", "creep", "boundary", "boundaries", "stare", "staring"],
    },
    "threats_and_coercion": {
        "label": "Threats & Coercion",
        "keywords": ["threat", "threats", "threaten", "blackmail", "extort", "demanding money", "force me", "coercion", "leak pictures", "fake pictures", "ruin reputation", "or else", "dare"],
    },
    "immediate_danger": {
        "label": "Immediate Danger & Emergency",
        "keywords": ["break into", "banging on door", "banging on the door", "trapped", "weapon", "knife", "hitting me right now", "bleeding", "chasing me right now", "can't escape", "in danger right now", "attack me right now", "kill me"],
    },
    "emotional_distress": {
        "label": "Emotional Well-Being & Feeling Overwhelmed",
        "keywords": ["crying", "lonely", "sad", "anxious", "panic", "overwhelmed", "hopeless", "scared", "can't breathe", "isolated", "empty", "worthless"],
    },
    "friendship_conflicts": {
        "label": "Friendship & Relationship Conflict",
        "keywords": ["best friend", "stopped talking", "fight with friend", "ignoring me", "left out", "secret", "gossip", "betray", "argument"],
    }
}

# Contextual phrases for false positive mitigation
FALSE_POSITIVE_METAPHORS = [
    r"\bkilling time\b",
    r"\bdying to know\b",
    r"\btest is killing me\b",
    r"\bheart attack from surprise\b",
    r"\bmurdered the exam\b",
]

def check_false_positive_metaphor(text: str) -> bool:
    lower = text.lower()
    for pattern in FALSE_POSITIVE_METAPHORS:
        if re.search(pattern, lower):
            return True
    return False

def classify_concern(text: str, category_hint: Optional[str] = None) -> Tuple[str, str, float]:
    """
    Classifies a student's message into a concern category.
    Returns (category_key, category_label, confidence_score).
    """
    lower = text.lower()
    
    # Priority check: Immediate danger signals (unless purely metaphorical)
    is_metaphor = check_false_positive_metaphor(lower)
    if not is_metaphor:
        for kw in CONCERN_CATEGORIES["immediate_danger"]["keywords"]:
            if kw in lower:
                # Extra check to ensure context is genuinely alarming
                danger_signals = ["right now", "trapped", "break into", "banging", "chasing", "attack", "knife", "weapon", "save me", "help me now"]
                if any(sig in lower for sig in danger_signals) or kw in ["break into", "banging on door", "weapon", "knife"]:
                    return "immediate_danger", CONCERN_CATEGORIES["immediate_danger"]["label"], 0.95

    # Check category hint if supplied by user
    if category_hint and category_hint in CONCERN_CATEGORIES:
        # Check if text aligns somewhat or user explicitly chose it
        hint_kws = CONCERN_CATEGORIES[category_hint]["keywords"]
        if any(kw in lower for kw in hint_kws):
            return category_hint, CONCERN_CATEGORIES[category_hint]["label"], 0.85

    # Keyword scoring with category weight
    scores: Dict[str, int] = {cat: 0 for cat in CONCERN_CATEGORIES}
    
    for cat, data in CONCERN_CATEGORIES.items():
        if cat == "immediate_danger" and is_metaphor:
            continue
        for kw in data["keywords"]:
            pattern = r"\b" + re.escape(kw) + r"\b"
            matches = len(re.findall(pattern, lower))
            scores[cat] += matches * 2
            # Substring match fallback for phrases
            if " " in kw and kw in lower:
                scores[cat] += 3

    # If situational domain keywords exist (e.g. academic, bullying, cyberbullying),
    # prioritize them over generic emotional symptom words like 'anxious' or 'overwhelmed'
    if scores["academic_stress"] > 0 and scores["academic_stress"] >= scores["emotional_distress"] - 2:
        scores["academic_stress"] += 3

    # Add weight if user hint matches
    if category_hint and category_hint in scores:
        scores[category_hint] += 2

    # Find highest score
    best_cat = max(scores, key=lambda k: scores[k])
    best_score = scores[best_cat]
    
    if best_score == 0:
        if category_hint and category_hint in CONCERN_CATEGORIES:
            return category_hint, CONCERN_CATEGORIES[category_hint]["label"], 0.5
        return "emotional_distress", "General Well-Being & Support", 0.35
        
    confidence = min(0.4 + (best_score * 0.15), 0.92)
    return best_cat, CONCERN_CATEGORIES[best_cat]["label"], round(confidence, 2)
