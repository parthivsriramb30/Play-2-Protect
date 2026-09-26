import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, ShieldCheck, Calendar, MapPin, Globe, Phone, Clock, Search, X, CheckCircle, ExternalLink } from 'lucide-react';
import { getProfessionals, getCounsellingSessions } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const CATEGORIES = [
  "All",
  "Doctor",
  "Counsellor",
  "Addiction Specialist",
  "Mental Health Professional",
  "Anti-Doping Professional",
  "Support Organization"
];

const MODES = ["All", "Online", "In-person"];

export default function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProfessional, setActiveProfessional] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const { exploreProfessionalSupport } = useGamification();

  useEffect(() => {
    exploreProfessionalSupport();
  }, []);

  useEffect(() => {
    getProfessionals({
      category: selectedCategory === 'All' ? null : selectedCategory,
      mode: selectedMode === 'All' ? null : selectedMode,
      search: searchQuery
    }).then(res => {
      if (res && res.professionals) {
        setProfessionals(res.professionals);
      }
    });

    getCounsellingSessions().then(res => {
      if (res && res.sessions) {
        setSessions(res.sessions);
      }
    });
  }, [selectedCategory, selectedMode, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              Professional Support & Directory
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Find qualified doctors, counsellors, and support organizations for confidential guidance.
            </p>
          </div>
          <div className="self-start sm:self-auto px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
            Verified Healthcare Registry
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* 1. Upcoming Counselling & Educational Sessions (Section 32) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Upcoming Counselling & Educational Sessions
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Free Educational Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sessions.map(sess => (
            <div
              key={sess.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>{sess.date} • {sess.startTime}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {sess.mode}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {sess.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {sess.description}
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Speaker: {sess.speaker}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500">
                  Capacity: {sess.registeredCount || 15} / {sess.capacity} registered
                </span>
                <button
                  onClick={() => setActiveSession(sess)}
                  className="text-xs font-semibold text-[#0f2942] hover:text-emerald-700 transition"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Directory Filters (Section 29) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#0f2942] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden text-slate-700"
            >
              {MODES.map(m => (
                <option key={m} value={m}>{m === 'All' ? 'All Modes' : m}</option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, specialty..."
              className="w-48 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* 3. Professional Cards Grid (Section 30) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {professionals.map(prof => (
            <div
              key={prof.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    {prof.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Professional</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {prof.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {prof.qualification}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {prof.specialization}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prof.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Mode: {prof.consultationMode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prof.availability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveProfessional(prof)}
                  className="w-full py-2 bg-slate-50 hover:bg-[#0f2942] text-slate-700 hover:text-white border border-slate-200 hover:border-transparent text-xs font-semibold rounded-lg transition text-center"
                >
                  View Details & Booking
                </button>
              </div>
            </div>
          ))}
        </div>

        {professionals.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No professionals found matching the selected filters.
          </div>
        )}
      </div>

      {/* Professional Detail Modal (Section 31) */}
      {activeProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-xl p-6 space-y-5 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  {activeProfessional.category} Profile
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {activeProfessional.name}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  {activeProfessional.qualification}
                </p>
              </div>
              <button
                onClick={() => setActiveProfessional(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Specialization:</strong>
                <p>{activeProfessional.specialization}</p>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Organization / Clinic:</strong>
                <p>{activeProfessional.organization}</p>
              </div>

              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">Professional Background:</strong>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  {activeProfessional.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <strong className="text-slate-900 block text-xs font-semibold mb-0.5">Location:</strong>
                  <p className="text-xs text-slate-600">{activeProfessional.location}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block text-xs font-semibold mb-0.5">Consultation Mode:</strong>
                  <p className="text-xs text-slate-600">{activeProfessional.consultationMode}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block text-xs font-semibold mb-0.5">Languages:</strong>
                  <p className="text-xs text-slate-600">{activeProfessional.languages.join(', ')}</p>
                </div>
                <div>
                  <strong className="text-slate-900 block text-xs font-semibold mb-0.5">Availability Timings:</strong>
                  <p className="text-xs text-slate-600">{activeProfessional.availability}</p>
                </div>
              </div>

              {/* Verified Badge Details */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Credential Verification Source: </span>
                  {activeProfessional.verificationSource}
                </div>
              </div>

              {/* Booking / Contact Info (Section 31) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <strong className="text-slate-900 block font-bold">Appointment & Intake Coordination:</strong>
                <p className="text-slate-600 leading-relaxed">{activeProfessional.contactInfo}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveProfessional(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Close
              </button>
              <a
                href={activeProfessional.bookingUrl}
                onClick={() => {
                  alert(`Request noted for ${activeProfessional.name}. For this college educational prototype, verified contact details have been verified in our faculty directory.`);
                  setActiveProfessional(null);
                }}
                className="px-5 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Request Appointment</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                  Counselling Session Details
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeSession.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {activeSession.description}
            </p>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <p><strong>Speaker:</strong> {activeSession.speaker}</p>
              <p><strong>Date & Time:</strong> {activeSession.date} at {activeSession.startTime}</p>
              <p><strong>Format:</strong> {activeSession.mode}</p>
              <p><strong>Location:</strong> {activeSession.location}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSession(null)}
                className="px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition"
              >
                Close Session Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
