import React, {useMemo, useState} from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Compass,
  Download,
  Flame,
  GraduationCap,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';
import {formatPrice, formatUsd} from '../data/instruments';
import {MISSION_XP_REWARDS} from '../hooks/useDailyMissions';
import {useLanguage} from '../i18n/LanguageContext';
import {calcPositionPnl} from '../hooks/usePaperAccount';
import type {AchievementStatus, AppTab, DailyMissionId, EquityPoint, MarketQuote, Position, TradeLog} from '../types/trading';
import {AchievementsSection} from './AchievementsSection';
import {BrandLogo} from './BrandLogo';
import {EquityCurveChart} from './EquityCurveChart';

interface AnalyticsSummary {
  initialCapital: number;
  cash: number;
  marginUsed: number;
  unrealizedPnl: number;
  realizedPnl: number;
  totalEquity: number;
  totalReturnPct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePct: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  bestTrade: number;
  worstTrade: number;
  maxDrawdownPct: number;
  cryptoPnl: number;
  forexPnl: number;
  cryptoCount: number;
  forexCount: number;
  longWinRate: number;
  shortWinRate: number;
  equitySeries: EquityPoint[];
}

interface DailyMissionsSummary {
  totalXp: number;
  level: number;
  levelProgressPct: number;
  completedIds: DailyMissionId[];
  bonusClaimedToday: boolean;
}

