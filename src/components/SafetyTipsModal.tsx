import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  MapPin,
  Eye,
  KeyRound,
  Ban,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const SafetyTipsModal: React.FC = () => {
  const { isSafetyTipsOpen, setIsSafetyTipsOpen } = useApp();

  if (!isSafetyTipsOpen) return null;

  const safetyRules = [
    {
      icon: MapPin,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      title: 'Always Meet in Broad Daylight & Public Places',
      desc: 'Opt for well-lit public venues such as bank ATM vestibules, metro stations, coffee shops, or shopping malls with active CCTV coverage. Never agree to meet in private homes, parking basements, or deserted streets.',
    },
    {
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      title: 'Thoroughly Count & Inspect Cash Notes First',
      desc: 'Count physical currency in front of the Receiver. Check for standard security threads, watermarks, and clean paper condition before taking any action in the app.',
    },
    {
      icon: KeyRound,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      title: 'Share the OTP ONLY AFTER Cash is in Hand',
      desc: 'The 4-digit OTP is your final escrow release key. Once you give this OTP to the Receiver, your escrowed wallet funds are immediately transferred. Never disclose it prematurely.',
    },
    {
      icon: Ban,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      title: 'Zero-Penalty Safety Cancellation',
      desc: 'If a peer seems suspicious, aggressive, or demands meeting in an unfamiliar secluded zone, you have the right to cancel the request immediately. No cancellation penalty applies.',
    },
    {
      icon: PhoneCall,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      title: 'Simulated 24/7 Safety Helpline & SOS',
      desc: 'In case of discrepancies or emergency, access the built-in dispute resolution hotline or tap SOS to notify trusted contacts with live fuzzy coordinates.',
    },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">P2P Safety Guidelines</h3>
              <p className="text-[10px] text-slate-400">Best practices for safe in-person cash handover</p>
            </div>
          </div>
          <button
            onClick={() => setIsSafetyTipsOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Safety Alert Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-200 leading-relaxed font-medium">
            CashConnect escrow protects your digital funds until you physically verify cash and authorize the release with your secret one-time code.
          </p>
        </div>

        {/* Rules List */}
        <div className="space-y-2.5">
          {safetyRules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${rule.bg} ${rule.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{rule.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-8">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsSafetyTipsOpen(false)}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
        >
          I UNDERSTAND & AGREE TO FOLLOW SAFETY TIPS
        </button>
      </div>
    </div>
  );
};
