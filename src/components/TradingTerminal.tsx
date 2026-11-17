import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Activity,
  Award,
  Bell,
  ChevronDown,
  ChevronUp,
  Compass,
  History,
  Info,
  Pause,
  Play,
  RotateCcw,
  Search,
  SkipForward,
} from 'lucide-react';
import {INSTRUMENTS, INSTRUMENT_MAP, formatPrice, formatUsd} from '../data/instruments';
import {HISTORICAL_SCENARIOS} from '../data/scenarios';
import {useLanguage} from '../i18n/LanguageContext';
import {calcPositionPnl} from '../hooks/usePaperAccount';
import {useScenarioSession} from '../hooks/useScenarioSession';
import type {
  AssetClass,
  Candle,
  MarketQuote,
  OrderSide,
  OrderType,
  PendingOrder,
  Position,
  PriceAlert,
  Timeframe,
  TradeLog,
} from '../types/trading';
import {CandlestickChart} from './CandlestickChart';
import {GuidedTradingOverlay, type GuidedStep} from './GuidedTradingOverlay';
import {ScenarioReportModal} from './ScenarioReportModal';

const GUIDE_SEEN_KEY = 'meridian_guided_trading_seen_v1';

interface TradingTerminalProps {
  selectedSymbol: string;
  onSelectSymbol: (sym: string) => void;
  quotes: Record<string, MarketQuote>;
  cash: number;
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeLogs: TradeLog[];
  alerts: PriceAlert[];
  onPlaceOrder: (params: {
    symbol: string;
    side: OrderSide;
    orderType: OrderType;
    notionalUsd: number;
    leverage: number;
    limitPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {ok: boolean; error?: string};
  onClosePosition: (id: string) => void;
  onCancelPending: (id: string) => void;
  onQuickAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below') => void;
  onUpdateAlert: (id: string, targetPrice: number, condition: 'above' | 'below') => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  beginnerHints: boolean;
  theme: 'dark' | 'light';
}

const TIMEFRAMES: Array<{id: Timeframe; label: string}> = [
  {id: '1m', label: '1m'},
  {id: '5m', label: '5m'},
  {id: '15m', label: '15m'},
  {id: '1h', label: '1H'},
  {id: '4h', label: '4H'},
  {id: '1d', label: '1D'},
];

export const TradingTerminal: React.FC<TradingTerminalProps> = ({
  selectedSymbol,
  onSelectSymbol,
  quotes,
  cash,
  positions,
  pendingOrders,
  tradeLogs,
  alerts,
  onPlaceOrder,
  onClosePosition,
  onCancelPending,
  onQuickAlert,
  onUpdateAlert,
  onToggleAlert,
  onDeleteAlert,
  beginnerHints,
  theme,
}) => {
  const {t, dir, getInstrumentNote} = useLanguage();
  const [watchlistFilter, setWatchlistFilter] = useState<'all' | AssetClass>('all');
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles');
  const [indicators, setIndicators] = useState({
    sma20: true,
    ema50: false,
    bollinger: false,
    rsi: false,
  });
  const [candles, setCandles] = useState<Candle[]>([]);
  const [candleSource, setCandleSource] = useState<string>('live-feed');

  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [notionalInput, setNotionalInput] = useState<string>('1000');
  const [leverage, setLeverage] = useState<number>(1);
  const [limitInput, setLimitInput] = useState<string>('');
  const [stopLossInput, setStopLossInput] = useState<string>('');
  const [takeProfitInput, setTakeProfitInput] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<{type: 'ok' | 'err'; text: string} | null>(null);
  const [bottomTab, setBottomTab] = useState<'positions' | 'pending' | 'history'>('positions');
  const [alertSavedMsg, setAlertSavedMsg] = useState<string | null>(null);

  const [terminalMode, setTerminalMode] = useState<'live' | 'scenario'>('live');
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null);
  const scSession = useScenarioSession();
  const isScenario = terminalMode === 'scenario';

  const [guideOpen, setGuideOpen] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(GUIDE_SEEN_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const [guideStep, setGuideStep] = useState(0);

  const watchlistRef = useRef<HTMLElement | null>(null);
  const chartCardRef = useRef<HTMLDivElement | null>(null);
  const directionSizeRef = useRef<HTMLDivElement | null>(null);
  const safetyExitsRef = useRef<HTMLDivElement | null>(null);
  const submitBtnRef = useRef<HTMLDivElement | null>(null);

  const activeSymbol = isScenario ? scSession.scenario.symbol : selectedSymbol;
  const instrument = INSTRUMENT_MAP.get(activeSymbol) ?? INSTRUMENTS[0];
  const quote = isScenario ? scSession.scenarioQuote : quotes[selectedSymbol];
  const activeCash = isScenario ? scSession.cash : cash;
  const activePositions = isScenario ? scSession.positions : positions;
  const activePendingOrders = isScenario ? scSession.pendingOrders : pendingOrders;
  const activeTradeLogs = isScenario ? scSession.tradeLogs : tradeLogs;
  const activeCandles = isScenario ? scSession.visibleCandles : candles;
  const activeQuotesMap = useMemo(
    () => (isScenario ? {[activeSymbol]: scSession.scenarioQuote} : quotes),
    [isScenario, activeSymbol, scSession.scenarioQuote, quotes]
  );

  useEffect(() => {
    let active = true;
    if (isScenario) return;
    const loadCandles = async () => {
      try {
        const res = await fetch(
          `/api/market/candles?symbol=${encodeURIComponent(selectedSymbol)}&interval=${timeframe}&limit=110`
        );
        if (!res.ok) return;
        const data = (await res.json()) as {candles: Candle[]; source: string};
        if (active && Array.isArray(data.candles)) {
          setCandles(data.candles);
          setCandleSource(data.source);
        }
      } catch {
        // Keep existing candles
      }
    };
    void loadCandles();
    const timer = window.setInterval(() => void loadCandles(), 15_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [selectedSymbol, timeframe, isScenario]);

  useEffect(() => {
    setStopLossInput('');
    setTakeProfitInput('');
    setLimitInput(quote ? String(quote.price) : '');
    setOrderFeedback(null);
    setScenarioNotice(null);
  }, [activeSymbol, terminalMode, scSession.scenario.id]);

  const filteredInstruments = useMemo(() => {
    return INSTRUMENTS.filter((inst) => {
      if (watchlistFilter !== 'all' && inst.assetClass !== watchlistFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return inst.symbol.toLowerCase().includes(q) || inst.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [watchlistFilter, search]);

  const notionalUsd = Math.max(0, parseFloat(notionalInput) || 0);
  const entryEstimate = orderType === 'limit' && parseFloat(limitInput) > 0
    ? parseFloat(limitInput)
    : quote
      ? side === 'buy'
        ? quote.ask
        : quote.bid
      : 0;

  const slVal = parseFloat(stopLossInput);
  const tpVal = parseFloat(takeProfitInput);

  const riskRewardSummary = useMemo(() => {
    if (!entryEstimate || notionalUsd <= 0) return null;
    const qty = notionalUsd / entryEstimate;
    let maxLoss: number | null = null;
    let maxGain: number | null = null;

    if (Number.isFinite(slVal) && slVal > 0) {
      const diff = side === 'buy' ? entryEstimate - slVal : slVal - entryEstimate;
      if (diff > 0) maxLoss = diff * qty;
    }
    if (Number.isFinite(tpVal) && tpVal > 0) {
      const diff = side === 'buy' ? tpVal - entryEstimate : entryEstimate - tpVal;
      if (diff > 0) maxGain = diff * qty;
    }
    const rr = maxLoss && maxGain ? maxGain / maxLoss : null;
    return {maxLoss, maxGain, rr};
  }, [entryEstimate, notionalUsd, slVal, tpVal, side]);

  const applySlTpPreset = (slPct: number, tpPct: number) => {
    if (!entryEstimate) return;
    const dec = instrument.decimals;
    if (side === 'buy') {
      setStopLossInput((entryEstimate * (1 - slPct / 100)).toFixed(dec));
      setTakeProfitInput((entryEstimate * (1 + tpPct / 100)).toFixed(dec));
    } else {
      setStopLossInput((entryEstimate * (1 + slPct / 100)).toFixed(dec));
      setTakeProfitInput((entryEstimate * (1 - tpPct / 100)).toFixed(dec));
    }
  };

  const handleCompleteGuide = useCallback(() => {
    setGuideOpen(false);
    try {
      window.localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleRestartGuide = useCallback(() => {
    setGuideStep(0);
    setGuideOpen(true);
  }, []);

  const guidedSteps = useMemo<GuidedStep[]>(() => {
    const isRtl = dir === 'rtl';
    return [
      {
        id: 'market',
        title: t.trade.guideStep1Title,
        description: t.trade.guideStep1Desc,
        targetRef: watchlistRef,
        preferredSide: isRtl ? 'left' : 'right',
      },
      {
        id: 'chart',
        title: t.trade.guideStep2Title,
        description: t.trade.guideStep2Desc,
        targetRef: chartCardRef,
        preferredSide: 'bottom',
      },
      {
        id: 'side-size',
        title: t.trade.guideStep3Title,
        description: t.trade.guideStep3Desc,
        targetRef: directionSizeRef,
        preferredSide: isRtl ? 'right' : 'left',
      },
      {
        id: 'safety-exits',
        title: t.trade.guideStep4Title,
        description: t.trade.guideStep4Desc,
        targetRef: safetyExitsRef,
        preferredSide: isRtl ? 'right' : 'left',
      },
      {
        id: 'submit-order',
        title: t.trade.guideStep5Title,
        description: t.trade.guideStep5Desc,
        targetRef: submitBtnRef,
        preferredSide: isRtl ? 'right' : 'left',
      },
    ];
  }, [dir, t.trade]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);
    setScenarioNotice(null);

    const payload = {
      symbol: activeSymbol,
      side,
      orderType: showAdvanced ? orderType : ('market' as const),
      notionalUsd,
      leverage: showAdvanced ? leverage : 1,
      limitPrice: showAdvanced && orderType === 'limit' ? parseFloat(limitInput) : undefined,
      stopLoss: Number.isFinite(slVal) && slVal > 0 ? slVal : undefined,
      takeProfit: Number.isFinite(tpVal) && tpVal > 0 ? tpVal : undefined,
    };

    const result = isScenario ? scSession.placeScenarioOrder(payload) : onPlaceOrder(payload);

    if (result.ok) {
      setOrderFeedback({
        type: 'ok',
        text: `${side === 'buy' ? t.trade.orderPlacedBuy : t.trade.orderPlacedSell} ${activeSymbol}.`,
      });
      setStopLossInput('');
      setTakeProfitInput('');
      if (guideOpen && !isScenario) {
        handleCompleteGuide();
      }
    } else {
      setOrderFeedback({type: 'err', text: result.error ?? t.trade.errWaitingPrice});
    }
  };

  const handleFinishScenario = () => {
    setScenarioNotice(null);
    const res = scSession.finishAndGrade();
    if (!res.ok && res.error) {
      setScenarioNotice(res.error);
    }
  };

  const symbolAlertsCount = useMemo(
    () => alerts.filter((a) => a.symbol === selectedSymbol).length,
    [alerts, selectedSymbol]
  );

  const handleQuickPriceAlert = () => {
    if (!quote) return;
    const target = Number((quote.price * 1.01).toFixed(instrument.decimals));
    onQuickAlert(selectedSymbol, target, 'above');
    setAlertSavedMsg(`${t.trade.alertSetAbove} ${formatPrice(target, selectedSymbol)}`);
    window.setTimeout(() => setAlertSavedMsg(null), 3000);
  };

  const handleChartAlertUpdate = (id: string, targetPrice: number, condition: 'above' | 'below') => {
    onUpdateAlert(id, targetPrice, condition);
    const dirText = condition === 'above' ? t.trade.alertAboveShort : t.trade.alertBelowShort;
    setAlertSavedMsg(
      `${t.trade.alertUpdated}: ${selectedSymbol} ${dirText} ${formatPrice(targetPrice, selectedSymbol)}`
    );
    window.setTimeout(() => setAlertSavedMsg(null), 3000);
  };

  const scenarioCopy = t.scenario.scenarios[scSession.scenario.id];
  const activeScenarioEventText = scSession.activeEvent
    ? scenarioCopy[scSession.activeEvent.titleKey]
    : scenarioCopy.brief;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-4">
      {/* Terminal Workspace Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#0F1623] border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              scSession.setIsPlaying(false);
              setTerminalMode('live');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !isScenario
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            {t.scenario.modeLive}
          </button>
          <button
            type="button"
            onClick={() => setTerminalMode('scenario')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isScenario
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            {t.scenario.modeScenario}
          </button>
        </div>

        {isScenario && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.scenario.modeBanner}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Market Watchlist (Live) OR Scenario Selector & Risk Telemetry */}
        <aside
          ref={watchlistRef}
          className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden"
        >
          {isScenario ? (
            <>
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-1 text-start">
                <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                  {t.scenario.selectTitle}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.scenario.selectSub}
                </p>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {HISTORICAL_SCENARIOS.map((sc) => {
                  const scText = t.scenario.scenarios[sc.id];
                  const active = scSession.scenario.id === sc.id;
                  const best = scSession.bestGrades[sc.id];
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => scSession.selectScenario(sc.id)}
                      className={`w-full p-3.5 text-start transition-colors space-y-1 cursor-pointer ${
                        active
                          ? 'bg-blue-50/80 dark:bg-blue-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {scText.title}
                        </span>
                        {best && (
                          <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0" dir="ltr">
                            {best.grade} · {best.score}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400" dir="ltr">
                        {sc.symbol} · {sc.dateLabel} · {sc.timeframeLabel}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {scText.brief}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16]/70 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.scenario.scenarioEquity}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                    {formatUsd(scSession.equity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.scenario.maxDrawdown}</span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums" dir="ltr">
                    -{scSession.maxDrawdownPct.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.scenario.tradesExecuted}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                    {scSession.tradesCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.scenario.slProtected}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                    {scSession.slProtectedCount} / {scSession.tradesCount}
                  </span>
                </div>
                <p className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.scenario.isolatedNote}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                    {t.trade.liveMarkets}
                  </h2>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {candleSource === 'live-api' ? t.trade.liveApi : t.trade.liveStream}
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#090D16]">
                  {([
                    {id: 'all' as const, label: t.common.all},
                    {id: 'crypto' as const, label: t.common.crypto},
                    {id: 'forex' as const, label: t.common.forex},
                  ]).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setWatchlistFilter(tab.id)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        watchlistFilter === tab.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.trade.searchMarkets}
                    className="w-full ps-8 pe-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[340px] lg:max-h-[540px] overflow-y-auto">
                {filteredInstruments.map((inst) => {
                  const q = quotes[inst.symbol];
                  const isSelected = inst.symbol === selectedSymbol;
                  const chg = q?.change24hPct ?? 0;
                  const isUp = chg >= 0;

                  return (
                    <button
                      key={inst.symbol}
                      type="button"
                      onClick={() => onSelectSymbol(inst.symbol)}
                      className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-start transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate" dir="ltr">
                          {inst.symbol}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {inst.name} · {inst.assetClass === 'crypto' ? t.common.crypto : t.common.forex}
                        </div>
                      </div>
                      <div className="text-end font-mono shrink-0" dir="ltr">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {q ? formatPrice(q.price, inst.symbol) : '—'}
                        </div>
                        <div
                          className={`text-[11px] ${
                            isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {q ? `${isUp ? '▲ +' : '▼ '}${chg.toFixed(2)}%` : '—'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* Center: Interactive Chart + Bottom Positions */}
        <div className="lg:col-span-6 space-y-5 min-w-0">
          <div
            ref={chartCardRef}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white" dir="ltr">
                    {instrument.symbol}
                  </h1>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isScenario
                      ? `${scenarioCopy.title} · ${scSession.scenario.dateLabel}`
                      : `${instrument.name} · ${instrument.assetClass === 'crypto' ? t.trade.crypto247 : t.trade.forexPair}`}
                  </span>
                </div>
                {quote && (
                  <div className="flex flex-wrap items-baseline gap-3 mt-1 font-mono" dir="ltr">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(quote.price, instrument.symbol)}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        quote.change24hPct >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {quote.change24hPct >= 0 ? '▲ +' : '▼ '}
                      {quote.change24hPct.toFixed(2)}%
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bid {formatPrice(quote.bid, instrument.symbol)} / Ask {formatPrice(quote.ask, instrument.symbol)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {isScenario ? (
                  <>
                    <button
                      type="button"
                      onClick={scSession.resetScenario}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.scenario.resetBtn}
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishScenario}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {t.scenario.finishGradeBtn}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleRestartGuide}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-blue-500" />
                      {t.trade.guidedTourBtn}
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickPriceAlert}
                      disabled={!quote}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-blue-500" />
                      {t.trade.plusOneAlert}
                    </button>
                  </>
                )}
              </div>
            </div>

            {isScenario && (
              <>
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#090D16] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={scSession.isAtEnd}
                      onClick={() => scSession.setIsPlaying((p) => !p)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {scSession.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {scSession.isPlaying ? t.scenario.pauseBtn : t.scenario.playBtn}
                    </button>
                    <button
                      type="button"
                      disabled={scSession.isAtEnd || scSession.isPlaying}
                      onClick={scSession.stepBar}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1623] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      {t.scenario.stepBtn}
                    </button>
                    <div className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-0.5" dir="ltr">
                      {([1, 2, 4] as const).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => scSession.setSpeed(sp)}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                            scSession.speed === sp
                              ? 'bg-slate-900 text-white dark:bg-blue-600'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums" dir="ltr">
                    {t.scenario.barProgress} {scSession.replayStep} / {scSession.replayTotalSteps}
                  </div>
                </div>

                <div className="px-4 py-2 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/70 dark:border-amber-900/40 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-semibold shrink-0">{t.scenario.eventLabel}:</span>
                  <span>{activeScenarioEventText}</span>
                </div>

                {scenarioNotice && (
                  <div className="px-4 py-2 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                    {scenarioNotice}
                  </div>
                )}
              </>
            )}

            {!isScenario && alertSavedMsg && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/50 text-xs text-blue-700 dark:text-blue-300">
                {alertSavedMsg}
              </div>
            )}

            {!isScenario && symbolAlertsCount > 0 && !alertSavedMsg && (
              <div className="px-4 py-1.5 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                <span className="inline-flex items-center gap-1.5">
                  <Bell className="w-3 h-3 shrink-0" />
                  {t.trade.dragAlertsHint}
                </span>
                <span className="font-mono tabular-nums font-semibold">
                  {symbolAlertsCount} {t.trade.chartAlertsLabel}
                </span>
              </div>
            )}

            {beginnerHints && !isScenario && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-[#090D16]/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{getInstrumentNote(instrument.symbol)}</span>
              </div>
            )}

            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {isScenario ? (
                <div className="px-2 py-1 rounded text-xs font-mono font-medium bg-slate-900 text-white dark:bg-blue-600" dir="ltr">
                  {scSession.scenario.timeframeLabel}
                </div>
              ) : (
                <div className="flex items-center gap-1" dir="ltr">
                  {TIMEFRAMES.map((tf) => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTimeframe(tf.id)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                        timeframe === tf.id
                          ? 'bg-slate-900 text-white dark:bg-blue-600'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-[#090D16] me-1">
                  {(['candles', 'line'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setChartMode(m)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                        chartMode === m
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {m === 'line' ? t.trade.simpleLine : t.trade.candles}
                    </button>
                  ))}
                </div>

                {[
                  {key: 'sma20' as const, label: 'SMA 20'},
                  {key: 'ema50' as const, label: 'EMA 50'},
                  {key: 'bollinger' as const, label: 'Bollinger'},
                  {key: 'rsi' as const, label: 'RSI'},
                ].map((ind) => (
                  <button
                    key={ind.key}
                    type="button"
                    onClick={() => setIndicators((p) => ({...p, [ind.key]: !p[ind.key]}))}
                    className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                      indicators[ind.key]
                        ? 'border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            <CandlestickChart
              symbol={activeSymbol}
              candles={activeCandles}
              livePrice={quote?.price}
              positions={activePositions}
              alerts={isScenario ? [] : alerts}
              onUpdateAlert={isScenario ? undefined : handleChartAlertUpdate}
              onToggleAlert={isScenario ? undefined : onToggleAlert}
              onDeleteAlert={isScenario ? undefined : onDeleteAlert}
              chartMode={chartMode}
              indicators={indicators}
              theme={theme}
            />
          </div>

          {/* Open Positions / Pending / Recent Fills */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden">
            <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 overflow-x-auto">
              {[
                {id: 'positions' as const, label: `${t.trade.openPositions} (${activePositions.length})`},
                {id: 'pending' as const, label: `${t.trade.pendingOrders} (${activePendingOrders.length})`},
                {id: 'history' as const, label: `${t.trade.recentClosed} (${Math.min(activeTradeLogs.length, 10)})`},
              ].map((tabItem) => (
                <button
                  key={tabItem.id}
                  type="button"
                  onClick={() => setBottomTab(tabItem.id)}
                  className={`py-3 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                    bottomTab === tabItem.id
                      ? 'border-blue-600 text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {bottomTab === 'positions' && (
                activePositions.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                    {t.trade.noOpenPositions}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-start text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="pb-2 font-medium text-start">{t.overview.market}</th>
                          <th className="pb-2 font-medium text-start">{t.overview.side}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.size}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.colEntry}</th>
                          <th className="pb-2 font-medium text-end">{t.trade.current}</th>
                          <th className="pb-2 font-medium text-end">{t.trade.livePnl}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.action}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                        {activePositions.map((pos) => {
                          const {unrealizedPnl, markPrice, pnlPct} = calcPositionPnl(pos, activeQuotesMap[pos.symbol]);
                          const isProfit = unrealizedPnl >= 0;
                          return (
                            <tr key={pos.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!isScenario) onSelectSymbol(pos.symbol);
                                  }}
                                  className="hover:underline cursor-pointer"
                                >
                                  {pos.symbol}
                                </button>
                                {pos.leverage > 1 && (
                                  <span className="ms-1.5 text-[10px] font-mono text-slate-400">{pos.leverage}x</span>
                                )}
                              </td>
                              <td
                                className={`py-2.5 font-sans font-medium ${
                                  pos.side === 'buy'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {pos.side === 'buy' ? t.common.buy : t.common.sell}
                              </td>
                              <td className="py-2.5 text-end text-slate-700 dark:text-slate-200" dir="ltr">
                                {formatUsd(pos.notionalUsd)}
                              </td>
                              <td className="py-2.5 text-end text-slate-600 dark:text-slate-300" dir="ltr">
                                {formatPrice(pos.entryPrice, pos.symbol)}
                              </td>
                              <td className="py-2.5 text-end text-slate-900 dark:text-white" dir="ltr">
                                {formatPrice(markPrice, pos.symbol)}
                              </td>
                              <td
                                dir="ltr"
                                className={`py-2.5 text-end font-semibold ${
                                  isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {formatUsd(unrealizedPnl, true)} ({pnlPct >= 0 ? '+' : ''}
                                {pnlPct.toFixed(2)}%)
                              </td>
                              <td className="py-2.5 text-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    isScenario ? scSession.closeScenarioPosition(pos.id) : onClosePosition(pos.id)
                                  }
                                  className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 font-sans text-[11px] font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
                )
              )}

              {bottomTab === 'pending' && (
                activePendingOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                    {t.trade.noPendingOrders}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-start text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="pb-2 font-medium text-start">{t.overview.market}</th>
                          <th className="pb-2 font-medium text-start">{t.overview.side}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.size}</th>
                          <th className="pb-2 font-medium text-end">{t.trade.targetLimit}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.action}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                        {activePendingOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">{ord.symbol}</td>
                            <td className="py-2.5 font-sans font-medium">{ord.side === 'buy' ? t.common.buy : t.common.sell}</td>
                            <td className="py-2.5 text-end" dir="ltr">{formatUsd(ord.notionalUsd)}</td>
                            <td className="py-2.5 text-end" dir="ltr">{formatPrice(ord.limitPrice, ord.symbol)}</td>
                            <td className="py-2.5 text-end">
                              <button
                                type="button"
                                onClick={() =>
                                  isScenario ? scSession.cancelScenarioPending(ord.id) : onCancelPending(ord.id)
                                }
                                className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 font-sans text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              >
                                {t.common.cancel}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {bottomTab === 'history' && (
                activeTradeLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                    {t.trade.noClosedTrades}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-start text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="pb-2 font-medium text-start">{t.overview.market}</th>
                          <th className="pb-2 font-medium text-start">{t.overview.side}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.colEntry}</th>
                          <th className="pb-2 font-medium text-end">{t.overview.colExit}</th>
                          <th className="pb-2 font-medium text-end">{t.trade.netPnl}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                        {activeTradeLogs.slice(0, 8).map((log) => (
                          <tr key={log.id}>
                            <td className="py-2 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">{log.symbol}</td>
                            <td className="py-2 font-sans text-slate-600 dark:text-slate-300">
                              {log.side === 'buy' ? t.common.buy : t.common.sell}
                            </td>
                            <td className="py-2 text-end" dir="ltr">{formatPrice(log.entryPrice, log.symbol)}</td>
                            <td className="py-2 text-end" dir="ltr">{formatPrice(log.exitPrice, log.symbol)}</td>
                            <td
                              dir="ltr"
                              className={`py-2 text-end font-semibold ${
                                log.realizedPnl >= 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {formatUsd(log.realizedPnl, true)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right: Simple Beginner Paper Order Ticket */}
        <aside className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                {t.trade.practiceOrder}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isScenario ? t.scenario.scenarioCash : t.trade.virtualCash}{' '}
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200" dir="ltr">
                  {formatUsd(activeCash)}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div ref={directionSizeRef} className="space-y-4">
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-[#090D16]">
                <button
                  type="button"
                  onClick={() => setSide('buy')}
                  className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    side === 'buy'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.trade.buyPriceUp}
                </button>
                <button
                  type="button"
                  onClick={() => setSide('sell')}
                  className={`py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    side === 'sell'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.trade.sellPriceDown}
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="order-amount" className="font-medium text-slate-700 dark:text-slate-300">
                    {t.trade.amountUsd}
                  </label>
                  {entryEstimate > 0 && notionalUsd > 0 && (
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">
                      ≈ {(notionalUsd / entryEstimate).toFixed(instrument.assetClass === 'crypto' ? 4 : 0)} {instrument.base}
                    </span>
                  )}
                </div>
                <input
                  id="order-amount"
                  type="number"
                  dir="ltr"
                  min={10}
                  step="any"
                  value={notionalInput}
                  onChange={(e) => setNotionalInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-4 gap-1.5" dir="ltr">
                  {[5, 10, 25, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setNotionalInput(String(Math.floor((activeCash * pct) / 100)))}
                      className="py-1 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div ref={safetyExitsRef} className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.trade.safetyExits}
                </span>
                <button
                  type="button"
                  onClick={() => applySlTpPreset(2, 4)}
                  className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {t.trade.autoFillPreset}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="sl-input" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    {t.trade.stopLossLabel}
                  </label>
                  <input
                    id="sl-input"
                    type="number"
                    dir="ltr"
                    step="any"
                    placeholder={t.common.optional}
                    value={stopLossInput}
                    onChange={(e) => setStopLossInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="tp-input" className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    {t.trade.takeProfitLabel}
                  </label>
                  <input
                    id="tp-input"
                    type="number"
                    dir="ltr"
                    step="any"
                    placeholder={t.common.optional}
                    value={takeProfitInput}
                    onChange={(e) => setTakeProfitInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {riskRewardSummary && (riskRewardSummary.maxLoss || riskRewardSummary.maxGain) && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 text-[11px] space-y-2 font-mono">
                  {riskRewardSummary.maxLoss && riskRewardSummary.maxGain && (
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800" dir="ltr">
                      <div
                        className="bg-red-500 h-full"
                        style={{
                          width: `${Math.round(
                            (riskRewardSummary.maxLoss / (riskRewardSummary.maxLoss + riskRewardSummary.maxGain)) * 100
                          )}%`,
                        }}
                      />
                      <div className="bg-emerald-500 h-full flex-1" />
                    </div>
                  )}
                  {riskRewardSummary.maxLoss && (
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-500">{t.trade.ifSlHits}</span>
                      <span className="text-red-600 dark:text-red-400 font-semibold" dir="ltr">
                        -{formatUsd(riskRewardSummary.maxLoss)}
                      </span>
                    </div>
                  )}
                  {riskRewardSummary.maxGain && (
                    <div className="flex justify-between">
                      <span className="font-sans text-slate-500">{t.trade.ifTpHits}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold" dir="ltr">
                        +{formatUsd(riskRewardSummary.maxGain)}
                      </span>
                    </div>
                  )}
                  {riskRewardSummary.rr && (
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-sans text-slate-500">{t.trade.riskReward}</span>
                      <span className="text-slate-900 dark:text-white font-semibold" dir="ltr">
                        1 : {riskRewardSummary.rr.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1 cursor-pointer"
              >
                <span>{t.trade.advancedOptions}</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#090D16]">
                    {([
                      {id: 'market' as const, label: t.trade.marketOrder},
                      {id: 'limit' as const, label: t.trade.limitOrder},
                    ]).map((ot) => (
                      <button
                        key={ot.id}
                        type="button"
                        onClick={() => setOrderType(ot.id)}
                        className={`py-1.5 rounded text-xs font-medium cursor-pointer ${
                          orderType === ot.id
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        {ot.label}
                      </button>
                    ))}
                  </div>

                  {orderType === 'limit' && (
                    <div>
                      <label htmlFor="limit-price" className="block text-[11px] text-slate-500 mb-1">
                        {t.trade.targetEntryPrice}
                      </label>
                      <input
                        id="limit-price"
                        type="number"
                        dir="ltr"
                        step="any"
                        value={limitInput}
                        onChange={(e) => setLimitInput(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>{t.trade.leverageLabel}</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">{leverage}x</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1" dir="ltr">
                      {[1, 2, 5, 10, 20].map((lv) => (
                        <button
                          key={lv}
                          type="button"
                          onClick={() => setLeverage(lv)}
                          className={`py-1 rounded border text-[11px] font-mono cursor-pointer ${
                            leverage === lv
                              ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lv}x
                        </button>
                      ))}
                    </div>
                    {leverage > 1 && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                        {t.trade.marginLocked} <span dir="ltr">{formatUsd(notionalUsd / leverage)}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {orderFeedback && (
              <p
                className={`text-xs p-2.5 rounded-lg border ${
                  orderFeedback.type === 'ok'
                    ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                    : 'border-red-500/40 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                }`}
              >
                {orderFeedback.text}
              </p>
            )}

            <div ref={submitBtnRef}>
              <button
                type="submit"
                disabled={!quote}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-40 ${
                  side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {showAdvanced && orderType === 'limit'
                  ? side === 'buy'
                    ? t.trade.placeBuyLimit
                    : t.trade.placeSellLimit
                  : `${side === 'buy' ? t.trade.buyNow : t.trade.sellNow} ${instrument.base}`}
              </button>
            </div>
          </form>
        </aside>
      </div>

      <GuidedTradingOverlay
        open={guideOpen && !isScenario}
        steps={guidedSteps}
        stepIndex={guideStep}
        onStepChange={setGuideStep}
        onComplete={handleCompleteGuide}
      />

      <ScenarioReportModal
        report={scSession.report}
        onClose={() => scSession.setReport(null)}
        onReplay={() => scSession.resetScenario()}
        onNextScenario={() => {
          const idx = HISTORICAL_SCENARIOS.findIndex((s) => s.id === scSession.scenario.id);
          const next = HISTORICAL_SCENARIOS[(idx + 1) % HISTORICAL_SCENARIOS.length];
          scSession.selectScenario(next.id);
        }}
        onExitToLive={() => {
          scSession.setReport(null);
          setTerminalMode('live');
        }}
      />
    </div>
  );
};
