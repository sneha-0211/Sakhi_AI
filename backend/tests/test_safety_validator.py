"""Tests for safety validator and policy compliance."""
import pytest
from app.services.safety_validator import validate_response

def test_safe_content_passes():
    safe_text = "I am so sorry this is happening. You deserve to feel safe and respected. Talking to a teacher can help."
    is_safe, violations, sanitized = validate_response(safe_text, urgency_tier="low")
    assert is_safe is True
    assert len(violations) == 0
    assert sanitized == safe_text

def test_victim_blaming_rejection():
    unsafe_text = "Maybe you provoked them, or why did you dress like that? It is partly your fault."
    is_safe, violations, fallback = validate_response(unsafe_text, urgency_tier="moderate")
    assert is_safe is False
    assert len(violations) >= 2
    assert "provoked" not in fallback
    assert "not your fault" in fallback.lower()
    assert "partly your fault" not in fallback

def test_dangerous_confrontation_advice_rejection():
    unsafe_text = "You should confront him alone behind the school and hit him back hard."
    is_safe, violations, fallback = validate_response(unsafe_text, urgency_tier="high")
    assert is_safe is False
    assert any("Dangerous advice" in v for v in violations)
    assert "confront him alone" not in fallback

def test_medical_diagnosis_rejection():
    unsafe_text = "Based on what you said, you have clinical depression and should take antidepressants."
    is_safe, violations, fallback = validate_response(unsafe_text, urgency_tier="low")
    assert is_safe is False
    assert any("Medical diagnosis" in v for v in violations)
    assert "clinical depression" not in fallback

def test_false_guarantee_rejection():
    unsafe_text = "I guarantee your safety 100% and I have dispatched the police to your location."
    is_safe, violations, fallback = validate_response(unsafe_text, urgency_tier="urgent")
    assert is_safe is False
    assert any("False" in v for v in violations)
    assert "cannot dispatch" in fallback
