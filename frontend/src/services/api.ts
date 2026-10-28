import {
  ChatResponse,
  AssessmentResponse,
  GuidanceResponse,
  SafetyResource,
  EmergencyContact,
  HealthStatus,
  DemoScenario,
} from '../types';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
      ? 'http://127.0.0.1:8000'
      : '';
const DEFAULT_TIMEOUT_MS = 20000; // Qwen3 may take longer than rule-based

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your backend connection.', 408);
    }
    throw err;
  }
}

// ─── Streaming Chat ───────────────────────────────────────────────────────────

export interface StreamMeta {
  concern_type: string;
  urgency: string;
  indicators: string[];
  human_support_recommended: boolean;
  emergency_guidance: boolean;
  pii_redacted: boolean;
}

export interface StreamDone {
  full_reply: string;
  next_steps: string[];
  suggested_chips: string[];
  engine_mode: string;
  disclaimer: string;
}

export interface StreamCallbacks {
  /** Called once with classification metadata before any tokens arrive */
  onMeta?: (meta: StreamMeta) => void;
  /** Called for each text token as it streams in */
  onToken: (token: string) => void;
  /** Called when all tokens have arrived with final structured data */
  onDone: (done: StreamDone) => void;
  /** Called if the stream fails at any point */
  onError?: (err: Error) => void;
}

/**
 * Streams a chat response from Qwen3-8B via the /api/chat/stream SSE endpoint.
 * Returns an AbortController so the caller can cancel the stream.
 */
export function sendMessageStreaming(
  sessionId: string,
  message: string,
  callbacks: StreamCallbacks,
  categoryHint?: string,
  history?: Array<{ role: string; content: string }>,
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message,
          category_hint: categoryHint,
          context: history ? { history } : {},
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ detail: `Server error (${res.status})` }));
        throw new ApiError(errBody.detail || `Server error (${res.status})`, res.status);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new ApiError('No response body from stream endpoint.');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (raw === '[DONE]') return;

          try {
            const event = JSON.parse(raw);
            if (event.type === 'meta') {
              callbacks.onMeta?.(event as StreamMeta);
            } else if (event.type === 'token') {
              callbacks.onToken(event.token ?? '');
            } else if (event.type === 'done') {
              callbacks.onDone(event as StreamDone);
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        callbacks.onError?.(err instanceof ApiError ? err : new ApiError(err.message));
      }
    }
  })();

  return controller;
}

// ─── REST endpoints ───────────────────────────────────────────────────────────

export const api = {
  async getHealth(): Promise<HealthStatus> {
    const res = await fetchWithTimeout(`${API_BASE}/api/health`, {
      headers: { Accept: 'application/json' },
    }, 4000);
    if (!res.ok) throw new ApiError(`Health check failed (${res.status})`, res.status);
    return res.json();
  },

  async sendMessage(
    sessionId: string,
    message: string,
    categoryHint?: string,
  ): Promise<ChatResponse> {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message, category_hint: categoryHint }),
      },
      DEFAULT_TIMEOUT_MS,
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to process message' }));
      throw new ApiError(err.detail || `Server error (${res.status})`, res.status);
    }
    return res.json();
  },

  async getAssessment(
    sessionId: string,
    messages: string[],
    concernHint?: string,
  ): Promise<AssessmentResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/api/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ session_id: sessionId, messages, concern_type_hint: concernHint }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate assessment' }));
      throw new ApiError(err.detail || `Server error (${res.status})`, res.status);
    }
    return res.json();
  },

  async getGuidance(
    concernType: string,
    urgency: string,
    targetAdult: string = 'teacher',
    studentSummary?: string,
  ): Promise<GuidanceResponse> {
    const res = await fetchWithTimeout(`${API_BASE}/api/guidance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        concern_type: concernType,
        urgency,
        target_adult: targetAdult,
        student_summary: studentSummary,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to generate guidance' }));
      throw new ApiError(err.detail || `Server error (${res.status})`, res.status);
    }
    return res.json();
  },

  async getResources(query?: string, category?: string): Promise<SafetyResource[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'all') params.append('category', category);
    const url = `${API_BASE}/api/resources${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new ApiError(`Failed to fetch resources (${res.status})`, res.status);
    return res.json();
  },

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const res = await fetchWithTimeout(`${API_BASE}/api/resources/emergency`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok)
      throw new ApiError(`Failed to fetch emergency contacts (${res.status})`, res.status);
    return res.json();
  },

  async getPrivacyInfo(): Promise<any> {
    const res = await fetchWithTimeout(`${API_BASE}/api/privacy`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok)
      throw new ApiError(`Failed to fetch privacy statement (${res.status})`, res.status);
    return res.json();
  },

  async getDemoScenarios(): Promise<DemoScenario[]> {
    const res = await fetchWithTimeout(`${API_BASE}/api/scenarios`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok)
      throw new ApiError(`Failed to fetch demo scenarios (${res.status})`, res.status);
    return res.json();
  },
};
