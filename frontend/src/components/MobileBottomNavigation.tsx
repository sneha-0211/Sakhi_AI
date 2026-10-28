import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import {
  Home,
  MessageCircleHeart,
  BookOpen,
  ShieldCheck,
  MoreHorizontal,
  X,
  ClipboardCheck,
  Users,
  Trash2,
  PhoneCall
} from 'lucide-react';

export const MobileBottomNavigation: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { clearSession, hasActiveSession } = useSession();

  const handleClearSession = () => {
    if (window.confirm("Clear all active messages and session memory?")) {
      clearSession();
      setMoreOpen(false);
    }
  };

  const primaryTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/chat', label: 'Talk', icon: MessageCircleHeart, isPrimary: true },
    { to: '/resources', label: 'Guides', icon: BookOpen },
    { to: '/privacy', label: 'Privacy', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Drawer for 'More' Menu */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">More Safety Tools</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/assessment"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-sakhi-teal-50 border border-sakhi-teal-100 text-slate-800 text-sm font-medium transition-all"
              >
                <div className="w-10 h-10 rounded-xl highlight-teal flex items-center justify-center shadow-sm">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sakhi-teal-900">Safety Assessment</span>
                  <span className="text-xs text-slate-500">View concern evaluation & urgency</span>
                </div>
              </Link>

              <Link
                to="/trusted-adults"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-sakhi-lavender-50 border border-sakhi-lavender-100 text-slate-800 text-sm font-medium transition-all"
              >
                <div className="w-10 h-10 rounded-xl highlight-lavender flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="block font-bold text-sakhi-lavender-900">Talk to a Trusted Adult</span>
                  <span className="text-xs text-slate-500">Pick support people & conversation starters</span>
                </div>
              </Link>

              <Link
                to="/emergency"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-card-rose border border-rose-200 text-rose-900 text-sm font-medium transition-all"
              >
                <div className="w-10 h-10 rounded-xl highlight-emergency sos-btn flex items-center justify-center shadow-md">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="block font-extrabold text-rose-900">Emergency Directory (112 / 1098)</span>
                  <span className="text-xs text-rose-700 font-semibold">24/7 verified crisis helplines</span>
                </div>
              </Link>
            </div>

            {hasActiveSession && (
              <div className="pt-2">
                <button
                  onClick={handleClearSession}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 text-rose-700 hover:bg-rose-50 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Active Session Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                    tab.isPrimary
                      ? 'text-sakhi-lavender-700 font-bold'
                      : isActive
                      ? 'text-sakhi-lavender-800 font-bold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                      tab.isPrimary
                        ? isActive
                          ? 'highlight-lavender shadow-md scale-110'
                          : 'bg-sakhi-lavender-100 text-sakhi-lavender-700'
                        : isActive
                        ? 'bg-sakhi-lavender-50 text-sakhi-lavender-700'
                        : ''
                    }`}>
                      <Icon className={`w-5 h-5 ${(tab.isPrimary || isActive) ? '' : 'opacity-60'}`} />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* 'More' Button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              moreOpen ? 'text-sakhi-lavender-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl ${moreOpen ? 'bg-sakhi-lavender-100' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
