import type {
  ScenarioGradeCriterion,
  ScenarioGradeReport,
  ScenarioId,
  ScenarioTradeRecord,
} from '../types/trading';

interface GradeScenarioInput {
  scenarioId: ScenarioId;
  startingEquity: number;
  endingEquity: number;
  maxDrawdownPct: number;
  trades: ScenarioTradeRecord[];
}

export function gradeScenarioRun(input: GradeScenarioInput): ScenarioGradeReport {
  const {scenarioId, startingEquity, endingEquity, maxDrawdownPct, trades} = input;
  const tradesCount = trades.length;
  const liquidatedCount = trades.filter((tr) => tr.closeReason === 'liquidation').length;

  const netPnl = Number((endingEquity - startingEquity).toFixed(2));
  const netReturnPct = startingEquity > 0 ? Number(((netPnl / startingEquity) * 100).toFixed(2)) : 0;

  if (tradesCount === 0) {
    const emptyCriteria: ScenarioGradeCriterion[] = [
      {
        id: 'stop-loss',
        score: 0,
        maxScore: 30,
        metricValue: '0 / 0',
        status: 'weak',
        feedbackKey: 'fbNoTrades',
      },
      {
        id: 'sizing-leverage',
        score: 0,
        maxScore: 25,
        metricValue: '0x',
        status: 'weak',
        feedbackKey: 'fbNoTrades',
      },
      {
        id: 'risk-reward',
        score: 0,
        maxScore: 25,
        metricValue: '—',
        status: 'weak',
        feedbackKey: 'fbNoTrades',
      },
      {
        id: 'drawdown',
        score: 0,
        maxScore: 20,
        metricValue: '0.0%',
        status: 'weak',
        feedbackKey: 'fbNoTrades',
      },
    ];
    return {
      scenarioId,
      totalScore: 0,
      grade: 'F',
      startingEquity,
      endingEquity,
      netPnl,
      netReturnPct,
      maxDrawdownPct,
      tradesCount: 0,
      liquidatedCount: 0,
      criteria: emptyCriteria,
      trades: [],
    };
  }

  // 1. Stop-Loss Discipline (max 30)
  const slCount = trades.filter((tr) => tr.stopLoss !== undefined).length;
  const slRatio = slCount / tradesCount;
  const slScore = Math.round(slRatio * 30);
  const slStatus: ScenarioGradeCriterion['status'] =
    slRatio === 1 ? 'strong' : slRatio >= 0.6 ? 'fair' : 'weak';
  const slFeedbackKey =
    slStatus === 'strong' ? 'fbSlStrong' : slStatus === 'fair' ? 'fbSlFair' : 'fbSlWeak';

  // 2. Sizing & Leverage Control (max 25)
  const avgLeverage = trades.reduce((sum, tr) => sum + tr.leverage, 0) / tradesCount;
  const maxMarginRatio = Math.max(
    ...trades.map((tr) => (startingEquity > 0 ? tr.marginUsd / startingEquity : 0))
  );
  let sizingScore = 25;
  if (liquidatedCount > 0) {
    sizingScore = Math.max(0, 8 - liquidatedCount * 4);
  } else {
    if (avgLeverage > 10) sizingScore -= 14;
    else if (avgLeverage > 5) sizingScore -= 9;
    else if (avgLeverage > 2) sizingScore -= 4;

    if (maxMarginRatio > 0.45) sizingScore -= 10;
    else if (maxMarginRatio > 0.25) sizingScore -= 5;
  }
  sizingScore = Math.max(0, Math.min(25, sizingScore));
  const sizingStatus: ScenarioGradeCriterion['status'] =
    liquidatedCount === 0 && sizingScore >= 20
      ? 'strong'
      : liquidatedCount === 0 && sizingScore >= 13
        ? 'fair'
        : 'weak';
  const sizingFeedbackKey =
    liquidatedCount > 0
      ? 'fbSizingLiquidated'
      : sizingStatus === 'strong'
        ? 'fbSizingStrong'
        : sizingStatus === 'fair'
          ? 'fbSizingFair'
          : 'fbSizingWeak';

  // 3. Risk-to-Reward Planning (max 25)
  const rrTrades = trades.filter((tr) => tr.plannedRiskReward !== null && tr.plannedRiskReward > 0);
  const avgRr =
    rrTrades.length > 0
      ? rrTrades.reduce((sum, tr) => sum + (tr.plannedRiskReward ?? 0), 0) / rrTrades.length
      : 0;
  let rrScore = 0;
  if (rrTrades.length > 0) {
    const coverageRatio = rrTrades.length / tradesCount;
    const qualityRatio = Math.min(1, avgRr / 1.8);
    rrScore = Math.round(coverageRatio * 12 + qualityRatio * coverageRatio * 13);
  }
  const rrStatus: ScenarioGradeCriterion['status'] =
    rrScore >= 20 ? 'strong' : rrScore >= 12 ? 'fair' : 'weak';
  const rrFeedbackKey =
    rrStatus === 'strong' ? 'fbRrStrong' : rrStatus === 'fair' ? 'fbRrFair' : 'fbRrWeak';

  // 4. Drawdown Preservation (max 20)
  let ddScore = 20;
  if (maxDrawdownPct > 25) ddScore = 2;
  else if (maxDrawdownPct > 15) ddScore = 7;
  else if (maxDrawdownPct > 10) ddScore = 11;
  else if (maxDrawdownPct > 5) ddScore = 15;
  else if (maxDrawdownPct > 2.5) ddScore = 18;
  const ddStatus: ScenarioGradeCriterion['status'] =
    ddScore >= 16 ? 'strong' : ddScore >= 10 ? 'fair' : 'weak';
  const ddFeedbackKey =
    ddStatus === 'strong' ? 'fbDdStrong' : ddStatus === 'fair' ? 'fbDdFair' : 'fbDdWeak';

  const totalScore = Math.max(0, Math.min(100, slScore + sizingScore + rrScore + ddScore));
  const grade: ScenarioGradeReport['grade'] =
    totalScore >= 85
      ? 'A'
      : totalScore >= 72
        ? 'B'
        : totalScore >= 58
          ? 'C'
          : totalScore >= 42
            ? 'D'
            : 'F';

  const criteria: ScenarioGradeCriterion[] = [
    {
      id: 'stop-loss',
      score: slScore,
      maxScore: 30,
      metricValue: `${slCount} / ${tradesCount}`,
      status: slStatus,
      feedbackKey: slFeedbackKey,
    },
    {
      id: 'sizing-leverage',
      score: sizingScore,
      maxScore: 25,
      metricValue: `${avgLeverage.toFixed(1)}x · ${(maxMarginRatio * 100).toFixed(0)}%`,
      status: sizingStatus,
      feedbackKey: sizingFeedbackKey,
    },
    {
      id: 'risk-reward',
      score: rrScore,
      maxScore: 25,
      metricValue: rrTrades.length > 0 ? `1 : ${avgRr.toFixed(1)}` : '—',
      status: rrStatus,
      feedbackKey: rrFeedbackKey,
    },
    {
      id: 'drawdown',
      score: ddScore,
      maxScore: 20,
      metricValue: `-${maxDrawdownPct.toFixed(1)}%`,
      status: ddStatus,
      feedbackKey: ddFeedbackKey,
    },
  ];

  return {
    scenarioId,
    totalScore,
    grade,
    startingEquity,
    endingEquity,
    netPnl,
    netReturnPct,
    maxDrawdownPct,
    tradesCount,
    liquidatedCount,
    criteria,
    trades,
  };
}
