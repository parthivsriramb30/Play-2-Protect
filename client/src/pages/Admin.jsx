import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Users, CheckCircle, Award, Gift, BookOpen, ToggleLeft, ToggleRight, Video, Sparkles, PhoneCall } from 'lucide-react';
import { getAdminStats, getOffers, toggleOffer, getVideos, toggleVideo, getProfessionals, toggleProfessional } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'professionals' | 'offers'

  useEffect(() => {
    Promise.all([getAdminStats(), getOffers(), getVideos(), getProfessionals()]).then(([sRes, oRes, vRes, pRes]) => {
      if (sRes && sRes.stats) setStats(sRes.stats);
      if (oRes && oRes.offers) setOffers(oRes.offers);
      if (vRes && vRes.videos) setVideos(vRes.videos);
      if (pRes && pRes.professionals) setProfessionals(pRes.professionals);
    });
  }, []);

  const handleToggleOffer = async (offerId) => {
    const res = await toggleOffer(offerId);
    if (res && res.success) {
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, active: res.active } : o));
    }
  };

  const handleToggleVideo = async (videoId, field) => {
    const res = await toggleVideo(videoId, field);
    if (res && res.success) {
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, [field]: res[field] } : v));
    }
  };

  const handleToggleProf = async (profId) => {
    const res = await toggleProfessional(profId);
    if (res && res.success) {
      setProfessionals(prev => prev.map(p => p.id === profId ? { ...p, active: res.active } : p));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              Faculty & Admin Overview
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Curriculum oversight, verified video moderation, and healthcare professional directory administration.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
            Role: {user?.role === 'admin' ? 'Administrator' : 'Faculty Lead'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Total Students</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalUsers}</span>
            <span className="text-[11px] text-emerald-600 font-medium">{stats.activeUsers} active</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Verified Videos</span>
            <span className="text-2xl font-bold text-sky-700 mt-1 block">{stats.totalVideos || videos.length}</span>
            <span className="text-[11px] text-slate-500">{stats.verifiedVideos || videos.length} accredited</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Professionals Listed</span>
            <span className="text-2xl font-bold text-teal-700 mt-1 block">{stats.totalProfessionals || professionals.length}</span>
            <span className="text-[11px] text-slate-500">{stats.upcomingSessions || 4} upcoming sessions</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold block">Certificates Issued</span>
            <span className="text-2xl font-bold text-indigo-700 mt-1 block">{stats.certificatesGenerated}</span>
            <span className="text-[11px] text-slate-500">{stats.modulesCompleted} modules passed</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs for Admin Sections */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'videos'
              ? 'border-[#0f2942] text-[#0f2942]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Expert Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('professionals')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'professionals'
              ? 'border-[#0f2942] text-[#0f2942]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Professionals Directory ({professionals.length})
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'offers'
              ? 'border-[#0f2942] text-[#0f2942]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Partner Demo Offers ({offers.length})
        </button>
      </div>

      {/* Tab 1: Video Management (Section 9) */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Verified Video Management
              </h2>
              <p className="text-xs text-slate-500">
                Publish/unpublish videos and toggle "Recommended For You" status.
              </p>
            </div>
            <Link
              to="/videos"
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              Preview Library →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {videos.map(video => (
              <div key={video.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-md">
                  <span className="text-[10px] uppercase font-bold text-sky-700">{video.category}</span>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">{video.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {video.speakerName} ({video.qualification}) • Verified by {video.verifiedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleVideo(video.id, 'recommended')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                      video.recommended
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}
                    title="Toggle Recommended"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{video.recommended ? 'Featured' : 'Standard'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleVideo(video.id, 'active')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                      video.active !== false
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {video.active !== false ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    <span>{video.active !== false ? 'Published' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Professionals Management (Section 33) */}
      {activeTab === 'professionals' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Healthcare Professional & Counsellor Directory
              </h2>
              <p className="text-xs text-slate-500">
                Moderate verified professionals and activate or deactivate listings.
              </p>
            </div>
            <Link
              to="/professionals"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Preview Directory →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {professionals.map(prof => (
              <div key={prof.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-md">
                  <span className="text-[10px] uppercase font-bold text-teal-700">{prof.category}</span>
                  <h3 className="text-sm font-semibold text-slate-900">{prof.name}</h3>
                  <p className="text-xs text-slate-500">
                    {prof.qualification} • {prof.specialization}
                  </p>
                  <span className="text-[11px] text-slate-400 block">{prof.location} • {prof.consultationMode}</span>
                </div>

                <div className="self-end sm:self-center">
                  <button
                    onClick={() => handleToggleProf(prof.id)}
                    className={`px-3 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                      prof.active !== false
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {prof.active !== false ? <ToggleRight className="w-3.5 h-3.5 text-emerald-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    <span>{prof.active !== false ? 'Active in Directory' : 'Deactivated'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Demo Offers Management */}
      {activeTab === 'offers' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Partner Demo Offers Management
          </h2>
          <p className="text-xs text-slate-500">
            Toggle demo offer vouchers active or inactive for students:
          </p>

          <div className="divide-y divide-slate-100">
            {offers.map(offer => (
              <div key={offer.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-slate-900 block">{offer.title}</span>
                  <span className="text-xs text-slate-500 font-mono">Code: {offer.code} • {offer.discount}</span>
                </div>
                <button
                  onClick={() => handleToggleOffer(offer.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                    offer.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {offer.active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{offer.active ? 'Active' : 'Deactivated'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Registry Snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Curriculum & Integrity Content Registry
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 font-bold mb-1">5 Learning Modules</strong>
            Anti-Doping Fundamentals, Supplement Risks, Prohibited List & TUEs, Prescription Drugs, Clean Choices.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 font-bold mb-1">8 Verified Videos</strong>
            Peer-reviewed video resources from sports cardiologists, anti-doping lawyers, and clean athletes.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="block text-slate-900 font-bold mb-1">8 Verified Clinicians</strong>
            Psychiatrists, sports medicine physicians, addiction counsellors, and support helplines.
          </div>
        </div>
      </div>

    </div>
  );
}
