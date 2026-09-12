import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Users,
  ArrowLeftRight,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Percent,
  TrendingUp,
  Shield,
  FileText,
  UserX,
  UserCheck,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { TransactionStatus, DisputeStatus, User, Transaction } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    state,
    setCurrentTab,
    toggleUserSuspension,
    updateAdminSettings,
    resolveDispute,
    setSelectedTxId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'commission' | 'disputes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Live Commission Settings State
  const [receiverPct, setReceiverPct] = useState(state.adminSettings.receiverCommissionPercent);
  const [platformPct, setPlatformPct] = useState(state.adminSettings.platformFeePercent);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Statistics (Section 29)
  const activeReceiversCount = (Object.values(state.users) as User[]).filter(
    (u) => u.availability === 'AVAILABLE'
  ).length;

  const totalTxCount = Object.values(state.transactions).length;
  const completedTxCount = (Object.values(state.transactions) as Transaction[]).filter(
    (tx) => tx.status === 'COMPLETED'
  ).length;

  const totalDemoVolume = (Object.values(state.transactions) as Transaction[])
    .filter((tx) => tx.status === 'COMPLETED')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCommissions = (Object.values(state.transactions) as Transaction[])
    .filter((tx) => tx.status === 'COMPLETED')
    .reduce((sum, tx) => sum + tx.receiverCommission, 0);

  const pendingDisputesCount = state.disputes.filter((d) => d.status !== 'RESOLVED').length;

  const handleSaveCommissionSettings = () => {
    updateAdminSettings({
      receiverCommissionPercent: Number(receiverPct),
      platformFeePercent: Number(platformPct),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1500);
  };

  // Filtered transactions
  const filteredTransactions = (Object.values(state.transactions) as Transaction[]).filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiverId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 max-w-2xl mx-auto w-full text-white">
      {/* Admin Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center ring-1 ring-purple-500/40">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Admin Management Portal</h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                PROTOTYPE ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage users, audit transactions, and configure commission splits</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('home')}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          Exit Admin
        </button>
      </div>

      {/* Navigation Tabs (Section 29) */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs overflow-x-auto gap-1">
        {[
          { id: 'overview', label: 'Dashboard', icon: TrendingUp },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
          { id: 'commission', label: 'Commission Settings', icon: Percent },
          { id: 'disputes', label: `Disputes (${pendingDisputesCount})`, icon: AlertTriangle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Section 29 Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Total Users</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {(1250 + Object.keys(state.users).length - 11).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                +12 joined today
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Active Receivers</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {180 + activeReceiversCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                {activeReceiversCount} in local zone
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Today's Transactions</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {320 + totalTxCount}
              </span>
              <span className="text-[10px] text-blue-400 font-medium mt-1 block">
                {completedTxCount} completed
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Today's Demo Volume</span>
              <span className="text-2xl font-black text-white mt-1 block">
                ₹{(480000 + totalDemoVolume).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold mt-1 block">
                Simulated volume
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Demo Commissions Paid</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                ₹{(4800 + totalCommissions).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                Direct to receiver wallets
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs font-medium block">Pending Disputes</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">
                {pendingDisputesCount}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                {state.disputes.length} total resolved
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">System Status</h4>
            <div className="flex items-center justify-between text-slate-300">
              <span>Matching Engine:</span>
              <span className="text-emerald-400 font-bold">🟢 Active (Broad GPS Sorting)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>OTP Verification Engine:</span>
              <span className="text-emerald-400 font-bold">🟢 Active (6-digit Random OTP)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Wallet Privacy Shield:</span>
              <span className="text-emerald-400 font-bold">🟢 Active (No balances exposed)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Section 30 Admin User Management */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              User Directory ({Object.keys(state.users).length})
            </h3>
            <span className="text-[11px] text-slate-400">Confidential Admin View</span>
          </div>

          <div className="divide-y divide-slate-800 overflow-x-auto">
            {(Object.values(state.users) as User[]).map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.profileImage}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{u.name}</span>
                      {u.verified && (
                        <span className="text-[10px] text-emerald-400 font-semibold">✅ Verified</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">ID: {u.id}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>Sender: ⭐ {u.senderRating} ({u.senderCompleted})</span>
                      <span>•</span>
                      <span>Receiver: ⭐ {u.receiverRating} ({u.receiverCompleted})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      u.isSuspended
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {u.isSuspended ? 'Suspended' : 'Active'}
                  </span>

                  <button
                    onClick={() => toggleUserSuspension(u.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      u.isSuspended
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40'
                    }`}
                  >
                    {u.isSuspended ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Section 31 Admin Transaction Management & Audit Trail */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Transaction ID or User ID..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="REQUESTED">Requested / Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="OTP_VERIFICATION">OTP Verification</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>

          {/* Transactions List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400">{tx.id}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {tx.status}
                    </span>
                  </div>
                  <span className="font-extrabold text-sm text-white">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <div>Sender: <span className="text-white">{state.users[tx.senderId]?.name}</span></div>
                  <div>Receiver: <span className="text-white">{state.users[tx.receiverId]?.name}</span></div>
                  <div>Service Fee: ₹{tx.serviceFee}</div>
                  <div>Commission: ₹{tx.receiverCommission}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
                  <span className="text-[10px] text-slate-500">
                    Created: {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setSelectedTxId(tx.id)}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Audit Trail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Section 32 Admin Commission Settings (Editable for Demo) */}
      {activeTab === 'commission' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-white">Commission Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize demo commission distribution between verified receivers and the platform.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Receiver Commission Percentage: {receiverPct}% of Service Fee
              </label>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={receiverPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setReceiverPct(val);
                  setPlatformPct(100 - val);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-emerald-400">
                Receiver receives {receiverPct}% as incentive for providing cash.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Platform Demo Fee: {platformPct}% of Service Fee
              </label>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={platformPct}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPlatformPct(val);
                  setReceiverPct(100 - val);
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[11px] text-purple-400">
                Platform retains {platformPct}% for operating costs.
              </span>
            </div>

            {/* Live Example Calculation */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
              <span className="font-bold text-white block">Sample ₹2,000 Cash Transaction:</span>
              <div className="flex justify-between text-slate-300">
                <span>Service Fee:</span>
                <span>₹20</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Receiver Bonus Commission ({receiverPct}%):</span>
                <span>₹{Math.round((20 * receiverPct) / 100)}</span>
              </div>
              <div className="flex justify-between text-purple-400">
                <span>Platform Revenue ({platformPct}%):</span>
                <span>₹{20 - Math.round((20 * receiverPct) / 100)}</span>
              </div>
            </div>

            {saveSuccess && (
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Commission percentages updated in demo database!</span>
              </p>
            )}

            <button
              onClick={handleSaveCommissionSettings}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all shadow-md shadow-purple-600/30"
            >
              SAVE DEMO COMMISSION SETTINGS
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Section 33 Dispute System */}
      {activeTab === 'disputes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Disputes & Complaints ({state.disputes.length})
            </h3>
          </div>

          {state.disputes.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No disputes logged.</p>
          ) : (
            <div className="space-y-3">
              {state.disputes.map((disp) => {
                const reporter = state.users[disp.reportedBy];
                return (
                  <div
                    key={disp.id}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300">{disp.reason}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            disp.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300 animate-pulse'
                          }`}
                        >
                          {disp.status}
                        </span>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">{disp.transactionId}</span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      "{disp.description}"
                    </p>

                    <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-700/50">
                      <span>Reported by: {reporter?.name || disp.reportedBy}</span>
                      <span>{new Date(disp.createdAt).toLocaleDateString()}</span>
                    </div>

                    {disp.status !== 'RESOLVED' && (
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => resolveDispute(disp.id, 'Investigation closed, funds released', 'RESOLVED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
