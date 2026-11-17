import React, {useEffect} from 'react';
import {ArrowRight, Award, RotateCcw, ShieldCheck, X} from 'lucide-react';
import {formatPrice, formatUsd} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {ScenarioGradeCriterion, ScenarioGradeReport, ScenarioTradeRecord} from '../types/trading';

interface ScenarioReportModalProps {
  report: ScenarioGradeReport | null;
  onClose: () => void;
  onReplay: () => void;
  onNextScenario: () => void;
  onExitToLive: () => void;
}

export const ScenarioReportModal: React.FC<ScenarioReportModalProps> = ({
  report,
  onClose,
  onReplay,
  onNextScenario,
  onExitToLive,
}) => {
  const {t, dir} = useLanguage();

  useEffect(() => {
    if (!report) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [report, onClose]);

  if (!report) return null;

  const scenarioText = t.scenario.scenarios[report.scenarioId];

  const gradeColorClass =
    report.grade === 'A'
      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : report.grade === 'B'
        ? 'text-blue-600 dark:text-blue-400 border-blue-500/40 bg-blue-500/10'
        : report.grade === 'C'
          ? 'text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10'
          : 'text-red-600 dark:text-red-400 border-red-500/40 bg-red-500/10';

  const verdictText =
    report.grade === 'A'
      ? t.scenario.verdictA
      : report.grade === 'B'
        ? t.scenario.verdictB
        : report.grade === 'C'
          ? t.scenario.verdictC
          : report.grade === 'D'
            ? t.scenario.verdictD
            : t.scenario.verdictF;

  const getCriterionTitle = (id: ScenarioGradeCriterion['id']) => {
    switch (id) {
      case 'stop-loss':
        return t.scenario.criterionStopLoss;
      case 'sizing-leverage':
        return t.scenario.criterionSizing;
      case 'risk-reward':
        return t.scenario.criterionRiskReward;
      case 'drawdown':
        return t.scenario.criterionDrawdown;
    }
  };

  const getStatusLabel = (status: ScenarioGradeCriterion['status']) => {
    if (status === 'strong') return t.scenario.statusStrong;
    if (status === 'fair') return t.scenario.statusFair;
    return t.scenario.statusWeak;
  };

  const getFeedbackText = (key: string) => {
    const scenarioBag = t.scenario as unknown as Record<string, unknown>;
    const val = scenarioBag[key];
    return typeof val === 'string' ? val : key;
  };

  const getCloseReasonLabel = (reason?: ScenarioTradeRecord['closeReason']) => {
    switch (reason) {
      case 'stop-loss':
        return t.scenario.reasonSl;
      case 'take-profit':
        return t.scenario.reasonTp;
      case 'liquidation':
        return t.scenario.reasonLiq;
      case 'end-of-scenario':
        return t.scenario.reasonEos;
      default:
        return t.scenario.reasonManual;
    }
  };

  const isPositiveNet = report.netPnl >= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-label={t.scenario.reportTitle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Award className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 text-start">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white truncate">
                {t.scenario.reportTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {scenarioText.title} · {scenarioText.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Top Score + Account Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            <div className={`sm:col-span-4 rounded-xl border p-4 flex flex-col items-center justify-center text-center ${gradeColorClass}`}>
              <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85">
                {t.scenario.overallScore}
              </span>
              <div className="font-display text-4xl font-extrabold mt-1 leading-none">
                {report.grade}
              </div>
              <div className="font-mono tabular-nums text-xs font-semibold mt-2" dir="ltr">
                {report.totalScore} / 100
              </div>
            </div>

            <div className="sm:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] p-4 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-3 gap-3 text-start">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.scenario.startingEquity}
                  </div>
                  <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                    {formatUsd(report.startingEquity)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.scenario.endingEquity}
                  </div>
                  <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                    {formatUsd(report.endingEquity)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.scenario.netReturn}
                  </div>
                  <div
                    dir="ltr"
                    className={`font-mono tabular-nums text-sm font-semibold mt-0.5 ${
                      isPositiveNet ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatUsd(report.netPnl, true)} ({report.netReturnPct >= 0 ? '+' : ''}
                    {report.netReturnPct.toFixed(2)}%)
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 text-start">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>{verdictText}</span>
              </div>
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div className="space-y-2.5">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-start">
              {t.scenario.rubricTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.criteria.map((c) => {
                const pct = c.maxScore > 0 ? Math.round((c.score / c.maxScore) * 100) : 0;
                const barClass =
                  c.status === 'strong'
                    ? 'bg-emerald-500'
                    : c.status === 'fair'
                      ? 'bg-amber-500'
                      : 'bg-red-500';
                const statusClass =
                  c.status === 'strong'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : c.status === 'fair'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400';

                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16]/70 p-3.5 space-y-2 text-start"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {getCriterionTitle(c.id)}
                      </span>
                      <span className={`text-[11px] font-semibold ${statusClass}`}>
                        {getStatusLabel(c.status)}
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden" dir="ltr">
                      <div className={`h-full ${barClass} transition-all`} style={{width: `${pct}%`}} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400" dir="ltr">
                      <span>{c.metricValue}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {c.score} / {c.maxScore}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {getFeedbackText(c.feedbackKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Log */}
          {report.trades.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-start">
                {t.scenario.tradesLogTitle} ({report.tradesCount})
              </h3>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-[#090D16] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-3 py-2 font-medium text-start">{t.overview.side}</th>
                      <th className="px-3 py-2 font-medium text-end">{t.overview.colEntry}</th>
                      <th className="px-3 py-2 font-medium text-end">{t.scenario.colExit}</th>
                      <th className="px-3 py-2 font-medium text-start">{t.scenario.colSlTp}</th>
                      <th className="px-3 py-2 font-medium text-start">{t.scenario.colReason}</th>
                      <th className="px-3 py-2 font-medium text-end">{t.scenario.colPnl}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono tabular-nums">
                    {report.trades.map((tr) => {
                      const pnl = tr.realizedPnl ?? 0;
                      return (
                        <tr key={tr.id}>
                          <td
                            className={`px-3 py-2 font-sans font-semibold ${
                              tr.side === 'buy'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {tr.side === 'buy' ? t.common.buy : t.common.sell} {tr.leverage > 1 ? `${tr.leverage}x` : ''}
                          </td>
                          <td className="px-3 py-2 text-end" dir="ltr">
                            {formatPrice(tr.entryPrice, tr.symbol)}
                          </td>
                          <td className="px-3 py-2 text-end" dir="ltr">
                            {tr.exitPrice !== undefined ? formatPrice(tr.exitPrice, tr.symbol) : '—'}
                          </td>
                          <td className="px-3 py-2 text-start text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">
                            {tr.stopLoss ? `SL ${formatPrice(tr.stopLoss, tr.symbol)}` : 'No SL'}
                            {tr.takeProfit ? ` / TP ${formatPrice(tr.takeProfit, tr.symbol)}` : ''}
                          </td>
                          <td className="px-3 py-2 font-sans text-start text-slate-600 dark:text-slate-300">
                            {getCloseReasonLabel(tr.closeReason)}
                          </td>
                          <td
                            dir="ltr"
                            className={`px-3 py-2 text-end font-semibold ${
                              pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {formatUsd(pnl, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExitToLive}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.scenario.returnLiveBtn}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1623] text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.scenario.replayScenarioBtn}
            </button>
            <button
              type="button"
              onClick={onNextScenario}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.scenario.nextScenarioBtn}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
