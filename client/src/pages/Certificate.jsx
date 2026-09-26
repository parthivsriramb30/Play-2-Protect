import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Download, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { generateCertificatePDF } from '../services/pdfService';
import confetti from 'canvas-confetti';

export default function Certificate() {
  const { user } = useAuth();
  const { state, unlockBadge, addXP } = useGamification();

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const studentName = user?.fullName || 'Alex Morgan';
  const certificateId = `P2P-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    setDownloading(true);
    try {
      generateCertificatePDF({
        userName: studentName,
        certificateId,
        date: completionDate
      });

      // Tasteful victory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      setDownloadSuccess(true);
      unlockBadge('badge-07', {
        name: 'Clean Sport Champion',
        description: 'Completed the core educational program and generated your certificate.'
      });
      addXP(50, 'Generated Anti-Doping Awareness Certificate');
    } catch (err) {
      console.error('Certificate generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/progress"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Progress</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          Anti-Doping Awareness Certificate
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Official collegiate certification of clean sport literacy and Strict Liability compliance.
        </p>
      </div>

      {/* Certificate Congratulations Banner (Section 29) */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs text-center space-y-6">
        <div className="text-4xl">🎉</div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            You completed the <strong>Play2Protect Anti-Doping Awareness Program</strong>, mastering principles of Strict Liability, the WADA Prohibited List, TUE exemptions, and supplement safety.
          </p>
        </div>

        {/* Certificate Visual Mockup Preview */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-xl border-4 border-[#0f2942] bg-[#fcfcfa] text-slate-800 shadow-sm relative overflow-hidden">
          {/* Inner Accent Line */}
          <div className="border border-emerald-700 p-4 sm:p-6 rounded-lg text-center space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              PLAY2PROTECT SPORTS INTEGRITY
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-800 tracking-tight">
              ANTI-DOPING AWARENESS CERTIFICATE
            </h3>
            <p className="text-xs text-slate-500 italic">This is to certify that</p>
            <div className="text-xl sm:text-2xl font-bold text-[#0f2942] border-b-2 border-slate-300 pb-1 max-w-xs mx-auto">
              {studentName}
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
              has completed the foundational program on clean athletic integrity, strict liability, and supplement risk verification.
            </p>
            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-200">
              <span>Date: {completionDate}</span>
              <span>ID: {certificateId}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 bg-[#0f2942] hover:bg-[#183d63] disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg transition inline-flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing Document...' : 'Generate Certificate (PDF)'}</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg inline-flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Certificate PDF successfully generated and downloaded!</span>
          </div>
        )}
      </div>
    </div>
  );
}
