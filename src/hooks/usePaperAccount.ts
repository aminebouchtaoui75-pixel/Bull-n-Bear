import {useCallback, useEffect, useMemo, useState} from 'react';
import {INSTRUMENT_MAP, formatPrice, formatUsd} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {
  AppNotification,
  EquityPoint,
  MarketQuote,
  OrderSide,
  OrderType,
  PendingOrder,
  Position,
  TradeLog,
} from '../types/trading';

const ACCOUNT_KEY = 'meridian_paper_account_v1';

interface PersistedAccount {
  initialCapital: number;
  cash: number;
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeLogs: TradeLog[];
  equityHistory: EquityPoint[];
}

const DEFAULT_CAPITAL = 100_000;

function createFreshAccount(capital = DEFAULT_CAPITAL): PersistedAccount {
  return {
    initialCapital: capital,
    cash: capital,
    positions: [],
    pendingOrders: [],
    tradeLogs: [],
    equityHistory: [{time: Date.now(), equity: capital}],
  };
}

function loadAccount(): PersistedAccount {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return createFreshAccount();
    const parsed = JSON.parse(raw) as PersistedAccount;
    if (typeof parsed.cash !== 'number') return createFreshAccount();
    return parsed;
  } catch {
    return createFreshAccount();
  }
}

export function calcPositionPnl(pos: Position, quote?: MarketQuote): {unrealizedPnl: number; markPrice: number; pnlPct: number} {
  if (!quote) return {unrealizedPnl: 0, markPrice: pos.entryPrice, pnlPct: 0};
  const markPrice = pos.side === 'buy' ? quote.bid : quote.ask;
  const priceDiff = pos.side === 'buy' ? markPrice - pos.entryPrice : pos.entryPrice - markPrice;
  const unrealizedPnl = priceDiff * pos.quantity;
  const pnlPct = pos.marginUsd > 0 ? (unrealizedPnl / pos.marginUsd) * 100 : 0;
  return {unrealizedPnl, markPrice, pnlPct};
}

