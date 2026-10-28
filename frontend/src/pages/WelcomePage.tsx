import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import {
  MessageCircleHeart,
  BookOpen,
  ShieldCheck,
  Lock,
  HeartHandshake,
  AlertCircle,
  Sparkles,
  ArrowRight,
  FlaskConical
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0EAFF] via-[#F7F5FF] to-[#F0FDF9] flex flex-col justify-between">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12 w-full text-center">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center justify-center mb-6">
          <Logo size="xl" showTagline={false} />
          <p className="mt-3 text-base sm:text-lg font-bold gradient-text-sakhi tracking-wide">
            Your Voice. Your Safety. Your Space.
          </p>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
          A private, caring space to talk through{' '}
          <span className="gradient-text-lavender">school problems.</span>
        </h1>
        
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Describe what you are going through in your own words. SAKHI AI helps you understand your feelings,
          gives gentle step-by-step guidance, and helps you decide if and how to talk to a trusted adult.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link
            to="/chat"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl highlight-lavender font-bold text-base transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
          >
            <MessageCircleHeart className="w-5 h-5" />
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/resources"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-sakhi-teal-50 text-slate-700 font-semibold text-base border border-sakhi-teal-200 shadow-sm hover:shadow-md transition-all"
          >
            <BookOpen className="w-5 h-5 text-sakhi-teal-600" />
            <span>Explore Safety Library</span>
          </Link>
        </div>

        {/* Demo link */}
        <div className="mt-4">
          <Link
            to="/scenarios"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sakhi-lavender-700 hover:text-sakhi-lavender-800 bg-sakhi-lavender-100 hover:bg-sakhi-lavender-200 px-4 py-2 rounded-full transition-all border border-sakhi-lavender-200 hover:shadow-sm"
          >
            <FlaskConical className="w-4 h-4 text-sakhi-lavender-600" />
            <span>Try Fictional Demo Scenarios (For Judges)</span>
          </Link>
        </div>

        {/* Hero Interactive Showcase Image Banner */}
        <div className="mt-10 max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-sakhi-lavender-200/80 shadow-elevated relative group">
          <img
            src="/images/hero_companion.jpg"
            alt="SAKHI AI Supportive Campus and Student Companion"
            className="w-full h-56 sm:h-80 object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left text-white">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Empowering Every Student</span>
              </span>
              <h2 className="text-lg sm:text-2xl font-bold font-display">A judgement-free sanctuary for your thoughts</h2>
            </div>
            <Link
              to="/chat"
              className="px-4 py-2 rounded-xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Start Chatting →
            </Link>
          </div>
        </div>

        {/* Reassurance Cards (3 Columns with Visual Imagery) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Privacy */}
          <div className="feature-card overflow-hidden rounded-3xl bg-gradient-card-lavender flex flex-col">
            <div className="relative h-36 overflow-hidden">
              <img
                src="/images/cyber_security.jpg"
                alt="Privacy and anonymity protection"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-xl highlight-lavender flex items-center justify-center shadow-md">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sakhi-lavender-800 text-base mb-1.5">No Real Names Needed</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                  You never have to sign up, provide your real name, school ID, or phone number. Everything stays 100% anonymous.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Mental Well-Being */}
          <div className="feature-card overflow-hidden rounded-3xl bg-gradient-card-teal flex flex-col">
            <div className="relative h-36 overflow-hidden">
              <img
                src="/images/mindfulness_calm.jpg"
                alt="Gentle and non-judgmental guidance"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-xl highlight-teal flex items-center justify-center shadow-md">
                <HeartHandshake className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sakhi-teal-800 text-base mb-1.5">Gentle & Non-Judgmental</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                  No victim-blaming, no pressure, and no forced decisions. Calming exercises and step-by-step guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Trusted Adults */}
          <div className="feature-card overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex flex-col">
            <div className="relative h-36 overflow-hidden">
              <img
                src="/images/trusted_adult.jpg"
                alt="Supportive adults and mentors"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 w-9 h-9 rounded-xl highlight-amber flex items-center justify-center shadow-md">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-amber-900 text-base mb-1.5">Confidential & Safe</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                  No conversations are permanently stored. Learn safe ways to talk to school counselors and trusted mentors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl highlight-amber flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
              <p className="font-bold text-amber-900">
                Important: What this app can and cannot do
              </p>
              <p>
                SAKHI AI is an AI-powered conversational safety guide designed to help you prepare next steps.
                <strong> This app cannot physically call emergency services on your behalf, nor can it guarantee that someone will intervene.</strong>
              </p>
              <p>
                If you are in immediate danger or being physically harmed right now, please call emergency services (<strong>112</strong> or Childline <strong>1098</strong>) or alert an adult immediately.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 bg-white/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© SAKHI AI • Safe & Private School Companion</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-sakhi-lavender-700 underline">Privacy Policy</Link>
            <Link to="/emergency" className="hover:text-rose-600 font-semibold">Emergency Contacts (112 / 1098)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
