import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Puzzle, MessageCircle, Search, Flame, Award, CheckCircle2, ArrowRight, Utensils, HeartHandshake, PhoneCall, Video, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { state, levelInfo, completeDailyChallenge } = useGamification();
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate('/myth-fact');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. WELCOME GREETING & PROGRESS SUMMARY */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.fullName || 'Athlete'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Role: <span className="font-semibold text-slate-700">{user?.userType || 'Student'}</span> • Clean Sport Track Active
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Level</span>
              <span className="text-base font-bold text-[#0f2942]">Level {levelInfo.level}</span>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total XP</span>
              <span className="text-base font-bold text-emerald-700">{state.xp} XP</span>
            </div>

            <div className="px-3.5 py-2 rounded-lg bg-orange-50 border border-orange-200 text-center">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-500" /> Streak
              </span>
              <span className="text-base font-bold text-orange-700">{state.streak} Days</span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>{levelInfo.title}</span>
            <span>
              {levelInfo.nextXP ? `${state.xp} / ${levelInfo.nextXP} XP to Level ${levelInfo.level + 1}` : 'Max Level Master'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, levelInfo.progress))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. MY SUPPORT */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          My Support
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          
          <Link
            to="/meal-planner"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Meal Planner
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Healthy eating routines</p>
            </div>
          </Link>

          <Link
            to="/support-plan"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                My Support Plan
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Professional pathway</p>
            </div>
          </Link>

          <Link
            to="/professionals"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                Find Professional Help
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Doctors & counsellors</p>
            </div>
          </Link>

          <Link
            to="/videos"
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                Expert Videos
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Medical awareness</p>
            </div>
          </Link>

          <Link
            to="/support-now"
            className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 hover:border-orange-300 hover:shadow-xs transition flex flex-col justify-between group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center mb-2.5">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-orange-950 group-hover:text-orange-700 transition">
                Need Something To Do?
              </h3>
              <p className="text-[10px] text-orange-700/80 mt-0.5">Urge & craving pause</p>
            </div>
          </Link>

        </div>
      </div>

      {/* 3. MAIN ACTIONS (Clean, focused 5-card layout) */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          Quick Learning Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <Link
            to="/journey"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Continue Learning
                </h3>
                <span className="text-xs text-slate-500">Awareness Journey</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Step through guided drug-risk lessons and habit pillars.
            </p>
          </Link>

          <Link
            to="/stories"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">
                  Start Story
                </h3>
                <span className="text-xs text-slate-500">Decision Scenarios</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Make choices in real competition and gym dilemmas (+50 XP).
            </p>
          </Link>

          <Link
            to="/puzzles"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Solve Puzzle
                </h3>
                <span className="text-xs text-slate-500">Interactive Center</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Match terms, unscramble substances, and spot risky products.
            </p>
          </Link>

          <Link
            to="/chatbot"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                  Ask AI
                </h3>
                <span className="text-xs text-slate-500">Play2Protect Bot</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Get immediate, clear answers on WADA rules and exemptions.
            </p>
          </Link>

          <Link
            to="/supplement-checker"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between group sm:col-span-2 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                  Check Supplement
                </h3>
                <span className="text-xs text-slate-500">Search & OCR Label Scanner</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Search medications or scan label photos to check anti-doping status and risk warnings.
            </p>
          </Link>

        </div>
      </div>

      {/* 4. TODAY'S CHALLENGE CARD */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
              Daily Mission
            </span>
            <span className="text-xs font-bold text-emerald-700">+20 XP</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Today's Challenge
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Test your anti-doping knowledge with a quick Myth vs. Fact challenge.
          </p>
        </div>

        <div>
          {state.dailyChallengeCompleted ? (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Challenge Completed Today</span>
            </div>
          ) : (
            <button
              onClick={handleStartChallenge}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
