import React, {useState} from 'react';
import {ArrowRight, Bookmark, BookmarkCheck, CheckSquare, TrendingDown, TrendingUp} from 'lucide-react';
import {TRADING_STRATEGIES, type StrategyDefinition} from '../data/strategies';
import {useLanguage} from '../i18n/LanguageContext';
import type {StrategyCategory, StrategyId} from '../types/trading';
import {StrategyAnimator} from './StrategyAnimator';

interface StrategiesViewProps {
  activeStrategyId: StrategyId;
  onSelectStrategyId: (id: StrategyId) => void;
  savedIds: StrategyId[];
  onToggleBookmark: (id: StrategyId) => void;
  onPracticeSymbol: (symbol: string) => void;
}

const MiniPatternIcon: React.FC<{strategy: StrategyDefinition; active: boolean}> = ({strategy, active}) => {
  const pts = strategy.examplePath
    .map(([x, y]) => `${(x * 0.42).toFixed(1)},${(y * 0.28).toFixed(1)}`)
    .join(' ');
  const stroke = active
    ? strategy.bias === 'bullish'
      ? '#10B981'
      : '#F43F5E'
    : '#64748B';

  return (
    <div
      dir="ltr"
      className="w-11 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] flex items-center justify-center shrink-0"
    >
      <svg width="42" height="28" viewBox="0 0 42 28" aria-hidden="true">
        <polyline
          points={pts}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const StrategiesView: React.FC<StrategiesViewProps> = ({
  activeStrategyId,
  onSelectStrategyId,
  savedIds,
  onToggleBookmark,
  onPracticeSymbol,
}) => {
  const {t, lang, dir} = useLanguage();
  const [filterCat, setFilterCat] = useState<'all' | StrategyCategory>('all');

  const visibleStrategies =
    filterCat === 'all' ? TRADING_STRATEGIES : TRADING_STRATEGIES.filter((s) => s.category === filterCat);

  const activeStrategy =
    visibleStrategies.find((s) => s.id === activeStrategyId) ?? visibleStrategies[0] ?? TRADING_STRATEGIES[0];
  const content = activeStrategy.translations[lang] ?? activeStrategy.translations.en;
  const isCurrentSaved = savedIds.includes(activeStrategy.id);

  const categoryLabel = (cat: StrategyCategory) => {
    if (cat === 'reversal') return t.strategies.catReversal;
    if (cat === 'continuation') return t.strategies.catContinuation;
    return t.strategies.catMomentum;
  };

  const examplePolyline = activeStrategy.examplePath
    .map(([x, y]) => `${(18 + x * 2.84).toFixed(1)},${(14 + y * 1.18).toFixed(1)}`)
    .join(' ');
  const triggerX = 18 + activeStrategy.exampleKeyLevels.triggerX * 2.84;
  const entryY = 14 + activeStrategy.exampleKeyLevels.entryY * 1.18;
  const stopY = 14 + activeStrategy.exampleKeyLevels.stopY * 1.18;
  const targetY = 14 + activeStrategy.exampleKeyLevels.targetY * 1.18;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Header & Category Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.strategies.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t.strategies.subtitle}
          </p>
        </div>

        <div
          role="group"
          aria-label={t.strategies.filterAll}
          className="inline-flex flex-wrap gap-1.5 rounded-lg bg-white dark:bg-[#0F1623] border border-slate-200 dark:border-slate-800 p-1 self-start lg:self-auto"
        >
          {(
            [
              {id: 'all', label: t.strategies.filterAll},
              {id: 'reversal', label: t.strategies.catReversal},
              {id: 'continuation', label: t.strategies.catContinuation},
              {id: 'momentum', label: t.strategies.catMomentum},
            ] as const
          ).map((item) => {
            const active = filterCat === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilterCat(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Strategy Roster + Animated Detail Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Strategy List */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden divide-y divide-slate-200/80 dark:divide-slate-800/80">
          {visibleStrategies.map((strategy) => {
            const c = strategy.translations[lang] ?? strategy.translations.en;
            const isSelected = strategy.id === activeStrategy.id;
            const bookmarked = savedIds.includes(strategy.id);

            return (
              <button
                key={strategy.id}
                type="button"
                onClick={() => onSelectStrategyId(strategy.id)}
                className={`w-full text-start p-4 transition-colors flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/30 ring-1 ring-inset ring-blue-500/35'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <MiniPatternIcon strategy={strategy} active={isSelected} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate">{categoryLabel(strategy.category)}</span>
                    <span className="inline-flex items-center gap-1.5 shrink-0">
                      {bookmarked && (
                        <BookmarkCheck
                          className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400"
                          aria-label={t.strategies.savedInPlaybook}
                        />
                      )}
                      <span className="font-mono tabular-nums" dir="ltr">
                        {strategy.typicalRiskReward}
                      </span>
                    </span>
                  </div>
                  <p
                    className={`text-sm font-semibold mt-0.5 leading-snug ${
                      isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {c.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono" dir="ltr">
                      {strategy.practiceSymbol}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        strategy.bias === 'bullish'
                          ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'text-rose-600 dark:text-rose-400 font-medium'
                      }
                    >
                      {strategy.bias === 'bullish' ? t.strategies.bullishBias : t.strategies.bearishBias}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Active Strategy Stage */}
        <div className="lg:col-span-8 space-y-6">
          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 sm:p-6 space-y-6">
            {/* Strategy Header */}
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{categoryLabel(activeStrategy.category)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {activeStrategy.level === 'Beginner'
                      ? t.strategies.beginnerLabel
                      : t.strategies.intermediateLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      activeStrategy.bias === 'bullish'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {activeStrategy.bias === 'bullish' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {activeStrategy.bias === 'bullish' ? t.strategies.bullishBias : t.strategies.bearishBias}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(activeStrategy.id)}
                  aria-pressed={isCurrentSaved}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    isCurrentSaved
                      ? 'border-amber-500/45 bg-amber-500/12 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] text-slate-700 dark:text-slate-200 hover:border-amber-500/50'
                  }`}
                >
                  {isCurrentSaved ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span>{isCurrentSaved ? t.strategies.savedInPlaybook : t.strategies.saveToPlaybook}</span>
                </button>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
                {content.name}
              </h2>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{content.tagline}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {content.plainSummary}
              </p>
            </div>

            {/* 1. Interactive Animated Explanation */}
            <StrategyAnimator strategyId={activeStrategy.id} content={content} />

            {/* 2. Real Market Case Study */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B101B] p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                    {t.strategies.realExampleTitle}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {content.realExample.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums" dir="ltr">
                    {content.realExample.moveResult}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(activeStrategy.id)}
                    aria-label={isCurrentSaved ? t.strategies.savedInPlaybook : t.strategies.saveToPlaybook}
                    title={isCurrentSaved ? t.strategies.savedInPlaybook : t.strategies.saveToPlaybook}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isCurrentSaved
                        ? 'border-amber-500/45 bg-amber-500/12 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-500 hover:text-amber-500'
                    }`}
                  >
                    {isCurrentSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Annotated Historical Snapshot Chart */}
                <div
                  dir="ltr"
                  className="md:col-span-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#090D16] p-3"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>{activeStrategy.practiceSymbol}</span>
                    <span>{content.realExample.timeframe}</span>
                  </div>
                  <svg viewBox="0 0 320 150" className="w-full h-auto block" aria-hidden="true">
                    {/* Stop-Loss level */}
                    <line x1="16" y1={stopY} x2="306" y2={stopY} stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
                    <text x="304" y={stopY - 4} fill="#FDA4AF" fontSize="9.5" fontFamily="monospace" textAnchor="end">
                      SL {content.realExample.stopLossPrice}
                    </text>

                    {/* Entry trigger level */}
                    <line x1="16" y1={entryY} x2="306" y2={entryY} stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
                    <text x="20" y={entryY - 4} fill="#93C5FD" fontSize="9.5" fontFamily="monospace">
                      ENTRY {content.realExample.entryPrice}
                    </text>

                    {/* Take-Profit level */}
                    <line x1="16" y1={targetY} x2="306" y2={targetY} stroke="#10B981" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
                    <text x="304" y={targetY + 11} fill="#34D399" fontSize="9.5" fontFamily="monospace" textAnchor="end">
                      TP {content.realExample.takeProfitPrice}
                    </text>

                    {/* Price trace */}
                    <polyline
                      points={examplePolyline}
                      fill="none"
                      stroke="#F8FAFC"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx={triggerX} cy={entryY} r="4.5" fill="#10B981" stroke="#090D16" strokeWidth="1.8" />
                  </svg>
                </div>

                {/* Structured Setup Parameters */}
                <div className="md:col-span-7 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.strategies.marketLabel}</div>
                      <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                        {activeStrategy.practiceSymbol} · {content.realExample.timeframe}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.strategies.entryLabel}</div>
                      <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 tabular-nums" dir="ltr">
                        {content.realExample.entryPrice}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.strategies.riskRewardLabel}</div>
                      <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums" dir="ltr">
                        {activeStrategy.typicalRiskReward}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.strategies.stopLossLabel}</div>
                      <div className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5 tabular-nums" dir="ltr">
                        {content.realExample.stopLossPrice}
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-3 py-2 col-span-1 sm:col-span-2">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.strategies.takeProfitLabel}</div>
                      <div className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums" dir="ltr">
                        {content.realExample.takeProfitPrice}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.strategies.whyWorkedLabel} — <span className="text-slate-700 dark:text-slate-200">{content.realExample.entryTrigger}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {content.realExample.whyItWorked}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Pre-Trade Checklist */}
            <section className="space-y-2.5">
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.strategies.checklistTitle}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {content.checklist.map((rule, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <span className="block font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1" dir="ltr">
                      0{idx + 1}
                    </span>
                    {rule}
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Practice Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onPracticeSymbol(activeStrategy.practiceSymbol)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>
                  {t.strategies.practiceBtn} <span dir="ltr">{activeStrategy.practiceSymbol}</span>
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
