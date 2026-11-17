import React, {useEffect, useMemo, useRef, useState} from 'react';
import {CheckCircle2, Pause, Play, RotateCcw, XCircle} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import {WALKTHROUGH_LESSONS, WALKTHROUGH_UI} from '../i18n/walkthroughTranslations';

interface LessonExampleAnimatorProps {
  lessonId: string;
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

export const LessonExampleAnimator: React.FC<LessonExampleAnimatorProps> = ({lessonId}) => {
  const {lang} = useLanguage();
  const [mode, setMode] = useState<Mode>('correct');
  const [progress, setProgress] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(true);
  const rafRef = useRef<number | null>(null);

  const ui = WALKTHROUGH_UI[lang];
  const content = WALKTHROUGH_LESSONS[lang][lessonId] ?? WALKTHROUGH_LESSONS.en[lessonId];

  // Auto-play fresh animation whenever lesson or mode changes
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
  }, [lessonId, mode]);

  useEffect(() => {
    if (!playing) return;
    let lastTs: number | null = null;
    const durationMs = 5200;

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

  if (!content) return null;

  const steps = mode === 'correct' ? content.correctSteps : content.mistakeSteps;
  const summary = mode === 'correct' ? content.correctSummary : content.mistakeSummary;
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

  const handleJumpStep = (stepIdx: number) => {
    setPlaying(false);
    setProgress(stepIdx === 0 ? 0.3 : stepIdx === 1 ? 0.65 : 1);
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D131F] overflow-hidden">
      {/* Header & Mode Switcher */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <span>{ui.badgeLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400" dir="ltr">
              {content.pairBadge}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {content.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{content.subtitle}</p>
        </div>

        <div
          role="group"
          aria-label="Trade example mode"
          className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            onClick={() => setMode('correct')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{ui.correctWay}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('mistake')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'mistake'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{ui.commonMistake}</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Educational Stage */}
      <div className="p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Left: Animated Visual Stage */}
        <div className="xl:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span
              className={`font-medium ${
                mode === 'correct'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {summary}
            </span>
          </div>

          <div dir="ltr" className="w-full">
            <AnimatedLessonCanvas lessonId={lessonId} mode={mode} progress={progress} />
          </div>

          {/* Playback Controls + Timeline Scrubber */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? ui.pause : progress >= 0.99 ? ui.replay : ui.play}</span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              aria-label={ui.replay}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 flex items-center gap-2" dir="ltr">
              <input
                type="range"
                aria-label="Animation progress"
                min={0}
                max={100}
                value={Math.round(progress * 100)}
                onChange={(e) => {
                  setPlaying(false);
                  setProgress(Number(e.target.value) / 100);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 w-9 text-right">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Interactive Step Breakdown + Outcome */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const isActive = activeStepIdx === idx;
              const isReached =
                idx === 0 || (idx === 1 && progress >= 0.36) || (idx === 2 && progress >= 0.72);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJumpStep(idx)}
                  className={`w-full text-start p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? mode === 'correct'
                        ? 'border-emerald-500/60 bg-white dark:bg-[#111827] shadow-xs'
                        : 'border-red-500/60 bg-white dark:bg-[#111827] shadow-xs'
                      : isReached
                        ? 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/70 hover:border-slate-300 dark:hover:border-slate-700'
                        : 'border-slate-200/70 dark:border-slate-800/60 bg-white/40 dark:bg-[#111827]/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        isActive
                          ? mode === 'correct'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {ui.stepPrefix} 0{idx + 1}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {step.caption}
                  </p>
                </button>
              );
            })}
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs ${
              mode === 'correct'
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
                : 'border-red-500/40 bg-red-50/70 dark:bg-red-950/25 text-red-900 dark:text-red-200'
            }`}
          >
            <span className="block text-[11px] opacity-80 font-medium">{ui.outcomeLabel}</span>
            <span className="font-semibold mt-0.5 block">{outcome}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
 * Domain-specific SVG Animated Diagrams for All 8 Lessons
 * ========================================================================== */

const AnimatedLessonCanvas: React.FC<{lessonId: string; mode: Mode; progress: number}> = ({
  lessonId,
  mode,
  progress,
}) => {
  const isCorrect = mode === 'correct';
  const strokeMain = isCorrect ? '#10B981' : '#EF4444';

  // Shared SVG backdrop with subtle horizontal grid
  const Grid = ({splitY}: {splitY?: number}) => (
    <g>
      {[42, 84, 126, 168].map((y) => (
        <line
          key={y}
          x1="28"
          y1={y}
          x2="532"
          y2={y}
          stroke="currentColor"
          className="text-slate-200/80 dark:text-slate-800"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      {splitY && (
        <line
          x1="28"
          y1={splitY}
          x2="532"
          y2={splitY}
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeWidth="1"
        />
      )}
    </g>
  );

  // LESSON 1: Spread & Bid/Ask
  if (lessonId === 'lesson-1') {
    const gap = isCorrect ? 8 : 42;
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 140],
          [140, 134],
          [240, 122],
          [350, 96],
          [495, 62],
        ]
      : [
          [40, 145],
          [140, 142],
          [260, 132],
          [380, 124],
          [495, 118],
        ];
    const sampled = samplePolyline(pts, progress);
    const askLine = sampled.map(([x, y]): [number, number] => [x, y - gap / 2]);
    const bidLine = sampled.map(([x, y]): [number, number] => [x, y + gap / 2]);
    const lastAsk = askLine[askLine.length - 1];
    const lastBid = bidLine[bidLine.length - 1];
    const entryAskY = pts[0][1] - gap / 2;
    const currentPnl = isCorrect
      ? lerp(-1, 49, progress)
      : lerp(-75, -25, progress);

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {/* Entry Ask reference */}
        <line
          x1="40"
          y1={entryAskY}
          x2="510"
          y2={entryAskY}
          stroke="#3B82F6"
          strokeDasharray="4 3"
          strokeWidth="1.2"
        />
        <text x="44" y={entryAskY - 6} className="fill-blue-500 text-[10px] font-mono">
          Entry (Ask)
        </text>

        {/* Ask & Bid Paths */}
        <path d={toSvgPath(askLine)} fill="none" stroke="#10B981" strokeWidth="2.2" />
        <path d={toSvgPath(bidLine)} fill="none" stroke="#F59E0B" strokeWidth="2.2" />

        {/* Live dots */}
        <circle cx={lastAsk[0]} cy={lastAsk[1]} r="4.5" fill="#10B981" />
        <circle cx={lastBid[0]} cy={lastBid[1]} r="4.5" fill="#F59E0B" />

        {/* Gap Bracket */}
        <line
          x1={lastAsk[0] + 10}
          y1={lastAsk[1]}
          x2={lastBid[0] + 10}
          y2={lastBid[1]}
          stroke={isCorrect ? '#10B981' : '#EF4444'}
          strokeWidth="2"
        />
        <text
          x={Math.min(470, lastAsk[0] + 16)}
          y={(lastAsk[1] + lastBid[1]) / 2 + 3}
          className="fill-slate-600 dark:fill-slate-300 text-[10px] font-mono"
        >
          {isCorrect ? '0.02% Spread' : '1.50% Spread'}
        </text>

        {/* Live Readout Box */}
        <rect
          x="355"
          y="16"
          width="175"
          height="32"
          rx="6"
          className="fill-slate-100 dark:fill-slate-800/90"
        />
        <text
          x="442"
          y="36"
          textAnchor="middle"
          className={`text-xs font-mono font-bold ${
            currentPnl >= 0 ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
          }`}
        >
          Live P&L: {currentPnl >= 0 ? `+$${currentPnl.toFixed(2)}` : `-$${Math.abs(currentPnl).toFixed(2)}`}
        </text>
      </svg>
    );
  }

  // LESSON 2: Limit, Stop-Loss & Take-Profit
  if (lessonId === 'lesson-2') {
    const tpY = 44;
    const limitY = 122;
    const slY = 166;

    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 92],
          [110, 102],
          [185, limitY],
          [260, 108],
          [355, 76],
          [465, tpY],
          [505, tpY],
        ]
      : [
          [40, 105],
          [120, 56],
          [175, 48],
          [250, 92],
          [340, 136],
          [430, 174],
          [505, 186],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];
    const filled = isCorrect ? progress >= 0.34 : progress >= 0.28;
    const exited = isCorrect ? progress >= 0.85 : progress >= 0.92;

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {isCorrect ? (
          <>
            <line x1="35" y1={tpY} x2="525" y2={tpY} stroke="#10B981" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={tpY - 6} className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono">
              Take-Profit $93,500
            </text>

            <line x1="35" y1={limitY} x2="525" y2={limitY} stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={limitY - 6} className="fill-blue-600 dark:fill-blue-400 text-[10px] font-mono">
              Buy Limit $89,500
            </text>

            <line x1="35" y1={slY} x2="525" y2={slY} stroke="#EF4444" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={slY - 6} className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
              Stop-Loss $87,500
            </text>
          </>
        ) : (
          <text x="40" y="30" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
            No Stop-Loss Set · Chasing Top ($93,500)
          </text>
        )}

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />

        {filled && (
          <g>
            <circle cx={isCorrect ? 185 : 175} cy={isCorrect ? limitY : 48} r="6" fill={isCorrect ? '#3B82F6' : '#EF4444'} opacity="0.25" />
            <circle cx={isCorrect ? 185 : 175} cy={isCorrect ? limitY : 48} r="3.5" fill={isCorrect ? '#3B82F6' : '#EF4444'} />
          </g>
        )}

        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />

        {exited && (
          <g>
            <rect
              x="355"
              y="148"
              width="170"
              height="30"
              rx="6"
              className={isCorrect ? 'fill-emerald-600' : 'fill-red-600'}
            />
            <text x="440" y="167" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">
              {isCorrect ? 'TP Hit: +$178.00' : 'Uncapped Loss: -$240.00'}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // LESSON 3: Crypto 24/7 Volatility & BTC Leadership
  if (lessonId === 'lesson-3') {
    const btcPts: Array<[number, number]> = isCorrect
      ? [
          [40, 128],
          [140, 120],
          [260, 100],
          [380, 84],
          [500, 68],
        ]
      : [
          [40, 62],
          [140, 74],
          [260, 92],
          [380, 114],
          [500, 134],
        ];
    const solPts: Array<[number, number]> = isCorrect
      ? [
          [40, 165],
          [140, 158],
          [260, 126],
          [380, 94],
          [500, 48],
        ]
      : [
          [40, 50],
          [140, 84],
          [260, 124],
          [380, 162],
          [500, 190],
        ];

    const btcSample = samplePolyline(btcPts, progress);
    const solSample = samplePolyline(solPts, progress);
    const solTip = solSample[solSample.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <path d={toSvgPath(btcSample)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
        <path d={toSvgPath(solSample)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={solTip[0]} cy={solTip[1]} r="5" fill={strokeMain} />

        <g className="text-[10px] font-mono">
          <rect x="36" y="14" width="175" height="42" rx="6" className="fill-slate-100 dark:fill-slate-800/90" />
          <text x="48" y="31" className="fill-amber-600 dark:fill-amber-400 font-semibold">
            --- BTC/USD {isCorrect ? '(+4.2% Trend Up)' : '(-4.5% Downtrend)'}
          </text>
          <text x="48" y="47" className={isCorrect ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'}>
            ─── SOL/USD {isCorrect ? '$1.5k Size (+$140)' : '$10k Size (-$950)'}
          </text>
        </g>
      </svg>
    );
  }

  // LESSON 4: Forex Pairs & Pips
  if (lessonId === 'lesson-4') {
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 162],
          [150, 142],
          [265, 118],
          [385, 84],
          [500, 52],
        ]
      : [
          [40, 52],
          [150, 82],
          [265, 118],
          [385, 146],
          [500, 168],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];
    const pipsVal = Math.round(lerp(0, isCorrect ? 40 : -40, progress));
    const quoteVal = isCorrect
      ? (1.056 + 0.004 * progress).toFixed(4)
      : (1.06 - 0.004 * progress).toFixed(4);

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <line x1="40" y1={pts[0][1]} x2="520" y2={pts[0][1]} stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.2" />
        <text x="44" y={pts[0][1] - 6} className="fill-blue-500 text-[10px] font-mono">
          {isCorrect ? 'Buy EUR/USD @ 1.0560' : 'Mistaken Buy EUR/USD @ 1.0600 (USD Rose)'}
        </text>

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />

        <rect x="330" y="16" width="200" height="44" rx="6" className="fill-slate-100 dark:fill-slate-800/90" />
        <text x="342" y="34" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-semibold">
          EUR/USD: {quoteVal}
        </text>
        <text
          x="342"
          y="50"
          className={`text-[11px] font-mono font-bold ${
            pipsVal >= 0 ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
          }`}
        >
          {pipsVal >= 0 ? `+${pipsVal}` : pipsVal} pips ({pipsVal >= 0 ? `+$${(pipsVal * 0.9425).toFixed(2)}` : `-$${Math.abs(pipsVal * 0.9425).toFixed(2)}`})
        </text>
      </svg>
    );
  }

  // LESSON 5: Reading Candlesticks & Rejection Wicks
  if (lessonId === 'lesson-5') {
    const openY = 98;
    const lowY = 176;
    const highY = 66;
    // Animate candle forming: first dips to low (red), then recovers to hammer close (green)
    const liveCloseY =
      progress < 0.42
        ? lerp(openY, 166, progress / 0.42)
        : lerp(166, 78, (progress - 0.42) / 0.4);
    const liveLowY = progress < 0.42 ? Math.max(openY, liveCloseY) + 8 : lowY;
    const isBullNow = liveCloseY <= openY;
    const candleCol = isBullNow ? '#10B981' : '#EF4444';

    const bodyTop = Math.min(openY, liveCloseY);
    const bodyHeight = Math.max(6, Math.abs(liveCloseY - openY));

    const showFollowCandle = progress > 0.72;
    const followH = clamp((progress - 0.72) / 0.28) * 38;

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {/* Support Line */}
        <line x1="40" y1="158" x2="520" y2="158" stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.2" />
        <text x="44" y="172" className="fill-blue-500 text-[10px] font-mono">
          Key Support Level ($3,100)
        </text>

        {/* Prior Reference Candles */}
        <line x1="120" y1="58" x2="120" y2="108" stroke="#EF4444" strokeWidth="2" />
        <rect x="108" y="66" width="24" height="30" rx="2" fill="#EF4444" />
        <line x1="175" y1="86" x2="175" y2="140" stroke="#EF4444" strokeWidth="2" />
        <rect x="163" y="94" width="24" height="36" rx="2" fill="#EF4444" />

        {/* Live Forming 15m Candle */}
        <line x1="250" y1={Math.min(highY, bodyTop)} x2="250" y2={liveLowY} stroke={candleCol} strokeWidth="2.5" />
        <rect x="234" y={bodyTop} width="32" height={bodyHeight} rx="2" fill={candleCol} />

        {/* Follow-up candle after confirmation */}
        {showFollowCandle && (
          <g>
            <line x1="335" y1={78 - followH - 8} x2="335" y2={84} stroke="#10B981" strokeWidth="2.5" />
            <rect x="319" y={78 - followH} width="32" height={Math.max(4, followH)} rx="2" fill="#10B981" />
          </g>
        )}

        {/* Entry Marker */}
        {isCorrect ? (
          progress >= 0.72 && (
            <g>
              <circle cx="319" cy="78" r="5" fill="#10B981" />
              <text x="380" y="62" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold">
                Wait for Hammer Close → Buy (+$160)
              </text>
            </g>
          )
        ) : (
          progress >= 0.25 && (
            <g>
              <circle cx="250" cy="156" r="5" fill="#EF4444" />
              <text x="305" y="148" className="fill-red-600 dark:fill-red-400 text-[11px] font-mono font-bold">
                Sold Mid-Candle Before Close (-$110)
              </text>
            </g>
          )
        )}
      </svg>
    );
  }

  // LESSON 6: SMA 20 + RSI(14)
  if (lessonId === 'lesson-6') {
    const smaPts: Array<[number, number]> = [
      [40, 125],
      [160, 110],
      [280, 94],
      [400, 78],
      [510, 62],
    ];
    const pricePts: Array<[number, number]> = isCorrect
      ? [
          [40, 114],
          [130, 74],
          [235, 96],
          [295, 92],
          [400, 56],
          [505, 32],
        ]
      : [
          [40, 114],
          [140, 64],
          [210, 30],
          [320, 70],
          [440, 92],
          [505, 96],
        ];
    const rsiPts: Array<[number, number]> = isCorrect
      ? [
          [40, 180],
          [130, 162],
          [235, 184],
          [295, 182],
          [400, 168],
          [505, 160],
        ]
      : [
          [40, 180],
          [140, 156],
          [210, 146],
          [320, 174],
          [440, 186],
          [505, 188],
        ];

    const pSample = samplePolyline(pricePts, progress);
    const rSample = samplePolyline(rsiPts, progress);
    const pTip = pSample[pSample.length - 1];
    const rTip = rSample[rSample.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid splitY={140} />
        <path d={toSvgPath(smaPts)} fill="none" stroke="#F59E0B" strokeWidth="2" />
        <text x="42" y="135" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">
          SMA 20 Trend
        </text>

        <path d={toSvgPath(pSample)} fill="none" stroke={strokeMain} strokeWidth="2.5" />
        <circle cx={pTip[0]} cy={pTip[1]} r="4.5" fill={strokeMain} />

        {/* RSI 70 line */}
        <line x1="35" y1="154" x2="520" y2="154" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" />
        <text x="40" y="151" className="fill-slate-500 text-[9px] font-mono">RSI 70 (Overbought)</text>
        <path d={toSvgPath(rSample)} fill="none" stroke="#A855F7" strokeWidth="2" />
        <circle cx={rTip[0]} cy={rTip[1]} r="4" fill="#A855F7" />

        {/* Highlight Entry */}
        {progress >= 0.42 && (
          <g>
            <circle cx={isCorrect ? 235 : 210} cy={isCorrect ? 96 : 30} r="5.5" fill={isCorrect ? '#10B981' : '#EF4444'} />
            <text
              x={isCorrect ? 248 : 224}
              y={isCorrect ? 112 : 34}
              className={`text-[10px] font-mono font-bold ${isCorrect ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'}`}
            >
              {isCorrect ? 'Pullback to SMA (RSI 42)' : 'Overbought Chase (RSI 82)'}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // LESSON 7: 1% Risk & 1:2 Reward Across 5 Trades
  if (lessonId === 'lesson-7') {
    const trades = isCorrect
      ? [
          {label: '#1', delta: '-$1k', win: false, eqY: 118},
          {label: '#2', delta: '-$1k', win: false, eqY: 132},
          {label: '#3', delta: '+$2k', win: true, eqY: 104},
          {label: '#4', delta: '-$1k', win: false, eqY: 118},
          {label: '#5', delta: '+$2k', win: true, eqY: 88},
        ]
      : [
          {label: '#1', delta: '-$20k', win: false, eqY: 146},
          {label: '#2', delta: '-$16k', win: false, eqY: 186},
        ];

    const startY = 104;
    const eqPts: Array<[number, number]> = [[45, startY]];
    trades.forEach((tr, i) => {
      eqPts.push([125 + i * 95, tr.eqY]);
    });
    const sampledEq = samplePolyline(eqPts, progress);
    const tip = sampledEq[sampledEq.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <line x1="35" y1={startY} x2="525" y2={startY} stroke="#64748B" strokeDasharray="4 4" strokeWidth="1.2" />
        <text x="40" y={startY - 7} className="fill-slate-500 text-[10px] font-mono">
          $100,000 Start
        </text>

        {trades.map((tr, i) => {
          const threshold = (i + 0.5) / trades.length;
          if (progress < threshold) return null;
          const x = 125 + i * 95;
          return (
            <g key={tr.label}>
              <rect
                x={x - 24}
                y={tr.win ? tr.eqY - 34 : tr.eqY + 10}
                width="48"
                height="22"
                rx="4"
                className={tr.win ? 'fill-emerald-600/15' : 'fill-red-600/15'}
              />
              <text
                x={x}
                y={tr.win ? tr.eqY - 19 : tr.eqY + 25}
                textAnchor="middle"
                className={`text-[10px] font-mono font-bold ${
                  tr.win ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
                }`}
              >
                {tr.delta}
              </text>
            </g>
          );
        })}

        <path d={toSvgPath(sampledEq)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
      </svg>
    );
  }

  // LESSON 8: Trend Pullback Playbook
  if (lessonId === 'lesson-8') {
    const smaPts: Array<[number, number]> = [
      [40, 166],
      [180, 140],
      [320, 114],
      [495, 80],
    ];
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 154],
          [135, 112],
          [235, 130],
          [345, 86],
          [445, 50],
          [500, 44],
        ]
      : [
          [40, 154],
          [135, 108],
          [205, 52],
          [270, 116],
          [350, 80],
          [490, 46],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <path d={toSvgPath(smaPts)} fill="none" stroke="#F59E0B" strokeWidth="2" />
        <text x="44" y="182" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">
          Rising SMA 20 Support
        </text>

        {isCorrect ? (
          <>
            <line x1="220" y1="50" x2="515" y2="50" stroke="#10B981" strokeDasharray="4 3" strokeWidth="1.2" />
            <text x="360" y="42" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono">
              TP 1.0610 (+30 pips)
            </text>
            <line x1="220" y1="154" x2="515" y2="154" stroke="#EF4444" strokeDasharray="4 3" strokeWidth="1.2" />
            <text x="360" y="168" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
              SL 1.0565 (-15 pips)
            </text>
          </>
        ) : (
          <text x="200" y="34" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
            FOMO Buy @ 1.0615 → Stopped Out on Pullback!
          </text>
        )}

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        {progress >= 0.4 && (
          <circle cx={isCorrect ? 235 : 205} cy={isCorrect ? 130 : 52} r="5.5" fill={isCorrect ? '#3B82F6' : '#EF4444'} />
        )}
        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
      </svg>
    );
  }

  // LESSON 9: Resistance Confirmation & News Fakeout Avoidance
  if (lessonId === 'lesson-9') {
    const resY = 104;
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 152],
          [115, 114],
          [175, 134],
          [245, 76],
          [325, 102],
          [415, 62],
          [500, 38],
        ]
      : [
          [40, 152],
          [115, 112],
          [185, 66],
          [245, 138],
          [340, 166],
          [485, 174],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <line x1="36" y1={resY} x2="524" y2={resY} stroke="#3B82F6" strokeDasharray="5 3" strokeWidth="1.5" />
        <text x="42" y={resY - 7} className="fill-blue-600 dark:fill-blue-400 text-[10px] font-mono font-semibold">
          Resistance Zone (1.0800)
        </text>

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" strokeLinecap="round" />

        {isCorrect ? (
          progress >= 0.65 && (
            <g>
              <circle cx="325" cy="102" r="6" fill="#10B981" opacity="0.25" />
              <circle cx="325" cy="102" r="4" fill="#10B981" />
              <text x="336" y="122" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-bold">
                Clean Retest Entry (+$240)
              </text>
            </g>
          )
        ) : (
          progress >= 0.36 && (
            <g>
              <circle cx="185" cy="66" r="6" fill="#EF4444" opacity="0.25" />
              <circle cx="185" cy="66" r="4" fill="#EF4444" />
              <text x="200" y="54" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono font-bold">
                News Spike Fakeout + Slippage (-$185)
              </text>
            </g>
          )
        )}

        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
      </svg>
    );
  }

  // LESSON 10: Trading Psychology — Daily Loss Cap vs. Revenge Trading Tilt
  const baseLineY = 108;
  const pts: Array<[number, number]> = isCorrect
    ? [
        [45, baseLineY],
        [135, 120],
        [210, 132],
        [300, 132],
        [395, 102],
        [500, 68],
      ]
    : [
        [45, baseLineY],
        [135, 120],
        [205, 132],
        [295, 156],
        [390, 178],
        [500, 196],
      ];
  const sampled = samplePolyline(pts, progress);
  const tip = sampled[sampled.length - 1];

  return (
    <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
      <Grid />
      <line x1="36" y1={baseLineY} x2="524" y2={baseLineY} stroke="#64748B" strokeDasharray="4 4" strokeWidth="1.2" />
      <text x="42" y={baseLineY - 7} className="fill-slate-500 text-[10px] font-mono">
        Starting Equity ($100k)
      </text>

      {isCorrect ? (
        progress >= 0.48 && (
          <g>
            <rect x="214" y="138" width="124" height="22" rx="4" className="fill-blue-600/12" />
            <text x="276" y="153" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[10px] font-mono font-semibold">
              Daily Cap Hit → Rest
            </text>
          </g>
        )
      ) : (
        progress >= 0.5 && (
          <text x="270" y="150" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono font-bold">
            2x Revenge Bets → Tilt (-14%)
          </text>
        )
      )}

      <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
    </svg>
  );
};
