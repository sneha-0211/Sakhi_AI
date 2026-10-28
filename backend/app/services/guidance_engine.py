"""Generates structured, personalized, age-appropriate safety guidance."""
from typing import Dict, Any, List, Optional
from app.schemas.guidance import AdultOption, GuidanceResponse

DEFAULT_ADULTS: List[AdultOption] = [
    AdultOption(
        role="School Counselor",
        why_consider="Trained in listening without judgment and familiar with school policies on student well-being.",
        good_for="Bullying, social anxiety, emotional distress, or when you are hesitant to involve family first."
    ),
    AdultOption(
        role="Trusted Teacher",
        why_consider="Present on campus and capable of observing classroom dynamics and hallway safety directly.",
        good_for="Classroom teasing, academic pressure, or unfair group project dynamics."
    ),
    AdultOption(
        role="Parent or Guardian",
        why_consider="Has legal authority and protective responsibility to advocate for you with the school.",
        good_for="Threats, personal safety concerns, transit issues, or recurring emotional distress."
    ),
    AdultOption(
        role="Designated Child Safety Officer / Principal",
        why_consider="Has formal authority to initiate anti-bullying protocols and official interventions.",
        good_for="Serious harassment, cyber threats, or when previous classroom attempts failed."
    ),
    AdultOption(
        role="Older Sibling or Relative",
        why_consider="Someone closer in age who can accompany you when speaking to parents or school authorities.",
        good_for="Practicing what to say and having an ally beside you."
    )
]

def generate_conversation_starter(concern_type: str, urgency: str, target_adult: str) -> str:
    target_clean = target_adult.lower()
    
    if urgency == "urgent":
        return (
            "I need urgent help right now. I am in a situation that is not safe, and I need you to step in "
            "immediately. Please stay on the line with me or come to where I am."
        )
        
    if concern_type in ["personal_boundaries", "threats_and_coercion"] or urgency == "high":
        return (
            f"I have something very important to tell you. Someone has been doing and saying things that make me "
            f"feel uncomfortable and unsafe, and they told me not to tell anyone. I need your help to protect my "
            f"safety, and I need to talk to you in private."
        )
        
    if concern_type in ["bullying", "cyberbullying"] or urgency == "moderate":
        return (
            f"I need your advice about something happening at school. A few students have been repeatedly making "
            f"fun of me and targeting me, and it is making it hard for me to focus and feel comfortable. "
            f"Could you help me figure out the best way to handle this without escalating it?"
        )
        
    if concern_type == "academic_stress":
        return (
            f"I really care about my studies, but the pressure and workload have been feeling overwhelming lately, "
            f"and it's causing me a lot of anxiety and trouble sleeping. Could we sit down and talk about how to "
            f"pace things better so I don't feel so burned out?"
        )
        
    # Default gentle starter
    return (
        f"I have something on my mind that has been bothering me lately. Could you spare ten minutes to listen "
        f"to me privately? I value your advice and could really use your guidance right now."
    )

def generate_guidance(
    concern_type: str,
    urgency: str,
    target_adult: str = "teacher",
    student_summary: Optional[str] = None
) -> GuidanceResponse:
    """Produces the structured 5-part personalized guidance plan."""
    
    # 1. What we understood
    summaries = {
        "academic_stress": "You are experiencing high stress and anxiety related to school expectations, tests, or academic workload.",
        "bullying": "You are facing repeated teasing, social exclusion, or hostile peer treatment at school.",
        "cyberbullying": "You are dealing with unwanted, hurtful digital messages, posts, or group chat dynamics.",
        "personal_boundaries": "Someone has crossed your personal boundaries, made inappropriate comments, or made you feel unsafe.",
        "threats_and_coercion": "You have received coercive demands, threats, or blackmail designed to pressure you.",
        "immediate_danger": "You are in an acute situation where physical safety is compromised or actively threatened.",
        "emotional_distress": "You are feeling emotionally overwhelmed, anxious, or lonely and in need of compassionate support.",
        "friendship_conflicts": "You are navigating a difficult disagreement or painful dynamic within your friend circle."
    }
    what_understood = student_summary or summaries.get(
        concern_type,
        "You are dealing with a difficult situation and seeking safe, thoughtful guidance."
    )
    
    # 2. What you can do next
    action_plans = {
        "urgent": [
            "Move immediately to a well-lit, populated area with teachers or security guards.",
            "Alert a safe adult nearby right now or dial emergency services at 112 / Childline at 1098.",
            "Keep doors securely locked if you cannot safely leave your current spot."
        ],
        "high": [
            "Do not comply with demands, extortion, or secrecy requests from anyone threatening you.",
            "Safely preserve screenshots, dates, and names in a secure place without altering them.",
            "Do not walk or travel alone in areas where this person approaches you.",
            "Share this situation with a trusted adult today so an adult authority can take protective action."
        ],
        "moderate": [
            "Quietly keep a brief note of dates, times, and what happened if it is safe to do so.",
            "Avoid retaliating or arguing back, which can escalate the situation or cause unfair blame.",
            "Stay close to friends or safe areas during breaks and lunches.",
            "Choose a trusted adult from the list below to discuss school intervention."
        ],
        "low": [
            "Take short, structured pauses with deep breathing (4 seconds in, 4 hold, 6 out).",
            "Break overwhelming tasks or study periods into 25-minute manageable chunks.",
            "Remember that your human worth is not defined by test marks or peer opinions.",
            "Discuss how you are feeling with someone who makes you feel heard."
        ]
    }
    what_next = action_plans.get(urgency, action_plans["moderate"])
    
    # 3. Conversation starter
    starter = generate_conversation_starter(concern_type, urgency, target_adult)
    
    # 4. If situation gets worse
    worsening_steps = [
        "If you ever feel in immediate danger, dial 112 or Childline 1098 immediately.",
        "If the first adult you approach does not take action, do not stop—approach a counselor, principal, or another guardian.",
        "Keep adding to your notes or screenshots if any new incident occurs.",
        "Remember that you have the right to request a private meeting or bring a friend or sibling with you."
    ]
    
    safe_note = (
        "Important: You are never obligated to approach an adult who makes you feel unsafe. "
        "Choose an adult YOU feel comfortable with, and you never have to face this completely alone."
    )
    
    return GuidanceResponse(
        what_we_understood=what_understood,
        what_you_can_do_next=what_next,
        who_could_help=DEFAULT_ADULTS,
        conversation_starter=starter,
        if_situation_worsens=worsening_steps,
        safe_boundaries_note=safe_note
    )
