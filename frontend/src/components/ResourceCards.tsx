import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResourceCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      
      {/* Card 1: Safety & Self-Advocacy Guides */}
      <div className="group overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="relative h-44 sm:h-48 overflow-hidden bg-sakhi-teal-50">
            <img
              src="/images/safety_guides.jpg"
              alt="Safety & Self-Advocacy Guides"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-sakhi-teal-700/90 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Safety & Self-Advocacy Guides</span>
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Practical knowledge for everyday safety
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Simple, non-judgmental guides to help you understand your rights and take action.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-teal-600 flex-shrink-0" />
                <span>Bullying & cyberbullying: documenting and reporting</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-teal-600 flex-shrink-0" />
                <span>Personal boundaries: safe touch and the 'No, Go, Tell' rule</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-teal-600 flex-shrink-0" />
                <span>Examination stress: grounding techniques & study pacing</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sakhi-teal-700 hover:text-sakhi-teal-800"
          >
            <span>Explore all safety guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card 2: Talk to a Trusted Adult */}
      <div className="group overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="relative h-44 sm:h-48 overflow-hidden bg-sakhi-lavender-50">
            <img
              src="/images/trusted_adult.jpg"
              alt="Talk to a Trusted Adult"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-sakhi-lavender-700/90 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Users className="w-3.5 h-3.5" />
                <span>Talk to a Trusted Adult</span>
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Guidance for approaching someone safely
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Scared of how an adult will react? We help you prepare what to say and who to pick.
            </p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-lavender-600 flex-shrink-0" />
                <span>Choose a person who feels safe (teacher, counselor, parent, sibling)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-lavender-600 flex-shrink-0" />
                <span>Practice a customized conversation starter script</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sakhi-lavender-600 flex-shrink-0" />
                <span>Explore alternatives if the first person is not safe or doesn't listen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100">
          <Link
            to="/trusted-adults"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sakhi-lavender-700 hover:text-sakhi-lavender-800"
          >
            <span>View adult support guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
};
