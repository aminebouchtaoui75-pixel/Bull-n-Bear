import type {Candle, HistoricalScenario} from '../types/trading';

function buildScenarioCandles(params: {
  startMs: number;
  stepMs: number;
  closes: number[];
  volatilityPct: number[];
  baseVolume: number;
  decimals: number;
}): Candle[] {
  const {startMs, stepMs, closes, volatilityPct, baseVolume, decimals} = params;
  const round = (n: number) => Number(n.toFixed(decimals));
  const candles: Candle[] = [];

  for (let i = 0; i < closes.length; i++) {
    const prevClose = i === 0 ? closes[0] : closes[i - 1];
    const close = closes[i];
    const open = i === 0 ? round(close * 0.999) : round(prevClose);
    const volPct = volatilityPct[i] ?? 0.008;
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const wickScale = Math.max(Math.abs(close - open) * 0.45, close * volPct);
    const upperFactor = 0.65 + ((i * 7) % 5) * 0.14;
    const lowerFactor = 0.7 + ((i * 11) % 5) * 0.15;

    const high = round(bodyHigh + wickScale * upperFactor);
    const low = round(Math.max(bodyLow - wickScale * lowerFactor, close * 0.55));
    const shockMult = 1 + volPct * 65 + Math.abs(close - open) / Math.max(open, 1e-6) * 28;
    const volume = Math.round(baseVolume * shockMult);

    candles.push({
      time: startMs + i * stepMs,
      open,
      high,
      low,
      close: round(close),
      volume,
    });
  }

  return candles;
}

const BTC_CLOSES = [
  // Initial 24 context bars (bars 0..23) drifting around 7,850 - 7,960
  7910, 7925, 7905, 7940, 7955, 7930, 7915, 7895, 7920, 7945, 7932, 7910,
  7890, 7902, 7880, 7865, 7878, 7860, 7852, 7868, 7855, 7842, 7858, 7850,
  // Replay bars (bars 24..55): support breaks -> cascade -> capitulation near 4,720 -> relief > 5,700
  7810, 7740, 7610, 7420, 7180, 6890, 6540, 6210, 5940, 6080, 5820, 5490,
  5180, 4910, 4740, 4880, 5140, 5390, 5580, 5420, 5290, 5460, 5630, 5740,
  5810, 5690, 5755, 5860, 5920, 5845, 5910, 5960,
];

const BTC_VOL = BTC_CLOSES.map((_, idx) => {
  if (idx < 24) return 0.006;
  if (idx < 34) return 0.022;
  if (idx < 41) return 0.032;
  if (idx < 48) return 0.018;
  return 0.011;
});

const EUR_CLOSES = [
  // Initial 24 context bars tightening below 1.1800
  1.1782, 1.1788, 1.1791, 1.1785, 1.1779, 1.1784, 1.1790, 1.1794, 1.1789, 1.1786, 1.1792, 1.1795,
  1.1788, 1.1783, 1.1787, 1.1791, 1.1786, 1.1784, 1.1789, 1.1793, 1.1788, 1.1785, 1.1790, 1.1786,
  // Replay bars (bars 24..55): central bank shock vacuum -> drop -> whip-saw bounce to 1.1670 -> settles 1.1540..1.1630
  1.1755, 1.1690, 1.1610, 1.1535, 1.1480, 1.1425, 1.1390, 1.1445, 1.1520, 1.1595, 1.1650, 1.1672,
  1.1635, 1.1585, 1.1530, 1.1495, 1.1525, 1.1560, 1.1590, 1.1575, 1.1552, 1.1568, 1.1595, 1.1618,
  1.1604, 1.1582, 1.1565, 1.1588, 1.1612, 1.1598, 1.1615, 1.1606,
];

const EUR_VOL = EUR_CLOSES.map((_, idx) => {
  if (idx < 24) return 0.0005;
  if (idx < 37) return 0.0038;
  if (idx < 45) return 0.0022;
  return 0.0011;
});

const SOL_CLOSES = [
  // Initial 24 context bars running to 54.80 and stalling
  47.8, 48.6, 49.4, 50.1, 49.7, 50.9, 51.8, 52.4, 51.9, 52.8, 53.5, 54.1,
  53.6, 54.2, 54.7, 54.4, 53.9, 54.5, 54.8, 54.3, 54.6, 54.1, 53.7, 53.9,
  // Replay bars (bars 24..55): support breaks -> liquidation spiral -> bounce -> 28.90 test -> stabilizes 35-36
  52.6, 50.8, 48.4, 45.9, 43.2, 40.5, 37.8, 35.1, 33.4, 36.2, 38.9, 40.4,
  37.6, 34.2, 31.1, 29.0, 30.8, 32.7, 34.4, 33.1, 32.2, 33.8, 35.1, 35.8,
  36.2, 35.4, 34.9, 35.6, 36.1, 35.7, 35.9, 36.3,
];

const SOL_VOL = SOL_CLOSES.map((_, idx) => {
  if (idx < 24) return 0.011;
  if (idx < 34) return 0.029;
  if (idx < 41) return 0.036;
  if (idx < 48) return 0.021;
  return 0.012;
});

export const HISTORICAL_SCENARIOS: HistoricalScenario[] = [
  {
    id: 'btcCrash2020',
    symbol: 'BTC/USD',
    timeframeLabel: '15m',
    dateLabel: 'Mar 12, 2020',
    initialCapital: 25_000,
    initialVisibleBars: 24,
    candles: buildScenarioCandles({
      startMs: Date.UTC(2020, 2, 12, 6, 0, 0),
      stepMs: 15 * 60 * 1000,
      closes: BTC_CLOSES,
      volatilityPct: BTC_VOL,
      baseVolume: 1850,
      decimals: 2,
    }),
    events: [
      {barIndex: 24, titleKey: 'ev1'},
      {barIndex: 30, titleKey: 'ev2'},
      {barIndex: 38, titleKey: 'ev3'},
      {barIndex: 47, titleKey: 'ev4'},
    ],
  },
  {
    id: 'eurShock2015',
    symbol: 'EUR/USD',
    timeframeLabel: '5m',
    dateLabel: 'Jan 15, 2015',
    initialCapital: 25_000,
    initialVisibleBars: 24,
    candles: buildScenarioCandles({
      startMs: Date.UTC(2015, 0, 15, 8, 30, 0),
      stepMs: 5 * 60 * 1000,
      closes: EUR_CLOSES,
      volatilityPct: EUR_VOL,
      baseVolume: 4200,
      decimals: 5,
    }),
    events: [
      {barIndex: 24, titleKey: 'ev1'},
      {barIndex: 28, titleKey: 'ev2'},
      {barIndex: 35, titleKey: 'ev3'},
      {barIndex: 46, titleKey: 'ev4'},
    ],
  },
  {
    id: 'solDeleveraging2021',
    symbol: 'SOL/USD',
    timeframeLabel: '15m',
    dateLabel: 'May 19, 2021',
    initialCapital: 25_000,
    initialVisibleBars: 24,
    candles: buildScenarioCandles({
      startMs: Date.UTC(2021, 4, 19, 9, 0, 0),
      stepMs: 15 * 60 * 1000,
      closes: SOL_CLOSES,
      volatilityPct: SOL_VOL,
      baseVolume: 2600,
      decimals: 2,
    }),
    events: [
      {barIndex: 24, titleKey: 'ev1'},
      {barIndex: 29, titleKey: 'ev2'},
      {barIndex: 39, titleKey: 'ev3'},
      {barIndex: 48, titleKey: 'ev4'},
    ],
  },
];
