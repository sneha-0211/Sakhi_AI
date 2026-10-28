import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Theme {
  id: string;
  name: string;
  label: string;
  bg: string;           // CSS background value (gradient or solid)
  accent: string;       // Hex accent for swatch preview
  accent2: string;      // Second accent for gradient swatch
  isDark: boolean;
  isCustom?: boolean;
}

export const PRESET_THEMES: Theme[] = [
  {
    id: 'lavender',
    name: 'Lavender Dream',
    label: '🌸',
    bg: 'linear-gradient(160deg, #F0EAFF 0%, #F7F5FF 40%, #EBF5FF 100%)',
    accent: '#7633E6',
    accent2: '#B088FF',
    isDark: false,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    label: '🌙',
    bg: 'linear-gradient(160deg, #0F0A1E 0%, #1A1030 50%, #0D1A2B 100%)',
    accent: '#8E51FF',
    accent2: '#14B8A6',
    isDark: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    label: '🌊',
    bg: 'linear-gradient(160deg, #E0F7FA 0%, #E8F5FF 40%, #F0FFF4 100%)',
    accent: '#0D9488',
    accent2: '#06B6D4',
    isDark: false,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    label: '🌅',
    bg: 'linear-gradient(160deg, #FFF1F2 0%, #FFF7ED 45%, #FFFBEB 100%)',
    accent: '#F43F5E',
    accent2: '#F59E0B',
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Forest Calm',
    label: '🌿',
    bg: 'linear-gradient(160deg, #ECFDF5 0%, #F0FDF9 50%, #F7FEE7 100%)',
    accent: '#059669',
    accent2: '#65A30D',
    isDark: false,
  },
  {
    id: 'rose',
    name: 'Rose Petal',
    label: '🌹',
    bg: 'linear-gradient(160deg, #FFF0F6 0%, #FCE7F3 40%, #FDF2F8 100%)',
    accent: '#EC4899',
    accent2: '#F43F5E',
    isDark: false,
  },
  {
    id: 'slate',
    name: 'Cool Slate',
    label: '🩶',
    bg: 'linear-gradient(160deg, #F1F5F9 0%, #F8FAFC 50%, #EFF6FF 100%)',
    accent: '#475569',
    accent2: '#3B82F6',
    isDark: false,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    label: '✨',
    bg: 'linear-gradient(160deg, #0A0E27 0%, #0D1B2A 30%, #0A1628 60%, #0E1020 100%)',
    accent: '#22D3EE',
    accent2: '#A855F7',
    isDark: true,
  },
  {
    id: 'peach',
    name: 'Peach Cream',
    label: '🍑',
    bg: 'linear-gradient(160deg, #FFF8F3 0%, #FFF1E6 45%, #FFFBF5 100%)',
    accent: '#EA580C',
    accent2: '#F59E0B',
    isDark: false,
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    label: '🔮',
    bg: 'linear-gradient(160deg, #1E0B3B 0%, #0F0520 40%, #1A0A35 70%, #0D1530 100%)',
    accent: '#C084FC',
    accent2: '#F472B6',
    isDark: true,
  },
  {
    id: 'custom',
    name: 'Custom Color',
    label: '🎨',
    bg: '#FAF8F5',
    accent: '#7633E6',
    accent2: '#14B8A6',
    isDark: false,
    isCustom: true,
  },
];

export const DEFAULT_THEME = PRESET_THEMES[0];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setCustomGradient: (color1: string, color2: string) => void;
  setCustomSolid: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  setCustomGradient: () => {},
  setCustomSolid: () => {},
});

const STORAGE_KEY = 'sakhi_theme_id';
const STORAGE_CUSTOM_BG = 'sakhi_custom_bg';
const STORAGE_CUSTOM_DARK = 'sakhi_custom_dark';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY);
      if (savedId === 'custom') {
        const savedBg = localStorage.getItem(STORAGE_CUSTOM_BG);
        const savedDark = localStorage.getItem(STORAGE_CUSTOM_DARK) === 'true';
        if (savedBg) {
          return { ...PRESET_THEMES.find(t => t.id === 'custom')!, bg: savedBg, isDark: savedDark };
        }
      }
      return PRESET_THEMES.find(t => t.id === savedId) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t.id); } catch {}
  }, []);

  const setCustomGradient = useCallback((color1: string, color2: string) => {
    const bg = `linear-gradient(160deg, ${color1} 0%, ${color2} 100%)`;
    const dark = isColorDark(color1) && isColorDark(color2);
    const t: Theme = {
      ...PRESET_THEMES.find(t => t.id === 'custom')!,
      bg,
      accent: color1,
      accent2: color2,
      isDark: dark,
    };
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, 'custom');
      localStorage.setItem(STORAGE_CUSTOM_BG, bg);
      localStorage.setItem(STORAGE_CUSTOM_DARK, String(dark));
    } catch {}
  }, []);

  const setCustomSolid = useCallback((color: string) => {
    const dark = isColorDark(color);
    const t: Theme = {
      ...PRESET_THEMES.find(t => t.id === 'custom')!,
      bg: color,
      accent: color,
      accent2: color,
      isDark: dark,
    };
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, 'custom');
      localStorage.setItem(STORAGE_CUSTOM_BG, color);
      localStorage.setItem(STORAGE_CUSTOM_DARK, String(dark));
    } catch {}
  }, []);

  // Apply background to body
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.transition = 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    if (theme.isDark) {
      document.body.classList.add('theme-dark');
      document.body.style.color = '#f1f5f9';
    } else {
      document.body.classList.remove('theme-dark');
      document.body.style.color = '';
    }
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundAttachment = '';
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setCustomGradient, setCustomSolid }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Utility: detect if a hex color is perceptually dark
function isColorDark(hex: string): boolean {
  try {
    const h = hex.replace('#', '');
    if (h.length !== 6) return false;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 100;
  } catch {
    return false;
  }
}
