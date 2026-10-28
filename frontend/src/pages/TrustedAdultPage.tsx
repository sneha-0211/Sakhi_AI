import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
  Compass
} from 'lucide-react';

export const TrustedAdultPage: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const adults = [
    {
      id: 'teacher',
      title: 'A Teacher You Feel Comfortable With',
      why: 'Subject teachers or class teachers see the hallways, classrooms, and cafeteria dynamics daily.',
      bestFor: 'Classroom teasing, group exclusion, academic stress, or homework pressure.',
      howToAsk: 'After class or during break: "Ma\'am / Sir, could I talk to you for five minutes after the period? I have something private I need advice about."',
      safetyTip: 'Pick a teacher who is patient and calm, rather than one who reacts with anger.'
    },
    {
      id: 'counselor',
      title: 'School Counselor / Wellness Officer',
      why: 'Their specific professional role is to listen objectively without judging or taking sides.',
      bestFor: 'Emotional distress, bullying, panic attacks, family tension, or when you are hesitant to involve parents first.',
      howToAsk: 'Visit the wellness room or send an email/slip: "I would like to schedule a private counseling session to talk through some stress I am experiencing."',
      safetyTip: 'Counselors have ethical confidentiality rules and cannot disclose your talk unless someone is in severe physical danger.'
    },
    {
      id: 'parent',
      title: 'Parent or Guardian',
      why: 'Has full parental responsibility and legal standing to communicate with school leadership or take protective steps.',
      bestFor: 'Harassment on school transport, threats, blackmail, bodily boundary violations, or long-term depression.',
      howToAsk: 'During a quiet evening: "Mum / Dad, something has been happening at school that is making me really uncomfortable. I need your support and advice in private."',
      safetyTip: 'If your parents tend to panic or react with immediate anger, you can write your feelings down on paper first.'
    },
    {
      id: 'safety-officer',
      title: 'Designated Child Safety Officer or Principal',
      why: 'Has institutional authority to suspend harassers, change bus routes, involve school police, or enforce POCSO guidelines.',
      bestFor: 'Physical threats, stalking, sexual harassment, or when previous classroom complaints were ignored.',
      howToAsk: 'Request an appointment via school admin: "I need to file a formal safety report regarding student harassment."',
      safetyTip: 'You can bring an elder sibling or friend with you so you don\'t have to sit in the office alone.'
    },
    {
      id: 'other-adult',
      title: 'Elder Sibling, Aunt/Uncle, or Trusted Coach',
      why: 'Often more approachable and can act as your personal bridge to speak to parents or teachers together.',
      bestFor: 'Practicing what to say, moral support, and accompaniment.',
      howToAsk: '"Can we talk alone for a little while? Something is happening that I need your help figuring out."',
      safetyTip: 'Having an ally standing beside you gives you immense confidence.'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Page Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakhi-lavender-100 text-sakhi-lavender-800 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Support People Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
            How to Choose & Approach a Trusted Adult
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            You never have to carry scary or upsetting secrets alone. Here is how to find a safe support person,
            prepare your words, and what to do if someone dismisses you.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-sakhi-lavender-100 h-44 sm:h-52">
            <img
              src="/images/trusted_adult.jpg"
              alt="Safe conversation with a supportive counselor or teacher"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 text-xs text-white font-medium flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe & Empathetic Environment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Reassurance Banner: Not every adult is safe in every situation */}
      <div className="p-5 rounded-2xl bg-sakhi-sand-100 border border-sakhi-sand-300/80 flex items-start gap-3">
        <Compass className="w-5 h-5 text-sakhi-lavender-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
          <p className="font-bold text-slate-900">
            A Crucial Safety Rule: YOU decide who feels safe
          </p>
          <p>
            We recognize that not every family or school environment is identical. If approaching a specific parent,
            teacher, or relative feels unsafe or makes you fearful, <strong>you do not have to approach that person</strong>.
            You are always free to choose an alternative teacher, a certified counselor, an older sibling, or Childline (1098).
          </p>
        </div>
      </div>

      {/* Adult Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adults.map((adult) => (
          <div
            key={adult.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {adult.title}
                </h3>
                <span className="w-8 h-8 rounded-xl bg-sakhi-lavender-50 text-sakhi-lavender-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                {adult.why}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3">
                <strong className="text-slate-900 block mb-0.5">Best when dealing with:</strong>
                <span>{adult.bestFor}</span>
              </div>

              {/* Sample script to copy */}
              <div className="p-3.5 rounded-xl bg-sakhi-lavender-50/60 border border-sakhi-lavender-100">
                <div className="flex items-center justify-between mb-1.5 text-[11px] font-semibold text-sakhi-lavender-800">
                  <span>How to open the conversation:</span>
                  <button
                    onClick={() => handleCopy(adult.howToAsk, adult.id)}
                    className="flex items-center gap-1 text-sakhi-lavender-700 hover:text-sakhi-lavender-900"
                  >
                    {copiedId === adult.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === adult.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs italic text-slate-800 font-serif">
                  {adult.howToAsk}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              💡 {adult.safetyTip}
            </p>
          </div>
        ))}
      </div>

      {/* Practical Methods for Requesting Private Time */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          3 Practical Ways to Ask for a Private Talk
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          If saying it directly in front of others feels embarrassing, try these low-pressure methods:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-sakhi-teal-50/50 border border-sakhi-teal-100 text-xs sm:text-sm">
            <span className="font-bold text-sakhi-teal-800 block mb-1">1. The Written Note</span>
            <p className="text-slate-600 leading-relaxed">
              Write a short folded slip: "I need to discuss something private that is bothering me at school. When is a good time?" and hand it to your teacher.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sakhi-lavender-50/50 border border-sakhi-lavender-100 text-xs sm:text-sm">
            <span className="font-bold text-sakhi-lavender-800 block mb-1">2. The Evening Text</span>
            <p className="text-slate-600 leading-relaxed">
              Send a text message to your parent or older sibling: "Can you make sure we have quiet time alone tonight? I need your advice on a school issue."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <span className="font-bold text-slate-800 block mb-1">3. The Bring-a-Friend Method</span>
            <p className="text-slate-600 leading-relaxed">
              Ask your closest friend or sibling to walk into the counselor's office with you and sit beside you while you talk.
            </p>
          </div>
        </div>
      </section>

      {/* What if the first adult doesn't listen? */}
      <section className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-3">
        <h3 className="font-bold text-amber-950 text-base sm:text-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-700" />
          <span>What If the First Adult Dismisses You or Doesn't Take Action?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Sometimes an adult is busy, stressed, or fails to understand the seriousness of modern cyberbullying or subtle teasing.
          <strong> If an adult tells you to 'just ignore it' and it continues, DO NOT GIVE UP.</strong>
          Approach a school counselor, another teacher, or an elder relative. Your feelings are real, and you deserve a protector who listens.
        </p>
      </section>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sakhi-lavender-600 hover:bg-sakhi-lavender-700 text-white font-semibold text-xs sm:text-sm shadow-soft"
        >
          <span>Practice What to Say with SAKHI AI</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/resources"
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          View Resources on Personal Boundaries →
        </Link>
      </div>

    </div>
  );
};
