import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Search,
  AlertTriangle,
  ArrowRight,
  Info,
  Map as MapIcon,
  List,
  Compass,
} from 'lucide-react';
import { User } from '../types';

export const SenderFlowModal: React.FC = () => {
  const {
    state,
    currentUser,
    currentWallet,
    isSenderModalOpen,
    setIsSenderModalOpen,
    createCashRequest,
    setSelectedTxId,
    setIsAddFundsModalOpen,
  } = useApp();

  const [step, setStep] = useState<'ENTER_AMOUNT' | 'SELECT_RECEIVER'>('ENTER_AMOUNT');
  const [amount, setAmount] = useState<number>(2000);
  const [viewMode, setViewMode] = useState<'list' | 'radar'>('list');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requestingUserId, setRequestingUserId] = useState<string | null>(null);

  if (!isSenderModalOpen) return null;

  const quickAmounts = [500, 1000, 2000, 5000];

  // Matching Logic (Section 42):
  // Filter out current user, sort by availability (AVAILABLE first), then distance, then receiver rating, then completed txns
  const nearbyReceivers = (Object.values(state.users) as User[])
    .filter((u) => u.id !== currentUser.id && !u.isSuspended)
    .sort((a, b) => {
      const availScore = (status: string) =>
        status === 'AVAILABLE' ? 3 : status === 'BUSY' ? 2 : 1;
      if (availScore(b.availability) !== availScore(a.availability)) {
        return availScore(b.availability) - availScore(a.availability);
      }
      if (a.distanceKm !== b.distanceKm) {
        return a.distanceKm - b.distanceKm;
      }
      return b.receiverRating - a.receiverRating;
    });

  const handleProceedToFind = () => {
    if (amount < 100) {
      setErrorMsg('Minimum request amount is ₹100.');
      return;
    }
    if (amount > 50000) {
      setErrorMsg('Maximum demo amount is ₹50,000.');
      return;
    }

    // Check balance upfront
    const fee = Math.max(20, Math.round((amount * 1) / 100));
    const totalRequired = amount + fee;
    if (currentWallet.balance < totalRequired) {
      setErrorMsg(
        `Insufficient demo balance! Need ₹${totalRequired.toLocaleString(
          'en-IN'
        )} (₹${amount} + ₹${fee} service fee), but current demo wallet has ₹${currentWallet.balance.toLocaleString(
          'en-IN'
        )}.`
      );
      return;
    }

    setErrorMsg(null);
    setStep('SELECT_RECEIVER');
  };

  const handleSendRequest = (receiver: User) => {
    if (receiver.availability !== 'AVAILABLE') {
      setErrorMsg(`${receiver.name} is currently ${receiver.availability.toLowerCase()}. Please select an available receiver.`);
      return;
    }

    setRequestingUserId(receiver.id);
    setErrorMsg(null);

    // Call backend validation
    const result = createCashRequest(receiver.id, amount);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to create request.');
      setRequestingUserId(null);
      return;
    }

    // Success -> close modal and open transaction tracking
    if (result.transaction) {
      setIsSenderModalOpen(false);
      setSelectedTxId(result.transaction.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white">
              {step === 'ENTER_AMOUNT' ? 'Need Cash' : 'Select Nearby Receiver'}
            </h2>
            <p className="text-xs text-slate-400">
              {step === 'ENTER_AMOUNT'
                ? 'Request cash from a trusted verified peer'
                : `Looking for ₹${amount.toLocaleString('en-IN')} cash handover`}
            </p>
          </div>
          <button
            id="btn-close-sender-modal"
            onClick={() => {
              setIsSenderModalOpen(false);
              setStep('ENTER_AMOUNT');
              setErrorMsg(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                {errorMsg.includes('Insufficient') && (
                  <button
                    onClick={() => {
                      setIsSenderModalOpen(false);
                      setIsAddFundsModalOpen(true);
                    }}
                    className="block mt-1 font-bold text-red-300 underline"
                  >
                    + Add Demo Funds to Wallet
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'ENTER_AMOUNT' ? (
            /* STEP 1: Enter Cash Amount */
            <div className="space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                <label className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  How much cash do you need?
                </label>
                <div className="flex items-center justify-center gap-1.5 my-2">
                  <span className="text-3xl font-extrabold text-blue-400">₹</span>
                  <input
                    id="input-sender-amount"
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="2000"
                    className="w-48 text-3xl font-black text-white bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg"
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <span>Service Fee: ₹20</span>
                  <span>•</span>
                  <span>Demo Wallet Balance: ₹{currentWallet.balance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">Quick Amounts</span>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        amount === q
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      ₹{q.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 9 Required Explanation */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-3.5 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  "Choose a nearby verified Receiver. Their wallet balance and financial information are private."
                </p>
              </div>

              {/* Action Button */}
              <button
                id="btn-find-nearby-receivers"
                onClick={handleProceedToFind}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Find Nearby Receivers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* STEP 2: Section 10 & 6 & 27: List of Nearby Receivers */
            <div className="space-y-3">
              {/* Header with list / radar toggle */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Nearby Receivers (Broad Distance)</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded text-xs flex items-center gap-1 ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                    title="List View"
                  >
                    <List className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewMode('radar')}
                    className={`p-1 rounded text-xs flex items-center gap-1 ${
                      viewMode === 'radar' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                    title="Map Radar View"
                  >
                    <MapIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Simulated Map / Radar View (Section 27) */}
              {viewMode === 'radar' && (
                <div className="relative bg-slate-950 border border-slate-800 rounded-2xl h-44 flex items-center justify-center overflow-hidden p-2">
                  {/* Radar Circles */}
                  <div className="absolute w-36 h-36 rounded-full border border-blue-500/20 animate-ping opacity-25" />
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/30" />
                  <div className="absolute w-16 h-16 rounded-full border border-blue-500/40" />

                  {/* Center: Current User "You" */}
                  <div className="absolute z-10 flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-500/30" />
                    <span className="text-[9px] font-bold text-blue-300 mt-1">You</span>
                  </div>

                  {/* Nearby User Pins */}
                  {nearbyReceivers.slice(0, 4).map((u, i) => {
                    const angles = [45, 140, 230, 310];
                    const dists = [35, 55, 45, 65];
                    const rad = (angles[i] * Math.PI) / 180;
                    const x = Math.cos(rad) * dists[i];
                    const y = Math.sin(rad) * dists[i];
                    return (
                      <div
                        key={u.id}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                        className="absolute z-10 flex flex-col items-center cursor-pointer group"
                        onClick={() => handleSendRequest(u)}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ring-2 ${
                            u.availability === 'AVAILABLE'
                              ? 'bg-emerald-400 ring-emerald-500/40'
                              : 'bg-amber-400 ring-amber-500/40'
                          }`}
                        />
                        <span className="text-[8px] font-semibold text-slate-200 bg-slate-900/80 px-1 rounded shadow mt-0.5 whitespace-nowrap">
                          {u.name.split(' ')[0]} ({u.distanceKm} km)
                        </span>
                      </div>
                    );
                  })}

                  <div className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-medium">
                    Simulated broad GPS range • No exact address exposed
                  </div>
                </div>
              )}

              {/* Privacy Warning banner (Section 6) */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-1.5 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Wallet balances & bank details are private and hidden.</span>
              </div>

              {/* Receivers Cards List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
                {nearbyReceivers.map((receiver) => {
                  const isAvailable = receiver.availability === 'AVAILABLE';
                  const isBusy = receiver.availability === 'BUSY';
                  const isRequesting = requestingUserId === receiver.id;

                  return (
                    <div
                      key={receiver.id}
                      className={`bg-slate-800/70 border rounded-2xl p-3.5 transition-all ${
                        isAvailable
                          ? 'border-slate-700 hover:border-blue-500/60'
                          : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Profile Info */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={receiver.profileImage}
                              alt={receiver.name}
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700"
                            />
                            {receiver.verified && (
                              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5" title="Verified">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-white text-sm">{receiver.name}</h3>
                              {receiver.verified && (
                                <span className="text-[10px] text-emerald-400 font-semibold">✅ Verified</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-300 font-medium">
                                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                {receiver.receiverRating}
                              </span>
                              <span>•</span>
                              <span className="text-slate-400">
                                {receiver.receiverCompleted} receiver txns
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5 text-slate-300">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {receiver.distanceKm} km away
                              </span>
                              <span>•</span>
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${
                                  isAvailable
                                    ? 'text-emerald-400'
                                    : isBusy
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isAvailable
                                      ? 'bg-emerald-400'
                                      : isBusy
                                      ? 'bg-amber-400'
                                      : 'bg-slate-500'
                                  }`}
                                />
                                {receiver.availability}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Request Action Button */}
                        <div>
                          <button
                            id={`btn-request-${receiver.id}`}
                            onClick={() => handleSendRequest(receiver)}
                            disabled={!isAvailable || isRequesting}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                              isAvailable
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isRequesting ? 'Requesting...' : 'REQUEST'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Back to change amount */}
              <div className="pt-2">
                <button
                  onClick={() => setStep('ENTER_AMOUNT')}
                  className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  ← Change Requested Amount (₹{amount})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
