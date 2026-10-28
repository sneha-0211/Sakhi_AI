import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { DemoScenario, UrgencyTier } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  FlaskConical,
  Play,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export const DemoScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getDemoScenarios()
      .then((data) => {
        if (isMounted) {
          setScenarios(data);
          setActiveScenario(data[0] || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('API scenarios fetch failed, fallback active:', err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleLaunchInChat = (scenario: DemoScenario) => {
    // Navigate to chat with initial prompt
    navigate(`/chat?category=${scenario.concern_type}`);
  };

  const handleViewAssessment = (scenario: DemoScenario) => {
    navigate(`/assessment?concern=${scenario.concern_type}&urgency=${scenario.expected_urgency}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakhi-lavender-100 text-sakhi-lavender-900 text-xs font-semibold mb-2">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Competition Evaluation Suite</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
          Judge Demonstration & Fictional Scenarios
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          Test all four urgency categories (LOW, MODERATE, HIGH, URGENT) using standardized, ethical fictional cases.
          Observe how the deterministic reasoning engine adapts empathetic responses, indicators, and safety escalation.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {scenarios.map((sc, idx) => {
          const isSelected = activeScenario?.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-sakhi-lavender-600 text-white border-sakhi-lavender-700 shadow-soft font-bold'
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                  isSelected ? 'text-sakhi-lavender-100' : 'text-slate-400'
                }`}>
                  Case {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold line-clamp-2 leading-snug">
                  {sc.title}
                </span>
              </div>

              <div className="mt-3">
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {sc.expected_urgency}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Deep-Dive Panel */}
      {activeScenario && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-6">
          
          {/* Header of Active Scenario */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  FICTIONAL DEMO
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  Domain: {activeScenario.concern_type.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeScenario.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {activeScenario.description}
              </p>
            </div>

            <UrgencyBadge urgency={activeScenario.expected_urgency} size="lg" showDescription />
          </div>

          {/* Sample Dialogue Progression */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sakhi-lavender-600" />
              <span>Standard Fictional Dialogue Trajectory:</span>
            </h3>

            <div className="space-y-3 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/70">
              {activeScenario.sample_dialogue.map((turn, i) => {
                const isStudent = turn.sender === 'student';
                return (
                  <div key={i} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}>
                    <div className="text-[11px] font-bold text-slate-400 mb-1 px-1">
                      {isStudent ? 'Student (Fictional)' : 'SAKHI AI'}
                    </div>
                    <div className={`max-w-[90%] sm:max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isStudent
                        ? 'bg-sakhi-lavender-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}>
                      {turn.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reasoning & Learning Takeaway */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sakhi-teal-50/60 border border-sakhi-teal-100 space-y-1.5">
            <h4 className="font-bold text-sakhi-teal-900 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sakhi-teal-600" />
              <span>Architectural Takeaway for Evaluators:</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeScenario.learning_takeaway}
            </p>
          </div>

          {/* Interactive Launch Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleLaunchInChat(activeScenario)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-xs sm:text-sm shadow-soft transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Test Live in Interactive Chat</span>
            </button>

            <button
              onClick={() => handleViewAssessment(activeScenario)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 shadow-2xs"
            >
              <ClipboardCheck className="w-4 h-4 text-sakhi-teal-600" />
              <span>Inspect Assessment & Next Steps</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
