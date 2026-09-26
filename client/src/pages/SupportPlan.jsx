import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle, Calendar, Plus, Users, Clock, Lock, FileText, PhoneCall, CheckSquare } from 'lucide-react';
import { getMySupportPlan, saveSupportPlan, getSupportGoals, addSupportGoal, toggleSupportGoal } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const CHANGE_GOALS = [
  "Learn more",
  "Reduce my use",
  "Stop using",
  "I'm unsure",
  "Help someone I know"
];

const PREPARATION_POINTS = [
  { id: 'prep-sub', label: "What substance(s) are involved", tip: "Be honest about brand names, supplements, or street substances." },
  { id: 'prep-dur', label: "How long you have been using it", tip: "Whether it has been weeks, months, or years." },
  { id: 'prep-freq', label: "How often you use it", tip: "Daily, on weekends, or during high-pressure competitions." },
  { id: 'prep-other', label: "Other medicines or supplements you take", tip: "Over-the-counter pills, prescriptions, or vitamins." },
  { id: 'prep-prev', label: "Previous attempts to reduce or pause", tip: "What worked, what was challenging, or when urges flared." },
  { id: 'prep-symp', label: "Symptoms you have experienced", tip: "Heart palpitations, anxiety, insomnia, tremors, or fatigue." },
  { id: 'prep-health', label: "Relevant physical or mental health history", tip: "Asthma, heart history, depression, or sports injury recovery." }
];

const DEFAULT_DAILY_CHECKLIST = [
  { id: 'c-meal', text: "Eat regular, balanced meals" },
  { id: 'c-water', text: "Drink water consistently (maintain pale straw hydration)" },
  { id: 'c-sleep', text: "Follow a healthy sleep routine (7 to 9 hours)" },
  { id: 'c-activity', text: "Complete one Play2Protect awareness activity" },
  { id: 'c-support', text: "Spend time with a supportive, trusted person" },
  { id: 'c-distract', text: "Complete a short 2-minute distraction or breathing drill" },
  { id: 'c-goal', text: "Review my personal support goals" },
  { id: 'c-prof', text: "Attend or contact my professional healthcare support if scheduled" }
];

