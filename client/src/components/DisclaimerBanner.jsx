import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  return (
    <div className={`rounded-md border border-amber-200 bg-amber-50/70 text-amber-900 ${compact ? 'p-3 text-xs' : 'p-4 text-sm'}`}>
      <div className="flex items-start gap-2.5">
        <AlertCircle className={`text-amber-700 shrink-0 mt-0.5 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-950">Educational Safety Notice: </strong>
          Play2Protect provides educational information about anti-doping, drugs, and supplements. It does not diagnose, treat, or provide medical advice. It does not replace doctors, pharmacists, qualified healthcare professionals, or official anti-doping organizations (such as WADA or NADA). Always verify current medication status through official resources (e.g., Global DRO).
        </div>
      </div>
    </div>
  );
}
