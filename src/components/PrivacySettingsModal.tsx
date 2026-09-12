import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Eye,
  EyeOff,
  MapPin,
  Lock,
  Smartphone,
  Share2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PrivacySettings } from '../types';

export const PrivacySettingsModal: React.FC = () => {
  const {
    isPrivacySettingsOpen,
    setIsPrivacySettingsOpen,
    currentUser,
    updatePrivacySettings,
    resetDemoData,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isPrivacySettingsOpen) return null;

  const currentPrivacy: PrivacySettings = currentUser.privacySettings || {
    obfuscateLocation: true,
    profileVisibility: 'EVERYONE',
    hideBalanceInMeetings: true,
    biometricHandoverLock: true,
    showSocialProfiles: true,
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggle = (key: keyof PrivacySettings, currentVal: boolean) => {
    updatePrivacySettings({ [key]: !currentVal });
    showToast('Privacy setting updated');
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Privacy & Security Settings</h3>
              <p className="text-[10px] text-slate-400">Control your data, visibility & location fuzzing</p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivacySettingsOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Setting Items */}
        <div className="space-y-3">
          {/* Obfuscate Location */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">Fuzzy Location Obfuscation</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fuzzes your GPS coordinates by ±400m so nearby peers only see an approximate landmark, protecting your private home address.
              </p>
            </div>
            <button
              onClick={() => handleToggle('obfuscateLocation', currentPrivacy.obfuscateLocation)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                currentPrivacy.obfuscateLocation ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentPrivacy.obfuscateLocation ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Hide Balance In Meetings */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-xs font-bold text-white">Hide Balance During Meetings</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automatically masks your remaining wallet balance when meeting screen is active to avoid prying eyes during in-person handovers.
              </p>
            </div>
            <button
              onClick={() => handleToggle('hideBalanceInMeetings', currentPrivacy.hideBalanceInMeetings)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                currentPrivacy.hideBalanceInMeetings ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentPrivacy.hideBalanceInMeetings ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Biometric Handover Lock */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-white">Biometric Handover Lock</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Requires device biometric touch or PIN verification prior to releasing cash escrow to the Receiver.
              </p>
            </div>
            <button
              onClick={() => handleToggle('biometricHandoverLock', currentPrivacy.biometricHandoverLock)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                currentPrivacy.biometricHandoverLock ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentPrivacy.biometricHandoverLock ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Show Social Profiles */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-white">Display Social Trust Badges</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Allows nearby peers on the map to see your linked Twitter/LinkedIn profiles and 4.9 Trust Rating.
              </p>
            </div>
            <button
              onClick={() => handleToggle('showSocialProfiles', currentPrivacy.showSocialProfiles)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                currentPrivacy.showSocialProfiles ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentPrivacy.showSocialProfiles ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Profile Visibility Selector */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-white block">Peer Discovery Range</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  updatePrivacySettings({ profileVisibility: 'EVERYONE' });
                  showToast('Visibility: Visible to all nearby');
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  currentPrivacy.profileVisibility === 'EVERYONE'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                All Nearby Peers
              </button>
              <button
                onClick={() => {
                  updatePrivacySettings({ profileVisibility: 'MATCHED_ONLY' });
                  showToast('Visibility: Only after match');
                }}
                className={`p-2 rounded-xl border text-center transition-all ${
                  currentPrivacy.profileVisibility === 'MATCHED_ONLY'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Only Matched Peers
              </button>
            </div>
          </div>
        </div>

        {/* Reset Prototype Cache */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            <span>Prototype Local Data</span>
          </div>
          <button
            onClick={() => {
              resetDemoData();
              showToast('Demo state reset to default!');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold py-1 px-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
