import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleHeart, FlaskConical, ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const WelcomeHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero text-white p-6 sm:p-10 shadow-elevated">
      
      {/* Decorative background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 w-64 h-64 rounded-full bg-sakhi-teal-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-sakhi-lavender-300/15 blur-2xl" />
      </div>

      {/* Floating sparkle particles */}
      <div className="absolute top-8 right-24 particle">
        <Sparkles className="w-4 h-4 text-amber-300 opacity-70" />
      </div>
      <div className="absolute top-20 right-48 particle">
        <Sparkles className="w-3 h-3 text-white opacity-40" />
      </div>
      <div className="absolute top-14 right-36 particle">
        <Sparkles className="w-2.5 h-2.5 text-sakhi-teal-300 opacity-60" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        {/* Left column */}
        <div className="lg:col-span-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wide mb-3 border border-white/25">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered · Totally Anonymous · Zero Storage</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight">
            How are you feeling
            <br />
            <span className="text-amber-300">today?</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-sakhi-lavender-100 leading-relaxed max-w-xl">
            You don't need to explain everything perfectly.
            Start wherever you feel comfortable — SAKHI AI listens without judgment.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-2xl bg-white text-sakhi-lavender-800 font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:bg-sakhi-lavender-50 transition-all duration-200 active:scale-95 group"
            >
              <MessageCircleHeart className="w-5 h-5 text-sakhi-lavender-600 group-hover:scale-110 transition-transform" />
              <span>Talk to SAKHI</span>
              <ArrowRight className="w-4 h-4 text-sakhi-lavender-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/scenarios"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold transition-all duration-200 border border-white/20 hover:border-white/35"
            >
              <FlaskConical className="w-4 h-4 text-amber-300" />
              <span>Try a Demo</span>
            </Link>
          </div>

          {/* Privacy note */}
          <div className="mt-4 flex items-center gap-2 text-xs text-sakhi-lavender-200">
            <ShieldCheck className="w-4 h-4 text-sakhi-teal-300" />
            <span>No account required · No real name needed · End-to-end anonymous</span>
          </div>
        </div>

        {/* Right column: Hero Image */}
        <div className="lg:col-span-5 hidden sm:block">
          <div className="relative group overflow-hidden rounded-2xl border-2 border-white/25 shadow-2xl bg-white/10 backdrop-blur-sm">
            <img
              src="/images/hero_companion.jpg"
              alt="SAKHI AI – Safe and supportive school companion"
              className="w-full h-52 lg:h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sakhi-lavender-900/70 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay labels */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SAKHI AI Active
              </span>
              <span className="text-[11px] bg-sakhi-teal-600/90 px-2.5 py-1 rounded-full text-white font-bold">
                100% Private
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
