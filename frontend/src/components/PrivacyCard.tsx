import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { Lock, Trash2, ArrowRight, Check } from 'lucide-react';

export const PrivacyCard: React.FC = () => {
  const { clearSession, hasActiveSession } = useSession();
  const [clearedToast, setClearedToast] = useState(false);

  const handleClearSession = () => {
    if (window.confirm("Are you sure you want to erase all conversation messages and session data right now?")) {
      clearSession();
      setClearedToast(true);
      setTimeout(() => setClearedToast(false), 2500);
    }
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-sakhi-sand-100/90 border border-sakhi-sand-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-sakhi-lavender-100 flex items-center justify-center text-sakhi-lavender-700 flex-shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Your privacy matters.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            No account or name is required. Your conversation stays in temporary session memory in the default demo configuration.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <button
          onClick={handleClearSession}
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
          title="Instantly wipes session memory"
        >
          {clearedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Trash2 className="w-3.5 h-3.5" />}
          <span>{clearedToast ? 'Cleared!' : 'Clear Session'}</span>
        </button>

        <Link
          to="/privacy"
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <span>View Privacy Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
