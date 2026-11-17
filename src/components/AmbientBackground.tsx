import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle architectural coordinate grid */}
      <div className="ambient-grid absolute inset-0 opacity-60 dark:opacity-45" />

      {/* Slow atmospheric CSS gradient drifts (compositor-only transforms) */}
      <div className="ambient-orb-a absolute -top-28 start-[12%] w-[440px] h-[440px] rounded-full bg-blue-500/[0.06] dark:bg-blue-500/[0.10] blur-3xl" />
      <div className="ambient-orb-b absolute bottom-[-120px] end-[8%] w-[400px] h-[400px] rounded-full bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08] blur-3xl" />

      {/* Faint HTML5 SVG horizon curve gently flowing across canvas */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 inset-x-0 w-full h-44 sm:h-56 opacity-45 dark:opacity-35"
      >
        <defs>
          <linearGradient id="meridianBgRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="30%" stopColor="rgba(59,130,246,0.22)" />
            <stop offset="70%" stopColor="rgba(16,185,129,0.22)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 245 C 210 215, 340 270, 520 220 C 700 170, 860 240, 1040 175 C 1210 115, 1340 165, 1440 120"
          fill="none"
          stroke="url(#meridianBgRibbon)"
          strokeWidth="1.6"
          className="ambient-wave-path"
        />
        <path
          d="M0 275 C 260 250, 420 285, 640 248 C 840 215, 1020 265, 1220 215 C 1330 188, 1395 202, 1440 185"
          fill="none"
          stroke="url(#meridianBgRibbon)"
          strokeWidth="1.1"
          strokeDasharray="6 8"
          className="ambient-wave-path-slow"
        />
      </svg>
    </div>
  );
};
