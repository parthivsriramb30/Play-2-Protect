import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0f2942] flex items-center justify-center text-white">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-sm">
            PLAY2PROTECT
          </span>
          <span className="text-slate-400 text-xs">•</span>
          <span className="text-slate-500 text-xs font-medium">
            Learn • Play • Protect
          </span>
        </div>

        {/* Center / Secondary Links */}
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <Link to="/about" className="hover:text-slate-800 transition">About Initiative</Link>
          <Link to="/features" className="hover:text-slate-800 transition">All Features</Link>
          <Link to="/admin" className="hover:text-slate-800 transition">Faculty / Admin</Link>
        </div>

        {/* Right copyright notice */}
        <p className="text-xs text-slate-400 text-center sm:text-right">
          Anti-Doping Awareness Education
        </p>
      </div>
    </footer>
  );
}
