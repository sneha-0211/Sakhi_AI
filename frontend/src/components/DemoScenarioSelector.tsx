import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DemoScenario } from '../types';
import { UrgencyBadge } from './UrgencyBadge';
import { FlaskConical, Play, ClipboardCheck, ArrowRight, Sparkles } from 'lucide-react';

export const DemoScenarioSelector: React.FC = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getDemoScenarios()
      .then((data) => {
        if (isMounted) {
          setScenarios(data);
          setActiveScenario(data[0] || null);
        }
      })
      .catch((err) => {
        console.warn('API error fetching scenarios in selector:', err);
      });
    return () => { isMounted = false; };
  }, []);

  const handleLaunchInChat = (scenario: DemoScenario) => {
    navigate(`/chat?category=${scenario.concern_type}`);
  };

  const handleViewAssessment = (scenario: DemoScenario) => {
    navigate(`/assessment?concern=${scenario.concern_type}&urgency=${scenario.expected_urgency}`);
  };

  if (scenarios.length === 0) return null;

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sakhi-lavender-100 text-sakhi-lavender-800 text-[11px] font-bold uppercase mb-1">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Judge & Evaluator Demonstration Mode</span>
          </div>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg">
            Try a Fictional Demo Scenario
          </h2>
          <p className="text-xs text-slate-500">
            Select a case to observe real deterministic reasoning across all four urgency levels.
          </p>
        </div>

        <button
          onClick={() => navigate('/scenarios')}
          className="text-xs font-semibold text-sakhi-lavender-700 hover:text-sakhi-lavender-800 self-start sm:self-auto"
        >
          View Full Evaluation Suite →
        </button>
      </div>

      {/* Tabs for the 6 scenarios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {scenarios.map((sc, i) => {
          const isSelected = activeScenario?.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-sakhi-lavender-600 text-white border-sakhi-lavender-700 shadow-2xs font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase block ${isSelected ? 'text-sakhi-lavender-200' : 'text-slate-400'}`}>
                Case {i + 1}
              </span>
              <span className="text-xs font-medium line-clamp-1 leading-snug">
                {sc.title}
              </span>
              <span className={`text-[9px] uppercase font-bold mt-1 inline-block px-1.5 py-0.2 rounded ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sc.expected_urgency}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Preview Card */}
      {activeScenario && (
        <div className="p-4 sm:p-5 rounded-2xl bg-sakhi-lavender-50/50 border border-sakhi-lavender-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md uppercase mr-2">
                FICTIONAL DEMO
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {activeScenario.title}
              </span>
            </div>
            <UrgencyBadge urgency={activeScenario.expected_urgency} size="sm" />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {activeScenario.description}
          </p>

          <div className="p-3 rounded-xl bg-white border border-sakhi-lavender-100 text-xs text-slate-700 italic">
            "{activeScenario.initial_message}"
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleLaunchInChat(activeScenario)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-xs shadow-2xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch Live in Chat</span>
            </button>

            <button
              onClick={() => handleViewAssessment(activeScenario)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-sakhi-teal-600" />
              <span>Inspect Real Assessment</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