interface OverviewDashboardProps {
  analytics: AnalyticsSummary;
  positions: Position[];
  tradeLogs: TradeLog[];
  quotes: Record<string, MarketQuote>;
  completedLessons: number;
  totalLessons: number;
  currentCourseNumber: number;
  currentCourseTitle: string;
  activeAlertsCount: number;
  beginnerHints: boolean;
  missions: DailyMissionsSummary;
  achievements: AchievementStatus[];
  achievementsUnlockedCount: number;
  achievementsTotalCount: number;
  streakDays: number;
  onNavigate: (tab: AppTab) => void;
  onClosePosition: (id: string) => void;
  onLoadSampleHistory: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  analytics,
  positions,
  tradeLogs,
  quotes,
  completedLessons,
  totalLessons,
  currentCourseNumber,
  currentCourseTitle,
  activeAlertsCount,
  beginnerHints,
  missions,
  achievements,
  achievementsUnlockedCount,
  achievementsTotalCount,
  streakDays,
  onNavigate,
  onClosePosition,
  onLoadSampleHistory,
}) => {
  const {t, dir} = useLanguage();
  const [assetFilter, setAssetFilter] = useState<'all' | 'crypto' | 'forex'>('all');
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return tradeLogs.filter((item) => {
      if (assetFilter !== 'all' && item.assetClass !== assetFilter) return false;
      if (sideFilter !== 'all' && item.side !== sideFilter) return false;
      if (searchQuery.trim() && !item.symbol.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [tradeLogs, assetFilter, sideFilter, searchQuery]);

  const handleExportCsv = () => {
    const header = ['Symbol', 'Market', 'Side', 'NotionalUSD', 'Leverage', 'EntryPrice', 'ExitPrice', 'NetPnL', 'ReturnPct', 'ExitReason', 'ClosedAt'];
    const rows = filteredLogs.map((item) => [
      item.symbol,
      item.assetClass,
      item.side.toUpperCase(),
      item.notionalUsd.toFixed(2),
      `${item.leverage}x`,
      item.entryPrice,
      item.exitPrice,
      item.realizedPnl.toFixed(2),
      `${item.returnPct.toFixed(2)}%`,
      item.closeReason,
      new Date(item.closedAt).toISOString(),
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-trade-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeReasonLabel = (reason: TradeLog['closeReason']) => {
    if (reason === 'stop-loss') return t.overview.reasonStopLoss;
    if (reason === 'take-profit') return t.overview.reasonTakeProfit;
    if (reason === 'liquidation') return t.overview.reasonLiquidation;
    return t.overview.reasonManual;
  };

  const isBrandNew = analytics.totalTrades === 0 && positions.length === 0;
  const completedTodayCount = missions.completedIds.length;
  const missionsPct = Math.round((completedTodayCount / 4) * 100);
  const streakWord = streakDays === 1 ? t.academy.daySingular : t.academy.daysPlural;

  const dailyMissionCards: Array<{
    id: DailyMissionId;
    title: string;
    desc: string;
    cta: string;
    targetTab: AppTab;
    icon: React.ComponentType<{className?: string}>;
  }> = [
    {
      id: 'long-trade',
      title: t.overview.missionLongTitle,
      desc: t.overview.missionLongDesc,
      cta: t.overview.missionLongCta,
      targetTab: 'trade',
      icon: TrendingUp,
    },
    {
      id: 'risk-guard',
      title: t.overview.missionRiskTitle,
      desc: t.overview.missionRiskDesc,
      cta: t.overview.missionRiskCta,
      targetTab: 'trade',
      icon: ShieldCheck,
    },
    {
      id: 'strategy-guide',
      title: t.overview.missionStrategyTitle,
      desc: t.overview.missionStrategyDesc,
      cta: t.overview.missionStrategyCta,
      targetTab: 'strategies',
      icon: Compass,
    },
    {
      id: 'academy-quiz',
      title: t.overview.missionQuizTitle,
      desc: t.overview.missionQuizDesc,
      cta: t.overview.missionQuizCta,
      targetTab: 'academy',
      icon: GraduationCap,
    },
  ];

  const netLivePnl = analytics.realizedPnl + analytics.unrealizedPnl;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Clean Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5 min-w-0">
          <BrandLogo size="md" />
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
              {t.overview.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xl">
              {t.overview.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.overview.resumeCourseBtn} {String(currentCourseNumber).padStart(2, '0')} ({completedLessons}/{totalLessons})
          </button>
          <button
            type="button"
            onClick={() => onNavigate('trade')}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#0F1623]/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.overview.placePracticeTrade}
          </button>
        </div>
      </div>

      {/* Unified 4-Metric KPI Strip */}
      <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200/75 dark:bg-slate-800/75">
          <div className="bg-white dark:bg-[#0F1623] p-5 space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.totalEquity}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums" dir="ltr">
              {formatUsd(analytics.totalEquity)}
            </div>
            <div
              className={`font-mono text-xs font-medium tabular-nums ${
                analytics.totalReturnPct >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              <span dir="ltr">
                {analytics.totalReturnPct >= 0 ? '▲ +' : '▼ '}
                {analytics.totalReturnPct.toFixed(2)}%
              </span>{' '}
              <span className="font-sans text-slate-400 dark:text-slate-500">{t.overview.overallReturn}</span>
            </div>
            {beginnerHints && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">{t.overview.hintEquity}</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#0F1623] p-5 space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.availableCash}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums" dir="ltr">
              {formatUsd(analytics.cash)}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="font-sans">{t.overview.inActiveTrades}</span>{' '}
              <span dir="ltr">{formatUsd(analytics.marginUsed)}</span>
            </div>
            {beginnerHints && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">{t.overview.hintCash}</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#0F1623] p-5 space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.realizedLivePnl}</span>
            <div
              dir="ltr"
              className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                netLivePnl >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatUsd(netLivePnl, true)}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {t.overview.closedLabel} <span dir="ltr">{formatUsd(analytics.realizedPnl, true)}</span> · {t.overview.openLabel}{' '}
              <span dir="ltr">{formatUsd(analytics.unrealizedPnl, true)}</span>
            </div>
            {beginnerHints && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">{t.overview.hintPnl}</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#0F1623] p-5 space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.winRatePf}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums" dir="ltr">
              {analytics.totalTrades > 0 ? `${analytics.winRatePct.toFixed(1)}%` : '—'}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums" dir="ltr">
              {analytics.winningTrades}W / {analytics.losingTrades}L · PF{' '}
              {analytics.totalTrades > 0 ? analytics.profitFactor.toFixed(2) : '—'}
            </div>
            {beginnerHints && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">{t.overview.hintWinRate}</p>
            )}
          </div>
        </div>
      </section>

      {/* Primary Focal Row: Equity Curve + Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                {t.overview.equityCurveTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.overview.startingCapital} <span dir="ltr">{formatUsd(analytics.initialCapital)}</span> ({t.overview.dashedRef})
              </p>
            </div>
          </div>

          <EquityCurveChart points={analytics.equitySeries} initialCapital={analytics.initialCapital} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgWin}</span>
              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums" dir="ltr">
                {analytics.winningTrades > 0 ? formatUsd(analytics.avgWin, true) : '—'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgLoss}</span>
              <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums" dir="ltr">
                {analytics.losingTrades > 0 ? `-${formatUsd(analytics.avgLoss)}` : '—'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.maxDrawdown}</span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {analytics.maxDrawdownPct.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgResultTrade}</span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.expectancy, true) : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] p-5 flex flex-col justify-between gap-4">
          <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
            {t.overview.strategyBreakdown}
          </h2>

          <div className="space-y-1 text-xs flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-600 dark:text-slate-300">
                {t.overview.cryptoTrades} ({analytics.cryptoCount})
              </span>
              <span
                dir="ltr"
                className={`font-mono font-semibold tabular-nums ${
                  analytics.cryptoPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatUsd(analytics.cryptoPnl, true)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-600 dark:text-slate-300">
                {t.overview.forexTrades} ({analytics.forexCount})
              </span>
              <span
                dir="ltr"
                className={`font-mono font-semibold tabular-nums ${
                  analytics.forexPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatUsd(analytics.forexPnl, true)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.buyWinRate}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {analytics.totalTrades > 0 ? `${analytics.longWinRate.toFixed(0)}%` : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.sellWinRate}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {analytics.totalTrades > 0 ? `${analytics.shortWinRate.toFixed(0)}%` : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.bestTrade}</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.bestTrade, true) : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.worstTrade}</span>
              <span className="font-mono font-semibold text-red-600 dark:text-red-400 tabular-nums" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.worstTrade, true) : '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Daily Missions Bar */}
      <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white truncate">
              {t.overview.missionsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums" dir="ltr">
              {t.overview.missionsLevel} <strong className="text-slate-900 dark:text-white">{missions.level}</strong>
              {' · '}
              <strong className="text-blue-600 dark:text-blue-400">{missions.totalXp} {t.overview.missionsXp}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums">
              <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
              <strong className="text-slate-900 dark:text-white">{streakDays}</strong> {streakWord}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums" dir="ltr">
              <strong className={missions.bonusClaimedToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                {completedTodayCount}/4
              </strong>
            </span>
          </div>
        </div>

        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completedTodayCount === 4 ? 'bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'
            }`}
            style={{width: `${missionsPct}%`}}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-slate-200/75 dark:bg-slate-800/75">
          {dailyMissionCards.map((item) => {
            const Icon = item.icon;
            const done = missions.completedIds.includes(item.id);
            const reward = MISSION_XP_REWARDS[item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.targetTab)}
                className={`text-start p-4 transition-colors flex flex-col justify-between gap-2.5 cursor-pointer ${
                  done
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/15'
                    : 'bg-white dark:bg-[#0F1623] hover:bg-slate-50/90 dark:hover:bg-slate-800/35'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold tabular-nums ${
                        done ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`}
                      dir="ltr"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      +{reward} {t.overview.missionsXp}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                  </div>
                  <p className="font-display text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium">
                  {done ? (
                    <span className="text-emerald-600 dark:text-emerald-400">{t.overview.missionsCompleted}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <span>{item.cta}</span>
                      <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Simplified Quick Start Checklist (shown only until started) */}
      {(completedLessons === 0 || isBrandNew || activeAlertsCount === 0) && (
        <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              {t.overview.quickStartTitle}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.overview.quickStartSub}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200/75 dark:bg-slate-800/75">
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="text-start bg-white dark:bg-[#0F1623] hover:bg-slate-50 dark:hover:bg-slate-800/35 p-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step1}</span>
                <span className={completedLessons > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {completedLessons > 0 ? `${completedLessons} ${t.overview.step1Done}` : t.overview.step1Start}
                </span>
              </div>
              <p className="font-display text-xs font-semibold text-slate-900 dark:text-white mt-1">
                {t.overview.step1Title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {t.academy.resumeStepPrefix} {String(currentCourseNumber).padStart(2, '0')} · {currentCourseTitle}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('trade')}
              className="text-start bg-white dark:bg-[#0F1623] hover:bg-slate-50 dark:hover:bg-slate-800/35 p-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step2}</span>
                <span className={!isBrandNew ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {!isBrandNew ? t.overview.step2Active : t.overview.step2Cash}
                </span>
              </div>
              <p className="font-display text-xs font-semibold text-slate-900 dark:text-white mt-1">
                {t.overview.step2Title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {t.overview.step2Desc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('alerts')}
              className="text-start bg-white dark:bg-[#0F1623] hover:bg-slate-50 dark:hover:bg-slate-800/35 p-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step3}</span>
                <span className={activeAlertsCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {activeAlertsCount > 0 ? `${activeAlertsCount} ${t.overview.step3Active}` : t.overview.step3Ready}
                </span>
              </div>
              <p className="font-display text-xs font-semibold text-slate-900 dark:text-white mt-1">
                {t.overview.step3Title}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {t.overview.step3Desc}
              </p>
            </button>
          </div>
        </section>
      )}

      {/* Milestone Badges & Achievements */}
      <AchievementsSection
        achievements={achievements}
        unlockedCount={achievementsUnlockedCount}
        totalCount={achievementsTotalCount}
      />

      {positions.length > 0 && (
        <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              {t.overview.activePositions} ({positions.length})
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('trade')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {t.overview.openLiveChart} {dir === 'rtl' ? '←' : '→'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-start text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-2 font-medium text-start">{t.overview.market}</th>
                  <th className="pb-2 font-medium text-start">{t.overview.side}</th>
                  <th className="pb-2 font-medium text-end">{t.overview.size}</th>
                  <th className="pb-2 font-medium text-end">{t.overview.entryPrice}</th>
                  <th className="pb-2 font-medium text-end">{t.overview.livePrice}</th>
                  <th className="pb-2 font-medium text-end">{t.overview.unrealizedPnl}</th>
                  <th className="pb-2 font-medium text-end">{t.overview.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {positions.map((pos) => {
                  const {unrealizedPnl, markPrice, pnlPct} = calcPositionPnl(pos, quotes[pos.symbol]);
                  return (
                    <tr key={pos.id}>
                      <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">{pos.symbol}</td>
                      <td className={`py-2.5 font-sans font-medium ${pos.side === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {pos.side === 'buy' ? t.common.buy : t.common.sell}
                      </td>
                      <td className="py-2.5 text-end tabular-nums" dir="ltr">{formatUsd(pos.notionalUsd)}</td>
                      <td className="py-2.5 text-end tabular-nums" dir="ltr">{formatPrice(pos.entryPrice, pos.symbol)}</td>
                      <td className="py-2.5 text-end tabular-nums" dir="ltr">{formatPrice(markPrice, pos.symbol)}</td>
                      <td dir="ltr" className={`py-2.5 text-end font-semibold tabular-nums ${unrealizedPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatUsd(unrealizedPnl, true)} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                      </td>
                      <td className="py-2.5 text-end">
                        <button
                          type="button"
                          onClick={() => onClosePosition(pos.id)}
                          className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 font-sans text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {t.overview.closeBtn}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Historical Trade Logs */}
      <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              {t.overview.tradeLogsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.overview.tradeLogsSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.overview.filterSymbol}
                className="ps-8 pe-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0F17] text-xs text-slate-900 dark:text-white w-36"
              />
            </div>

            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#0B0F17]">
              {([
                {id: 'all' as const, label: t.common.all},
                {id: 'crypto' as const, label: t.common.crypto},
                {id: 'forex' as const, label: t.common.forex},
              ]).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAssetFilter(m.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    assetFilter === m.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#0B0F17]">
              {([
                {id: 'all' as const, label: t.common.all},
                {id: 'buy' as const, label: t.common.buy},
                {id: 'sell' as const, label: t.common.sell},
              ]).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSideFilter(s.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    sideFilter === s.id
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {filteredLogs.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.overview.downloadCsv}
              </button>
            )}
          </div>
        </div>

        {tradeLogs.length === 0 ? (
          <div className="py-10 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {t.overview.emptyLogsTitle}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t.overview.emptyLogsDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('trade')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
              >
                {t.overview.goToTradingDesk}
                <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onLoadSampleHistory}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                {t.overview.loadSampleTrades}
              </button>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-8 text-center">
            {t.overview.noMatchingTrades}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-start text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-2.5 font-medium text-start">{t.overview.colClosed}</th>
                  <th className="pb-2.5 font-medium text-start">{t.overview.colMarket}</th>
                  <th className="pb-2.5 font-medium text-start">{t.overview.colDirection}</th>
                  <th className="pb-2.5 font-medium text-end">{t.overview.colTradeSize}</th>
                  <th className="pb-2.5 font-medium text-end">{t.overview.colEntry}</th>
                  <th className="pb-2.5 font-medium text-end">{t.overview.colExit}</th>
                  <th className="pb-2.5 font-medium text-start">{t.overview.colExitType}</th>
                  <th className="pb-2.5 font-medium text-end">{t.overview.colNetPnl}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredLogs.map((log) => {
                  const isWin = log.realizedPnl >= 0;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap tabular-nums" dir="ltr">
                        {new Date(log.closedAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <span dir="ltr">{log.symbol}</span>{' '}
                        <span className="font-normal text-slate-400">
                          · {log.assetClass === 'crypto' ? t.common.crypto : t.common.forex}
                        </span>
                      </td>
                      <td
                        className={`py-3 font-medium whitespace-nowrap ${
                          log.side === 'buy'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {log.side === 'buy' ? t.common.buy : t.common.sell}{' '}
                        {log.leverage > 1 ? <span dir="ltr">{log.leverage}x</span> : ''}
                      </td>
                      <td className="py-3 text-end font-mono text-slate-700 dark:text-slate-200 tabular-nums" dir="ltr">
                        {formatUsd(log.notionalUsd)}
                      </td>
                      <td className="py-3 text-end font-mono text-slate-600 dark:text-slate-300 tabular-nums" dir="ltr">
                        {formatPrice(log.entryPrice, log.symbol)}
                      </td>
                      <td className="py-3 text-end font-mono text-slate-600 dark:text-slate-300 tabular-nums" dir="ltr">
                        {formatPrice(log.exitPrice, log.symbol)}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {closeReasonLabel(log.closeReason)}
                      </td>
                      <td
                        dir="ltr"
                        className={`py-3 text-end font-mono font-semibold whitespace-nowrap tabular-nums ${
                          isWin ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatUsd(log.realizedPnl, true)} ({log.returnPct >= 0 ? '+' : ''}
                        {log.returnPct.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
