import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const USER_TYPES = [
  "Student",
  "Athlete",
  "Coach",
  "Gym User",
  "Sports Enthusiast",
  "General User"
];

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [userType, setUserType] = useState('Athlete');
  const [error, setError] = useState('');
  const { register, loading, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const res = await register({
      fullName,
      email,
      password,
      age: parseInt(age, 10) || 21,
      userType
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed.');
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
            Create an Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join the Play2Protect clean sport and anti-doping education community.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jordan Smith"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@domain.com"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age
              </label>
              <input
                type="number"
                min="13"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="21"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              User Type *
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:border-sky-500 transition"
            >
              {USER_TYPES.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0f2942] hover:bg-[#183d63] disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-xs transition mt-2"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#0f2942] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
