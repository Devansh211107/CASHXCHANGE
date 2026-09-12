import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Bell,
  Sparkles,
  Users,
  Smartphone,
  RotateCcw,
  SlidersHorizontal,
  Palette,
  ScanLine,
  QrCode,
} from 'lucide-react';
import { User } from '../types';

export const Header: React.FC = () => {
  const {
    state,
    currentUser,
    unreadNotifsCount,
    setIsNotificationsOpen,
    setIsOnboardingOpen,
    switchUser,
    isDualView,
    setIsDualView,
    resetDemoData,
    runSection50Scenario,
    setCurrentTab,
    currentTab,
    setIsThemeSelectorOpen,
    setIsQrScannerOpen,
    setIsReceiveQrOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3">
      {/* Top Utility / Demo Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            DEMO MODE
          </span>
          <button
            id="btn-section50-demo"
            onClick={runSection50Scenario}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20"
            title="Click to run the exact Section 50 scenario (Devansh ₹2,000 cash from Amit)"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Scenario 50 Demo</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual Phone View Toggle for desktop presentation */}
          <button
            id="btn-dual-view"
            onClick={() => setIsDualView(!isDualView)}
            className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
              isDualView
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle side-by-side Dual Phone simulation (Sender + Receiver)"
          >
            <Smartphone className="w-3 h-3" />
            <span>{isDualView ? 'Single View' : 'Dual Phone View'}</span>
          </button>

          {/* Quick User Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
            <Users className="w-3 h-3 text-slate-400" />
            <select
              id="select-user-switcher"
              aria-label="Switch Active Demo User"
              value={state.currentUserId}
              onChange={(e) => switchUser(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              {(Object.values(state.users) as User[]).map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-800 text-white">
                  {u.name} ({u.availability === 'AVAILABLE' ? '🟢' : u.availability === 'BUSY' ? '🟡' : '⚪'})
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-reset-demo"
            onClick={resetDemoData}
            className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Reset All Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Brand & User Header */}
      <div className="flex items-center justify-between">
        {/* App Logo and Name */}
        <div
          id="brand-logo-container"
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="font-bold text-white text-lg tracking-tight">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">CASHXCHANGE</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 font-medium rounded border border-blue-500/30">
                P2P Cash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Peer-to-Peer Cash Access</p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Quick Theme Switcher */}
          <button
            id="btn-header-theme"
            onClick={() => setIsThemeSelectorOpen(true)}
            className="p-2 text-slate-400 hover:text-pink-300 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Change Theme & Appearance"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Quick QR Scanner for send money */}
          <button
            id="btn-header-scan"
            onClick={() => setIsQrScannerOpen(true)}
            className="p-2 text-slate-400 hover:text-blue-300 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Scan QR to Send Money"
          >
            <ScanLine className="w-4 h-4" />
          </button>

          {/* Admin Dashboard shortcut */}
          <button
            id="btn-header-admin"
            onClick={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
            className={`p-2 rounded-xl transition-colors ${
              currentTab === 'admin'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
            title="Admin Dashboard"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Tutorial / Onboarding */}
          <button
            id="btn-header-onboarding"
            onClick={() => setIsOnboardingOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="View App Tour"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          {/* Notifications Bell */}
          <button
            id="btn-header-notifications"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Avatar & Verified Badge */}
          <div
            id="header-user-badge"
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              {currentUser.verified && (
                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 ring-1 ring-slate-900" title="Verified User">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
