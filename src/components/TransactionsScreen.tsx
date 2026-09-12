import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Transaction } from '../types';

export const TransactionsScreen: React.FC = () => {
  const { state, currentUser, setSelectedTxId } = useApp();
  const [tab, setTab] = useState<'ALL' | 'SENT' | 'RECEIVED'>('ALL');

  // Filter transactions involving current user
  const userTransactions = (Object.values(state.transactions) as Transaction[]).filter(
    (tx) => tx.senderId === currentUser.id || tx.receiverId === currentUser.id
  );

  const filtered = userTransactions.filter((tx) => {
    if (tab === 'SENT') return tx.senderId === currentUser.id;
    if (tab === 'RECEIVED') return tx.receiverId === currentUser.id;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Transactions</h2>
          <p className="text-xs text-slate-400">All peer-to-peer cash handovers</p>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          {userTransactions.length} Total
        </span>
      </div>

      {/* Tabs (Section 24: All, Sent, Received) */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
        {(['ALL', 'SENT', 'RECEIVED'] as const).map((t) => (
          <button
            key={t}
            id={`tab-tx-${t.toLowerCase()}`}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              tab === t
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'ALL' ? 'All' : t === 'SENT' ? 'Sent' : 'Received'}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-2">
          <ArrowLeftRight className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-medium">No transactions found in this category.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((tx) => {
            const isSender = tx.senderId === currentUser.id;
            const otherUserId = isSender ? tx.receiverId : tx.senderId;
            const otherUser = state.users[otherUserId];

            const isCompleted = tx.status === 'COMPLETED';
            const isCancelled = tx.status === 'CANCELLED' || tx.status === 'DECLINED';
            const isDisputed = tx.status === 'DISPUTED';

            return (
              <div
                key={tx.id}
                id={`card-tx-${tx.id}`}
                onClick={() => setSelectedTxId(tx.id)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 text-white cursor-pointer transition-all hover:translate-x-0.5 group shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-blue-400">
                      {tx.id}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isCancelled
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : isDisputed
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {isCompleted ? '✅ Completed' : tx.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString([], {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSender
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isSender ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{isSender ? 'Sender' : 'Receiver'}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-slate-300">{otherUser?.name || 'Peer'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isSender
                          ? `Paid ₹${tx.amount + tx.serviceFee} digital`
                          : `Bonus Commission: ₹${tx.receiverCommission}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-base font-black text-white block">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500">Physical Cash</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
