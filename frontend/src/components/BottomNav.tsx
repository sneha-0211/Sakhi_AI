import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageCircleHeart,
  Users,
  BookOpen,
  PhoneCall
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/chat', label: 'Talk', icon: MessageCircleHeart },
    { to: '/trusted-adults', label: 'Adults', icon: Users },
    { to: '/resources', label: 'Safety', icon: BookOpen },
    { to: '/emergency', label: 'Emergency', icon: PhoneCall, isAlert: true },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                  tab.isAlert
                    ? 'text-rose-600 hover:text-rose-700'
                    : isActive
                    ? 'text-sakhi-lavender-700 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive && !tab.isAlert ? 'bg-sakhi-lavender-100' : ''} ${tab.isAlert ? 'bg-rose-50' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