export default function SupportPlan() {
  const { addXP, logActivity, completeSupportActivity } = useGamification();

  // Active Journey Step: 1 -> 2 -> 3 -> 4 -> 5
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("Learn more");

  // Step 2: Preparation notes (optional)
  const [checkedPrep, setCheckedPrep] = useState({});

  // Step 4: Professional Appointment Record
  const [professionalName, setProfessionalName] = useState("Dr. Rajesh K. Sharma (MD Psychiatry)");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [questions, setQuestions] = useState([
    "What are safe ways to manage sleep disturbances without unverified pills?",
    "How does previous substance use impact athletic recovery and heart rate?",
    "What non-prohibited medical treatments are safe for competitive sports?"
  ]);
  const [newQuestion, setNewQuestion] = useState("");

  // Step 5 & Goals: Non-medical goals
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [taperAlert, setTaperAlert] = useState(null);

  // Daily Checklist state
  const [checkedChecklist, setCheckedChecklist] = useState({});
  const [saveFeedback, setSaveFeedback] = useState(false);

  useEffect(() => {
    loadGoals();
    getMySupportPlan().then(res => {
      if (res && res.plan) {
        if (res.plan.changeGoal) setSelectedGoal(res.plan.changeGoal);
        if (res.plan.professionalName) setProfessionalName(res.plan.professionalName);
        if (res.plan.appointmentDate) setAppointmentDate(res.plan.appointmentDate);
        if (res.plan.questions?.length) setQuestions(res.plan.questions);
      }
    });
  }, []);

  const loadGoals = () => {
    getSupportGoals().then(res => {
      if (res && res.goals) setGoals(res.goals);
    });
  };

  // Dosage / Tapering string interceptor
  const checkDosageAttempt = (text) => {
    const lower = (text || '').toLowerCase();
    const dosagePatterns = [
      /\b\d+\s*(mg|mcg|ml|g|milligram|grams|pills|tablets|drops)\b/i,
      /\breduce\s+(from\s+)?\d+.*to\s+\d+/i,
      /\b(taper|tapering|detox schedule|wean off|dose reduction)\b/i,
      /\b\d+\s*%/i,
      /\bday\s*\d+.*reduce/i
    ];
    return dosagePatterns.some(p => p.test(lower));
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    if (checkDosageAttempt(newGoalTitle)) {
      setTaperAlert("I can't create a medication or substance tapering schedule. The safest plan depends on the substance and your individual health. Please discuss this with a qualified healthcare professional.");
      return;
    }

    setTaperAlert(null);
    const res = await addSupportGoal(newGoalTitle.trim());
    if (res && res.success) {
      setNewGoalTitle("");
      addXP(5, 'Added personal non-medical goal');
      completeSupportActivity('goal-added');
      loadGoals();
    } else if (res && res.isTaperAttempt) {
      setTaperAlert(res.message);
    }
  };

  const handleToggleGoal = async (goalId) => {
    const res = await toggleSupportGoal(goalId);
    if (res && res.success) {
      if (res.goal.completed) {
        addXP(5, 'Completed personal support goal');
        completeSupportActivity(`goal-${goalId}`);
      }
      loadGoals();
    }
  };

  const handleToggleChecklist = (id) => {
    const next = !checkedChecklist[id];
    setCheckedChecklist(prev => ({ ...prev, [id]: next }));
    if (next) {
      addXP(5, 'Checked daily support routine item');
      completeSupportActivity(`check-${id}`);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    if (checkDosageAttempt(newQuestion)) {
      setTaperAlert("Please discuss specific dosage adjustments directly with your doctor. Write questions about how to consult safely.");
      return;
    }
    setTaperAlert(null);
    setQuestions(prev => [...prev, newQuestion.trim()]);
    setNewQuestion("");
  };

  const handleSaveSupportPlan = async () => {
    const res = await saveSupportPlan({
      changeGoal: selectedGoal,
      professionalName,
      appointmentDate,
      questions,
      personalGoals: goals.map(g => g.title),
      wellnessActivities: Object.keys(checkedChecklist).filter(k => checkedChecklist[k])
    });

    if (res && res.success) {
      setSaveFeedback(true);
      addXP(10, 'Saved professional-supervised support plan');
      completeSupportActivity('support-plan-saved');
      setTimeout(() => setSaveFeedback(false), 4000);
    } else if (res && res.isTaperAttempt) {
      setTaperAlert(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/journey"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Awareness Journey</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              My Step-by-Step Support Plan
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Build a personal support pathway for making healthier changes with professional guidance.
            </p>
          </div>
          <div className="self-start sm:self-auto px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
            Professional Pathway
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Emergency High-Risk Intercept Notice (Section 19) */}
      <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 text-xs sm:text-sm space-y-2">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-red-950 block">Please Seek Urgent Medical Help if in Immediate Danger:</strong>
            If you or someone around you is experiencing severe withdrawal symptoms, chest pain, seizure, difficulty breathing, severe confusion, or thoughts of self-harm, please contact emergency medical services (112 / 911 / 999) or visit the nearest emergency department immediately.
          </div>
        </div>
      </div>

      {/* "You Don't Have To Do This Alone" Banner (Section 14) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          You Don't Have To Do This Alone
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Reducing or stopping some substances can cause withdrawal symptoms, and the risks vary depending on the substance, amount, duration of use, and a person's individual health. A qualified healthcare professional can help create a safe, individualized plan.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <Link
            to="/professionals"
            className="px-3.5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>Find a Doctor</span>
            <span>→</span>
          </Link>
          <Link
            to="/professionals"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
          >
            <span>Find a Counsellor</span>
            <span>→</span>
          </Link>
          <Link
            to="/professionals"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
          >
            <span>Find Support Services</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Dosage Tapering Intercept Warning (Section 18) */}
      {taperAlert && (
        <div className="p-5 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-950 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-bold block mb-1">Medical Safety Intercept:</strong>
              {taperAlert}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Link
              to="/professionals"
              className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition"
            >
              Find Professional Help
            </Link>
            <button
              onClick={() => {
                setTaperAlert(null);
                setCurrentStep(4);
              }}
              className="px-4 py-1.5 border border-amber-400 bg-white text-amber-900 text-xs font-semibold rounded-lg hover:bg-amber-50 transition"
            >
              Prepare Questions for My Appointment
            </button>
          </div>
        </div>
      )}

      {/* 5-STEP SUPPORT JOURNEY (Section 15) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Step Progress Bar */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Support Pathway Progress</span>
            <span>Step {currentStep} of 5</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`h-2 rounded-full transition ${
                  s <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-2">
            <span className={currentStep === 1 ? 'text-indigo-700 font-bold' : ''}>1. Recognize</span>
            <span className={currentStep === 2 ? 'text-indigo-700 font-bold' : ''}>2. Prepare</span>
            <span className={currentStep === 3 ? 'text-indigo-700 font-bold' : ''}>3. Connect</span>
            <span className={currentStep === 4 ? 'text-indigo-700 font-bold' : ''}>4. Plan</span>
            <span className={currentStep === 5 ? 'text-indigo-700 font-bold' : ''}>5. Routine</span>
          </div>
        </div>

        {/* STEP 1: RECOGNIZE */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Step 1: Self-Reflection
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                What change would you like to make?
              </h2>
              <p className="text-xs text-slate-500">
                There is no judgment here. Identifying your perspective is the first step toward positive health.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {CHANGE_GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGoal(g)}
                  className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm font-semibold transition ${
                    selectedGoal === g
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREPARE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Step 2: Preparation
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Prepare for a Professional Conversation
              </h2>
              <p className="text-xs text-slate-500">
                Doctors and counsellors need objective context to help you safely. Check off topics you are willing to discuss:
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {PREPARATION_POINTS.map((pt) => (
                <label
                  key={pt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${
                    checkedPrep[pt.id]
                      ? 'border-indigo-400 bg-indigo-50/40 text-indigo-950 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checkedPrep[pt.id])}
                    onChange={() => setCheckedPrep(prev => ({ ...prev, [pt.id]: !prev[pt.id] }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="font-semibold block text-slate-900">{pt.label}</span>
                    <span className="text-xs text-slate-500">{pt.tip}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECT */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Step 3: Professional Directory
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Choose Qualified Professional Support
              </h2>
              <p className="text-xs text-slate-500">
                Select the type of qualified healthcare expert or support service best suited for your goals:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { role: "Doctor", desc: "For clinical assessment, heart health, and safe physiological evaluation." },
                { role: "Addiction Specialist", desc: "Physicians specializing in confidential dependency and cessation care." },
                { role: "Counsellor", desc: "For impulse coping strategies, trigger management, and emotional support." },
                { role: "Mental Health Professional", desc: "For athletic performance anxiety, depression, and stress resilience." },
                { role: "Support Organization", desc: "24/7 non-profit youth helplines and peer listening resources." },
              ].map((item) => (
                <Link
                  key={item.role}
                  to="/professionals"
                  className="p-4 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 transition flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                      {item.role}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 mt-3 block">
                    Browse Verified {item.role}s →
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CREATE PROFESSIONAL-SUPERVISED PLAN */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Step 4: Appointment Notes
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Create Your Professional-Supervised Plan
              </h2>
              <p className="text-xs text-slate-500">
                Your reduction or stopping plan should be created with your healthcare professional. Record details and questions here:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Professional Name</label>
                <input
                  type="text"
                  value={professionalName}
                  onChange={(e) => setProfessionalName(e.target.value)}
                  placeholder="e.g. Dr. Priya Nair"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Questions to Ask Doctor */}
            <div className="space-y-2 pt-2">
              <label className="block font-semibold text-xs sm:text-sm text-slate-800">
                Questions I Want To Ask My Healthcare Professional:
              </label>

              <div className="space-y-1.5">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                    <span>{q}</span>
                    <button
                      onClick={() => setQuestions(prev => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-600 text-xs font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add a question to discuss with your clinician..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                >
                  Add Question
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
              >
                <span>Continue to Step 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: HEALTHY DAILY ROUTINE & GOALS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Step 5: Daily Routine
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Supportive Non-Medical Routines
              </h2>
              <p className="text-xs text-slate-500">
                While preparing for your appointment, focus on regular daily anchors that support your nervous system naturally:
              </p>
            </div>

            {/* Daily Support Checklist (Section 16) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Today's Support Checklist (+5 XP per item)
              </h3>

              <div className="space-y-2">
                {DEFAULT_DAILY_CHECKLIST.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${
                      checkedChecklist[item.id]
                        ? 'border-emerald-400 bg-emerald-50/50 text-emerald-950 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(checkedChecklist[item.id])}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Non-Medical Personal Goals (Section 17) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Personal Non-Medical Goals
              </h3>

              <div className="space-y-2">
                {goals.map((g) => (
                  <div
                    key={g.goalId}
                    onClick={() => handleToggleGoal(g.goalId)}
                    className={`p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${
                      g.completed
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 line-through'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className={`w-4 h-4 ${g.completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{g.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      {g.completed ? "Done" : "Tap to complete"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Goal Form with Dosage Validation */}
              <form onSubmit={handleAddGoal} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Speak to a doctor, Improve my sleep routine..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  Add Goal
                </button>
              </form>
            </div>

            {/* Save Entire Plan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              {saveFeedback ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Support plan saved! (+10 XP awarded)
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Plans are stored privately for your personal reference.
                </span>
              )}

              <button
                onClick={handleSaveSupportPlan}
                className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Save Support Plan (+10 XP)</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Safety Summary Banner (Section 32) */}
      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-600 leading-relaxed text-center">
        <strong>Play2Protect Support Scope: </strong>
        Play2Protect can support learning, healthy routines, and connection to professional help. It cannot safely replace individualized medical care. For substance reduction: <strong>Professional assessment → Individualized plan → Ongoing support</strong>.
      </div>

    </div>
  );
}
