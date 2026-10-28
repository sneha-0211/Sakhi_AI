"""Security, sanitization, and PII scrubbing module."""
import re
from typing import Tuple

# Patterns to detect and scrub potential PII from ephemeral buffers
PHONE_PATTERN = re.compile(r"(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d]{3}[-.\s]?[\d]{4}")
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
STUDENT_ID_PATTERN = re.compile(r"\b(id|roll|reg|student|uid)[\s:#_-]*([a-zA-Z0-9]{4,12})\b", re.IGNORECASE)

def scrub_pii(text: str) -> Tuple[str, bool]:
    """
    Scrub explicit PII (phone numbers, emails, student IDs) from user input.
    Returns (scrubbed_text, pii_detected_bool).
    """
    scrubbed = text
    detected = False
    
    if PHONE_PATTERN.search(scrubbed):
        scrubbed = PHONE_PATTERN.sub("[PHONE_NUMBER_REDACTED]", scrubbed)
        detected = True
        
    if EMAIL_PATTERN.search(scrubbed):
        scrubbed = EMAIL_PATTERN.sub("[EMAIL_REDACTED]", scrubbed)
        detected = True
        
    if STUDENT_ID_PATTERN.search(scrubbed):
        scrubbed = STUDENT_ID_PATTERN.sub("[STUDENT_ID_REDACTED]", scrubbed)
        detected = True
        
    return scrubbed, detected

def sanitize_input(text: str, max_length: int = 1500) -> str:
    """Normalize input text, strip dangerous control characters, and clamp length."""
    if not text:
        return ""
    # Strip dangerous non-printable chars except common whitespace
    cleaned = "".join(ch for ch in text if ch.isprintable() or ch in "\n\r\t ")
    cleaned = cleaned.strip()
    return cleaned[:max_length]
