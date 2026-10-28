import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { GuidanceResponse, UrgencyTier } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  Sparkles,
  Users,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

export const GuidancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const concernParam = searchParams.get('concern') || 'bullying';
  const urgencyParam = (searchParams.get('urgency') as UrgencyTier) || 'moderate';

  const [selectedAdult, setSelectedAdult] = useState<'teacher' | 'parent' | 'counsellor' | 'sibling'>('teacher');
  const [guidance, setGuidance] = useState<GuidanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getGuidance(concernParam, urgencyParam, selectedAdult)
      .then((data) => {
        if (isMounted) {
          setGuidance(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('API error fetching guidance, client fallback used:', err);
        if (isMounted) {
          setGuidance({
            what_we_understood: `You are facing an issue with ${concernParam.replace(/_/g, ' ')}, and want clear, practical next steps.`,
            what_you_can_do_next: [
              "Preserve records or screenshots in a safe location if safe to do so",
              "Avoid confronting the person alone in isolated spaces",
              "Have an ally or trusted friend sit with you during lunch or breaks"
            ],
            who_could_help: [
              {
                role: "School Counselor",
                why_consider: "Trained in listening without judgment and familiar with student confidentiality.",
                good_for: "Social bullying, cyber harassment, and severe emotional distress."
              },
              {
                role: "Trusted Teacher",
                why_consider: "Observes hallways and classrooms directly every day.",
                good_for: "Immediate classroom teasing and project group dynamics."
              },
              {
                role: "Parent or Guardian",
                why_consider: "Has protective authority and can request school administrative intervention.",
                good_for: "Safety threats, commute issues, or severe harassment."
              }
            ],
            conversation_starter: "I have something important to tell you. Something has been happening at school that makes me uncomfortable. Could you listen to me privately and help me decide what to do?",
            if_situation_worsens: [
              "If at any point you feel unsafe, dial 112 or Childline 1098 immediately.",
              "If the first adult does not listen or dismisses you, approach another teacher or counselor.",
              "Keep recording specific dates, times, and witness names."
            ],
            safe_boundaries_note: "You are never obligated to approach an adult who makes you feel uncomfortable. Choose someone YOU trust."
          });
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [concernParam, urgencyParam, selectedAdult]);

  const handleCopyScript = () => {
    if (!guidance?.conversation_starter) return;
    navigator.clipboard.writeText(guidance.conversation_starter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !guidance) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-sakhi-lavender-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-600 text-sm">Preparing your personalized action plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakhi-teal-50 text-sakhi-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Support Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Actionable Guidance & Conversation Guide
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Empowering steps designed around your safety and pace.
          </p>
        </div>

        <UrgencyBadge urgency={urgencyParam} size="md" />
      </div>

      {/* 1. What We Understood */}
      <section className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sakhi-lavender-700 mb-2 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" />
          <span>1. What We Understood</span>
        </h2>
        <p className="text-base text-slate-800 leading-relaxed font-medium">
          {guidance.what_we_understood}
        </p>
      </section>

      {/* 2. What You Can Do Next */}
      <section className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sakhi-teal-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>2. What You Can Do Next</span>
        </h2>

        <div className="space-y-3">
          {guidance.what_you_can_do_next.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-sakhi-teal-50/50 border border-sakhi-teal-100 text-sm text-slate-800">
              <span className="w-6 h-6 rounded-full bg-sakhi-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Help Me Talk to a Trusted Adult (Interactive Script Generator) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sakhi-lavender-50 via-white to-sakhi-sand-100 border border-sakhi-lavender-200 shadow-soft space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-sakhi-lavender-800 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>3. What to Say When Asking for Help</span>
          </h2>
          <h3 className="text-xl font-bold text-slate-900">
            Suggested Conversation Starter
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Pick who you'd feel most comfortable approaching. SAKHI drafts a gentle script you can say aloud, write on paper, or send as a text.
          </p>
        </div>

        {/* Adult Role Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Choose recipient:</span>
          {[
            { id: 'teacher', label: 'Teacher' },
            { id: 'counsellor', label: 'School Counselor' },
            { id: 'parent', label: 'Parent / Guardian' },
            { id: 'sibling', label: 'Older Sibling / Relative' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedAdult(role.id as any)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                selectedAdult === role.id
                  ? 'bg-sakhi-lavender-600 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* The Generated Script Card */}
        <div className="relative p-5 sm:p-6 rounded-2xl bg-white border border-sakhi-lavender-200 shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs text-sakhi-lavender-700 font-semibold">
            <span>Prepared Script (Private draft — not sent automatically)</span>
            <button
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sakhi-lavender-100 hover:bg-sakhi-lavender-200 text-sakhi-lavender-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
            </button>
          </div>

          <blockquote className="text-slate-800 font-serif italic text-base sm:text-lg leading-relaxed border-l-4 border-sakhi-lavender-500 pl-4 py-1">
            "{guidance.conversation_starter}"
          </blockquote>

          <p className="mt-4 text-xs text-slate-500 leading-normal">
            💡 <strong>Helpful tip:</strong> If saying this out loud feels too frightening, write it in a notebook and hand it to them, or send it as a quick text when they are home.
          </p>
        </div>

        <p className="text-xs text-slate-600 italic">
          {guidance.safe_boundaries_note}
        </p>
      </section>

      {/* 4. Who Could Help (Adult Directory) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>4. Who Could Help</span>
          </h2>
          <Link to="/trusted-adults" className="text-xs font-semibold text-sakhi-lavender-700 hover:underline">
            View full adult guide →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guidance.who_could_help.slice(0, 4).map((adult, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
              <h3 className="font-bold text-slate-900 text-sm mb-1">{adult.role}</h3>
              <p className="text-xs text-slate-600 mb-2">{adult.why_consider}</p>
              <span className="inline-block text-[11px] font-semibold text-sakhi-teal-700 bg-sakhi-teal-50 px-2 py-0.5 rounded-md">
                Good for: {adult.good_for}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. What If the Situation Gets Worse? */}
      <section className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200/80 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>5. What to Do If the Situation Gets Worse</span>
        </h2>

        <div className="space-y-2 text-xs sm:text-sm text-slate-800">
          {guidance.if_situation_worsens.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-700 font-bold">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Nav Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Link
          to="/chat"
          className="text-xs sm:text-sm font-semibold text-sakhi-lavender-700 hover:underline"
        >
          ← Continue Chatting with SAKHI
        </Link>

        <Link
          to="/emergency"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold hover:bg-rose-100"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Need Crisis Contacts? (112 / 1098)</span>
        </Link>
      </div>

    </div>
  );
};
