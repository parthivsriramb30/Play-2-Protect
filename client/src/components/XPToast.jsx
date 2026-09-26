import React, { useEffect } from 'react';
import { Award, Zap, X } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

export default function XPToast() {
  const { toast, clearToast } = useGamification();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const isLevelUp = toast.type === 'level-up';

  return (
    <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border max-w-sm ${
        isLevelUp 
          ? 'bg-[#0f2942] text-white border-sky-500' 
          : 'bg-white text-slate-800 border-slate-200'
      }`}>
        <div className={`p-2 rounded-md ${
          isLevelUp ? 'bg-sky-500/20 text-sky-300' : 'bg-green-100 text-green-700'
        }`}>
          {isLevelUp ? <Zap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-sm font-semibold leading-tight">
            {toast.title}
          </p>
          <p className={`text-xs mt-0.5 truncate ${
            isLevelUp ? 'text-slate-300' : 'text-slate-500'
          }`}>
            {toast.message}
          </p>
        </div>
        <button 
          onClick={clearToast}
          className={`p-1 rounded transition hover:bg-black/10 ${
            isLevelUp ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
