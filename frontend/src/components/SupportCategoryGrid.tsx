import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import {
  Users,
  ShieldAlert,
  Globe,
  GraduationCap,
  Shield,
  Heart,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  example: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
}

export const SupportCategoryGrid: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useSession();

  const categories: CategoryItem[] = [
    {
      id: 'friendship_conflicts',
      title: 'Friends & Relationships',
      example: 'A fight, rumors, or silent treatment.',
      icon: Users,
      gradient: 'from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'bullying',
      title: 'Bullying & Teasing',
      example: 'Someone keeps teasing or excluding me.',
      icon: ShieldAlert,
      gradient: 'from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'cyberbullying',
      title: 'Online Safety',
      example: 'Something online made me uncomfortable.',
      icon: Globe,
      gradient: 'from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      badgeColor: 'bg-cyan-100 text-cyan-700',
    },
    {
      id: 'academic_stress',
      title: 'School & Studies',
      example: 'I feel stressed about exams and grades.',
      icon: GraduationCap,
      gradient: 'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'personal_boundaries',
      title: 'Personal Boundaries',
      example: 'Someone stood too close or touched me.',
      icon: Shield,
      gradient: 'from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'emotional_distress',
      title: 'Feeling Overwhelmed',
      example: 'Feeling anxious, lonely, or crying a lot.',
      icon: Heart,
      gradient: 'from-purple-50 to-fuchsia-50 hover:from-purple-100 hover:to-fuchsia-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'general_support',
      title: 'Something Else',
      example: 'Describe any problem in your own words.',
      icon: HelpCircle,
      gradient: 'from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/chat?category=${categoryId}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
            What kind of support do you need?
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tap any topic to open a safe, tailored conversation.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sakhi-lavender-600 bg-sakhi-lavender-50 px-3 py-1 rounded-full border border-sakhi-lavender-100">
          <Sparkles className="w-3.5 h-3.5" />
          7 Support Areas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`feature-card flex flex-col justify-between text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-sm active:scale-[0.98] group`}
            >
              <div>
                {/* Icon circle with glow */}
                <div className={`w-11 h-11 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1.5">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{cat.example}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-white/60 flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cat.badgeColor}`}>
                  Get help
                </span>
                <div className="w-6 h-6 rounded-full bg-white/60 flex items-center justify-center group-hover:bg-white/90 group-hover:shadow-sm transition-all">
                  <ArrowRight className={`w-3.5 h-3.5 ${cat.iconColor} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
