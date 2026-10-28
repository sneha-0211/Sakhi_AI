"""Comprehensive automated tests for SAKHI AI endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Verify health endpoint returns 200 with required keys."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "SAKHI AI"
    assert "deterministic_engine_ready" in data
    assert data["privacy_mode"] == "session_ephemeral_no_db"

def test_privacy_endpoint():
    """Verify privacy statement guarantees zero DB persistence and anonymity."""
    response = client.get("/api/privacy")
    assert response.status_code == 200
    data = response.json()
    assert "data_retention_policy" in data
    assert "limits_of_confidentiality" in data
    assert "Zero conversation storage" in data["data_retention_policy"]

def test_resources_and_emergency_directory():
    """Verify safety resources and emergency contacts are populated."""
    res_resp = client.get("/api/resources")
    assert res_resp.status_code == 200
    resources = res_resp.json()
    assert len(resources) >= 5
    
    # Emergency helplines (112, 1098 must be present)
    em_resp = client.get("/api/resources/emergency")
    assert em_resp.status_code == 200
    emergency = em_resp.json()
    numbers = [e["number"] for e in emergency]
    assert "112" in numbers
    assert "1098" in numbers

def test_demo_scenarios_all_tiers():
    """Verify all 6 demo scenarios exist across urgency tiers."""
    resp = client.get("/api/scenarios")
    assert resp.status_code == 200
    scenarios = resp.json()
    assert len(scenarios) == 6
    urgencies = {s["expected_urgency"] for s in scenarios}
    assert "low" in urgencies
    assert "moderate" in urgencies
    assert "high" in urgencies
    assert "urgent" in urgencies

def test_chat_empty_and_oversized_validation():
    """Verify empty and oversized messages are rejected."""
    # Empty message
    resp_empty = client.post("/api/chat", json={"session_id": "test-1", "message": "   "})
    assert resp_empty.status_code == 422
    
    # Oversized message (>1500 chars)
    oversized_text = "a" * 1600
    resp_large = client.post("/api/chat", json={"session_id": "test-1", "message": oversized_text})
    assert resp_large.status_code in [413, 422]

def test_chat_academic_stress_low_urgency():
    """Test everyday academic stress receives LOW urgency and calming guidance."""
    payload = {
        "session_id": "test-stress",
        "message": "I have exams next week and feel overwhelmed and anxious about studying."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["urgency"] == "low"
    assert data["concern_type"] == "academic_stress"
    assert data["emergency_guidance"] is False
    assert len(data["suggested_chips"]) > 0

def test_chat_repeated_bullying_moderate_urgency():
    """Test repeated classroom teasing receives MODERATE urgency."""
    payload = {
        "session_id": "test-bullying",
        "message": "Some girls in my class make fun of me every day and laugh at my clothes."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["urgency"] == "moderate"
    assert data["concern_type"] == "bullying"
    assert data["human_support_recommended"] is True
    assert any("repeated" in ind.lower() or "frequency" in ind.lower() for ind in data["indicators"])

def test_chat_cyberbullying():
    """Test cyberbullying detection in group chat."""
    payload = {
        "session_id": "test-cyber",
        "message": "Someone made an anonymous account on Instagram and is posting mean memes about me in our class group chat."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["concern_type"] == "cyberbullying"
    assert data["urgency"] in ["moderate", "high"]
    assert "screenshot" in data["reply"].lower() or any("screenshot" in s.lower() for s in data["next_steps"])

def test_chat_threats_and_blackmail_high_urgency():
    """Test blackmail/extortion triggers HIGH urgency and anti-coercion advice."""
    payload = {
        "session_id": "test-blackmail",
        "message": "Someone sent me a message saying if I don't give them money by tomorrow they will leak fake pictures of me."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["urgency"] == "high"
    assert data["human_support_recommended"] is True
    assert "not" in data["reply"].lower()  # advising NOT to give in

def test_chat_immediate_danger_urgent():
    """Test immediate danger triggers URGENT safety alert and emergency guidance."""
    payload = {
        "session_id": "test-danger",
        "message": "Someone is trying to break into the school washroom while I'm inside and banging on the door. I am trapped."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["urgency"] == "urgent"
    assert data["emergency_guidance"] is True
    assert "112" in data["reply"] or "1098" in data["reply"]

def test_chat_false_positive_metaphor():
    """Test that metaphorical expressions like 'killing time' do NOT trigger URGENT."""
    payload = {
        "session_id": "test-metaphor",
        "message": "I'm just killing time before my exam tomorrow and feeling a bit nervous."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    # Must NOT be urgent
    assert data["urgency"] != "urgent"
    assert data["urgency"] == "low"

def test_pii_scrubbing_in_chat():
    """Verify phone numbers and emails are scrubbed from ephemeral buffers."""
    payload = {
        "session_id": "test-pii",
        "message": "Call me at 9876543210 or email test@school.edu because someone teased me."
    }
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["pii_redacted"] is True

def test_assessment_and_guidance_consistency():
    """Verify assessment and guidance endpoints yield aligned outputs."""
    assess_payload = {
        "session_id": "test-sess",
        "messages": [
            "An older boy keeps following me to the bus stop and saying weird things about my body.",
            "He asked me not to tell anyone."
        ]
    }
    assess_resp = client.post("/api/assess", json=assess_payload)
    assert assess_resp.status_code == 200
    assessment = assess_resp.json()
    assert assessment["urgency"] in ["high", "urgent"]
    assert assessment["immediate_human_support_advisable"] is True
    
    guide_payload = {
        "concern_type": assessment["concern_type"],
        "urgency": assessment["urgency"],
        "target_adult": "parent"
    }
    guide_resp = client.post("/api/guidance", json=guide_payload)
    assert guide_resp.status_code == 200
    guidance = guide_resp.json()
    assert "conversation_starter" in guidance
    assert len(guidance["what_you_can_do_next"]) > 0
    assert len(guidance["who_could_help"]) > 0
