import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, Search, Compass, Puzzle, Trophy, Award, Gift, Zap, ArrowRight } from 'lucide-react';

export default function Features() {
  const FEATURE_LIST = [
    {
      icon: MessageCircle,
      title: "Play2Protect Educational AI Chatbot",
      desc: "Prompt-guided conversational assistant powered by Gemini API with anti-doping guardrails, answering questions on TUEs, steroids, supplements, and prohibited lists.",
      link: "/chatbot",
      color: "bg-sky-50 text-sky-700"
    },
    {
      icon: ShieldCheck,
      title: "Awareness & Recovery Support Journey",
      desc: "A 3-day guided educational journey helping athletes navigate substance risks, locker-room pressures, and lifelong habit foundations.",
      link: "/journey",
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: Search,
      title: "Supplement & Medicine Checker with OCR",
      desc: "Multi-field database search plus optical character recognition (Tesseract.js) to detect ingredients directly from photographed labels.",
      link: "/supplement-checker",
      color: "bg-amber-50 text-amber-700"
    },
    {
      icon: Compass,
      title: "Branching Decision Story Games",
      desc: "Interactive dilemmas exploring the eve before competition, underground pre-workouts, social media hype, and doping control procedures.",
      link: "/stories",
      color: "bg-indigo-50 text-indigo-700"
    },
    {
      icon: Puzzle,
      title: "Anti-Doping Puzzle Center",
      desc: "Vocabulary matching, letter scrambles, true/false drills, and risky formulation spotters designed for sports literacy.",
      link: "/puzzles",
      color: "bg-teal-50 text-teal-700"
    },
    {
      icon: Zap,
      title: "Myth vs. Fact & 30-Second Recall",
      desc: "Rapid true/false debunking questions and retention drills to test reflex memory under time constraints.",
      link: "/myth-fact",
      color: "bg-orange-50 text-orange-700"
    },
    {
      icon: Trophy,
      title: "Privacy-Safe Clean Sport Leaderboard",
      desc: "Weekly rankings displaying display names, XP, levels, and badges with zero disclosure of private health or chat data.",
      link: "/leaderboard",
      color: "bg-yellow-50 text-yellow-700"
    },
    {
      icon: Gift,
      title: "Demo Partner Reward Vouchers",
      desc: "Claimable mock discount codes for certified third-party tested sports nutrition, earned via active study.",
      link: "/rewards",
      color: "bg-purple-50 text-purple-700"
    },
    {
      icon: Award,
      title: "Downloadable PDF Awareness Certificate",
      desc: "Collegiate-grade completion certificate with individualized verification codes generated in-browser using jsPDF.",
      link: "/certificate",
      color: "bg-rose-50 text-rose-700"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Platform Features Overview
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Explore all nine interactive learning and safety modules built into Play2Protect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURE_LIST.map((feat, i) => {
          const IconComponent = feat.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition"
            >
              <div>
                <div className={`w-11 h-11 rounded-lg ${feat.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                <Link
                  to={feat.link}
                  className="text-xs font-semibold text-[#0f2942] hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
