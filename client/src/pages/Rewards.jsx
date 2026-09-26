import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowLeft, Copy, Check, AlertTriangle, Tag, Sparkles } from 'lucide-react';
import { getOffers, claimReward } from '../services/api';
import { useGamification } from '../context/GamificationContext';

export default function Rewards() {
  const [offers, setOffers] = useState([]);
  const [claimedCodes, setClaimedCodes] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { state, deductPoints, unlockBadge, addXP } = useGamification();

  useEffect(() => {
    getOffers().then(res => {
      if (res && res.offers) {
        setOffers(res.offers);
      }
    });
  }, []);

  const handleClaim = async (offer) => {
    setErrorMsg('');
    if (state.rewardPoints < offer.pointsCost) {
      setErrorMsg(`You have ${state.rewardPoints} points, but need ${offer.pointsCost} points to claim this offer.`);
      return;
    }

    const success = deductPoints(offer.pointsCost);
    if (!success) {
      setErrorMsg('Failed to deduct reward points.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `${offer.code}-${randomSuffix}`;
    setClaimedCodes(prev => ({ ...prev, [offer.id]: generatedCode }));

    unlockBadge('badge-08', { name: 'Reward Hunter', description: 'Claimed your first sports nutrition demo offer.' });
    addXP(10, 'Claimed demo reward');
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              Student & Athlete Rewards
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Redeem clean-sport partner demo discounts using earned educational activity points.
            </p>
          </div>

          <div className="self-start sm:self-auto px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900">
            Available Balance: {state.rewardPoints} Points
          </div>
        </div>
      </div>

      {/* Point Rules Summary (Section 28) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-bold text-slate-800">Earning Rules:</span>
        <span className="text-slate-600">Daily Activity → <strong className="text-slate-900">+5 pts</strong></span>
        <span className="text-slate-600">Learning Module → <strong className="text-slate-900">+10 pts</strong></span>
        <span className="text-slate-600">Story Mission → <strong className="text-slate-900">+15 pts</strong></span>
        <span className="text-slate-600">7-Day Streak → <strong className="text-slate-900">+50 pts</strong></span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
          {errorMsg}
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const claimedCode = claimedCodes[offer.id];
          const canAfford = state.rewardPoints >= offer.pointsCost;

          return (
            <div
              key={offer.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                    {offer.discount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Cost: {offer.pointsCost} pts
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {offer.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {offer.description}
                </p>
                <div className="text-[11px] text-slate-400 mt-2">
                  Category: {offer.category} • Expiry: {offer.expiry}
                </div>
              </div>

              {/* Claim / Code Output Box */}
              <div className="pt-3 border-t border-slate-100">
                {claimedCode ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#0f2942]">
                        {claimedCode}
                      </span>
                      <button
                        onClick={() => handleCopy(claimedCode)}
                        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition flex items-center gap-1 text-xs"
                      >
                        {copiedCode === claimedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaim(offer)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition ${
                      canAfford
                        ? 'bg-[#0f2942] hover:bg-[#183d63] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    {canAfford ? `Claim Offer (${offer.pointsCost} Pts)` : `Need ${offer.pointsCost - state.rewardPoints} more pts`}
                  </button>
                )}

                {/* Strict Safety Disclaimer (Section 28) */}
                <p className="text-[10px] text-slate-500 mt-3 italic leading-normal">
                  *{offer.disclaimer} No real monetary transactions or commercial checkout.
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
