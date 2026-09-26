import React from 'react';
import { Award, ShieldCheck, CheckCircle, Flame, Gift, Puzzle, Zap, X } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const ICON_MAP = {
  Award,
  ShieldCheck,
  CheckCircle,
  Flame,
  Gift,
  Puzzle,
  Zap
};

export default function BadgeModal() {
  const { newBadge, clearBadgeModal } = useGamification();

  if (!newBadge) return null;

  const IconComponent = ICON_MAP[newBadge.icon] || Award;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-150 relative">
        <button 
          onClick={clearBadgeModal}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 mb-4">
          <IconComponent className="w-8 h-8" />
        </div>

        <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
          New Badge Unlocked!
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {newBadge.name}
        </h3>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {newBadge.description}
        </p>

        <button
          onClick={clearBadgeModal}
          className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-medium rounded-lg transition"
        >
          Collect & Continue
        </button>
      </div>
    </div>
  );
}
