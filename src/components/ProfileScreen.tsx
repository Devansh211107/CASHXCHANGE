import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  Phone,
  Mail,
  Calendar,
  Lock,
  Bell,
  HelpCircle,
  KeyRound,
  Check,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Share2,
  Shield,
  EyeOff,
  FileText,
  Scale,
  Palette,
  QrCode,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { User } from '../types';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    setIsNotificationsOpen,
    setIsOnboardingOpen,
    state,
    switchUser,
    setIsSocialTrustOpen,
    setIsPrivacySettingsOpen,
    setIsSafetyTipsOpen,
    openTermsPolicies,
    setIsThemeSelectorOpen,
    setIsReceiveQrOpen,
    theme,
  } = useApp();

  const [demoPin, setDemoPin] = useState('1234');
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSavePin = () => {
    if (newPin.length === 4) {
      setDemoPin(newPin);
      setPinSaved(true);
      setTimeout(() => {
        setPinSaved(false);
        setShowPinModal(false);
        setNewPin('');
      }, 1000);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 max-w-md mx-auto w-full">
      {/* 1. Main Profile Card (Section 4 & 25) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500 shadow-md"
            />
            {currentUser.verified && (
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 ring-2 ring-slate-900" title="Verified Account">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{currentUser.name}</h2>
              {currentUser.verified && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ✅ Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ID: <span className="font-mono text-slate-300">{currentUser.id}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-slate-500" />
              <span>{currentUser.phone}</span>
            </p>
          </div>
        </div>

        {/* Account Details & Role Flexibility Banner (Section 4) */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Single Account • Dual Role Model</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            You can act as a <strong>Sender</strong> (need physical cash) or a <strong>Receiver</strong> (provide cash & earn commission) anytime using this single profile.
          </p>
        </div>
      </div>

      {/* 2. Section 5: THE TWO SEPARATE RATINGS (CRITICAL: NEVER COMBINED) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Reputation & Dual Ratings (Never Combined)
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Sender Rating Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase">
                Sender Rating
              </span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{currentUser.senderRating}</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold text-white">{currentUser.senderCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-bold text-emerald-400">{currentUser.senderSuccessRate}%</span>
              </div>
            </div>
          </div>

          {/* Receiver Rating Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Receiver Rating
              </span>
              <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{currentUser.receiverRating}</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-bold text-white">{currentUser.receiverCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-bold text-emerald-400">{currentUser.receiverSuccessRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Social Media Account Rating & Trust Standing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Social Media Rating & Trust
              </h3>
              <p className="text-[10px] text-slate-400">Public peer accountability standing</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-extrabold text-white">4.9 / 5.0</span>
          </div>
        </div>

        {/* Social Accounts Badges */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sky-400 font-bold">𝕏</span>
              <span className="text-slate-300 truncate">
                {currentUser.socialProfiles?.twitter?.handle || '@devansh_p2p'}
              </span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-blue-400 font-bold">in</span>
              <span className="text-slate-300 truncate">
                {currentUser.socialProfiles?.linkedin?.handle || 'devansh-p2p'}
              </span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-pink-400 font-bold">IG</span>
              <span className="text-slate-300 truncate">
                {currentUser.socialProfiles?.instagram?.handle || '@devansh.connect'}
              </span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-purple-400 font-bold">git</span>
              <span className="text-slate-300 truncate">
                {currentUser.socialProfiles?.github?.handle || 'devansh007'}
              </span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
          </div>
        </div>

        <button
          id="btn-manage-social-trust"
          onClick={() => setIsSocialTrustOpen(true)}
          className="w-full py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white rounded-xl text-xs font-bold border border-sky-500/30 flex items-center justify-center gap-1.5 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Manage Social Profiles & Trust Score</span>
        </button>
      </div>

      {/* 3. Section 25 & 34: Profile Action Buttons & Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 overflow-hidden text-xs">
        {/* Receive QR Code */}
        <button
          id="btn-profile-receive-qr"
          onClick={() => setIsReceiveQrOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Receive QR Code</span>
              <span className="text-[11px] text-slate-400">Show personal QR to receive demo funds</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Change Theme Option */}
        <button
          id="btn-profile-theme"
          onClick={() => setIsThemeSelectorOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Change Theme & Appearance</span>
              <span className="text-[11px] text-slate-400">
                Active theme: <strong className="capitalize text-pink-300">{theme}</strong> (5 color schemes)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Privacy & Settings */}
        <button
          id="btn-profile-privacy-settings"
          onClick={() => setIsPrivacySettingsOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Privacy & Safety Settings</span>
              <span className="text-[11px] text-slate-400">Location fuzzing, hide balance, biometric lock</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Safety Tips */}
        <button
          id="btn-profile-safety-tips"
          onClick={() => setIsSafetyTipsOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Safety Tips & Guidelines</span>
              <span className="text-[11px] text-slate-400">Safe cash exchange protocols in public</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Terms & Conditions (T&C) */}
        <button
          id="btn-profile-terms"
          onClick={() => openTermsPolicies('TERMS')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Terms & Conditions (T&C)</span>
              <span className="text-[11px] text-slate-400">P2P marketplace rules & escrow terms</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Privacy Policy */}
        <button
          id="btn-profile-privacy-policy"
          onClick={() => openTermsPolicies('PRIVACY')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Privacy & Security Policies</span>
              <span className="text-[11px] text-slate-400">Zero financial data retention & encryption</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Security & PIN */}
        <button
          id="btn-profile-security"
          onClick={() => setShowPinModal(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Security & Demo PIN</span>
              <span className="text-[11px] text-slate-400">Current PIN: •••• ({demoPin})</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Notifications */}
        <button
          id="btn-profile-notifications"
          onClick={() => setIsNotificationsOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Notifications</span>
              <span className="text-[11px] text-slate-400">View activity and request alerts</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* App Tour / Onboarding */}
        <button
          id="btn-profile-tour"
          onClick={() => setIsOnboardingOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">App Onboarding Tour</span>
              <span className="text-[11px] text-slate-400">Replay the 3-step prototype walkthrough</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Help & Support */}
        <button
          id="btn-profile-help"
          onClick={() => setShowHelpModal(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Help & Educational FAQs</span>
              <span className="text-[11px] text-slate-400">College project design and safety guide</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* 4. Switch Account for Demo Testing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Switch Demo Account</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Quickly switch personas to experience CASHXCHANGE from different perspectives:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {(Object.values(state.users) as User[]).slice(0, 4).map((u) => (
            <button
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={`p-2 rounded-xl border text-xs font-bold text-left transition-colors ${
                u.id === currentUser.id
                  ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <div className="line-clamp-1">{u.name}</div>
              <div className="text-[10px] text-slate-400 font-normal">
                {u.id === 'user-devansh' ? 'Default Tester' : `${u.receiverRating} ⭐ Receiver`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL: Demo PIN Setup (Section 34) */}
      {showPinModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold">Demo Security PIN</h4>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400">✕</button>
            </div>

            {pinSaved ? (
              <div className="py-4 text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Demo PIN Updated!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Set your 4-digit mock security PIN:
                </p>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 4829"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSavePin}
                  disabled={newPin.length !== 4}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  SAVE DEMO PIN
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Help & Educational FAQs */}
      {showHelpModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold">CASHXCHANGE Guide</h4>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400">✕</button>
            </div>
            <div className="text-xs text-slate-300 space-y-3">
              <div>
                <h5 className="font-bold text-blue-300 mb-0.5">What is CASHXCHANGE?</h5>
                <p className="text-[11px] text-slate-400">
                  A peer-to-peer cash marketplace prototype where Senders needing physical currency match with nearby Receivers who have cash.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-emerald-300 mb-0.5">How do Receivers earn?</h5>
                <p className="text-[11px] text-slate-400">
                  Receivers receive the full digital value of the cash given plus a 50% share of the service fee as a guaranteed demo commission.
                </p>
              </div>
              <div>
                <h5 className="font-bold text-amber-300 mb-0.5">How does privacy work?</h5>
                <p className="text-[11px] text-slate-400">
                  Wallet balances and bank information are strictly confidential and never displayed to other users during nearby matching.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