type NotifyFn = (payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

export function usePaperAccount(quotes: Record<string, MarketQuote>, onNotify?: NotifyFn) {
  const {t} = useLanguage();
  const [account, setAccount] = useState<PersistedAccount>(loadAccount);

  useEffect(() => {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    if (Object.keys(quotes).length === 0) return;

    setAccount((prev) => {
      let changed = false;
      let nextCash = prev.cash;
      const nextPositions: Position[] = [];
      const nextPending: PendingOrder[] = [];
      const nextLogs = [...prev.tradeLogs];
      const nextEquity = [...prev.equityHistory];
      const notificationsToSend: Array<Omit<AppNotification, 'id' | 'timestamp' | 'read'>> = [];

      for (const pos of prev.positions) {
        const quote = quotes[pos.symbol];
        if (!quote) {
          nextPositions.push(pos);
          continue;
        }
        const exitPrice = pos.side === 'buy' ? quote.bid : quote.ask;
        let closeReason: TradeLog['closeReason'] | null = null;

        if (pos.stopLoss !== undefined) {
          if (pos.side === 'buy' && exitPrice <= pos.stopLoss) closeReason = 'stop-loss';
          if (pos.side === 'sell' && exitPrice >= pos.stopLoss) closeReason = 'stop-loss';
        }
        if (!closeReason && pos.takeProfit !== undefined) {
          if (pos.side === 'buy' && exitPrice >= pos.takeProfit) closeReason = 'take-profit';
          if (pos.side === 'sell' && exitPrice <= pos.takeProfit) closeReason = 'take-profit';
        }

        const priceDiff = pos.side === 'buy' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
        const grossPnl = priceDiff * pos.quantity;
        if (!closeReason && pos.leverage > 1 && grossPnl <= -pos.marginUsd * 0.9) {
          closeReason = 'liquidation';
        }

        if (closeReason) {
          changed = true;
          const feeRate = pos.assetClass === 'crypto' ? 0.0005 : 0.00008;
          const exitFee = exitPrice * pos.quantity * feeRate;
          const realizedPnl = Number((grossPnl - exitFee).toFixed(2));
          nextCash = Number((nextCash + pos.marginUsd + realizedPnl).toFixed(2));
          const returnPct = pos.marginUsd > 0 ? Number(((realizedPnl / pos.marginUsd) * 100).toFixed(2)) : 0;

          const log: TradeLog = {
            id: `trd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
            closeReason,
            openedAt: pos.openedAt,
            closedAt: Date.now(),
            feeUsd: Number(exitFee.toFixed(2)),
          };
          nextLogs.unshift(log);

          const label =
            closeReason === 'take-profit'
              ? t.notifications.tpReached
              : closeReason === 'stop-loss'
                ? t.notifications.slTriggered
                : t.notifications.liquidated;
          const sideWord = pos.side === 'buy' ? t.common.buy : t.common.sell;
          notificationsToSend.push({
            category: 'portfolio-update',
            symbol: pos.symbol,
            title: `${pos.symbol} ${label}`,
            body: `${t.notifications.closedAt} ${sideWord} @ ${formatPrice(exitPrice, pos.symbol)} · ${formatUsd(realizedPnl, true)} (${returnPct >= 0 ? '+' : ''}${returnPct}%).`,
          });
        } else {
          nextPositions.push(pos);
        }
      }

      for (const order of prev.pendingOrders) {
        const quote = quotes[order.symbol];
        if (!quote) {
          nextPending.push(order);
          continue;
        }

        const shouldFill =
          (order.side === 'buy' && quote.ask <= order.limitPrice) ||
          (order.side === 'sell' && quote.bid >= order.limitPrice);

        if (shouldFill) {
          changed = true;
          const fillPrice = order.side === 'buy' ? quote.ask : quote.bid;
          const marginUsd = order.notionalUsd / order.leverage;
          const quantity = order.notionalUsd / fillPrice;
          const pos: Position = {
            id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
            openedAt: Date.now(),
          };
          nextPositions.unshift(pos);
          notificationsToSend.push({
            category: 'portfolio-update',
            symbol: order.symbol,
            title: `${order.symbol} ${t.notifications.limitFilled}`,
            body: `${order.side === 'buy' ? t.notifications.bought : t.notifications.sold} ${formatUsd(order.notionalUsd)} @ ${formatPrice(fillPrice, order.symbol)}.`,
          });
        } else {
          nextPending.push(order);
        }
      }

      if (!changed) return prev;

      if (notificationsToSend.length > 0 && onNotify) {
        queueMicrotask(() => {
          notificationsToSend.forEach((n) => onNotify(n));
        });
      }

      const unrealizedNow = nextPositions.reduce((acc, p) => acc + calcPositionPnl(p, quotes[p.symbol]).unrealizedPnl, 0);
      const lockedMargin = nextPositions.reduce((acc, p) => acc + p.marginUsd, 0) + nextPending.reduce((acc, o) => acc + o.notionalUsd / o.leverage, 0);
      nextEquity.push({
        time: Date.now(),
        equity: Number((nextCash + lockedMargin + unrealizedNow).toFixed(2)),
      });

      return {
        ...prev,
        cash: nextCash,
        positions: nextPositions,
        pendingOrders: nextPending,
        tradeLogs: nextLogs,
        equityHistory: nextEquity.slice(-150),
      };
    });
  }, [quotes, onNotify, t]);

  const placeOrder = useCallback(
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
      const inst = INSTRUMENT_MAP.get(params.symbol);
      const quote = quotes[params.symbol];
      if (!inst || !quote) {
        return {ok: false, error: t.trade.errWaitingPrice};
      }
      if (!Number.isFinite(params.notionalUsd) || params.notionalUsd < 10) {
        return {ok: false, error: t.trade.errMinSize};
      }

      const leverage = Math.max(1, Math.min(20, params.leverage));
      const marginRequired = Number((params.notionalUsd / leverage).toFixed(2));
      const feeRate = inst.assetClass === 'crypto' ? 0.0005 : 0.00008;
      const entryFee = Number((params.notionalUsd * feeRate).toFixed(2));

      if (marginRequired + entryFee > account.cash) {
        return {
          ok: false,
          error: `${t.trade.errInsufficientCash} (${formatUsd(marginRequired + entryFee)} / ${formatUsd(account.cash)})`,
        };
      }

      if (params.orderType === 'limit') {
        if (!params.limitPrice || params.limitPrice <= 0) {
          return {ok: false, error: t.trade.errInvalidLimit};
        }
        const pending: PendingOrder = {
          id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          symbol: params.symbol,
          assetClass: inst.assetClass,
          side: params.side,
          notionalUsd: params.notionalUsd,
          leverage,
          limitPrice: params.limitPrice,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
          createdAt: Date.now(),
        };
        setAccount((prev) => ({
          ...prev,
          cash: Number((prev.cash - marginRequired - entryFee).toFixed(2)),
          pendingOrders: [pending, ...prev.pendingOrders],
        }));
        onNotify?.({
          category: 'portfolio-update',
          symbol: params.symbol,
          title: `${params.symbol} ${t.notifications.limitPlaced}`,
          body: `${params.side === 'buy' ? t.common.buy : t.common.sell} ${formatUsd(params.notionalUsd)} ${t.notifications.queuedAt} ${formatPrice(params.limitPrice, params.symbol)}.`,
        });
        return {ok: true};
      }

      const entryPrice = params.side === 'buy' ? quote.ask : quote.bid;
      const quantity = params.notionalUsd / entryPrice;

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

      const position: Position = {
        id: `pos-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        symbol: params.symbol,
        assetClass: inst.assetClass,
        side: params.side,
        quantity,
        notionalUsd: params.notionalUsd,
        marginUsd: marginRequired,
        leverage,
        entryPrice,
        stopLoss: params.stopLoss,
        takeProfit: params.takeProfit,
        openedAt: Date.now(),
      };

      setAccount((prev) => ({
        ...prev,
        cash: Number((prev.cash - marginRequired - entryFee).toFixed(2)),
        positions: [position, ...prev.positions],
      }));

      onNotify?.({
        category: 'portfolio-update',
        symbol: params.symbol,
        title: `${params.symbol} ${params.side === 'buy' ? t.common.buy : t.common.sell} ${t.notifications.orderExecuted}`,
        body: `${t.notifications.openedAt} ${formatUsd(params.notionalUsd)} (${leverage}x) @ ${formatPrice(entryPrice, params.symbol)}.`,
      });

      return {ok: true};
    },
    [account.cash, quotes, onNotify, t]
  );

  const closePosition = useCallback(
    (positionId: string) => {
      setAccount((prev) => {
        const pos = prev.positions.find((p) => p.id === positionId);
        if (!pos) return prev;
        const quote = quotes[pos.symbol];
        const exitPrice = quote ? (pos.side === 'buy' ? quote.bid : quote.ask) : pos.entryPrice;
        const priceDiff = pos.side === 'buy' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
        const grossPnl = priceDiff * pos.quantity;
        const feeRate = pos.assetClass === 'crypto' ? 0.0005 : 0.00008;
        const exitFee = exitPrice * pos.quantity * feeRate;
        const realizedPnl = Number((grossPnl - exitFee).toFixed(2));
        const nextCash = Number((prev.cash + pos.marginUsd + realizedPnl).toFixed(2));
        const returnPct = pos.marginUsd > 0 ? Number(((realizedPnl / pos.marginUsd) * 100).toFixed(2)) : 0;

        const log: TradeLog = {
          id: `trd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
          closedAt: Date.now(),
          feeUsd: Number(exitFee.toFixed(2)),
        };

        const remaining = prev.positions.filter((p) => p.id !== positionId);
        const unrealizedNow = remaining.reduce((acc, p) => acc + calcPositionPnl(p, quotes[p.symbol]).unrealizedPnl, 0);
        const lockedMargin =
          remaining.reduce((acc, p) => acc + p.marginUsd, 0) +
          prev.pendingOrders.reduce((acc, o) => acc + o.notionalUsd / o.leverage, 0);

        queueMicrotask(() => {
          onNotify?.({
            category: 'portfolio-update',
            symbol: pos.symbol,
            title: `${pos.symbol} ${t.notifications.positionClosed}`,
            body: `${t.notifications.exitedAt} ${formatPrice(exitPrice, pos.symbol)} · ${formatUsd(realizedPnl, true)} (${returnPct >= 0 ? '+' : ''}${returnPct}%).`,
          });
        });

        return {
          ...prev,
          cash: nextCash,
          positions: remaining,
          tradeLogs: [log, ...prev.tradeLogs],
          equityHistory: [
            ...prev.equityHistory,
            {time: Date.now(), equity: Number((nextCash + lockedMargin + unrealizedNow).toFixed(2))},
          ].slice(-150),
        };
      });
    },
    [quotes, onNotify, t]
  );

  const cancelPendingOrder = useCallback((orderId: string) => {
    setAccount((prev) => {
      const order = prev.pendingOrders.find((o) => o.id === orderId);
      if (!order) return prev;
      const marginRefund = order.notionalUsd / order.leverage;
      return {
        ...prev,
        cash: Number((prev.cash + marginRefund).toFixed(2)),
        pendingOrders: prev.pendingOrders.filter((o) => o.id !== orderId),
      };
    });
  }, []);

  const resetAccount = useCallback((newCapital = DEFAULT_CAPITAL) => {
    setAccount(createFreshAccount(newCapital));
  }, []);

  const loadSampleHistory = useCallback(() => {
    const now = Date.now();
    const hour = 3_600_000;
    const sampleLogs: TradeLog[] = [
      {
        id: 'smp-6',
        symbol: 'BTC/USD',
        assetClass: 'crypto',
        side: 'buy',
        quantity: 0.11,
        notionalUsd: 9900,
        leverage: 1,
        entryPrice: 90000,
        exitPrice: 92400,
        realizedPnl: 254.1,
        returnPct: 2.57,
        closeReason: 'take-profit',
        openedAt: now - 4 * hour,
        closedAt: now - 2 * hour,
        feeUsd: 9.9,
      },
      {
        id: 'smp-5',
        symbol: 'EUR/USD',
        assetClass: 'forex',
        side: 'sell',
        quantity: 12000,
        notionalUsd: 12720,
        leverage: 2,
        entryPrice: 1.0615,
        exitPrice: 1.0582,
        realizedPnl: 38.58,
        returnPct: 0.61,
        closeReason: 'take-profit',
        openedAt: now - 12 * hour,
        closedAt: now - 8 * hour,
        feeUsd: 1.02,
      },
      {
        id: 'smp-4',
        symbol: 'SOL/USD',
        assetClass: 'crypto',
        side: 'buy',
        quantity: 25,
        notionalUsd: 5300,
        leverage: 1,
        entryPrice: 212.0,
        exitPrice: 207.8,
        realizedPnl: -110.2,
        returnPct: -2.08,
        closeReason: 'stop-loss',
        openedAt: now - 22 * hour,
        closedAt: now - 18 * hour,
        feeUsd: 5.2,
      },
      {
        id: 'smp-3',
        symbol: 'ETH/USD',
        assetClass: 'crypto',
        side: 'buy',
        quantity: 2.5,
        notionalUsd: 7750,
        leverage: 1,
        entryPrice: 3100,
        exitPrice: 3240,
        realizedPnl: 341.9,
        returnPct: 4.41,
        closeReason: 'manual',
        openedAt: now - 36 * hour,
        closedAt: now - 29 * hour,
        feeUsd: 8.1,
      },
      {
        id: 'smp-2',
        symbol: 'USD/JPY',
        assetClass: 'forex',
        side: 'buy',
        quantity: 100,
        notionalUsd: 15380,
        leverage: 2,
        entryPrice: 153.8,
        exitPrice: 153.25,
        realizedPnl: -56.2,
        returnPct: -0.73,
        closeReason: 'stop-loss',
        openedAt: now - 52 * hour,
        closedAt: now - 46 * hour,
        feeUsd: 1.2,
      },
      {
        id: 'smp-1',
        symbol: 'GBP/USD',
        assetClass: 'forex',
        side: 'buy',
        quantity: 8000,
        notionalUsd: 10080,
        leverage: 1,
        entryPrice: 1.26,
        exitPrice: 1.2685,
        realizedPnl: 67.2,
        returnPct: 0.67,
        closeReason: 'take-profit',
        openedAt: now - 72 * hour,
        closedAt: now - 64 * hour,
        feeUsd: 0.8,
      },
    ];

    const chronological = [...sampleLogs].reverse();
    let running = DEFAULT_CAPITAL;
    const eq: EquityPoint[] = [{time: now - 74 * hour, equity: DEFAULT_CAPITAL}];
    for (const item of chronological) {
      running = Number((running + item.realizedPnl).toFixed(2));
      eq.push({time: item.closedAt, equity: running});
    }

    setAccount({
      initialCapital: DEFAULT_CAPITAL,
      cash: running,
      positions: [],
      pendingOrders: [],
      tradeLogs: sampleLogs,
      equityHistory: eq,
    });
  }, []);

  const analytics = useMemo(() => {
    const unrealizedPnl = account.positions.reduce((acc, p) => acc + calcPositionPnl(p, quotes[p.symbol]).unrealizedPnl, 0);
    const marginUsed =
      account.positions.reduce((acc, p) => acc + p.marginUsd, 0) +
      account.pendingOrders.reduce((acc, o) => acc + o.notionalUsd / o.leverage, 0);
    const totalEquity = account.cash + marginUsed + unrealizedPnl;
    const realizedPnl = account.tradeLogs.reduce((acc, item) => acc + item.realizedPnl, 0);
    const totalReturnPct = account.initialCapital > 0 ? ((totalEquity - account.initialCapital) / account.initialCapital) * 100 : 0;

    const wins = account.tradeLogs.filter((item) => item.realizedPnl > 0);
    const losses = account.tradeLogs.filter((item) => item.realizedPnl < 0);
    const totalTrades = account.tradeLogs.length;
    const winRatePct = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;

    const grossWins = wins.reduce((s, item) => s + item.realizedPnl, 0);
    const grossLosses = Math.abs(losses.reduce((s, item) => s + item.realizedPnl, 0));
    const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? 99 : 0;

    const avgWin = wins.length > 0 ? grossWins / wins.length : 0;
    const avgLoss = losses.length > 0 ? grossLosses / losses.length : 0;
    const expectancy = totalTrades > 0 ? realizedPnl / totalTrades : 0;
    const bestTrade = totalTrades > 0 ? Math.max(...account.tradeLogs.map((item) => item.realizedPnl)) : 0;
    const worstTrade = totalTrades > 0 ? Math.min(...account.tradeLogs.map((item) => item.realizedPnl)) : 0;

    const fullSeries = [...account.equityHistory, {time: Date.now(), equity: totalEquity}];
    let peak = account.initialCapital;
    let maxDrawdownPct = 0;
    for (const pt of fullSeries) {
      if (pt.equity > peak) peak = pt.equity;
      const dd = peak > 0 ? ((peak - pt.equity) / peak) * 100 : 0;
      if (dd > maxDrawdownPct) maxDrawdownPct = dd;
    }

    const cryptoTrades = account.tradeLogs.filter((item) => item.assetClass === 'crypto');
    const forexTrades = account.tradeLogs.filter((item) => item.assetClass === 'forex');
    const cryptoPnl = cryptoTrades.reduce((s, item) => s + item.realizedPnl, 0);
    const forexPnl = forexTrades.reduce((s, item) => s + item.realizedPnl, 0);

    const longTrades = account.tradeLogs.filter((item) => item.side === 'buy');
    const shortTrades = account.tradeLogs.filter((item) => item.side === 'sell');
    const longWinRate = longTrades.length > 0 ? (longTrades.filter((item) => item.realizedPnl > 0).length / longTrades.length) * 100 : 0;
    const shortWinRate = shortTrades.length > 0 ? (shortTrades.filter((item) => item.realizedPnl > 0).length / shortTrades.length) * 100 : 0;

    return {
      initialCapital: account.initialCapital,
      cash: account.cash,
      marginUsed,
      unrealizedPnl,
      realizedPnl,
      totalEquity,
      totalReturnPct,
      totalTrades,
      winningTrades: wins.length,
      losingTrades: losses.length,
      winRatePct,
      profitFactor,
      avgWin,
      avgLoss,
      expectancy,
      bestTrade,
      worstTrade,
      maxDrawdownPct,
      cryptoPnl,
      forexPnl,
      cryptoCount: cryptoTrades.length,
      forexCount: forexTrades.length,
      longWinRate,
      shortWinRate,
      equitySeries: fullSeries,
    };
  }, [account, quotes]);

  return {
    account,
    analytics,
    placeOrder,
    closePosition,
    cancelPendingOrder,
    resetAccount,
    loadSampleHistory,
  };
}
