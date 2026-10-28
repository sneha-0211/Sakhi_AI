"""Post-generation safety validator for AI responses."""
import re
from typing import Tuple, List, Optional

# Prohibited patterns in AI-generated output for minors
VICTIM_BLAMING_PATTERNS = [
    (r"\byou provoked\b", "Victim blaming: suggests student provoked the harassment"),
    (r"\bwhy did you dress\b", "Victim blaming: inappropriate comment on clothing"),
    (r"\byour fault\b", "Victim blaming: assigning blame to student"),
    (r"\byou should have known better\b", "Victim blaming: condescending assumption"),
    (r"\byou asked for it\b", "Victim blaming: blaming the victim"),
]

DANGEROUS_ADVICE_PATTERNS = [
    (r"\bconfront (him|her|them) alone\b", "Dangerous advice: advises solo confrontation"),
    (r"\bhit (him|her|them) back\b", "Dangerous advice: encourages physical retaliation"),
    (r"\bfight back physically\b", "Dangerous advice: encourages violence"),
    (r"\bmeet (him|her|them) in private\b", "Dangerous advice: suggests isolated meeting"),
    (r"\bkeep this a secret between us\b", "Dangerous advice: promises false confidentiality"),
    (r"\bdon't tell your parents\b", "Dangerous advice: discourages adult support"),
    (r"\bpay the (money|ransom)\b", "Dangerous advice: advises complying with extortion"),
    (r"\bsend the pictures\b", "Dangerous advice: advises complying with blackmail"),
]

MEDICAL_DIAGNOSIS_PATTERNS = [
    (r"\byou have (clinical depression|major depressive disorder)\b", "Medical diagnosis: clinical depression label"),
    (r"\byou suffer from (bipolar|schizophrenia|ptsd)\b", "Medical diagnosis: psychiatric diagnosis"),
    (r"\byou are diagnosed with\b", "Medical diagnosis: explicit clinical pronouncement"),
    (r"\btake (prozac|xanax|antidepressants|medication)\b", "Medical advice: prescription recommendation"),
]

FALSE_GUARANTEE_PATTERNS = [
    (r"\bi guarantee (100%|your) safety\b", "False guarantee: AI cannot guarantee absolute safety"),
    (r"\bi have dispatched (the police|an ambulance)\b", "False statement: AI cannot dispatch emergency response"),
    (r"\bpolice are on the way\b", "False statement: claiming police were dispatched"),
    (r"\bi promise no one will ever know\b", "False guarantee: impossible confidentiality promise"),
]

SAFE_FALLBACK_REPLACEMENTS = {
    "urgent": (
        "URGENT SAFETY ALERT: If you are currently in physical danger or trapped, please move to a safe, "
        "populated area immediately and call emergency services at 112 or Childline at 1098. "
        "Alert any teacher, security guard, or safe adult right now. This AI cannot dispatch help."
    ),
    "high": (
        "Your safety and bodily autonomy come first. You do not have to handle threats, unwanted touching, "
        "or coercion by yourself, and keeping this a secret is never required. Please connect with a trusted adult—"
        "such as a school counselor, parent, or trusted teacher—or call Child Helpline 1098 for confidential guidance."
    ),
    "moderate": (
        "I am so sorry you are experiencing this. No one deserves to be treated with hostility, teasing, or harassment. "
        "Please remember this is not your fault. Consider keeping records of what happened if safe to do so, "
        "and let's look at gentle ways you can speak with a trusted adult at school or home."
    ),
    "low": (
        "It is completely understandable to feel stressed or unsure in this situation. Your well-being is important. "
        "Taking small, steady steps and talking things through with someone who supports you can help ease the pressure. "
        "Would you like to explore some helpful next steps?"
    )
}

def validate_response(
    response_text: str,
    urgency_tier: str = "low"
) -> Tuple[bool, List[str], str]:
    """
    Validates a generated response against safety rules.
    Returns (is_safe, list_of_violations, sanitized_or_fallback_text).
    """
    lower = response_text.lower()
    violations: List[str] = []
    
    # Check victim blaming
    for pattern, reason in VICTIM_BLAMING_PATTERNS:
        if re.search(pattern, lower):
            violations.append(reason)
            
    # Check dangerous advice
    for pattern, reason in DANGEROUS_ADVICE_PATTERNS:
        if re.search(pattern, lower):
            violations.append(reason)
            
    # Check medical diagnosis
    for pattern, reason in MEDICAL_DIAGNOSIS_PATTERNS:
        if re.search(pattern, lower):
            violations.append(reason)
            
    # Check false guarantees
    for pattern, reason in FALSE_GUARANTEE_PATTERNS:
        if re.search(pattern, lower):
            violations.append(reason)

    if violations:
        # Unsafe content detected - replace with pre-validated safe fallback
        fallback = SAFE_FALLBACK_REPLACEMENTS.get(urgency_tier, SAFE_FALLBACK_REPLACEMENTS["low"])
        return False, violations, fallback
        
    return True, [], response_text
