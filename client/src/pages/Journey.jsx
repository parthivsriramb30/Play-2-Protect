import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, CheckCircle, AlertTriangle, BookOpen, HelpCircle, Utensils, HeartHandshake, Users } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const TOPICS = [
  "Stimulants",
  "Steroids",
  "Recreational drugs",
  "Misuse of medicines",
  "Unknown substances",
  "General awareness"
];

const REASONS = [
  "General awareness",
  "Understand the risks",
  "Make healthier choices",
  "Learn for someone I know"
];

const DAYS_DATA = [
  {
    day: 1,
    title: "Understanding Substances & Immediate Biological Impact",
    lesson: "All active pharmacological substances enter the bloodstream and interact directly with cellular receptors, cardiovascular networks, and neural pathways. While unregulated workout boosters or recreational drugs claim instant benefits, the body inevitably balances artificial surges with acute physiological downregulation: elevated blood pressure, cardiac strain, and neurochemical exhaustion.",
    question: {
      prompt: "What is the primary biological consequence of ingesting unverified high-stimulant compounds?",
      options: [
        "Permanent immunity to fatigue without recovery needs",
        "Elevated cardiovascular strain, potential arrhythmias, and nervous system crash",
        "Instant increase in bone density within 24 hours",
        "Reduction in natural perspiration"
      ],
      correctIndex: 1,
      explanation: "Central nervous system stimulants force extreme heart rate elevations and arterial constriction, drastically multiplying heart attack and stroke risks during exertion."
    },
    miniPuzzle: {
      prompt: "Match the substance risk to its reality:",
      statement: "True or False: Using an unregulated stimulant just once carries zero health or anti-doping penalty.",
      isTrue: false,
      explanation: "False. Even a single dose of a prohibited stimulant can trigger an Adverse Analytical Finding (positive test) and acute cardiac distress."
    },
    xpReward: 25
  },
  {
    day: 2,
    title: "Navigating Pressures, Myths & Social Environments",
    lesson: "Athletes and fitness enthusiasts often encounter subtle or direct pressure in gym locker rooms or online spaces. Common myths suggest 'everyone is doing it to keep up'. In reality, peer pressure exploits normal performance insecurities. Making clean, informed choices requires recognizing manipulative sales tactics and relying on verified sports science.",
    situation: {
      scenario: "During off-season training, a gym teammate tells you they started using an underground oral compound to break a lifting plateau and suggests you split the bottle with them.",
      options: [
        {
          text: "Accept the offer so you don't fall behind your training partner.",
          isCorrect: false,
          feedback: "Giving in to peer pressure exposes you to liver toxicity, hormonal shutdown, and strict liability anti-doping bans."
        },
        {
          text: "Decline firmly, suggest consulting a registered sports nutritionist, and focus on recovery sleep.",
          isCorrect: true,
          feedback: "Excellent choice. Clean sport preserves long-term health, endocrine integrity, and true athletic self-worth."
        }
      ]
    },
    xpReward: 30
  },
  {
    day: 3,
    title: "Building Sustainable Recovery & Lifelong Clean Habits",
    lesson: "True athletic longevity and physical vitality are built on consistent habits rather than chemical shortcuts. Optimizing the four pillars—sleep hygiene (7-9 hrs), nutrient-dense whole foods, progressive periodized training, and open communication with certified coaches—yields 95%+ of long-term performance gains safely.",
    reflection: {
      prompt: "Which pillar of natural performance will you prioritize this week to protect your health and athletic progress?",
      options: [
        "Consistent 8 hours of sleep for natural growth hormone release",
        "Whole-food protein and micronutrient balance",
        "Verifying all medications on Global DRO before consumption",
        "Open communication with my doctor and coaches"
      ]
    },
    xpReward: 35
  }
];

