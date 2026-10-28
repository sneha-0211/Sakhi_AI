import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiError } from '../services/api';

describe('Frontend API Client Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches backend health status', async () => {
    const mockHealth = {
      status: 'healthy',
      service: 'SAKHI AI',
      version: '1.0.0',
      engine_mode: 'rule_based',
      deterministic_engine_ready: true,
      privacy_mode: 'session_ephemeral_no_db',
      strict_safety_filter: true
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHealth
    }));

    const health = await api.getHealth();
    expect(health.status).toBe('healthy');
    expect(health.service).toBe('SAKHI AI');
    expect(health.privacy_mode).toBe('session_ephemeral_no_db');
  });

  it('correctly dispatches chat messages and receives structured safety payload', async () => {
    const mockResponse = {
      reply: "I am sorry you are experiencing teasing.",
      concern_type: "bullying",
      urgency: "moderate",
      indicators: ["Repeated daily occurrence"],
      next_steps: ["Record dates and times safely"],
      suggested_chips: ["Tell a trusted teacher", "Skip this question"],
      human_support_recommended: true,
      emergency_guidance: false,
      clarifying_question: null,
      disclaimer: "Guidance only",
      engine_mode: "rule_based",
      pii_redacted: false
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    }));

    const res = await api.sendMessage('sess-123', 'Some girls tease me every day');
    expect(res.concern_type).toBe('bullying');
    expect(res.urgency).toBe('moderate');
    expect(res.human_support_recommended).toBe(true);
    expect(res.suggested_chips).toContain('Skip this question');
  });

  it('properly throws ApiError with status when backend returns HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ detail: 'Message cannot be empty.' })
    }));

    await expect(api.sendMessage('sess-123', '   ')).rejects.toThrow(ApiError);
  });

  it('retrieves emergency contact helplines including 112 and 1098', async () => {
    const mockContacts = [
      { id: '112', name: 'Emergency', number: '112', category: 'Police' },
      { id: '1098', name: 'Childline', number: '1098', category: 'Child Protection' }
    ];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockContacts
    }));

    const contacts = await api.getEmergencyContacts();
    expect(contacts.length).toBe(2);
    expect(contacts.some(c => c.number === '112')).toBe(true);
    expect(contacts.some(c => c.number === '1098')).toBe(true);
  });
});
