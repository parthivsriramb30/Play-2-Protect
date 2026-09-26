import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, Utensils, Calendar, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { getSupportGuidance } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const SUBSTANCE_OPTIONS = [
  "Stimulants",
  "Steroids",
  "Cannabis",
  "Opioids",
  "Sedatives",
  "Alcohol",
  "Prescription medicine misuse",
  "Unknown substances",
  "General drug awareness",
  "Prefer not to say"
];

export default function PersonalizedSupport() {
  const [selectedSubstance, setSelectedSubstance] = useState("General drug awareness");
  const [guidance, setGuidance] = useState(null);
  const [checkedWellness, setCheckedWellness] = useState({});
  const { addXP, logActivity, completeSupportActivity } = useGamification();

  useEffect(() => {
    getSupportGuidance(selectedSubstance).then(res => {
      if (res && res.profile) {
        setGuidance(res);
      }
    });
  }, [selectedSubstance]);

  const handleToggleWellness = (itemId) => {
    const updated = { ...checkedWellness, [itemId]: !checkedWellness[itemId] };
    setCheckedWellness(updated);

    if (updated[itemId]) {
      addXP(5, 'Completed healthy routine check');
      completeSupportActivity(itemId);
    }
  };

  const profile = guidance?.profile;

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              Personalized Awareness & Support
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore objective substance risks, general wellness habits, and confidential guidance.
            </p>
          </div>
          <Link
            to="/support-now"
            className="self-start sm:self-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Having an Urge Right Now?</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Strict Privacy Commitment (Section 14) */}
      <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900">Total Privacy Guarantee: </strong>
          Your voluntary topic selection is 100% confidential. It is never displayed on the public leaderboard, never included in user profiles, and never shared with coaches or peers.
        </div>
      </div>

      {/* 1. Voluntary Substance Selector (Section 13) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          What would you like information about?
        </h2>
        <p className="text-xs text-slate-500">
          Select a category to review factual health risks and non-medical wellness recommendations.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {SUBSTANCE_OPTIONS.map((sub, i) => (
            <button
              key={i}
              onClick={() => setSelectedSubstance(sub)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                selectedSubstance === sub
                  ? 'bg-[#0f2942] text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {sub === "Prefer not to say" ? "🔒 Prefer not to say" : sub}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Educational Risk Breakdown (Section 15) */}
      {profile && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Educational Risk Overview
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Understanding {profile.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{profile.subtitle}</p>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <strong className="text-slate-900 block font-semibold mb-1">General Biological Effects:</strong>
              <p className="leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm">
                {profile.generalEffects}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
                <strong className="text-xs font-bold text-amber-950 block mb-2">Short-Term Concerns:</strong>
                <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside leading-relaxed">
                  {profile.shortTermRisks.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-red-50/50 border border-red-200">
                <strong className="text-xs font-bold text-red-950 block mb-2">Long-Term Health Risks:</strong>
                <ul className="space-y-1 text-xs text-red-900 list-disc list-inside leading-relaxed">
                  {profile.longTermRisks.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <strong className="text-slate-900 block font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Signs That Professional Clinical Support is Needed:
              </strong>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                  {profile.signsHelpNeeded.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-sky-50/60 border border-sky-200 text-xs text-sky-950 leading-relaxed">
              <strong className="block text-sky-900 font-bold mb-1">Anti-Doping & Clean Sport Relevance:</strong>
              {profile.antiDopingRelevance}
            </div>
          </div>

          {/* CRITICAL MEDICAL SAFETY NOTICE (Section 16) */}
          <div className="p-5 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-950 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <strong className="font-bold text-amber-950 block mb-1">Important Medical Safety Rule:</strong>
                {guidance.safetyDisclaimer}
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                to="/professionals"
                className="px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Find Professional Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. General Healthy Routine Checklist (Section 17) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Today's Healthy Routine (Non-Medical Wellness Checklist)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Small daily habits that naturally restore biological vitality and focus. (+5 XP per item)
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          {guidance?.wellnessChecklist?.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-3 p-3.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${
                checkedWellness[item.id]
                  ? 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={Boolean(checkedWellness[item.id])}
                onChange={() => handleToggleWellness(item.id)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
              />
              <span className="leading-relaxed">{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. General Healthy Eating Guide (Section 18) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600" />
            General Healthy Eating Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nutritional basics to support natural organ recovery and training energy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Breakfast Fuel</strong>
            <p className="text-slate-600 leading-relaxed">{guidance?.healthyEatingGuide?.breakfast}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Midday Sustenance</strong>
            <p className="text-slate-600 leading-relaxed">{guidance?.healthyEatingGuide?.lunch}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Smart Snack</strong>
            <p className="text-slate-600 leading-relaxed">{guidance?.healthyEatingGuide?.snack}</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Evening Recovery</strong>
            <p className="text-slate-600 leading-relaxed">{guidance?.healthyEatingGuide?.dinner}</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic pt-1">
          *{guidance?.nutritionDisclaimer}
        </p>
      </div>

      {/* 5. My Support Plan (Section 19) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          My Daily Support Plan
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guidance?.dailySupportPlan?.map((plan, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                {plan.phase}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{plan.action}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
