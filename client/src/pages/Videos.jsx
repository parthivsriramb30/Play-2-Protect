import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowLeft, Play, CheckCircle, Award, Sparkles, Filter, X, Clock, ShieldCheck, User } from 'lucide-react';
import { getVideos } from '../services/api';
import { useGamification } from '../context/GamificationContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const CATEGORIES = [
  "All",
  "Doctors & Healthcare Professionals",
  "Real-Life Awareness Stories",
  "Anti-Doping Experts",
  "Healthy Choices"
];

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, watchVideo } = useGamification();

  useEffect(() => {
    getVideos(selectedCategory === 'All' ? null : selectedCategory, null, searchQuery).then(res => {
      if (res && res.videos) {
        setVideos(res.videos);
      }
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenVideo = (video) => {
    setActiveVideo(video);
    watchVideo(video.id);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  const recommendedVideos = videos.filter(v => v.recommended).slice(0, 3);

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
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              Expert Awareness Videos
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Learn from qualified professionals, experienced educators and real-life awareness stories. (+5 XP per video)
            </p>
          </div>
          <div className="self-start sm:self-auto px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{state.watchedVideos?.length || 0} Watched</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />

      {/* Recommended For You Section (Section 11) */}
      {selectedCategory === 'All' && !searchQuery && recommendedVideos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Recommended For You</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedVideos.map(video => (
              <div
                key={`rec-${video.id}`}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 group cursor-pointer" onClick={() => handleOpenVideo(video)}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/40 transition">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-[#0f2942] flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                      {video.duration}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1">
                    {video.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {video.speakerName} • {video.qualification}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{video.verificationType}</span>
                  </span>
                  <button
                    onClick={() => handleOpenVideo(video)}
                    className="text-xs font-semibold text-[#0f2942] hover:text-emerald-700 transition"
                  >
                    Watch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs & Search (Section 5) */}
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

          <div className="sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search speaker or topic..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-sky-500 transition"
            />
          </div>
        </div>

        {/* Video Catalog Grid (Section 7) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map(video => {
            const isWatched = state.watchedVideos?.includes(video.id);

            return (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition space-y-3"
              >
                <div>
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 group cursor-pointer"
                    onClick={() => handleOpenVideo(video)}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/25 flex items-center justify-center group-hover:bg-slate-900/40 transition">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-[#0f2942] flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </span>
                    {isWatched && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Watched
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {video.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {video.speakerName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {video.qualification} • {video.specialization}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{video.verificationType}</span>
                  </span>

                  <button
                    onClick={() => handleOpenVideo(video)}
                    className="px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Watch Video</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {videos.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No verified videos found matching the selected filter.
          </div>
        )}
      </div>

      {/* Video Player Modal (Section 8) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-sky-700 tracking-wider">
                  {activeVideo.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {activeVideo.verificationType}
                </span>
              </div>
              <button
                onClick={handleCloseVideo}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Player (YouTube / Web video) */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {activeVideo.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span className="font-semibold text-slate-800">{activeVideo.speakerName}</span>
                  <span>({activeVideo.qualification})</span>
                  <span>•</span>
                  <span>{activeVideo.specialization}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Verification Metadata Box (Section 6) */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
                <p>
                  <strong>Verification Authority:</strong> {activeVideo.verifiedBy}
                </p>
                <p>
                  <strong>Verification Date:</strong> {activeVideo.verificationDate}
                </p>
                <p className="text-[11px] text-slate-500 italic pt-1">
                  *This video is provided for educational awareness. It does not replace professional medical advice.
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  <Award className="w-3.5 h-3.5" />
                  <span>+5 XP Recorded</span>
                </div>
                <button
                  onClick={handleCloseVideo}
                  className="px-4 py-2 bg-[#0f2942] hover:bg-[#183d63] text-white text-xs font-semibold rounded-lg transition"
                >
                  Done Watching
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
