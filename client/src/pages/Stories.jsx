import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, CheckCircle, AlertTriangle, Award, ArrowRight } from 'lucide-react';
import { getMissions } from '../services/api';
import { useGamification } from '../context/GamificationContext';

export default function Stories() {
  const [missions, setMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const { state, completeStory } = useGamification();

  useEffect(() => {
    getMissions().then(res => {
      if (res && res.missions) {
        setMissions(res.missions);
      }
    });
  }, []);

  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    if (selectedMission) {
      completeStory(selectedMission.id);
    }
  };

  const handleResetMission = () => {
    setSelectedChoice(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          Clean Sport Decision Stories
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Explore realistic athletic scenarios where one choice can protect or end a sports career. (+50 XP per mission)
        </p>
      </div>

      {/* Mission Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {missions.map((m, idx) => {
          const isDone = state.completedStories.includes(m.id);
          const isSelected = selectedMission?.id === m.id || (!selectedMission && idx === 0);
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMission(m);
                setSelectedChoice(null);
              }}
              className={`p-3 rounded-lg border text-left text-xs font-medium transition flex flex-col justify-between h-20 ${
                isSelected
                  ? 'border-[#0f2942] bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">Mission {idx + 1}</span>
                {isDone && <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />}
              </div>
              <span className="line-clamp-2 leading-tight opacity-90">
                {m.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Story View */}
      {(() => {
        const active = selectedMission || missions[0];
        if (!active) {
          return <div className="text-center py-12 text-slate-500">Loading missions...</div>;
        }

        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Mission Title & Intro */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                <span>Scenario Challenge</span>
                <span>•</span>
                <span>+50 XP</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {active.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {active.subtitle}
              </p>
            </div>

            {/* Situation Box */}
            <div className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed">
              <strong className="block text-slate-900 font-bold mb-2">The Situation:</strong>
              {active.situation}
            </div>

            {/* Choices Options */}
            {!selectedChoice ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  What will you do?
                </h3>
                <div className="space-y-2.5">
                  {active.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleSelectChoice(choice)}
                      className="w-full p-4 text-left text-sm rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50/70 text-slate-800 transition flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {choice.id.replace('c', '')}
                      </span>
                      <span className="leading-relaxed">{choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Consequence Analysis View (Section 23) */
              <div className="space-y-5 pt-2">
                
                {/* 1. Your Decision */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-sm">
                  <strong className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Decision
                  </strong>
                  <p className="font-semibold text-slate-900">{selectedChoice.yourDecision}</p>
                </div>

                {/* 2. What Could Happen */}
                <div className={`p-4 rounded-lg border text-sm ${
                  selectedChoice.isCorrect 
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950' 
                    : 'border-red-200 bg-red-50/60 text-red-950'
                }`}>
                  <strong className="block text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    {selectedChoice.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                    What Could Happen
                  </strong>
                  <p className="leading-relaxed">{selectedChoice.whatCouldHappen}</p>
                </div>

                {/* 3. Better Approach */}
                <div className="p-4 rounded-lg border border-sky-200 bg-sky-50/60 text-sky-950 text-sm">
                  <strong className="block text-xs font-bold uppercase tracking-wider mb-1 text-sky-900">
                    Better Approach
                  </strong>
                  <p className="leading-relaxed">{selectedChoice.betterApproach}</p>
                </div>

                {/* 4. Educational Explanation */}
                <div className="p-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-700">
                  <strong className="block text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">
                    Educational Explanation
                  </strong>
                  <p className="leading-relaxed">{selectedChoice.educationalExplanation}</p>
                </div>

                {/* 5. XP Earned & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    <Award className="w-4 h-4" />
                    <span>+50 XP Added to your profile</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleResetMission}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      Try Other Choices
                    </button>
                    <button
                      onClick={() => {
                        const currentIdx = missions.findIndex(m => m.id === active.id);
                        const nextMission = missions[(currentIdx + 1) % missions.length];
                        setSelectedMission(nextMission);
                        setSelectedChoice(null);
                      }}
                      className="px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
                    >
                      <span>Next Scenario</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
}
