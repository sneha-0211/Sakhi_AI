import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { UrgencyBadge } from './UrgencyBadge';
import {
  Compass,
  ArrowRight,
  MessageCircleHeart,
  CheckCircle2,
  ShieldAlert,
  ClipboardCheck,
  Users
} from 'lucide-react';

export const NextStepCard: React.FC = () => {
  const { latestAssessment, latestUrgency, latestConcern, messages } = useSession();

  // If there's an actual assessment from the backend in the active session:
  if (latestAssessment) {
    const primaryNextStep = latestAssessment.recommended_next_steps?.[0] || 'Explore safe ways to talk to someone you trust.';
    const isUrgent = latestAssessment.urgency === 'urgent';

    return (
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sakhi-teal-50 text-sakhi-teal-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Based on Your Active Session
              </span>
              <h3 className="font-bold text-slate-900 text-base">Your Recommended Next Step</h3>
            </div>
          </div>

          <UrgencyBadge urgency={latestAssessment.urgency} size="sm" />
        </div>

        {/* Primary next action */}
        <div className="p-4 rounded-2xl bg-sakhi-teal-50/60 border border-sakhi-teal-100 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-sakhi-teal-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
            <p className="font-semibold text-slate-900">{primaryNextStep}</p>
            <p className="text-slate-600">
              {latestAssessment.immediate_human_support_advisable
                ? "Connecting with a safe teacher, counselor, or guardian can help resolve this safely."
                : "This situation appears manageable with self-care and structured pacing."}
            </p>
          </div>
        </div>

        {/* Action navigation */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            to={`/guidance?concern=${latestAssessment.concern_type}&urgency=${latestAssessment.urgency}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <span>View Full Guidance & Scripts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
          >
            <MessageCircleHeart className="w-3.5 h-3.5" />
            <span>Resume Conversation</span>
          </Link>

          {isUrgent && (
            <Link
              to="/emergency"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Emergency Helplines</span>
            </Link>
          )}
        </div>
      </section>
    );
  }

  // If there are ongoing messages in chat but no final assessment yet
  if (messages.length > 1) {
    return (
      <section className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sakhi-lavender-100 text-sakhi-lavender-700 flex items-center justify-center flex-shrink-0">
            <MessageCircleHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              You have a conversation in progress
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continue describing what happened, or request a structured safety assessment anytime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            className="px-4 py-2 rounded-xl bg-sakhi-lavender-600 text-white text-xs font-semibold hover:bg-sakhi-lavender-700 shadow-xs"
          >
            Resume Chat
          </Link>
          {latestConcern && (
            <Link
              to={`/assessment?concern=${latestConcern}&urgency=${latestUrgency || 'low'}`}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
            >
              View Assessment
            </Link>
          )}
        </div>
      </section>
    );
  }

  // Neutral onboarding card for new sessions (Section 3.D)
  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-sakhi-lavender-50 text-sakhi-lavender-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Your Next Step: Start when you are ready
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl leading-relaxed">
            No active conversation yet. You can chat with SAKHI, read safety guides, or explore ways to talk to a trusted adult.
          </p>
        </div>
      </div>

      <Link
        to="/chat"
        className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
      >
        <MessageCircleHeart className="w-4 h-4" />
        <span>Talk to SAKHI</span>
      </Link>
    </section>
  );
};
