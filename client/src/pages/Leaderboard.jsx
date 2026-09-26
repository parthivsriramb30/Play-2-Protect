import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Shield, Award, Flame } from 'lucide-react';
import { getLeaderboard } from '../services/api';
import { useGamification } from '../context/GamificationContext';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useGamification();

  useEffect(() => {
    getLeaderboard().then(res => {
      if (res && res.leaderboard) {
        setLeaderboard(res.leaderboard);
      }
      setLoading(false);
    });
  }, []);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              Weekly Clean Sport Leaderboard
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Recognizing dedicated student athletes and enthusiasts pursuing certified anti-doping literacy.
            </p>
          </div>
          <div className="self-start sm:self-auto text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md font-medium">
            Reset: Every Monday 00:00 UTC
          </div>
        </div>
      </div>

      {/* Privacy Notice (Section 26) */}
      <div className="mb-6 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-500 leading-relaxed">
        <strong>Privacy Commitment: </strong>
        Only public gamification metrics (Display Name, XP, Level, and Badges) are visible. Personal health information, drug awareness inquiries, and AI chatbot conversations are strictly private and never shared.
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading rankings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">Athlete / Student</th>
                  <th className="py-3.5 px-4 text-center">Level</th>
                  <th className="py-3.5 px-4">Featured Badge</th>
                  <th className="py-3.5 px-4 text-center">Streak</th>
                  <th className="py-3.5 px-4 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((row) => {
                  const isTop3 = row.rank <= 3;
                  return (
                    <tr
                      key={row.rank}
                      className={`hover:bg-slate-50/60 transition ${
                        isTop3 ? 'bg-slate-50/20' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 text-center font-bold">
                        {row.rank === 1 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">🥇 1</span>}
                        {row.rank === 2 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">🥈 2</span>}
                        {row.rank === 3 && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">🥉 3</span>}
                        {row.rank > 3 && <span className="text-slate-500">{row.rank}</span>}
                      </td>

                      {/* Display Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {row.displayName}
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                          Lv.{row.level}
                        </span>
                      </td>

                      {/* Badge */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{row.badge}</span>
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-orange-700">
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          <span>{row.streak}d</span>
                        </span>
                      </td>

                      {/* XP */}
                      <td className="py-3.5 px-4 text-right font-bold text-[#0f2942]">
                        {row.xp} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
