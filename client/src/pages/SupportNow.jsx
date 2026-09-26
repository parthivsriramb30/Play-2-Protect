import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Wind, Activity, Users, BookOpen, AlertTriangle, PhoneCall, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function SupportNow() {
  const [selectedMode, setSelectedMode] = useState(null); // 'distract' | 'calm' | 'move' | 'connect' | 'pro'
  const [breathingSeconds, setBreathingSeconds] = useState(0);
  const [breathingActive, setBreathingActive] = useState(false);
  const [distractionStep, setDistractionStep] = useState(0);
  const { addXP, completeSupportActivity } = useGamification();

  // One-Minute Breathing Timer (4s Inhale, 4s Hold, 4s Exhale, 4s Rest = 16s cycle)
  useEffect(() => {
    let interval = null;
    if (breathingActive && breathingSeconds < 60) {
      interval = setInterval(() => {
        setBreathingSeconds(prev => prev + 1);
      }, 1000);
    } else if (breathingSeconds >= 60 && breathingActive) {
      setBreathingActive(false);
      addXP(5, 'Completed 1-minute calming breathing drill');
      completeSupportActivity('act-breathing');
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathingSeconds]);

  const getBreathingPhase = () => {
    const cyclePos = breathingSeconds % 16;
    if (cyclePos < 4) return { phase: "Inhale Slowly...", sub: "Fill your lungs with fresh air (Count 1 to 4)", color: "text-sky-700" };
    if (cyclePos < 8) return { phase: "Hold Gently...", sub: "Notice the stillness in your chest", color: "text-indigo-700" };
    if (cyclePos < 12) return { phase: "Exhale Slowly...", sub: "Release any physical tension (Count 1 to 4)", color: "text-emerald-700" };
    return { phase: "Rest Empty...", sub: "Pause before the next breath", color: "text-slate-600" };
  };

  const currentPhase = getBreathingPhase();

  const handleStartBreathing = () => {
    setBreathingSeconds(0);
    setBreathingActive(true);
  };

  const handleDistractNext = () => {
    if (distractionStep < 4) {
      setDistractionStep(prev => prev + 1);
    } else {
      addXP(5, 'Completed 5-4-3-2-1 grounding exercise');
      completeSupportActivity('act-grounding');
    }
  };

  const GROUNDING_STEPS = [
    { count: 5, label: "Look around you", prompt: "Notice 5 distinct objects you can see right now (e.g. your shoes, a lamp, a tree outside)." },
    { count: 4, label: "Feel your body", prompt: "Notice 4 things you can physically feel (e.g. feet on the floor, texture of your sleeves, chair against your back)." },
    { count: 3, label: "Listen carefully", prompt: "Identify 3 distinct sounds in your environment (e.g. a fan humming, distant traffic, your own quiet breath)." },
    { count: 2, label: "Notice scent", prompt: "Identify 2 things you can smell right now (or recall your favorite clean scent like coffee or pine trees)." },
    { count: 1, label: "State your truth", prompt: "Say one truth aloud: 'This urge is a wave that will pass. I am choosing to protect my health and future.'" }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          Need Something To Do Right Now?
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          If you are experiencing a strong urge or temptation, choose a short activity to help you pause and redirect your attention.
        </p>
      </div>

      {/* Safety Escalation Alert (Section 27) */}
      <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 text-xs sm:text-sm space-y-2">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-red-950 block">Immediate Safety & Emergency Notice:</strong>
            If you or someone near you is experiencing severe symptoms, chest pain, difficulty breathing, seizures, suspected overdose, or thoughts of self-harm, <strong>this is an emergency</strong>. Please call your local emergency services (e.g. 112 / 911 / 999) or visit the nearest hospital emergency room immediately.
          </div>
        </div>
      </div>

      {/* Quick Check-in Choice Grid (Section 21) */}
      {!selectedMode ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            What do you need right now?
          </h2>
          <p className="text-xs text-slate-500">
            Pick whatever feels easiest for this exact moment. Even a 2-minute pause allows an urge to peak and subside.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setSelectedMode('distract')}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Distract me
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">5-4-3-2-1 sensory grounding challenge</p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMode('calm');
                handleStartBreathing();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                  Help me calm down
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">1-minute paced breathing exercise</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('move')}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Help me move
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Safe physical reset and hydration</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode('connect')}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">
                  Help me connect with someone
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Talk to a trusted friend or mentor</p>
              </div>
            </button>

            <Link
              to="/videos"
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                  Show me something educational
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Watch verified expert awareness videos</p>
              </div>
            </Link>

            <Link
              to="/professionals"
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-left transition flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition">
                  I want professional support
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Find verified doctors and counsellors</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* Selected Action Interface */
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Choose another activity</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">Safe Coping Space</span>
          </div>

          {/* 1. DISTRACTION MODE (Section 22) */}
          {selectedMode === 'distract' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-amber-700 tracking-wider">
                  Grounding Challenge
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Step {distractionStep + 1} of 5: {GROUNDING_STEPS[distractionStep].label}
                </h2>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold text-lg flex items-center justify-center mx-auto">
                  {GROUNDING_STEPS[distractionStep].count}
                </div>
                <p className="text-base text-slate-800 font-semibold max-w-md mx-auto leading-relaxed">
                  {GROUNDING_STEPS[distractionStep].prompt}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link to="/puzzles" className="text-xs text-slate-600 hover:underline">
                  Or try a quick word puzzle →
                </Link>

                <button
                  onClick={handleDistractNext}
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition"
                >
                  {distractionStep < 4 ? "Done, Next Step →" : "Finish Grounding (+5 XP)"}
                </button>
              </div>

              {distractionStep === 4 && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nice work. You gave yourself a few minutes to pause and redirect your attention.</span>
                </div>
              )}
            </div>
          )}

          {/* 2. CALMING MODE (Section 23) */}
          {selectedMode === 'calm' && (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs font-bold uppercase text-sky-700 tracking-wider">
                  1-Minute Breathing Drill
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Paced Box Breathing
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controlled breathing signals the parasympathetic nervous system to slow your heart rate.
                </p>
              </div>

              {/* Visual Box Pacer */}
              <div className="py-8">
                <div className="w-44 h-44 rounded-full border-4 border-slate-200 flex flex-col items-center justify-center mx-auto relative bg-slate-50 transition-all duration-700">
                  <span className={`text-xl font-bold ${currentPhase.color}`}>
                    {currentPhase.phase}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {60 - breathingSeconds}s remaining
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-4 max-w-sm mx-auto">
                  {currentPhase.sub}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {!breathingActive ? (
                  <button
                    onClick={handleStartBreathing}
                    className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restart 1-Minute Drill</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setBreathingActive(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
                  >
                    Pause Drill
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. MOVEMENT MODE (Section 24) */}
          {selectedMode === 'move' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                  Safe Physical Reset
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Step Into Action
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Physical movement uses excess adrenaline and alters brain chemistry naturally.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-900 block font-bold">1. Walk for 5 Minutes</strong>
                  <p className="text-slate-600">Take a steady walk outside or down the hallway without checking your phone.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-900 block font-bold">2. Cold Hydration</strong>
                  <p className="text-slate-600">Drink a tall glass of cold water and splash cool water on your face.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-900 block font-bold">3. Light Mobility</strong>
                  <p className="text-slate-600">Roll your shoulders back 10 times, stretch your calves, and release your jaw.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <strong className="text-slate-900 block font-bold">4. Change Environment</strong>
                  <p className="text-slate-600">Move out of the room where you felt the temptation into an open, well-lit space.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    addXP(5, 'Completed movement reset');
                    completeSupportActivity('act-movement');
                    setSelectedMode(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  I Completed a Movement Reset (+5 XP)
                </button>
              </div>
            </div>
          )}

          {/* 4. CONNECTION MODE (Section 25) */}
          {selectedMode === 'connect' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase text-purple-700 tracking-wider">
                  Social Connection
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Talk to Someone You Trust
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isolation increases the intensity of urges. Speaking to someone breaks the feedback loop.
                </p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong className="text-slate-900 block font-semibold mb-0.5">Trusted Friend or Family Member</strong>
                  <p className="text-slate-600 text-xs">Call or text someone you feel safe around. You don't have to talk about cravings—just hearing a friendly voice helps ground you.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong className="text-slate-900 block font-semibold mb-0.5">Coach or Teacher</strong>
                  <p className="text-slate-600 text-xs">Discuss training schedules, academic goals, or general stress management.</p>
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                  <strong className="text-slate-900 block font-semibold mb-0.5">Qualified Healthcare Professional</strong>
                  <p className="text-slate-600 text-xs">Connect with doctors or counsellors who specialize in confidential youth and sports guidance.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <Link
                  to="/professionals"
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center justify-center gap-1.5"
                >
                  <span>View Professional Directory</span>
                  <span>→</span>
                </Link>

                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Return to activities
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
