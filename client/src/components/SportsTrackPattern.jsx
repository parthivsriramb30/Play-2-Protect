import React from 'react';

/**
 * Clean sports running track & court line visual motif.
 * Pure SVG vector pattern designed with collegiate sports aesthetic (no neon, no AI blobs).
 */
export default function SportsTrackPattern({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none overflow-hidden absolute inset-0 opacity-[0.035] ${className}`} aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="trackGrid" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Lane curves and line markers */}
            <path d="M 0 30 L 120 30 M 0 60 L 120 60 M 0 90 L 120 90" fill="none" stroke="#0f2942" strokeWidth="1" strokeDasharray="4 4"/>
            <circle cx="60" cy="60" r="40" fill="none" stroke="#0f2942" strokeWidth="1" />
            <path d="M 30 0 L 30 120 M 90 0 L 90 120" fill="none" stroke="#0f2942" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#trackGrid)" />
      </svg>
    </div>
  );
}
