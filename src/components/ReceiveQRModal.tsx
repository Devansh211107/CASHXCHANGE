import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  Copy,
  Check,
  Share2,
  Download,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowDownToLine,
  RefreshCw,
  Coins,
} from 'lucide-react';

export const ReceiveQRModal: React.FC = () => {
  const {
    currentUser,
    isReceiveQrOpen,
    setIsReceiveQrOpen,
    createCashRequest,
    setIsReceiverModalOpen,
  } = useApp();

  const [requestedAmount, setRequestedAmount] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isReceiveQrOpen) return null;

  const upiId = currentUser.upiId || `${currentUser.name.toLowerCase().replace(/\s+/g, '')}@cashconnect`;
  const peerHandle = `cashconnect.me/${currentUser.id}`;

  const qrPayload = requestedAmount
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(currentUser.name)}&am=${requestedAmount}&cu=INR&tn=CashConnect-P2P`
    : `upi://pay?pa=${upiId}&pn=${encodeURIComponent(currentUser.name)}&cu=INR&tn=CashConnect-P2P`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setToastMessage(`${label} copied!`);
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2000);
  };

  const handleSimulateScan = () => {
    setToastMessage('Simulating scan from nearby sender (Amit Sharma)...');
    setTimeout(() => {
      setToastMessage(null);
      setIsReceiveQrOpen(false);
      setIsReceiverModalOpen(true);
    }, 1200);
  };

  const presetAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Receive Money QR</h3>
              <p className="text-[10px] text-slate-400">CashConnect Peer-to-Peer QR</p>
            </div>
          </div>
          <button
            onClick={() => setIsReceiveQrOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* User Identity Banner */}
        <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
              {currentUser.verified && (
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 ring-2 ring-slate-900">
                  <ShieldCheck className="w-3 h-3" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{currentUser.name}</span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                  RECEIVER
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{upiId}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Receiver Rating</span>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold justify-end">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{currentUser.receiverRating}</span>
            </div>
          </div>
        </div>

        {/* High-Resolution Dynamic SVG QR Code */}
        <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-950 shadow-inner relative group">
          {requestedAmount && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow">
              ₹{requestedAmount.toLocaleString('en-IN')}
            </div>
          )}

          {/* SVG QR Code */}
          <div className="w-52 h-52 relative flex items-center justify-center my-1">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner Position Targets Top-Left */}
              <rect x="10" y="10" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="18" y="18" width="34" height="34" rx="6" fill="#ffffff" />
              <rect x="24" y="24" width="22" height="22" rx="4" fill="#059669" />

              {/* Corner Position Targets Top-Right */}
              <rect x="140" y="10" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="148" y="18" width="34" height="34" rx="6" fill="#ffffff" />
              <rect x="154" y="24" width="22" height="22" rx="4" fill="#059669" />

              {/* Corner Position Targets Bottom-Left */}
              <rect x="10" y="140" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="18" y="148" width="34" height="34" rx="6" fill="#ffffff" />
              <rect x="24" y="154" width="22" height="22" rx="4" fill="#059669" />

              {/* Grid Matrix simulated data modules */}
              <rect x="70" y="15" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="85" y="15" width="16" height="8" rx="2" fill="#0f172a" />
              <rect x="110" y="15" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="125" y="15" width="8" height="8" rx="2" fill="#0f172a" />

              <rect x="70" y="30" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="95" y="30" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="115" y="30" width="14" height="12" rx="2" fill="#0f172a" />

              <rect x="70" y="50" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="88" y="48" width="20" height="10" rx="2" fill="#0f172a" />
              <rect x="120" y="50" width="8" height="8" rx="2" fill="#0f172a" />

              {/* Middle horizontal block */}
              <rect x="15" y="70" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="30" y="70" width="20" height="8" rx="2" fill="#0f172a" />
              <rect x="58" y="70" width="12" height="8" rx="2" fill="#0f172a" />
              <rect x="130" y="70" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="145" y="70" width="22" height="8" rx="2" fill="#0f172a" />
              <rect x="175" y="70" width="12" height="8" rx="2" fill="#0f172a" />

              <rect x="15" y="85" width="18" height="8" rx="2" fill="#0f172a" />
              <rect x="42" y="85" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="135" y="85" width="18" height="8" rx="2" fill="#0f172a" />
              <rect x="165" y="85" width="22" height="8" rx="2" fill="#0f172a" />

              <rect x="15" y="100" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="32" y="100" width="16" height="8" rx="2" fill="#0f172a" />
              <rect x="56" y="100" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="135" y="100" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="150" y="100" width="20" height="8" rx="2" fill="#0f172a" />
              <rect x="178" y="100" width="8" height="8" rx="2" fill="#0f172a" />

              <rect x="15" y="115" width="24" height="8" rx="2" fill="#0f172a" />
              <rect x="46" y="115" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="140" y="115" width="14" height="8" rx="2" fill="#0f172a" />
              <rect x="165" y="115" width="18" height="8" rx="2" fill="#0f172a" />

              {/* Bottom right modules */}
              <rect x="70" y="140" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="85" y="140" width="20" height="8" rx="2" fill="#0f172a" />
              <rect x="115" y="140" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="130" y="140" width="16" height="8" rx="2" fill="#0f172a" />
              <rect x="155" y="140" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="170" y="140" width="18" height="8" rx="2" fill="#0f172a" />

              <rect x="70" y="155" width="16" height="8" rx="2" fill="#0f172a" />
              <rect x="95" y="155" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="110" y="155" width="24" height="8" rx="2" fill="#0f172a" />
              <rect x="145" y="155" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="160" y="155" width="24" height="8" rx="2" fill="#0f172a" />

              <rect x="70" y="170" width="8" height="8" rx="2" fill="#0f172a" />
              <rect x="85" y="170" width="22" height="8" rx="2" fill="#0f172a" />
              <rect x="120" y="170" width="12" height="8" rx="2" fill="#0f172a" />
              <rect x="140" y="170" width="18" height="8" rx="2" fill="#0f172a" />
              <rect x="168" y="170" width="18" height="8" rx="2" fill="#0f172a" />

              {/* Central CashConnect Shield Emblem */}
              <circle cx="100" cy="100" r="22" fill="#ffffff" />
              <circle cx="100" cy="100" r="18" fill="#0f172a" />
              <text
                x="100"
                y="105"
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fill="#10b981"
                fontFamily="sans-serif"
              >
                ₹CC
              </text>
            </svg>
          </div>

          <p className="text-[11px] font-semibold text-slate-600 mt-1">
            Scan using any CashConnect app or camera
          </p>
        </div>

        {/* Set Specific Amount (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">Request Specific Amount</span>
            {requestedAmount && (
              <button
                onClick={() => setRequestedAmount(null)}
                className="text-amber-400 text-[11px] hover:underline"
              >
                Clear Amount
              </button>
            )}
          </div>

          {/* Amount Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setRequestedAmount(amt)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  requestedAmount === amt
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Or enter amount in ₹"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => {
                const val = Number(customInput);
                if (val > 0) {
                  setRequestedAmount(val);
                  setCustomInput('');
                }
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors"
            >
              Set
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleCopy(upiId, 'UPI ID')}
            className="py-2 px-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy UPI</span>
          </button>

          <button
            onClick={() => {
              setToastMessage('QR Code image saved to downloads!');
              setTimeout(() => setToastMessage(null), 2000);
            }}
            className="py-2 px-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save QR</span>
          </button>

          <button
            onClick={() => {
              setToastMessage('Link copied to clipboard!');
              setTimeout(() => setToastMessage(null), 2000);
            }}
            className="py-2 px-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Tester Convenience: Simulate Scanning */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prototype Quick Tester</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Want to test receiving cash right now? Click below to simulate Amit Sharma scanning your QR code:
          </p>
          <button
            onClick={handleSimulateScan}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Incoming Cash Request</span>
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
