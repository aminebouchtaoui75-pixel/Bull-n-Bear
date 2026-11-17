import React, {useState} from 'react';
import {formatUsd} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {EquityPoint} from '../types/trading';

interface EquityCurveChartProps {
  points: EquityPoint[];
  initialCapital: number;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({points, initialCapital}) => {
  const {t} = useLanguage();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (points.length < 2) {
    return (
      <div className="h-52 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg px-4 text-center">
        {t.overview.equityCurveEmpty}
      </div>
    );
  }

  const width = 640;
  const height = 210;
  const padL = 12;
  const padR = 12;
  const padT = 16;
  const padB = 22;

  const vals = points.map((p) => p.equity);
  const minVal = Math.min(...vals, initialCapital);
  const maxVal = Math.max(...vals, initialCapital);
  const span = Math.max(maxVal - minVal, initialCapital * 0.005);
  const yMin = minVal - span * 0.12;
  const yMax = maxVal + span * 0.12;

  const getX = (i: number) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const getY = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * (height - padT - padB);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.equity).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${getX(points.length - 1).toFixed(1)} ${(height - padB).toFixed(1)} L ${getX(0).toFixed(1)} ${(height - padB).toFixed(1)} Z`;

  const latest = points[points.length - 1].equity;
  const isPositive = latest >= initialCapital;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const baseLineY = getY(initialCapital);

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];
  const activeChange = activePoint.equity - initialCapital;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {hoverIdx !== null ? new Date(activePoint.time).toLocaleString() : t.overview.latestEquity}
        </span>
        <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">
          {formatUsd(activePoint.equity)}{' '}
          <span className={activeChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
            ({formatUsd(activeChange, true)})
          </span>
        </span>
      </div>

      <div dir="ltr">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.24" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line
            x1={padL}
            y1={baseLineY}
            x2={width - padR}
            y2={baseLineY}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          <path d={areaPath} fill="url(#eqGrad)" />
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinejoin="round" />

          {points.map((pt, i) => (
            <circle
              key={pt.time + '-' + i}
              cx={getX(i)}
              cy={getY(pt.equity)}
              r={hoverIdx === i ? 5 : 10}
              fill={hoverIdx === i ? strokeColor : 'transparent'}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
