export type UrgencyTier = 'low' | 'moderate' | 'high' | 'urgent';

export interface ChatMessage {
  id: string;
  sender: 'student' | 'sakhi';
  text: string;
  timestamp: string;
  urgency?: UrgencyTier;
  concern_type?: string;
  indicators?: string[];
  next_steps?: string[];
  chips?: string[];
  clarifying_question?: string | null;
  human_support_recommended?: boolean;
  emergency_guidance?: boolean;
  pii_redacted?: boolean;
  /** true while the message is being streamed from Qwen3 */
  is_streaming?: boolean;
  engine_mode?: string;
}

export interface ChatResponse {
  reply: string;
  concern_type: string;
  urgency: UrgencyTier;
  indicators: string[];
  next_steps: string[];
  suggested_chips: string[];
  human_support_recommended: boolean;
  emergency_guidance: boolean;
  clarifying_question: string | null;
  disclaimer: string;
  engine_mode: string;
  pii_redacted: boolean;
}

export interface AssessmentResponse {
  concern_type: string;
  neutral_summary: string;
  urgency: UrgencyTier;
  indicators: string[];
  recommended_next_steps: string[];
  immediate_human_support_advisable: boolean;
  relevant_resource_ids: string[];
  confidence_note: string;
  disclaimer: string;
}

export interface AdultOption {
  role: string;
  why_consider: string;
  good_for: string;
}

export interface GuidanceResponse {
  what_we_understood: string;
  what_you_can_do_next: string[];
  who_could_help: AdultOption[];
  conversation_starter: string;
  if_situation_worsens: string[];
  safe_boundaries_note: string;
}

export interface SafetyResource {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  actionable_tips: string[];
  tags: string[];
  urgency_relevance: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description: string;
  category: string;
  official_portal?: string;
  availability: string;
  verification_status: string;
  disclaimer: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  expected_urgency: UrgencyTier;
  concern_type: string;
  initial_message: string;
  sample_dialogue: { sender: string; text: string }[];
  tags: string[];
  learning_takeaway: string;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  engine_mode: string;
  llm_ready: boolean;
  llm_model: string | null;
  deterministic_safety_layer: boolean;
  privacy_mode: string;
  strict_safety_filter: boolean;
}
