import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, CheckCircle2, XCircle, Award, ArrowRight, RefreshCw } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const MYTHS = [
  {
    id: 'mf-1',
    statement: "Natural herbal supplements are always 100% safe and free from prohibited substances.",
    isTrue: false,
    explanation: "MYTH (False). Plants naturally contain potent pharmacologically active alkaloids (like ephedrine or cathine). Furthermore, unregulated herbal supplements carry high rates of cross-contamination or synthetic spiking.",
    xp: 15
  },
  {
    id: 'mf-2',
    statement: "Under the principle of Strict Liability, an athlete is guilty of a doping violation even if a friend slipped an unverified powder into their shake without their knowledge.",
    isTrue: true,
    explanation: "FACT (True). Strict liability states that an athlete is strictly responsible for whatever is detected in their body. Lack of intent does not eliminate the violation, though it may be considered during penalty mitigation hearings.",
    xp: 15
  },
  {
    id: 'mf-3',
    statement: "Athletes with genuine asthma are completely banned from using any inhaled salbutamol inhalers.",
    isTrue: false,
    explanation: "MYTH (False). Inhaled salbutamol is permitted within standard therapeutic dose limits (up to 1600 mcg per 24 hours). Doses exceeding this limit or oral tablet forms require a Therapeutic Use Exemption (TUE).",
    xp: 15
  },
  {
    id: 'mf-4',
    statement: "WADA's In-Competition ban on specified stimulants starts at 11:59 PM on the day before the competition event.",
    isTrue: true,
    explanation: "FACT (True). Unless specifically defined otherwise by an international federation, the in-competition period commences at 11:59 PM the night prior to the athlete's scheduled event.",
    xp: 15
  },
  {
    id: 'mf-5',
    statement: "Over-the-counter cold medicines with pseudoephedrine can cause a failed drug test in competition.",
    isTrue: true,
    explanation: "FACT (True). Pseudoephedrine has an in-competition urinary threshold of 150 µg/mL. Taking standard therapeutic doses within 24 hours of competition frequently causes athletes to exceed this threshold.",
    xp: 15
  }
];

export default function MythVsFact() {
  const [index, setIndex] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const { addXP, logActivity, completeDailyChallenge } = useGamification();

  const current = MYTHS[index];

  const handleChoice = (choiceBool) => {
    if (userChoice !== null) return;
    setUserChoice(choiceBool);

    const isCorrect = choiceBool === current.isTrue;
    if (isCorrect) {
      addXP(current.xp, 'Myth vs. Fact question');
    }
    logActivity('Daily Challenge');
    completeDailyChallenge();
  };

  const handleNext = () => {
    setUserChoice(null);
    setIndex((prev) => (prev + 1) % MYTHS.length);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          Myth vs. Fact
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Separate locker-room folklore from verified sports science and anti-doping law.
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
          <span>Question {index + 1} of {MYTHS.length}</span>
          <span className="text-emerald-700">+{current.xp} XP per correct answer</span>
        </div>

        {/* Statement Box */}
        <div className="p-6 rounded-lg bg-slate-50 border border-slate-200 text-center">
          <p className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            "{current.statement}"
          </p>
        </div>

        {/* Action Buttons */}
        {userChoice === null ? (
          <div className="flex gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 py-3.5 px-6 border-2 border-slate-300 hover:border-slate-800 hover:bg-slate-50 rounded-xl text-base font-bold text-slate-800 transition"
            >
              TRUE
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 py-3.5 px-6 border-2 border-slate-300 hover:border-slate-800 hover:bg-slate-50 rounded-xl text-base font-bold text-slate-800 transition"
            >
              FALSE
            </button>
          </div>
        ) : (
          /* Result & Explanation */
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-lg border text-sm ${
              userChoice === current.isTrue
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-red-300 bg-red-50 text-red-950'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {userChoice === current.isTrue ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Correct! +{current.xp} XP Earned</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed mt-1">{current.explanation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
