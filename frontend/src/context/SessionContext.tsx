import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ChatMessage, AssessmentResponse, UrgencyTier } from '../types';

interface SessionContextType {
  sessionId: string;
  messages: ChatMessage[];
  latestAssessment: AssessmentResponse | null;
  latestUrgency: UrgencyTier | null;
  latestConcern: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  addMessage: (msg: ChatMessage) => void;
  /** Partially update an existing message by ID (used for live streaming updates) */
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setSessionAssessment: (assessment: AssessmentResponse) => void;
  setLatestUrgencyAndConcern: (urgency: UrgencyTier, concern: string) => void;
  clearSession: () => void;
  hasActiveSession: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Generate random ephemeral session token — NOT saved to localStorage
  const [sessionId, setSessionId] = useState<string>(
    () => 'sess-' + Math.random().toString(36).substring(2, 10),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResponse | null>(null);
  const [latestUrgency, setLatestUrgency] = useState<UrgencyTier | null>(null);
  const [latestConcern, setLatestConcern] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
    if (msg.urgency) setLatestUrgency(msg.urgency);
    if (msg.concern_type) setLatestConcern(msg.concern_type);
  }, []);

  /** Update fields of an existing message (e.g. append streaming tokens) */
  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        return updated;
      }),
    );
    // Sync global urgency/concern as they arrive
    if (updates.urgency) setLatestUrgency(updates.urgency);
    if (updates.concern_type) setLatestConcern(updates.concern_type);
  }, []);

  const setSessionAssessment = useCallback((assessment: AssessmentResponse) => {
    setLatestAssessment(assessment);
    setLatestUrgency(assessment.urgency);
    setLatestConcern(assessment.concern_type);
  }, []);

  const setLatestUrgencyAndConcern = useCallback((urgency: UrgencyTier, concern: string) => {
    setLatestUrgency(urgency);
    setLatestConcern(concern);
  }, []);

  const clearSession = useCallback(() => {
    setMessages([]);
    setLatestAssessment(null);
    setLatestUrgency(null);
    setLatestConcern(null);
    setSelectedCategory(null);
    // Generate new ephemeral session token
    setSessionId('sess-' + Math.random().toString(36).substring(2, 10));
  }, []);

  const hasActiveSession = messages.length > 1 || latestAssessment !== null;

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        messages,
        latestAssessment,
        latestUrgency,
        latestConcern,
        selectedCategory,
        setSelectedCategory,
        addMessage,
        updateMessage,
        setSessionAssessment,
        setLatestUrgencyAndConcern,
        clearSession,
        hasActiveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
