import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface UpiApp {
  id: string;
  name: string;
  color: string;
  iconBg: string;
  handleSuffix: string;
  tag: string;
}

const UPI_APPS: UpiApp[] = [
  { id: 'gpay', name: 'Google Pay', color: 'text-blue-400', iconBg: 'bg-blue-600', handleSuffix: '@okhdfcbank', tag: 'Fast & Direct' },
  { id: 'phonepe', name: 'PhonePe', color: 'text-purple-400', iconBg: 'bg-purple-600', handleSuffix: '@ybl', tag: 'Popular' },
  { id: 'paytm', name: 'Paytm UPI', color: 'text-sky-400', iconBg: 'bg-sky-600', handleSuffix: '@paytm', tag: 'Instant' },
  { id: 'bhim', name: 'BHIM UPI', color: 'text-emerald-400', iconBg: 'bg-emerald-600', handleSuffix: '@upi', tag: 'Govt. NPCI Rail' },
];

export const UpiTopUpModal: React.FC = () => {
  const { isUpiTopUpOpen, setIsUpiTopUpOpen, addUpiFunds, currentUser } = useApp();

  const [step, setStep] = useState<'SELECT' | 'PIN' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [selectedApp, setSelectedApp] = useState<UpiApp>(UPI_APPS[0]);
  const [upiId, setUpiId] = useState<string>(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}${UPI_APPS[0].handleSuffix}`);
  const [amount, setAmount] = useState<number>(2000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [upiPin, setUpiPin] = useState<string>('');
  const [txRefId, setTxRefId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isUpiTopUpOpen) return null;

  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  const handleSelectApp = (app: UpiApp) => {
    setSelectedApp(app);
    setUpiId(`${currentUser.name.toLowerCase().replace(/\s+/g, '')}${app.handleSuffix}`);
  };

  const handleProceedToPin = () => {
    const finalAmt = customAmount ? Number(customAmount) : amount;
    if (finalAmt <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }
    setErrorMessage(null);
    setAmount(finalAmt);
    setStep('PIN');
  };

  const handleKeypadPress = (digit: string) => {
    if (upiPin.length < 4) {
      const nextPin = upiPin + digit;
      setUpiPin(nextPin);
      if (nextPin.length === 4) {
        // Automatically submit
        executeUpiPayment();
      }
    }
  };

  const handleKeypadBackspace = () => {
    setUpiPin(upiPin.slice(0, -1));
  };

  const executeUpiPayment = () => {
    setStep('PROCESSING');
    setTimeout(() => {
      const res = addUpiFunds(amount, upiId, selectedApp.name);
      if (res.success && res.refId) {
        setTxRefId(res.refId);
        setStep('SUCCESS');
      } else {
        setErrorMessage(res.error || 'Payment failed. Please try again.');
        setStep('SELECT');
      }
    }, 1400);
  };

  const handleClose = () => {
    setIsUpiTopUpOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setStep('SELECT');
      setUpiPin('');
      setCustomAmount('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Top Up via UPI</h3>
              <p className="text-[10px] text-slate-400">Simulated National Payments Rail</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: SELECT APP & AMOUNT */}
        {step === 'SELECT' && (
          <div className="space-y-4">
            {/* Amount Presets */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">
                Select Deposit Amount
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      amount === amt && !customAmount
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="mt-2">
                <input
                  type="number"
                  placeholder="Or enter custom amount (₹)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* UPI App Selection */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold block">
                Choose UPI Application
              </label>
              <div className="grid grid-cols-2 gap-2">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      selectedApp.id === app.id
                        ? 'bg-purple-950/50 border-purple-500 ring-1 ring-purple-500/50'
                        : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${app.iconBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                      {app.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block truncate">{app.name}</span>
                      <span className="text-[10px] text-slate-400">{app.tag}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID preview */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Simulated VPA / UPI ID</span>
                <span className="text-[10px] text-emerald-400 font-bold">Verified</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-white font-semibold focus:outline-none mt-1"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
            )}

            <button
              onClick={handleProceedToPin}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <span>PROCEED TO PAY ₹{(customAmount ? Number(customAmount) : amount).toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SIMULATED UPI MPIN KEYPAD */}
        {step === 'PIN' && (
          <div className="space-y-4 text-center">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Paying via {selectedApp.name}</span>
              <span className="text-2xl font-black text-white mt-0.5 block">
                ₹{amount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-purple-300 font-mono mt-0.5 block">{upiId}</span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-2">
                ENTER 4-DIGIT UPI PIN (ANY 4 DIGITS FOR DEMO)
              </label>
              {/* PIN Bubbles */}
              <div className="flex items-center justify-center gap-3 my-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      upiPin.length > idx
                        ? 'bg-purple-500 border-purple-400 scale-110 shadow-[0_0_8px_#a855f7]'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Simulated Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-base rounded-xl border border-slate-700 transition-colors"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => handleKeypadPress('1234')}
                className="py-3 bg-purple-950/50 text-purple-300 hover:text-white font-bold text-xs rounded-xl border border-purple-800/60"
                title="Autofill test PIN"
              >
                Autofill
              </button>
              <button
                onClick={() => handleKeypadPress('0')}
                className="py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-base rounded-xl border border-slate-700"
              >
                0
              </button>
              <button
                onClick={handleKeypadBackspace}
                className="py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
              >
                ⌫
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Simulated 256-Bit NPCI Protocol</span>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto ring-4 ring-purple-500/30 animate-spin">
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">Authorizing UPI Payment...</h4>
              <p className="text-xs text-slate-400 mt-1">Connecting to simulated {selectedApp.name} rail</p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {step === 'SUCCESS' && (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Top Up Successful! ⚡
              </span>
              <h4 className="text-2xl font-black text-white mt-1">
                +₹{amount.toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">Credited to Demo Wallet</p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-bold text-white">{selectedApp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender VPA:</span>
                <span className="font-mono text-purple-300">{upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NPCI Ref ID:</span>
                <span className="font-mono text-slate-300">{txRefId}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
            >
              DONE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
