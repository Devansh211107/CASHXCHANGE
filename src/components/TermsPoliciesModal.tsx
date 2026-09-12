import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Lock,
} from 'lucide-react';

export const TermsPoliciesModal: React.FC = () => {
  const {
    isTermsPoliciesOpen,
    setIsTermsPoliciesOpen,
    termsPoliciesInitialTab,
    setTermsPoliciesInitialTab,
  } = useApp();

  if (!isTermsPoliciesOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Legal & Compliance</h3>
              <p className="text-[10px] text-slate-400">Terms of Service & Privacy Policy</p>
            </div>
          </div>
          <button
            onClick={() => setIsTermsPoliciesOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setTermsPoliciesInitialTab('TERMS')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termsPoliciesInitialTab === 'TERMS'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setTermsPoliciesInitialTab('PRIVACY')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              termsPoliciesInitialTab === 'PRIVACY'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* CONTENT FOR TERMS */}
        {termsPoliciesInitialTab === 'TERMS' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Demonstration Notice:</strong> CashConnect is an interactive dummy prototype. All currencies, transactions, ledger balances, and OTPs are purely simulated mock data.
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">1. Peer-to-Peer Marketplace Scope</h4>
              <p className="text-[11px] text-slate-400">
                CashConnect provides a coordination interface connecting participants who need cash with nearby participants willing to provide cash. Users interact voluntarily and are responsible for validating counterpart identities.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">2. Escrow & Simulated Fee Structure</h4>
              <p className="text-[11px] text-slate-400">
                When a Sender initiates a cash request, the total amount (cash sum + 2% service fee) is held in digital escrow. The escrow is irreversibly finalized when the Sender enters the valid 4-digit OTP provided upon physical handover.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">3. Physical Meeting & Personal Liability</h4>
              <p className="text-[11px] text-slate-400">
                Users agree to conduct exchanges exclusively in public, well-lit venues. CashConnect assumes zero liability for disputes, counterfeit currency, or physical damages occurring outside the simulated software system.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">4. Dispute & Anti-Fraud Escalation</h4>
              <p className="text-[11px] text-slate-400">
                Any discrepancies regarding counterfeit notes, incorrect amounts, or non-appearance may be flagged using the built-in Dispute Center within 15 minutes of scheduled meeting time.
              </p>
            </div>
          </div>
        )}

        {/* CONTENT FOR PRIVACY */}
        {termsPoliciesInitialTab === 'PRIVACY' && (
          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-200 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Financial Data Retention:</strong> CashConnect never connects to, requests, or stores real bank credentials, credit card CVVs, or actual government identities.
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">1. Ephemeral Geolocation & Fuzzing</h4>
              <p className="text-[11px] text-slate-400">
                Your location is fuzzed by approximately 400–500 meters to protect your residential sanctuary. Real coordinates are never broadcast to public peers or third-party ad networks.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">2. Social Profile Linkage Privacy</h4>
              <p className="text-[11px] text-slate-400">
                Public handles linked to Twitter, LinkedIn, and Instagram are solely utilized to compute your peer Social Trust Rating. You can disconnect or hide social links at any time from your Privacy Settings.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">3. In-App Meeting Confidentiality</h4>
              <p className="text-[11px] text-slate-400">
                Wallet balances and private transaction histories are shielded during active meeting mode to ensure discretion in public spaces.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-white font-bold">4. Complete Data Erasure Rights</h4>
              <p className="text-[11px] text-slate-400">
                All prototype data is stored strictly in your browser's local sandbox. Tapping "Reset Demo Data" instantly purges all transactions, ratings, and logs.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsTermsPoliciesOpen(false)}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
