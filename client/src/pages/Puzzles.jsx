import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Puzzle, ArrowLeft, CheckCircle, XCircle, Award, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { getPuzzles } from '../services/api';
import { useGamification } from '../context/GamificationContext';

export default function Puzzles() {
  const [puzzles, setPuzzles] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Interactive puzzle inputs
  const [scrambleInput, setScrambleInput] = useState('');
  const [trueFalseInput, setTrueFalseInput] = useState(null);
  const [riskyChoiceInput, setRiskyChoiceInput] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [selectedTerm, setSelectedTerm] = useState(null);

  // Result state
  const [solved, setSolved] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedback, setFeedback] = useState('');

  const { state, completePuzzle } = useGamification();

  useEffect(() => {
    getPuzzles().then(res => {
      if (res && res.puzzles) {
        setPuzzles(res.puzzles);
      }
    });
  }, []);

  const activePuzzle = puzzles[currentIdx];

  const handleResetCurrent = () => {
    setSolved(false);
    setIsCorrect(null);
    setFeedback('');
    setScrambleInput('');
    setTrueFalseInput(null);
    setRiskyChoiceInput(null);
    setMatchedPairs({});
    setSelectedTerm(null);
  };

  const handleNextPuzzle = () => {
    handleResetCurrent();
    setCurrentIdx(prev => (prev + 1) % puzzles.length);
  };

  // 1. Scramble verify
  const handleVerifyScramble = (e) => {
    e.preventDefault();
    if (!scrambleInput.trim() || !activePuzzle) return;
    const correct = scrambleInput.trim().toUpperCase() === activePuzzle.answer.toUpperCase();
    setIsCorrect(correct);
    setSolved(true);
    if (correct) {
      setFeedback(`Correct! "${activePuzzle.answer}" is the right solution.`);
      completePuzzle(activePuzzle.id);
    } else {
      setFeedback(`Not quite. The correct answer was "${activePuzzle.answer}".`);
    }
  };

  // 2. True / False verify
  const handleVerifyTrueFalse = (val) => {
    setTrueFalseInput(val);
    const correct = val === activePuzzle.isTrue;
    setIsCorrect(correct);
    setSolved(true);
    setFeedback(correct ? `Correct! ${activePuzzle.explanation}` : `Incorrect. ${activePuzzle.explanation}`);
    if (correct) completePuzzle(activePuzzle.id);
  };

  // 3. Identify Risky verify
  const handleVerifyRisky = (optId) => {
    setRiskyChoiceInput(optId);
    const chosen = activePuzzle.options.find(o => o.id === optId);
    const correct = chosen ? chosen.isRisky === true : false;
    setIsCorrect(correct);
    setSolved(true);
    setFeedback(correct ? `Sharp eye! ${activePuzzle.explanation}` : `Notice the warning signs. ${activePuzzle.explanation}`);
    if (correct) completePuzzle(activePuzzle.id);
  };

  // 4. Term Matching logic
  const handleTermClick = (termObj) => {
    if (solved) return;
    setSelectedTerm(termObj);
  };

  const handleDefClick = (defObj) => {
    if (!selectedTerm || solved) return;
    const updated = { ...matchedPairs, [selectedTerm.id]: defObj.id };
    setMatchedPairs(updated);
    setSelectedTerm(null);

    // Check if all pairs are filled
    if (Object.keys(updated).length === activePuzzle.pairs.length) {
      // Check correctness: pair.id === def.id
      const allCorrect = activePuzzle.pairs.every(p => updated[p.id] === p.id);
      setIsCorrect(allCorrect);
      setSolved(true);
      setFeedback(allCorrect ? 'Perfect matching! All 4 definitions correctly paired.' : 'Some terms were matched incorrectly.');
      if (allCorrect) completePuzzle(activePuzzle.id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
            <Puzzle className="w-5 h-5" />
          </div>
          Anti-Doping Puzzle Center
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Solve interactive matching, word unscramble, and risk detection challenges. (+20 XP each)
        </p>
      </div>

      {/* Navigation pagination strip */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mb-6 text-xs">
        <span className="font-semibold text-slate-700">
          Puzzle {currentIdx + 1} of {puzzles.length || 10}
        </span>
        <div className="flex gap-1.5">
          {puzzles.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                handleResetCurrent();
                setCurrentIdx(idx);
              }}
              className={`w-7 h-7 rounded-md font-bold transition flex items-center justify-center ${
                currentIdx === idx
                  ? 'bg-[#0f2942] text-white'
                  : state.completedPuzzles.includes(p.id)
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Active Puzzle Card */}
      {!activePuzzle ? (
        <div className="text-center py-12 text-slate-500">Loading puzzles...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div>
            <span className="text-xs uppercase font-bold text-amber-700 tracking-wider">
              {activePuzzle.type.toUpperCase()} CHALLENGE
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {activePuzzle.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {activePuzzle.description}
            </p>
          </div>

          {/* PUZZLE TYPE 1: SCRAMBLE */}
          {activePuzzle.type === 'scramble' && (
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-semibold block mb-1">Scrambled Word:</span>
                <span className="text-3xl font-mono font-bold tracking-widest text-[#0f2942]">
                  {activePuzzle.scrambled}
                </span>
                {activePuzzle.hint && (
                  <p className="text-xs text-slate-500 mt-2 italic">
                    Hint: {activePuzzle.hint}
                  </p>
                )}
              </div>

              {!solved ? (
                <form onSubmit={handleVerifyScramble} className="flex gap-2">
                  <input
                    type="text"
                    value={scrambleInput}
                    onChange={(e) => setScrambleInput(e.target.value)}
                    placeholder="Enter unscrambled word..."
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white uppercase font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition"
                  >
                    Submit
                  </button>
                </form>
              ) : null}
            </div>
          )}

          {/* PUZZLE TYPE 2: TRUE / FALSE */}
          {activePuzzle.type === 'true-false' && (
            <div className="space-y-4">
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                "{activePuzzle.statement}"
              </div>

              {!solved && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleVerifyTrueFalse(true)}
                    className="flex-1 py-3 border border-slate-300 hover:border-slate-400 font-bold rounded-lg text-sm text-slate-800 hover:bg-slate-50 transition"
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => handleVerifyTrueFalse(false)}
                    className="flex-1 py-3 border border-slate-300 hover:border-slate-400 font-bold rounded-lg text-sm text-slate-800 hover:bg-slate-50 transition"
                  >
                    FALSE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PUZZLE TYPE 3: IDENTIFY RISKY */}
          {activePuzzle.type === 'identify-risky' && (
            <div className="space-y-3">
              {!solved ? (
                activePuzzle.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleVerifyRisky(opt.id)}
                    className="w-full p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left text-sm text-slate-800 transition"
                  >
                    {opt.text}
                  </button>
                ))
              ) : (
                <div className="space-y-2">
                  {activePuzzle.options.map(opt => (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-lg border text-sm ${
                        opt.isRisky
                          ? 'border-red-400 bg-red-50 text-red-950 font-semibold'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt.text} {opt.isRisky && '🚩 (High Risk)'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PUZZLE TYPE 4: MATCH TERMS */}
          {activePuzzle.type === 'match' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Click a term on the left, then click its matching definition on the right:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Terms Column */}
                <div className="space-y-2">
                  {activePuzzle.pairs.map(p => {
                    const isSelected = selectedTerm?.id === p.id;
                    const isPaired = Boolean(matchedPairs[p.id]);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleTermClick(p)}
                        className={`w-full p-3 rounded-lg border text-sm text-left font-semibold transition ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 text-sky-950 ring-2 ring-sky-300'
                            : isPaired
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {p.term}
                      </button>
                    );
                  })}
                </div>

                {/* Definitions Column */}
                <div className="space-y-2">
                  {activePuzzle.pairs.map(p => {
                    const isMatchedWithSelected = selectedTerm && matchedPairs[selectedTerm.id] === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleDefClick(p)}
                        className={`w-full p-3 rounded-lg border text-xs text-left transition leading-relaxed ${
                          isMatchedWithSelected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {p.definition}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* FEEDBACK & XP EARNED (Section 24) */}
          {solved && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className={`p-4 rounded-lg border text-sm ${
                isCorrect 
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950' 
                  : 'border-amber-300 bg-amber-50 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-amber-600" />}
                  <span>{isCorrect ? 'Challenge Solved! +20 XP' : 'Attempt Complete'}</span>
                </div>
                <p className="leading-relaxed">{feedback}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleResetCurrent}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={handleNextPuzzle}
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
                >
                  <span>Next Puzzle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
