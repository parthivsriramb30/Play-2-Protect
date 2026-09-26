import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const RECALL_QUESTIONS = [
  {
    id: 'r-1',
    prompt: "Under Strict Liability, whose responsibility is any banned substance found in an athlete's body?",
    options: [
      "The coach",
      "The athlete alone",
      "The supplement company",
      "The pharmacist"
    ],
    correctIndex: 1,
    explanation: "Strict liability means the athlete is solely accountable for what enters their body."
  },
  {
    id: 'r-2',
    prompt: "What does TUE stand for?",
    options: [
      "Total Urine Examination",
      "Therapeutic Use Exemption",
      "Timed Urgent Evaluation",
      "Targeted Universal Enforcement"
    ],
    correctIndex: 1,
    explanation: "A Therapeutic Use Exemption allows approved medication for documented medical needs."
  },
  {
    id: 'r-3',
    prompt: "Which independent seal confirms third-party batch testing for banned substances?",
    options: [
      "Informed Sport / NSF Certified for Sport",
      "100% Herbal Seal",
      "Online Health Stamp",
      "Natural Formula Verified"
    ],
    correctIndex: 0,
    explanation: "Informed Sport and NSF test specific manufacturing batches down to parts-per-billion."
  }
];

export default function QuickRecall() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [results, setResults] = useState([]);
  const { addXP, unlockBadge, logActivity } = useGamification();

  const active = RECALL_QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const isCorrect = idx === active.correctIndex;
    
    setResults(prev => [...prev, { qIndex: currentIdx, isCorrect }]);

    if (isCorrect) {
      addXP(10, 'Quick recall answer');
    }
    logActivity('Recall test');
  };

  const handleNext = () => {
    setSelectedOpt(null);
    if (currentIdx + 1 < RECALL_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      unlockBadge('badge-10', {
        name: 'Fast Thinker',
        description: 'Aced a 30-Second Quick Recall retention session.'
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setResults([]);
  };

  const isComplete = results.length === RECALL_QUESTIONS.length;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
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
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          30 Second Recall
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Rapid memory retention drill to cement critical anti-doping rules.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {!isComplete ? (
          <>
            <div className="flex justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
              <span>Question {currentIdx + 1} of {RECALL_QUESTIONS.length}</span>
              <span className="text-emerald-700">+10 XP per question</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {active.prompt}
            </h2>

            <div className="space-y-2.5">
              {active.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOpt !== null}
                  className={`w-full p-3.5 text-left text-sm rounded-lg border transition ${
                    selectedOpt === i
                      ? i === active.correctIndex
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-red-400 bg-red-50 text-red-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selectedOpt !== null && (
              <div className="space-y-4 pt-2">
                <div className={`p-3.5 rounded-lg border text-xs ${
                  selectedOpt === active.correctIndex
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                    : 'border-amber-300 bg-amber-50 text-amber-900 font-medium'
                }`}>
                  <p className="font-bold mb-0.5">
                    {selectedOpt === active.correctIndex
                      ? 'Great! You remembered it.'
                      : "Let's review this topic."}
                  </p>
                  <p>{active.explanation}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
                  >
                    <span>{currentIdx + 1 < RECALL_QUESTIONS.length ? 'Next Question' : 'View Results'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Finished Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Recall Drill Complete!
            </h2>
            <p className="text-xs text-slate-600">
              You correctly recalled {results.filter(r => r.isCorrect).length} out of {RECALL_QUESTIONS.length} core concepts.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Restart Recall
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-[#0f2942] text-white text-xs font-semibold rounded-lg hover:bg-[#183d63] transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
