import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  Coins,
  TrendingUp,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';

import { User, Transaction } from '../types';

export const ReceiverFlowModal: React.FC = () => {
  const {
    currentUser,
    currentLedger,
    state,
    isReceiverModalOpen,
    setIsReceiverModalOpen,
    updateAvailability,
    acceptRequest,
    declineRequest,
    setSelectedTxId,
  } = useApp();

  if (!isReceiverModalOpen) return null;

  // Find any pending cash request directed to this user as Receiver
  const pendingRequests = (Object.values(state.transactions) as Transaction[]).filter(
    (tx) => tx.receiverId === currentUser.id && tx.status === 'REQUESTED'
  );

  // Calculate user's receiver commission metrics (Section 23)
  const receiverCommissionLedgers = currentLedger.filter(
    (l) => l.type === 'RECEIVER_COMMISSION'
  );
  const totalCommissionEarned = receiverCommissionLedgers.reduce(
    (sum, l) => sum + l.amount,
    0
  );

  // Simulated today's stats
  const todayTransactionsCount = Math.max(
    1,
    Math.min(currentUser.receiverCompleted, 8)
  );
  const todayCommission = Math.max(
    10,
    Math.min(todayTransactionsCount * 15, 120)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white">Receiver Mode</h2>
            <p className="text-xs text-slate-400">
              Provide physical cash and earn guaranteed demo commissions
            </p>
          </div>
          <button
            id="btn-close-receiver-modal"
            onClick={() => setIsReceiverModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* 1. Section 11: Become Available & Mode Switcher */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Current Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      currentUser.availability === 'AVAILABLE'
                        ? 'bg-emerald-400 animate-ping'
                        : currentUser.availability === 'BUSY'
                        ? 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-lg font-black text-white">
                    {currentUser.availability === 'AVAILABLE'
                      ? '🟢 AVAILABLE'
                      : currentUser.availability === 'BUSY'
                      ? '🟡 BUSY'
                      : '⚪ OFFLINE'}
                  </span>
                </div>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                <button
                  id="btn-status-online"
                  onClick={() => updateAvailability('AVAILABLE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentUser.availability === 'AVAILABLE'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Go Online
                </button>
                <button
                  id="btn-status-offline"
                  onClick={() => updateAvailability('OFFLINE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentUser.availability === 'OFFLINE'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Go Offline
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-slate-700/60 leading-relaxed">
              "You can receive cash requests while you're available."
            </p>
          </div>

          {/* 2. Section 12: Incoming Cash Requests Queue */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Incoming Cash Requests ({pendingRequests.length})
              </span>
              {pendingRequests.length === 0 && (
                <span className="text-[11px] text-slate-500 font-medium">Waiting for nearby senders</span>
              )}
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-6 text-center text-slate-400 space-y-2">
                <Radio className="w-8 h-8 text-slate-500 mx-auto animate-pulse" />
                <p className="text-xs font-medium">
                  {currentUser.availability === 'AVAILABLE'
                    ? "You are online and visible to nearby senders. New requests will appear here instantly."
                    : "You are currently offline. Turn on Available mode above to receive requests."}
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => {
                const sender = state.users[req.senderId];
                if (!sender) return null;

                return (
                  <div
                    key={req.id}
                    id={`incoming-request-card-${req.id}`}
                    className="bg-gradient-to-br from-amber-950/40 to-slate-800 border border-amber-500/40 rounded-2xl p-4 text-white shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        NEW CASH REQUEST
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {req.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <img
                        src={sender.profileImage}
                        alt={sender.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-white">{sender.name}</h3>
                          {sender.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-300 font-medium">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            {sender.senderRating}
                          </span>
                          <span>•</span>
                          <span>{sender.senderCompleted} completed sender txns</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Distance: Nearby (~0.4 km)
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Requested Cash</span>
                        <span className="text-xl font-black text-white">
                          ₹{req.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 block mt-0.5">
                          +₹{req.receiverCommission} Bonus
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-amber-500/20">
                      <button
                        id={`btn-decline-req-${req.id}`}
                        onClick={() => declineRequest(req.id)}
                        className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-slate-400" />
                        <span>DECLINE</span>
                      </button>
                      <button
                        id={`btn-accept-req-${req.id}`}
                        onClick={() => {
                          acceptRequest(req.id);
                          setIsReceiverModalOpen(false);
                          setSelectedTxId(req.id);
                        }}
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-lg shadow-emerald-600/30"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>ACCEPT</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. Section 23: Receiver Earnings Overview Card (Private to Account Owner) */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Receiver Earnings (Private)
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Account Owner Only</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Today's Transactions</span>
                <span className="text-lg font-black text-white mt-0.5 block">
                  {todayTransactionsCount}
                </span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Today's Commission</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                  ₹{todayCommission}
                </span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Total Commission</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                  ₹{(totalCommissionEarned + 4850).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Completed Receiver Txns</span>
                <span className="text-lg font-black text-white mt-0.5 block">
                  {currentUser.receiverCompleted}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Commission is credited automatically to your demo wallet upon OTP + cash handover.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
