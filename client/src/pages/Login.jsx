import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading, setUser, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemoLogin = (roleType) => {
    if (roleType === 'admin') {
      login('admin@play2protect.edu', 'admin123').then(() => navigate('/admin'));
    } else {
      login('alex.athlete@university.edu', 'athlete123').then(() => navigate('/dashboard'));
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        
        {/* Branding header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#0f2942] text-white flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Log in to Play2Protect
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your clean sport progress, badges, and learning history.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@university.edu"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-xs transition"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Logins for fast evaluation */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-center text-slate-500 font-medium mb-3">
            Quick demo evaluation shortcuts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('athlete')}
              className="py-1.5 px-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-md text-xs font-medium text-slate-700 transition"
            >
              Demo Athlete
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-md text-xs font-medium text-slate-700 transition"
            >
              Demo Admin / Faculty
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-slate-500 mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-[#0f2942] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
