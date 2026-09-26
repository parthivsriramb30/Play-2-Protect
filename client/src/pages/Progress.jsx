import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Flame, BookOpen, Compass, Puzzle, CheckCircle, ArrowLeft, Gift, ShieldCheck, Video, HeartHandshake, Heart, Shield } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';

export default function Progress() {
  const { state, levelInfo } = useGamification();
  const { user } = useAuth();

  // 14 Badges Catalog
  const BADGES_LIST = [
    { id: 'badge-01', name: 'First Step', desc: 'Completed your first lesson' },
    { id: 'badge-02', name: 'Knowledge Starter', desc: 'Completed 3 full modules' },
    { id: 'badge-03', name: 'Quiz Master', desc: 'Aced an anti-doping quiz' },
    { id: 'badge-04', name: 'Story Explorer', desc: 'Completed 3 decision missions' },
    { id: 'badge-05', name: 'Puzzle Solver', desc: 'Solved 5 anti-doping puzzles' },
    { id: 'badge-06', name: 'Consistent Learner', desc: '7-day active streak' },
    { id: 'badge-07', name: 'Clean Sport Champion', desc: 'Completed core curriculum' },
    { id: 'badge-08', name: 'Reward Hunter', desc: 'Claimed your first reward' },
    { id: 'badge-09', name: 'Label Inspector', desc: 'Scanned or searched supplement' },
    { id: 'badge-10', name: 'Fast Thinker', desc: 'Completed 30s quick recall' },
    { id: 'badge-11', name: 'Awareness Explorer', desc: 'Watched 5 verified videos' },
    { id: 'badge-12', name: 'Support Seeker', desc: 'Explored healthcare directory' },
    { id: 'badge-13', name: 'Healthy Choices', desc: 'Completed 5 wellness routines' },
    { id: 'badge-14', name: 'Knowledge in Action', desc: 'Clean sport habits in practice' }
  ];

  const totalLessons = 5;
  const totalStories = 5;
  const totalPuzzles = 10;
  const totalQuizzes = 20;

  const lessonsPercent = Math.round((state.completedLessons.length / totalLessons) * 100);
  const storiesPercent = Math.round((state.completedStories.length / totalStories) * 100);
  const puzzlesPercent = Math.round((state.completedPuzzles.length / totalPuzzles) * 100);
  const quizzesPercent = Math.round((state.completedQuizzes.length / totalQuizzes) * 100);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              Your Learning Progress
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Personal completion status across educational modules, quizzes, and streak records.
            </p>
          </div>

          <Link
            to="/certificate"
            className="self-start sm:self-auto px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Generate Certificate</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Total XP</span>
          <span className="text-2xl font-bold text-[#0f2942] mt-1 block">{state.xp}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Level {levelInfo.level} ({levelInfo.title})</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" /> Active Streak
          </span>
          <span className="text-2xl font-bold text-orange-600 mt-1 block">{state.streak} Days</span>
          <span className="text-[11px] text-slate-500">Meaningful daily learning</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-indigo-500" /> Reward Points
          </span>
          <span className="text-2xl font-bold text-indigo-700 mt-1 block">{state.rewardPoints} Pts</span>
          <Link to="/rewards" className="text-[11px] text-indigo-600 hover:underline font-medium">
            Redeem partner offers →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Badges Unlocked</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {state.unlockedBadges.length} / {BADGES_LIST.length}
          </span>
          <span className="text-[11px] text-slate-500">Achievement trophies</span>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Curriculum Completion
        </h2>

        {/* 1. Learning Modules */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Learning Modules
            </span>
            <span>{state.completedLessons.length} / {totalLessons} completed ({lessonsPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${lessonsPercent}%` }}></div>
          </div>
        </div>

        {/* 2. Story Missions */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Story Missions
            </span>
            <span>{state.completedStories.length} / {totalStories} completed ({storiesPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${storiesPercent}%` }}></div>
          </div>
        </div>

        {/* 3. Puzzles */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Puzzle className="w-3.5 h-3.5 text-amber-600" />
              Puzzles
            </span>
            <span>{state.completedPuzzles.length} / {totalPuzzles} solved ({puzzlesPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${puzzlesPercent}%` }}></div>
          </div>
        </div>

        {/* 4. Quizzes */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
              Quizzes
            </span>
            <span>{state.completedQuizzes.length} / {totalQuizzes} completed ({quizzesPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-600 rounded-full transition-all" style={{ width: `${quizzesPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Achievement Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {BADGES_LIST.map((b) => {
            const isUnlocked = state.unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-between ${
                  isUnlocked
                    ? 'border-emerald-300 bg-emerald-50/50 text-slate-900'
                    : 'border-slate-200 bg-slate-50/60 opacity-50 text-slate-400'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
                  isUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-bold text-[11px] leading-tight">{b.name}</div>
                <div className="text-[9px] leading-tight text-slate-500 mt-1">{b.desc}</div>
                <div className="text-[8px] uppercase font-bold tracking-wider mt-2">
                  {isUnlocked ? '✓ Unlocked' : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
