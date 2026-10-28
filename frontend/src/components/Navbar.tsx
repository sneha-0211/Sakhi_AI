import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { api } from '../services/api';
import {
  MessageCircleHeart,
  BookOpen,
  Users,
  ShieldCheck,
  FlaskConical,
  PhoneCall,
  LogOut,
  Menu,
  X,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(() => {
        if (isMounted) setBackendOnline(true);
      })
      .catch(() => {
        if (isMounted) setBackendOnline(false);
      });
    return () => { isMounted = false; };
  }, []);

  const navLinks = [
    { to: '/chat', label: 'Talk to SAKHI', icon: <MessageCircleHeart className="w-4 h-4" /> },
    { to: '/assessment', label: 'Safety Check', icon: <ClipboardCheck className="w-4 h-4" /> },
    { to: '/trusted-adults', label: 'Trusted Adults', icon: <Users className="w-4 h-4" /> },
    { to: '/resources', label: 'Resource Library', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/privacy', label: 'Privacy Center', icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/scenarios', label: 'Demo Cases', icon: <FlaskConical className="w-4 h-4" /> },
  ];

  const handleQuickExit = () => {
    // Quick exit: Redirect immediately to neutral educational study portal or blank search
    window.location.replace('https://www.google.com');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo size="md" showTagline={false} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-sakhi-lavender-100 text-sakhi-lavender-800 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Backend status badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700" title="Backend service connection status">
              <span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-emerald-500 animate-pulse' : backendOnline === false ? 'bg-amber-500' : 'bg-slate-400'}`} />
              <span>{backendOnline === true ? 'Backend Connected' : backendOnline === false ? 'Offline Demo' : 'Checking...'}</span>
            </div>

            {/* Emergency Help Button */}
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 animate-bounce" />
              <span className="hidden xs:inline">Need Urgent Help?</span>
              <span className="xs:hidden">SOS</span>
            </Link>

            {/* Quick Exit Button */}
            <button
              onClick={handleQuickExit}
              title="Quick Exit (Opens neutral search page immediately for privacy)"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Quick Exit</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                location.pathname === item.to
                  ? 'bg-sakhi-lavender-100 text-sakhi-lavender-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-3">
            <span>Status: {backendOnline ? '🟢 Connected' : '🟡 Offline Demo'}</span>
            <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className="underline text-sakhi-lavender-700">
              No Data Stored
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
