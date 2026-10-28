import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, X, ChevronDown, Pipette } from 'lucide-react';
import { useTheme, PRESET_THEMES, Theme } from '../context/ThemeContext';

interface ThemeSwitcherProps {
  compact?: boolean; // for mobile nav
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ compact = false }) => {
  const { theme, setTheme, setCustomGradient, setCustomSolid } = useTheme();
  const [open, setOpen] = useState(false);
  const [customColor1, setCustomColor1] = useState('#7633E6');
  const [customColor2, setCustomColor2] = useState('#14B8A6');
  const [showCustom, setShowCustom] = useState(false);
  const [gradientMode, setGradientMode] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const applyCustom = () => {
    if (gradientMode) {
      setCustomGradient(customColor1, customColor2);
    } else {
      setCustomSolid(customColor1);
    }
    setOpen(false);
  };

  const presets = PRESET_THEMES.filter(t => !t.isCustom);

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        title="Change background theme"
        aria-label="Open theme switcher"
        className={`flex items-center gap-1.5 rounded-xl border transition-all duration-200 font-semibold ${
          compact
            ? 'px-2 py-1.5 text-xs'
            : 'px-2.5 py-1.5 text-xs'
        } ${
          theme.isDark
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-sakhi-lavender-50 border-sakhi-lavender-200 text-sakhi-lavender-700 hover:bg-sakhi-lavender-100'
        }`}
      >
        {/* Live swatch */}
        <span
          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-white/60"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent2} 100%)`,
          }}
        />
        {!compact && (
          <>
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theme</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </>
        )}
        {compact && <Palette className="w-3.5 h-3.5" />}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className={`absolute z-[999] mt-2 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
            compact ? 'right-0' : 'right-0'
          }`}
          style={{
            width: 280,
            background: theme.isDark ? 'rgba(20,14,40,0.98)' : 'rgba(255,255,255,0.98)',
            borderColor: theme.isDark ? '#2D1F4A' : '#E3D5FF',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: theme.isDark ? '#2D1F4A' : '#F0EAFF' }}
          >
            <div className="flex items-center gap-2">
              <Palette className={`w-4 h-4 ${theme.isDark ? 'text-purple-400' : 'text-sakhi-lavender-600'}`} />
              <span className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
                Background Theme
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className={`p-1 rounded-lg ${theme.isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Grid */}
          <div className="p-3">
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              Preset Themes
            </p>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t); setShowCustom(false); }}
                  title={t.name}
                  className="group flex flex-col items-center gap-1.5 p-1.5 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    background: theme.id === t.id
                      ? (theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(118,51,230,0.08)')
                      : 'transparent',
                  }}
                >
                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-full shadow-md border-2 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent2} 100%)`,
                      borderColor: theme.id === t.id ? '#7633E6' : 'transparent',
                    }}
                  >
                    {/* Animated checkmark when selected */}
                    {theme.id === t.id && (
                      <Check className="w-4 h-4 text-white drop-shadow-sm" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold leading-tight text-center"
                    style={{ color: theme.isDark ? '#CBD5E1' : '#475569' }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Theme name display */}
            <div
              className="mt-2 text-center text-xs font-bold py-1 rounded-lg"
              style={{
                color: theme.isDark ? '#A78BFA' : '#7633E6',
                background: theme.isDark ? 'rgba(167,139,250,0.1)' : 'rgba(118,51,230,0.06)',
              }}
            >
              {theme.label} {theme.name}
            </div>
          </div>

          {/* Divider */}
          <div
            className="mx-3 border-t"
            style={{ borderColor: theme.isDark ? '#2D1F4A' : '#F0EAFF' }}
          />

          {/* Custom Color Section */}
          <div className="p-3">
            <button
              onClick={() => setShowCustom(v => !v)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                theme.isDark
                  ? 'bg-white/8 hover:bg-white/15 text-purple-300'
                  : 'bg-sakhi-lavender-50 hover:bg-sakhi-lavender-100 text-sakhi-lavender-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Pipette className="w-3.5 h-3.5" />
                Custom Color
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCustom ? 'rotate-180' : ''}`} />
            </button>

            {showCustom && (
              <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* Gradient / Solid toggle */}
                <div
                  className="flex rounded-xl overflow-hidden border text-xs font-bold"
                  style={{ borderColor: theme.isDark ? '#2D1F4A' : '#E3D5FF' }}
                >
                  <button
                    onClick={() => setGradientMode(true)}
                    className="flex-1 py-1.5 transition-all"
                    style={{
                      background: gradientMode
                        ? (theme.isDark ? '#7633E6' : '#7633E6')
                        : 'transparent',
                      color: gradientMode ? 'white' : (theme.isDark ? '#94A3B8' : '#64748B'),
                    }}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => setGradientMode(false)}
                    className="flex-1 py-1.5 transition-all"
                    style={{
                      background: !gradientMode
                        ? (theme.isDark ? '#7633E6' : '#7633E6')
                        : 'transparent',
                      color: !gradientMode ? 'white' : (theme.isDark ? '#94A3B8' : '#64748B'),
                    }}
                  >
                    Solid
                  </button>
                </div>

                {/* Color pickers */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label
                      className="block text-[11px] font-semibold mb-1"
                      style={{ color: theme.isDark ? '#94A3B8' : '#64748B' }}
                    >
                      {gradientMode ? 'Color 1' : 'Background'}
                    </label>
                    <div className="relative">
                      <input
                        type="color"
                        value={customColor1}
                        onChange={e => setCustomColor1(e.target.value)}
                        className="w-full h-10 rounded-xl cursor-pointer border-0 p-0.5"
                        style={{
                          background: theme.isDark ? '#1A1030' : '#F8F5FF',
                          border: `1px solid ${theme.isDark ? '#2D1F4A' : '#E3D5FF'}`,
                        }}
                      />
                    </div>
                  </div>

                  {gradientMode && (
                    <>
                      <div
                        className="text-xs font-bold self-end mb-2"
                        style={{ color: theme.isDark ? '#64748B' : '#94A3B8' }}
                      >
                        →
                      </div>
                      <div className="flex-1">
                        <label
                          className="block text-[11px] font-semibold mb-1"
                          style={{ color: theme.isDark ? '#94A3B8' : '#64748B' }}
                        >
                          Color 2
                        </label>
                        <input
                          type="color"
                          value={customColor2}
                          onChange={e => setCustomColor2(e.target.value)}
                          className="w-full h-10 rounded-xl cursor-pointer border-0 p-0.5"
                          style={{
                            background: theme.isDark ? '#1A1030' : '#F8F5FF',
                            border: `1px solid ${theme.isDark ? '#2D1F4A' : '#E3D5FF'}`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Live Preview */}
                <div
                  className="h-10 rounded-xl border shadow-inner"
                  style={{
                    background: gradientMode
                      ? `linear-gradient(135deg, ${customColor1} 0%, ${customColor2} 100%)`
                      : customColor1,
                    borderColor: theme.isDark ? '#2D1F4A' : '#E3D5FF',
                  }}
                />

                {/* Apply button */}
                <button
                  onClick={applyCustom}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #7633E6 0%, #0D9488 100%)',
                    boxShadow: '0 4px 15px rgba(118,51,230,0.35)',
                  }}
                >
                  Apply Custom Background
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div
            className="px-4 pb-3 text-center text-[10px]"
            style={{ color: theme.isDark ? '#475569' : '#94A3B8' }}
          >
            Your theme choice is saved automatically
          </div>
        </div>
      )}
    </div>
  );
};
