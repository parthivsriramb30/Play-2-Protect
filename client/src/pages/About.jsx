import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, Target, HeartHandshake, CheckCircle } from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-xl bg-[#0f2942] text-white flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          About PLAY2PROTECT
        </h1>
        <p className="text-base text-slate-600 mt-2">
          An educational platform designed to empower students, competitive athletes, and fitness enthusiasts with objective anti-doping awareness.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Philosophy Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          Our Core Mission: Learn. Play. Protect.
        </h2>
        
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Anti-doping codes and prohibited lists span hundreds of pages of complex pharmacological nomenclature. For high school and collegiate athletes, navigating this dense terminology can feel overwhelming. Many athletes face devastating sanctions not from intentional cheating, but through unintentional contamination in dietary supplements or everyday cold tablets.
        </p>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          <strong>Play2Protect</strong> was developed as a clean, human-designed sports education project to bridge this gap. By transforming complex guidelines into conversational AI answers, interactive ethical scenarios, practical OCR label checking, and bite-sized puzzles, we help athletes protect their competitive dreams and long-term biological health.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            1. Learn
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Understand the Strict Liability principle, WADA prohibited categories, and Therapeutic Use Exemptions (TUEs) through straightforward modules.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            2. Play
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Apply critical judgment in branching real-world dilemma stories, terminology matching puzzles, and rapid myth-busting challenges.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            3. Protect
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Verify supplement ingredients using our database search and OCR label scanner to avoid adulterated products and preserve clean integrity.
          </p>
        </div>
      </div>

      {/* College Project Badge Footer */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <span>Explore The Platform</span>
          <span>→</span>
        </Link>
      </div>

    </div>
  );
}
