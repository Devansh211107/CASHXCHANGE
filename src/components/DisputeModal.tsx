import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DisputeModal: React.FC = () => {
  const {
    disputeTxId,
    setDisputeTxId,
    reportDispute,
  } = useApp();

  const [reason, setReason] = useState<string>('Receiver did not arrive');
  const [description, setDescription] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!disputeTxId) return null;

  const reasons = [
    'Receiver did not arrive',
    'Sender did not arrive',
    'Incorrect cash amount',
    'Fake currency note concern',
    'Other issue',
  ];

  const handleSubmit = () => {
    if (!description.trim()) {
      setDescription('User reported an issue during meeting.');
    }
    reportDispute(disputeTxId, reason, description.trim() || 'Issue reported during meetup');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setDisputeTxId(null);
      setDescription('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-scale-up">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Flag className="w-4 h-4" />
            <h4 className="text-sm font-extrabold text-white">Report Problem</h4>
          </div>
          <button
            onClick={() => setDisputeTxId(null)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Dispute Filed</h4>
            <p className="text-xs text-slate-400">
              Transaction has been marked as DISPUTED. Admin team has received the alert.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-slate-300">
              Select the reason for reporting transaction <span className="font-mono text-blue-400 font-bold">{disputeTxId}</span>:
            </p>

            <div className="space-y-1.5">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    reason === r
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="dispute-reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-amber-500"
                  />
                  <span className="font-medium text-xs">{r}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Filing a dispute pauses transaction completion and alerts the support/admin team.
              </span>
            </div>

            <button
              id="btn-submit-dispute"
              onClick={handleSubmit}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              SUBMIT REPORT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
