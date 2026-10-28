import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, ShieldAlert, ArrowRight, Users } from 'lucide-react';

export const EmergencyHelpBanner: React.FC = () => {
  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-rose-50/90 border border-rose-200 text-rose-950 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-200/70 text-rose-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-rose-700" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block">
              Urgent Safety Support
            </span>
            <h3 className="font-bold text-rose-950 text-base sm:text-lg">
              Are you in immediate physical danger?
            </h3>
            <p className="text-xs sm:text-sm text-rose-900 mt-0.5 max-w-xl leading-relaxed">
              If you feel trapped or unsafe right now, alert a trusted adult nearby or contact verified emergency services directly.
              <em> (Note: SAKHI AI does not dispatch rescue workers).</em>
            </p>
          </div>
        </div>

        {/* Call Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-2xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>

          <a
            href="tel:1098"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-800 font-bold text-xs sm:text-sm border border-rose-300 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Childline 1098</span>
          </a>
        </div>

      </div>

      {/* Directory & Safe Adult Shortcuts */}
      <div className="pt-3 border-t border-rose-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-rose-800 font-medium">
          Official 24/7 toll-free crisis lines for India
        </span>

        <div className="flex items-center gap-3">
          <Link
            to="/trusted-adults"
            className="inline-flex items-center gap-1 text-rose-800 hover:text-rose-950 font-semibold"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Find a Safe Adult</span>
          </Link>

          <Link
            to="/emergency"
            className="inline-flex items-center gap-1 text-rose-900 hover:underline font-bold"
          >
            <span>View Full Crisis Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
