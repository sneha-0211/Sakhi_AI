"""Transparent rule-based risk assessor assessing urgency tiers: LOW, MODERATE, HIGH, URGENT."""
import re
from typing import Tuple, List, Dict, Any

URGENCY_LEVELS = ["low", "moderate", "high", "urgent"]

def assess_risk(
    text: str,
    concern_type: str,
    conversation_history: List[str] = None
) -> Tuple[str, List[str], bool, bool]:
    """
    Assesses urgency, indicators, human support recommendation, and emergency flag.
    Returns: (urgency_tier, indicators_list, human_support_recommended, emergency_guidance_needed)
    """
    lower = text.lower()
    full_text = " ".join([m.lower() for m in (conversation_history or [])] + [lower])
    
    indicators: List[str] = []
    
    # 1. Check for URGENT (immediate danger, ongoing physical harm, entrapment)
    urgent_signals = [
        ("break into", "Active intrusion or attempt to breach safe space"),
        ("banging on the door", "Active aggressive confrontation / physical entrapment"),
        ("trapped", "Unable to escape or leave location safely"),
        ("weapon", "Presence or mention of weapon"),
        ("knife", "Threat involving sharp weapon"),
        ("hitting me right now", "Active physical assault occurring currently"),
        ("chasing me right now", "Active pursuit/stalking in real-time"),
        ("kill me", "Direct threat to life"),
        ("in danger right now", "Direct statement of immediate physical danger")
    ]
    
    # Check if any metaphorical false positive applies
    metaphor_detected = any(phrase in lower for phrase in ["killing time", "dying to know", "exam is killing me", "test is killing me"])
    
    urgent_matched = []
    if not metaphor_detected:
        for signal_kw, indicator_desc in urgent_signals:
            if signal_kw in lower:
                urgent_matched.append(indicator_desc)
                
    if urgent_matched or concern_type == "immediate_danger":
        if not urgent_matched:
            urgent_matched.append("Immediate physical safety concern detected")
        return "urgent", urgent_matched, True, True

    # 2. Check for HIGH (threats, blackmail, extortion, unwanted touching, stalking, coercion)
    high_signals = [
        ("blackmail", "Coercion or extortion attempt identified"),
        ("extort", "Demands made under duress"),
        ("leak pictures", "Non-consensual image sharing or exposure threats"),
        ("fake pictures", "Threat of fabricating or spreading harmful media"),
        ("give them money", "Financial extortion or blackmail demand"),
        ("demanding money", "Coercion involving financial or material demands"),
        ("ruin my reputation", "Reputational extortion or public humiliation threats"),
        ("touching me", "Unwanted physical contact or boundary infringement"),
        ("touched my", "Reported physical boundary violation"),
        ("stand too close", "Persistent invasive physical proximity"),
        ("keeps following me", "Persistent tracking or stalking behavior"),
        ("bus stop", "Unsafe encounter during school transit/commute"),
        ("don't tell anyone", "Secrecy pressure imposed by older person or perpetrator"),
        ("threatened", "Explicit threat of harm or retaliation")
    ]
    
    high_matched = []
    for signal_kw, indicator_desc in high_signals:
        if signal_kw in full_text:
            high_matched.append(indicator_desc)
            
    if high_matched or concern_type in ["threats_and_coercion", "personal_boundaries"]:
        if not high_matched:
            if concern_type == "personal_boundaries":
                high_matched.append("Boundary or bodily autonomy concern requiring adult intervention")
            elif concern_type == "threats_and_coercion":
                high_matched.append("Coercive or threatening interaction identified")
        return "high", high_matched, True, False

    # 3. Check for MODERATE (repeated bullying, persistent harassment, cyberbullying, intense distress)
    moderate_signals = [
        ("every day", "High frequency: repeated daily occurrence"),
        ("repeatedly", "Pattern of continuous unwanted behavior"),
        ("for two weeks", "Chronic or prolonged situation"),
        ("for months", "Long-term ongoing difficulty"),
        ("group chat", "Public or multi-person online harassment"),
        ("anonymous account", "Digital harassment via anonymous profile"),
        ("memes about me", "Digital mocking or non-consensual content sharing"),
        ("make fun of me", "Direct verbal teasing or peer hostility"),
        ("laugh at my", "Public mocking of appearance or background"),
        ("sit alone", "Social isolation or intentional exclusion"),
        ("tell others not to sit with me", "Organized social exclusion / relational bullying"),
        ("panic attack", "Acute physiological anxiety reaction"),
        ("can't stop crying", "Elevated emotional distress requiring adult support")
    ]
    
    moderate_matched = []
    for signal_kw, indicator_desc in moderate_signals:
        if signal_kw in full_text:
            moderate_matched.append(indicator_desc)
            
    if moderate_matched or concern_type in ["bullying", "cyberbullying"]:
        if not moderate_matched:
            moderate_matched.append("Repeated peer conflict or cyber harassment pattern")
        return "moderate", moderate_matched, True, False

    # 4. Fallback to LOW (everyday exam stress, mild friendship misunderstanding, general advice)
    low_indicators = []
    if concern_type == "academic_stress":
        low_indicators.append("Manageable academic or examination stress")
    elif concern_type == "friendship_conflicts":
        low_indicators.append("Peer disagreement or friendship communication challenge")
    else:
        low_indicators.append("General school well-being and developmental support")
        
    return "low", low_indicators, False, False
