import type {Instrument} from '../types/trading';

export const INSTRUMENTS: Instrument[] = [
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    base: 'BTC',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 2,
    pipSize: 1,
    typicalSpreadPct: 0.0004,
    beginnerNote: 'The largest cryptocurrency by market value. High liquidity, moves 24/7.',
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    base: 'ETH',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 2,
    pipSize: 0.1,
    typicalSpreadPct: 0.0005,
    beginnerNote: 'Leading smart-contract network. Often moves alongside Bitcoin with higher percentage swings.',
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    base: 'SOL',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 2,
    pipSize: 0.01,
    typicalSpreadPct: 0.0008,
    beginnerNote: 'Fast Layer-1 blockchain known for stronger daily volatility — keep position sizes smaller.',
  },
  {
    symbol: 'XRP/USD',
    name: 'Ripple XRP',
    base: 'XRP',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 4,
    pipSize: 0.0001,
    typicalSpreadPct: 0.0009,
    beginnerNote: 'Cross-border payments token with lower unit price and crisp round-number support levels.',
  },
  {
    symbol: 'ADA/USD',
    name: 'Cardano',
    base: 'ADA',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 4,
    pipSize: 0.0001,
    typicalSpreadPct: 0.001,
    beginnerNote: 'Proof-of-stake blockchain asset suited for practicing swing setups.',
  },
  {
    symbol: 'AVAX/USD',
    name: 'Avalanche',
    base: 'AVAX',
    quote: 'USD',
    assetClass: 'crypto',
    decimals: 2,
    pipSize: 0.01,
    typicalSpreadPct: 0.001,
    beginnerNote: 'Smart-contract platform that reacts strongly during broader crypto momentum shifts.',
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    base: 'EUR',
    quote: 'USD',
    assetClass: 'forex',
    decimals: 5,
    pipSize: 0.0001,
    typicalSpreadPct: 0.00012,
    beginnerNote: 'The most traded currency pair in the world. Tightest spreads and gentle, structured moves.',
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    base: 'GBP',
    quote: 'USD',
    assetClass: 'forex',
    decimals: 5,
    pipSize: 0.0001,
    typicalSpreadPct: 0.00016,
    beginnerNote: 'Known as "Cable". More active during London and New York market overlap.',
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    base: 'USD',
    quote: 'JPY',
    assetClass: 'forex',
    decimals: 3,
    pipSize: 0.01,
    typicalSpreadPct: 0.00015,
    beginnerNote: 'Note that 1 pip is 0.01 (2nd decimal place) instead of 0.0001.',
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    base: 'AUD',
    quote: 'USD',
    assetClass: 'forex',
    decimals: 5,
    pipSize: 0.0001,
    typicalSpreadPct: 0.00018,
    beginnerNote: 'Commodity-linked major pair often used to learn clean trend-following.',
  },
  {
    symbol: 'USD/CHF',
    name: 'US Dollar / Swiss Franc',
    base: 'USD',
    quote: 'CHF',
    assetClass: 'forex',
    decimals: 5,
    pipSize: 0.0001,
    typicalSpreadPct: 0.0002,
    beginnerNote: 'Safe-haven European pair that often moves inversely to EUR/USD.',
  },
  {
    symbol: 'EUR/GBP',
    name: 'Euro / British Pound',
    base: 'EUR',
    quote: 'GBP',
    assetClass: 'forex',
    decimals: 5,
    pipSize: 0.0001,
    typicalSpreadPct: 0.0002,
    beginnerNote: 'Steady European cross pair with narrower daily ranges for calm practice.',
  },
];

export const INSTRUMENT_MAP = new Map(INSTRUMENTS.map((i) => [i.symbol, i]));

export function formatPrice(price: number, symbol: string): string {
  const inst = INSTRUMENT_MAP.get(symbol);
  const decimals = inst?.decimals ?? (price >= 100 ? 2 : 4);
  return price.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatUsd(amount: number, showSign = false): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (amount < 0) return `-$${formatted}`;
  if (showSign && amount > 0) return `+$${formatted}`;
  return `$${formatted}`;
}
