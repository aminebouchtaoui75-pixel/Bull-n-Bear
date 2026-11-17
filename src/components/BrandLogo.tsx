import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({size = 'md', className = ''}) => {
  const dims = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';

  return (
    <span
      className={`group/logo relative inline-flex items-center justify-center ${dims} rounded-lg bg-[#0B1220] border border-slate-300/80 dark:border-slate-700/90 shadow-xs overflow-hidden shrink-0 transition-transform duration-200 ease-out hover:-translate-y-px hover:scale-[1.03] ${className}`}
    >
      {/* Subtle CSS sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-blue-500/10 via-transparent to-emerald-400/15 opacity-80 group-hover/logo:opacity-100 transition-opacity duration-200"
      />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-full p-1"
        aria-hidden="true"
      >
        {/* Subtle inner baseline */}
        <line
          x1="10"
          y1="48"
          x2="54"
          y2="48"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Animated trend path */}
        <path
          d="M14 43L25 30L34 36L48 19"
          stroke="#3B82F6"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-trend-draw"
        />

        {/* Breakout arrow head */}
        <path
          d="M39 19H48V28"
          stroke="#10B981"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-arrow-draw transition-transform duration-200 ease-out group-hover/logo:translate-x-[1px] group-hover/logo:-translate-y-[1px]"
        />

        {/* Pivot nodes */}
        <circle cx="25" cy="30" r="2.6" fill="#F8FAFC" className="logo-node-a" />
        <circle cx="34" cy="36" r="2.6" fill="#F8FAFC" className="logo-node-b" />
      </svg>
    </span>
  );
};
