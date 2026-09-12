import React from 'react';
import { useApp } from '../context/AppContext';
import { Palette, Check, Moon, Sun, Sparkles } from 'lucide-react';
import { AppTheme } from '../types';

interface ThemeOption {
  id: AppTheme;
  name: string;
  subtitle: string;
  badge: string;
  bgPreview: string;
  accentPreview: string;
  isLight?: boolean;
}

const THEMES: ThemeOption[] = [
  {
    id: 'slate',
    name: 'Midnight Slate',
    subtitle: 'Classic deep fintech slate with emerald accents',
    badge: 'DEFAULT',
    bgPreview: 'bg-slate-900 border-slate-700',
    accentPreview: 'bg-emerald-500',
  },
  {
    id: 'emerald',
    name: 'Emerald Mint',
    subtitle: 'Lush organic dark green with mint currency accents',
    badge: 'FRESH',
    bgPreview: 'bg-[#062016] border-emerald-800',
    accentPreview: 'bg-emerald-400',
  },
  {
    id: 'amber',
    name: 'Obsidian Amber',
    subtitle: 'Rich dark obsidian charcoal with warm gold accents',
    badge: 'PREMIUM',
    bgPreview: 'bg-[#181411] border-amber-900/50',
    accentPreview: 'bg-amber-400',
  },
  {
    id: 'indigo',
    name: 'Electric Indigo',
    subtitle: 'High-tech neo-banking indigo with violet highlights',
    badge: 'CYBER',
    bgPreview: 'bg-[#0d1326] border-indigo-900',
    accentPreview: 'bg-indigo-400',
  },
  {
    id: 'light',
    name: 'Pristine Day Light',
    subtitle: 'Crisp, high-contrast light theme for bright daylight',
    badge: 'LIGHT',
    bgPreview: 'bg-slate-100 border-slate-300',
    accentPreview: 'bg-emerald-600',
    isLight: true,
  },
];

export const ThemeSelectorModal: React.FC = () => {
  const { theme, setTheme, isThemeSelectorOpen, setIsThemeSelectorOpen } = useApp();

  if (!isThemeSelectorOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">App Appearance & Theme</h3>
              <p className="text-[10px] text-slate-400">Personalize your CASHXCHANGE interface</p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeSelectorOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Theme List */}
        <div className="space-y-2.5">
          {THEMES.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Visual Theme Swatch */}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center relative shadow-inner ${opt.bgPreview}`}>
                    <div className={`w-3.5 h-3.5 rounded-full ${opt.accentPreview} shadow`} />
                    {opt.isLight ? (
                      <Sun className="w-2.5 h-2.5 text-slate-700 absolute bottom-0.5 right-0.5" />
                    ) : (
                      <Moon className="w-2.5 h-2.5 text-slate-300 absolute bottom-0.5 right-0.5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{opt.name}</span>
                      <span className="text-[9px] font-black text-slate-400 bg-slate-700/60 px-1.5 py-0.2 rounded">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {opt.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsThemeSelectorOpen(false)}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
        >
          APPLY THEME
        </button>
      </div>
    </div>
  );
};