export default function Journey() {
  const { addXP, logActivity } = useGamification();

  // Screen state: 'start' | 'day' | 'completed'
  const [screen, setScreen] = useState('start');
  const [selectedTopic, setSelectedTopic] = useState('General awareness');
  const [selectedReason, setSelectedReason] = useState('General awareness');
  
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [step, setStep] = useState('lesson'); // 'lesson' | 'activity' | 'feedback'
  const [userSelection, setUserSelection] = useState(null);
  const [puzzleAnswer, setPuzzleAnswer] = useState(null);
  const [earnedXPInJourney, setEarnedXPInJourney] = useState(0);

  const startJourney = () => {
    setScreen('day');
    setCurrentDayIndex(0);
    setStep('lesson');
  };

  const handleQuestionAnswer = (index) => {
    setUserSelection(index);
    const day = DAYS_DATA[currentDayIndex];
    const isCorrect = index === day.question.correctIndex;
    if (isCorrect) {
      addXP(10, `Day ${day.day} check question`);
      setEarnedXPInJourney(prev => prev + 10);
    }
  };

  const handlePuzzleAnswer = (boolVal) => {
    setPuzzleAnswer(boolVal);
    const day = DAYS_DATA[currentDayIndex];
    if (boolVal === day.miniPuzzle.isTrue) {
      addXP(15, `Day ${day.day} mini puzzle`);
      setEarnedXPInJourney(prev => prev + 15);
    }
  };

  const handleSituationAnswer = (choice) => {
    setUserSelection(choice);
    if (choice.isCorrect) {
      addXP(DAYS_DATA[currentDayIndex].xpReward, `Day 2 Scenario completed`);
      setEarnedXPInJourney(prev => prev + DAYS_DATA[currentDayIndex].xpReward);
    }
  };

  const handleReflectionAnswer = (choice) => {
    setUserSelection(choice);
    addXP(DAYS_DATA[currentDayIndex].xpReward, `Day 3 Reflection completed`);
    setEarnedXPInJourney(prev => prev + DAYS_DATA[currentDayIndex].xpReward);
    logActivity('Lesson', `journey-day-3`);
  };

  const advanceDay = () => {
    if (currentDayIndex + 1 < DAYS_DATA.length) {
      setCurrentDayIndex(prev => prev + 1);
      setStep('lesson');
      setUserSelection(null);
      setPuzzleAnswer(null);
    } else {
      setScreen('completed');
      logActivity('Lesson', `journey-complete`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          Drug Awareness & Recovery Journey
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Explore information about drug-related risks and healthier choices through short, guided activities.
        </p>
      </div>

      {/* Required Disclaimer Notice (Section 13) */}
      <div className="rounded-md border border-slate-200 bg-white p-3.5 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-900 font-semibold">Important Scope Notice: </strong>
        This journey provides educational awareness and general support. It is not a medical rehabilitation or addiction-treatment program. You will never be asked to disclose personal medical conditions or drug history.
      </div>

      {/* SCREEN 1: START CONFIGURATION */}
      {screen === 'start' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
            {/* Question 1: What would you like to learn about? */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                What would you like to learn about?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-lg border text-sm font-medium text-left transition ${
                      selectedTopic === topic
                        ? 'border-[#0f2942] bg-slate-50 text-[#0f2942] font-semibold ring-1 ring-[#0f2942]'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Why are you learning today? */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Why are you learning today?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REASONS.map((reason, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`p-3 rounded-lg border text-sm font-medium text-left transition ${
                      selectedReason === reason
                        ? 'border-[#0f2942] bg-slate-50 text-[#0f2942] font-semibold ring-1 ring-[#0f2942]'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Journey Button */}
            <div className="pt-2">
              <button
                onClick={startJourney}
                className="w-full py-3 px-6 bg-[#0f2942] hover:bg-[#183d63] text-white font-semibold text-base rounded-lg shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Start Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PERSONALIZED SUPPORT SECTION (Sections 2 & 26) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Personalized Support
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Take self-guided next steps for general nutrition, professional preparation, or verified care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/meal-planner"
                className="p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    Healthy Meal Planner
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Whole-food eating routines and daily wellness habits.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 mt-3 block">
                  Create Plan →
                </span>
              </Link>

              <Link
                to="/support-plan"
                className="p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                    My Support Plan
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Prepare for a professional conversation and set goals.
                  </p>
                </div>
                <span className="text-xs font-semibold text-indigo-700 mt-3 block">
                  Build Pathway →
                </span>
              </Link>

              <Link
                to="/professionals"
                className="p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700">
                    Find Professional Help
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Verified doctors, addiction counsellors, and support lines.
                  </p>
                </div>
                <span className="text-xs font-semibold text-teal-700 mt-3 block">
                  Browse Directory →
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: DAY-BY-DAY GUIDED EXPERIENCE */}
      {screen === 'day' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          {/* Day Header & Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Day {DAYS_DATA[currentDayIndex].day} of 3
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Topic: {selectedTopic}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              +{DAYS_DATA[currentDayIndex].xpReward} XP Available
            </div>
          </div>

          {/* Day Title */}
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {DAYS_DATA[currentDayIndex].title}
          </h2>

          {/* STEP A: Short Educational Lesson */}
          {step === 'lesson' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base leading-relaxed">
                {DAYS_DATA[currentDayIndex].lesson}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep('activity')}
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-2"
                >
                  <span>Continue to Activity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP B: Interactive Activity for current Day */}
          {step === 'activity' && (
            <div className="space-y-6">
              {/* Day 1: Simple Question & Mini Puzzle */}
              {currentDayIndex === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      {DAYS_DATA[0].question.prompt}
                    </h3>
                    <div className="space-y-2">
                      {DAYS_DATA[0].question.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuestionAnswer(i)}
                          className={`w-full p-3 text-left text-sm rounded-lg border transition ${
                            userSelection === i
                              ? i === DAYS_DATA[0].question.correctIndex
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                                : 'border-red-400 bg-red-50 text-red-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {userSelection !== null && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                        {DAYS_DATA[0].question.explanation}
                      </p>
                    )}
                  </div>

                  {userSelection !== null && (
                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        Mini Puzzle: {DAYS_DATA[0].miniPuzzle.statement}
                      </h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handlePuzzleAnswer(true)}
                          className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium ${
                            puzzleAnswer === true
                              ? 'bg-red-50 border-red-400 text-red-800'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          TRUE
                        </button>
                        <button
                          onClick={() => handlePuzzleAnswer(false)}
                          className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium ${
                            puzzleAnswer === false
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          FALSE
                        </button>
                      </div>
                      {puzzleAnswer !== null && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                          {DAYS_DATA[0].miniPuzzle.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {puzzleAnswer !== null && (
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={advanceDay}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-2"
                      >
                        <span>Complete Day 1 & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Day 2: Story Situation & Response */}
              {currentDayIndex === 1 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 text-sm leading-relaxed">
                    <strong className="block font-semibold mb-1 text-amber-900">Situation:</strong>
                    {DAYS_DATA[1].situation.scenario}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900">
                    How will you respond?
                  </h3>

                  <div className="space-y-2.5">
                    {DAYS_DATA[1].situation.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSituationAnswer(opt)}
                        className={`w-full p-3.5 text-left text-sm rounded-lg border transition ${
                          userSelection === opt
                            ? opt.isCorrect
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                              : 'border-red-400 bg-red-50 text-red-950'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {userSelection && (
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <strong>Consequence Analysis: </strong>
                      {userSelection.feedback}
                    </div>
                  )}

                  {userSelection && (
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={advanceDay}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-2"
                      >
                        <span>Complete Day 2 & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Day 3: Reflection & Habit Setting */}
              {currentDayIndex === 2 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {DAYS_DATA[2].reflection.prompt}
                  </h3>

                  <div className="space-y-2.5">
                    {DAYS_DATA[2].reflection.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleReflectionAnswer(opt)}
                        className={`w-full p-3.5 text-left text-sm rounded-lg border transition ${
                          userSelection === opt
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {userSelection && (
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={advanceDay}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition inline-flex items-center gap-2"
                      >
                        <span>Finish Journey</span>
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* SCREEN 3: JOURNEY COMPLETED */}
      {screen === 'completed' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Awareness Journey Completed!
            </h2>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              You successfully navigated the 3-day awareness curriculum for <strong>{selectedTopic}</strong>, learning the risks of unverified substances and strategies for lifelong clean sport.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-sm font-bold">
              <span>+{earnedXPInJourney} Total XP Earned</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition"
              >
                View User Dashboard
              </Link>
              <button
                onClick={() => {
                  setScreen('start');
                  setUserSelection(null);
                  setPuzzleAnswer(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Explore Another Topic
              </button>
            </div>
          </div>

          {/* CONTINUE YOUR SUPPORT (Section 26) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Continue Your Support
            </h3>
            <p className="text-xs text-slate-500">
              Transform what you learned into daily wellness habits or connect with professional care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/meal-planner"
                className="p-4 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                  Create Healthy Meal Plan
                </div>
                <p className="text-[11px] text-slate-500">
                  Generate whole-food routines based on your goals.
                </p>
              </Link>

              <Link
                to="/support-plan"
                className="p-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                  Build My Support Plan
                </div>
                <p className="text-[11px] text-slate-500">
                  Prepare for a healthcare conversation with structured notes.
                </p>
              </Link>

              <Link
                to="/professionals"
                className="p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 transition"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 mb-1">
                  Find Professional Help
                </div>
                <p className="text-[11px] text-slate-500">
                  Connect with verified doctors, addiction specialists, and counsellors.
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
