import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Logo: Shield combined with supportive heart */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]} drop-shadow-sm transition-transform hover:scale-105 duration-200`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="shieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7633E6" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>
            <linearGradient id="heartGrad" x1="20" y1="30" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5EEFF" />
            </linearGradient>
          </defs>
          <path
            d="M50 10 C68 18 82 22 86 28 C87 54 75 78 50 90 C25 78 13 54 14 28 C18 22 32 18 50 10 Z"
            fill="url(#shieldGrad)"
          />
          <path
            d="M50 35 C45 28 34 27 28 34 C21 42 24 53 35 63 L50 75 L65 63 C76 53 79 42 72 34 C66 27 55 28 50 35 Z"
            fill="url(#heartGrad)"
            opacity="0.95"
          />
          <circle cx="50" cy="48" r="4.5" fill="#7633E6" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-display font-extrabold tracking-tight text-slate-900 leading-tight ${textSizes[size]}`}>
          SAKHI <span className="text-sakhi-lavender-600 font-bold">AI</span>
        </span>
        {showTagline && (
          <span className="text-xs font-medium text-slate-500 tracking-wide">
            Your Voice. Your Safety. Your Space.
          </span>
        )}
      </div>
    </div>
  );
};
