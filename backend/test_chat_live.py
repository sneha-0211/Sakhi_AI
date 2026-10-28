import httpx
import json

client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=20)

test_cases = [
    {
        "name": "Case 1: Classroom Teasing & Bullying",
        "message": "Some girls in my class make fun of me every day during lunch and laugh at my shoes.",
        "category_hint": "bullying",
    },
    {
        "name": "Case 2: Cyberbullying & Online Leak",
        "message": "Someone created a fake Instagram account and posted screenshots of our private chat, and people in our group are mocking me.",
        "category_hint": "cyberbullying",
    },
    {
        "name": "Case 3: Academic Pressure & Exam Anxiety",
        "message": "My board exams start in two days. I feel so overwhelmed and anxious that I can not sleep and I keep crying.",
        "category_hint": "academic_stress",
    },
    {
        "name": "Case 4: Personal Boundary & Secrecy Violation",
        "message": "An older senior boy from tuition keeps standing too close, makes weird comments about my body, and told me not to tell my parents.",
        "category_hint": "personal_boundaries",
    },
]

print("=== TESTING SAKHI AI CONVERSATION ENGINE ===\n")

for tc in test_cases:
    print(f"*** {tc['name']} ***")
    print(f"Student: \"{tc['message']}\"")
    payload = {
        "session_id": "test-session-live-01",
        "message": tc["message"],
        "category_hint": tc["category_hint"],
    }
    r = client.post("/api/chat", json=payload)
    if r.status_code == 200:
        data = r.json()
        print(f"Engine Used: {data.get('engine_mode')}")
        print(f"Concern Type: {data.get('concern_type')} | Urgency: {data.get('urgency', '').upper()}")
        print(f"SAKHI Reply:\n\"{data.get('reply')}\"")
        print(f"Observed Indicators: {data.get('indicators')}")
        print(f"Next Steps: {data.get('next_steps')}")
        print(f"Suggested Follow-up Chips: {data.get('suggested_chips')}")
        print(f"Human Support Recommended: {data.get('human_support_recommended')}")
        print(f"Clarifying Question: {data.get('clarifying_question')}")
    else:
        print(f"Error {r.status_code}: {r.text}")
    print("\n" + "=" * 60 + "\n")
