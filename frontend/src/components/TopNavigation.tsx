import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { api } from '../services/api';
import { useSession } from '../context/SessionContext';
import {
  MessageCircleHeart,
  ClipboardCheck,
  Users,
  BookOpen,
  ShieldCheck,
  PhoneCall,
  LogOut,
  Sparkles,
  Trash2,
  Zap,
  Wifi,
  WifiOff,
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const location = useLocation();
  const { clearSession, hasActiveSession } = useSession();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(() => { if (isMounted) setBackendOnline(true); })
      .catch(() => { if (isMounted) setBackendOnline(false); });
    return () => { isMounted = false; };
  }, []);

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  const handleClearSessionClick = () => {
    if (window.confirm('Clear all messages and active session data immediately?')) {
      clearSession();
    }
  };

  const navLinks = [
    { to: '/assessment',     label: 'Safety Check',   icon: ClipboardCheck, color: 'text-sakhi-teal-700 bg-sakhi-teal-50'       },
    { to: '/trusted-adults', label: 'Trusted Adults', icon: Users,          color: 'text-indigo-700 bg-indigo-50'               },
    { to: '/resources',      label: 'Resources',      icon: BookOpen,       color: 'text-emerald-700 bg-emerald-50'             },
    { to: '/privacy',        label: 'Privacy',        icon: ShieldCheck,    color: 'text-slate-600 bg-slate-100'                },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-xl border-b border-sakhi-lavender-100/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center group">
              <Logo size="sm" showTagline={false} />
            </Link>
            <span className="hidden xl:inline text-xs font-medium text-sakhi-lavender-400 pl-2.5 border-l border-sakhi-lavender-100">
              Your Voice. Your Safety. Your Space.
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {/* Primary CTA */}
            <Link
              to="/chat"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                location.pathname === '/chat'
                  ? 'highlight-lavender shadow-lg'
                  : 'bg-gradient-to-r from-sakhi-lavender-100 to-sakhi-lavender-50 hover:from-sakhi-lavender-200 hover:to-sakhi-lavender-100 text-sakhi-lavender-800 hover:shadow-soft'
              }`}
            >
              <MessageCircleHeart className="w-4 h-4" />
              <span>Talk to SAKHI</span>
              {location.pathname === '/chat' && <Sparkles className="w-3 h-3 ml-0.5 animate-pulse" />}
            </Link>

            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? `${item.color} font-bold ring-1 ring-inset ring-sakhi-lavender-200`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-60'}`} />
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sakhi-lavender-500 ml-0.5" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">

            {/* Backend status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-500 ${
                backendOnline === true
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : backendOnline === false
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
              title={backendOnline === true ? 'FastAPI + Qwen3-8B connected' : 'Backend unreachable'}
            >
              <span className="relative flex">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline === true
                      ? 'bg-emerald-500'
                      : backendOnline === false
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
                {backendOnline === true && (
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                )}
              </span>
              <span className="hidden sm:inline">
                {backendOnline === true ? 'AI Online' : backendOnline === false ? 'Offline' : '…'}
              </span>
            </div>

            {/* Clear Session */}
            {hasActiveSession && (
              <button
                onClick={handleClearSessionClick}
                title="Erase active conversation"
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            {/* SOS Emergency Button */}
            <Link
              to="/emergency"
              className="sos-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold highlight-emergency transition-all hover:scale-105"
              title="Emergency: 112 / 1098"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </Link>

            {/* Quick Exit */}
            <button
              onClick={handleQuickExit}
              title="Quick Exit — redirects to Google immediately"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
