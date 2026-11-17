import React, {useEffect, useMemo, useRef, useState} from 'react';
import {CheckCircle2, Pause, Play, RotateCcw, XCircle} from 'lucide-react';
import type {StrategyLocalizedContent} from '../data/strategies';
import {useLanguage} from '../i18n/LanguageContext';
import type {StrategyId} from '../types/trading';

interface StrategyAnimatorProps {
  strategyId: StrategyId;
  content: StrategyLocalizedContent;
}

type Mode = 'correct' | 'mistake';

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t);
}

function samplePolyline(pts: Array<[number, number]>, progress: number): Array<[number, number]> {
  if (pts.length === 0) return [];
  const p = clamp(progress);
  if (p <= 0) return [pts[0]];
  if (p >= 1) return pts;

  const totalSegs = pts.length - 1;
  const scaled = p * totalSegs;
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const out = pts.slice(0, idx + 1);
  if (idx < totalSegs) {
    const [x1, y1] = pts[idx];
    const [x2, y2] = pts[idx + 1];
    out.push([lerp(x1, x2, frac), lerp(y1, y2, frac)]);
  }
  return out;
}

function toSvgPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

export const StrategyAnimator: React.FC<StrategyAnimatorProps> = ({strategyId, content}) => {
  const {t} = useLanguage();
  const [mode, setMode] = useState<Mode>('correct');
  const [progress, setProgress] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setProgress(1);
      setPlaying(false);
      return;
    }

    setProgress(0.02);
    setPlaying(true);
  }, [strategyId, mode]);

  useEffect(() => {
    if (!playing) return;
    let lastTs: number | null = null;
    const durationMs = 5600;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      setProgress((prev) => {
        const next = prev + dt / durationMs;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const activeStepIdx = useMemo(() => {
    if (progress < 0.36) return 0;
    if (progress < 0.72) return 1;
    return 2;
  }, [progress]);

  const steps = mode === 'correct' ? content.correctSteps : content.mistakeSteps;
  const outcome = mode === 'correct' ? content.correctOutcome : content.mistakeOutcome;

  const handleTogglePlay = () => {
    if (progress >= 0.99) {
      setProgress(0.02);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const handleReplay = () => {
    setProgress(0.02);
    setPlaying(true);
  };

  const handleScrub = (val: number) => {
    setPlaying(false);
    setProgress(clamp(val / 100));
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-4 sm:p-5 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={content.name}
          className="inline-flex rounded-lg bg-slate-200/80 dark:bg-[#111827] p-1 border border-slate-300/60 dark:border-slate-800 self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'correct'}
            onClick={() => setMode('correct')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.strategies.correctMode}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'mistake'}
            onClick={() => setMode('mistake')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'mistake'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t.strategies.mistakeMode}</span>
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? t.strategies.pauseBtn : t.strategies.playBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.strategies.replayBtn}</span>
          </button>
        </div>
      </div>

      {/* Animated SVG Canvas */}
      <div
        dir="ltr"
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[#0B111D] p-2 sm:p-3 overflow-hidden"
      >
        <svg viewBox="0 0 560 220" className="w-full h-auto max-h-[250px] block" aria-hidden="true">
          {/* Subtle grid */}
          <g stroke="#1E293B" strokeWidth="1" strokeDasharray="3 4" opacity="0.6">
            <line x1="20" y1="45" x2="540" y2="45" />
            <line x1="20" y1="110" x2="540" y2="110" />
            <line x1="20" y1="175" x2="540" y2="175" />
            <line x1="145" y1="15" x2="145" y2="205" />
            <line x1="280" y1="15" x2="280" y2="205" />
            <line x1="415" y1="15" x2="415" y2="205" />
          </g>

          {renderStrategyScene(strategyId, mode, progress)}
        </svg>

        {/* Interactive Scrubber Bar */}
        <div className="flex items-center gap-3 px-2 pt-2 border-t border-slate-800/80 mt-2">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">{t.strategies.scrubHint}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(progress * 100)}
            onChange={(e) => handleScrub(Number(e.target.value))}
            aria-label={t.strategies.scrubHint}
            className="w-full accent-blue-500 h-1.5 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-300 w-9 text-right tabular-nums shrink-0">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Synchronized 3-Phase Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {steps.map((text, idx) => {
          const isCurrent = idx === activeStepIdx;
          const isDone = idx < activeStepIdx || progress >= 0.99;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleScrub(idx === 0 ? 22 : idx === 1 ? 56 : 95)}
              className={`text-start rounded-lg border p-3 transition-colors cursor-pointer ${
                isCurrent
                  ? mode === 'correct'
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-slate-900 dark:text-white'
                    : 'border-rose-500/60 bg-rose-500/10 text-slate-900 dark:text-white'
                  : isDone
                    ? 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-[#111827]/70 text-slate-700 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-[#0F1623]/40 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="text-[11px] font-mono font-semibold mb-1 opacity-75">
                {t.strategies.stepWord} 0{idx + 1}
              </div>
              <p className="text-xs leading-relaxed">{text}</p>
            </button>
          );
        })}
      </div>

      {/* Outcome Banner */}
      <div
        className={`rounded-lg px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 border ${
          mode === 'correct'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
        }`}
      >
        {mode === 'correct' ? (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 shrink-0" />
        )}
        <span>{outcome}</span>
      </div>
    </div>
  );
};

function renderStrategyScene(strategyId: StrategyId, mode: Mode, progress: number) {
  switch (strategyId) {
    case 'head-shoulders':
      return <HeadShouldersScene mode={mode} p={progress} />;
    case 'double-bottom':
      return <DoubleBottomScene mode={mode} p={progress} />;
    case 'double-top':
      return <DoubleTopScene mode={mode} p={progress} />;
    case 'breakout-retest':
      return <BreakoutRetestScene mode={mode} p={progress} />;
    case 'bull-flag':
      return <BullFlagScene mode={mode} p={progress} />;
    case 'ema-pullback':
      return <EmaPullbackScene mode={mode} p={progress} />;
    case 'liquidity-sweep':
      return <LiquiditySweepScene mode={mode} p={progress} />;
    case 'rsi-divergence':
      return <RsiDivergenceScene mode={mode} p={progress} />;
    case 'bollinger-squeeze':
      return <BollingerSqueezeScene mode={mode} p={progress} />;
  }
}

/* 1. HEAD & SHOULDERS */
const HeadShouldersScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 148],
    [110, 82],  // Left Shoulder
    [155, 128], // Neckline 1
    [215, 38],  // Head
    [275, 128], // Neckline 2
    [335, 86],  // Right Shoulder
    [388, 128], // Neckline break
    [420, 140],
    [445, 130], // Retest
    [515, 192], // Target hit
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 152],
    [115, 95],
    [160, 126],
    [225, 44],  // Trader shorts right here without confirmation
    [280, 60],
    [350, 26],  // Squeeze stops trader out
    [435, 58],
    [505, 92],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Neckline */}
      <line x1="75" y1="128" x2="495" y2="128" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" opacity={mode === 'correct' ? 0.9 : 0.35} />
      <text x="80" y="142" fill="#93C5FD" fontSize="10" fontFamily="monospace">
        NECKLINE SUPPORT
      </text>

      {/* Price Path */}
      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#F8FAFC' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.14 && (
            <text x="110" y="70" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">
              L. Shoulder
            </text>
          )}
          {p > 0.34 && (
            <text x="215" y="26" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="middle">
              HEAD
            </text>
          )}
          {p > 0.56 && (
            <text x="335" y="74" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">
              R. Shoulder
            </text>
          )}
          {/* Measured Height Line */}
          {p > 0.42 && (
            <g opacity="0.7">
              <line x1="215" y1="38" x2="215" y2="128" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="223" y="86" fill="#60A5FA" fontSize="10" fontFamily="monospace">
                H
              </text>
            </g>
          )}
          {/* Entry & SL & Target */}
          {p > 0.68 && (
            <g>
              <line x1="320" y1="78" x2="525" y2="78" stroke="#F43F5E" strokeWidth="1.4" strokeDasharray="4 4" />
              <text x="520" y="72" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL (Above R. Shoulder)
              </text>
              <circle cx="388" cy="128" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="364" y="102" width="48" height="17" rx="4" fill="#10B981" />
              <text x="388" y="114" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                SELL
              </text>
            </g>
          )}
          {p > 0.88 && (
            <g>
              <line x1="388" y1="192" x2="530" y2="192" stroke="#10B981" strokeWidth="1.4" strokeDasharray="4 4" />
              <text x="520" y="206" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
                TARGET (H below neckline)
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {p > 0.42 && (
            <g>
              <circle cx="225" cy="44" r="5" fill="#F43F5E" />
              <rect x="175" y="16" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="226" y="28" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                EARLY GUESS SELL
              </text>
            </g>
          )}
          {p > 0.7 && (
            <g>
              <circle cx="350" cy="26" r="6" fill="#F43F5E" stroke="#F8FAFC" strokeWidth="1.5" />
              <text x="365" y="28" fill="#FDA4AF" fontSize="10" fontWeight="700">
                SQUEEZED OUT!
              </text>
            </g>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#10B981' : '#FB7185'} />
    </g>
  );
};

/* 2. DOUBLE BOTTOM ("W" PATTERN) */
const DoubleBottomScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 52],
    [135, 168], // Bottom 1
    [225, 102], // Neckline Peak
    [315, 166], // Bottom 2
    [392, 102], // Neckline Breakout
    [430, 106],
    [515, 34],  // Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 52],
    [135, 152], // Trader buys early on falling knife
    [200, 132],
    [280, 178],
    [380, 198], // Breaks lower
    [510, 206],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Support Floor */}
      <line x1="65" y1="168" x2="420" y2="168" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
      <text x="72" y="184" fill="#34D399" fontSize="10" fontFamily="monospace">
        SUPPORT FLOOR
      </text>

      {mode === 'correct' && (
        <>
          <line x1="160" y1="102" x2="520" y2="102" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="165" y="94" fill="#93C5FD" fontSize="10" fontFamily="monospace">
            NECKLINE BREAKOUT
          </text>
        </>
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.18 && (
            <text x="135" y="198" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Bottom 1
            </text>
          )}
          {p > 0.56 && (
            <text x="315" y="198" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Bottom 2 (Holds!)
            </text>
          )}
          {p > 0.72 && (
            <g>
              <circle cx="392" cy="102" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="368" y="75" width="48" height="18" rx="4" fill="#10B981" />
              <text x="392" y="87" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BUY
              </text>
              <line x1="290" y1="176" x2="510" y2="176" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="506" y="190" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL below Bottom 2
              </text>
            </g>
          )}
          {p > 0.9 && (
            <g>
              <line x1="392" y1="34" x2="530" y2="34" stroke="#10B981" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="520" y="26" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
                TARGET ("W" Height)
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {p > 0.25 && (
            <g>
              <circle cx="135" cy="152" r="5" fill="#F43F5E" />
              <rect x="85" y="122" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="136" y="134" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BLIND EARLY BUY
              </text>
            </g>
          )}
          {p > 0.75 && (
            <text x="390" y="182" fill="#FDA4AF" fontSize="10" fontWeight="700">
              NO CONFIRMATION → BREAKS LOWER
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 3. BREAKOUT & RETEST */
const BreakoutRetestScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 174],
    [130, 118], // Reject 1
    [205, 156],
    [270, 118], // Reject 2
    [335, 62],  // Breakout high
    [390, 118], // Golden Retest
    [515, 32],  // Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 174],
    [130, 118],
    [205, 156],
    [270, 118],
    [335, 56],  // FOMO buy at peak
    [395, 118], // Panic sells in red
    [510, 42],  // Rallies without them
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Flipped Ceiling -> Support Line */}
      <line x1="65" y1="118" x2="520" y2="118" stroke={p > 0.6 ? '#10B981' : '#F59E0B'} strokeWidth="2" strokeDasharray="6 4" />
      <text x="72" y="109" fill={p > 0.6 ? '#34D399' : '#FBBF24'} fontSize="10" fontFamily="monospace">
        {p > 0.6 ? 'OLD CEILING → NEW FLOOR' : 'RESISTANCE CEILING'}
      </text>

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#3B82F6' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.72 && (
            <g>
              <circle cx="390" cy="118" r="6" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="342" y="132" width="96" height="18" rx="4" fill="#10B981" />
              <text x="390" y="144" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                RETEST BUY
              </text>
              <line x1="350" y1="162" x2="515" y2="162" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="510" y="176" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                TIGHT STOP-LOSS
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="515" y="22" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              TARGET (+2.8R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.56 && (
            <g>
              <circle cx="335" cy="56" r="5" fill="#F43F5E" />
              <rect x="285" y="28" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="336" y="40" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FOMO BUY AT PEAK
              </text>
            </g>
          )}
          {p > 0.75 && (
            <g>
              <circle cx="395" cy="118" r="5" fill="#F43F5E" />
              <text x="395" y="140" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
                PANIC SELL ON RETEST!
              </text>
            </g>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 4. BULL FLAG CONTINUATION */
const BullFlagScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [55, 190],
    [180, 74],  // Flagpole top
    [225, 102], // Flag low 1
    [265, 84],  // Flag high 2
    [310, 114], // Flag low 2
    [352, 92],  // Upper flag breakout
    [505, 24],  // Continuation target
  ];
  const mistakePts: Array<[number, number]> = [
    [55, 190],
    [180, 74],
    [235, 104], // Shorts thinking uptrend is over
    [280, 96],
    [345, 84],
    [450, 32],  // Trend crushes short
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Flagpole brace */}
      <line x1="55" y1="190" x2="180" y2="74" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      {p > 0.25 && (
        <text x="95" y="122" fill="#93C5FD" fontSize="10" fontFamily="monospace">
          FLAGPOLE
        </text>
      )}

      {/* Parallel Flag Channel */}
      {p > 0.3 && (
        <g opacity="0.85">
          <line x1="175" y1="72" x2="365" y2="96" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="195" y1="102" x2="355" y2="124" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
        </g>
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.68 && (
            <g>
              <circle cx="352" cy="92" r="5.5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="305" y="62" width="96" height="18" rx="4" fill="#10B981" />
              <text x="353" y="74" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FLAG BREAKOUT
              </text>
              <line x1="305" y1="126" x2="510" y2="126" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="505" y="140" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL under Flag
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="505" y="18" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              POLE TARGET (+2.5R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.45 && (
            <g>
              <circle cx="235" cy="104" r="5" fill="#F43F5E" />
              <rect x="172" y="122" width="126" height="18" rx="4" fill="#F43F5E" />
              <text x="235" y="134" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FIGHTING UPTREND (SHORT)
              </text>
            </g>
          )}
          {p > 0.8 && (
            <text x="435" y="54" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
              TREND RESUMES → STOPPED!
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 5. RSI BULLISH DIVERGENCE (SPLIT PRICE + RSI PANE) */
const RsiDivergenceScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const pricePts: Array<[number, number]> = [
    [45, 42],
    [160, 92],  // LL1
    [245, 62],  // Minor Swing High
    [335, 114], // LL2 (Lower Low!)
    [405, 62],  // Structure Break
    [515, 24],  // Rally
  ];
  const rsiPts: Array<[number, number]> = [
    [45, 150],
    [160, 198], // HL1 (Oversold)
    [245, 170],
    [335, 178], // HL2 (Higher Low!)
    [405, 152],
    [515, 138],
  ];

  const activePrice = samplePolyline(pricePts, p);
  const activeRsi = samplePolyline(rsiPts, p);
  const priceHead = activePrice[activePrice.length - 1];
  const rsiHead = activeRsi[activeRsi.length - 1];

  return (
    <g>
      {/* Divider between Price and RSI pane */}
      <line x1="20" y1="128" x2="540" y2="128" stroke="#334155" strokeWidth="1.2" />
      <text x="28" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
        PRICE
      </text>
      <text x="28" y="143" fill="#60A5FA" fontSize="10" fontFamily="monospace">
        RSI (14)
      </text>

      {/* Price & RSI Paths */}
      <path d={toSvgPath(activePrice)} fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={toSvgPath(activeRsi)} fill="none" stroke="#3B82F6" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Divergence Comparison Lines */}
      {p > 0.62 && (
        <g>
          <line x1="160" y1="96" x2="335" y2="118" stroke="#F43F5E" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="248" y="120" fill="#FDA4AF" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
            Lower Low
          </text>

          <line x1="160" y1="200" x2="335" y2="180" stroke="#10B981" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="252" y="206" fill="#34D399" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
            RSI Higher Low (Bullish!)
          </text>
        </g>
      )}

      {mode === 'correct' ? (
        p > 0.72 && (
          <g>
            <line x1="230" y1="62" x2="465" y2="62" stroke="#10B981" strokeWidth="1.3" strokeDasharray="4 4" />
            <circle cx="405" cy="62" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
            <rect x="358" y="34" width="94" height="18" rx="4" fill="#10B981" />
            <text x="405" y="46" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
              CONFIRMED BUY
            </text>
          </g>
        )
      ) : (
        p > 0.3 && (
          <g>
            <circle cx="160" cy="92" r="5" fill="#F43F5E" />
            <rect x="98" y="64" width="124" height="18" rx="4" fill="#F43F5E" />
            <text x="160" y="76" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
              EARLY BUY (STILL FALLING)
            </text>
          </g>
        )
      )}

      <circle cx={priceHead[0]} cy={priceHead[1]} r="4" fill="#10B981" />
      <circle cx={rsiHead[0]} cy={rsiHead[1]} r="4" fill="#60A5FA" />
    </g>
  );
};

/* 6. DOUBLE TOP ("M" PATTERN) */
const DoubleTopScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 170],
    [135, 52],  // Top 1
    [225, 118], // Neckline Support
    [315, 54],  // Top 2
    [392, 118], // Neckline Break
    [430, 114],
    [515, 186], // Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 170],
    [135, 68],  // Trader shorts first peak prematurely
    [200, 96],
    [290, 42],  // Squeezes higher
    [390, 24],
    [510, 18],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      <line x1="65" y1="52" x2="420" y2="52" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
      <text x="72" y="42" fill="#FDA4AF" fontSize="10" fontFamily="monospace">
        RESISTANCE CEILING
      </text>

      {mode === 'correct' && (
        <>
          <line x1="160" y1="118" x2="520" y2="118" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="165" y="132" fill="#93C5FD" fontSize="10" fontFamily="monospace">
            NECKLINE BREAKDOWN
          </text>
        </>
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#F8FAFC' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.18 && (
            <text x="135" y="34" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Top 1
            </text>
          )}
          {p > 0.56 && (
            <text x="315" y="34" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Top 2 (Rejected!)
            </text>
          )}
          {p > 0.72 && (
            <g>
              <circle cx="392" cy="118" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="368" y="92" width="48" height="17" rx="4" fill="#10B981" />
              <text x="392" y="104" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                SELL
              </text>
              <line x1="290" y1="44" x2="510" y2="44" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="506" y="36" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL above Top 2
              </text>
            </g>
          )}
          {p > 0.9 && (
            <g>
              <line x1="392" y1="186" x2="530" y2="186" stroke="#10B981" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="520" y="200" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
                TARGET ("M" Height)
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {p > 0.25 && (
            <g>
              <circle cx="135" cy="68" r="5" fill="#F43F5E" />
              <rect x="78" y="82" width="114" height="18" rx="4" fill="#F43F5E" />
              <text x="135" y="94" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BLIND EARLY SHORT
              </text>
            </g>
          )}
          {p > 0.72 && (
            <text x="395" y="54" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
              BREAKOUT SQUEEZE → STOPPED!
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#10B981' : '#FB7185'} />
    </g>
  );
};

/* 7. 20 EMA TREND PULLBACK */
const EmaPullbackScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const emaPts: Array<[number, number]> = [
    [40, 186],
    [170, 152],
    [300, 118],
    [430, 84],
    [525, 58],
  ];
  const correctPts: Array<[number, number]> = [
    [40, 180],
    [130, 134],
    [175, 150], // Touch 1 on 20 EMA
    [255, 100],
    [305, 116], // Touch 2 (Entry)
    [415, 58],
    [520, 28],
  ];
  const mistakePts: Array<[number, number]> = [
    [40, 180],
    [130, 134],
    [175, 150],
    [262, 86],  // Chases stretched candle far above EMA
    [310, 116], // Pulls back to EMA — panics out in red
    [420, 56],
    [515, 32],
  ];

  const activeEma = samplePolyline(emaPts, Math.max(0.25, p));
  const activePrice = samplePolyline(mode === 'correct' ? correctPts : mistakePts, p);
  const head = activePrice[activePrice.length - 1];

  return (
    <g>
      {/* Rising 20 EMA */}
      <path d={toSvgPath(activeEma)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 3" />
      <text x="72" y="196" fill="#FBBF24" fontSize="10" fontFamily="monospace">
        RISING 20 EMA (DYNAMIC SUPPORT)
      </text>

      <path d={toSvgPath(activePrice)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.62 && (
            <g>
              <circle cx="305" cy="116" r="5.5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="260" y="130" width="90" height="18" rx="4" fill="#10B981" />
              <text x="305" y="142" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                EMA BOUNCE BUY
              </text>
              <line x1="270" y1="158" x2="495" y2="158" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="492" y="172" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL under swing low
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="520" y="20" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              TARGET (+2.4R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.5 && (
            <g>
              <circle cx="262" cy="86" r="5" fill="#F43F5E" />
              <rect x="206" y="56" width="112" height="18" rx="4" fill="#F43F5E" />
              <text x="262" y="68" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                CHASES OVEREXTENDED
              </text>
            </g>
          )}
          {p > 0.72 && (
            <g>
              <circle cx="310" cy="116" r="5" fill="#F43F5E" />
              <text x="322" y="134" fill="#FDA4AF" fontSize="10" fontWeight="700">
                PANIC SELLS AT EMA!
              </text>
            </g>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 8. LIQUIDITY SWEEP & RECLAIM */
const LiquiditySweepScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 76],
    [135, 138], // Low 1
    [205, 96],
    [275, 138], // Equal Low 2
    [328, 174], // Stop Sweep below support!
    [372, 130], // Quick Reclaim above floor
    [515, 36],  // Snap-back Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 76],
    [135, 138],
    [205, 96],
    [275, 138],
    [328, 174], // Panic shorts the wick breakdown
    [380, 126], // Gets squeezed instantly
    [510, 42],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Obvious Equal-Low Support & Stop Cluster */}
      <line x1="65" y1="138" x2="495" y2="138" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="5 4" />
      <text x="72" y="130" fill="#93C5FD" fontSize="10" fontFamily="monospace">
        EQUAL-LOW SUPPORT (STOPS BELOW)
      </text>

      {p > 0.45 && (
        <rect x="295" y="142" width="70" height="36" fill="rgba(244, 63, 94, 0.12)" stroke="#F43F5E" strokeWidth="1" strokeDasharray="3 3" rx="3" />
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.56 && (
            <text x="328" y="192" fill="#FDA4AF" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
              SWEEP WICK
            </text>
          )}
          {p > 0.72 && (
            <g>
              <circle cx="372" cy="130" r="5.5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="330" y="98" width="94" height="18" rx="4" fill="#10B981" />
              <text x="377" y="110" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                RECLAIM BUY
              </text>
              <line x1="295" y1="180" x2="515" y2="180" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="512" y="194" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL below sweep wick
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="515" y="26" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              RANGE TARGET (+3.0R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.58 && (
            <g>
              <circle cx="328" cy="174" r="5" fill="#F43F5E" />
              <rect x="262" y="186" width="132" height="18" rx="4" fill="#F43F5E" />
              <text x="328" y="198" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                SELLS INTO STOP HUNT!
              </text>
            </g>
          )}
          {p > 0.8 && (
            <text x="435" y="88" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
              TRAPPED BY SNAP-BACK!
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 9. BOLLINGER SQUEEZE BREAKDOWN */
const BollingerSqueezeScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const upperBand: Array<[number, number]> = [
    [40, 42],
    [130, 68],
    [220, 82],
    [320, 84],
    [400, 68],
    [520, 56],
  ];
  const lowerBand: Array<[number, number]> = [
    [40, 134],
    [130, 114],
    [220, 102],
    [320, 104],
    [400, 138],
    [520, 192],
  ];
  const correctPts: Array<[number, number]> = [
    [40, 88],
    [115, 78],
    [175, 98],
    [235, 88],
    [290, 96],
    [348, 124], // Breakdown outside squeezed lower band
    [430, 152],
    [515, 186], // Expansion target
  ];
  const mistakePts: Array<[number, number]> = [
    [40, 88],
    [125, 78],
    [180, 98],  // Whipsawed in tight box
    [235, 86],
    [290, 97],
    [350, 124],
    [455, 162],
  ];

  const activePrice = samplePolyline(mode === 'correct' ? correctPts : mistakePts, p);
  const head = activePrice[activePrice.length - 1];

  return (
    <g>
      {/* Upper & Lower Bollinger Bands */}
      <path d={toSvgPath(upperBand)} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65" />
      <path d={toSvgPath(lowerBand)} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65" />
      <text x="195" y="72" fill="#7DD3FC" fontSize="10" fontFamily="monospace">
        TIGHT BAND SQUEEZE
      </text>

      {p > 0.35 && (
        <rect x="200" y="80" width="125" height="26" fill="rgba(56, 189, 248, 0.08)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 3" rx="4" />
      )}

      <path d={toSvgPath(activePrice)} fill="none" stroke={mode === 'correct' ? '#F8FAFC' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.68 && (
            <g>
              <circle cx="348" cy="124" r="5.5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="304" y="136" width="96" height="18" rx="4" fill="#10B981" />
              <text x="352" y="148" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BAND BREAK SELL
              </text>
              <line x1="250" y1="76" x2="510" y2="76" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="505" y="68" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL above squeeze top
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="515" y="202" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              EXPANSION TARGET (+2.6R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.38 && (
            <g>
              <circle cx="235" cy="86" r="5" fill="#F43F5E" />
              <rect x="165" y="46" width="142" height="18" rx="4" fill="#F43F5E" />
              <text x="236" y="58" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                CHOPPED INSIDE SQUEEZE
              </text>
            </g>
          )}
          {p > 0.72 && (
            <text x="415" y="132" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
              MISSED REAL EXPANSION
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#10B981' : '#FB7185'} />
    </g>
  );
};
