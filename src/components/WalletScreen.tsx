import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  ShieldAlert,
  Coins,
  Receipt,
  Sparkles,
  Check,
  AlertCircle,
  Smartphone,
  QrCode,
  ScanLine,
} from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const {
    currentUser,
    currentWallet,
    currentLedger,
    setCurrentTab,
    isAddFundsModalOpen,
    setIsAddFundsModalOpen,
    addDemoFunds,
    setIsUpiTopUpOpen,
    setIsReceiveQrOpen,
  } = useApp();

  const [selectedFundAmount, setSelectedFundAmount] = useState<number>(2000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  const handleOpenConfirm = (amt: number) => {
    setSelectedFundAmount(amt);
    setShowConfirmation(true);
  };

  const handleExecuteAddFunds = () => {
    const amt = customAmount ? Number(customAmount) : selectedFundAmount;
    if (amt <= 0) return;

    const res = addDemoFunds(amt);
    setShowConfirmation(false);
    setCustomAmount('');

    if (res.success) {
      setAddSuccessMsg(`₹${amt.toLocaleString('en-IN')} demo funds added!`);
      setTimeout(() => {
        setAddSuccessMsg(null);
        setIsAddFundsModalOpen(false);
      }, 1200);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 max-w-md mx-auto w-full">
      {/* 1. Header Balance Card */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-300">
            <WalletIcon className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider">DEMO WALLET</span>
          </div>
          <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            TEST FUNDS ONLY
          </span>
        </div>

        <div className="my-3">
          <span className="text-xs text-slate-400 block font-medium">Current Balance</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-white tracking-tight">
              ₹{currentWallet.balance.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold">DEMO</span>
          </div>
        </div>

        {/* Section 7 & 49 Mandatory Badges */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[11px] text-amber-300 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>DEMO WALLET — NO REAL MONEY</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            id="btn-wallet-upi-topup"
            onClick={() => setIsUpiTopUpOpen(true)}
            className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>TOP UP VIA UPI</span>
          </button>
          <button
            id="btn-wallet-receive-qr"
            onClick={() => setIsReceiveQrOpen(true)}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>RECEIVE VIA QR</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            id="btn-add-demo-funds"
            onClick={() => setIsAddFundsModalOpen(true)}
            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>QUICK ADD DEMO</span>
          </button>
          <button
            id="btn-view-history-tab"
            onClick={() => setCurrentTab('transactions')}
            className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>HISTORY</span>
          </button>
        </div>
      </div>

      {/* 2. Section 23: Receiver Commission / Earnings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Receiver Commission Earnings
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">Owner Confidential</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400">Total Completed Handowers</span>
            <span className="text-base font-black text-white block mt-0.5">
              {currentUser.receiverCompleted} txns
            </span>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400">Commission Earned</span>
            <span className="text-base font-black text-emerald-400 block mt-0.5">
              +₹{(currentUser.receiverCompleted * 10).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section 46: Demo Wallet Accounting Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Simulated Accounting Ledger
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Double-Entry Demo Log</span>
        </div>

        {currentLedger.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No ledger events recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5">
            {currentLedger.map((entry) => {
              const isCredit = entry.amount > 0;
              return (
                <div
                  key={entry.id}
                  className="bg-slate-800/50 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isCredit
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-white block text-[11px] leading-tight">
                        {entry.description}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(entry.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • Bal after: ₹{entry.balanceAfter.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black text-xs ${
                        isCredit ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isCredit ? '+' : ''}₹{Math.abs(entry.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 49 Legal Footer */}
      <div className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wide pt-2">
        DEMO APPLICATION — NO REAL MONEY OR PAYMENTS
      </div>

      {/* MODAL: Add Demo Funds (Section 8) */}
      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-extrabold text-white">Add Demo Funds</h4>
              </div>
              <button
                onClick={() => setIsAddFundsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {addSuccessMsg ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">{addSuccessMsg}</p>
              </div>
            ) : showConfirmation ? (
              /* Confirmation Prompt (Section 8) */
              <div className="py-2 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">
                    Add ₹{selectedFundAmount.toLocaleString('en-IN')} demo funds?
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulated grant will be credited instantly to your demo wallet.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-add-funds"
                    onClick={handleExecuteAddFunds}
                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30"
                  >
                    ADD DEMO FUNDS
                  </button>
                </div>
              </div>
            ) : (
              /* Select Amount Screen */
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Select a test grant to top up your mock wallet balance:
                </p>

                {/* Predefined Amounts */}
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleOpenConfirm(amt)}
                      className="py-2.5 px-2 bg-slate-800 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 rounded-xl text-xs font-bold text-white transition-all text-center"
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-400 font-semibold block">
                    Or Enter Custom Demo Amount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 3500"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const amt = Number(customAmount);
                        if (amt > 0) handleOpenConfirm(amt);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                    >
                      Top Up
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2 rounded-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>No real payment gateway or bank connection is used.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
