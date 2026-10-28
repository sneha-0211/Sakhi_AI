import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  AlertTriangle,
  Server,
  Cpu,
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const [clearedToast, setClearedToast] = useState(false);

  const handleClearEverything = () => {
    // Clear all ephemeral session storage, local storage, and caches
    sessionStorage.clear();
    localStorage.clear();
    setClearedToast(true);
    setTimeout(() => setClearedToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakhi-lavender-100 text-sakhi-lavender-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Storage Guarantee</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
          Privacy Center & Confidentiality Limits
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
          How SAKHI AI protects your identity, ensures zero permanent storage, and respects your privacy.
        </p>
      </div>

      {/* Clear Session Data Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Want to erase all active session memory right now?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Instantly clears your current browser conversation memory and temporary keys.
          </p>
        </div>

        <button
          onClick={handleClearEverything}
          className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>{clearedToast ? 'Cleared Successfully!' : 'Erase Session Data Now'}</span>
        </button>
      </div>

      {/* 4 Pillars of SAKHI Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sakhi-lavender-100 flex items-center justify-center text-sakhi-lavender-700">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">1. No Accounts or Real Names</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We do not ask for your real name, school roll number, student ID, email address, or phone number.
            You are recognized only by a random temporary session code (e.g., <code>sess-8x92</code>) that resets upon closing the tab.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sakhi-teal-100 flex items-center justify-center text-sakhi-teal-700">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">2. Zero Database Persistence</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your conversations are not written to an SQL database, MongoDB, file storage, or advertising profile.
            Once processed, the ephemeral in-memory buffer is flushed automatically.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sakhi-sand-200 flex items-center justify-center text-amber-800">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">3. Local Rule-Based Engine</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By default, 100% of safety evaluation, risk assessment, and dialogue generation runs inside our local deterministic Python safety engine.
            No external third-party API or tracking network receives your text.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">4. Automatic PII Scrubbing</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If a student accidentally types a phone number or student ID, our security regex module intercepts and redacts it before processing.
            However, we remind all users to never type passwords or home addresses.
          </p>
        </div>

      </div>

      {/* Limits of Confidentiality Notice */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <span>Understanding the Limits of Confidentiality</span>
        </h2>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <p>
            It is vital for school students, teachers, and judges to understand what an AI system can and cannot guarantee:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>AI is not a human protector:</strong> SAKHI AI cannot physically stop someone from bullying you, cannot escort you to class, and cannot call the police directly.
            </li>
            <li>
              <strong>Institutional real-world deployment:</strong> In an actual school deployment, child safety laws (such as POCSO or mandatory child protection reporting) require designated adults to intervene when a child discloses physical violence or sexual abuse. SAKHI AI prepares you to safely self-advocate with those designated adults.
            </li>
            <li>
              <strong>No clinical diagnoses:</strong> SAKHI AI does not diagnose mental health disorders, depression, or psychiatric conditions.
            </li>
          </ul>
        </div>
      </section>

      {/* Rules for Safe App Usage */}
      <section className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-sakhi-teal-600" />
          <span>Simple Rules for Safe App Usage</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            ❌ <strong>Never share:</strong> Passwords, home address, credit cards, or Aadhaar/identity numbers.
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            ✔️ <strong>Do share:</strong> What happened, how it made you feel, and whether anyone witnessed it.
          </div>
        </div>
      </section>

    </div>
  );
};
