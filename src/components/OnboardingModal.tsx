import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Banknote,
  Coins,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen } = useApp();
  const [step, setStep] = useState<number>(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      icon: Banknote,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20 ring-blue-500/30',
      badge: 'Step 1 of 3 • Sender Mode',
      title: 'Need Cash Anytime',
      description:
        'Connect with verified nearby people to get cash when ATMs are far or out of service.',
      highlight: 'Broad nearby matching without revealing your private financial details.',
    },
    {
      icon: Coins,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20 ring-emerald-500/30',
      badge: 'Step 2 of 3 • Receiver Mode',
      title: 'Provide Cash & Earn',
      description:
        'Help others by providing cash and earn a guaranteed demo commission.',
      highlight: 'Earn instant commission credited directly to your demo wallet balance.',
    },
    {
      icon: ShieldCheck,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20 ring-amber-500/30',
      badge: 'Step 3 of 3 • Safety Shield',
      title: 'Safe & Verified',
      description:
        'Secure OTP verification, dual reputation scores, and private wallet protection.',
      highlight: 'Double-confirmation handover ensures reliable peer-to-peer exchanges.',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setIsOnboardingOpen(false);
      setStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white text-center space-y-5 shadow-2xl relative animate-scale-up">
        {/* Skip / Close */}
        <button
          onClick={() => {
            setIsOnboardingOpen(false);
            setStep(0);
          }}
          className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800/80"
        >
          Skip
        </button>

        {/* Step Indicator dots */}
        <div className="flex justify-center gap-2 pt-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                step === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 rounded-3xl ${currentSlide.bg} ring-4 flex items-center justify-center mx-auto transition-transform duration-300 transform scale-105`}>
          <Icon className={`w-10 h-10 ${currentSlide.color}`} />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
            {currentSlide.badge}
          </span>
          <h2 className="text-xl font-black text-white">{currentSlide.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            {currentSlide.description}
          </p>
        </div>

        {/* Highlight box */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-[11px] text-slate-400 flex items-center gap-2 text-left">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{currentSlide.highlight}</span>
        </div>

        {/* Action Button */}
        <button
          id="btn-onboarding-next"
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <span>{step === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
