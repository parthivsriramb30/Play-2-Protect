import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle, Droplet, Heart, Sparkles, Clock, Calendar, Bookmark, Save, ExternalLink, Lock } from 'lucide-react';
import { generateMealPlan, saveMealPlan, getMyMealPlans } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const DIETARY_PREFERENCES = ["No preference", "Vegetarian", "Non-vegetarian", "Vegan"];
const ACTIVITY_LEVELS = ["Low", "Moderate", "High"];
const GOALS = [
  "General healthy eating",
  "Improve daily routine",
  "Support sports performance",
  "Improve energy",
  "Maintain a regular eating schedule"
];
const SUBSTANCE_TOPICS = [
  "General drug awareness",
  "Stimulants",
  "Steroids",
  "Cannabis",
  "Opioids",
  "Sedatives",
  "Alcohol",
  "Prescription medicine misuse",
  "Unknown substance",
  "Prefer not to say"
];

export default function MealPlanner() {
  const { addXP, logActivity, completeSupportActivity } = useGamification();

  // Form State
  const [age, setAge] = useState("20");
  const [dietaryPreference, setDietaryPreference] = useState("No preference");
  const [allergies, setAllergies] = useState("");
  const [foodsToAvoid, setFoodsToAvoid] = useState("");
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const [goal, setGoal] = useState("General healthy eating");
  const [hasMedicalCondition, setHasMedicalCondition] = useState("No");
  const [substanceTopic, setSubstanceTopic] = useState("General drug awareness");

  // Output State
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("today"); // 'today' | 'tomorrow' | '7day' | 'saved'
  const [completedMeals, setCompletedMeals] = useState({});
  const [savedPlans, setSavedPlans] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial generation
  useEffect(() => {
    handleGenerate();
    loadSavedPlans();
  }, []);

  const loadSavedPlans = () => {
    getMyMealPlans().then(res => {
      if (res && res.plans) setSavedPlans(res.plans);
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateMealPlan({
      age,
      dietaryPreference,
      allergies,
      foodsToAvoid,
      activityLevel,
      goal,
      hasMedicalCondition,
      substanceTopic
    });

    if (res && res.plan) {
      setGeneratedPlan(res.plan);
      setSaveSuccess(false);
    }
    setLoading(false);
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    const res = await saveMealPlan(generatedPlan);
    if (res && res.success) {
      setSaveSuccess(true);
      addXP(5, 'Saved healthy wellness meal plan');
      completeSupportActivity('act-mealplan-saved');
      loadSavedPlans();
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleToggleMeal = (key) => {
    const next = !completedMeals[key];
    setCompletedMeals(prev => ({ ...prev, [key]: next }));
    if (next) {
      addXP(5, 'Completed healthy balanced meal');
      completeSupportActivity(`meal-${key}`);
    }
  };

  const days = generatedPlan?.days || [];
  const todayDay = days[0] || null;
  const tomorrowDay = days[1] || null;

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
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              My Healthy Meal & Wellness Planner
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Create a general healthy eating and daily wellness plan based on your preferences and goals.
            </p>
          </div>
          <div className="self-start sm:self-auto px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
            General Nutrition
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Privacy Guarantee Note (Section 28) */}
      <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900">Privacy Notice: </strong>
          You can skip personal questions. Only provide information you are comfortable sharing. Your meal preferences and health goals are strictly private and never displayed on public leaderboards or profile pages.
        </div>
      </div>

      {/* 1. PREFERENCES CONFIGURATION FORM */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Customize Your Daily Eating Routine
          </h2>
          <p className="text-xs text-slate-500">
            Tell us about your dietary preferences and daily goals. We will generate whole-food meal suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Dietary Preference */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Dietary Preference</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            >
              {DIETARY_PREFERENCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Daily Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            >
              {ACTIVITY_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Food Allergies */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Food Allergies <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanuts, Shellfish, Dairy"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Foods to Avoid */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Foods to Avoid <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={foodsToAvoid}
              onChange={(e) => setFoodsToAvoid(e.target.value)}
              placeholder="e.g. Added Sugars, Red Meat"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Main Goal */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">Primary Nutrition Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            >
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Substance Awareness Topic (Section 4) */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Substance Awareness Topic <span className="text-slate-400 font-normal">(Optional context)</span>
            </label>
            <select
              value={substanceTopic}
              onChange={(e) => setSubstanceTopic(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
            >
              {SUBSTANCE_TOPICS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Medical Safety Question (Section 5) */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <label className="block font-semibold text-xs sm:text-sm text-slate-800">
            Do you have any medical or dietary condition that requires a specific diet?
          </label>
          <div className="flex gap-3 text-xs font-semibold">
            {["No", "Yes", "Prefer not to say"].map(val => (
              <label key={val} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="radio"
                  name="medicalCondition"
                  value={val}
                  checked={hasMedicalCondition === val}
                  onChange={(e) => setHasMedicalCondition(e.target.value)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>{val}</span>
              </label>
            ))}
          </div>

          {hasMedicalCondition === "Yes" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 leading-relaxed mt-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> For a medical condition or specialized diet, please consult a qualified doctor or registered dietitian rather than relying on an automated meal plan.
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs sm:text-sm font-semibold rounded-lg transition inline-flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{loading ? "Generating..." : "Generate Healthy Plan"}</span>
          </button>
        </div>
      </div>

      {/* Drug-Related Safety Information (Section 8) */}
      {generatedPlan?.substanceWarning && (
        <div className="p-5 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-950 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-bold block mb-0.5">{generatedPlan.substanceWarning.title}</strong>
              {generatedPlan.substanceWarning.message}
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Link
              to="/professionals"
              className="px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Find Professional Help</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Allergy Safety Notice (Section 9) */}
      {generatedPlan?.allergyNotice && (
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{generatedPlan.allergyNotice}</span>
        </div>
      )}

      {/* 2. MEAL PLAN DISPLAY WITH TABS (Section 6 & 7) */}
      {generatedPlan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Nutritional Framework
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Your Balanced Whole-Food Routine
              </h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('tomorrow')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === 'tomorrow' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setActiveTab('7day')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeTab === '7day' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7-Day Plan
              </button>
              {savedPlans.length > 0 && (
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    activeTab === 'saved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Saved ({savedPlans.length})
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: TODAY */}
          {activeTab === 'today' && todayDay && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Today's Healthy Routine
              </h3>

              <div className="space-y-3">
                {[
                  { key: 't-b', title: 'Breakfast', desc: todayDay.breakfast, time: '7:30 AM' },
                  { key: 't-m', title: 'Mid-Morning Snack', desc: todayDay.midMorning, time: '10:30 AM' },
                  { key: 't-l', title: 'Lunch', desc: todayDay.lunch, time: '1:00 PM' },
                  { key: 't-e', title: 'Evening Snack', desc: todayDay.eveningSnack, time: '4:30 PM' },
                  { key: 't-d', title: 'Dinner', desc: todayDay.dinner, time: '7:30 PM' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`p-4 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      completedMeals[item.key]
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                        <span>•</span>
                        <span className="text-slate-800 font-bold">{item.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => handleToggleMeal(item.key)}
                      className={`self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                        completedMeals[item.key]
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{completedMeals[item.key] ? "Completed (+5 XP)" : "Mark Complete"}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Hydration & Wellness Activity Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-lg border border-sky-200 bg-sky-50/50 space-y-1 text-xs">
                  <strong className="text-sky-950 font-bold flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-sky-600" />
                    Hydration Reminder
                  </strong>
                  <p className="text-sky-900 leading-relaxed">{todayDay.hydration}</p>
                </div>

                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/50 space-y-1 text-xs">
                  <strong className="text-purple-950 font-bold flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-purple-600" />
                    Daily Wellness Activity
                  </strong>
                  <p className="text-purple-900 leading-relaxed">{todayDay.wellnessActivity}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOMORROW */}
          {activeTab === 'tomorrow' && tomorrowDay && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                Tomorrow's Healthy Routine
              </h3>

              <div className="space-y-3">
                {[
                  { title: 'Breakfast', desc: tomorrowDay.breakfast },
                  { title: 'Mid-Morning Snack', desc: tomorrowDay.midMorning },
                  { title: 'Lunch', desc: tomorrowDay.lunch },
                  { title: 'Evening Snack', desc: tomorrowDay.eveningSnack },
                  { title: 'Dinner', desc: tomorrowDay.dinner },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 text-xs sm:text-sm">
                    <strong className="block text-slate-800 font-bold mb-0.5">{item.title}</strong>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-purple-200 bg-purple-50/50 space-y-1 text-xs">
                <strong className="text-purple-950 font-bold flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-purple-600" />
                  Tomorrow's Wellness Activity
                </strong>
                <p className="text-purple-900 leading-relaxed">{tomorrowDay.wellnessActivity}</p>
              </div>
            </div>
          )}

          {/* TAB 3: 7-DAY PLAN */}
          {activeTab === '7day' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Weekly Meal & Wellness Overview
              </h3>

              <div className="space-y-3">
                {days.map((d, i) => (
                  <div key={i} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 text-sm">{d.dayName}</span>
                      <span className="text-slate-500 font-medium">{d.hydration}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                      <div><strong>Breakfast:</strong> {d.breakfast.split('—')[0]}</div>
                      <div><strong>Lunch:</strong> {d.lunch.split('—')[0]}</div>
                      <div><strong>Dinner:</strong> {d.dinner.split('—')[0]}</div>
                    </div>

                    <p className="text-purple-900 text-[11px] pt-1">
                      <strong>Wellness:</strong> {d.wellnessActivity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED PLANS */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800">Your Saved Meal Plans</h3>
              {savedPlans.map(sp => (
                <div key={sp.planId} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sp.goal}</span>
                    <span className="text-slate-400">{sp.savedAt ? new Date(sp.savedAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="text-slate-600">
                    Preference: {sp.dietaryPreference} • Activity: {sp.activityLevel} • {sp.days?.length || 0} days recorded
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Save Action Footer (Section 11) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Plan saved to your profile! (+5 XP awarded)
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Plans are stored privately for your personal reference.
              </span>
            )}

            <button
              onClick={handleSavePlan}
              className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Today's Plan (+5 XP)</span>
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Bottom Disclaimer (Section 10) */}
      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-[11px] text-slate-500 leading-relaxed text-center">
        {generatedPlan?.disclaimer || "This meal planner provides general nutrition information only. It is not a medical diet, detox plan, withdrawal treatment, or substitute for advice from a doctor or registered dietitian."}
      </div>

    </div>
  );
}
