import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ScanLine,
  Zap,
  ZapOff,
  Image as ImageIcon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

export const QRScannerModal: React.FC = () => {
  const {
    isQrScannerOpen,
    setIsQrScannerOpen,
    state,
    currentUser,
    setIsSenderModalOpen,
  } = useApp();

  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scannedPeer, setScannedPeer] = useState<User | null>(null);
  const [scannedAmount, setScannedAmount] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraMode, setCameraMode] = useState<'BACK' | 'FRONT'>('BACK');

  useEffect(() => {
    if (isQrScannerOpen) {
      setScannedPeer(null);
      setScannedAmount(null);
      setIsScanning(true);
    }
  }, [isQrScannerOpen]);

  if (!isQrScannerOpen) return null;

  // Nearby receivers eligible for scanning
  const candidateReceivers = (Object.values(state.users) as User[]).filter(
    (u) => u.id !== currentUser.id && !u.isSuspended
  );

  const handleSimulateScanPeer = (user: User, presetAmt?: number) => {
    setIsScanning(false);
    setScannedPeer(user);
    setScannedAmount(presetAmt || null);
  };

  const handleProceedToPayment = () => {
    if (!scannedPeer) return;
    setIsQrScannerOpen(false);
    // Open Sender Flow modal with this receiver pre-selected
    setIsSenderModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Scan QR to Send Money</h3>
              <p className="text-[10px] text-slate-400">Point at receiver QR or select demo code</p>
            </div>
          </div>
          <button
            onClick={() => setIsQrScannerOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder or Scanned Result */}
        {scannedPeer ? (
          /* Scanned Success Preview */
          <div className="bg-slate-800/80 border border-emerald-500/50 rounded-2xl p-4 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase block">
                QR Verified Peer Found
              </span>
              <h4 className="text-base font-black text-white mt-1">{scannedPeer.name}</h4>
              <p className="text-xs text-slate-400 font-mono">
                {scannedPeer.upiId || `${scannedPeer.name.toLowerCase().replace(/\s+/g, '')}@cashconnect`}
              </p>
            </div>

            {/* Peer Reputation metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Receiver Rating</span>
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>{scannedPeer.receiverRating}</span>
                  <span className="text-[10px] text-slate-400">({scannedPeer.receiverCompleted} txns)</span>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-2 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Relative Distance</span>
                <div className="font-bold text-white mt-0.5">
                  ~{scannedPeer.distanceKm} km away
                </div>
              </div>
            </div>

            {scannedAmount && (
              <div className="bg-blue-600/20 border border-blue-500/40 rounded-xl p-2.5">
                <span className="text-[10px] text-blue-300 font-semibold block">Requested Amount</span>
                <span className="text-xl font-black text-white">₹{scannedAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setScannedPeer(null);
                  setIsScanning(true);
                }}
                className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Scan Again
              </button>
              <button
                onClick={handleProceedToPayment}
                className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
              >
                <span>Request Cash</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera Viewfinder Simulation */
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
            {/* Background Camera Noise Simulation */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${
                flashlightOn ? 'from-slate-800 via-slate-900 to-slate-950' : 'from-slate-950 via-slate-900 to-black'
              } transition-colors duration-300`}
            />

            {/* Viewfinder Target Box */}
            <div className="relative w-48 h-48 border-2 border-dashed border-blue-500/60 rounded-2xl flex items-center justify-center">
              {/* Corner Accents */}
              <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-blue-400 rounded-tl" />
              <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-blue-400 rounded-tr" />
              <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-blue-400 rounded-bl" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-blue-400 rounded-br" />

              {/* Animated Laser Scanning Beam */}
              {isScanning && (
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3b82f6] animate-bounce" />
              )}

              <div className="text-center p-3 pointer-events-none">
                <ScanLine className="w-8 h-8 text-blue-400/60 mx-auto animate-pulse" />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  Align peer QR code within this frame
                </p>
              </div>
            </div>

            {/* Camera Floating Controls */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
              <button
                onClick={() => setFlashlightOn(!flashlightOn)}
                className={`p-2.5 rounded-full border transition-all ${
                  flashlightOn
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Toggle Torch"
              >
                {flashlightOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setCameraMode(cameraMode === 'BACK' ? 'FRONT' : 'BACK')}
                className="p-2.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white transition-all"
                title="Flip Camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <label
                className="p-2.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 hover:text-white transition-all cursor-pointer"
                title="Upload QR from Gallery"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // Pick first candidate receiver
                      if (candidateReceivers.length > 0) {
                        handleSimulateScanPeer(candidateReceivers[0], 2000);
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Demo Fast-Scan Shortcuts (Section 42 & Tester Convenience) */}
        {!scannedPeer && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap to Scan Nearby Peer's Demo QR</span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {candidateReceivers.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSimulateScanPeer(user)}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                          {user.name}
                        </span>
                        {user.verified && (
                          <ShieldCheck className="w-3 h-3 text-blue-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {user.distanceKm} km • {user.receiverRating} ⭐ Receiver
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Scan Code
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
