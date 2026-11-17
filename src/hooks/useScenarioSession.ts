import {useCallback, useEffect, useMemo, useState} from 'react';
import {INSTRUMENT_MAP} from '../data/instruments';
import {HISTORICAL_SCENARIOS} from '../data/scenarios';
import {useLanguage} from '../i18n/LanguageContext';
import type {
  Candle,
  MarketQuote,
  OrderSide,
  OrderType,
  PendingOrder,
  Position,
  ScenarioCandleEvent,
  ScenarioGradeReport,
  ScenarioId,
  ScenarioTradeRecord,
  TradeLog,
} from '../types/trading';
import {gradeScenarioRun} from '../utils/scenarioGrader';
import {calcPositionPnl} from './usePaperAccount';

const BEST_GRADES_KEY = 'meridian_scenario_best_grades_v1';

type BestGradeEntry = {
  grade: ScenarioGradeReport['grade'];
  score: number;
};

function loadBestGrades(): Partial<Record<ScenarioId, BestGradeEntry>> {
  try {
    const raw = window.localStorage.getItem(BEST_GRADES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<Record<ScenarioId, BestGradeEntry>>;
  } catch {
    return {};
  }
}

function buildQuoteFromCandle(symbol: string, candle: Candle, prevOpen: number): MarketQuote {
  const inst = INSTRUMENT_MAP.get(symbol);
  const spreadPct = (inst?.typicalSpreadPct ?? 0.0005) * 1.5;
  const halfSpread = candle.close * (spreadPct / 2);
  const change24hPct = prevOpen > 0 ? ((candle.close - prevOpen) / prevOpen) * 100 : 0;

  return {
    symbol,
    price: candle.close,
    bid: Number((candle.close - halfSpread).toFixed(inst?.decimals ?? 4)),
    ask: Number((candle.close + halfSpread).toFixed(inst?.decimals ?? 4)),
    open24h: prevOpen,
    high24h: candle.high,
    low24h: candle.low,
    change24hPct,
    volume24h: candle.volume,
    source: 'live-feed',
    updatedAt: candle.time,
  };
}

interface ScenarioRunState {
  cash: number;
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeLogs: TradeLog[];
  tradeRecords: ScenarioTradeRecord[];
  peakEquity: number;
  maxDrawdownPct: number;
}

function createInitialRunState(initialCapital: number): ScenarioRunState {
  return {
    cash: initialCapital,
    positions: [],
    pendingOrders: [],
    tradeLogs: [],
    tradeRecords: [],
    peakEquity: initialCapital,
    maxDrawdownPct: 0,
  };
}

export function useScenarioSession() {
  const {t} = useLanguage();
  const [scenarioId, setScenarioId] = useState<ScenarioId>(HISTORICAL_SCENARIOS[0].id);
  const scenario = useMemo(
    () => HISTORICAL_SCENARIOS.find((s) => s.id === scenarioId) ?? HISTORICAL_SCENARIOS[0],
    [scenarioId]
  );

  const [barCount, setBarCount] = useState<number>(scenario.initialVisibleBars);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [runState, setRunState] = useState<ScenarioRunState>(() =>
    createInitialRunState(scenario.initialCapital)
  );
  const [report, setReport] = useState<ScenarioGradeReport | null>(null);
  const [bestGrades, setBestGrades] = useState<Partial<Record<ScenarioId, BestGradeEntry>>>(
    loadBestGrades
  );

  const visibleCandles = useMemo(
    () => scenario.candles.slice(0, barCount),
    [scenario.candles, barCount]
  );

  const latestCandle = visibleCandles[visibleCandles.length - 1] ?? scenario.candles[0];
  const scenarioQuote = useMemo(
    () => buildQuoteFromCandle(scenario.symbol, latestCandle, scenario.candles[0].open),
    [scenario.symbol, latestCandle, scenario.candles]
  );

  const isAtEnd = barCount >= scenario.candles.length;
  const replayStep = Math.max(0, barCount - scenario.initialVisibleBars);
  const replayTotalSteps = Math.max(1, scenario.candles.length - scenario.initialVisibleBars);

  const activeEvent: ScenarioCandleEvent | null = useMemo(() => {
    const currentIdx = barCount - 1;
    let found: ScenarioCandleEvent | null = null;
    for (const ev of scenario.events) {
      if (currentIdx >= ev.barIndex) found = ev;
    }
    return found;
  }, [scenario.events, barCount]);

  const equity = useMemo(() => {
    const unrealized = runState.positions.reduce(
      (sum, pos) => sum + calcPositionPnl(pos, scenarioQuote).unrealizedPnl,
      0
    );
    const lockedMargin =
      runState.positions.reduce((sum, pos) => sum + pos.marginUsd, 0) +
      runState.pendingOrders.reduce((sum, ord) => sum + ord.notionalUsd / ord.leverage, 0);
    return Number((runState.cash + lockedMargin + unrealized).toFixed(2));
  }, [runState.cash, runState.positions, runState.pendingOrders, scenarioQuote]);

  const resetToScenario = useCallback((targetScenarioId: ScenarioId) => {
    const target = HISTORICAL_SCENARIOS.find((s) => s.id === targetScenarioId) ?? HISTORICAL_SCENARIOS[0];
    setIsPlaying(false);
    setScenarioId(target.id);
    setBarCount(target.initialVisibleBars);
    setRunState(createInitialRunState(target.initialCapital));
    setReport(null);
  }, []);

  const selectScenario = useCallback(
    (id: ScenarioId) => {
      resetToScenario(id);
    },
    [resetToScenario]
  );

  const resetScenario = useCallback(() => {
    resetToScenario(scenario.id);
  }, [resetToScenario, scenario.id]);

  const processBarUpdate = useCallback(
    (nextBarCount: number) => {
      const candle = scenario.candles[nextBarCount - 1];
      if (!candle) return;
      const barIndex = nextBarCount - 1;
      const nextQuote = buildQuoteFromCandle(scenario.symbol, candle, scenario.candles[0].open);

      setRunState((prev) => {
        let nextCash = prev.cash;
        const nextPositions: Position[] = [];
        const nextPending: PendingOrder[] = [];
        const nextLogs = [...prev.tradeLogs];
        const nextRecords = prev.tradeRecords.map((r) => ({...r}));

        // 1. Check SL/TP/Liquidation against candle range
        for (const pos of prev.positions) {
          let closeReason: ScenarioTradeRecord['closeReason'] | undefined;
          let exitPrice = candle.close;

          if (pos.stopLoss !== undefined) {
            if (pos.side === 'buy' && candle.low <= pos.stopLoss) {
              closeReason = 'stop-loss';
              exitPrice = Math.min(candle.open, pos.stopLoss);
            } else if (pos.side === 'sell' && candle.high >= pos.stopLoss) {
              closeReason = 'stop-loss';
              exitPrice = Math.max(candle.open, pos.stopLoss);
            }
          }

          if (!closeReason && pos.takeProfit !== undefined) {
            if (pos.side === 'buy' && candle.high >= pos.takeProfit) {
              closeReason = 'take-profit';
              exitPrice = Math.max(candle.open, pos.takeProfit);
            } else if (pos.side === 'sell' && candle.low <= pos.takeProfit) {
              closeReason = 'take-profit';
              exitPrice = Math.min(candle.open, pos.takeProfit);
            }
          }

          const worstPrice = pos.side === 'buy' ? candle.low : candle.high;
          const worstDiff = pos.side === 'buy' ? worstPrice - pos.entryPrice : pos.entryPrice - worstPrice;
          const worstGross = worstDiff * pos.quantity;
          if (!closeReason && pos.leverage > 1 && worstGross <= -pos.marginUsd * 0.9) {
            closeReason = 'liquidation';
            exitPrice = worstPrice;
          }

          if (closeReason) {
            const diff = pos.side === 'buy' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
            const grossPnl = diff * pos.quantity;
            const feeRate = pos.assetClass === 'crypto' ? 0.0005 : 0.00008;
            const exitFee = exitPrice * pos.quantity * feeRate;
            const realizedPnl = Number((grossPnl - exitFee).toFixed(2));
            nextCash = Number((nextCash + pos.marginUsd + realizedPnl).toFixed(2));
            const returnPct = pos.marginUsd > 0 ? Number(((realizedPnl / pos.marginUsd) * 100).toFixed(2)) : 0;

            const logCloseReason: TradeLog['closeReason'] =
              closeReason === 'stop-loss' || closeReason === 'take-profit' || closeReason === 'liquidation'
                ? closeReason
                : 'manual';

            nextLogs.unshift({
              id: `sclog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              symbol: pos.symbol,
              assetClass: pos.assetClass,
              side: pos.side,
              quantity: pos.quantity,
              notionalUsd: pos.notionalUsd,
              leverage: pos.leverage,
              entryPrice: pos.entryPrice,
              exitPrice,
              realizedPnl,
              returnPct,
              closeReason: logCloseReason,
              openedAt: pos.openedAt,
              closedAt: candle.time,
              feeUsd: Number(exitFee.toFixed(2)),
            });

            const rec = nextRecords.find((r) => r.id === pos.id);
            if (rec) {
              rec.closedBar = barIndex;
              rec.exitPrice = exitPrice;
              rec.realizedPnl = realizedPnl;
              rec.closeReason = closeReason;
            }
          } else {
            nextPositions.push(pos);
          }
        }

        // 2. Check Limit orders against candle range
        for (const order of prev.pendingOrders) {
          const filled =
            (order.side === 'buy' && candle.low <= order.limitPrice) ||
            (order.side === 'sell' && candle.high >= order.limitPrice);

          if (filled) {
            const fillPrice = order.limitPrice;
            const marginUsd = order.notionalUsd / order.leverage;
            const quantity = order.notionalUsd / fillPrice;
            const posId = `scpos-${barIndex}-${Math.random().toString(36).slice(2, 6)}`;
            nextPositions.unshift({
              id: posId,
              symbol: order.symbol,
              assetClass: order.assetClass,
              side: order.side,
              quantity,
              notionalUsd: order.notionalUsd,
              marginUsd,
              leverage: order.leverage,
              entryPrice: fillPrice,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
              openedAt: candle.time,
            });

            let plannedRr: number | null = null;
            if (order.stopLoss && order.takeProfit) {
              const risk = Math.abs(fillPrice - order.stopLoss);
              const reward = Math.abs(order.takeProfit - fillPrice);
              if (risk > 0 && reward > 0) plannedRr = Number((reward / risk).toFixed(2));
            }
            nextRecords.push({
              id: posId,
              symbol: order.symbol,
              side: order.side,
              orderType: 'limit',
              notionalUsd: order.notionalUsd,
              marginUsd,
              leverage: order.leverage,
              entryPrice: fillPrice,
              stopLoss: order.stopLoss,
              takeProfit: order.takeProfit,
              openedBar: barIndex,
              plannedRiskReward: plannedRr,
            });
          } else {
            nextPending.push(order);
          }
        }

        // 3. Recompute equity & peak drawdown
        const unrealized = nextPositions.reduce(
          (sum, pos) => sum + calcPositionPnl(pos, nextQuote).unrealizedPnl,
          0
        );
        const locked =
          nextPositions.reduce((sum, pos) => sum + pos.marginUsd, 0) +
          nextPending.reduce((sum, ord) => sum + ord.notionalUsd / ord.leverage, 0);
        const curEquity = nextCash + locked + unrealized;
        const peakEquity = Math.max(prev.peakEquity, curEquity);
        const dd = peakEquity > 0 ? ((peakEquity - curEquity) / peakEquity) * 100 : 0;
        const maxDrawdownPct = Math.max(prev.maxDrawdownPct, dd);

        return {
          cash: nextCash,
          positions: nextPositions,
          pendingOrders: nextPending,
          tradeLogs: nextLogs,
          tradeRecords: nextRecords,
          peakEquity,
          maxDrawdownPct,
        };
      });
    },
    [scenario.candles, scenario.symbol]
  );

  const stepBar = useCallback(() => {
    setBarCount((prev) => {
      if (prev >= scenario.candles.length) {
        setIsPlaying(false);
        return prev;
      }
      const next = prev + 1;
      processBarUpdate(next);
      if (next >= scenario.candles.length) {
        setIsPlaying(false);
      }
      return next;
    });
  }, [scenario.candles.length, processBarUpdate]);

  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = speed === 4 ? 320 : speed === 2 ? 620 : 1150;
    const timer = window.setInterval(() => {
      stepBar();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed, stepBar]);

  const placeScenarioOrder = useCallback(
    (params: {
      symbol: string;
      side: OrderSide;
      orderType: OrderType;
      notionalUsd: number;
      leverage: number;
      limitPrice?: number;
      stopLoss?: number;
      takeProfit?: number;
    }): {ok: boolean; error?: string} => {
      if (isAtEnd) {
        return {ok: false, error: t.scenario.orderRejectedEnd};
      }
      const inst = INSTRUMENT_MAP.get(params.symbol);
      if (!inst) return {ok: false, error: t.trade.errWaitingPrice};
      if (!Number.isFinite(params.notionalUsd) || params.notionalUsd < 10) {
        return {ok: false, error: t.trade.errMinSize};
      }

      const lev = Math.max(1, Math.min(20, params.leverage));
      const marginRequired = Number((params.notionalUsd / lev).toFixed(2));
      const feeRate = inst.assetClass === 'crypto' ? 0.0005 : 0.00008;
      const entryFee = Number((params.notionalUsd * feeRate).toFixed(2));

      if (marginRequired + entryFee > runState.cash) {
        return {
          ok: false,
          error: `${t.trade.errInsufficientCash}`,
        };
      }

      const barIndex = barCount - 1;

      if (params.orderType === 'limit') {
        if (!params.limitPrice || params.limitPrice <= 0) {
          return {ok: false, error: t.trade.errInvalidLimit};
        }
        const pending: PendingOrder = {
          id: `scord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          symbol: params.symbol,
          assetClass: inst.assetClass,
          side: params.side,
          notionalUsd: params.notionalUsd,
          leverage: lev,
          limitPrice: params.limitPrice,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
          createdAt: latestCandle.time,
        };
        setRunState((prev) => ({
          ...prev,
          cash: Number((prev.cash - marginRequired - entryFee).toFixed(2)),
          pendingOrders: [pending, ...prev.pendingOrders],
        }));
        return {ok: true};
      }

      const entryPrice = params.side === 'buy' ? scenarioQuote.ask : scenarioQuote.bid;
      if (params.stopLoss) {
        if (params.side === 'buy' && params.stopLoss >= entryPrice) {
          return {ok: false, error: t.trade.errSlBuy};
        }
        if (params.side === 'sell' && params.stopLoss <= entryPrice) {
          return {ok: false, error: t.trade.errSlSell};
        }
      }
      if (params.takeProfit) {
        if (params.side === 'buy' && params.takeProfit <= entryPrice) {
          return {ok: false, error: t.trade.errTpBuy};
        }
        if (params.side === 'sell' && params.takeProfit >= entryPrice) {
          return {ok: false, error: t.trade.errTpSell};
        }
      }

      const posId = `scpos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const position: Position = {
        id: posId,
        symbol: params.symbol,
        assetClass: inst.assetClass,
        side: params.side,
        quantity: params.notionalUsd / entryPrice,
        notionalUsd: params.notionalUsd,
        marginUsd: marginRequired,
        leverage: lev,
        entryPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        openedAt: latestCandle.time,
      };

      let plannedRr: number | null = null;
      if (params.stopLoss && params.takeProfit) {
        const risk = Math.abs(entryPrice - params.stopLoss);
        const reward = Math.abs(params.takeProfit - entryPrice);
        if (risk > 0 && reward > 0) plannedRr = Number((reward / risk).toFixed(2));
      }

      const record: ScenarioTradeRecord = {
        id: posId,
        symbol: params.symbol,
        side: params.side,
        orderType: 'market',
        notionalUsd: params.notionalUsd,
        marginUsd: marginRequired,
        leverage: lev,
        entryPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        openedBar: barIndex,
        plannedRiskReward: plannedRr,
      };

      setRunState((prev) => ({
        ...prev,
        cash: Number((prev.cash - marginRequired - entryFee).toFixed(2)),
        positions: [position, ...prev.positions],
        tradeRecords: [...prev.tradeRecords, record],
      }));

      return {ok: true};
    },
    [isAtEnd, runState.cash, barCount, latestCandle.time, scenarioQuote.ask, scenarioQuote.bid, t]
  );

  const closeScenarioPosition = useCallback(
    (positionId: string) => {
      const barIndex = barCount - 1;
      setRunState((prev) => {
        const pos = prev.positions.find((p) => p.id === positionId);
        if (!pos) return prev;
        const exitPrice = pos.side === 'buy' ? scenarioQuote.bid : scenarioQuote.ask;
        const diff = pos.side === 'buy' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
        const grossPnl = diff * pos.quantity;
        const feeRate = pos.assetClass === 'crypto' ? 0.0005 : 0.00008;
        const exitFee = exitPrice * pos.quantity * feeRate;
        const realizedPnl = Number((grossPnl - exitFee).toFixed(2));
        const nextCash = Number((prev.cash + pos.marginUsd + realizedPnl).toFixed(2));
        const returnPct = pos.marginUsd > 0 ? Number(((realizedPnl / pos.marginUsd) * 100).toFixed(2)) : 0;

        const log: TradeLog = {
          id: `sclog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          symbol: pos.symbol,
          assetClass: pos.assetClass,
          side: pos.side,
          quantity: pos.quantity,
          notionalUsd: pos.notionalUsd,
          leverage: pos.leverage,
          entryPrice: pos.entryPrice,
          exitPrice,
          realizedPnl,
          returnPct,
          closeReason: 'manual',
          openedAt: pos.openedAt,
          closedAt: latestCandle.time,
          feeUsd: Number(exitFee.toFixed(2)),
        };

        const nextRecords = prev.tradeRecords.map((r) =>
          r.id === positionId
            ? {
                ...r,
                closedBar: barIndex,
                exitPrice,
                realizedPnl,
                closeReason: 'manual' as const,
              }
            : r
        );

        return {
          ...prev,
          cash: nextCash,
          positions: prev.positions.filter((p) => p.id !== positionId),
          tradeLogs: [log, ...prev.tradeLogs],
          tradeRecords: nextRecords,
        };
      });
    },
    [barCount, scenarioQuote.bid, scenarioQuote.ask, latestCandle.time]
  );

  const cancelScenarioPending = useCallback((orderId: string) => {
    setRunState((prev) => {
      const ord = prev.pendingOrders.find((o) => o.id === orderId);
      if (!ord) return prev;
      return {
        ...prev,
        cash: Number((prev.cash + ord.notionalUsd / ord.leverage).toFixed(2)),
        pendingOrders: prev.pendingOrders.filter((o) => o.id !== orderId),
      };
    });
  }, []);

  const finishAndGrade = useCallback((): {ok: boolean; error?: string} => {
    if (runState.tradeRecords.length === 0) {
      return {ok: false, error: t.scenario.needTradeToGrade};
    }

    setIsPlaying(false);
    const barIndex = barCount - 1;
    let finalCash = runState.cash;
    const finalizedRecords = runState.tradeRecords.map((r) => ({...r}));

    for (const pos of runState.positions) {
      const exitPrice = pos.side === 'buy' ? scenarioQuote.bid : scenarioQuote.ask;
      const diff = pos.side === 'buy' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
      const grossPnl = diff * pos.quantity;
      const feeRate = pos.assetClass === 'crypto' ? 0.0005 : 0.00008;
      const exitFee = exitPrice * pos.quantity * feeRate;
      const realizedPnl = Number((grossPnl - exitFee).toFixed(2));
      finalCash = Number((finalCash + pos.marginUsd + realizedPnl).toFixed(2));

      const rec = finalizedRecords.find((r) => r.id === pos.id);
      if (rec) {
        rec.closedBar = barIndex;
        rec.exitPrice = exitPrice;
        rec.realizedPnl = realizedPnl;
        rec.closeReason = 'end-of-scenario';
      }
    }

    // Refund unexecuted pending order margins
    for (const ord of runState.pendingOrders) {
      finalCash = Number((finalCash + ord.notionalUsd / ord.leverage).toFixed(2));
    }

    const endingEquity = Number(finalCash.toFixed(2));
    const generated = gradeScenarioRun({
      scenarioId: scenario.id,
      startingEquity: scenario.initialCapital,
      endingEquity,
      maxDrawdownPct: runState.maxDrawdownPct,
      trades: finalizedRecords,
    });

    setReport(generated);
    setBestGrades((prev) => {
      const currentBest = prev[scenario.id];
      if (!currentBest || generated.totalScore >= currentBest.score) {
        const updated = {
          ...prev,
          [scenario.id]: {grade: generated.grade, score: generated.totalScore},
        };
        try {
          window.localStorage.setItem(BEST_GRADES_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage write errors
        }
        return updated;
      }
      return prev;
    });

    return {ok: true};
  }, [
    runState.tradeRecords,
    runState.cash,
    runState.positions,
    runState.pendingOrders,
    runState.maxDrawdownPct,
    barCount,
    scenarioQuote.bid,
    scenarioQuote.ask,
    scenario.id,
    scenario.initialCapital,
    t.scenario.needTradeToGrade,
  ]);

  const tradesCount = runState.tradeRecords.length;
  const slProtectedCount = runState.tradeRecords.filter((r) => r.stopLoss !== undefined).length;

  return {
    scenario,
    scenarioQuote,
    cash: runState.cash,
    positions: runState.positions,
    pendingOrders: runState.pendingOrders,
    tradeLogs: runState.tradeLogs,
    visibleCandles,
    activeEvent,
    bestGrades,
    selectScenario,
    equity,
    maxDrawdownPct: runState.maxDrawdownPct,
    tradesCount,
    slProtectedCount,
    resetScenario,
    finishAndGrade,
    isAtEnd,
    isPlaying,
    setIsPlaying,
    stepBar,
    speed,
    setSpeed,
    replayStep,
    replayTotalSteps,
    placeScenarioOrder,
    closeScenarioPosition,
    cancelScenarioPending,
    report,
    setReport,
  };
}
