import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, ShieldCheck, Search, ArrowRight, Compass, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SportsTrackPattern from '../components/SportsTrackPattern';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const scrollToExplore = () => {
    const el = document.getElementById('explore-options');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* 1. HERO SECTION (Compact, Sports-Oriented, Human-Designed) */}
      <section className="relative bg-white border-b border-slate-200 py-12 sm:py-16 overflow-hidden">
        <SportsTrackPattern />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Subtle collegiate sports badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Sports Education & Anti-Doping Awareness
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0f2942] mb-3">
            PLAY2PROTECT
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-emerald-700 mb-4 tracking-tight">
            Learn. Play. Protect.
          </p>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
            Learn about anti-doping, drug risks and supplements through simple, interactive experiences.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-6 py-3 bg-[#0f2942] hover:bg-[#183d63] text-white text-base font-semibold rounded-lg shadow-xs transition inline-flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToExplore}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-base font-semibold rounded-lg border border-slate-300 transition"
            >
              Learn More
            </button>
          </div>

          {/* Simple Vector Track & Whistle Graphic Motif */}
          <div className="mt-10 flex justify-center items-center gap-6 opacity-60">
            <div className="h-0.5 w-16 bg-slate-300 rounded"></div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
              <span>Fair Play</span>
              <span>•</span>
              <span>Clean Sport</span>
              <span>•</span>
              <span>Informed Health</span>
            </div>
            <div className="h-0.5 w-16 bg-slate-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* 2. THE THREE MAIN OPTIONS (The visual focus of the home page) */}
      <section id="explore-options" className="py-14 sm:py-18 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              What would you like to explore?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select one of the three primary areas below to begin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1 — AI CHATBOT */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-5">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  AI Chatbot
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Have a question about doping, drugs, medicines or supplements? Ask and learn in simple language.
                </p>
              </div>

              <Link
                to="/chatbot"
                className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition inline-flex items-center justify-center gap-2"
              >
                <span>Ask Play2Protect AI</span>
                <span>→</span>
              </Link>
            </div>

            {/* CARD 2 — AWARENESS JOURNEY */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition">
              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Awareness Journey
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Learn about drug risks, healthier choices and awareness through a simple guided journey.
                </p>
                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-md p-2 mb-6">
                  *Educational awareness & support. Not medical treatment.
                </div>
              </div>

              <Link
                to="/journey"
                className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition inline-flex items-center justify-center gap-2"
              >
                <span>Start Journey</span>
                <span>→</span>
              </Link>
            </div>

            {/* CARD 3 — SUPPLEMENT CHECKER */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition">
              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center mb-5">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Supplement Checker
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Search a product or scan its label to learn about ingredients and possible anti-doping concerns.
                </p>
              </div>

              <Link
                to="/supplement-checker"
                className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] text-white text-sm font-semibold rounded-lg transition inline-flex items-center justify-center gap-2"
              >
                <span>Check Supplement</span>
                <span>→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SHORT "WHY PLAY2PROTECT?" SECTION */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
            Why Play2Protect?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Anti-doping and drug-awareness information can be difficult to understand when it is presented through long documents. Play2Protect makes important information easier to explore through conversation, guided learning and simple product checking.
          </p>
        </div>
      </section>
    </div>
  );
}
