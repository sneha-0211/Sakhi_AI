import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { sendMessageStreaming, StreamMeta, StreamDone } from '../services/api';
import { api } from '../services/api';
import { useSession } from '../context/SessionContext';
import { ChatMessage, UrgencyTier } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  Send,
  Trash2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  ClipboardList,
  SkipForward,
  Info,
  ArrowLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

const CATEGORY_OPENINGS: Record<string, { greeting: string; chips: string[] }> = {
  friendship_conflicts: {
    greeting:
      "Friendships can be really tough when conflicts happen or people change. You deserve respect and space to share your feelings. What has been happening between you and your friends?",
    chips: [
      'A friend stopped talking to me completely',
      'People are spreading rumors about me',
      'I was excluded from group plans',
      'Skip this question',
    ],
  },
  bullying: {
    greeting:
      "I'm really sorry you're dealing with this. Being mocked, teased, or pushed around hurts deeply, and it is never your fault. Can you tell me a bit about what has been happening?",
    chips: [
      'Classmates tease me during lunch',
      'People laugh at my appearance or clothes',
      "Someone pushes me around when teachers aren't looking",
      'Skip this question',
    ],
  },
  cyberbullying: {
    greeting:
      'Online cruelty can feel inescapable because it follows you everywhere, but you are not alone. What happened on social media, WhatsApp, or group chats?',
    chips: [
      'Mean memes or pictures were shared in a group',
      'An anonymous account is targeting me',
      'Someone threatened to leak my private chats',
      'Skip this question',
    ],
  },
  academic_stress: {
    greeting:
      "School pressure and exam anxiety can feel crushing, but remember: exam marks do not define your human worth or intelligence. What has been stressing you out most?",
    chips: [
      "I can't sleep because of board exams",
      'Heavy homework and tuition pressure',
      "I'm terrified of failing and disappointing parents",
      'Skip this question',
    ],
  },
  personal_boundaries: {
    greeting:
      "Your body, personal space, and boundaries belong 100% to you. Nobody has the right to touch you inappropriately, make sexual comments, or tell you to keep secrets. What happened?",
    chips: [
      'Someone stands uncomfortably close and stares',
      'An older person made uncomfortable comments about my body',
      'Someone asked me to keep a secret that feels wrong',
      'Skip this question',
    ],
  },
  emotional_distress: {
    greeting:
      "It takes bravery to reach out when you feel overwhelmed, anxious, or lonely. Whatever you are feeling right now is valid, and you don't have to carry it all by yourself. How are you feeling today?",
    chips: [
      'I feel like crying all the time',
      'I have sudden panic attacks at school',
      'I feel completely isolated and lonely',
      'Skip this question',
    ],
  },
  general_support: {
    greeting:
      "Hello! I'm SAKHI, your private school safety companion powered by Qwen3 AI. You can describe any problem in your own words — no real name needed. How can I help you today?",
    chips: [
      'Someone is teasing me at school',
      'I am overwhelmed by exam anxiety',
      'Someone made me uncomfortable with unwanted touching',
      'I just want to explore safety tips',
    ],
  },
};

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category') || undefined;

  const {
    sessionId,
    messages,
    addMessage,
    updateMessage,
    clearSession,
    latestUrgency,
    latestConcern,
    setLatestUrgencyAndConcern,
    setSessionAssessment,
  } = useSession();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [piiAlert, setPiiAlert] = useState<boolean>(false);
  const [activeChips, setActiveChips] = useState<string[]>([]);

  // Track ongoing stream controller for cancellation
  const streamControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize opening message
  useEffect(() => {
    if (messages.length === 0) {
      const catConfig =
        categoryParam && CATEGORY_OPENINGS[categoryParam]
          ? CATEGORY_OPENINGS[categoryParam]
          : CATEGORY_OPENINGS.general_support;

      const initialGreeting: ChatMessage = {
        id: 'msg-welcome-' + Date.now(),
        sender: 'sakhi',
        text: catConfig.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: catConfig.chips,
      };

      addMessage(initialGreeting);
      setActiveChips(catConfig.chips);
    } else {
      const lastSakhi = [...messages].reverse().find((m) => m.sender === 'sakhi');
      if (lastSakhi?.chips && lastSakhi.chips.length > 0) {
        setActiveChips(lastSakhi.chips);
      }
    }
  }, [categoryParam, messages.length, addMessage]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend || inputValue).trim();
      if (!text || isTyping) return;

      setErrorBanner(null);
      setPiiAlert(false);

      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'student',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      addMessage(userMessage);
      setInputValue('');
      setIsTyping(true);
      setActiveChips([]);

      // Create a placeholder streaming message
      const streamingMsgId = 'msg-sakhi-' + Date.now();
      const streamingMsg: ChatMessage = {
        id: streamingMsgId,
        sender: 'sakhi',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_streaming: true,
      };
      addMessage(streamingMsg);

      // Build conversation history for context (last 6 turns)
      const history = messages
        .slice(-6)
        .filter((m) => !m.is_streaming)
        .map((m) => ({
          role: m.sender === 'student' ? 'user' : 'assistant',
          content: m.text,
        }));

      let accumulatedText = '';
      let metaData: StreamMeta | null = null;

      const controller = sendMessageStreaming(
        sessionId,
        text,
        {
          onMeta: (meta) => {
            metaData = meta;
            // Update streaming message with urgency/concern as soon as we know
            updateMessage(streamingMsgId, {
              urgency: meta.urgency as UrgencyTier,
              concern_type: meta.concern_type,
              indicators: meta.indicators,
              human_support_recommended: meta.human_support_recommended,
              emergency_guidance: meta.emergency_guidance,
              pii_redacted: meta.pii_redacted,
            });

            if (meta.pii_redacted) setPiiAlert(true);
            setLatestUrgencyAndConcern(meta.urgency as UrgencyTier, meta.concern_type);
          },

          onToken: (token) => {
            accumulatedText += token;
            updateMessage(streamingMsgId, { text: accumulatedText });
          },

          onDone: (done) => {
            // Final update: replace streaming text with validated reply + metadata
            updateMessage(streamingMsgId, {
              text: done.full_reply,
              is_streaming: false,
              next_steps: done.next_steps,
              chips: done.suggested_chips,
              engine_mode: done.engine_mode,
            });
            setActiveChips(done.suggested_chips || []);
            setIsTyping(false);

            // Update assessment cache
            if (metaData) {
              api
                .getAssessment(sessionId, [text], metaData.concern_type)
                .then((ass) => setSessionAssessment(ass))
                .catch(() => {});
            }

            setTimeout(() => inputRef.current?.focus(), 100);
          },

          onError: (err) => {
            console.warn('Stream error:', err);
            // Show a meaningful error in the streaming placeholder instead of hardcoded fallback
            updateMessage(streamingMsgId, {
              text:
                "I'm here with you. I'm having trouble connecting to the AI right now. " +
                'Please check that the backend is running and your HF_TOKEN is set in backend/.env, then try again.',
              is_streaming: false,
              urgency: 'low',
              chips: ['Try again', 'Show me safety resources', 'Help me talk to a trusted adult'],
            });
            setActiveChips(['Try again', 'Show me safety resources', 'Help me talk to a trusted adult']);
            setErrorBanner(
              err.message.includes('HF_TOKEN')
                ? '⚠️ HF_TOKEN not configured. Set it in backend/.env and restart the server.'
                : `Connection error: ${err.message}`,
            );
            setIsTyping(false);
            setTimeout(() => inputRef.current?.focus(), 100);
          },
        },
        categoryParam,
        history,
      );

      streamControllerRef.current = controller;
    },
    [
      inputValue,
      isTyping,
      sessionId,
      messages,
      addMessage,
      updateMessage,
      categoryParam,
      setLatestUrgencyAndConcern,
      setSessionAssessment,
    ],
  );

  const handleClearChat = () => {
    if (
      window.confirm(
        'Clear all conversation messages? Your current chat will be erased from memory immediately.',
      )
    ) {
      // Cancel any in-flight stream
      streamControllerRef.current?.abort();
      clearSession();
      setErrorBanner(null);
      setPiiAlert(false);
      setActiveChips([]);
    }
  };

  const handleSkipQuestion = () => {
    handleSendMessage("I'd prefer to skip this question and see what next steps you recommend.");
  };

  const userMessagesCount = messages.filter((m) => m.sender === 'student').length;

  // Urgency border color for SAKHI messages
  const urgencyBorder = (urgency?: string) => {
    switch (urgency) {
      case 'urgent':   return 'border-l-4 border-rose-500';
      case 'high':     return 'border-l-4 border-orange-400';
      case 'moderate': return 'border-l-4 border-amber-400';
      case 'low':      return 'border-l-4 border-emerald-400';
      default:         return 'border-l-4 border-sakhi-lavender-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 flex flex-col h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">

      {/* Top Header Bar — gradient-enhanced */}
      <div className="bg-gradient-to-r from-white to-sakhi-lavender-50/60 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 mb-2.5 flex items-center justify-between border border-sakhi-lavender-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/')}
            title="Back to Dashboard"
            className="p-1.5 rounded-xl text-slate-500 hover:text-sakhi-lavender-700 hover:bg-sakhi-lavender-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl highlight-lavender flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-slate-900 text-xs sm:text-sm">
                Conversation with SAKHI
              </h1>
              {categoryParam && (
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sakhi-teal-50 text-sakhi-teal-700 border border-sakhi-teal-200">
                  {categoryParam.replace(/_/g, ' ')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Zap className="w-3 h-3 text-amber-400" />
              Qwen3-8B · Anonymous · Zero storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userMessagesCount >= 1 && (
            <Link
              to={`/assessment?concern=${latestConcern || 'general_support'}&urgency=${latestUrgency || 'low'}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sakhi-lavender-100 to-sakhi-lavender-50 hover:from-sakhi-lavender-200 hover:to-sakhi-lavender-100 text-sakhi-lavender-900 text-xs font-bold border border-sakhi-lavender-200 shadow-sm transition-all hover:shadow-md"
            >
              <ClipboardList className="w-3.5 h-3.5 text-sakhi-lavender-600" />
              <span className="hidden sm:inline">Assessment</span>
              <span className="sm:hidden">Report</span>
            </Link>
          )}

          <button
            onClick={handleClearChat}
            title="Erase conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/emergency"
            title="Emergency: 112 / 1098"
            className="sos-btn p-2 rounded-xl highlight-emergency shadow-sm transition-all hover:scale-105"
          >
            <PhoneCall className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* PII alert */}
      {piiAlert && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-700" />
          <span>
            Privacy Notice: Phone number or student ID detected and automatically scrubbed. Remember
            not to share real names or contact details.
          </span>
        </div>
      )}

      {/* Error banner */}
      {errorBanner && (
        <div className="mb-2 p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{errorBanner}</span>
          <button
            onClick={() => setErrorBanner(null)}
            className="text-rose-400 hover:text-rose-600 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2 sm:px-2 rounded-2xl no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 sm:py-3.5 text-sm sm:text-base leading-relaxed transition-all ${
                  isUser
                    ? 'glass-bubble-user rounded-br-sm'
                    : `glass-bubble-sakhi text-slate-800 rounded-bl-sm ${urgencyBorder(msg.urgency)}`
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-sakhi-lavender-100">
                    <span className="font-bold text-xs text-sakhi-lavender-700 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-sakhi-lavender-100 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-sakhi-lavender-600" />
                      </div>
                      SAKHI AI
                      {msg.engine_mode && msg.engine_mode !== 'rule_based' && (
                        <span className="text-[9px] bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                          ⚡ Qwen3
                        </span>
                      )}
                    </span>
                    {msg.urgency && <UrgencyBadge urgency={msg.urgency} size="sm" />}
                  </div>
                )}

                {/* Message text with improved streaming cursor */}
                <p className="whitespace-pre-wrap">
                  {msg.text}
                  {msg.is_streaming && (
                    <span className="streaming-cursor" />
                  )}
                </p>

                {/* Next steps — color-highlighted */}
                {!msg.is_streaming && msg.next_steps && msg.next_steps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-sakhi-lavender-100 text-xs space-y-1.5">
                    <span className="font-bold text-sakhi-lavender-700 flex items-center gap-1 mb-2">
                      <Sparkles className="w-3 h-3" />
                      Suggested Safe Steps:
                    </span>
                    {msg.next_steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100">
                        <span className="w-4 h-4 rounded-full bg-sakhi-teal-500 text-white font-bold text-[9px] flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                        <span className="text-slate-700 leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Emergency callout — high visibility */}
                {msg.emergency_guidance && (
                  <div className="mt-3 p-3 rounded-xl highlight-emergency text-white text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5" />
                      Emergency: <strong>112</strong> · <strong>1098</strong>
                    </span>
                    <Link to="/emergency" className="underline font-bold text-white/90 hover:text-white">
                      Full Directory →
                    </Link>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && messages[messages.length - 1]?.text === '' && (
          <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl glass-bubble-sakhi w-24">
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-sakhi-lavender-400 animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick-reply chips — vibrant highlight style */}
      {activeChips.length > 0 && !isTyping && (
        <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-sakhi-lavender-500 flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          {activeChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="chip-btn text-xs bg-white text-slate-700 px-3.5 py-1.5 rounded-full border border-sakhi-lavender-200 flex-shrink-0 shadow-sm font-medium"
            >
              {chip}
            </button>
          ))}
          <button
            onClick={handleSkipQuestion}
            className="chip-btn text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full border border-slate-200 flex-shrink-0 flex items-center gap-1"
          >
            <SkipForward className="w-3 h-3" />
            <span>Skip</span>
          </button>
        </div>
      )}

      {/* Input area — glowing send button */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type what happened in your own words… (no real name needed)"
            maxLength={1500}
            disabled={isTyping}
            className="sakhi-input w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-sakhi-lavender-200 shadow-sm text-sm sm:text-base text-slate-800 placeholder-slate-400 pr-14 disabled:opacity-60 transition-all"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-2 p-2.5 sm:p-3 rounded-xl transition-all duration-200 active:scale-90 ${
              inputValue.trim() && !isTyping
                ? 'highlight-lavender hover:scale-105'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>

        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sakhi-teal-600" />
            Session-only memory · Do not share passwords or addresses
          </span>

          {userMessagesCount >= 1 && (
            <Link
              to={`/assessment?concern=${latestConcern || 'general_support'}&urgency=${latestUrgency || 'low'}`}
              className="text-sakhi-lavender-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View Assessment</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
