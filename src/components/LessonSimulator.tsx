import React, {useState} from 'react';
import {Check} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {SimulatorKind} from '../types/trading';

interface LessonSimulatorProps {
  kind: SimulatorKind;
}

export const LessonSimulator: React.FC<LessonSimulatorProps> = ({kind}) => {
  if (kind === 'spread-lab') return <SpreadLab />;
  if (kind === 'order-sandbox') return <OrderSandbox />;
  if (kind === 'pip-calculator') return <PipCalculator />;
  if (kind === 'candlestick-anatomy') return <CandlestickAnatomy />;
  if (kind === 'position-sizer') return <PositionSizer />;
  if (kind === 'session-news-lab') return <SessionNewsLab />;
  if (kind === 'readiness-checklist') return <ReadinessChecklistLab />;
  return <IndicatorLab />;
};

const SpreadLab: React.FC = () => {
  const {t} = useLanguage();
  const [tradeSize, setTradeSize] = useState(2000);
  const [spreadPct, setSpreadPct] = useState(0.08);
  const midPrice = 91000;
  const half = (midPrice * (spreadPct / 100)) / 2;
  const bid = midPrice - half;
  const ask = midPrice + half;
  const initialCost = (tradeSize * spreadPct) / 100;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.spreadTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.spreadSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.tradeAmount}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">${tradeSize.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={500}
            max={20000}
            step={500}
            value={tradeSize}
            onChange={(e) => setTradeSize(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>

        <label className="space-y-1.5 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.marketSpread}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">{spreadPct.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.5}
            step={0.02}
            value={spreadPct}
            onChange={(e) => setSpreadPct(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.sellBid}</span>
          <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400" dir="ltr">
            ${bid.toFixed(2)}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.buyAsk}</span>
          <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400" dir="ltr">
            ${ask.toFixed(2)}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.startingCost}</span>
          <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white" dir="ltr">
            -${initialCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const OrderSandbox: React.FC = () => {
  const {t} = useLanguage();
  const [marketPrice, setMarketPrice] = useState(100);
  const limitBuy = 96;
  const stopLoss = 92;
  const takeProfit = 108;

  let status = t.sim.orderWait;
  let tone = 'text-amber-600 dark:text-amber-400';

  if (marketPrice <= stopLoss) {
    status = t.sim.orderSlHit;
    tone = 'text-red-600 dark:text-red-400';
  } else if (marketPrice >= takeProfit) {
    status = t.sim.orderTpHit;
    tone = 'text-emerald-600 dark:text-emerald-400';
  } else if (marketPrice <= limitBuy) {
    const pct = (((marketPrice - limitBuy) / limitBuy) * 100).toFixed(1);
    status = `${t.sim.orderFilled} (${marketPrice >= 96 ? '+' : ''}${pct}%)`;
    tone = 'text-blue-600 dark:text-blue-400';
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.orderTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.orderSub}</p>
      </div>

      <label className="space-y-1.5 block">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">{t.sim.simMarketPrice}</span>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white" dir="ltr">${marketPrice}</span>
        </div>
        <input
          type="range"
          min={88}
          max={112}
          step={1}
          value={marketPrice}
          onChange={(e) => setMarketPrice(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-500" dir="ltr">
          <span>$92 {t.sim.stopLoss}</span>
          <span>$96 {t.sim.buyLimit}</span>
          <span>$108 {t.sim.takeProfit}</span>
        </div>
      </label>

      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <p className={`text-xs font-medium ${tone}`}>{status}</p>
      </div>
    </div>
  );
};

const PipCalculator: React.FC = () => {
  const {t} = useLanguage();
  const [pair, setPair] = useState<'EUR/USD' | 'USD/JPY'>('EUR/USD');
  const [pips, setPips] = useState(25);
  const [tradeUsd, setTradeUsd] = useState(5000);

  const pipPct = pair === 'EUR/USD' ? 0.0001 / 1.06 : 0.01 / 154;
  const dollarMove = tradeUsd * pips * pipPct;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.pipTitle}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.pipSub}</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800" dir="ltr">
          {(['EUR/USD', 'USD/JPY'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPair(p)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                pair === p
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.tradeSizeUsd}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">${tradeUsd.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={25000}
            step={1000}
            value={tradeUsd}
            onChange={(e) => setTradeUsd(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>

        <label className="space-y-1.5 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.priceMovePips}</span>
            <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">{pips} pips</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={pips}
            onChange={(e) => setPips(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>
      </div>

      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {pips} pips · {pair} ({pair === 'EUR/USD' ? '0.0001' : '0.01'} {t.sim.pipPer}):
        </span>
        <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
          +${dollarMove.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const CandlestickAnatomy: React.FC = () => {
  const {t} = useLanguage();
  const [openP, setOpenP] = useState(40);
  const [closeP, setCloseP] = useState(72);
  const [highP, setHighP] = useState(86);
  const [lowP, setLowP] = useState(18);

  const safeHigh = Math.max(highP, openP, closeP);
  const safeLow = Math.min(lowP, openP, closeP);
  const isBull = closeP >= openP;
  const bodyTop = 100 - Math.max(openP, closeP);
  const bodyBottom = 100 - Math.min(openP, closeP);
  const wickTop = 100 - safeHigh;
  const wickBottom = 100 - safeLow;

  const lowerWick = Math.min(openP, closeP) - safeLow;
  const upperWick = safeHigh - Math.max(openP, closeP);
  let patternNote = isBull ? t.sim.candleBull : t.sim.candleBear;
  if (lowerWick > 25 && Math.abs(closeP - openP) < 25) {
    patternNote = t.sim.candleHammer;
  } else if (upperWick > 25 && Math.abs(closeP - openP) < 25) {
    patternNote = t.sim.candleShooting;
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.candleTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.candleSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
        <div className="flex items-center justify-center bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-4 h-40">
          <svg viewBox="0 0 100 100" className="w-24 h-32">
            <line
              x1="50"
              y1={wickTop}
              x2="50"
              y2={wickBottom}
              stroke={isBull ? '#10B981' : '#EF4444'}
              strokeWidth="3"
            />
            <rect
              x="32"
              y={bodyTop}
              width="36"
              height={Math.max(4, bodyBottom - bodyTop)}
              rx="2"
              fill={isBull ? '#10B981' : '#EF4444'}
            />
          </svg>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          <label className="text-xs space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.sim.open}</span>
              <span className="font-mono" dir="ltr">${openP}</span>
            </span>
            <input type="range" min={10} max={90} value={openP} onChange={(e) => setOpenP(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
          </label>
          <label className="text-xs space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.sim.close}</span>
              <span className="font-mono" dir="ltr">${closeP}</span>
            </span>
            <input type="range" min={10} max={90} value={closeP} onChange={(e) => setCloseP(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
          </label>
          <label className="text-xs space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.sim.high}</span>
              <span className="font-mono" dir="ltr">${safeHigh}</span>
            </span>
            <input type="range" min={10} max={95} value={highP} onChange={(e) => setHighP(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
          </label>
          <label className="text-xs space-y-1">
            <span className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{t.sim.low}</span>
              <span className="font-mono" dir="ltr">${safeLow}</span>
            </span>
            <input type="range" min={5} max={90} value={lowP} onChange={(e) => setLowP(Number(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
          </label>
          <p className="col-span-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
            {patternNote}
          </p>
        </div>
      </div>
    </div>
  );
};

const PositionSizer: React.FC = () => {
  const {t} = useLanguage();
  const [accountSize, setAccountSize] = useState(100000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopDistPct, setStopDistPct] = useState(4);

  const maxDollarRisk = (accountSize * riskPct) / 100;
  const recommendedTradeSize = maxDollarRisk / (stopDistPct / 100);
  const rewardAt2R = maxDollarRisk * 2;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.sizerTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.sizerSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="space-y-1 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.account}</span>
            <span className="font-mono font-semibold" dir="ltr">${accountSize.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={100000}
            step={10000}
            value={accountSize}
            onChange={(e) => setAccountSize(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>

        <label className="space-y-1 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.maxRiskPct}</span>
            <span className="font-mono font-semibold" dir="ltr">{riskPct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>

        <label className="space-y-1 block">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">{t.sim.slDistance}</span>
            <span className="font-mono font-semibold" dir="ltr">{stopDistPct}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={stopDistPct}
            onChange={(e) => setStopDistPct(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500">{t.sim.recommendedSize}</span>
          <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400" dir="ltr">
            ${Math.round(recommendedTradeSize).toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500">{t.sim.maxLossAtSl}</span>
          <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400" dir="ltr">
            -${Math.round(maxDollarRisk).toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500">{t.sim.targetGain2R}</span>
          <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
            +${Math.round(rewardAt2R).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const IndicatorLab: React.FC = () => {
  const {t} = useLanguage();
  const [rsi, setRsi] = useState(48);

  let zone = t.sim.rsiNeutral;
  let zoneColor = 'text-blue-600 dark:text-blue-400';
  if (rsi >= 70) {
    zone = t.sim.rsiOverbought;
    zoneColor = 'text-amber-600 dark:text-amber-400';
  } else if (rsi <= 30) {
    zone = t.sim.rsiOversold;
    zoneColor = 'text-emerald-600 dark:text-emerald-400';
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.rsiTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.rsiSub}</p>
      </div>

      <label className="space-y-2 block">
        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300">{t.sim.currentRsi}</span>
          <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400" dir="ltr">{rsi}</span>
        </div>
        <input
          type="range"
          min={10}
          max={90}
          value={rsi}
          onChange={(e) => setRsi(Number(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>{t.sim.oversold}</span>
          <span>{t.sim.midline}</span>
          <span>{t.sim.overbought}</span>
        </div>
      </label>

      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <p className={`text-xs font-medium ${zoneColor}`}>{zone}</p>
      </div>
    </div>
  );
};

const SessionNewsLab: React.FC = () => {
  const {t} = useLanguage();
  const [regime, setRegime] = useState<'overlap' | 'quiet' | 'news'>('overlap');

  const presets = {
    overlap: {
      spread: '0.8 pips (0.01%)',
      slippage: 'Low (±0.2 pips)',
      verdict: t.sim.sessionVerdictOverlap,
      tone: 'text-emerald-600 dark:text-emerald-400',
    },
    quiet: {
      spread: '2.4 pips (0.03%)',
      slippage: 'Moderate (±0.8 pips)',
      verdict: t.sim.sessionVerdictQuiet,
      tone: 'text-amber-600 dark:text-amber-400',
    },
    news: {
      spread: '8.5+ pips (0.09%)',
      slippage: 'High (±4–15 pips)',
      verdict: t.sim.sessionVerdictNews,
      tone: 'text-red-600 dark:text-red-400',
    },
  }[regime];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div>
        <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.sessionTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.sessionSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {([
          {id: 'overlap', label: t.sim.sessionOverlap},
          {id: 'quiet', label: t.sim.sessionQuiet},
          {id: 'news', label: t.sim.sessionNewsShock},
        ] as const).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRegime(item.id)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              regime === item.id
                ? 'bg-slate-900 dark:bg-blue-600 border-slate-900 dark:border-blue-500 text-white'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.sessionSpreadLabel}</span>
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums" dir="ltr">
            {presets.spread}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.sessionSlippageLabel}</span>
          <span className={`font-mono text-sm font-bold tabular-nums ${presets.tone}`} dir="ltr">
            {presets.slippage}
          </span>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <p className={`text-xs font-medium ${presets.tone}`}>{presets.verdict}</p>
      </div>
    </div>
  );
};

const ReadinessChecklistLab: React.FC = () => {
  const {t} = useLanguage();
  const [checked, setChecked] = useState<boolean[]>([true, true, false, false, false]);

  const items = [
    t.sim.readinessItem1,
    t.sim.readinessItem2,
    t.sim.readinessItem3,
    t.sim.readinessItem4,
    t.sim.readinessItem5,
  ];

  const doneCount = checked.filter(Boolean).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const allReady = doneCount === items.length;

  const toggleIdx = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">{t.sim.readinessTitle}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sim.readinessSub}</p>
        </div>
        <div className="text-end shrink-0">
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.sim.readinessScoreLabel}</span>
          <span
            className={`font-mono text-sm font-bold tabular-nums ${
              allReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
            }`}
            dir="ltr"
          >
            {doneCount}/{items.length} ({pct}%)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((label, idx) => {
          const isChecked = checked[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleIdx(idx)}
              className={`w-full text-start p-3 rounded-lg border flex items-center gap-3 transition-colors cursor-pointer ${
                isChecked
                  ? 'bg-white dark:bg-[#111827] border-emerald-500/45 text-slate-900 dark:text-white'
                  : 'bg-white/70 dark:bg-[#111827]/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {isChecked && <Check className="w-3 h-3" strokeWidth={2.5} />}
              </span>
              <span className="text-xs leading-snug">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <p
          className={`text-xs font-medium ${
            allReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {allReady ? t.sim.readinessPass : t.sim.readinessWait}
        </p>
      </div>
    </div>
  );
};
