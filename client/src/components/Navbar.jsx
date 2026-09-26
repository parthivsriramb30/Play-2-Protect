import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, LogOut, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, levelInfo } = useGamification();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#0f2942] flex items-center justify-center text-white shadow-xs group-hover:bg-[#183d63] transition">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-[#0f2942] leading-none">
              PLAY2PROTECT
            </span>
            <span className="text-[11px] font-medium text-slate-600 tracking-wide mt-0.5">
              Learn. Play. Protect.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to={user ? "/dashboard" : "/"}
            className={`text-sm font-medium transition ${
              (user ? isActive('/dashboard') : isActive('/')) ? 'text-[#0f2942] font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </Link>

          <Link
            to="/features"
            className={`text-sm font-medium transition ${
              isActive('/features') ? 'text-[#0f2942] font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Features
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition ${
                  isActive('/dashboard') ? 'text-[#0f2942] font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/progress"
                className={`text-sm font-medium transition ${
                  isActive('/progress') ? 'text-[#0f2942] font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Progress
              </Link>
              <Link
                to="/leaderboard"
                className={`text-sm font-medium transition ${
                  isActive('/leaderboard') ? 'text-[#0f2942] font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Leaderboard
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Auth / User State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Quick XP & Level Pill */}
              <Link 
                to="/progress" 
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition"
                title={`Level ${levelInfo.level} - ${state.xp} XP`}
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lv.{levelInfo.level}</span>
                <span className="text-slate-400">|</span>
                <span>{state.xp} XP</span>
              </Link>

              {/* User Greeting & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="text-xs text-slate-600 font-medium max-w-[120px] truncate">
                  {user.fullName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-red-50 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-[#0f2942] hover:bg-[#183d63] px-4 py-1.5 rounded-md shadow-xs transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
              {state.xp} XP
            </span>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-md focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to={user ? "/dashboard" : "/"}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/features"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/journey"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Awareness Journey
                </Link>
                <Link
                  to="/supplement-checker"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Supplement Checker
                </Link>
                <Link
                  to="/chatbot"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  AI Chatbot
                </Link>
                <Link
                  to="/progress"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Progress & Badges
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Leaderboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Log Out ({user.fullName})
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-[#0f2942] rounded-md"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
