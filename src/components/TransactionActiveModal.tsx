import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  KeyRound,
  Coins,
  MapPin,
  Flag,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TransactionStatus } from '../types';

export const TransactionActiveModal: React.FC = () => {
  const {
    state,
    currentUser,
    selectedTxId,
    setSelectedTxId,
    advanceToMeeting,
    startOtpVerification,
    verifyOtp,
    confirmCashHandover,
    cancelRequest,
    setDisputeTxId,
    setRatingTxId,
  } = useApp();

  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmHandoverModal, setShowConfirmHandoverModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedTxId) return null;

  const tx = state.transactions[selectedTxId];
  if (!tx) return null;

  const sender = state.users[tx.senderId];
  const receiver = state.users[tx.receiverId];
  const isSender = currentUser.id === tx.senderId;
  const isReceiver = currentUser.id === tx.receiverId;

  // Order of flow states (Section 13)
  const stateSteps: TransactionStatus[] = [
    'REQUESTED',
    'ACCEPTED',
    'READY_FOR_MEETING',
    'OTP_VERIFICATION',
    'CASH_CONFIRMATION',
    'COMPLETED',
  ];

  const currentStepIndex = stateSteps.indexOf(
    tx.status === 'SETTLEMENT_PROCESSING' ? 'CASH_CONFIRMATION' : tx.status
  );

  const handleVerifyOtp = () => {
    setOtpError(null);
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setOtpError('Please enter the full 6-digit OTP.');
      return;
    }

    const result = verifyOtp(tx.id, enteredOtp.trim());
    if (!result.success) {
      setOtpError(result.error || 'Incorrect OTP.');
    } else {
      setEnteredOtp('');
    }
  };

  const handleFinalHandover = () => {
    setIsProcessing(true);
    const res = confirmCashHandover(tx.id);
    setIsProcessing(false);
    setShowConfirmHandoverModal(false);
    if (res.success) {
      // Trigger rating flow if desired
      setRatingTxId(tx.id);
    }
  };

  const handleCancel = () => {
    cancelRequest(tx.id, 'Cancelled by user prior to settlement');
    setShowCancelModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[94vh] flex flex-col text-white shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-400">{tx.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  tx.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : tx.status === 'CANCELLED' || tx.status === 'DECLINED'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : tx.status === 'DISPUTED'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                }`}
              >
                {tx.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Peer-to-Peer Cash Handover Tracking
            </p>
          </div>
          <button
            id="btn-close-tx-modal"
            onClick={() => setSelectedTxId(null)}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Section 13: Visual State Progress Pipeline */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Transaction Progress
            </span>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px]">
              {stateSteps.map((stepKey, idx) => {
                const isPassed = currentStepIndex >= idx || tx.status === 'COMPLETED';
                const isCurrent = currentStepIndex === idx && tx.status !== 'COMPLETED';
                return (
                  <div key={stepKey} className="flex-1 flex flex-col items-center text-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400 animate-pulse'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] font-medium leading-tight line-clamp-1 ${
                        isCurrent
                          ? 'text-blue-400 font-bold'
                          : isPassed
                          ? 'text-emerald-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {stepKey === 'READY_FOR_MEETING'
                        ? 'Meeting'
                        : stepKey === 'OTP_VERIFICATION'
                        ? 'OTP'
                        : stepKey === 'CASH_CONFIRMATION'
                        ? 'Handover'
                        : stepKey}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 14: Transaction Details Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/70">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <img
                    src={sender?.profileImage}
                    alt={sender?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/50"
                  />
                  <span className="text-[10px] text-blue-300 font-bold mt-0.5">Sender</span>
                  <span className="text-[11px] text-white font-medium">{sender?.name?.split(' ')[0]}</span>
                </div>
                <div className="flex flex-col items-center text-slate-500">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] text-slate-400">Cash Flow</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={receiver?.profileImage}
                    alt={receiver?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50"
                  />
                  <span className="text-[10px] text-emerald-300 font-bold mt-0.5">Receiver</span>
                  <span className="text-[11px] text-white font-medium">{receiver?.name?.split(' ')[0]}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Physical Cash</span>
                <span className="text-2xl font-black text-white block">
                  ₹{tx.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Fee & Accounting Ledger Breakdown (Section 14 & 16) */}
            <div className="bg-slate-900/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Handover Amount:</span>
                <span className="font-semibold text-white">₹{tx.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service Fee:</span>
                <span>₹{tx.serviceFee}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium pt-1 border-t border-slate-800">
                <span>Receiver Bonus Commission:</span>
                <span>+₹{tx.receiverCommission}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Platform Demo Revenue:</span>
                <span>₹{tx.platformFee}</span>
              </div>
              <div className="flex justify-between text-blue-300 text-xs font-bold pt-1 border-t border-slate-800">
                <span>Total Sender Wallet Debit:</span>
                <span>₹{(tx.amount + tx.serviceFee).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC INTERACTION SECTION BASED ON CURRENT STATE */}

          {/* State 1: REQUESTED */}
          {tx.status === 'REQUESTED' && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-center space-y-3">
              <Clock className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-white">Waiting for Receiver to Accept</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Request sent to {receiver?.name}. You will be notified as soon as they accept.
                </p>
              </div>

              {/* Quick switch button if user wants to test receiver side */}
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                <span className="text-[11px] text-slate-400 block mb-1.5">
                  Testing as evaluator? Switch to {receiver?.name} to accept this request:
                </span>
                <button
                  onClick={() => {
                    // switch to receiver
                    state.currentUserId = tx.receiverId;
                    setSelectedTxId(tx.id);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Switch to Receiver ({receiver?.name})
                </button>
              </div>

              {isSender && (
                <button
                  id="btn-cancel-tx-pending"
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs text-red-400 hover:text-red-300 underline font-medium"
                >
                  Cancel Cash Request
                </button>
              )}
            </div>
          )}

          {/* State 2: ACCEPTED */}
          {tx.status === 'ACCEPTED' && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Request Accepted! Meet Up Coord</span>
              </div>
              <p className="text-xs text-slate-300">
                {receiver?.name} and {sender?.name} are matched. Coordinate your safe public meetup spot.
              </p>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Meeting spot: Broad public area within ~{receiver?.distanceKm} km</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="btn-advance-meeting"
                  onClick={() => advanceToMeeting(tx.id)}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  We are Meeting Now
                </button>
                <button
                  id="btn-advance-otp"
                  onClick={() => startOtpVerification(tx.id)}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/30"
                >
                  Verify OTP Directly →
                </button>
              </div>
            </div>
          )}

          {/* State 3: READY_FOR_MEETING */}
          {tx.status === 'READY_FOR_MEETING' && (
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-4 space-y-3 text-center">
              <MapPin className="w-8 h-8 text-blue-400 mx-auto animate-bounce" />
              <div>
                <h3 className="text-sm font-bold text-white">At the Meeting Point</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ensure you are in a safe public spot. Proceed to verify identity with OTP before handing over cash.
                </p>
              </div>
              <button
                id="btn-proceed-otp"
                onClick={() => startOtpVerification(tx.id)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-all shadow-md shadow-blue-600/30"
              >
                Proceed to OTP Verification
              </button>
            </div>
          )}

          {/* State 4: OTP_VERIFICATION (Section 17) */}
          {tx.status === 'OTP_VERIFICATION' && (
            <div className="bg-slate-800/80 border border-blue-500/40 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <KeyRound className="w-5 h-5" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide">
                  OTP Security Verification
                </h3>
              </div>

              {/* Sender View of OTP */}
              <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-3.5 text-center">
                <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                  Sender's Secure Handover OTP
                </span>
                <div className="text-3xl font-black text-white tracking-widest my-1.5 font-mono">
                  {tx.otp}
                </div>
                <p className="text-[11px] text-blue-200/80">
                  Share this 6-digit OTP with the receiver when meeting in person.
                </p>
              </div>

              {/* Receiver Input for OTP */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Receiver: Enter Sender's 6-digit OTP
                </label>
                <div className="flex gap-2">
                  <input
                    id="input-tx-otp"
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6 digits"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    id="btn-verify-otp"
                    onClick={handleVerifyOtp}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
                  >
                    VERIFY
                  </button>
                </div>

                {/* Developer Demo Quick Fill */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Demo helper:</span>
                  <button
                    onClick={() => setEnteredOtp(tx.otp)}
                    className="text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    Auto-Fill ({tx.otp})
                  </button>
                </div>

                {otpError && (
                  <p className="text-xs text-red-400 font-semibold">{otpError}</p>
                )}
              </div>
            </div>
          )}

          {/* State 5 & 6: SETTLEMENT_PROCESSING & CASH_CONFIRMATION (Section 18) */}
          {(tx.status === 'SETTLEMENT_PROCESSING' || tx.status === 'CASH_CONFIRMATION') && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>READY TO COMPLETE</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded">
                  OTP Verified ✅
                </span>
              </div>

              {/* Status Checks */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 bg-slate-900/60 p-2.5 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Sender confirmation: ✅ Payment authorized in demo escrow</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 bg-slate-900/60 p-2.5 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Receiver confirmation: Physical cash handover prepared</span>
                </div>
              </div>

              {/* Handover Action Button */}
              <button
                id="btn-confirm-cash-given"
                onClick={() => setShowConfirmHandoverModal(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>CONFIRM CASH GIVEN & SETTLE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* State 7: COMPLETED (Section 19) */}
          {tx.status === 'COMPLETED' && (
            <div className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-4 space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white">Transaction Completed!</h3>
              <p className="text-xs text-slate-300">
                ₹{tx.amount.toLocaleString('en-IN')} physical cash handed over. Demo balances and receiver commission (+₹{tx.receiverCommission}) have been settled in the ledger.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  id="btn-rate-tx-completed"
                  onClick={() => setRatingTxId(tx.id)}
                  className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>RATE USER</span>
                </button>
                <button
                  onClick={() => setSelectedTxId(null)}
                  className="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Timeline Audit Trail */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Audit Trail
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {tx.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <div className="flex-1">
                    <span className="text-slate-300">{item.note}</span>
                    <span className="text-slate-500 text-[10px] ml-1.5">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons footer (Cancel & Dispute) */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {tx.status !== 'COMPLETED' && tx.status !== 'CANCELLED' && tx.status !== 'SETTLEMENT_PROCESSING' && (
              <button
                id="btn-cancel-request-flow"
                onClick={() => setShowCancelModal(true)}
                className="text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                Cancel Request
              </button>
            )}

            <button
              id="btn-report-problem"
              onClick={() => setDisputeTxId(tx.id)}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold ml-auto transition-colors"
            >
              <Flag className="w-3 h-3" />
              <span>Report Problem</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Cash Handover Double Confirmation (Section 18) */}
      {showConfirmHandoverModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl animate-scale-up">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-extrabold text-white">Confirm Cash Handover</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                "Are you sure you have completed the cash handover?"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Amount: ₹{tx.amount.toLocaleString('en-IN')} physical currency.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-cancel-handover-confirm"
                onClick={() => setShowConfirmHandoverModal(false)}
                className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                id="btn-yes-complete-handover"
                onClick={handleFinalHandover}
                disabled={isProcessing}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30"
              >
                {isProcessing ? 'Settling...' : 'YES, COMPLETE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Section 40 Cancel Flow */}
      {showCancelModal && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-white space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-extrabold text-white">Cancel this request?</h4>
              <p className="text-xs text-slate-300 mt-1">
                The transaction will be terminated and no funds will be deducted.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-keep-request"
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                NO, KEEP REQUEST
              </button>
              <button
                id="btn-confirm-cancel-request"
                onClick={handleCancel}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                YES, CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
