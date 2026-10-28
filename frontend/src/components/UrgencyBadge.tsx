import React from 'react';
import { UrgencyTier } from '../types';
import { ShieldAlert, AlertTriangle, Info, BellRing } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyTier;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  size = 'md',
  showDescription = false
}) => {
  const configs: Record<UrgencyTier, {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode;
    desc: string;
  }> = {
    low: {
      label: 'Low concern',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <Info className="w-3.5 h-3.5 text-emerald-600" />,
      desc: 'Everyday school difficulties, mild peer disagreements, or manageable exam tension.'
    },
    moderate: {
      label: 'Moderate concern',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
      desc: 'Repeated bullying, persistent teasing, cyber harassment, or distressing situations needing timely support.'
    },
    high: {
      label: 'High concern',
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      icon: <BellRing className="w-3.5 h-3.5 text-orange-600" />,
      desc: 'Boundary violations, unwanted physical contact, coercion, or threatening messages requiring adult intervention.'
    },
    urgent: {
      label: 'Immediate assistance recommended',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-300',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
      desc: 'Immediate physical danger, active violence, or imminent harm requiring immediate human help.'
    }
  };

  const current = configs[urgency] || configs.low;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={`inline-flex items-center font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]}`}>
        {current.icon}
        <span className="font-semibold">{current.label}</span>
      </div>
      {showDescription && (
        <p className="text-xs text-slate-500 mt-0.5 pl-1 leading-relaxed">
          {current.desc}
        </p>
      )}
    </div>
  );
};
