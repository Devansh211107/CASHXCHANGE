import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const RatingModal: React.FC = () => {
  const {
    state,
    currentUser,
    ratingTxId,
    setRatingTxId,
    submitRating,
  } = useApp();

  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>('Smooth cash handover and fast communication!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!ratingTxId) return null;

  const tx = state.transactions[ratingTxId];
  if (!tx) return null;

  const isSender = currentUser.id === tx.senderId;
  const isReceiver = currentUser.id === tx.receiverId;
  const targetUserId = isSender ? tx.receiverId : tx.senderId;
  const targetUser = state.users[targetUserId];

  // Section 20 Questions:
  const questionTitle = isSender ? 'How was the Receiver?' : 'How was the Sender?';
  const roleName = isSender ? 'Receiver' : 'Sender';

  // Check if current user already rated this transaction
  const alreadyRated = state.ratings.some(
    (r) => r.transactionId === tx.id && r.fromUserId === currentUser.id
  );

  const handleSubmit = () => {
    setErrorMsg(null);
    const res = submitRating(tx.id, stars, reviewText);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to submit rating.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setRatingTxId(null);
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 text-white space-y-4 shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>Rate Experience</span>
          </div>
          <button
            onClick={() => setRatingTxId(null)}
            className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Rating Submitted!</h4>
            <p className="text-xs text-slate-400">
              Updated {targetUser?.name}'s {roleName} reputation score.
            </p>
          </div>
        ) : alreadyRated ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Already Rated</h4>
            <p className="text-xs text-slate-300">
              You have already submitted a rating for transaction {tx.id}. Ratings cannot be duplicated.
            </p>
            <button
              onClick={() => setRatingTxId(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Target User Info */}
            <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <img
                src={targetUser?.profileImage}
                alt={targetUser?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{targetUser?.name}</h4>
                <p className="text-xs text-slate-400">
                  Role: <span className="text-amber-300 font-semibold">{roleName}</span>
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                  <span>Current {roleName} Score:</span>
                  <span className="font-bold text-amber-300">
                    {isSender ? targetUser?.receiverRating : targetUser?.senderRating} ⭐
                  </span>
                </div>
              </div>
            </div>

            {/* Question Title (Section 20) */}
            <div className="text-center space-y-1">
              <h3 className="text-base font-extrabold text-white">{questionTitle}</h3>
              <p className="text-xs text-slate-400">
                Tap to rate from 1 to 5 stars
              </p>
            </div>

            {/* 5-Star Selector */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isLit = (hoverStars ?? stars) >= starIndex;
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onMouseEnter={() => setHoverStars(starIndex)}
                    onMouseLeave={() => setHoverStars(null)}
                    onClick={() => setStars(starIndex)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isLit
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-800 text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Optional Review */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Optional Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share helpful feedback..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-rating"
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              SUBMIT RATING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
