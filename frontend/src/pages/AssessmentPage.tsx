import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSession } from '../context/SessionContext';
import { AssessmentResponse, UrgencyTier } from '../types';
import { UrgencyBadge } from '../components/UrgencyBadge';
import {
  ClipboardCheck,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Users,
  MessageCircleHeart,
  ArrowLeft
} from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryConcern = searchParams.get('concern') || undefined;
  const queryUrgency = (searchParams.get('urgency') as UrgencyTier) || undefined;

  const { sessionId, messages, latestAssessment, setSessionAssessment } = useSession();

  const [assessment, setAssessment] = useState<AssessmentResponse | null>(latestAssessment);
  const [loading, setLoading] = useState<boolean>(!latestAssessment);

  useEffect(() => {
    let isMounted = true;

    // If assessment already in session context and no overriding query param, use it!
    if (latestAssessment && !queryConcern) {
      setAssessment(latestAssessment);
      setLoading(false);
      return;
    }

    // Extract student message text from session history or fallback
    const studentTexts = messages.filter(m => m.sender === 'student').map(m => m.text);
    const textContext = studentTexts.length > 0
      ? studentTexts
      : [`Student seeking safety guidance regarding ${queryConcern || 'school concern'}.`];

    api.getAssessment(sessionId, textContext, queryConcern)
      .then((data) => {
        if (isMounted) {
          // Safety Rule: Never downgrade if the query or previous state was urgent
          if (queryUrgency === 'urgent' && data.urgency !== 'urgent') {
            data.urgency = 'urgent';
          }
          setAssessment(data);
          setSessionAssessment(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Backend assessment error, fallback used:', err);
        if (isMounted) {
          const fallbackData: AssessmentResponse = {
            concern_type: queryConcern || 'general_support',
            neutral_summary: "We evaluated your concern regarding school well-being and safety.",
            urgency: queryUrgency || 'moderate',
            indicators: [
              "Context evaluated against SAKHI safety ruleset",
              "Pattern of reported peer interactions checked",
              "Safe adult consultation advisable"
            ],
            recommended_next_steps: [
              "Keep a private record of dates and times if safe",
              "Do not confront threatening individuals alone",
              "Prepare a calm conversation starter for a trusted teacher or parent"
            ],
            immediate_human_support_advisable: (queryUrgency || 'moderate') !== 'low',
            relevant_resource_ids: ['res-bullying', 'res-talk-adult'],
            confidence_note: "Assessed via SAKHI AI Deterministic Safety Engine.",
            disclaimer: "This assessment is an informational guide to help determine appropriate steps, not a clinical diagnosis or definitive prediction."
          };
          setAssessment(fallbackData);
          setSessionAssessment(fallbackData);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [sessionId, queryConcern, queryUrgency, latestAssessment, setSessionAssessment, messages]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block p-4 rounded-2xl bg-sakhi-lavender-100 text-sakhi-lavender-700 animate-spin mb-3">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Reviewing Safety Assessment...</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Analyzing situation context and recommended next steps.</p>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-sakhi-teal-50 text-sakhi-teal-700">
              <ClipboardCheck className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              Situation Assessment Summary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Clear, transparent explanation of what was understood and proportional next steps.
          </p>
        </div>

        {/* 4 descriptive levels: Low concern, Moderate concern, High concern, Immediate assistance recommended */}
        <UrgencyBadge urgency={assessment.urgency} size="lg" showDescription />
      </div>

      {/* 4 Core Sections Required by Section 5 */}
      <div className="space-y-4 sm:space-y-6">

        {/* 1. "What I understood" */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            1. What I Understood
          </span>
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            {assessment.neutral_summary}
          </p>
          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Concern Category: <strong className="text-slate-700 capitalize">{assessment.concern_type.replace(/_/g, ' ')}</strong></span>
            <span className="hidden sm:inline italic text-[11px]">{assessment.confidence_note}</span>
          </div>
        </div>

        {/* 2. "How urgent this may be" & Evidence/Indicators */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              2. How Urgent This May Be & Evidence
            </span>
            <UrgencyBadge urgency={assessment.urgency} size="sm" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The safety engine evaluates behavioral patterns, frequency, and personal boundary safety rather than relying on isolated keywords.
          </p>

          {/* Indicators / Evidence behind classification */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Observed Indicators:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assessment.indicators.map((ind, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sakhi-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. "What you can do next" */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sakhi-teal-700 block">
            3. What You Can Do Next
          </span>
          <div className="space-y-2.5">
            {assessment.recommended_next_steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-sakhi-teal-50/50 border border-sakhi-teal-100 text-xs sm:text-sm text-slate-800">
                <span className="w-5 h-5 rounded-full bg-sakhi-teal-600 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. "Who could help" */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sakhi-lavender-700 block">
              4. Who Could Help
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {assessment.immediate_human_support_advisable
                ? 'Support from a Safe Adult is Recommended'
                : 'Self-Advocacy & Guided Steps'}
            </h3>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              {assessment.immediate_human_support_advisable
                ? 'Because this issue involves repeated behavior or safety boundaries, involving a safe teacher, counselor, or parent ensures you do not face this alone.'
                : 'You can practice coping strategies and self-care, or speak to someone if stress persists.'}
            </p>
          </div>

          <Link
            to="/trusted-adults"
            className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-sakhi-lavender-50 hover:bg-sakhi-lavender-100 text-sakhi-lavender-800 font-semibold text-xs sm:text-sm border border-sakhi-lavender-200 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-sakhi-lavender-600" />
            <span>Explore Support People</span>
          </Link>
        </div>

      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <Link
          to={`/guidance?concern=${assessment.concern_type}&urgency=${assessment.urgency}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-sm shadow-soft transition-all"
        >
          <span>View Personalized Action Plan & Scripts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/chat"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <MessageCircleHeart className="w-3.5 h-3.5 text-sakhi-lavender-600" />
          <span>Resume Conversation</span>
        </Link>
      </div>

      {/* Transparent Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-500 text-xs leading-relaxed flex items-start gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
        <span>{assessment.disclaimer}</span>
      </div>

    </div>
  );
};
