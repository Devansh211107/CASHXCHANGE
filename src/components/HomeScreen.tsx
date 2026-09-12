import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  AlertCircle,
  ChevronRight,
  Clock,
  Sparkles,
  QrCode,
  ScanLine,
  Smartphone,
  PlusCircle,
} from 'lucide-react';
import { Transaction } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    currentWallet,
    activeTransaction,
    state,
    setIsSenderModalOpen,
    setIsReceiverModalOpen,
    setSelectedTxId,
    updateAvailability,
    setCurrentTab,
    acceptRequest,
    declineRequest,
    setIsReceiveQrOpen,
    setIsQrScannerOpen,
    setIsUpiTopUpOpen,
  } = useApp();

  // Check if someone sent a pending request to this user as Receiver
  const incomingRequest = (Object.values(state.transactions) as Transaction[]).find(
    (tx) => tx.receiverId === currentUser.id && tx.status === 'REQUESTED'
  );

  const senderUser = incomingRequest ? state.users[incomingRequest.senderId] : null;

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 max-w-md mx-auto w-full">
      {/* 1. Header Identity & Verified Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50"
              />
              {currentUser.verified && (
                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-slate-900" title="Verified User">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight text-white">{currentUser.name}</h1>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">P2P Member • ID: {currentUser.id.replace('user-', '').toUpperCase()}</p>
            </div>
          </div>

          {/* Quick Availability Badge */}
          <div className="text-right">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Receiver Mode
            </label>
            <div className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-full px-2.5 py-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser.availability === 'AVAILABLE'
                    ? 'bg-emerald-400 animate-pulse'
                    : currentUser.availability === 'BUSY'
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
              />
              <select
                id="select-home-availability"
                aria-label="Receiver Availability Mode"
                value={currentUser.availability}
                onChange={(e) => updateAvailability(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="AVAILABLE" className="bg-slate-900 text-emerald-400">Available</option>
                <option value="BUSY" className="bg-slate-900 text-amber-400">Busy</option>
                <option value="OFFLINE" className="bg-slate-900 text-slate-400">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Wallet Balance Card (Section 3, 7, 26) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase font-medium text-slate-400 tracking-wider">
              Demo Wallet Balance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-white tracking-tight">
                ₹{currentWallet.balance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                DEMO
              </span>
            </div>
          </div>
          <button
            id="btn-home-view-wallet"
            onClick={() => setCurrentTab('wallet')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>Manage Wallet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick QR & UPI Actions Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <button
            id="btn-home-scan-qr"
            onClick={() => setIsQrScannerOpen(true)}
            className="py-2 px-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <ScanLine className="w-4 h-4 text-blue-400" />
            <span>Scan to Send</span>
          </button>

          <button
            id="btn-home-receive-qr"
            onClick={() => setIsReceiveQrOpen(true)}
            className="py-2 px-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Receive QR</span>
          </button>

          <button
            id="btn-home-upi-topup"
            onClick={() => setIsUpiTopUpOpen(true)}
            style={{ backgroundColor: '#130b24' }}
            className="py-2 px-1.5 rounded-xl border border-purple-500/30 text-purple-300 hover:text-white text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>UPI Top-Up</span>
          </button>
        </div>

        {/* 3. Dual Ratings Status Bar (Section 5 & 26) */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Sender Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-sm">{currentUser.senderRating}</span>
              <span className="text-[11px] text-slate-400">({currentUser.senderCompleted} sent)</span>
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 block font-medium">Receiver Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span className="font-bold text-white text-sm">{currentUser.receiverRating}</span>
              <span className="text-[11px] text-slate-400">({currentUser.receiverCompleted} given)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Transaction Banner (if in progress) */}
      {activeTransaction && (
        <div
          id="banner-active-transaction"
          onClick={() => setSelectedTxId(activeTransaction.id)}
          className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/40 rounded-2xl p-3.5 text-white cursor-pointer hover:border-blue-400 transition-all shadow-lg flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400 ring-1 ring-blue-500/40 animate-pulse">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Active Transaction
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-200 rounded border border-blue-400/30">
                  {activeTransaction.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                ₹{activeTransaction.amount.toLocaleString('en-IN')} Cash Handover • Tap to Resume
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* 5. Incoming Request Alert for Current User (Section 12) */}
      {incomingRequest && senderUser && (
        <div
          id="card-incoming-request"
          className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 text-white shadow-xl animate-bounce-short"
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>New Cash Request!</span>
            </div>
            <span className="text-[11px] text-amber-200 font-medium">Just now</span>
          </div>

          <div className="flex items-center gap-3 my-3">
            <img
              src={senderUser.profileImage}
              alt={senderUser.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400/40"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base">{senderUser.name}</span>
                {senderUser.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" title="Verified Sender" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {senderUser.senderRating}
                </span>
                <span>•</span>
                <span>{senderUser.senderCompleted} completed sender txns</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Requested</span>
              <span className="text-xl font-extrabold text-white">
                ₹{incomingRequest.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-amber-500/20">
            <button
              id="btn-decline-incoming-request"
              onClick={() => declineRequest(incomingRequest.id)}
              className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Decline
            </button>
            <button
              id="btn-accept-incoming-request"
              onClick={() => {
                acceptRequest(incomingRequest.id);
                setSelectedTxId(incomingRequest.id);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-600/30"
            >
              Accept (Earn ₹{incomingRequest.receiverCommission})
            </button>
          </div>
        </div>
      )}

      {/* 6. Section 3: THE TWO MAIN ACTION BUTTONS ONLY */}
      <div className="space-y-3 pt-2">
        {/* BUTTON 1: SENDER REQUEST */}
        <button
          id="btn-sender-request"
          onClick={() => setIsSenderModalOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl p-5 text-left transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-blue-600/25 border border-blue-400/20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
                <ArrowDownToLine className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-white uppercase">
                  SENDER REQUEST
                </h2>
                <p className="text-sm text-blue-100 font-medium mt-0.5">Need cash?</p>
                <p className="text-[11px] text-blue-200/80 mt-1">
                  Pay digitally from demo wallet • Meet nearby verified receiver
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </button>

        {/* BUTTON 2: RECEIVER REQUEST */}
        <button
          id="btn-receiver-request"
          onClick={() => setIsReceiverModalOpen(true)}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl p-5 text-left transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-600/25 border border-emerald-400/20 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
                <ArrowUpFromLine className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-white uppercase">
                  RECEIVER REQUEST
                </h2>
                <p className="text-sm text-emerald-100 font-medium mt-0.5">
                  Provide cash and earn commission
                </p>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Receive digital demo credit + 50% service fee bonus
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </button>
      </div>

      {/* 7. Concept Highlight & Section 49 Legal Disclaimer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Same app & same account for both Sender & Receiver</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Switch roles anytime without creating multiple profiles.
        </p>
        <p className="text-[10px] font-bold text-amber-400/90 tracking-wide uppercase pt-1">
          DEMO APPLICATION — NO REAL MONEY OR PAYMENTS
        </p>
      </div>
    </div>
  );
};
