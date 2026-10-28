import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EmergencyContact } from '../types';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
  Lock,
  CheckCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getEmergencyContacts()
      .then((data) => {
        if (isMounted) {
          setContacts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('API emergency fetch failed, fallback active:', err);
        if (isMounted) {
          // Hardcoded verified Indian emergency directory fallback
          setContacts([
            {
              id: 'em-112',
              name: 'Emergency Response Support System (ERSS)',
              number: '112',
              description: 'Unified all-in-one emergency helpline for Police, Fire, and Ambulance in immediate danger.',
              category: 'Emergency & Police',
              official_portal: 'https://112.gov.in',
              availability: '24 hours / 7 days a week, Toll-Free',
              verification_status: 'Official Govt. of India Emergency Service',
              disclaimer: 'Call 112 immediately if there is physical danger, violence, or imminent risk to life.'
            },
            {
              id: 'em-1098',
              name: 'CHILDLINE / Child Helpline',
              number: '1098',
              description: '24/7 dedicated emergency assistance, rescue, and counseling for children in distress across India.',
              category: 'Child Protection',
              official_portal: 'https://wcd.nic.in',
              availability: '24 hours / 7 days a week, Free call',
              verification_status: 'Ministry of Women & Child Development Verified',
              disclaimer: 'Directly links children to child protection officers, counselors, and safe shelters.'
            },
            {
              id: 'em-1091',
              name: 'Women & Girls Helpline',
              number: '1091',
              description: 'Specialized toll-free helpline providing immediate police assistance and counseling to women and girls.',
              category: 'Safety & Harassment',
              official_portal: 'https://ncw.nic.in',
              availability: '24/7 Toll-Free',
              verification_status: 'National Commission for Women / State Police',
              disclaimer: 'Assists with street harassment, stalking, school transit safety, and threats.'
            },
            {
              id: 'em-1930',
              name: 'National Cyber Crime Reporting Helpline',
              number: '1930',
              description: 'Specialized portal and helpline to report online blackmail, fake accounts, leaks, and cyber harassment.',
              category: 'Cyber Safety',
              official_portal: 'https://cybercrime.gov.in',
              availability: '24/7 Support',
              verification_status: 'Ministry of Home Affairs (I4C)',
              disclaimer: 'Submit screenshots, report accounts, and request takedown of non-consensual content.'
            },
            {
              id: 'em-14416',
              name: 'Tele-MANAS Comprehensive Mental Health Helpline',
              number: '14416 / 1800-891-4416',
              description: 'National tele-mental health programme providing free, confidential counseling by certified clinical psychologists.',
              category: 'Emotional Well-Being',
              official_portal: 'https://telemanas.mohfw.gov.in',
              availability: '24/7 Multi-lingual Toll-Free',
              verification_status: 'Ministry of Health & Family Welfare',
              disclaimer: 'Free psychological first-aid and emotional distress counseling.'
            }
          ]);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Critical Safety Notice Banner — pulsing red */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-card-rose border-2 border-rose-300 text-rose-950 space-y-3 shadow-md">
        {/* Background pulse ring decoration */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-rose-300/20 blur-2xl" />
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl highlight-emergency flex items-center justify-center flex-shrink-0 shadow-lg">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">Immediate Safety Alert</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-rose-950 mt-1">
              Are you in immediate physical danger right now?
            </h1>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-rose-900 leading-relaxed space-y-1.5 pl-1">
          <p className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span><strong>Move to a safer place immediately:</strong> Head towards a well-lit, populated space — staffroom, library, security booth, or group of friends.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span><strong>Call out loudly:</strong> Shouting "Help" or alerting any nearby adult is your legal right and safest move.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span><strong>SAKHI AI Disclaimer:</strong> <em>This software does NOT automatically contact police or ambulance. You must call the numbers below directly.</em></span>
          </p>
        </div>
      </div>

      {/* Emergency Helpline Directory */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Official Emergency & Crisis Helplines (India)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Toll-free, verified government helplines accessible from any mobile or landline without balance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => {
            const categoryColors: Record<string, string> = {
              'Emergency & Police':      'from-red-50 to-rose-50 border-rose-200',
              'Child Protection':        'from-purple-50 to-violet-50 border-purple-200',
              'Safety & Harassment':     'from-pink-50 to-rose-50 border-pink-200',
              'Cyber Safety':            'from-cyan-50 to-sky-50 border-cyan-200',
              'Emotional Well-Being':    'from-teal-50 to-emerald-50 border-teal-200',
            };
            const badgeColors: Record<string, string> = {
              'Emergency & Police':      'bg-red-100 text-red-700',
              'Child Protection':        'bg-purple-100 text-purple-700',
              'Safety & Harassment':     'bg-pink-100 text-pink-700',
              'Cyber Safety':            'bg-cyan-100 text-cyan-700',
              'Emotional Well-Being':    'bg-teal-100 text-teal-700',
            };
            const cardGradient = categoryColors[contact.category] || 'from-white to-slate-50 border-slate-200';
            const badgeColor   = badgeColors[contact.category]    || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={contact.id}
                className={`feature-card overflow-hidden p-5 rounded-3xl bg-gradient-to-br ${cardGradient} border flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeColor}`}>
                      {contact.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {contact.availability}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1.5">
                    {contact.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {contact.description}
                  </p>

                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">{contact.verification_status}</span>
                  </div>
                </div>

                {/* Call Button */}
                <div className="pt-3 border-t border-white/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Dial Number</span>
                    <span className="text-2xl font-display font-black text-slate-900">{contact.number}</span>
                  </div>

                  <a
                    href={`tel:${contact.number.split('/')[0].trim()}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl highlight-emergency font-bold text-sm shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Immediate Physical Safety Steps Checklist */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-sakhi-lavender-600" />
          <span>If You Feel Unsafe Right Now: 4 Immediate Steps</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-2xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100 space-y-1">
            <span className="font-bold text-sakhi-lavender-900 block">1. Break Isolation</span>
            <p className="text-slate-600 leading-relaxed">
              Never stay trapped in an empty washroom, classroom, or alley. Move briskly towards crowds, security personnel, or teachers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100 space-y-1">
            <span className="font-bold text-sakhi-lavender-900 block">2. Make Noise</span>
            <p className="text-slate-600 leading-relaxed">
              If someone blocks you or tries to grab you, scream firmly: "Back off!" or "Help!" Bullies and harassers rely on your silence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100 space-y-1">
            <span className="font-bold text-sakhi-lavender-900 block">3. Keep Phone Active</span>
            <p className="text-slate-600 leading-relaxed">
              Keep 112 on speed dial or open your phone's SOS trigger (often pressing the power button 3 or 5 times quickly in India).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100 space-y-1">
            <span className="font-bold text-sakhi-lavender-900 block">4. Inform Safe Adult Right Away</span>
            <p className="text-slate-600 leading-relaxed">
              Do not wait until tomorrow. Walk straight to a teacher or phone a parent as soon as you reach a secure spot.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimers & Limitations */}
      <div className="p-4 rounded-2xl bg-slate-100 text-slate-600 text-xs leading-relaxed space-y-1">
        <p className="font-bold text-slate-800">Directory Verification & Scope Notice</p>
        <p>
          Emergency numbers are verified public utilities operated by the Government of India, State Police, and Ministry of Women & Child Development.
          SAKHI AI is not affiliated with these services and does not record or monitor emergency phone calls.
        </p>
      </div>

    </div>
  );
};
