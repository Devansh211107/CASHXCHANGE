import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  Award,
  ExternalLink,
  CheckCircle2,
  Check,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Plus,
  Sparkles,
  Lock,
} from 'lucide-react';
import { SocialProfiles } from '../types';

export const SocialTrustModal: React.FC = () => {
  const { isSocialTrustOpen, setIsSocialTrustOpen, currentUser, updateSocialProfile } = useApp();

  const [editingPlatform, setEditingPlatform] = useState<keyof SocialProfiles | null>(null);
  const [handleInput, setHandleInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isSocialTrustOpen) return null;

  const profiles: SocialProfiles = currentUser.socialProfiles || {
    twitter: { handle: '@devansh_p2p', connected: true, verified: true, followersOrConnections: '1.8K followers' },
    linkedin: { handle: 'devansh-makwana', connected: true, verified: true, followersOrConnections: '500+ connections' },
    instagram: { handle: '@devansh.connected', connected: true, verified: false, followersOrConnections: '920 followers' },
    github: { handle: 'makwanadevansh007', connected: true, verified: true, followersOrConnections: '42 repos' },
  };

  const socialScore = currentUser.socialTrustScore || 4.9;

  const platformsConfig = [
    {
      key: 'twitter' as const,
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      prefix: 'x.com/',
    },
    {
      key: 'linkedin' as const,
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      prefix: 'linkedin.com/in/',
    },
    {
      key: 'instagram' as const,
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      prefix: 'instagram.com/',
    },
    {
      key: 'github' as const,
      name: 'GitHub',
      icon: Github,
      color: 'text-slate-200',
      bgColor: 'bg-slate-700/20',
      borderColor: 'border-slate-600/30',
      prefix: 'github.com/',
    },
  ];

  const handleSaveHandle = (key: keyof SocialProfiles) => {
    if (!handleInput.trim()) return;
    updateSocialProfile(key, {
      handle: handleInput.trim(),
      connected: true,
      verified: true,
      followersOrConnections: 'Verified Account',
    });
    setEditingPlatform(null);
    setHandleInput('');
    setToastMessage(`${key.toUpperCase()} profile linked & trust score updated!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleDisconnect = (key: keyof SocialProfiles) => {
    const current = profiles[key];
    updateSocialProfile(key, {
      handle: current?.handle || '',
      connected: !(current?.connected),
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Social Trust & Rating</h3>
              <p className="text-[10px] text-slate-400">Multi-Account Identity & Credibility</p>
            </div>
          </div>
          <button
            onClick={() => setIsSocialTrustOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Big Trust Rating Card */}
        <div className="bg-gradient-to-br from-amber-500/20 via-slate-800/80 to-slate-900 border border-amber-500/40 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
              P2P Social Trust Score
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">{socialScore}</span>
            <div className="text-left">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-300">Out of 5.0</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-black">
            <ShieldCheck className="w-3 h-3" />
            <span>Tier 1 Highest Trust Standing</span>
          </div>

          <p className="text-[11px] text-slate-300">
            Linking your active social media accounts builds instant confidence for nearby cash partners.
          </p>
        </div>

        {/* Connected Social Accounts */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-bold block">
            Connected Accounts & Verification
          </label>

          <div className="space-y-2">
            {platformsConfig.map((plat) => {
              const profile = profiles[plat.key];
              const Icon = plat.icon;
              const isEditing = editingPlatform === plat.key;

              return (
                <div
                  key={plat.key}
                  className={`bg-slate-800/80 border ${plat.borderColor} rounded-xl p-3 space-y-2 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${plat.bgColor} ${plat.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{plat.name}</span>
                          {profile?.verified && profile?.connected && (
                            <span className="bg-blue-600 text-white p-0.5 rounded-full" title="Verified Badge">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {profile?.connected && profile.handle ? profile.handle : 'Not connected'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {profile?.connected ? (
                        <button
                          onClick={() => {
                            setEditingPlatform(plat.key);
                            setHandleInput(profile.handle || '');
                          }}
                          className="text-[10px] font-bold text-slate-300 bg-slate-700/60 hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPlatform(plat.key);
                            setHandleInput('');
                          }}
                          className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Connect</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline edit field */}
                  {isEditing && (
                    <div className="pt-2 border-t border-slate-700/60 flex gap-2 animate-fade-in">
                      <input
                        type="text"
                        placeholder={`Enter your ${plat.name} handle`}
                        value={handleInput}
                        onChange={(e) => setHandleInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                      <button
                        onClick={() => handleSaveHandle(plat.key)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black shadow"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPlatform(null)}
                        className="px-2 py-1.5 text-slate-400 text-xs hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Followers / Stats info */}
                  {profile?.connected && profile.followersOrConnections && !isEditing && (
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/40">
                      <span>Network Reach: <strong className="text-slate-200">{profile.followersOrConnections}</strong></span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Link
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Trust Criteria */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-xs space-y-1.5">
          <span className="text-[11px] font-bold text-slate-300 block">Trust Calculation Factors:</span>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
            <div>✓ 4 linked social handles (+0.9)</div>
            <div>✓ 98.6% handover rating (+3.5)</div>
            <div>✓ Zero dispute history (+0.4)</div>
            <div>✓ Aadhaar demo verified (+0.2)</div>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 bg-amber-500 text-slate-950 px-4 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
