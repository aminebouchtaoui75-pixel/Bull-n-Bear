# Meridian — Complete Project Export for Claude Code

> Self-contained codebase snapshot containing architecture notes, commands, file index, and full verbatim source code for every project file.

## 1. Project Overview
- **Application**: Meridian — Step-by-Step Trading Academy, Visual Strategy Studio & Paper Trading Simulator
- **Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Express (`server.ts`), Lucide Icons (`lucide-react`), PWA (`vite-plugin-pwa`)
- **Languages & RTL**: English (`en`), Français (`fr`), Español (`es`), العربية (`ar`, full RTL layout)
- **Primary Features**:
  - **Sequential Step-by-Step Course (`AcademyView`)**: 8 progressive courses (`01` -> `08`), lock-gated until the prior course quiz (`3/4+`) is passed; each course contains 3 focused phases (`1. Concept & Example`, `2. Interactive Lab`, `3. Quiz to Unlock`), animated progress rings, and daily active learning streak tracking.
  - **Practice Trading Desk (`TradingTerminal`)**: Live Crypto & Forex quotes streamed via SSE (`/api/market/stream`), interactive candlestick/line chart, Market & Limit orders, Stop-Loss / Take-Profit presets, and position management.
  - **Visual Strategies & Trading Playbook (`StrategiesView`)**: Interactive animated explanations (`Correct Execution` vs `Common Beginner Mistake`) for 5 chart setups + bookmarking into the sidebar Trading Playbook.
  - **Overview Dashboard (`OverviewDashboard`)**: Daily Missions (`+XP`, level progression, `+50 XP` all-clear bonus), Milestones & Achievements (`First Trade`, `Perfect Quiz Score`, `7-Day Learning Streak`, `Risk Protector`, `Playbook Curator`, `Course Graduate`), equity curve, and CSV-exportable trade log.
  - **Sidebar Navigation & XP Leaderboard (`Sidebar`, `LeaderboardPanel`)**: Collapsible/mobile-drawer navigation with Saved Strategies Playbook and live Cohort XP Leaderboard ranking combined Lessons + Missions XP.
  - **Market Alerts (`AlertsCenter`)**: Price target triggers, browser push notifications, and in-app toast banners.

## 2. Commands
```bash
npm install      # Install dependencies
npm run dev      # Start Express + Vite dev server on port 3000
npm run lint     # TypeScript check (tsc --noEmit)
npm run build    # Production Vite build into dist/
npm start        # Run server.ts (NODE_ENV=production serves dist/)
```

## 3. Backend API Routes (`server.ts`)
- `GET /api/health` — Server health check
- `GET /api/market/quotes` — Latest Crypto & Forex snapshots
- `GET /api/market/stream` — Server-Sent Events (SSE) live price stream
- `GET /api/market/candles?symbol=...&interval=...&limit=...` — OHLCV candle series

## 4. Client Persistence (`localStorage` Keys)
- `meridian_lesson_progress_v1` — Per-lesson completion & best quiz scores
- `meridian_learning_streak_v1` — Active learning dates & daily streak counters
- `meridian_daily_missions_v1` — Daily mission completions & mission XP
- `meridian_achievements_v1` — Unlocked milestone badge timestamps
- `meridian_learner_name_v1` — Custom leaderboard display name
- `meridian_trading_playbook_v1` — Bookmarked strategy IDs
- `meridian_paper_account_v1` — Virtual cash, positions, pending orders, trade logs
- `meridian_price_alerts_v1` / `meridian_notifications_v1` — Alerts & notifications
- `meridian_lang_v1`, `meridian_theme_v1`, `meridian_beginner_hints_v1`, `meridian_sidebar_collapsed_v1` — Preferences

## 5. Project File Index
- **Source & Config Files (49)**:
  - `.env.example`
  - `.gitignore`
  - `index.html`
  - `metadata.json`
  - `package.json`
  - `public/icon.svg`
  - `server.ts`
  - `src/App.tsx`
  - `src/components/AcademyView.tsx`
  - `src/components/AccountDrawer.tsx`
  - `src/components/AchievementsSection.tsx`
  - `src/components/AlertsCenter.tsx`
  - `src/components/CandlestickChart.tsx`
  - `src/components/EquityCurveChart.tsx`
  - `src/components/LeaderboardPanel.tsx`
  - `src/components/LessonExampleAnimator.tsx`
  - `src/components/LessonQuiz.tsx`
  - `src/components/LessonSimulator.tsx`
  - `src/components/OfflineIndicator.tsx`
  - `src/components/OverviewDashboard.tsx`
  - `src/components/PWAInstallButton.tsx`
  - `src/components/Sidebar.tsx`
  - `src/components/StrategiesView.tsx`
  - `src/components/StrategyAnimator.tsx`
  - `src/components/ToastBanner.tsx`
  - `src/components/TradingTerminal.tsx`
  - `src/data/curriculum.ts`
  - `src/data/instruments.ts`
  - `src/data/strategies.ts`
  - `src/hooks/useAchievements.ts`
  - `src/hooks/useDailyMissions.ts`
  - `src/hooks/useLeaderboard.ts`
  - `src/hooks/useLessonProgress.ts`
  - `src/hooks/useMarketStream.ts`
  - `src/hooks/useNotifications.ts`
  - `src/hooks/useOnlineStatus.ts`
  - `src/hooks/usePaperAccount.ts`
  - `src/hooks/usePWAInstall.ts`
  - `src/hooks/useTradingPlaybook.ts`
  - `src/i18n/curriculumTranslations.ts`
  - `src/i18n/LanguageContext.tsx`
  - `src/i18n/translations.ts`
  - `src/i18n/types.ts`
  - `src/i18n/walkthroughTranslations.ts`
  - `src/index.css`
  - `src/main.tsx`
  - `src/types/trading.ts`
  - `tsconfig.json`
  - `vite.config.ts`
- **Binary Assets (8, omitted from code blocks)**:
  - `public/apple-touch-icon.png` (1073 bytes)
  - `public/meridian-icon.jpg` (418837 bytes)
  - `public/meridian-thumbnail.jpg` (457367 bytes)
  - `public/pwa-192x192.png` (1193 bytes)
  - `public/pwa-512x512.png` (4379 bytes)
  - `public/pwa-maskable-512x512.png` (3756 bytes)
  - `src/assets/images/meridian_ad_thumbnail_1794755135237.jpg` (457367 bytes)
  - `src/assets/images/meridian_app_icon_1794755133879.jpg` (418837 bytes)


## 6. Complete Source Code

### `.env.example`

```text
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

### `.gitignore`

```text
node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
```

### `index.html`

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meridian — Learn Crypto &amp; Forex Trading</title>
    <meta
      name="description"
      content="Beginner-friendly crypto and forex trading academy with live market data, simulated paper trading, interactive quizzes, portfolio analytics, and push alerts."
    />
    <meta property="og:title" content="Meridian — Learn Crypto & Forex Trading" />
    <meta
      property="og:description"
      content="Beginner-friendly crypto and forex trading academy with live market data, simulated paper trading, interactive quizzes, portfolio analytics, and push alerts."
    />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/meridian-thumbnail.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/meridian-thumbnail.jpg" />
    <meta name="theme-color" content="#0B0F17" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Meridian" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 antialiased selection:bg-blue-500/20">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `metadata.json`

```json
{
  "name": "Meridian",
  "description": "Beginner-friendly crypto and forex trading academy with live market data, simulated paper trading, interactive quizzes, portfolio analytics, and push alerts.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
```

### `package.json`

```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "start": "node server.ts",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2",
    "vite-plugin-pwa": "^2.0.0"
  }
}
```

### `public/icon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#0B1220"/>
  <rect x="24" y="24" width="464" height="464" rx="92" stroke="#1E293B" stroke-width="8"/>
  <path d="M128 344L208 248L276 296L384 168" stroke="#3B82F6" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M320 168H384V232" stroke="#10B981" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="208" cy="248" r="16" fill="#F8FAFC"/>
  <circle cx="276" cy="296" r="16" fill="#F8FAFC"/>
</svg>
```

### `server.ts`

```ts
import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface MarketStateEntry {
  symbol: string;
  assetClass: 'crypto' | 'forex';
  binanceSymbol?: string;
  coingeckoId?: string;
  price: number;
  anchorPrice: number;
  open24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  spreadPct: number;
  volatility: number;
  decimals: number;
  source: 'live-api' | 'live-feed';
  updatedAt: number;
}

const MARKET_CONFIG: Array<Omit<MarketStateEntry, 'anchorPrice' | 'open24h' | 'high24h' | 'low24h' | 'source' | 'updatedAt'>> = [
  { symbol: 'BTC/USD', assetClass: 'crypto', binanceSymbol: 'BTCUSDT', coingeckoId: 'bitcoin', price: 91450.0, volume24h: 34200000000, spreadPct: 0.0004, volatility: 0.0014, decimals: 2 },
  { symbol: 'ETH/USD', assetClass: 'crypto', binanceSymbol: 'ETHUSDT', coingeckoId: 'ethereum', price: 3180.0, volume24h: 18500000000, spreadPct: 0.0005, volatility: 0.0018, decimals: 2 },
  { symbol: 'SOL/USD', assetClass: 'crypto', binanceSymbol: 'SOLUSDT', coingeckoId: 'solana', price: 214.5, volume24h: 5400000000, spreadPct: 0.0008, volatility: 0.0024, decimals: 2 },
  { symbol: 'XRP/USD', assetClass: 'crypto', binanceSymbol: 'XRPUSDT', coingeckoId: 'ripple', price: 1.084, volume24h: 3100000000, spreadPct: 0.0009, volatility: 0.0022, decimals: 4 },
  { symbol: 'ADA/USD', assetClass: 'crypto', binanceSymbol: 'ADAUSDT', coingeckoId: 'cardano', price: 0.724, volume24h: 980000000, spreadPct: 0.001, volatility: 0.0022, decimals: 4 },
  { symbol: 'AVAX/USD', assetClass: 'crypto', binanceSymbol: 'AVAXUSDT', coingeckoId: 'avalanche-2', price: 36.4, volume24h: 720000000, spreadPct: 0.001, volatility: 0.0023, decimals: 2 },
  { symbol: 'EUR/USD', assetClass: 'forex', price: 1.0584, volume24h: 82000000000, spreadPct: 0.00012, volatility: 0.00035, decimals: 5 },
  { symbol: 'GBP/USD', assetClass: 'forex', price: 1.2672, volume24h: 41000000000, spreadPct: 0.00016, volatility: 0.00042, decimals: 5 },
  { symbol: 'USD/JPY', assetClass: 'forex', price: 154.18, volume24h: 56000000000, spreadPct: 0.00015, volatility: 0.0004, decimals: 3 },
  { symbol: 'AUD/USD', assetClass: 'forex', price: 0.6512, volume24h: 19000000000, spreadPct: 0.00018, volatility: 0.00045, decimals: 5 },
  { symbol: 'USD/CHF', assetClass: 'forex', price: 0.8842, volume24h: 15000000000, spreadPct: 0.0002, volatility: 0.00038, decimals: 5 },
  { symbol: 'EUR/GBP', assetClass: 'forex', price: 0.8352, volume24h: 14000000000, spreadPct: 0.0002, volatility: 0.0003, decimals: 5 },
];

const marketState = new Map<string, MarketStateEntry>();
for (const cfg of MARKET_CONFIG) {
  marketState.set(cfg.symbol, {
    ...cfg,
    anchorPrice: cfg.price,
    open24h: Number((cfg.price * (1 - (Math.random() * 0.02 - 0.01))).toFixed(cfg.decimals)),
    high24h: Number((cfg.price * 1.012).toFixed(cfg.decimals)),
    low24h: Number((cfg.price * 0.988).toFixed(cfg.decimals)),
    source: 'live-feed',
    updatedAt: Date.now(),
  });
}

function roundTo(val: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(val * f) / f;
}

function buildQuotesSnapshot() {
  return Array.from(marketState.values()).map((entry) => {
    const halfSpread = (entry.price * entry.spreadPct) / 2;
    const bid = roundTo(entry.price - halfSpread, entry.decimals);
    const ask = roundTo(entry.price + halfSpread, entry.decimals);
    const change24hPct = entry.open24h > 0 ? ((entry.price - entry.open24h) / entry.open24h) * 100 : 0;
    return {
      symbol: entry.symbol,
      price: entry.price,
      bid,
      ask,
      open24h: entry.open24h,
      high24h: entry.high24h,
      low24h: entry.low24h,
      change24hPct: Number(change24hPct.toFixed(2)),
      volume24h: entry.volume24h,
      source: entry.source,
      updatedAt: entry.updatedAt,
    };
  });
}

async function fetchLiveCryptoAnchors() {
  // Try CoinGecko simple price first (broadly accessible without geo-blocking)
  try {
    const ids = MARKET_CONFIG.filter((c) => c.coingeckoId).map((c) => c.coingeckoId).join(',');
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
      { signal: AbortSignal.timeout(4500) }
    );
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number; usd_24h_vol?: number }>;
      let updatedAny = false;
      for (const entry of marketState.values()) {
        if (entry.coingeckoId && data[entry.coingeckoId]?.usd) {
          const live = data[entry.coingeckoId].usd!;
          const chg = data[entry.coingeckoId].usd_24h_change ?? 0;
          const vol = data[entry.coingeckoId].usd_24h_vol;
          const prevSource = entry.source;
          entry.anchorPrice = live;
          entry.price = roundTo(live, entry.decimals);
          entry.open24h = roundTo(live / (1 + chg / 100), entry.decimals);
          if (prevSource !== 'live-api') {
            entry.high24h = Math.max(entry.price, entry.open24h);
            entry.low24h = Math.min(entry.price, entry.open24h);
          } else {
            entry.high24h = Math.max(entry.high24h, entry.price);
            entry.low24h = Math.min(entry.low24h, entry.price);
          }
          if (vol) entry.volume24h = Math.round(vol);
          entry.source = 'live-api';
          entry.updatedAt = Date.now();
          updatedAny = true;
        }
      }
      if (updatedAny) return;
    }
  } catch {
    // Fallback to Binance public ticker
  }

  try {
    const symbols = JSON.stringify(MARKET_CONFIG.filter((c) => c.binanceSymbol).map((c) => c.binanceSymbol));
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`, {
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const list = (await res.json()) as Array<{
        symbol: string;
        lastPrice: string;
        openPrice: string;
        highPrice: string;
        lowPrice: string;
        quoteVolume: string;
      }>;
      for (const item of list) {
        for (const entry of marketState.values()) {
          if (entry.binanceSymbol === item.symbol) {
            const live = parseFloat(item.lastPrice);
            if (!Number.isNaN(live) && live > 0) {
              entry.anchorPrice = live;
              entry.price = roundTo(live, entry.decimals);
              entry.open24h = roundTo(parseFloat(item.openPrice) || live, entry.decimals);
              entry.high24h = roundTo(parseFloat(item.highPrice) || live, entry.decimals);
              entry.low24h = roundTo(parseFloat(item.lowPrice) || live, entry.decimals);
              entry.volume24h = Math.round(parseFloat(item.quoteVolume) || entry.volume24h);
              entry.source = 'live-api';
              entry.updatedAt = Date.now();
            }
          }
        }
      }
    }
  } catch {
    // Keep existing anchor prices resiliently
  }
}

async function fetchLiveForexAnchors() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,AUD,CHF', {
      signal: AbortSignal.timeout(4500),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { rates?: Record<string, number> };
    const rates = data.rates;
    if (!rates) return;

    const updates: Record<string, number> = {};
    if (rates.EUR) updates['EUR/USD'] = 1 / rates.EUR;
    if (rates.GBP) updates['GBP/USD'] = 1 / rates.GBP;
    if (rates.JPY) updates['USD/JPY'] = rates.JPY;
    if (rates.AUD) updates['AUD/USD'] = 1 / rates.AUD;
    if (rates.CHF) updates['USD/CHF'] = rates.CHF;
    if (rates.EUR && rates.GBP) updates['EUR/GBP'] = rates.GBP / rates.EUR;

    for (const [sym, val] of Object.entries(updates)) {
      const entry = marketState.get(sym);
      if (entry && Number.isFinite(val) && val > 0) {
        entry.anchorPrice = val;
        entry.price = roundTo(val, entry.decimals);
        entry.open24h = roundTo(val * 0.9992, entry.decimals);
        entry.high24h = Math.max(entry.high24h, roundTo(val * 1.0025, entry.decimals));
        entry.low24h = Math.min(entry.low24h, roundTo(val * 0.9975, entry.decimals));
        entry.source = 'live-api';
        entry.updatedAt = Date.now();
      }
    }
  } catch {
    // Keep resilient anchor prices
  }
}

// Microstructure tick simulation anchored to real market rates
function tickMarket() {
  const now = Date.now();
  for (const entry of marketState.values()) {
    // Mean-reverting tick around live anchor price so prices never drift wildly off real market levels
    const driftBack = (entry.anchorPrice - entry.price) * 0.08;
    const shock = (Math.random() - 0.5) * 2 * entry.volatility * 0.35 * entry.price;
    const nextPrice = Math.max(entry.anchorPrice * 0.85, entry.price + driftBack + shock);
    entry.price = roundTo(nextPrice, entry.decimals);
    entry.high24h = Math.max(entry.high24h, entry.price);
    entry.low24h = Math.min(entry.low24h, entry.price);
    entry.updatedAt = now;
  }
}

const INTERVAL_MS: Record<string, number> = {
  '1m': 60_000,
  '5m': 300_000,
  '15m': 900_000,
  '1h': 3_600_000,
  '4h': 14_400_000,
  '1d': 86_400_000,
};

function generateAnchoredCandles(entry: MarketStateEntry, interval: string, limit: number) {
  const stepMs = INTERVAL_MS[interval] ?? 900_000;
  const now = Date.now();
  const alignedEnd = Math.floor(now / stepMs) * stepMs;
  const candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }> = [];

  // Deterministic pseudo-random walk backwards from current price so chart always connects seamlessly to live quote
  let seed = entry.symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + interval.length * 37;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const timeScale = Math.sqrt(stepMs / 900_000);
  const candleVol = entry.volatility * timeScale;
  const closes: number[] = new Array(limit);
  closes[limit - 1] = entry.price;

  for (let i = limit - 2; i >= 0; i--) {
    const wave = Math.sin(i * 0.22) * 0.25;
    const pctMove = (nextRand() - 0.5 + wave * 0.15) * candleVol * 2.2;
    closes[i] = Math.max(entry.price * 0.65, closes[i + 1] / (1 + pctMove));
  }

  for (let i = 0; i < limit; i++) {
    const time = alignedEnd - (limit - 1 - i) * stepMs;
    const open = i === 0 ? closes[0] * (1 + (nextRand() - 0.5) * candleVol) : closes[i - 1];
    const close = closes[i];
    const bodyMax = Math.max(open, close);
    const bodyMin = Math.min(open, close);
    const wickUp = bodyMax * nextRand() * candleVol * 0.9;
    const wickDown = bodyMin * nextRand() * candleVol * 0.9;
    const high = roundTo(bodyMax + wickUp, entry.decimals);
    const low = roundTo(Math.max(0.0001, bodyMin - wickDown), entry.decimals);
    const baseVol = entry.volume24h / (86_400_000 / stepMs);
    const volume = Math.round(baseVol * (0.55 + nextRand() * 0.95));

    candles.push({
      time,
      open: roundTo(open, entry.decimals),
      high,
      low,
      close: roundTo(close, entry.decimals),
      volume,
    });
  }

  return candles;
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json());

  // Initial background anchor fetch
  void fetchLiveCryptoAnchors();
  void fetchLiveForexAnchors();

  // Refresh real anchors periodically
  setInterval(() => void fetchLiveCryptoAnchors(), 15_000);
  setInterval(() => void fetchLiveForexAnchors(), 45_000);

  // SSE clients
  const sseClients = new Set<express.Response>();
  setInterval(() => {
    tickMarket();
    if (sseClients.size === 0) return;
    const payload = `data: ${JSON.stringify(buildQuotesSnapshot())}\n\n`;
    for (const client of sseClients) {
      client.write(payload);
    }
  }, 1200);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', instruments: marketState.size });
  });

  app.get('/api/market/quotes', (_req, res) => {
    res.json({ quotes: buildQuotesSnapshot() });
  });

  app.get('/api/market/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);
    res.write(`data: ${JSON.stringify(buildQuotesSnapshot())}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  app.get('/api/market/candles', async (req, res) => {
    const symbol = String(req.query.symbol || 'BTC/USD');
    const interval = String(req.query.interval || '15m');
    const limit = Math.min(240, Math.max(30, Number(req.query.limit) || 120));

    const entry = marketState.get(symbol);
    if (!entry) {
      res.status(404).json({ error: `Unknown symbol: ${symbol}` });
      return;
    }

    // Try Binance klines for crypto symbols
    if (entry.binanceSymbol && INTERVAL_MS[interval]) {
      try {
        const klineRes = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${entry.binanceSymbol}&interval=${interval}&limit=${limit}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (klineRes.ok) {
          const raw = (await klineRes.json()) as Array<[number, string, string, string, string, string]>;
          if (Array.isArray(raw) && raw.length > 10) {
            const candles = raw.map((k) => ({
              time: k[0],
              open: roundTo(parseFloat(k[1]), entry.decimals),
              high: roundTo(parseFloat(k[2]), entry.decimals),
              low: roundTo(parseFloat(k[3]), entry.decimals),
              close: roundTo(parseFloat(k[4]), entry.decimals),
              volume: Math.round(parseFloat(k[5])),
            }));
            res.json({ symbol, interval, source: 'live-api', candles });
            return;
          }
        }
      } catch {
        // Fall through to anchored historical candles
      }
    }

    const candles = generateAnchoredCandles(entry, interval, limit);
    res.json({ symbol, interval, source: entry.source, candles });
  });

  app.get('/CLAUDE_CODE_PROJECT.md', (req, res) => {
    const mdPath = path.resolve(__dirname, 'CLAUDE_CODE_PROJECT.md');
    if (req.query.download === '1') {
      res.setHeader('Content-Disposition', 'attachment; filename="CLAUDE_CODE_PROJECT.md"');
    }
    res.type('text/markdown; charset=utf-8').sendFile(mdPath);
  });

  if (!IS_PROD) {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    if (hmrDisabled) {
      app.use((req, res, next) => {
        if (req.path === '/@vite/client') {
          const origWrite = res.write.bind(res);
          const origEnd = res.end.bind(res);
          const chunks: Buffer[] = [];
          res.write = ((chunk: unknown) => {
            if (chunk) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
            }
            return true;
          }) as typeof res.write;
          res.end = ((chunk?: unknown) => {
            if (chunk && typeof chunk !== 'function') {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
            }
            res.write = origWrite;
            if (chunks.length === 0 || res.statusCode === 304) {
              return origEnd();
            }
            const raw = Buffer.concat(chunks).toString('utf8');
            const patched = raw.replace(
              'transport.connect(createHMRHandler(handleMessage));',
              '/* HMR disabled */ transport.send = async () => {}; hmrClient.send = () => {};'
            );
            res.removeHeader('Content-Length');
            return origEnd(patched);
          }) as typeof res.end;
        }
        next();
      });
    }
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: hmrDisabled ? false : { server: httpServer },
        ws: hmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Meridian server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
```

### `src/App.tsx`

```tsx
import React, {useEffect, useState} from 'react';
import {Globe, Menu} from 'lucide-react';
import {AccountDrawer} from './components/AccountDrawer';
import {AlertsCenter} from './components/AlertsCenter';
import {AcademyView} from './components/AcademyView';
import {OfflineIndicator} from './components/OfflineIndicator';
import {OverviewDashboard} from './components/OverviewDashboard';
import {Sidebar} from './components/Sidebar';
import {StrategiesView} from './components/StrategiesView';
import {ToastBanner} from './components/ToastBanner';
import {TradingTerminal} from './components/TradingTerminal';
import {TRADING_STRATEGIES} from './data/strategies';
import {useAchievements} from './hooks/useAchievements';
import {useDailyMissions} from './hooks/useDailyMissions';
import {useLeaderboard} from './hooks/useLeaderboard';
import {useLessonProgress} from './hooks/useLessonProgress';
import {useMarketStream} from './hooks/useMarketStream';
import {useNotifications} from './hooks/useNotifications';
import {usePaperAccount} from './hooks/usePaperAccount';
import {useTradingPlaybook} from './hooks/useTradingPlaybook';
import {LANGUAGE_OPTIONS, useLanguage} from './i18n/LanguageContext';
import type {AchievementId, AppTab, StrategyId} from './types/trading';

const THEME_KEY = 'meridian_theme_v1';
const HINTS_KEY = 'meridian_beginner_hints_v1';
const SIDEBAR_KEY = 'meridian_sidebar_collapsed_v1';

export default function App() {
  const {lang, setLang, t, lessons} = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('academy');
  const [activeStrategyId, setActiveStrategyId] = useState<StrategyId>(TRADING_STRATEGIES[0].id);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USD');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [beginnerHints, setBeginnerHints] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(HINTS_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(HINTS_KEY, String(beginnerHints));
  }, [beginnerHints]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const {quotes} = useMarketStream();
  const {
    alerts,
    notifications,
    unreadCount,
    toasts,
    prefs,
    setPrefs,
    permission,
    requestPushPermission,
    sendTestPush,
    pushNotification,
    createAlert,
    toggleAlert,
    deleteAlert,
    markAllRead,
    clearNotifications,
    dismissToast,
  } = useNotifications(quotes);

  const {account, analytics, placeOrder, closePosition, cancelPendingOrder, resetAccount, loadSampleHistory} =
    usePaperAccount(quotes, pushNotification);

  const {
    progress,
    completedCount,
    totalLessons,
    lessonXp,
    currentUnlockedLessonId,
    isLessonUnlocked,
    streak,
    recordDailyActivity,
    recordQuizAttempt,
    resetProgress,
  } = useLessonProgress();

  const {savedIds, toggleBookmark, removeBookmark} = useTradingPlaybook();

  const {
    totalXp: missionXp,
    completedIds,
    bonusClaimedToday,
    completeMission,
    resetMissions,
  } = useDailyMissions(recordDailyActivity, (missionId, xpEarned) => {
    const label =
      missionId === 'long-trade'
        ? t.overview.missionLongTitle
        : missionId === 'risk-guard'
          ? t.overview.missionRiskTitle
          : missionId === 'strategy-guide'
            ? t.overview.missionStrategyTitle
            : t.overview.missionQuizTitle;
    pushNotification({
      category: 'learning',
      title: t.overview.missionToastTitle,
      body: `${label} (+${xpEarned} ${t.overview.missionsXp})`,
    });
  });

  const combinedTotalXp = lessonXp + missionXp;
  const combinedLevel = Math.floor(combinedTotalXp / 150) + 1;
  const combinedLevelFloor = (combinedLevel - 1) * 150;
  const combinedLevelProgressPct = Math.round(((combinedTotalXp - combinedLevelFloor) / 150) * 100);

  const getAchievementTitle = (id: AchievementId) => {
    switch (id) {
      case 'first-trade':
        return t.achievements.firstTradeTitle;
      case 'perfect-quiz':
        return t.achievements.perfectQuizTitle;
      case 'streak-7':
        return t.achievements.streak7Title;
      case 'risk-protector':
        return t.achievements.riskProtectorTitle;
      case 'playbook-collector':
        return t.achievements.playbookCollectorTitle;
      case 'course-graduate':
        return t.achievements.courseGraduateTitle;
    }
  };

  const {
    achievements,
    unlockedCount: achievementsUnlockedCount,
    totalCount: achievementsTotalCount,
    resetAchievements,
  } = useAchievements({
    totalTrades: analytics.totalTrades,
    positions: account.positions,
    pendingOrdersCount: account.pendingOrders.length,
    tradeLogs: account.tradeLogs,
    progress,
    completedLessons: completedCount,
    totalLessons,
    streakDays: streak.currentStreak,
    longestStreak: streak.longestStreak,
    savedStrategiesCount: savedIds.length,
    completedMissionIds: completedIds,
    onUnlock: (id) => {
      pushNotification({
        category: 'learning',
        title: t.achievements.toastTitle,
        body: getAchievementTitle(id),
      });
    },
  });

  const leaderboard = useLeaderboard(lessonXp, missionXp, t.leaderboard.selfDefaultName);

  useEffect(() => {
    if (activeTab === 'strategies') {
      completeMission('strategy-guide');
    }
  }, [activeTab, completeMission]);

  const handlePlaceOrderWithMissions = (params: Parameters<typeof placeOrder>[0]) => {
    const res = placeOrder(params);
    if (res.ok) {
      if (params.side === 'buy') {
        completeMission('long-trade');
      }
      if (params.stopLoss !== undefined || params.takeProfit !== undefined) {
        completeMission('risk-guard');
      }
    }
    return res;
  };

  const handlePracticeSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('trade');
  };

  const handleQuickAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    createAlert({
      symbol,
      condition,
      targetPrice,
      note: t.alerts.quickChartNote,
    });
  };

  const activeAlertsCount = alerts.filter((a) => a.active).length;
  const currentCourse = lessons.find((l) => l.id === currentUnlockedLessonId) ?? lessons[0];

  const activeSectionTitle =
    activeTab === 'overview'
      ? t.nav.overview
      : activeTab === 'trade'
        ? t.nav.practice
        : activeTab === 'academy'
          ? t.nav.academy
          : activeTab === 'strategies'
            ? t.nav.strategies
            : t.nav.alerts;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'alerts') markAllRead();
        }}
        unreadCount={unreadCount}
        completedLessons={completedCount}
        totalLessons={totalLessons}
        totalEquity={analytics.totalEquity}
        savedStrategyIds={savedIds}
        activeStrategyId={activeStrategyId}
        onOpenSavedStrategy={(id) => {
          setActiveStrategyId(id);
          setActiveTab('strategies');
        }}
        onRemoveSavedStrategy={removeBookmark}
        leaderboard={{
          entries: leaderboard.entries,
          userEntry: leaderboard.userEntry,
          aboveEntry: leaderboard.aboveEntry,
          xpToNextRank: leaderboard.xpToNextRank,
          customName: leaderboard.customName,
          onUpdateName: leaderboard.updateDisplayName,
        }}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenSettings={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Slim Workspace Top Utility Bar */}
        <header className="sticky top-0 z-20 h-14 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#090D16]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t.nav.openMenu}
              className="lg:hidden p-2 -ms-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academy')}
              className="lg:hidden flex items-center gap-2 font-display text-base font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer"
            >
              <img src="/icon.svg" alt="" className="w-6 h-6 rounded-md" />
              <span>{t.common.brand}</span>
            </button>
            <span className="hidden lg:inline-block font-display text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {activeSectionTitle}
            </span>
          </div>

          <div
            role="group"
            aria-label={t.common.language}
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-50 dark:bg-[#0F1623] border border-slate-200/90 dark:border-slate-800/90 overflow-x-auto max-w-full"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 ms-1.5 me-1 shrink-0 hidden sm:block" aria-hidden="true" />
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.nativeLabel}
                </button>
              );
            })}
          </div>
        </header>

        <main key={activeTab} className="flex-1 animate-panel-enter">
        {activeTab === 'overview' && (
          <OverviewDashboard
            analytics={analytics}
            positions={account.positions}
            tradeLogs={account.tradeLogs}
            quotes={quotes}
            completedLessons={completedCount}
            totalLessons={totalLessons}
            currentCourseNumber={currentCourse.number}
            currentCourseTitle={currentCourse.title}
            activeAlertsCount={activeAlertsCount}
            beginnerHints={beginnerHints}
            missions={{
              totalXp: combinedTotalXp,
              level: combinedLevel,
              levelProgressPct: combinedLevelProgressPct,
              completedIds,
              bonusClaimedToday,
            }}
            achievements={achievements}
            achievementsUnlockedCount={achievementsUnlockedCount}
            achievementsTotalCount={achievementsTotalCount}
            streakDays={streak.currentStreak}
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (tab === 'alerts') markAllRead();
            }}
            onClosePosition={closePosition}
            onLoadSampleHistory={loadSampleHistory}
          />
        )}

        {activeTab === 'trade' && (
          <TradingTerminal
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
            quotes={quotes}
            cash={account.cash}
            positions={account.positions}
            pendingOrders={account.pendingOrders}
            tradeLogs={account.tradeLogs}
            onPlaceOrder={handlePlaceOrderWithMissions}
            onClosePosition={closePosition}
            onCancelPending={cancelPendingOrder}
            onQuickAlert={handleQuickAlert}
            beginnerHints={beginnerHints}
            theme={theme}
          />
        )}

        {activeTab === 'academy' && (
          <AcademyView
            progress={progress}
            completedCount={completedCount}
            totalLessons={totalLessons}
            currentUnlockedLessonId={currentUnlockedLessonId}
            isLessonUnlocked={isLessonUnlocked}
            streak={streak}
            onRecordActivity={recordDailyActivity}
            onRecordQuiz={(lessonId, score, total) => {
              recordQuizAttempt(lessonId, score, total);
              completeMission('academy-quiz');
              if (score >= Math.ceil(total * 0.75)) {
                pushNotification({
                  category: 'learning',
                  title: t.notifications.quizPassedTitle,
                  body: `${t.academy.scoreLabel} ${score}/${total} — ${t.notifications.quizPassedBody}`,
                });
              }
            }}
            onPracticeSymbol={handlePracticeSymbol}
          />
        )}

        {activeTab === 'strategies' && (
          <StrategiesView
            activeStrategyId={activeStrategyId}
            onSelectStrategyId={setActiveStrategyId}
            savedIds={savedIds}
            onToggleBookmark={toggleBookmark}
            onPracticeSymbol={handlePracticeSymbol}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsCenter
            quotes={quotes}
            alerts={alerts}
            notifications={notifications}
            permission={permission}
            prefs={prefs}
            onUpdatePrefs={setPrefs}
            onRequestPush={requestPushPermission}
            onSendTestPush={sendTestPush}
            onCreateAlert={createAlert}
            onToggleAlert={toggleAlert}
            onDeleteAlert={deleteAlert}
            onMarkAllRead={markAllRead}
            onClearNotifications={clearNotifications}
          />
        )}
        </main>
      </div>

      <AccountDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        beginnerHints={beginnerHints}
        onToggleBeginnerHints={() => setBeginnerHints((b) => !b)}
        initialCapital={account.initialCapital}
        totalEquity={analytics.totalEquity}
        onResetAccount={(cap) => {
          resetAccount(cap);
          setSettingsOpen(false);
        }}
        onResetAcademy={() => {
          resetProgress();
          resetMissions();
          resetAchievements();
          setSettingsOpen(false);
        }}
        permission={permission}
        onRequestPush={requestPushPermission}
        onSendTestPush={sendTestPush}
        prefs={prefs}
        onUpdatePrefs={setPrefs}
      />

      <ToastBanner toasts={toasts} onDismiss={dismissToast} />
      <OfflineIndicator />
    </div>
  );
}
```

### `src/components/AcademyView.tsx`

```tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  GraduationCap,
  Lock,
  Sliders,
} from 'lucide-react';
import {getShiftedDateKey} from '../hooks/useLessonProgress';
import {useLanguage} from '../i18n/LanguageContext';
import type {LearningStreak, LessonProgress} from '../types/trading';
import {LessonExampleAnimator} from './LessonExampleAnimator';
import {LessonQuiz} from './LessonQuiz';
import {LessonSimulator} from './LessonSimulator';

interface StreakSummary extends LearningStreak {
  activeToday: boolean;
}

type LessonPhase = 'learn' | 'lab' | 'quiz';

interface AcademyViewProps {
  progress: Record<string, LessonProgress>;
  completedCount: number;
  totalLessons: number;
  currentUnlockedLessonId: string;
  isLessonUnlocked: (lessonId: string) => boolean;
  streak: StreakSummary;
  onRecordActivity: () => void;
  onRecordQuiz: (lessonId: string, score: number, total: number) => void;
  onPracticeSymbol: (symbol: string) => void;
}

interface LessonProgressRingProps {
  ratio: number;
  completed: boolean;
  active: boolean;
  label: string;
  size?: number;
  ariaLabel: string;
}

const LessonProgressRing: React.FC<LessonProgressRingProps> = ({
  ratio,
  completed,
  active,
  label,
  size = 38,
  ariaLabel,
}) => {
  const [animatedRatio, setAnimatedRatio] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAnimatedRatio(Math.max(0, Math.min(1, ratio)));
    });
    return () => cancelAnimationFrame(id);
  }, [ratio]);

  const strokeWidth = 2.75;
  const center = size / 2;
  const radius = center - strokeWidth - 1;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedRatio);

  const ringStrokeClass = completed
    ? 'text-emerald-500 dark:text-emerald-400'
    : animatedRatio > 0 || active
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-slate-300 dark:text-slate-700';

  const centerSurfaceClass = completed
    ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
    : active
      ? 'bg-blue-600/12 text-blue-700 dark:text-blue-300'
      : 'text-slate-500 dark:text-slate-400';

  return (
    <div
      className="relative shrink-0 inline-flex items-center justify-center"
      style={{width: size, height: size}}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`${ringStrokeClass} transition-[stroke-dashoffset,stroke] duration-700 ease-out`}
        />
      </svg>
      <span
        className={`absolute inset-[5px] rounded-full flex items-center justify-center font-mono text-[11px] font-semibold tabular-nums transition-colors duration-300 ${centerSurfaceClass}`}
      >
        {completed ? <Check className="w-3.5 h-3.5 animate-check-pop" strokeWidth={2.5} /> : label}
      </span>
    </div>
  );
};

export const AcademyView: React.FC<AcademyViewProps> = ({
  progress,
  completedCount,
  totalLessons,
  currentUnlockedLessonId,
  isLessonUnlocked,
  streak,
  onRecordActivity,
  onRecordQuiz,
  onPracticeSymbol,
}) => {
  const {t, lessons, dir, lang} = useLanguage();
  const [activeLessonId, setActiveLessonId] = useState<string>(currentUnlockedLessonId);
  const [phase, setPhase] = useState<LessonPhase>('learn');
  const [lockedNoticeTarget, setLockedNoticeTarget] = useState<{
    attemptedNumber: number;
    requiredNumber: number;
  } | null>(null);
  const stageTopRef = useRef<HTMLDivElement | null>(null);

  // Never allow the learner to remain on a locked course (e.g., after progress reset)
  useEffect(() => {
    if (!isLessonUnlocked(activeLessonId)) {
      setActiveLessonId(currentUnlockedLessonId);
      setPhase('learn');
    }
  }, [activeLessonId, currentUnlockedLessonId, isLessonUnlocked]);

  useEffect(() => {
    onRecordActivity();
  }, [onRecordActivity, activeLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const activeIdx = lessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = activeIdx >= 0 && activeIdx < lessons.length - 1 ? lessons[activeIdx + 1] : null;
  const activeProg = progress[activeLesson.id];
  const isCurrentCompleted = Boolean(activeProg?.completed);
  const isNextUnlocked = nextLesson ? isLessonUnlocked(nextLesson.id) : false;
  const currentFocusLesson = lessons.find((l) => l.id === currentUnlockedLessonId) ?? lessons[0];

  const activeRatio = isCurrentCompleted
    ? 1
    : activeProg && activeProg.bestScore > 0
      ? Math.min(0.9, Math.max(0.2, activeProg.bestScore / activeProg.totalQuestions))
      : 0;

  const pctComplete = Math.round((completedCount / totalLessons) * 100);
  const activeDaySet = new Set(streak.activeDays);
  const weekdayFmt = new Intl.DateTimeFormat(lang, {weekday: 'narrow'});
  const recentDays = Array.from({length: 7}, (_, idx) => {
    const offset = idx - 6;
    const dateKey = getShiftedDateKey(offset);
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dateKey,
      label: weekdayFmt.format(d),
      active: activeDaySet.has(dateKey),
      isToday: offset === 0,
    };
  });

  const dayWord = streak.currentStreak === 1 ? t.academy.daySingular : t.academy.daysPlural;

  const selectUnlockedCourse = (lessonId: string, initialPhase: LessonPhase = 'learn') => {
    setActiveLessonId(lessonId);
    setPhase(initialPhase);
    setLockedNoticeTarget(null);
    stageTopRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  const handleLessonRowClick = (lessonIndex: number, lessonId: string) => {
    if (isLessonUnlocked(lessonId)) {
      selectUnlockedCourse(lessonId, 'learn');
      return;
    }
    const prevNum = Math.max(1, lessonIndex);
    setLockedNoticeTarget({
      attemptedNumber: lessonIndex + 1,
      requiredNumber: prevNum,
    });
  };

  const phaseItems: Array<{
    id: LessonPhase;
    label: string;
    icon: React.ComponentType<{className?: string}>;
  }> = [
    {id: 'learn', label: t.academy.phaseLearn, icon: BookOpen},
    {id: 'lab', label: t.academy.phaseLab, icon: Sliders},
    {id: 'quiz', label: t.academy.phaseQuiz, icon: CheckCircle2},
  ];

  const NextArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const PrevArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div ref={stageTopRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Focused Course Path Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {t.academy.currentFocusLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-medium tabular-nums" dir="ltr">
              {String(currentFocusLesson.number).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{currentFocusLesson.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.academy.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t.academy.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Daily Active Learning Streak Indicator */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] px-3.5 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  streak.activeToday
                    ? 'bg-amber-500/12 border-amber-500/35 text-amber-500 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                <Flame className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {streak.currentStreak}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {dayWord}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                  <span>{t.academy.streakLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {t.academy.streakBest} {streak.longestStreak}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1" aria-label={t.academy.streakActiveToday}>
              {recentDays.map((day) => (
                <div
                  key={day.dateKey}
                  title={day.dateKey}
                  className={`w-5 h-6 rounded-md border flex items-center justify-center text-[10px] font-mono font-semibold transition-colors ${
                    day.active
                      ? 'bg-amber-500/15 border-amber-500/45 text-amber-600 dark:text-amber-400'
                      : day.isToday
                        ? 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        : 'border-slate-200/80 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          {/* Sequential Course Progress */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] px-3.5 py-2.5 flex flex-col justify-center gap-2 min-w-[220px]">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span>{t.academy.courseProgress}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {completedCount}/{totalLessons} ({pctComplete}%)
              </span>
            </div>
            {/* 8-Step Visual Track */}
            <div className="grid grid-cols-8 gap-1" aria-hidden="true">
              {lessons.map((l) => {
                const done = Boolean(progress[l.id]?.completed);
                const isFocus = l.id === currentUnlockedLessonId;
                return (
                  <div
                    key={l.id}
                    className={`h-1.5 rounded-full transition-colors ${
                      done
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : isFocus
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Sequential Path Rail + Focused Single-Step Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sequential Course Path */}
        <aside className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              {t.academy.roadmap}
            </h2>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums" dir="ltr">
              {completedCount}/{lessons.length} {t.academy.completed}
            </span>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
            {lessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(lesson.id);
              const p = progress[lesson.id];
              const isSelected = lesson.id === activeLesson.id;
              const isCompleted = Boolean(p?.completed);
              const isCurrentFocus = lesson.id === currentUnlockedLessonId && !isCompleted;
              const ratio = isCompleted
                ? 1
                : p && p.bestScore > 0
                  ? Math.min(0.9, Math.max(0.2, p.bestScore / p.totalQuestions))
                  : 0;
              const pctText = `${Math.round(ratio * 100)}%`;
              const unlockMsg = t.academy.unlockRequirement.replace(
                '{n}',
                String(Math.max(1, idx)).padStart(2, '0')
              );

              return (
                <button
                  key={lesson.id}
                  type="button"
                  aria-disabled={!unlocked}
                  onClick={() => handleLessonRowClick(idx, lesson.id)}
                  className={`w-full text-start p-3.5 transition-colors flex items-center gap-3.5 cursor-pointer ${
                    !unlocked
                      ? 'bg-slate-50/40 dark:bg-[#0B101B]/60 opacity-75 hover:opacity-95'
                      : isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 ring-1 ring-inset ring-blue-500/35'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {unlocked ? (
                    <LessonProgressRing
                      ratio={ratio}
                      completed={isCompleted}
                      active={isSelected || isCurrentFocus}
                      label={String(lesson.number).padStart(2, '0')}
                      size={38}
                      ariaLabel={`${lesson.title}: ${pctText} ${t.academy.lessonProgressLabel}`}
                    />
                  ) : (
                    <div
                      className="w-[38px] h-[38px] rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center shrink-0 text-slate-400 dark:text-slate-500"
                      aria-label={t.academy.lockedLabel}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="truncate">{lesson.moduleTitle}</span>
                      <span className="font-mono shrink-0 tabular-nums" dir="ltr">
                        {lesson.durationMinutes} {t.common.min}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-medium mt-0.5 leading-snug ${
                        !unlocked
                          ? 'text-slate-500 dark:text-slate-400'
                          : isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {lesson.title}
                    </p>

                    {!unlocked ? (
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{unlockMsg}</span>
                      </p>
                    ) : isCompleted ? (
                      <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                        {t.academy.completed}
                        {p?.bestScore ? ` · ${p.bestScore}/${p.totalQuestions}` : ''}
                      </p>
                    ) : isCurrentFocus ? (
                      <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-1">
                        {t.academy.currentFocusLabel}
                        {p?.bestScore ? ` · ${t.academy.scoreLabel} ${p.bestScore}/${p.totalQuestions}` : ''}
                      </p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Step-by-Step Course Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* Gentle Redirect Banner if user tapped a locked future course */}
          {lockedNoticeTarget && (
            <div
              role="status"
              className="rounded-xl border border-amber-500/35 bg-amber-50/70 dark:bg-amber-950/25 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start sm:items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  <strong className="font-semibold">{t.academy.lockedToastTitle}</strong>
                  {' · '}
                  {t.academy.unlockRequirement.replace(
                    '{n}',
                    String(lockedNoticeTarget.requiredNumber).padStart(2, '0')
                  )}
                </span>
              </div>
              {activeLesson.id !== currentUnlockedLessonId && (
                <button
                  type="button"
                  onClick={() => selectUnlockedCourse(currentUnlockedLessonId, 'learn')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t.academy.goToCurrentCourse}</span>
                  <NextArrow className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Full Curriculum Completion Banner */}
          {completedCount === totalLessons && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/8 dark:bg-emerald-950/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-emerald-500/35 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {t.academy.allCoursesMasteredTitle}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {t.academy.allCoursesMasteredDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPracticeSymbol(activeLesson.practiceSymbol)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>
                  {t.academy.practiceOnChart} <span dir="ltr">{activeLesson.practiceSymbol}</span>
                </span>
                <NextArrow className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 sm:p-6 space-y-6">
            {/* Course Header + Internal Step Switcher */}
            <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200" dir="ltr">
                      {t.academy.stepLabel} {String(activeLesson.number).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLesson.moduleTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLesson.level === 'Beginner' ? t.academy.beginner : t.academy.intermediate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeLesson.durationMinutes} {t.common.min} {t.academy.read}</span>
                    {isCurrentCompleted && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {t.academy.completed}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
                    {activeLesson.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {activeLesson.summary}
                  </p>
                </div>

                <LessonProgressRing
                  ratio={activeRatio}
                  completed={isCurrentCompleted}
                  active
                  label={`${Math.round(activeRatio * 100)}%`}
                  size={46}
                  ariaLabel={`${activeLesson.title}: ${Math.round(activeRatio * 100)}% ${t.academy.lessonProgressLabel}`}
                />
              </div>

              {/* 3 Focused Course Phases */}
              <div
                role="tablist"
                aria-label={activeLesson.title}
                className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800"
              >
                {phaseItems.map((item) => {
                  const Icon = item.icon;
                  const active = phase === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPhase(item.id)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PHASE 1: Concepts & Animated Trading Walkthrough */}
            {phase === 'learn' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeLesson.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B101B] p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400" dir="ltr">
                          0{idx + 1}
                        </span>
                        <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                          {sec.heading}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {sec.body}
                        </p>
                      </div>

                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-lg px-3 py-2">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{t.academy.keyRule}</span>{' '}
                        {sec.keyTakeaway}
                      </p>
                    </div>
                  ))}
                </div>

                <LessonExampleAnimator lessonId={activeLesson.id} />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onPracticeSymbol(activeLesson.practiceSymbol)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span>
                      {t.academy.practiceOnChart} <span dir="ltr">{activeLesson.practiceSymbol}</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhase('lab')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>{t.academy.continueToLab}</span>
                    <NextArrow className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* PHASE 2: Interactive Hands-On Lab */}
            {phase === 'lab' && (
              <div className="space-y-6">
                <LessonSimulator kind={activeLesson.simulator} />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPhase('learn')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <PrevArrow className="w-3.5 h-3.5" />
                    <span>{t.academy.backToConcepts}</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onPracticeSymbol(activeLesson.practiceSymbol)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <span>
                        {t.academy.practiceOnChart} <span dir="ltr">{activeLesson.practiceSymbol}</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhase('quiz')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>{t.academy.continueToQuiz}</span>
                      <NextArrow className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 3: Knowledge Check Quiz & Sequential Unlock */}
            {phase === 'quiz' && (
              <div className="space-y-5">
                <LessonQuiz
                  lessonId={activeLesson.id}
                  questions={activeLesson.quiz}
                  bestScore={activeProg?.bestScore}
                  onComplete={(score, total) => onRecordQuiz(activeLesson.id, score, total)}
                />

                {/* Sequential Next-Course Gate */}
                {nextLesson && (
                  <div
                    className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isNextUnlocked
                        ? 'border-emerald-500/40 bg-emerald-500/8 dark:bg-emerald-950/25'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B]'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                          isNextUnlocked
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-400'
                        }`}
                      >
                        {isNextUnlocked ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {isNextUnlocked ? t.academy.nextUnlockedBanner : t.academy.passQuizToUnlock}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {t.academy.stepLabel} {String(nextLesson.number).padStart(2, '0')} · {nextLesson.title}
                        </p>
                      </div>
                    </div>

                    {isNextUnlocked ? (
                      <button
                        type="button"
                        onClick={() => selectUnlockedCourse(nextLesson.id, 'learn')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                      >
                        <span>
                          {t.academy.continueToCourse} {String(nextLesson.number).padStart(2, '0')}
                        </span>
                        <NextArrow className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                        {t.academy.lockedLabel}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPhase('lab')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <PrevArrow className="w-3.5 h-3.5" />
                    <span>{t.academy.backToLab}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPracticeSymbol(activeLesson.practiceSymbol)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span>
                      {t.academy.practiceOnChart} <span dir="ltr">{activeLesson.practiceSymbol}</span>
                    </span>
                    <NextArrow className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};
```

### `src/components/AccountDrawer.tsx`

```tsx
import React, {useState} from 'react';
import {Bell, Globe, HelpCircle, Moon, RotateCcw, Sun, X} from 'lucide-react';
import {formatUsd} from '../data/instruments';
import {LANGUAGE_OPTIONS, useLanguage} from '../i18n/LanguageContext';
import type {NotificationPrefs} from '../types/trading';
import {PWAInstallButton} from './PWAInstallButton';

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  beginnerHints: boolean;
  onToggleBeginnerHints: () => void;
  initialCapital: number;
  totalEquity: number;
  onResetAccount: (capital: number) => void;
  onResetAcademy: () => void;
  permission: NotificationPermission | 'unsupported';
  onRequestPush: () => Promise<unknown>;
  onSendTestPush: () => void;
  prefs: NotificationPrefs;
  onUpdatePrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  open,
  onClose,
  theme,
  onToggleTheme,
  beginnerHints,
  onToggleBeginnerHints,
  initialCapital,
  totalEquity,
  onResetAccount,
  onResetAcademy,
  permission,
  onRequestPush,
  onSendTestPush,
  prefs,
  onUpdatePrefs,
}) => {
  const {lang, setLang, t} = useLanguage();
  const [selectedCapital, setSelectedCapital] = useState<number>(initialCapital || 100000);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]">
      <div
        role="dialog"
        aria-label={t.drawer.title}
        className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-[#0F1623] border-s border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {t.drawer.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.drawer.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selector */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.common.language}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    active
                      ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{opt.nativeLabel}</span>
                  <span className="font-mono text-[10px] opacity-70">{opt.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Display & Beginner Guidance */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.displayLearning}</h3>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
              {t.drawer.colorTheme}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleBeginnerHints}
            className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-start"
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.drawer.beginnerHints}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {t.drawer.beginnerHintsSub}
                </span>
              </span>
            </span>
            <span className={`text-xs font-semibold shrink-0 ms-2 ${beginnerHints ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {beginnerHints ? t.drawer.on : t.drawer.off}
            </span>
          </button>
        </section>

        {/* Push Notifications */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.pushNotifications}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.drawer.browserStatus}: {permission}
            </span>
          </div>

          <div className="flex gap-2">
            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                type="button"
                onClick={() => void onRequestPush()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                {t.drawer.enableBrowserPush}
              </button>
            )}
            <button
              type="button"
              onClick={onSendTestPush}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.drawer.sendTestNotification}
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {[
              {key: 'marketAlerts' as const, label: t.drawer.prefMarketAlerts},
              {key: 'orderFills' as const, label: t.drawer.prefOrderFills},
              {key: 'stopTakeTriggers' as const, label: t.drawer.prefStopTake},
            ].map((row) => (
              <label
                key={row.key}
                className="flex items-center justify-between py-1.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>{row.label}</span>
                <input
                  type="checkbox"
                  checked={prefs[row.key]}
                  onChange={(e) => onUpdatePrefs((prev) => ({...prev, [row.key]: e.target.checked}))}
                  className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Paper Account Reset */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.paperAccount}</h3>
            <span className="font-mono text-xs font-medium text-slate-900 dark:text-white" dir="ltr">
              {t.drawer.equity}: {formatUsd(totalEquity)}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">{t.drawer.paperDesc}</p>

          <div className="grid grid-cols-3 gap-2" dir="ltr">
            {[10000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedCapital(amt)}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                  selectedCapital === amt
                    ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {formatUsd(amt).replace('.00', '')}
              </button>
            ))}
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.drawer.resetAccountTo} {formatUsd(selectedCapital).replace('.00', '')}
            </button>
          ) : (
            <div className="p-3 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 space-y-2">
              <p className="text-xs text-red-700 dark:text-red-300">{t.drawer.resetWarning}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetAccount(selectedCapital);
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 cursor-pointer"
                >
                  {t.common.confirmReset}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onResetAcademy}
            className="w-full py-2 px-3 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {t.drawer.resetAcademy}
          </button>
        </section>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
```

### `src/components/AchievementsSection.tsx`

```tsx
import React from 'react';
import {
  Award,
  BookmarkCheck,
  CandlestickChart,
  CheckCircle2,
  Flame,
  GraduationCap,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {AchievementId, AchievementStatus} from '../types/trading';

interface AchievementsSectionProps {
  achievements: AchievementStatus[];
  unlockedCount: number;
  totalCount: number;
}

const BADGE_META: Record<
  AchievementId,
  {
    icon: React.ComponentType<{className?: string}>;
    accentRing: string;
    accentSurface: string;
    accentText: string;
  }
> = {
  'first-trade': {
    icon: CandlestickChart,
    accentRing: 'border-blue-500/45',
    accentSurface: 'bg-blue-500/12',
    accentText: 'text-blue-600 dark:text-blue-400',
  },
  'perfect-quiz': {
    icon: Award,
    accentRing: 'border-amber-500/45',
    accentSurface: 'bg-amber-500/12',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  'streak-7': {
    icon: Flame,
    accentRing: 'border-orange-500/45',
    accentSurface: 'bg-orange-500/12',
    accentText: 'text-orange-600 dark:text-orange-400',
  },
  'risk-protector': {
    icon: ShieldCheck,
    accentRing: 'border-emerald-500/45',
    accentSurface: 'bg-emerald-500/12',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  'playbook-collector': {
    icon: BookmarkCheck,
    accentRing: 'border-indigo-500/45',
    accentSurface: 'bg-indigo-500/12',
    accentText: 'text-indigo-600 dark:text-indigo-400',
  },
  'course-graduate': {
    icon: GraduationCap,
    accentRing: 'border-emerald-500/50',
    accentSurface: 'bg-emerald-500/14',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
};

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  unlockedCount,
  totalCount,
}) => {
  const {t, lang} = useLanguage();

  const dateFmt = new Intl.DateTimeFormat(lang, {month: 'short', day: 'numeric'});

  const getBadgeCopy = (id: AchievementId) => {
    switch (id) {
      case 'first-trade':
        return {title: t.achievements.firstTradeTitle, desc: t.achievements.firstTradeDesc, unit: ''};
      case 'perfect-quiz':
        return {title: t.achievements.perfectQuizTitle, desc: t.achievements.perfectQuizDesc, unit: '%'};
      case 'streak-7':
        return {title: t.achievements.streak7Title, desc: t.achievements.streak7Desc, unit: ''};
      case 'risk-protector':
        return {title: t.achievements.riskProtectorTitle, desc: t.achievements.riskProtectorDesc, unit: ''};
      case 'playbook-collector':
        return {title: t.achievements.playbookCollectorTitle, desc: t.achievements.playbookCollectorDesc, unit: ''};
      case 'course-graduate':
        return {title: t.achievements.courseGraduateTitle, desc: t.achievements.courseGraduateDesc, unit: ''};
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg border border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              {t.achievements.sectionTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.achievements.sectionSub}
            </p>
          </div>
        </div>

        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">
          <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums me-1.5" dir="ltr">
            {unlockedCount}/{totalCount}
          </span>
          <span>{t.achievements.unlockedCountLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map((item) => {
          const meta = BADGE_META[item.id];
          const Icon = meta.icon;
          const copy = getBadgeCopy(item.id);
          const pct = item.target > 0 ? Math.min(100, Math.round((item.current / item.target) * 100)) : 0;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                item.unlocked
                  ? 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#0B111E]'
                  : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/30 dark:bg-[#090D16]/60 opacity-85'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Unique Medallion Emblem */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                      item.unlocked
                        ? `${meta.accentRing} ${meta.accentSurface} ${meta.accentText}`
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.unlocked && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0B111E]"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    {item.unlocked ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        <span>{t.achievements.badgeUnlocked}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
                        <Lock className="w-3 h-3" />
                        <span>{t.achievements.badgeLocked}</span>
                      </span>
                    )}

                    {item.unlocked && item.unlockedAt ? (
                      <span className="font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                        {dateFmt.format(new Date(item.unlockedAt))}
                      </span>
                    ) : (
                      <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums" dir="ltr">
                        {item.current}
                        {copy.unit}/{item.target}
                        {copy.unit}
                      </span>
                    )}
                  </div>

                  <p className="font-display text-sm font-semibold text-slate-900 dark:text-white mt-1 leading-snug">
                    {copy.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {copy.desc}
                  </p>
                </div>
              </div>

              {/* Progress Rail */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.unlocked ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-blue-600/70 dark:bg-blue-500/70'
                  }`}
                  style={{width: `${item.unlocked ? 100 : pct}%`}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
```

### `src/components/AlertsCenter.tsx`

```tsx
import React, {useEffect, useState} from 'react';
import {Bell, Check, Pause, Play, Trash2} from 'lucide-react';
import {INSTRUMENTS, INSTRUMENT_MAP, formatPrice} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppNotification, MarketQuote, NotificationPrefs, PriceAlert} from '../types/trading';

interface AlertsCenterProps {
  quotes: Record<string, MarketQuote>;
  alerts: PriceAlert[];
  notifications: AppNotification[];
  permission: NotificationPermission | 'unsupported';
  prefs: NotificationPrefs;
  onUpdatePrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
  onRequestPush: () => Promise<unknown>;
  onSendTestPush: () => void;
  onCreateAlert: (input: {
    symbol: string;
    condition: 'above' | 'below';
    targetPrice: number;
    note?: string;
    recurring?: boolean;
  }) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  quotes,
  alerts,
  notifications,
  permission,
  prefs,
  onUpdatePrefs,
  onRequestPush,
  onSendTestPush,
  onCreateAlert,
  onToggleAlert,
  onDeleteAlert,
  onMarkAllRead,
  onClearNotifications,
}) => {
  const {t} = useLanguage();
  const [symbol, setSymbol] = useState('BTC/USD');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetInput, setTargetInput] = useState('');
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);

  const liveQuote = quotes[symbol];
  const inst = INSTRUMENT_MAP.get(symbol) ?? INSTRUMENTS[0];

  useEffect(() => {
    if (liveQuote && !targetInput) {
      setTargetInput((liveQuote.price * 1.01).toFixed(inst.decimals));
    }
  }, [liveQuote, inst.decimals, targetInput]);

  const applyOffset = (pct: number) => {
    if (!liveQuote) return;
    setCondition(pct >= 0 ? 'above' : 'below');
    setTargetInput((liveQuote.price * (1 + pct / 100)).toFixed(inst.decimals));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPrice = parseFloat(targetInput);
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) return;
    onCreateAlert({symbol, condition, targetPrice, note, recurring});
    setNote('');
  };

  const categoryLabel = (cat: AppNotification['category']) => {
    if (cat === 'market-alert') return t.alerts.catMarket;
    if (cat === 'learning') return t.alerts.catLearning;
    return t.alerts.catPortfolio;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.alerts.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.alerts.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {permission !== 'granted' && permission !== 'unsupported' && (
            <button
              type="button"
              onClick={() => void onRequestPush()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              {t.alerts.enablePushBtn}
            </button>
          )}
          <button
            type="button"
            onClick={onSendTestPush}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t.alerts.testBtn}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{t.alerts.pushDelivery}</span>{' '}
          {permission === 'granted'
            ? t.alerts.statusGranted
            : permission === 'denied'
              ? t.alerts.statusDenied
              : t.alerts.statusDefault}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.marketAlerts}
              onChange={(e) => onUpdatePrefs((p) => ({...p, marketAlerts: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.priceTargets}
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.orderFills}
              onChange={(e) => onUpdatePrefs((p) => ({...p, orderFills: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.orderFills}
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.stopTakeTriggers}
              onChange={(e) => onUpdatePrefs((p) => ({...p, stopTakeTriggers: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.slTpExits}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.alerts.createTitle}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="alert-symbol" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.alerts.marketPair}
              </label>
              <select
                id="alert-symbol"
                value={symbol}
                onChange={(e) => {
                  const nextSym = e.target.value;
                  setSymbol(nextSym);
                  const q = quotes[nextSym];
                  const nextInst = INSTRUMENT_MAP.get(nextSym);
                  if (q && nextInst) {
                    setTargetInput((q.price * 1.01).toFixed(nextInst.decimals));
                  }
                }}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                {INSTRUMENTS.map((i) => (
                  <option key={i.symbol} value={i.symbol}>
                    {i.symbol} — {i.name}
                  </option>
                ))}
              </select>
              {liveQuote && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {t.alerts.currentPrice} <span dir="ltr">{formatPrice(liveQuote.price, symbol)}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="alert-cond" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.alerts.notifyWhenPrice}
                </label>
                <select
                  id="alert-cond"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="above">{t.alerts.risesAbove}</option>
                  <option value="below">{t.alerts.dropsBelow}</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-price" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.alerts.targetPrice}
                </label>
                <input
                  id="alert-price"
                  type="number"
                  dir="ltr"
                  step="any"
                  required
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5" dir="ltr">
              {[-2, -0.5, 0.5, 2].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyOffset(pct)}
                  className="py-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="alert-note" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.alerts.noteLabel}
              </label>
              <input
                id="alert-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.alerts.notePlaceholder}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="accent-blue-600 cursor-pointer"
              />
              {t.alerts.recurringLabel}
            </label>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              {t.alerts.createBtn}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.alerts.yourAlerts} ({alerts.length})
            </h3>
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                {t.alerts.noAlerts}
              </p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {alerts.map((al) => {
                  const q = quotes[al.symbol];
                  const distPct = q ? ((al.targetPrice - q.price) / q.price) * 100 : null;
                  return (
                    <div key={al.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          <span dir="ltr">{al.symbol}</span>{' '}
                          <span className="font-normal text-slate-500">
                            {al.condition === 'above' ? '≥' : '≤'}{' '}
                            <span className="font-mono font-medium text-slate-800 dark:text-slate-200" dir="ltr">
                              {formatPrice(al.targetPrice, al.symbol)}
                            </span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {al.active ? t.alerts.watchingLive : t.alerts.triggeredPaused}
                          {distPct !== null ? ` · ${distPct >= 0 ? '+' : ''}${distPct.toFixed(2)}% ${t.alerts.away}` : ''}
                          {al.note ? ` · ${al.note}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(al.id)}
                          aria-label={al.active ? 'Pause' : 'Resume'}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {al.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(al.id)}
                          aria-label="Delete"
                          className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.alerts.feedTitle} ({notifications.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.alerts.feedSub}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t.alerts.markRead}
                </button>
                <button
                  type="button"
                  onClick={onClearNotifications}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                >
                  {t.alerts.clear}
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              {t.alerts.noNotifications}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {notifications.map((ntf) => (
                <div
                  key={ntf.id}
                  className={`py-3 flex items-start justify-between gap-4 ${
                    ntf.read ? 'opacity-75' : ''
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{categoryLabel(ntf.category)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono" dir="ltr">
                        {new Date(ntf.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                      </span>
                      {!ntf.read && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{t.alerts.newBadge}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{ntf.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{ntf.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
```

### `src/components/CandlestickChart.tsx`

```tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {formatPrice} from '../data/instruments';
import type {Candle, Position} from '../types/trading';
import {useLanguage} from '../i18n/LanguageContext';

interface IndicatorConfig {
  sma20: boolean;
  ema50: boolean;
  bollinger: boolean;
  rsi: boolean;
}

interface CandlestickChartProps {
  symbol: string;
  candles: Candle[];
  livePrice?: number;
  positions: Position[];
  chartMode: 'candles' | 'line';
  indicators: IndicatorConfig;
  theme: 'dark' | 'light';
}

function calcSMA(values: number[], period: number): Array<number | null> {
  return values.map((_, idx) => {
    if (idx < period - 1) return null;
    let sum = 0;
    for (let j = idx - period + 1; j <= idx; j++) sum += values[j];
    return sum / period;
  });
}

function calcEMA(values: number[], period: number): Array<number | null> {
  const k = 2 / (period + 1);
  const out: Array<number | null> = [];
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(null);
    } else if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += values[j];
      prev = sum / period;
      out.push(prev);
    } else {
      prev = values[i] * k + (prev ?? values[i]) * (1 - k);
      out.push(prev);
    }
  }
  return out;
}

function calcBollinger(values: number[], period = 20, mult = 2) {
  const sma = calcSMA(values, period);
  const upper: Array<number | null> = [];
  const lower: Array<number | null> = [];
  for (let i = 0; i < values.length; i++) {
    const mid = sma[i];
    if (mid === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }
    let sq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = values[j] - mid;
      sq += diff * diff;
    }
    const std = Math.sqrt(sq / period);
    upper.push(mid + mult * std);
    lower.push(mid - mult * std);
  }
  return {mid: sma, upper, lower};
}

function calcRSI(values: number[], period = 14): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  if (values.length <= period) return out;

  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  candles,
  livePrice,
  positions,
  chartMode,
  indicators,
  theme,
}) => {
  const {t} = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [size, setSize] = useState({width: 800, height: 380});

  const mergedCandles = useMemo(() => {
    if (candles.length === 0) return [];
    const copy = [...candles];
    if (livePrice && copy.length > 0) {
      const last = {...copy[copy.length - 1]};
      last.close = livePrice;
      last.high = Math.max(last.high, livePrice);
      last.low = Math.min(last.low, livePrice);
      copy[copy.length - 1] = last;
    }
    return copy;
  }, [candles, livePrice]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(300, Math.floor(entry.contentRect.width));
        const h = Math.max(300, Math.floor(entry.contentRect.height));
        setSize({width: w, height: h});
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const computed = useMemo(() => {
    const closes = mergedCandles.map((c) => c.close);
    return {
      sma20: indicators.sma20 ? calcSMA(closes, 20) : [],
      ema50: indicators.ema50 ? calcEMA(closes, 50) : [],
      boll: indicators.bollinger ? calcBollinger(closes, 20, 2) : null,
      rsi: indicators.rsi ? calcRSI(closes, 14) : [],
    };
  }, [mergedCandles, indicators]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mergedCandles.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDark = theme === 'dark';
    const colors = {
      bg: isDark ? '#0F1623' : '#FFFFFF',
      grid: isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.06)',
      text: isDark ? '#94A3B8' : '#64748B',
      up: isDark ? '#10B981' : '#059669',
      down: isDark ? '#EF4444' : '#DC2626',
      line: isDark ? '#3B82F6' : '#2563EB',
      sma: '#F59E0B',
      ema: '#8B5CF6',
      boll: isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.45)',
      bollFill: isDark ? 'rgba(56, 189, 248, 0.06)' : 'rgba(2, 132, 199, 0.05)',
      crosshair: isDark ? 'rgba(226, 232, 240, 0.35)' : 'rgba(15, 23, 42, 0.3)',
    };

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size.width, size.height);

    const padRight = 76;
    const padLeft = 10;
    const padTop = 14;
    const padBottom = 26;
    const rsiHeight = indicators.rsi ? 76 : 0;
    const rsiGap = indicators.rsi ? 14 : 0;
    const plotW = size.width - padLeft - padRight;
    const plotH = size.height - padTop - padBottom - rsiHeight - rsiGap;

    const count = mergedCandles.length;
    const stepX = plotW / count;
    const candleW = Math.max(2, Math.min(12, stepX * 0.66));

    // Min/max price across visible candles + active indicators + symbol positions
    let minP = Infinity;
    let maxP = -Infinity;
    let maxVol = 0;

    for (let i = 0; i < count; i++) {
      const c = mergedCandles[i];
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
      if (computed.boll?.upper[i]) maxP = Math.max(maxP, computed.boll.upper[i]!);
      if (computed.boll?.lower[i]) minP = Math.min(minP, computed.boll.lower[i]!);
    }
    for (const p of positions) {
      if (p.symbol !== symbol) continue;
      minP = Math.min(minP, p.entryPrice);
      maxP = Math.max(maxP, p.entryPrice);
      if (p.stopLoss) {
        minP = Math.min(minP, p.stopLoss);
        maxP = Math.max(maxP, p.stopLoss);
      }
      if (p.takeProfit) {
        minP = Math.min(minP, p.takeProfit);
        maxP = Math.max(maxP, p.takeProfit);
      }
    }

    const span = Math.max(maxP - minP, maxP * 0.002);
    minP -= span * 0.08;
    maxP += span * 0.08;

    const priceToY = (p: number) => padTop + ((maxP - p) / (maxP - minP)) * plotH;
    const idxToX = (i: number) => padLeft + (i + 0.5) * stepX;

    // Horizontal grid & price axis labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const gridSteps = 5;
    for (let g = 0; g <= gridSteps; g++) {
      const val = minP + ((maxP - minP) * g) / gridSteps;
      const y = priceToY(val);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(size.width - padRight, y);
      ctx.stroke();

      ctx.fillStyle = colors.text;
      ctx.fillText(formatPrice(val, symbol), size.width - padRight + 6, y);
    }

    // Volume bars in bottom 18% of main plot
    const volMaxH = plotH * 0.18;
    for (let i = 0; i < count; i++) {
      const c = mergedCandles[i];
      const vh = maxVol > 0 ? (c.volume / maxVol) * volMaxH : 0;
      const x = idxToX(i) - candleW / 2;
      const y = padTop + plotH - vh;
      ctx.fillStyle = c.close >= c.open ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)';
      ctx.fillRect(x, y, candleW, vh);
    }

    // Bollinger fill + bands
    if (indicators.bollinger && computed.boll) {
      const {upper, lower} = computed.boll;
      ctx.fillStyle = colors.bollFill;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < count; i++) {
        if (upper[i] === null) continue;
        const x = idxToX(i);
        const y = priceToY(upper[i]!);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      for (let i = count - 1; i >= 0; i--) {
        if (lower[i] === null) continue;
        ctx.lineTo(idxToX(i), priceToY(lower[i]!));
      }
      ctx.closePath();
      ctx.fill();

      const drawBand = (arr: Array<number | null>) => {
        ctx.strokeStyle = colors.boll;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let st = false;
        for (let i = 0; i < count; i++) {
          if (arr[i] === null) continue;
          const x = idxToX(i);
          const y = priceToY(arr[i]!);
          if (!st) {
            ctx.moveTo(x, y);
            st = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };
      drawBand(upper);
      drawBand(lower);
    }

    // Price rendering: Candles or Beginner Line Mode
    if (chartMode === 'line') {
      const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
      grad.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.2)');
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const x = idxToX(i);
        const y = priceToY(mergedCandles[i].close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.lineTo(idxToX(count - 1), padTop + plotH);
      ctx.lineTo(idxToX(0), padTop + plotH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      for (let i = 0; i < count; i++) {
        const c = mergedCandles[i];
        const x = idxToX(i);
        const isUp = c.close >= c.open;
        const col = isUp ? colors.up : colors.down;

        const yHigh = priceToY(c.high);
        const yLow = priceToY(c.low);
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);

        // Wick
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(yOpen, yClose);
        const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));
        ctx.fillStyle = col;
        ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      }
    }

    // Overlay MAs
    const drawMA = (arr: Array<number | null>, color: string) => {
      if (arr.length === 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < count; i++) {
        if (arr[i] === null) continue;
        const x = idxToX(i);
        const y = priceToY(arr[i]!);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };
    if (indicators.sma20) drawMA(computed.sma20, colors.sma);
    if (indicators.ema50) drawMA(computed.ema50, colors.ema);

    // Active position Entry / SL / TP lines on chart
    for (const pos of positions) {
      if (pos.symbol !== symbol) continue;
      const drawLevel = (price: number, color: string, label: string) => {
        const y = priceToY(price);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(size.width - padRight, y);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillText(label, padLeft + 6, y - 7);
        ctx.restore();
      };
      drawLevel(pos.entryPrice, '#3B82F6', `Entry (${pos.side.toUpperCase()})`);
      if (pos.stopLoss) drawLevel(pos.stopLoss, colors.down, 'Stop-Loss');
      if (pos.takeProfit) drawLevel(pos.takeProfit, colors.up, 'Take-Profit');
    }

    // Live price line + pill tag on right axis
    const lastCandle = mergedCandles[count - 1];
    if (lastCandle) {
      const lp = lastCandle.close;
      const y = priceToY(lp);
      const isUp = lp >= lastCandle.open;
      const tagCol = isUp ? colors.up : colors.down;

      ctx.save();
      ctx.strokeStyle = tagCol;
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(size.width - padRight, y);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = tagCol;
      ctx.fillRect(size.width - padRight + 2, y - 9, padRight - 4, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillText(formatPrice(lp, symbol), size.width - padRight + 6, y);
    }

    // RSI Sub-pane
    if (indicators.rsi && computed.rsi.length > 0) {
      const rsiTop = padTop + plotH + rsiGap;
      ctx.strokeStyle = colors.grid;
      ctx.strokeRect(padLeft, rsiTop, plotW, rsiHeight);

      const y70 = rsiTop + ((100 - 70) / 100) * rsiHeight;
      const y30 = rsiTop + ((100 - 30) / 100) * rsiHeight;
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = isDark ? 'rgba(239,68,68,0.35)' : 'rgba(220,38,38,0.3)';
      ctx.beginPath();
      ctx.moveTo(padLeft, y70);
      ctx.lineTo(padLeft + plotW, y70);
      ctx.stroke();

      ctx.strokeStyle = isDark ? 'rgba(16,185,129,0.35)' : 'rgba(5,150,105,0.3)';
      ctx.beginPath();
      ctx.moveTo(padLeft, y30);
      ctx.lineTo(padLeft + plotW, y30);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = colors.text;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('RSI 70', size.width - padRight + 6, y70);
      ctx.fillText('RSI 30', size.width - padRight + 6, y30);

      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let st = false;
      for (let i = 0; i < count; i++) {
        const val = computed.rsi[i];
        if (val === null) continue;
        const x = idxToX(i);
        const y = rsiTop + ((100 - val) / 100) * rsiHeight;
        if (!st) {
          ctx.moveTo(x, y);
          st = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Time axis labels (5 ticks)
    const timeY = size.height - 10;
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.font = '10px "JetBrains Mono", monospace';
    const labelStep = Math.max(1, Math.floor(count / 5));
    for (let i = 0; i < count; i += labelStep) {
      const d = new Date(mergedCandles[i].time);
      const label = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      ctx.fillText(label, idxToX(i), timeY);
    }

    // Crosshair
    if (hoverIndex !== null && mergedCandles[hoverIndex]) {
      const x = idxToX(hoverIndex);
      ctx.save();
      ctx.strokeStyle = colors.crosshair;
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, size.height - padBottom);
      ctx.stroke();
      ctx.restore();
    }
  }, [mergedCandles, size, theme, chartMode, indicators, computed, positions, symbol, hoverIndex]);

  const activeCandle = hoverIndex !== null ? mergedCandles[hoverIndex] : mergedCandles[mergedCandles.length - 1];
  const activeRsi =
    hoverIndex !== null ? computed.rsi[hoverIndex] : computed.rsi[computed.rsi.length - 1];

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || mergedCandles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padLeft = 10;
    const padRight = 76;
    const plotW = size.width - padLeft - padRight;
    const rel = Math.max(0, Math.min(plotW, x - padLeft));
    const idx = Math.min(mergedCandles.length - 1, Math.max(0, Math.floor((rel / plotW) * mergedCandles.length)));
    setHoverIndex(idx);
  };

  return (
    <div className="relative w-full" dir="ltr">
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 px-3 py-2 border-b border-slate-200 dark:border-slate-800">
          <span>
            O <strong className="text-slate-900 dark:text-slate-100">{formatPrice(activeCandle.open, symbol)}</strong>
          </span>
          <span>
            H <strong className="text-slate-900 dark:text-slate-100">{formatPrice(activeCandle.high, symbol)}</strong>
          </span>
          <span>
            L <strong className="text-slate-900 dark:text-slate-100">{formatPrice(activeCandle.low, symbol)}</strong>
          </span>
          <span>
            C{' '}
            <strong
              className={
                activeCandle.close >= activeCandle.open
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              {formatPrice(activeCandle.close, symbol)}
            </strong>
          </span>
          {indicators.rsi && activeRsi !== null && activeRsi !== undefined && (
            <span>
              RSI(14) <strong className="text-purple-600 dark:text-purple-400">{activeRsi.toFixed(1)}</strong>
            </span>
          )}
        </div>
      )}

      <div ref={containerRef} className="w-full h-[360px] sm:h-[410px]">
        {mergedCandles.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            {t.common.loadingChart}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
            className="w-full h-full block cursor-crosshair"
          />
        )}
      </div>
    </div>
  );
};
```

### `src/components/EquityCurveChart.tsx`

```tsx
import React, {useState} from 'react';
import {formatUsd} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {EquityPoint} from '../types/trading';

interface EquityCurveChartProps {
  points: EquityPoint[];
  initialCapital: number;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({points, initialCapital}) => {
  const {t} = useLanguage();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (points.length < 2) {
    return (
      <div className="h-52 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg px-4 text-center">
        {t.overview.equityCurveEmpty}
      </div>
    );
  }

  const width = 640;
  const height = 210;
  const padL = 12;
  const padR = 12;
  const padT = 16;
  const padB = 22;

  const vals = points.map((p) => p.equity);
  const minVal = Math.min(...vals, initialCapital);
  const maxVal = Math.max(...vals, initialCapital);
  const span = Math.max(maxVal - minVal, initialCapital * 0.005);
  const yMin = minVal - span * 0.12;
  const yMax = maxVal + span * 0.12;

  const getX = (i: number) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const getY = (v: number) => padT + ((yMax - v) / (yMax - yMin)) * (height - padT - padB);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.equity).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${getX(points.length - 1).toFixed(1)} ${(height - padB).toFixed(1)} L ${getX(0).toFixed(1)} ${(height - padB).toFixed(1)} Z`;

  const latest = points[points.length - 1].equity;
  const isPositive = latest >= initialCapital;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';
  const baseLineY = getY(initialCapital);

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];
  const activeChange = activePoint.equity - initialCapital;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {hoverIdx !== null ? new Date(activePoint.time).toLocaleString() : t.overview.latestEquity}
        </span>
        <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">
          {formatUsd(activePoint.equity)}{' '}
          <span className={activeChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
            ({formatUsd(activeChange, true)})
          </span>
        </span>
      </div>

      <div dir="ltr">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.24" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line
            x1={padL}
            y1={baseLineY}
            x2={width - padR}
            y2={baseLineY}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          <path d={areaPath} fill="url(#eqGrad)" />
          <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinejoin="round" />

          {points.map((pt, i) => (
            <circle
              key={pt.time + '-' + i}
              cx={getX(i)}
              cy={getY(pt.equity)}
              r={hoverIdx === i ? 5 : 10}
              fill={hoverIdx === i ? strokeColor : 'transparent'}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
```

### `src/components/LeaderboardPanel.tsx`

```tsx
import React, {useState} from 'react';
import {Check, ChevronDown, ChevronUp, Crown, Pencil, Trophy} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {LeaderboardEntry} from '../types/trading';

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry;
  aboveEntry: LeaderboardEntry | null;
  xpToNextRank: number;
  customName: string;
  onUpdateName: (name: string) => void;
  compact: boolean;
  onExpandSidebar: () => void;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  entries,
  userEntry,
  aboveEntry,
  xpToNextRank,
  customName,
  onUpdateName,
  compact,
  onExpandSidebar,
}) => {
  const {t} = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(customName);

  if (compact) {
    return (
      <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          type="button"
          onClick={onExpandSidebar}
          title={`${t.leaderboard.title} · #${userEntry.rank} (${userEntry.totalXp} XP)`}
          aria-label={`${t.leaderboard.title} #${userEntry.rank}`}
          className="relative w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-amber-500 transition-colors cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span
            dir="ltr"
            className="absolute top-1.5 end-1 font-mono text-[9px] font-bold text-slate-700 dark:text-slate-200 tabular-nums"
          >
            #{userEntry.rank}
          </span>
        </button>
      </div>
    );
  }

  const visibleEntries = showAll
    ? entries
    : entries.filter((e) => e.rank <= 3 || e.isCurrentUser);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(draftName);
    setEditing(false);
  };

  return (
    <div className="pt-4 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
      {/* Header Row */}
      <div className="px-2 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 truncate">
          <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="truncate">{t.leaderboard.title}</span>
        </span>
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums shrink-0" dir="ltr">
          #{userEntry.rank}/{entries.length}
        </span>
      </div>

      {/* User XP Summary & Inline Name Edit */}
      <div className="mx-1 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] p-2.5 space-y-2">
        {editing ? (
          <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder={t.leaderboard.selfDefaultName}
              maxLength={24}
              autoFocus
              className="min-w-0 flex-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-2 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              aria-label={t.leaderboard.saveName}
              className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shrink-0"
            >
              <Check className="w-3 h-3" />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {userEntry.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(customName);
                    setEditing(true);
                  }}
                  aria-label={t.leaderboard.editName}
                  title={t.leaderboard.editName}
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                {t.leaderboard.lessonsShort}: <span dir="ltr">{userEntry.lessonXp}</span> ·{' '}
                {t.leaderboard.missionsShort}: <span dir="ltr">{userEntry.missionXp}</span>
              </div>
            </div>

            <div className="text-end shrink-0">
              <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums" dir="ltr">
                {userEntry.totalXp} XP
              </div>
              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 tabular-nums" dir="ltr">
                {t.leaderboard.levelPrefix}{userEntry.level}
              </div>
            </div>
          </div>
        )}

        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-slate-800/80">
          {aboveEntry ? (
            <span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums" dir="ltr">
                +{xpToNextRank}
              </span>{' '}
              {t.leaderboard.xpToNext} <span className="font-mono" dir="ltr">#{aboveEntry.rank}</span>
            </span>
          ) : (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t.leaderboard.topRankReached}
            </span>
          )}
        </div>
      </div>

      {/* Ranked Cohort Rows */}
      <div className="space-y-1">
        {visibleEntries.map((entry, index) => {
          const prevEntry = index > 0 ? visibleEntries[index - 1] : null;
          const hasGap = prevEntry && entry.rank - prevEntry.rank > 1;

          const rankColor =
            entry.rank === 1
              ? 'text-amber-500 dark:text-amber-400'
              : entry.rank === 2
                ? 'text-slate-500 dark:text-slate-300'
                : entry.rank === 3
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-slate-400 dark:text-slate-500';

          return (
            <React.Fragment key={entry.id}>
              {hasGap && (
                <div className="text-center font-mono text-[10px] text-slate-400 dark:text-slate-600 leading-none py-0.5">
                  ···
                </div>
              )}
              <div
                className={`mx-1 px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 text-xs transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-blue-600/10 dark:bg-blue-500/15 ring-1 ring-inset ring-blue-500/30 font-semibold text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    dir="ltr"
                    className={`w-5 font-mono text-[11px] font-bold tabular-nums shrink-0 inline-flex items-center gap-0.5 ${rankColor}`}
                  >
                    {entry.rank === 1 ? <Crown className="w-3 h-3" /> : `#${entry.rank}`}
                  </span>
                  <span className="truncate">{entry.name}</span>
                </div>

                <span
                  dir="ltr"
                  className="font-mono text-[11px] font-semibold tabular-nums shrink-0 text-slate-600 dark:text-slate-300"
                >
                  {entry.totalXp} XP
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowAll((s) => !s)}
        className="w-full px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1 cursor-pointer"
      >
        <span>{showAll ? t.leaderboard.showCompact : t.leaderboard.showAll}</span>
        {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
    </div>
  );
};
```

### `src/components/LessonExampleAnimator.tsx`

```tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {CheckCircle2, Pause, Play, RotateCcw, XCircle} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import {WALKTHROUGH_LESSONS, WALKTHROUGH_UI} from '../i18n/walkthroughTranslations';

interface LessonExampleAnimatorProps {
  lessonId: string;
}

type Mode = 'correct' | 'mistake';

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t);
}

function samplePolyline(pts: Array<[number, number]>, progress: number): Array<[number, number]> {
  if (pts.length === 0) return [];
  const p = clamp(progress);
  if (p <= 0) return [pts[0]];
  if (p >= 1) return pts;

  const totalSegs = pts.length - 1;
  const scaled = p * totalSegs;
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const out = pts.slice(0, idx + 1);
  if (idx < totalSegs) {
    const [x1, y1] = pts[idx];
    const [x2, y2] = pts[idx + 1];
    out.push([lerp(x1, x2, frac), lerp(y1, y2, frac)]);
  }
  return out;
}

function toSvgPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

export const LessonExampleAnimator: React.FC<LessonExampleAnimatorProps> = ({lessonId}) => {
  const {lang} = useLanguage();
  const [mode, setMode] = useState<Mode>('correct');
  const [progress, setProgress] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(true);
  const rafRef = useRef<number | null>(null);

  const ui = WALKTHROUGH_UI[lang];
  const content = WALKTHROUGH_LESSONS[lang][lessonId] ?? WALKTHROUGH_LESSONS.en[lessonId];

  // Auto-play fresh animation whenever lesson or mode changes
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setProgress(1);
      setPlaying(false);
      return;
    }

    setProgress(0.02);
    setPlaying(true);
  }, [lessonId, mode]);

  useEffect(() => {
    if (!playing) return;
    let lastTs: number | null = null;
    const durationMs = 5200;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      setProgress((prev) => {
        const next = prev + dt / durationMs;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const activeStepIdx = useMemo(() => {
    if (progress < 0.36) return 0;
    if (progress < 0.72) return 1;
    return 2;
  }, [progress]);

  if (!content) return null;

  const steps = mode === 'correct' ? content.correctSteps : content.mistakeSteps;
  const summary = mode === 'correct' ? content.correctSummary : content.mistakeSummary;
  const outcome = mode === 'correct' ? content.correctOutcome : content.mistakeOutcome;

  const handleTogglePlay = () => {
    if (progress >= 0.99) {
      setProgress(0.02);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const handleReplay = () => {
    setProgress(0.02);
    setPlaying(true);
  };

  const handleJumpStep = (stepIdx: number) => {
    setPlaying(false);
    setProgress(stepIdx === 0 ? 0.3 : stepIdx === 1 ? 0.65 : 1);
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0D131F] overflow-hidden">
      {/* Header & Mode Switcher */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <span>{ui.badgeLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500 dark:text-slate-400" dir="ltr">
              {content.pairBadge}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {content.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{content.subtitle}</p>
        </div>

        <div
          role="group"
          aria-label="Trade example mode"
          className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            onClick={() => setMode('correct')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{ui.correctWay}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('mistake')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'mistake'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{ui.commonMistake}</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Educational Stage */}
      <div className="p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Left: Animated Visual Stage */}
        <div className="xl:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span
              className={`font-medium ${
                mode === 'correct'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {summary}
            </span>
          </div>

          <div dir="ltr" className="w-full">
            <AnimatedLessonCanvas lessonId={lessonId} mode={mode} progress={progress} />
          </div>

          {/* Playback Controls + Timeline Scrubber */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? ui.pause : progress >= 0.99 ? ui.replay : ui.play}</span>
            </button>

            <button
              type="button"
              onClick={handleReplay}
              aria-label={ui.replay}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 flex items-center gap-2" dir="ltr">
              <input
                type="range"
                aria-label="Animation progress"
                min={0}
                max={100}
                value={Math.round(progress * 100)}
                onChange={(e) => {
                  setPlaying(false);
                  setProgress(Number(e.target.value) / 100);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 w-9 text-right">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3 Interactive Step Breakdown + Outcome */}
        <div className="xl:col-span-5 flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const isActive = activeStepIdx === idx;
              const isReached =
                idx === 0 || (idx === 1 && progress >= 0.36) || (idx === 2 && progress >= 0.72);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJumpStep(idx)}
                  className={`w-full text-start p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? mode === 'correct'
                        ? 'border-emerald-500/60 bg-white dark:bg-[#111827] shadow-xs'
                        : 'border-red-500/60 bg-white dark:bg-[#111827] shadow-xs'
                      : isReached
                        ? 'border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/70 hover:border-slate-300 dark:hover:border-slate-700'
                        : 'border-slate-200/70 dark:border-slate-800/60 bg-white/40 dark:bg-[#111827]/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        isActive
                          ? mode === 'correct'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {ui.stepPrefix} 0{idx + 1}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {step.caption}
                  </p>
                </button>
              );
            })}
          </div>

          <div
            className={`p-3.5 rounded-xl border text-xs ${
              mode === 'correct'
                ? 'border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
                : 'border-red-500/40 bg-red-50/70 dark:bg-red-950/25 text-red-900 dark:text-red-200'
            }`}
          >
            <span className="block text-[11px] opacity-80 font-medium">{ui.outcomeLabel}</span>
            <span className="font-semibold mt-0.5 block">{outcome}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
 * Domain-specific SVG Animated Diagrams for All 8 Lessons
 * ========================================================================== */

const AnimatedLessonCanvas: React.FC<{lessonId: string; mode: Mode; progress: number}> = ({
  lessonId,
  mode,
  progress,
}) => {
  const isCorrect = mode === 'correct';
  const strokeMain = isCorrect ? '#10B981' : '#EF4444';

  // Shared SVG backdrop with subtle horizontal grid
  const Grid = ({splitY}: {splitY?: number}) => (
    <g>
      {[42, 84, 126, 168].map((y) => (
        <line
          key={y}
          x1="28"
          y1={y}
          x2="532"
          y2={y}
          stroke="currentColor"
          className="text-slate-200/80 dark:text-slate-800"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      {splitY && (
        <line
          x1="28"
          y1={splitY}
          x2="532"
          y2={splitY}
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeWidth="1"
        />
      )}
    </g>
  );

  // LESSON 1: Spread & Bid/Ask
  if (lessonId === 'lesson-1') {
    const gap = isCorrect ? 8 : 42;
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 140],
          [140, 134],
          [240, 122],
          [350, 96],
          [495, 62],
        ]
      : [
          [40, 145],
          [140, 142],
          [260, 132],
          [380, 124],
          [495, 118],
        ];
    const sampled = samplePolyline(pts, progress);
    const askLine = sampled.map(([x, y]): [number, number] => [x, y - gap / 2]);
    const bidLine = sampled.map(([x, y]): [number, number] => [x, y + gap / 2]);
    const lastAsk = askLine[askLine.length - 1];
    const lastBid = bidLine[bidLine.length - 1];
    const entryAskY = pts[0][1] - gap / 2;
    const currentPnl = isCorrect
      ? lerp(-1, 49, progress)
      : lerp(-75, -25, progress);

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {/* Entry Ask reference */}
        <line
          x1="40"
          y1={entryAskY}
          x2="510"
          y2={entryAskY}
          stroke="#3B82F6"
          strokeDasharray="4 3"
          strokeWidth="1.2"
        />
        <text x="44" y={entryAskY - 6} className="fill-blue-500 text-[10px] font-mono">
          Entry (Ask)
        </text>

        {/* Ask & Bid Paths */}
        <path d={toSvgPath(askLine)} fill="none" stroke="#10B981" strokeWidth="2.2" />
        <path d={toSvgPath(bidLine)} fill="none" stroke="#F59E0B" strokeWidth="2.2" />

        {/* Live dots */}
        <circle cx={lastAsk[0]} cy={lastAsk[1]} r="4.5" fill="#10B981" />
        <circle cx={lastBid[0]} cy={lastBid[1]} r="4.5" fill="#F59E0B" />

        {/* Gap Bracket */}
        <line
          x1={lastAsk[0] + 10}
          y1={lastAsk[1]}
          x2={lastBid[0] + 10}
          y2={lastBid[1]}
          stroke={isCorrect ? '#10B981' : '#EF4444'}
          strokeWidth="2"
        />
        <text
          x={Math.min(470, lastAsk[0] + 16)}
          y={(lastAsk[1] + lastBid[1]) / 2 + 3}
          className="fill-slate-600 dark:fill-slate-300 text-[10px] font-mono"
        >
          {isCorrect ? '0.02% Spread' : '1.50% Spread'}
        </text>

        {/* Live Readout Box */}
        <rect
          x="355"
          y="16"
          width="175"
          height="32"
          rx="6"
          className="fill-slate-100 dark:fill-slate-800/90"
        />
        <text
          x="442"
          y="36"
          textAnchor="middle"
          className={`text-xs font-mono font-bold ${
            currentPnl >= 0 ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
          }`}
        >
          Live P&L: {currentPnl >= 0 ? `+$${currentPnl.toFixed(2)}` : `-$${Math.abs(currentPnl).toFixed(2)}`}
        </text>
      </svg>
    );
  }

  // LESSON 2: Limit, Stop-Loss & Take-Profit
  if (lessonId === 'lesson-2') {
    const tpY = 44;
    const limitY = 122;
    const slY = 166;

    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 92],
          [110, 102],
          [185, limitY],
          [260, 108],
          [355, 76],
          [465, tpY],
          [505, tpY],
        ]
      : [
          [40, 105],
          [120, 56],
          [175, 48],
          [250, 92],
          [340, 136],
          [430, 174],
          [505, 186],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];
    const filled = isCorrect ? progress >= 0.34 : progress >= 0.28;
    const exited = isCorrect ? progress >= 0.85 : progress >= 0.92;

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {isCorrect ? (
          <>
            <line x1="35" y1={tpY} x2="525" y2={tpY} stroke="#10B981" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={tpY - 6} className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono">
              Take-Profit $93,500
            </text>

            <line x1="35" y1={limitY} x2="525" y2={limitY} stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={limitY - 6} className="fill-blue-600 dark:fill-blue-400 text-[10px] font-mono">
              Buy Limit $89,500
            </text>

            <line x1="35" y1={slY} x2="525" y2={slY} stroke="#EF4444" strokeDasharray="4 3" strokeWidth="1.4" />
            <text x="40" y={slY - 6} className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
              Stop-Loss $87,500
            </text>
          </>
        ) : (
          <text x="40" y="30" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
            No Stop-Loss Set · Chasing Top ($93,500)
          </text>
        )}

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.6" strokeLinecap="round" />

        {filled && (
          <g>
            <circle cx={isCorrect ? 185 : 175} cy={isCorrect ? limitY : 48} r="6" fill={isCorrect ? '#3B82F6' : '#EF4444'} opacity="0.25" />
            <circle cx={isCorrect ? 185 : 175} cy={isCorrect ? limitY : 48} r="3.5" fill={isCorrect ? '#3B82F6' : '#EF4444'} />
          </g>
        )}

        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />

        {exited && (
          <g>
            <rect
              x="355"
              y="148"
              width="170"
              height="30"
              rx="6"
              className={isCorrect ? 'fill-emerald-600' : 'fill-red-600'}
            />
            <text x="440" y="167" textAnchor="middle" className="fill-white text-[11px] font-mono font-bold">
              {isCorrect ? 'TP Hit: +$178.00' : 'Uncapped Loss: -$240.00'}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // LESSON 3: Crypto 24/7 Volatility & BTC Leadership
  if (lessonId === 'lesson-3') {
    const btcPts: Array<[number, number]> = isCorrect
      ? [
          [40, 128],
          [140, 120],
          [260, 100],
          [380, 84],
          [500, 68],
        ]
      : [
          [40, 62],
          [140, 74],
          [260, 92],
          [380, 114],
          [500, 134],
        ];
    const solPts: Array<[number, number]> = isCorrect
      ? [
          [40, 165],
          [140, 158],
          [260, 126],
          [380, 94],
          [500, 48],
        ]
      : [
          [40, 50],
          [140, 84],
          [260, 124],
          [380, 162],
          [500, 190],
        ];

    const btcSample = samplePolyline(btcPts, progress);
    const solSample = samplePolyline(solPts, progress);
    const solTip = solSample[solSample.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <path d={toSvgPath(btcSample)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 3" />
        <path d={toSvgPath(solSample)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={solTip[0]} cy={solTip[1]} r="5" fill={strokeMain} />

        <g className="text-[10px] font-mono">
          <rect x="36" y="14" width="175" height="42" rx="6" className="fill-slate-100 dark:fill-slate-800/90" />
          <text x="48" y="31" className="fill-amber-600 dark:fill-amber-400 font-semibold">
            --- BTC/USD {isCorrect ? '(+4.2% Trend Up)' : '(-4.5% Downtrend)'}
          </text>
          <text x="48" y="47" className={isCorrect ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'}>
            ─── SOL/USD {isCorrect ? '$1.5k Size (+$140)' : '$10k Size (-$950)'}
          </text>
        </g>
      </svg>
    );
  }

  // LESSON 4: Forex Pairs & Pips
  if (lessonId === 'lesson-4') {
    const pts: Array<[number, number]> = isCorrect
      ? [
          [40, 162],
          [150, 142],
          [265, 118],
          [385, 84],
          [500, 52],
        ]
      : [
          [40, 52],
          [150, 82],
          [265, 118],
          [385, 146],
          [500, 168],
        ];
    const sampled = samplePolyline(pts, progress);
    const tip = sampled[sampled.length - 1];
    const pipsVal = Math.round(lerp(0, isCorrect ? 40 : -40, progress));
    const quoteVal = isCorrect
      ? (1.056 + 0.004 * progress).toFixed(4)
      : (1.06 - 0.004 * progress).toFixed(4);

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <line x1="40" y1={pts[0][1]} x2="520" y2={pts[0][1]} stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.2" />
        <text x="44" y={pts[0][1] - 6} className="fill-blue-500 text-[10px] font-mono">
          {isCorrect ? 'Buy EUR/USD @ 1.0560' : 'Mistaken Buy EUR/USD @ 1.0600 (USD Rose)'}
        </text>

        <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />

        <rect x="330" y="16" width="200" height="44" rx="6" className="fill-slate-100 dark:fill-slate-800/90" />
        <text x="342" y="34" className="fill-slate-700 dark:fill-slate-200 text-[11px] font-mono font-semibold">
          EUR/USD: {quoteVal}
        </text>
        <text
          x="342"
          y="50"
          className={`text-[11px] font-mono font-bold ${
            pipsVal >= 0 ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
          }`}
        >
          {pipsVal >= 0 ? `+${pipsVal}` : pipsVal} pips ({pipsVal >= 0 ? `+$${(pipsVal * 0.9425).toFixed(2)}` : `-$${Math.abs(pipsVal * 0.9425).toFixed(2)}`})
        </text>
      </svg>
    );
  }

  // LESSON 5: Reading Candlesticks & Rejection Wicks
  if (lessonId === 'lesson-5') {
    const openY = 98;
    const lowY = 176;
    const highY = 66;
    // Animate candle forming: first dips to low (red), then recovers to hammer close (green)
    const liveCloseY =
      progress < 0.42
        ? lerp(openY, 166, progress / 0.42)
        : lerp(166, 78, (progress - 0.42) / 0.4);
    const liveLowY = progress < 0.42 ? Math.max(openY, liveCloseY) + 8 : lowY;
    const isBullNow = liveCloseY <= openY;
    const candleCol = isBullNow ? '#10B981' : '#EF4444';

    const bodyTop = Math.min(openY, liveCloseY);
    const bodyHeight = Math.max(6, Math.abs(liveCloseY - openY));

    const showFollowCandle = progress > 0.72;
    const followH = clamp((progress - 0.72) / 0.28) * 38;

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        {/* Support Line */}
        <line x1="40" y1="158" x2="520" y2="158" stroke="#3B82F6" strokeDasharray="4 3" strokeWidth="1.2" />
        <text x="44" y="172" className="fill-blue-500 text-[10px] font-mono">
          Key Support Level ($3,100)
        </text>

        {/* Prior Reference Candles */}
        <line x1="120" y1="58" x2="120" y2="108" stroke="#EF4444" strokeWidth="2" />
        <rect x="108" y="66" width="24" height="30" rx="2" fill="#EF4444" />
        <line x1="175" y1="86" x2="175" y2="140" stroke="#EF4444" strokeWidth="2" />
        <rect x="163" y="94" width="24" height="36" rx="2" fill="#EF4444" />

        {/* Live Forming 15m Candle */}
        <line x1="250" y1={Math.min(highY, bodyTop)} x2="250" y2={liveLowY} stroke={candleCol} strokeWidth="2.5" />
        <rect x="234" y={bodyTop} width="32" height={bodyHeight} rx="2" fill={candleCol} />

        {/* Follow-up candle after confirmation */}
        {showFollowCandle && (
          <g>
            <line x1="335" y1={78 - followH - 8} x2="335" y2={84} stroke="#10B981" strokeWidth="2.5" />
            <rect x="319" y={78 - followH} width="32" height={Math.max(4, followH)} rx="2" fill="#10B981" />
          </g>
        )}

        {/* Entry Marker */}
        {isCorrect ? (
          progress >= 0.72 && (
            <g>
              <circle cx="319" cy="78" r="5" fill="#10B981" />
              <text x="380" y="62" className="fill-emerald-600 dark:fill-emerald-400 text-[11px] font-mono font-bold">
                Wait for Hammer Close → Buy (+$160)
              </text>
            </g>
          )
        ) : (
          progress >= 0.25 && (
            <g>
              <circle cx="250" cy="156" r="5" fill="#EF4444" />
              <text x="305" y="148" className="fill-red-600 dark:fill-red-400 text-[11px] font-mono font-bold">
                Sold Mid-Candle Before Close (-$110)
              </text>
            </g>
          )
        )}
      </svg>
    );
  }

  // LESSON 6: SMA 20 + RSI(14)
  if (lessonId === 'lesson-6') {
    const smaPts: Array<[number, number]> = [
      [40, 125],
      [160, 110],
      [280, 94],
      [400, 78],
      [510, 62],
    ];
    const pricePts: Array<[number, number]> = isCorrect
      ? [
          [40, 114],
          [130, 74],
          [235, 96],
          [295, 92],
          [400, 56],
          [505, 32],
        ]
      : [
          [40, 114],
          [140, 64],
          [210, 30],
          [320, 70],
          [440, 92],
          [505, 96],
        ];
    const rsiPts: Array<[number, number]> = isCorrect
      ? [
          [40, 180],
          [130, 162],
          [235, 184],
          [295, 182],
          [400, 168],
          [505, 160],
        ]
      : [
          [40, 180],
          [140, 156],
          [210, 146],
          [320, 174],
          [440, 186],
          [505, 188],
        ];

    const pSample = samplePolyline(pricePts, progress);
    const rSample = samplePolyline(rsiPts, progress);
    const pTip = pSample[pSample.length - 1];
    const rTip = rSample[rSample.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid splitY={140} />
        <path d={toSvgPath(smaPts)} fill="none" stroke="#F59E0B" strokeWidth="2" />
        <text x="42" y="135" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">
          SMA 20 Trend
        </text>

        <path d={toSvgPath(pSample)} fill="none" stroke={strokeMain} strokeWidth="2.5" />
        <circle cx={pTip[0]} cy={pTip[1]} r="4.5" fill={strokeMain} />

        {/* RSI 70 line */}
        <line x1="35" y1="154" x2="520" y2="154" stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" />
        <text x="40" y="151" className="fill-slate-500 text-[9px] font-mono">RSI 70 (Overbought)</text>
        <path d={toSvgPath(rSample)} fill="none" stroke="#A855F7" strokeWidth="2" />
        <circle cx={rTip[0]} cy={rTip[1]} r="4" fill="#A855F7" />

        {/* Highlight Entry */}
        {progress >= 0.42 && (
          <g>
            <circle cx={isCorrect ? 235 : 210} cy={isCorrect ? 96 : 30} r="5.5" fill={isCorrect ? '#10B981' : '#EF4444'} />
            <text
              x={isCorrect ? 248 : 224}
              y={isCorrect ? 112 : 34}
              className={`text-[10px] font-mono font-bold ${isCorrect ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'}`}
            >
              {isCorrect ? 'Pullback to SMA (RSI 42)' : 'Overbought Chase (RSI 82)'}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // LESSON 7: 1% Risk & 1:2 Reward Across 5 Trades
  if (lessonId === 'lesson-7') {
    const trades = isCorrect
      ? [
          {label: '#1', delta: '-$1k', win: false, eqY: 118},
          {label: '#2', delta: '-$1k', win: false, eqY: 132},
          {label: '#3', delta: '+$2k', win: true, eqY: 104},
          {label: '#4', delta: '-$1k', win: false, eqY: 118},
          {label: '#5', delta: '+$2k', win: true, eqY: 88},
        ]
      : [
          {label: '#1', delta: '-$20k', win: false, eqY: 146},
          {label: '#2', delta: '-$16k', win: false, eqY: 186},
        ];

    const startY = 104;
    const eqPts: Array<[number, number]> = [[45, startY]];
    trades.forEach((tr, i) => {
      eqPts.push([125 + i * 95, tr.eqY]);
    });
    const sampledEq = samplePolyline(eqPts, progress);
    const tip = sampledEq[sampledEq.length - 1];

    return (
      <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
        <Grid />
        <line x1="35" y1={startY} x2="525" y2={startY} stroke="#64748B" strokeDasharray="4 4" strokeWidth="1.2" />
        <text x="40" y={startY - 7} className="fill-slate-500 text-[10px] font-mono">
          $100,000 Start
        </text>

        {trades.map((tr, i) => {
          const threshold = (i + 0.5) / trades.length;
          if (progress < threshold) return null;
          const x = 125 + i * 95;
          return (
            <g key={tr.label}>
              <rect
                x={x - 24}
                y={tr.win ? tr.eqY - 34 : tr.eqY + 10}
                width="48"
                height="22"
                rx="4"
                className={tr.win ? 'fill-emerald-600/15' : 'fill-red-600/15'}
              />
              <text
                x={x}
                y={tr.win ? tr.eqY - 19 : tr.eqY + 25}
                textAnchor="middle"
                className={`text-[10px] font-mono font-bold ${
                  tr.win ? 'fill-emerald-600 dark:fill-emerald-400' : 'fill-red-600 dark:fill-red-400'
                }`}
              >
                {tr.delta}
              </text>
            </g>
          );
        })}

        <path d={toSvgPath(sampledEq)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
        <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
      </svg>
    );
  }

  // LESSON 8: Trend Pullback Playbook
  const smaPts: Array<[number, number]> = [
    [40, 166],
    [180, 140],
    [320, 114],
    [495, 80],
  ];
  const pts: Array<[number, number]> = isCorrect
    ? [
        [40, 154],
        [135, 112],
        [235, 130],
        [345, 86],
        [445, 50],
        [500, 44],
      ]
    : [
        [40, 154],
        [135, 108],
        [205, 52],
        [270, 116],
        [350, 80],
        [490, 46],
      ];
  const sampled = samplePolyline(pts, progress);
  const tip = sampled[sampled.length - 1];

  return (
    <svg viewBox="0 0 560 215" className="w-full h-52 select-none">
      <Grid />
      <path d={toSvgPath(smaPts)} fill="none" stroke="#F59E0B" strokeWidth="2" />
      <text x="44" y="182" className="fill-amber-600 dark:fill-amber-400 text-[10px] font-mono">
        Rising SMA 20 Support
      </text>

      {isCorrect ? (
        <>
          <line x1="220" y1="50" x2="515" y2="50" stroke="#10B981" strokeDasharray="4 3" strokeWidth="1.2" />
          <text x="360" y="42" className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono">
            TP 1.0610 (+30 pips)
          </text>
          <line x1="220" y1="154" x2="515" y2="154" stroke="#EF4444" strokeDasharray="4 3" strokeWidth="1.2" />
          <text x="360" y="168" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
            SL 1.0565 (-15 pips)
          </text>
        </>
      ) : (
        <text x="200" y="34" className="fill-red-600 dark:fill-red-400 text-[10px] font-mono">
          FOMO Buy @ 1.0615 → Stopped Out on Pullback!
        </text>
      )}

      <path d={toSvgPath(sampled)} fill="none" stroke={strokeMain} strokeWidth="2.8" />
      {progress >= 0.4 && (
        <circle cx={isCorrect ? 235 : 205} cy={isCorrect ? 130 : 52} r="5.5" fill={isCorrect ? '#3B82F6' : '#EF4444'} />
      )}
      <circle cx={tip[0]} cy={tip[1]} r="5" fill={strokeMain} />
    </svg>
  );
};
```

### `src/components/LessonQuiz.tsx`

```tsx
import React, {useEffect, useState} from 'react';
import {CheckCircle2, XCircle} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {QuizQuestion} from '../types/trading';

interface LessonQuizProps {
  lessonId: string;
  questions: QuizQuestion[];
  bestScore?: number;
  onComplete: (score: number, total: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({lessonId, questions, bestScore, onComplete}) => {
  const {t} = useLanguage();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected({});
    setSubmitted(false);
  }, [lessonId]);

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.reduce((acc, q) => (selected[q.id] === q.correctIndex ? acc + 1 : acc), 0);
  const passed = score >= Math.ceil(questions.length * 0.75);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onComplete(score, questions.length);
  };

  const handleRetake = () => {
    setSelected({});
    setSubmitted(false);
  };

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.academy.quizTitle} ({questions.length} {t.academy.questionsWord})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.academy.quizPassRule}
            {bestScore !== undefined && bestScore > 0 ? ` ${t.academy.bestScore} ${bestScore}/${questions.length}.` : ''}
          </p>
        </div>
        {submitted && (
          <span
            className={`font-mono text-sm font-semibold ${
              passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {t.academy.scoreLabel} {score}/{questions.length} · {passed ? t.academy.passed : t.academy.tryAgain}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const picked = selected[q.id];
          const isCorrect = picked === q.correctIndex;

          return (
            <div key={q.id} className="space-y-2.5">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {qIdx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isPicked = picked === optIdx;
                  const isRightAnswer = optIdx === q.correctIndex;

                  let style =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';

                  if (submitted) {
                    if (isRightAnswer) {
                      style =
                        'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
                    } else if (isPicked && !isRightAnswer) {
                      style = 'border-red-500/60 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                    }
                  } else if (isPicked) {
                    style =
                      'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => setSelected((prev) => ({...prev, [q.id]: optIdx}))}
                      className={`w-full text-start px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between gap-3 ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      } ${style}`}
                    >
                      <span>{opt}</span>
                      {submitted && isRightAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {submitted && isPicked && !isRightAnswer && (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p
                  className={`text-xs leading-relaxed pt-1 ${
                    isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <strong>{t.academy.explanation}</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {t.academy.checkAnswers} ({answeredCount}/{questions.length})
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetake}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t.academy.retakeQuiz}
          </button>
        )}
      </div>
    </section>
  );
};
```

### `src/components/LessonSimulator.tsx`

```tsx
import React, {useState} from 'react';
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
```

### `src/components/OfflineIndicator.tsx`

```tsx
import React from 'react';
import {WifiOff} from 'lucide-react';
import {useOnlineStatus} from '../hooks/useOnlineStatus';
import {useLanguage} from '../i18n/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const {t} = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t.common.offlineNotice}</span>
    </div>
  );
};
```

### `src/components/OverviewDashboard.tsx`

```tsx
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.overview.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {t.overview.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('academy')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.overview.resumeCourseBtn} {String(currentCourseNumber).padStart(2, '0')} ({completedLessons}/{totalLessons})
          </button>
          <button
            type="button"
            onClick={() => onNavigate('trade')}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.overview.placePracticeTrade}
          </button>
        </div>
      </div>

      {/* Daily Missions Section */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                {t.overview.missionsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.overview.missionsSub}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] px-3 py-2 flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">{t.overview.missionsLevel}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums" dir="ltr">
                {missions.level}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums" dir="ltr">
                {missions.totalXp} {t.overview.missionsXp}
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] px-3 py-2 flex items-center gap-1.5">
              <Flame
                className={`w-3.5 h-3.5 ${
                  streakDays > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400'
                }`}
              />
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {streakDays}
              </span>
              <span className="text-slate-500 dark:text-slate-400">{streakWord}</span>
            </div>

            <div className="text-xs font-medium">
              <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums me-2" dir="ltr">
                {completedTodayCount}/4
              </span>
              <span
                className={
                  missions.bonusClaimedToday
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }
              >
                {missions.bonusClaimedToday
                  ? t.overview.missionsBonusUnlocked
                  : t.overview.missionsBonusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              completedTodayCount === 4 ? 'bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'
            }`}
            style={{width: `${missionsPct}%`}}
          />
        </div>

        {/* 4 Mission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {dailyMissionCards.map((item) => {
            const Icon = item.icon;
            const done = missions.completedIds.includes(item.id);
            const reward = MISSION_XP_REWARDS[item.id];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.targetTab)}
                className={`text-start p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer ${
                  done
                    ? 'border-emerald-500/40 bg-emerald-500/6 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/70 hover:border-blue-500/60 hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold tabular-nums ${
                        done
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                      dir="ltr"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      +{reward} {t.overview.missionsXp}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                  </div>

                  <p className="font-display text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-medium pt-1">
                  {done ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {t.overview.missionsCompleted}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
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

      {/* Milestone Badges & Achievements */}
      <AchievementsSection
        achievements={achievements}
        unlockedCount={achievementsUnlockedCount}
        totalCount={achievementsTotalCount}
      />

      {(completedLessons === 0 || isBrandNew || activeAlertsCount === 0) && (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
              {t.overview.quickStartTitle}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.overview.quickStartSub}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="text-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/60 hover:border-blue-500/60 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step1}</span>
                <span className={completedLessons > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {completedLessons > 0 ? `${completedLessons} ${t.overview.step1Done}` : t.overview.step1Start}
                </span>
              </div>
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                {t.overview.step1Title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.academy.resumeStepPrefix} {String(currentCourseNumber).padStart(2, '0')} · {currentCourseTitle}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('trade')}
              className="text-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/60 hover:border-blue-500/60 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step2}</span>
                <span className={!isBrandNew ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {!isBrandNew ? t.overview.step2Active : t.overview.step2Cash}
                </span>
              </div>
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                {t.overview.step2Title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.overview.step2Desc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('alerts')}
              className="text-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090D16]/60 hover:border-blue-500/60 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-medium">{t.overview.step3}</span>
                <span className={activeAlertsCount > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-blue-600 dark:text-blue-400 font-medium'}>
                  {activeAlertsCount > 0 ? `${activeAlertsCount} ${t.overview.step3Active}` : t.overview.step3Ready}
                </span>
              </div>
              <p className="font-display text-sm font-semibold text-slate-900 dark:text-white mt-1.5">
                {t.overview.step3Title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.overview.step3Desc}
              </p>
            </button>
          </div>
        </section>
      )}

      {/* Top 4-Card KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 flex flex-col justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.totalEquity}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight" dir="ltr">
              {formatUsd(analytics.totalEquity)}
            </div>
            <div
              className={`font-mono text-xs font-medium ${
                analytics.totalReturnPct >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              <span dir="ltr">
                {analytics.totalReturnPct >= 0 ? '▲ +' : '▼ '}
                {analytics.totalReturnPct.toFixed(2)}%
              </span>{' '}
              {t.overview.overallReturn}
            </div>
          </div>
          {beginnerHints && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {t.overview.hintEquity}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 flex flex-col justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.availableCash}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight" dir="ltr">
              {formatUsd(analytics.cash)}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {t.overview.inActiveTrades} <span dir="ltr">{formatUsd(analytics.marginUsed)}</span>
            </div>
          </div>
          {beginnerHints && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {t.overview.hintCash}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 flex flex-col justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.realizedLivePnl}</span>
            <div
              dir="ltr"
              className={`font-mono text-2xl font-bold tracking-tight ${
                analytics.realizedPnl + analytics.unrealizedPnl >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatUsd(analytics.realizedPnl + analytics.unrealizedPnl, true)}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {t.overview.closedLabel} <span dir="ltr">{formatUsd(analytics.realizedPnl, true)}</span> · {t.overview.openLabel}{' '}
              <span dir="ltr">{formatUsd(analytics.unrealizedPnl, true)}</span>
            </div>
          </div>
          {beginnerHints && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {t.overview.hintPnl}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 flex flex-col justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.overview.winRatePf}</span>
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tracking-tight" dir="ltr">
              {analytics.totalTrades > 0 ? `${analytics.winRatePct.toFixed(1)}%` : '—'}
            </div>
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400" dir="ltr">
              {analytics.winningTrades}W / {analytics.losingTrades}L · PF{' '}
              {analytics.totalTrades > 0 ? analytics.profitFactor.toFixed(2) : '—'}
            </div>
          </div>
          {beginnerHints && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              {t.overview.hintWinRate}
            </p>
          )}
        </div>
      </section>

      {/* Equity Curve + Performance Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.overview.equityCurveTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.overview.startingCapital} <span dir="ltr">{formatUsd(analytics.initialCapital)}</span> ({t.overview.dashedRef})
              </p>
            </div>
          </div>

          <EquityCurveChart points={analytics.equitySeries} initialCapital={analytics.initialCapital} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgWin}</span>
              <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400" dir="ltr">
                {analytics.winningTrades > 0 ? formatUsd(analytics.avgWin, true) : '—'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgLoss}</span>
              <span className="font-mono text-sm font-semibold text-red-600 dark:text-red-400" dir="ltr">
                {analytics.losingTrades > 0 ? `-${formatUsd(analytics.avgLoss)}` : '—'}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.maxDrawdown}</span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white" dir="ltr">
                {analytics.maxDrawdownPct.toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">{t.overview.avgResultTrade}</span>
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.expectancy, true) : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-5">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.overview.strategyBreakdown}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">
                {t.overview.cryptoTrades} ({analytics.cryptoCount})
              </span>
              <span
                dir="ltr"
                className={`font-mono font-semibold ${
                  analytics.cryptoPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatUsd(analytics.cryptoPnl, true)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">
                {t.overview.forexTrades} ({analytics.forexCount})
              </span>
              <span
                dir="ltr"
                className={`font-mono font-semibold ${
                  analytics.forexPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatUsd(analytics.forexPnl, true)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.buyWinRate}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">
                {analytics.totalTrades > 0 ? `${analytics.longWinRate.toFixed(0)}%` : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.sellWinRate}</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white" dir="ltr">
                {analytics.totalTrades > 0 ? `${analytics.shortWinRate.toFixed(0)}%` : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.bestTrade}</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.bestTrade, true) : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600 dark:text-slate-300">{t.overview.worstTrade}</span>
              <span className="font-mono font-semibold text-red-600 dark:text-red-400" dir="ltr">
                {analytics.totalTrades > 0 ? formatUsd(analytics.worstTrade, true) : '—'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {positions.length > 0 && (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
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
                      <td className="py-2.5 text-end" dir="ltr">{formatUsd(pos.notionalUsd)}</td>
                      <td className="py-2.5 text-end" dir="ltr">{formatPrice(pos.entryPrice, pos.symbol)}</td>
                      <td className="py-2.5 text-end" dir="ltr">{formatPrice(markPrice, pos.symbol)}</td>
                      <td dir="ltr" className={`py-2.5 text-end font-semibold ${unrealizedPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
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
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
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
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap" dir="ltr">
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
                      <td className="py-3 text-end font-mono text-slate-700 dark:text-slate-200" dir="ltr">
                        {formatUsd(log.notionalUsd)}
                      </td>
                      <td className="py-3 text-end font-mono text-slate-600 dark:text-slate-300" dir="ltr">
                        {formatPrice(log.entryPrice, log.symbol)}
                      </td>
                      <td className="py-3 text-end font-mono text-slate-600 dark:text-slate-300" dir="ltr">
                        {formatPrice(log.exitPrice, log.symbol)}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {closeReasonLabel(log.closeReason)}
                      </td>
                      <td
                        dir="ltr"
                        className={`py-3 text-end font-mono font-semibold whitespace-nowrap ${
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
```

### `src/components/PWAInstallButton.tsx`

```tsx
import React, {useState} from 'react';
import {Download, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {useLanguage} from '../i18n/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const {t} = useLanguage();
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        {t.common.installApp}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {t.common.installIos}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t.common.installIosTitle}</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.common.close}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.common.installIosStep1}
                <br />
                {t.common.installIosStep2}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.common.gotIt}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
```

### `src/components/Sidebar.tsx`

```tsx
import React from 'react';
import {
  Bell,
  Bookmark,
  CandlestickChart,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import {formatUsd} from '../data/instruments';
import {TRADING_STRATEGIES} from '../data/strategies';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppTab, LeaderboardEntry, StrategyId} from '../types/trading';
import {LeaderboardPanel} from './LeaderboardPanel';

interface SidebarLeaderboardData {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry;
  aboveEntry: LeaderboardEntry | null;
  xpToNextRank: number;
  customName: string;
  onUpdateName: (name: string) => void;
}

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unreadCount: number;
  completedLessons: number;
  totalLessons: number;
  totalEquity: number;
  savedStrategyIds: StrategyId[];
  activeStrategyId: StrategyId;
  onOpenSavedStrategy: (id: StrategyId) => void;
  onRemoveSavedStrategy: (id: StrategyId) => void;
  leaderboard: SidebarLeaderboardData;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount,
  completedLessons,
  totalLessons,
  totalEquity,
  savedStrategyIds,
  activeStrategyId,
  onOpenSavedStrategy,
  onRemoveSavedStrategy,
  leaderboard,
  theme,
  onToggleTheme,
  onOpenSettings,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const {t, dir, lang} = useLanguage();

  const savedStrategies = savedStrategyIds
    .map((id) => TRADING_STRATEGIES.find((s) => s.id === id))
    .filter((item): item is (typeof TRADING_STRATEGIES)[number] => Boolean(item));

  const navItems: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{className?: string}>;
    meta?: string;
    hasUnread?: boolean;
  }> = [
    {
      id: 'academy',
      label: t.nav.academy,
      icon: GraduationCap,
      meta: `${completedLessons}/${totalLessons}`,
    },
    {id: 'overview', label: t.nav.overview, icon: LayoutDashboard},
    {id: 'trade', label: t.nav.practice, icon: CandlestickChart},
    {
      id: 'strategies',
      label: t.nav.strategies,
      icon: Compass,
      meta: String(TRADING_STRATEGIES.length),
    },
    {
      id: 'alerts',
      label: t.nav.alerts,
      icon: Bell,
      meta: unreadCount > 0 ? String(unreadCount) : undefined,
      hasUnread: unreadCount > 0,
    },
  ];

  const handleNavClick = (tab: AppTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const isCompact = !isMobileDrawer && collapsed;

    return (
      <div className="h-full flex flex-col bg-white dark:bg-[#0C121E] border-e border-slate-200/90 dark:border-slate-800/90 select-none">
        {/* Brand & Collapse Row */}
        <div
          className={`h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center ${
            isCompact ? 'justify-center' : 'justify-between gap-2'
          }`}
        >
          {!isCompact && (
            <button
              type="button"
              onClick={() => handleNavClick('academy')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 rounded-md"
            >
              <img
                src="/icon.svg"
                alt={t.common.brand}
                className="w-7 h-7 rounded-lg shrink-0 border border-slate-200 dark:border-slate-800"
              />
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {t.common.brand}
              </span>
            </button>
          )}

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label={t.common.close}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={t.nav.toggleSidebar}
              aria-label={t.nav.toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              {isCompact ? (
                <PanelLeftOpen className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              ) : (
                <PanelLeftClose className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label="Primary navigation" className="flex-1 p-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                title={isCompact ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`relative w-full flex items-center rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isCompact ? 'justify-center px-2 py-2.5' : 'justify-between gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCompact && <span className="text-sm truncate">{item.label}</span>}
                </span>

                {!isCompact && item.meta && (
                  <span
                    dir="ltr"
                    className={`font-mono text-[11px] tabular-nums shrink-0 ${
                      item.hasUnread
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.meta}
                  </span>
                )}

                {isCompact && item.hasUnread && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-blue-500"
                  />
                )}
              </button>
            );
          })}

          {/* Saved Strategies (Trading Playbook) */}
          {!isCompact ? (
            <div className="pt-4 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="px-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Bookmark className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{t.strategies.playbookSectionTitle}</span>
                </span>
                <span className="font-mono tabular-nums shrink-0" dir="ltr">
                  {savedStrategies.length}/{TRADING_STRATEGIES.length}
                </span>
              </div>

              {savedStrategies.length === 0 ? (
                <div className="mx-1 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-2.5 space-y-2">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.strategies.savedEmptyHint}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavClick('strategies')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {t.strategies.browseStrategies}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {savedStrategies.map((strat) => {
                    const localized = strat.translations[lang] ?? strat.translations.en;
                    const isFocused = activeTab === 'strategies' && activeStrategyId === strat.id;
                    return (
                      <div
                        key={strat.id}
                        className={`group flex items-center gap-1 rounded-lg transition-colors ${
                          isFocused
                            ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                            : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onOpenSavedStrategy(strat.id);
                            onCloseMobile();
                          }}
                          className="flex-1 min-w-0 text-start px-2.5 py-2 cursor-pointer"
                        >
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                            {localized.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums" dir="ltr">
                            <span>{strat.practiceSymbol}</span>
                            <span>·</span>
                            <span>{localized.realExample.entryPrice}</span>
                            <span>·</span>
                            <span className={strat.bias === 'bullish' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              {strat.typicalRiskReward}
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSavedStrategy(strat.id);
                          }}
                          aria-label={t.strategies.removeBookmark}
                          title={t.strategies.removeBookmark}
                          className="p-1.5 me-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 opacity-70 group-hover:opacity-100 cursor-pointer shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (savedStrategies.length > 0) {
                    onOpenSavedStrategy(savedStrategies[0].id);
                  } else {
                    handleNavClick('strategies');
                  }
                }}
                title={`${t.strategies.playbookSectionTitle} (${savedStrategies.length})`}
                aria-label={t.strategies.playbookSectionTitle}
                className="relative w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <Bookmark
                  className={`w-4 h-4 ${savedStrategies.length > 0 ? 'text-amber-500 dark:text-amber-400' : ''}`}
                />
                {savedStrategies.length > 0 && (
                  <span className="absolute top-1.5 end-1.5 font-mono text-[9px] font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {savedStrategies.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Competitive XP Leaderboard */}
          <LeaderboardPanel
            entries={leaderboard.entries}
            userEntry={leaderboard.userEntry}
            aboveEntry={leaderboard.aboveEntry}
            xpToNextRank={leaderboard.xpToNextRank}
            customName={leaderboard.customName}
            onUpdateName={leaderboard.onUpdateName}
            compact={isCompact}
            onExpandSidebar={onToggleCollapse}
          />
        </nav>

        {/* Bottom Workspace Summary & Actions */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
          {!isCompact && (
            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090D16] px-3 py-2 mb-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.nav.paperBalance}</div>
              <div
                className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums mt-0.5"
                dir="ltr"
              >
                {formatUsd(totalEquity)}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            title={isCompact ? (theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode) : undefined}
            className={`w-full flex items-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer ${
              isCompact ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-xs font-medium'
            }`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-500 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            {!isCompact && (
              <span className="truncate">
                {theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            title={isCompact ? t.nav.account : undefined}
            className={`w-full flex items-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer ${
              isCompact ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5 text-xs font-semibold'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            {!isCompact && <span className="truncate">{t.nav.account}</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-out z-30 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-label={t.common.brand}
            className="relative w-68 max-w-[82vw] h-full z-10 shadow-2xl"
          >
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
};
```

### `src/components/StrategiesView.tsx`

```tsx
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
```

### `src/components/StrategyAnimator.tsx`

```tsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {CheckCircle2, Pause, Play, RotateCcw, XCircle} from 'lucide-react';
import type {StrategyLocalizedContent} from '../data/strategies';
import {useLanguage} from '../i18n/LanguageContext';
import type {StrategyId} from '../types/trading';

interface StrategyAnimatorProps {
  strategyId: StrategyId;
  content: StrategyLocalizedContent;
}

type Mode = 'correct' | 'mistake';

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp(t);
}

function samplePolyline(pts: Array<[number, number]>, progress: number): Array<[number, number]> {
  if (pts.length === 0) return [];
  const p = clamp(progress);
  if (p <= 0) return [pts[0]];
  if (p >= 1) return pts;

  const totalSegs = pts.length - 1;
  const scaled = p * totalSegs;
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const out = pts.slice(0, idx + 1);
  if (idx < totalSegs) {
    const [x1, y1] = pts[idx];
    const [x2, y2] = pts[idx + 1];
    out.push([lerp(x1, x2, frac), lerp(y1, y2, frac)]);
  }
  return out;
}

function toSvgPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

export const StrategyAnimator: React.FC<StrategyAnimatorProps> = ({strategyId, content}) => {
  const {t} = useLanguage();
  const [mode, setMode] = useState<Mode>('correct');
  const [progress, setProgress] = useState<number>(1);
  const [playing, setPlaying] = useState<boolean>(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setProgress(1);
      setPlaying(false);
      return;
    }

    setProgress(0.02);
    setPlaying(true);
  }, [strategyId, mode]);

  useEffect(() => {
    if (!playing) return;
    let lastTs: number | null = null;
    const durationMs = 5600;

    const tick = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      setProgress((prev) => {
        const next = prev + dt / durationMs;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const activeStepIdx = useMemo(() => {
    if (progress < 0.36) return 0;
    if (progress < 0.72) return 1;
    return 2;
  }, [progress]);

  const steps = mode === 'correct' ? content.correctSteps : content.mistakeSteps;
  const outcome = mode === 'correct' ? content.correctOutcome : content.mistakeOutcome;

  const handleTogglePlay = () => {
    if (progress >= 0.99) {
      setProgress(0.02);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const handleReplay = () => {
    setProgress(0.02);
    setPlaying(true);
  };

  const handleScrub = (val: number) => {
    setPlaying(false);
    setProgress(clamp(val / 100));
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B101B] p-4 sm:p-5 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={content.name}
          className="inline-flex rounded-lg bg-slate-200/80 dark:bg-[#111827] p-1 border border-slate-300/60 dark:border-slate-800 self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'correct'}
            onClick={() => setMode('correct')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'correct'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.strategies.correctMode}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'mistake'}
            onClick={() => setMode('mistake')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'mistake'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t.strategies.mistakeMode}</span>
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? t.strategies.pauseBtn : t.strategies.playBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.strategies.replayBtn}</span>
          </button>
        </div>
      </div>

      {/* Animated SVG Canvas */}
      <div
        dir="ltr"
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-[#0B111D] p-2 sm:p-3 overflow-hidden"
      >
        <svg viewBox="0 0 560 220" className="w-full h-auto max-h-[250px] block" aria-hidden="true">
          {/* Subtle grid */}
          <g stroke="#1E293B" strokeWidth="1" strokeDasharray="3 4" opacity="0.6">
            <line x1="20" y1="45" x2="540" y2="45" />
            <line x1="20" y1="110" x2="540" y2="110" />
            <line x1="20" y1="175" x2="540" y2="175" />
            <line x1="145" y1="15" x2="145" y2="205" />
            <line x1="280" y1="15" x2="280" y2="205" />
            <line x1="415" y1="15" x2="415" y2="205" />
          </g>

          {renderStrategyScene(strategyId, mode, progress)}
        </svg>

        {/* Interactive Scrubber Bar */}
        <div className="flex items-center gap-3 px-2 pt-2 border-t border-slate-800/80 mt-2">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">{t.strategies.scrubHint}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(progress * 100)}
            onChange={(e) => handleScrub(Number(e.target.value))}
            aria-label={t.strategies.scrubHint}
            className="w-full accent-blue-500 h-1.5 cursor-pointer"
          />
          <span className="text-[11px] font-mono text-slate-300 w-9 text-right tabular-nums shrink-0">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Synchronized 3-Phase Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {steps.map((text, idx) => {
          const isCurrent = idx === activeStepIdx;
          const isDone = idx < activeStepIdx || progress >= 0.99;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleScrub(idx === 0 ? 22 : idx === 1 ? 56 : 95)}
              className={`text-start rounded-lg border p-3 transition-colors cursor-pointer ${
                isCurrent
                  ? mode === 'correct'
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-slate-900 dark:text-white'
                    : 'border-rose-500/60 bg-rose-500/10 text-slate-900 dark:text-white'
                  : isDone
                    ? 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-[#111827]/70 text-slate-700 dark:text-slate-200'
                    : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-[#0F1623]/40 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="text-[11px] font-mono font-semibold mb-1 opacity-75">
                {t.strategies.stepWord} 0{idx + 1}
              </div>
              <p className="text-xs leading-relaxed">{text}</p>
            </button>
          );
        })}
      </div>

      {/* Outcome Banner */}
      <div
        className={`rounded-lg px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 border ${
          mode === 'correct'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
        }`}
      >
        {mode === 'correct' ? (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 shrink-0" />
        )}
        <span>{outcome}</span>
      </div>
    </div>
  );
};

function renderStrategyScene(strategyId: StrategyId, mode: Mode, progress: number) {
  switch (strategyId) {
    case 'head-shoulders':
      return <HeadShouldersScene mode={mode} p={progress} />;
    case 'double-bottom':
      return <DoubleBottomScene mode={mode} p={progress} />;
    case 'breakout-retest':
      return <BreakoutRetestScene mode={mode} p={progress} />;
    case 'bull-flag':
      return <BullFlagScene mode={mode} p={progress} />;
    case 'rsi-divergence':
      return <RsiDivergenceScene mode={mode} p={progress} />;
  }
}

/* 1. HEAD & SHOULDERS */
const HeadShouldersScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 148],
    [110, 82],  // Left Shoulder
    [155, 128], // Neckline 1
    [215, 38],  // Head
    [275, 128], // Neckline 2
    [335, 86],  // Right Shoulder
    [388, 128], // Neckline break
    [420, 140],
    [445, 130], // Retest
    [515, 192], // Target hit
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 152],
    [115, 95],
    [160, 126],
    [225, 44],  // Trader shorts right here without confirmation
    [280, 60],
    [350, 26],  // Squeeze stops trader out
    [435, 58],
    [505, 92],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Neckline */}
      <line x1="75" y1="128" x2="495" y2="128" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" opacity={mode === 'correct' ? 0.9 : 0.35} />
      <text x="80" y="142" fill="#93C5FD" fontSize="10" fontFamily="monospace">
        NECKLINE SUPPORT
      </text>

      {/* Price Path */}
      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#F8FAFC' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.14 && (
            <text x="110" y="70" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">
              L. Shoulder
            </text>
          )}
          {p > 0.34 && (
            <text x="215" y="26" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="middle">
              HEAD
            </text>
          )}
          {p > 0.56 && (
            <text x="335" y="74" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">
              R. Shoulder
            </text>
          )}
          {/* Measured Height Line */}
          {p > 0.42 && (
            <g opacity="0.7">
              <line x1="215" y1="38" x2="215" y2="128" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="223" y="86" fill="#60A5FA" fontSize="10" fontFamily="monospace">
                H
              </text>
            </g>
          )}
          {/* Entry & SL & Target */}
          {p > 0.68 && (
            <g>
              <line x1="320" y1="78" x2="525" y2="78" stroke="#F43F5E" strokeWidth="1.4" strokeDasharray="4 4" />
              <text x="520" y="72" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL (Above R. Shoulder)
              </text>
              <circle cx="388" cy="128" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="364" y="102" width="48" height="17" rx="4" fill="#10B981" />
              <text x="388" y="114" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                SELL
              </text>
            </g>
          )}
          {p > 0.88 && (
            <g>
              <line x1="388" y1="192" x2="530" y2="192" stroke="#10B981" strokeWidth="1.4" strokeDasharray="4 4" />
              <text x="520" y="206" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
                TARGET (H below neckline)
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {p > 0.42 && (
            <g>
              <circle cx="225" cy="44" r="5" fill="#F43F5E" />
              <rect x="175" y="16" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="226" y="28" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                EARLY GUESS SELL
              </text>
            </g>
          )}
          {p > 0.7 && (
            <g>
              <circle cx="350" cy="26" r="6" fill="#F43F5E" stroke="#F8FAFC" strokeWidth="1.5" />
              <text x="365" y="28" fill="#FDA4AF" fontSize="10" fontWeight="700">
                SQUEEZED OUT!
              </text>
            </g>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#10B981' : '#FB7185'} />
    </g>
  );
};

/* 2. DOUBLE BOTTOM ("W" PATTERN) */
const DoubleBottomScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 52],
    [135, 168], // Bottom 1
    [225, 102], // Neckline Peak
    [315, 166], // Bottom 2
    [392, 102], // Neckline Breakout
    [430, 106],
    [515, 34],  // Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 52],
    [135, 152], // Trader buys early on falling knife
    [200, 132],
    [280, 178],
    [380, 198], // Breaks lower
    [510, 206],
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Support Floor */}
      <line x1="65" y1="168" x2="420" y2="168" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
      <text x="72" y="184" fill="#34D399" fontSize="10" fontFamily="monospace">
        SUPPORT FLOOR
      </text>

      {mode === 'correct' && (
        <>
          <line x1="160" y1="102" x2="520" y2="102" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="165" y="94" fill="#93C5FD" fontSize="10" fontFamily="monospace">
            NECKLINE BREAKOUT
          </text>
        </>
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.18 && (
            <text x="135" y="198" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Bottom 1
            </text>
          )}
          {p > 0.56 && (
            <text x="315" y="198" fill="#94A3B8" fontSize="10" textAnchor="middle">
              Bottom 2 (Holds!)
            </text>
          )}
          {p > 0.72 && (
            <g>
              <circle cx="392" cy="102" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="368" y="75" width="48" height="18" rx="4" fill="#10B981" />
              <text x="392" y="87" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BUY
              </text>
              <line x1="290" y1="176" x2="510" y2="176" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="506" y="190" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL below Bottom 2
              </text>
            </g>
          )}
          {p > 0.9 && (
            <g>
              <line x1="392" y1="34" x2="530" y2="34" stroke="#10B981" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="520" y="26" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
                TARGET ("W" Height)
              </text>
            </g>
          )}
        </>
      ) : (
        <>
          {p > 0.25 && (
            <g>
              <circle cx="135" cy="152" r="5" fill="#F43F5E" />
              <rect x="85" y="122" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="136" y="134" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                BLIND EARLY BUY
              </text>
            </g>
          )}
          {p > 0.75 && (
            <text x="390" y="182" fill="#FDA4AF" fontSize="10" fontWeight="700">
              NO CONFIRMATION → BREAKS LOWER
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 3. BREAKOUT & RETEST */
const BreakoutRetestScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [45, 174],
    [130, 118], // Reject 1
    [205, 156],
    [270, 118], // Reject 2
    [335, 62],  // Breakout high
    [390, 118], // Golden Retest
    [515, 32],  // Target
  ];
  const mistakePts: Array<[number, number]> = [
    [45, 174],
    [130, 118],
    [205, 156],
    [270, 118],
    [335, 56],  // FOMO buy at peak
    [395, 118], // Panic sells in red
    [510, 42],  // Rallies without them
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Flipped Ceiling -> Support Line */}
      <line x1="65" y1="118" x2="520" y2="118" stroke={p > 0.6 ? '#10B981' : '#F59E0B'} strokeWidth="2" strokeDasharray="6 4" />
      <text x="72" y="109" fill={p > 0.6 ? '#34D399' : '#FBBF24'} fontSize="10" fontFamily="monospace">
        {p > 0.6 ? 'OLD CEILING → NEW FLOOR' : 'RESISTANCE CEILING'}
      </text>

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#3B82F6' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.72 && (
            <g>
              <circle cx="390" cy="118" r="6" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="342" y="132" width="96" height="18" rx="4" fill="#10B981" />
              <text x="390" y="144" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                RETEST BUY
              </text>
              <line x1="350" y1="162" x2="515" y2="162" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="510" y="176" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                TIGHT STOP-LOSS
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="515" y="22" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              TARGET (+2.8R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.56 && (
            <g>
              <circle cx="335" cy="56" r="5" fill="#F43F5E" />
              <rect x="285" y="28" width="102" height="18" rx="4" fill="#F43F5E" />
              <text x="336" y="40" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FOMO BUY AT PEAK
              </text>
            </g>
          )}
          {p > 0.75 && (
            <g>
              <circle cx="395" cy="118" r="5" fill="#F43F5E" />
              <text x="395" y="140" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
                PANIC SELL ON RETEST!
              </text>
            </g>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 4. BULL FLAG CONTINUATION */
const BullFlagScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const correctPts: Array<[number, number]> = [
    [55, 190],
    [180, 74],  // Flagpole top
    [225, 102], // Flag low 1
    [265, 84],  // Flag high 2
    [310, 114], // Flag low 2
    [352, 92],  // Upper flag breakout
    [505, 24],  // Continuation target
  ];
  const mistakePts: Array<[number, number]> = [
    [55, 190],
    [180, 74],
    [235, 104], // Shorts thinking uptrend is over
    [280, 96],
    [345, 84],
    [450, 32],  // Trend crushes short
  ];

  const pts = mode === 'correct' ? correctPts : mistakePts;
  const active = samplePolyline(pts, p);
  const head = active[active.length - 1];

  return (
    <g>
      {/* Flagpole brace */}
      <line x1="55" y1="190" x2="180" y2="74" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      {p > 0.25 && (
        <text x="95" y="122" fill="#93C5FD" fontSize="10" fontFamily="monospace">
          FLAGPOLE
        </text>
      )}

      {/* Parallel Flag Channel */}
      {p > 0.3 && (
        <g opacity="0.85">
          <line x1="175" y1="72" x2="365" y2="96" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="195" y1="102" x2="355" y2="124" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="5 4" />
        </g>
      )}

      <path d={toSvgPath(active)} fill="none" stroke={mode === 'correct' ? '#34D399' : '#FB7185'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {mode === 'correct' ? (
        <>
          {p > 0.68 && (
            <g>
              <circle cx="352" cy="92" r="5.5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
              <rect x="305" y="62" width="96" height="18" rx="4" fill="#10B981" />
              <text x="353" y="74" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FLAG BREAKOUT
              </text>
              <line x1="305" y1="126" x2="510" y2="126" stroke="#F43F5E" strokeWidth="1.3" strokeDasharray="4 4" />
              <text x="505" y="140" fill="#FDA4AF" fontSize="10" fontFamily="monospace" textAnchor="end">
                SL under Flag
              </text>
            </g>
          )}
          {p > 0.9 && (
            <text x="505" y="18" fill="#34D399" fontSize="10" fontFamily="monospace" textAnchor="end">
              POLE TARGET (+2.5R)
            </text>
          )}
        </>
      ) : (
        <>
          {p > 0.45 && (
            <g>
              <circle cx="235" cy="104" r="5" fill="#F43F5E" />
              <rect x="172" y="122" width="126" height="18" rx="4" fill="#F43F5E" />
              <text x="235" y="134" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                FIGHTING UPTREND (SHORT)
              </text>
            </g>
          )}
          {p > 0.8 && (
            <text x="435" y="54" fill="#FDA4AF" fontSize="10" fontWeight="700" textAnchor="middle">
              TREND RESUMES → STOPPED!
            </text>
          )}
        </>
      )}

      <circle cx={head[0]} cy={head[1]} r="4.5" fill={mode === 'correct' ? '#34D399' : '#FB7185'} />
    </g>
  );
};

/* 5. RSI BULLISH DIVERGENCE (SPLIT PRICE + RSI PANE) */
const RsiDivergenceScene: React.FC<{mode: Mode; p: number}> = ({mode, p}) => {
  const pricePts: Array<[number, number]> = [
    [45, 42],
    [160, 92],  // LL1
    [245, 62],  // Minor Swing High
    [335, 114], // LL2 (Lower Low!)
    [405, 62],  // Structure Break
    [515, 24],  // Rally
  ];
  const rsiPts: Array<[number, number]> = [
    [45, 150],
    [160, 198], // HL1 (Oversold)
    [245, 170],
    [335, 178], // HL2 (Higher Low!)
    [405, 152],
    [515, 138],
  ];

  const activePrice = samplePolyline(pricePts, p);
  const activeRsi = samplePolyline(rsiPts, p);
  const priceHead = activePrice[activePrice.length - 1];
  const rsiHead = activeRsi[activeRsi.length - 1];

  return (
    <g>
      {/* Divider between Price and RSI pane */}
      <line x1="20" y1="128" x2="540" y2="128" stroke="#334155" strokeWidth="1.2" />
      <text x="28" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
        PRICE
      </text>
      <text x="28" y="143" fill="#60A5FA" fontSize="10" fontFamily="monospace">
        RSI (14)
      </text>

      {/* Price & RSI Paths */}
      <path d={toSvgPath(activePrice)} fill="none" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={toSvgPath(activeRsi)} fill="none" stroke="#3B82F6" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Divergence Comparison Lines */}
      {p > 0.62 && (
        <g>
          <line x1="160" y1="96" x2="335" y2="118" stroke="#F43F5E" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="248" y="120" fill="#FDA4AF" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
            Lower Low
          </text>

          <line x1="160" y1="200" x2="335" y2="180" stroke="#10B981" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="252" y="206" fill="#34D399" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
            RSI Higher Low (Bullish!)
          </text>
        </g>
      )}

      {mode === 'correct' ? (
        p > 0.72 && (
          <g>
            <line x1="230" y1="62" x2="465" y2="62" stroke="#10B981" strokeWidth="1.3" strokeDasharray="4 4" />
            <circle cx="405" cy="62" r="5" fill="#10B981" stroke="#0B111D" strokeWidth="2" />
            <rect x="358" y="34" width="94" height="18" rx="4" fill="#10B981" />
            <text x="405" y="46" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
              CONFIRMED BUY
            </text>
          </g>
        )
      ) : (
        p > 0.3 && (
          <g>
            <circle cx="160" cy="92" r="5" fill="#F43F5E" />
            <rect x="98" y="64" width="124" height="18" rx="4" fill="#F43F5E" />
            <text x="160" y="76" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
              EARLY BUY (STILL FALLING)
            </text>
          </g>
        )
      )}

      <circle cx={priceHead[0]} cy={priceHead[1]} r="4" fill="#10B981" />
      <circle cx={rsiHead[0]} cy={rsiHead[1]} r="4" fill="#60A5FA" />
    </g>
  );
};
```

### `src/components/ToastBanner.tsx`

```tsx
import React from 'react';
import {Bell, TrendingUp, X} from 'lucide-react';
import type {AppNotification} from '../types/trading';

interface ToastBannerProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({toasts, onDismiss}) => {
  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] p-3.5 shadow-lg"
        >
          <div className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
            {toast.category === 'market-alert' ? <Bell className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{toast.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{toast.body}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
```

### `src/components/TradingTerminal.tsx`

```tsx
import React, {useEffect, useMemo, useState} from 'react';
import {Bell, ChevronDown, ChevronUp, Info, Search} from 'lucide-react';
import {INSTRUMENTS, INSTRUMENT_MAP, formatPrice, formatUsd} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import {calcPositionPnl} from '../hooks/usePaperAccount';
import type {
  AssetClass,
  Candle,
  MarketQuote,
  OrderSide,
  OrderType,
  PendingOrder,
  Position,
  Timeframe,
  TradeLog,
} from '../types/trading';
import {CandlestickChart} from './CandlestickChart';

interface TradingTerminalProps {
  selectedSymbol: string;
  onSelectSymbol: (sym: string) => void;
  quotes: Record<string, MarketQuote>;
  cash: number;
  positions: Position[];
  pendingOrders: PendingOrder[];
  tradeLogs: TradeLog[];
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
  onPlaceOrder,
  onClosePosition,
  onCancelPending,
  onQuickAlert,
  beginnerHints,
  theme,
}) => {
  const {t, getInstrumentNote} = useLanguage();
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

  const instrument = INSTRUMENT_MAP.get(selectedSymbol) ?? INSTRUMENTS[0];
  const quote = quotes[selectedSymbol];

  useEffect(() => {
    let active = true;
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
  }, [selectedSymbol, timeframe]);

  useEffect(() => {
    setStopLossInput('');
    setTakeProfitInput('');
    setLimitInput(quote ? String(quote.price) : '');
    setOrderFeedback(null);
  }, [selectedSymbol]);

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);

    const result = onPlaceOrder({
      symbol: selectedSymbol,
      side,
      orderType: showAdvanced ? orderType : 'market',
      notionalUsd,
      leverage: showAdvanced ? leverage : 1,
      limitPrice: showAdvanced && orderType === 'limit' ? parseFloat(limitInput) : undefined,
      stopLoss: Number.isFinite(slVal) && slVal > 0 ? slVal : undefined,
      takeProfit: Number.isFinite(tpVal) && tpVal > 0 ? tpVal : undefined,
    });

    if (result.ok) {
      setOrderFeedback({
        type: 'ok',
        text: `${side === 'buy' ? t.trade.orderPlacedBuy : t.trade.orderPlacedSell} ${selectedSymbol}.`,
      });
      setStopLossInput('');
      setTakeProfitInput('');
    } else {
      setOrderFeedback({type: 'err', text: result.error ?? t.trade.errWaitingPrice});
    }
  };

  const handleQuickPriceAlert = () => {
    if (!quote) return;
    const target = Number((quote.price * 1.01).toFixed(instrument.decimals));
    onQuickAlert(selectedSymbol, target, 'above');
    setAlertSavedMsg(`${t.trade.alertSetAbove} ${formatPrice(target, selectedSymbol)}`);
    window.setTimeout(() => setAlertSavedMsg(null), 3000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Market Watchlist */}
        <aside className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden">
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
        </aside>

        {/* Center: Interactive Chart + Bottom Positions */}
        <div className="lg:col-span-6 space-y-5 min-w-0">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white" dir="ltr">
                    {instrument.symbol}
                  </h1>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {instrument.name} · {instrument.assetClass === 'crypto' ? t.trade.crypto247 : t.trade.forexPair}
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
                      {quote.change24hPct.toFixed(2)}% (24h)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bid {formatPrice(quote.bid, instrument.symbol)} / Ask {formatPrice(quote.ask, instrument.symbol)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickPriceAlert}
                  disabled={!quote}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-blue-500" />
                  {t.trade.plusOneAlert}
                </button>
              </div>
            </div>

            {alertSavedMsg && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/50 text-xs text-blue-700 dark:text-blue-300">
                {alertSavedMsg}
              </div>
            )}

            {beginnerHints && (
              <div className="px-4 py-2 bg-slate-50 dark:bg-[#090D16]/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{getInstrumentNote(instrument.symbol)}</span>
              </div>
            )}

            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
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
              symbol={selectedSymbol}
              candles={candles}
              livePrice={quote?.price}
              positions={positions}
              chartMode={chartMode}
              indicators={indicators}
              theme={theme}
            />
          </div>

          {/* Open Positions / Pending / Recent Fills */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] overflow-hidden">
            <div className="px-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 overflow-x-auto">
              {[
                {id: 'positions' as const, label: `${t.trade.openPositions} (${positions.length})`},
                {id: 'pending' as const, label: `${t.trade.pendingOrders} (${pendingOrders.length})`},
                {id: 'history' as const, label: `${t.trade.recentClosed} (${Math.min(tradeLogs.length, 10)})`},
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
                positions.length === 0 ? (
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
                        {positions.map((pos) => {
                          const {unrealizedPnl, markPrice, pnlPct} = calcPositionPnl(pos, quotes[pos.symbol]);
                          const isProfit = unrealizedPnl >= 0;
                          return (
                            <tr key={pos.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">
                                <button
                                  type="button"
                                  onClick={() => onSelectSymbol(pos.symbol)}
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
                                  onClick={() => onClosePosition(pos.id)}
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
                pendingOrders.length === 0 ? (
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
                        {pendingOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="py-2.5 font-sans font-semibold text-slate-900 dark:text-white" dir="ltr">{ord.symbol}</td>
                            <td className="py-2.5 font-sans font-medium">{ord.side === 'buy' ? t.common.buy : t.common.sell}</td>
                            <td className="py-2.5 text-end" dir="ltr">{formatUsd(ord.notionalUsd)}</td>
                            <td className="py-2.5 text-end" dir="ltr">{formatPrice(ord.limitPrice, ord.symbol)}</td>
                            <td className="py-2.5 text-end">
                              <button
                                type="button"
                                onClick={() => onCancelPending(ord.id)}
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
                tradeLogs.length === 0 ? (
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
                        {tradeLogs.slice(0, 8).map((log) => (
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
                {t.trade.virtualCash}{' '}
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200" dir="ltr">
                  {formatUsd(cash)}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4">
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
                    onClick={() => setNotionalInput(String(Math.floor((cash * pct) / 100)))}
                    className="py-1 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
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
          </form>
        </aside>
      </div>
    </div>
  );
};
```

### `src/data/curriculum.ts`

```ts
import type {Lesson} from '../types/trading';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    moduleId: 'mod-1',
    moduleTitle: 'Module 1: Trading Basics',
    number: 1,
    title: 'How Buying, Selling & the Spread Work',
    level: 'Beginner',
    durationMinutes: 4,
    summary: 'Learn what Bid and Ask prices mean, why trades start slightly negative, and how to pick liquid markets.',
    practiceSymbol: 'EUR/USD',
    simulator: 'spread-lab',
    sections: [
      {
        heading: 'Two Prices on Every Screen: Bid and Ask',
        body: 'Whenever you look at Bitcoin or EUR/USD, there are really two prices: the Bid (the price buyers are offering right now if you want to sell) and the Ask (the price sellers want right now if you want to buy). The Ask is always slightly higher than the Bid.',
        keyTakeaway: 'You buy at the Ask price and sell at the Bid price.',
      },
      {
        heading: 'What Is the Spread?',
        body: 'The small gap between the Ask and the Bid is called the Spread. Think of it like exchanging cash at an airport counter — the exchange desk buys your currency for slightly less than it sells it back. High-volume markets like BTC/USD and EUR/USD have tiny spreads, which saves you money.',
        keyTakeaway: 'Smaller spreads mean lower trading costs and faster break-even points.',
      },
    ],
    quiz: [
      {
        id: 'l1-q1',
        question: 'If EUR/USD shows a Bid of 1.0580 and an Ask of 1.0582, which price do you pay to Buy right now?',
        options: ['1.0580 (the Bid)', '1.0582 (the Ask)', '1.0581 (the midpoint)', 'Whichever price was shown yesterday'],
        correctIndex: 1,
        explanation: 'When you buy immediately, you match with sellers at the Ask price (1.0582).',
      },
      {
        id: 'l1-q2',
        question: 'Why does a brand-new trade usually start with a tiny negative profit right after you open it?',
        options: [
          'The broker made a calculation error',
          'Because of the spread between the Ask you bought at and the Bid you could sell at',
          'Prices always fall immediately after anyone buys',
          'You automatically lose 10% on every market order',
        ],
        correctIndex: 1,
        explanation: 'You enter at the Ask and your live exit value is measured at the Bid, so the spread is the small initial hurdle to cross.',
      },
      {
        id: 'l1-q3',
        question: 'Which market usually has the smallest, cheapest spread for beginners?',
        options: [
          'Popular high-volume pairs like EUR/USD or BTC/USD',
          'Rare coins that barely trade each day',
          'Markets during a major holiday when banks are closed',
          'All assets always have the exact same spread',
        ],
        correctIndex: 0,
        explanation: 'High trading activity (liquidity) keeps buyers and sellers close together, shrinking the spread.',
      },
      {
        id: 'l1-q4',
        question: 'If you think a price will go DOWN and want to profit from the drop, what action do you take?',
        options: ['Buy (Long)', 'Sell (Short)', 'Wait for a higher spread', 'Cancel your account'],
        correctIndex: 1,
        explanation: 'Selling (going Short) profits when the asset price moves lower from your entry price.',
      },
    ],
  },
  {
    id: 'lesson-2',
    moduleId: 'mod-1',
    moduleTitle: 'Module 1: Trading Basics',
    number: 2,
    title: 'Market, Limit, Stop-Loss & Take-Profit Orders',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Master the four essential order buttons so you never enter blindly or forget to protect your cash.',
    practiceSymbol: 'BTC/USD',
    simulator: 'order-sandbox',
    sections: [
      {
        heading: 'Market Order vs. Limit Order',
        body: 'A Market Order buys or sells right this second at the best available price. A Limit Order lets you name your target price and wait patiently — for example, "Only buy Bitcoin if it dips down to $88,000." You get price control, though the trade will only happen if the market reaches your price.',
        keyTakeaway: 'Use Market orders for instant entry; use Limit orders to wait for a better price.',
      },
      {
        heading: 'Your Built-In Safety Net: Stop-Loss & Take-Profit',
        body: 'A Stop-Loss automatically closes your trade if the price moves against you by a set amount, stopping a small mistake from becoming a big loss. A Take-Profit automatically locks in your winnings when the price hits your goal — even while you sleep.',
        keyTakeaway: 'Never open a trade without deciding where you will exit if you are wrong (Stop-Loss).',
      },
    ],
    quiz: [
      {
        id: 'l2-q1',
        question: 'Bitcoin is currently $91,000, and you only want to buy if it drops to $89,500. Which order should you place?',
        options: ['Buy Market Order', 'Buy Limit Order at $89,500', 'Stop-Loss Order', 'Sell Market Order'],
        correctIndex: 1,
        explanation: 'A Buy Limit order waits below the current price and fills only if the market drops to $89,500 or lower.',
      },
      {
        id: 'l2-q2',
        question: 'What is the main job of a Stop-Loss order?',
        options: [
          'To guarantee every trade makes a profit',
          'To automatically close a losing trade at your pre-set limit so losses stay small',
          'To double your position size automatically',
          'To pause live market charts',
        ],
        correctIndex: 1,
        explanation: 'A Stop-Loss acts like a seatbelt — it caps your maximum loss on a trade before emotions take over.',
      },
      {
        id: 'l2-q3',
        question: 'You bought ETH at $3,000 and set a Take-Profit at $3,300. What happens if ETH touches $3,300 while you are away?',
        options: [
          'Nothing happens until you click Close manually',
          'Your trade automatically closes at ~$3,300 and locks in the profit',
          'Your Stop-Loss gets deleted and you buy more ETH',
          'The trade stays open forever',
        ],
        correctIndex: 1,
        explanation: 'Take-Profit orders execute automatically when price reaches your profit target.',
      },
      {
        id: 'l2-q4',
        question: 'Why do experienced traders prefer Market Orders only when timing matters?',
        options: [
          'Market orders always get better prices than Limit orders',
          'Market orders guarantee immediate execution, though at whatever the current Bid/Ask price is',
          'Market orders cannot have Stop-Losses',
          'Market orders only work in Forex',
        ],
        correctIndex: 1,
        explanation: 'Market orders prioritize speed (instant fill), whereas Limit orders prioritize exact price.',
      },
    ],
  },
  {
    id: 'lesson-3',
    moduleId: 'mod-2',
    moduleTitle: 'Module 2: Crypto Markets',
    number: 3,
    title: 'Crypto Essentials: 24/7 Volatility & Market Cycles',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Understand why crypto never closes, why coins move together, and how to handle sharper price swings.',
    practiceSymbol: 'BTC/USD',
    simulator: 'position-sizer',
    sections: [
      {
        heading: 'Always Open, Faster Swings',
        body: 'Unlike stock exchanges or banks, cryptocurrency markets run 24 hours a day, 7 days a week — including weekends. Bitcoin or Solana can easily move 3% to 8% in a single day, whereas major currency pairs in Forex often move less than 1%.',
        keyTakeaway: 'Because crypto swings wider, beginners should trade smaller dollar amounts per position.',
      },
      {
        heading: 'Bitcoin Leads the Pack',
        body: 'When Bitcoin makes a sudden big move up or down, altcoins like Ethereum (ETH), Solana (SOL), and Cardano (ADA) usually follow in the same direction — often with even larger percentage swings. Always glance at BTC/USD before trading another coin.',
        keyTakeaway: 'Check Bitcoin’s trend first — it sets the mood for almost the entire crypto market.',
      },
    ],
    quiz: [
      {
        id: 'l3-q1',
        question: 'When does the cryptocurrency market close for the weekend?',
        options: ['Friday at 5:00 PM EST', 'Saturday at midnight', 'Never — crypto trades 24/7', 'Only on bank holidays'],
        correctIndex: 2,
        explanation: 'Crypto networks run continuously worldwide, 24 hours a day, 365 days a year.',
      },
      {
        id: 'l3-q2',
        question: 'Compared to EUR/USD in Forex, why should beginners use smaller position sizes on coins like SOL/USD?',
        options: [
          'Crypto has much larger daily percentage swings',
          'Solana cannot be sold on Tuesdays',
          'Crypto spreads are always 0%',
          'Forex pairs are more expensive per unit',
        ],
        correctIndex: 0,
        explanation: 'Higher volatility means bigger wins AND bigger losses for the same dollar size, so smaller sizes keep risk steady.',
      },
      {
        id: 'l3-q3',
        question: 'Why should you check Bitcoin (BTC/USD) before buying an altcoin like ADA/USD?',
        options: [
          'You cannot buy ADA without owning BTC',
          'Bitcoin’s direction strongly influences the rest of the crypto market',
          'Altcoins only move when Bitcoin is frozen',
          'Bitcoin sets Forex interest rates',
        ],
        correctIndex: 1,
        explanation: 'Bitcoin is the largest crypto asset by market cap and drives overall crypto sentiment.',
      },
      {
        id: 'l3-q4',
        question: 'What is a smart habit during weekends in crypto?',
        options: [
          'Remove all Stop-Losses',
          'Keep Stop-Losses active because thin weekend volume can cause sharp spikes',
          'Use maximum 20x leverage',
          'Ignore your risk limits',
        ],
        correctIndex: 1,
        explanation: 'Weekend liquidity can be thinner, making sudden price spikes more common — protective Stop-Losses matter even more.',
      },
    ],
  },
  {
    id: 'lesson-4',
    moduleId: 'mod-3',
    moduleTitle: 'Module 3: Forex Fundamentals',
    number: 4,
    title: 'Currency Pairs, Pips & How Forex Quotes Work',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Decode EUR/USD and USD/JPY in plain English, and calculate exactly how much a 10-pip move is worth.',
    practiceSymbol: 'EUR/USD',
    simulator: 'pip-calculator',
    sections: [
      {
        heading: 'Always Trading Two Currencies Together',
        body: 'In Forex, you always compare one currency against another in a pair like EUR/USD. The first currency (EUR) is the Base; the second (USD) is the Quote. If EUR/USD = 1.0600, it means 1 Euro costs $1.0600 US Dollars. If you click Buy, you are betting the Euro will strengthen against the Dollar.',
        keyTakeaway: 'Buy = betting the first currency rises vs. the second. Sell = betting the first currency falls.',
      },
      {
        heading: 'What Is a Pip?',
        body: 'Currencies usually move in tiny fractions of a cent, so traders measure movement in "Pips" (Percentage in Point). For most pairs like EUR/USD, 1 pip is the 4th decimal place (0.0001). For Japanese Yen pairs like USD/JPY, 1 pip is the 2nd decimal place (0.01).',
        keyTakeaway: 'If EUR/USD moves from 1.0600 to 1.0625, that is a +25 pip gain.',
      },
    ],
    quiz: [
      {
        id: 'l4-q1',
        question: 'In the pair GBP/USD, which currency is the Base currency?',
        options: ['USD (US Dollar)', 'GBP (British Pound)', 'EUR (Euro)', 'Both equally'],
        correctIndex: 1,
        explanation: 'The first currency listed in any Forex pair is always the Base currency.',
      },
      {
        id: 'l4-q2',
        question: 'EUR/USD rises from 1.0550 to 1.0580. How many pips did it move?',
        options: ['3 pips', '30 pips', '300 pips', '0.3 pips'],
        correctIndex: 1,
        explanation: '0.0030 divided by 0.0001 (1 pip) equals 30 pips.',
      },
      {
        id: 'l4-q3',
        question: 'Which pair measures 1 pip at the 2nd decimal place (0.01) instead of the 4th?',
        options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
        correctIndex: 2,
        explanation: 'Japanese Yen (JPY) pairs quote near 100–160, so 1 pip is 0.01.',
      },
      {
        id: 'l4-q4',
        question: 'If you expect the US Dollar to get STRONGER against the Euro, what should you do on EUR/USD?',
        options: ['Buy EUR/USD', 'Sell (Short) EUR/USD', 'Buy USD/JPY and Sell BTC', 'Wait for 0 pips'],
        correctIndex: 1,
        explanation: 'If USD strengthens, 1 Euro buys fewer Dollars, so EUR/USD goes down — meaning Selling EUR/USD profits.',
      },
    ],
  },
  {
    id: 'lesson-5',
    moduleId: 'mod-4',
    moduleTitle: 'Module 4: Reading Charts',
    number: 5,
    title: 'How to Read Candlesticks & Trends',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'See the story inside every green and red candle: Open, High, Low, Close, and spotting buyer vs. seller pressure.',
    practiceSymbol: 'ETH/USD',
    simulator: 'candlestick-anatomy',
    sections: [
      {
        heading: 'The 4 Numbers Inside Every Candle',
        body: 'Each candlestick summarizes all trading during a chosen slice of time (like 15 minutes or 1 hour). The thick rectangle ("body") shows where the price Opened and Closed. A green candle means price closed higher than it opened; a red candle means it closed lower.',
        keyTakeaway: 'Green body = buyers won that time period. Red body = sellers won.',
      },
      {
        heading: 'What Long Wicks Tell You',
        body: 'The thin lines sticking out above and below the body are called "wicks" or "shadows" — they mark the highest and lowest prices reached during that candle. A long bottom wick shows sellers pushed price down, but buyers stepped in strongly to push it back up!',
        keyTakeaway: 'Long wicks often signal price rejection at key Support or Resistance levels.',
      },
    ],
    quiz: [
      {
        id: 'l5-q1',
        question: 'On a 15-minute chart, what does a single green candlestick represent?',
        options: [
          'Only one trade that happened 15 minutes ago',
          'Price opening, closing higher, plus the highest and lowest price during that 15-minute window',
          'Guaranteed profit for the next hour',
          'A Forex-only indicator',
        ],
        correctIndex: 1,
        explanation: 'Every candle displays four prices (Open, High, Low, Close) for its selected timeframe.',
      },
      {
        id: 'l5-q2',
        question: 'What does a very long wick sticking out of the BOTTOM of a candle usually mean?',
        options: [
          'The chart is broken',
          'Price dropped sharply, then buyers stepped in strongly and pushed price back up',
          'Volume dropped to zero',
          'Sellers won completely without resistance',
        ],
        correctIndex: 1,
        explanation: 'A long lower wick shows strong buying rejection after a dip.',
      },
      {
        id: 'l5-q3',
        question: 'In a healthy Uptrend, what pattern do candles generally make?',
        options: [
          'Lower highs and lower lows',
          'Higher highs and higher lows',
          'Completely flat horizontal lines',
          'Random gaps only',
        ],
        correctIndex: 1,
        explanation: 'An uptrend climbs like stairs: each peak and each pullback sits higher than the previous one.',
      },
      {
        id: 'l5-q4',
        question: 'Which timeframe gives beginners a calmer, clearer view with less random noise?',
        options: ['1-minute chart', '1-hour or 4-hour chart', '5-second ticks', 'Tick-by-tick order log'],
        correctIndex: 1,
        explanation: 'Higher timeframes (1H, 4H, 1D) filter out short-term noise and show cleaner trends.',
      },
    ],
  },
  {
    id: 'lesson-6',
    moduleId: 'mod-4',
    moduleTitle: 'Module 4: Reading Charts',
    number: 6,
    title: 'Simple Indicators: Moving Averages, Bollinger Bands & RSI',
    level: 'Intermediate',
    durationMinutes: 6,
    summary: 'Turn on chart overlays with purpose: spot trend direction with SMA/EMA and avoid chasing stretched moves with RSI.',
    practiceSymbol: 'SOL/USD',
    simulator: 'indicator-lab',
    sections: [
      {
        heading: 'Moving Averages (SMA 20 & EMA 50)',
        body: 'A Moving Average draws a smooth line tracking the average price over the last 20 or 50 candles. When price is above a rising moving average, the trend is generally up. Beginners use moving averages to avoid buying when the overall trend is pointing down.',
        keyTakeaway: 'Price above rising SMA/EMA = uptrend bias. Price below falling SMA/EMA = downtrend bias.',
      },
      {
        heading: 'Bollinger Bands & RSI (Overbought / Oversold)',
        body: 'Bollinger Bands wrap an upper and lower channel around price based on volatility — touching the outer band means price has stretched quickly. RSI (0 to 100) measures speed: above 70 suggests a rally may be overheated (Overbought); below 30 suggests selling may be overdone (Oversold).',
        keyTakeaway: 'Indicators support your price reading — never buy blindly just because RSI hits 30.',
      },
    ],
    quiz: [
      {
        id: 'l6-q1',
        question: 'If price is trading steadily ABOVE a rising 20-period SMA, what is the simplest interpretation?',
        options: ['The market is in an uptrend', 'The market is frozen', 'You must short immediately', 'Volume is negative'],
        correctIndex: 0,
        explanation: 'Price holding above an upward-sloping Moving Average is a classic sign of bullish trend momentum.',
      },
      {
        id: 'l6-q2',
        question: 'What does an RSI reading above 70 traditionally suggest?',
        options: [
          'The asset has moved up very fast and may be overbought / due for a pause',
          'The asset is worthless',
          'You should use 20x leverage immediately',
          'The spread just doubled',
        ],
        correctIndex: 0,
        explanation: 'RSI > 70 signals strong upward momentum that may be stretched in the short term.',
      },
      {
        id: 'l6-q3',
        question: 'Why do Bollinger Bands widen and narrow over time?',
        options: [
          'They react to changes in market volatility',
          'They change randomly every midnight',
          'They only measure Forex pip size',
          'They display your account cash balance',
        ],
        correctIndex: 0,
        explanation: 'Bollinger Bands expand when volatility rises and squeeze tight during quiet consolidation.',
      },
      {
        id: 'l6-q4',
        question: 'What is the smartest way to use indicators like RSI and Moving Averages?',
        options: [
          'Add 15 indicators until the chart is hidden',
          'Use 1–2 indicators to confirm trend and timing alongside clean price action and a Stop-Loss',
          'Ignore risk management whenever RSI is below 30',
          'Only trade when all indicators turn blue',
        ],
        correctIndex: 1,
        explanation: 'Simplicity wins: one trend tool + one momentum tool + clear risk rules beats cluttered charts.',
      },
    ],
  },
  {
    id: 'lesson-7',
    moduleId: 'mod-5',
    moduleTitle: 'Module 5: Risk & Discipline',
    number: 7,
    title: 'The 1–2% Rule, Risk/Reward & Position Sizing',
    level: 'Beginner',
    durationMinutes: 5,
    summary: 'Learn the #1 formula that keeps successful traders in the game — even when half their trades lose.',
    practiceSymbol: 'BTC/USD',
    simulator: 'position-sizer',
    sections: [
      {
        heading: 'Never Bet the Farm on One Idea',
        body: 'Even great traders lose 40–50% of their trades. Their secret is sizing: they risk only 1% to 2% of their total account if their Stop-Loss is hit. With a $100,000 paper account, risking 1% means your Stop-Loss is placed so a loss costs at most $1,000 — you would need 100 losing trades in a row to wipe out!',
        keyTakeaway: 'Risk 1% or less per trade as a beginner. Survival comes before profit.',
      },
      {
        heading: 'Risk-to-Reward Ratio (1:2 or Better)',
        body: 'Before clicking Buy or Sell, compare how much you could lose at your Stop-Loss vs. how much you could gain at your Take-Profit. If you risk $500 to try to make $1,000, that is a 1:2 Risk-to-Reward ratio. At 1:2, you only need to win 34% of your trades to break even!',
        keyTakeaway: 'Aim for trades where your potential reward is at least 2× your planned risk.',
      },
    ],
    quiz: [
      {
        id: 'l7-q1',
        question: 'On a $100,000 account using the 1% risk rule, what is the maximum dollar loss you should allow on one trade?',
        options: ['$10,000', '$1,000', '$50,000', '$100'],
        correctIndex: 1,
        explanation: '1% of $100,000 equals $1,000 maximum planned loss if your Stop-Loss is hit.',
      },
      {
        id: 'l7-q2',
        question: 'If every winning trade makes +$600 and every losing trade loses -$300 (a 1:2 ratio), and you win 50% of 10 trades, what is your net profit?',
        options: ['+$0 (break even)', '+$1,500 profit', '-$1,500 loss', '+$3,000 profit'],
        correctIndex: 1,
        explanation: '5 wins × $600 = +$3,000; 5 losses × -$300 = -$1,500; Net = +$1,500!',
      },
      {
        id: 'l7-q3',
        question: 'What is the hidden danger of high leverage (like 20x) for beginners?',
        options: [
          'It lowers your trading fees',
          'A tiny 5% move against you can wipe out 100% of your trade margin',
          'It disables candlestick charts',
          'It only works in Paper Trading',
        ],
        correctIndex: 1,
        explanation: 'Leverage multiplies gains AND losses equally — 20x leverage means a 5% adverse move equals a 100% margin loss.',
      },
      {
        id: 'l7-q4',
        question: 'When should you widen your Stop-Loss further away during a losing trade?',
        options: [
          'Whenever you feel hopeful it will bounce back',
          'Never — moving your Stop-Loss further away breaks your risk plan and turns small losses into big ones',
          'Every Friday afternoon',
          'Whenever RSI goes above 50',
        ],
        correctIndex: 1,
        explanation: 'Respecting your original Stop-Loss protects your capital and keeps your analytics honest.',
      },
    ],
  },
  {
    id: 'lesson-8',
    moduleId: 'mod-6',
    moduleTitle: 'Module 6: Practice Playbooks',
    number: 8,
    title: 'Two Beginner Strategies You Can Practice Today',
    level: 'Intermediate',
    durationMinutes: 6,
    summary: 'Put everything together with two step-by-step checklists: Trend Pullback and Range Bounce.',
    practiceSymbol: 'EUR/USD',
    simulator: 'order-sandbox',
    sections: [
      {
        heading: 'Playbook A: Trend Pullback (Follow the River)',
        body: 'Step 1: Switch to the 1H or 4H chart and turn on SMA 20. Step 2: Confirm price is cleanly above a rising SMA 20. Step 3: Wait for a calm red pullback candle near the SMA 20 instead of chasing green candles. Step 4: Buy with a Stop-Loss below the recent swing low and Take-Profit at 2× your risk.',
        keyTakeaway: 'Buy healthy dips inside an existing uptrend rather than chasing spikes.',
      },
      {
        heading: 'Playbook B: Bollinger + RSI Range Bounce',
        body: 'When a Forex pair like EUR/USD is moving sideways in a calm range: Step 1: Turn on Bollinger Bands and RSI. Step 2: Look for price touching the lower band while RSI dips near 30–35, then shows a green rejection candle. Step 3: Target the middle SMA line with a tight Stop-Loss just outside the band.',
        keyTakeaway: 'Track every practice trade in your Overview Log to see which playbook fits you best.',
      },
    ],
    quiz: [
      {
        id: 'l8-q1',
        question: 'In the Trend Pullback playbook, when do you ideally enter a Buy trade?',
        options: [
          'After a massive green candle has already jumped far away from SMA 20',
          'After a calm pullback brings price back near the rising SMA 20',
          'When SMA 20 is pointing steeply downward',
          'Right before closing the app without a Stop-Loss',
        ],
        correctIndex: 1,
        explanation: 'Entering on a pullback near support/SMA 20 gives a tighter Stop-Loss and much better Risk-to-Reward.',
      },
      {
        id: 'l8-q2',
        question: 'Why should you review your Historical Trade Log after 10–20 paper trades?',
        options: [
          'To measure your real Win Rate, Profit Factor, and which setups actually work for you',
          'Because paper logs expire after 24 hours',
          'To delete losing trades from memory',
          'Only to change chart colors',
        ],
        correctIndex: 0,
        explanation: 'Your performance analytics turn practice into measurable skill by showing what works and what leaks money.',
      },
      {
        id: 'l8-q3',
        question: 'How can Price Alerts help you trade calmly without staring at charts all day?',
        options: [
          'Alerts notify you automatically when price reaches your planned entry or exit level',
          'Alerts place random trades for you',
          'Alerts predict tomorrow’s news headlines',
          'Alerts turn off spreads',
        ],
        correctIndex: 0,
        explanation: 'Setting price alerts lets you step away and only act when the market reaches your planned price zone.',
      },
      {
        id: 'l8-q4',
        question: 'What is the best sign you are ready to refine a strategy in your paper account?',
        options: [
          'You got lucky on 1 big leveraged trade',
          'You followed your Stop-Loss and sizing rules consistently across at least 15–20 logged trades',
          'You disabled all safety exits',
          'You guessed based on coin logos',
        ],
        correctIndex: 1,
        explanation: 'Consistent execution over a meaningful sample of trades is the foundation of real trading skill.',
      },
    ],
  },
];
```

### `src/data/instruments.ts`

```ts
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
```

### `src/data/strategies.ts`

```ts
import type {Language} from '../i18n/types';
import type {StrategyCategory, StrategyId} from '../types/trading';

export interface StrategyLocalizedContent {
  name: string;
  tagline: string;
  plainSummary: string;
  correctSteps: [string, string, string];
  mistakeSteps: [string, string, string];
  correctOutcome: string;
  mistakeOutcome: string;
  checklist: [string, string, string];
  realExample: {
    title: string;
    timeframe: string;
    dateWindow: string;
    entryTrigger: string;
    entryPrice: string;
    stopLossPrice: string;
    takeProfitPrice: string;
    moveResult: string;
    whyItWorked: string;
  };
}

export interface StrategyDefinition {
  id: StrategyId;
  category: StrategyCategory;
  level: 'Beginner' | 'Intermediate';
  bias: 'bullish' | 'bearish';
  practiceSymbol: string;
  typicalRiskReward: string;
  /** Normalized 0..100 chart path for real-example visual mini-diagram */
  examplePath: Array<[number, number]>;
  exampleKeyLevels: {
    entryY: number;
    stopY: number;
    targetY: number;
    triggerX: number;
  };
  translations: Record<Language, StrategyLocalizedContent>;
}

export const TRADING_STRATEGIES: StrategyDefinition[] = [
  {
    id: 'head-shoulders',
    category: 'reversal',
    level: 'Beginner',
    bias: 'bearish',
    practiceSymbol: 'BTC/USD',
    typicalRiskReward: '1 : 2.0',
    examplePath: [
      [8, 72],
      [22, 36],
      [34, 62],
      [48, 18],
      [61, 62],
      [73, 38],
      [84, 64],
      [95, 88],
    ],
    exampleKeyLevels: {
      entryY: 62,
      stopY: 36,
      targetY: 88,
      triggerX: 83,
    },
    translations: {
      en: {
        name: 'Head & Shoulders',
        tagline: 'Spot when an uptrend runs out of buyers and prepares to reverse downward',
        plainSummary:
          'Price makes a peak (Left Shoulder), surges to a higher peak (Head), then fails to reach the high on a third bounce (Right Shoulder). When price breaks below the floor connecting the dips (Neckline), sellers take control.',
        correctSteps: [
          'Spot Left Shoulder, higher Head, and lower Right Shoulder testing the horizontal Neckline.',
          'Wait patiently for a clean candle break below the Neckline—never guess early.',
          'Sell on the breakdown or retest with Stop-Loss above the Right Shoulder and Target equal to Head-to-Neckline height.',
        ],
        mistakeSteps: [
          'Shorting blindly right at the top of the Head while buyers are still strongly pushing up.',
          'Ignoring the Neckline confirmation or trading without a protective Stop-Loss.',
          'Price rallies higher and wipes out the early short before the pattern even completes.',
        ],
        correctOutcome: 'Confirmed neckline break + defined Stop-Loss yields a clean 1:2.0 short trade.',
        mistakeOutcome: 'Guessing the top early gets squeezed out before the real reversal begins.',
        checklist: [
          'Right Shoulder peak is clearly lower than the Head.',
          'A full candle closes cleanly below the Neckline support.',
          'Distance from Neckline to Target is at least 1.5x–2x your Stop-Loss risk.',
        ],
        realExample: {
          title: 'BTC/USD 4H Breakdown Setup',
          timeframe: '4H Chart',
          dateWindow: 'Spring Cycle Peak',
          entryTrigger: '4H candle close below $67,200 neckline',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: '-7.9% drop (+2.0R gain)',
          whyItWorked:
            'Buyers failed to push Bitcoin back near $71,800 on the Right Shoulder bounce ($69,500), proving demand was exhausted. Once the $67,200 neckline cracked, trapped long positions triggered a fast drop straight to the measured target.',
        },
      },
      fr: {
        name: 'Épaule-Tête-Épaule',
        tagline: 'Repérez l’essoufflement d’une tendance haussière avant le retournement baissier',
        plainSummary:
          'Le prix forme un premier sommet (Épaule gauche), un sommet plus haut (Tête), puis un rebond plus faible (Épaule droite). La cassure de la ligne de cou valide la prise de contrôle des vendeurs.',
        correctSteps: [
          'Identifiez l’Épaule gauche, la Tête plus haute et l’Épaule droite plus basse sur la ligne de cou.',
          'Attendez la cassure nette sous la ligne de cou sans anticiper trop tôt.',
          'Vendez à la cassure ou au retest avec Stop-Loss au-dessus de l’Épaule droite et objectif égal à la hauteur Tête–Cou.',
        ],
        mistakeSteps: [
          'Vendre à découvert au sommet de la Tête alors que les acheteurs dominent encore.',
          'Ignorer la confirmation de la ligne de cou ou oublier le Stop-Loss.',
          'Le prix remonte brutalement et liquide la position avant la formation de l’Épaule droite.',
        ],
        correctOutcome: 'Cassure validée + Stop-Loss défini = ratio rendement/risque propre de 1:2.0.',
        mistakeOutcome: 'Anticiper le sommet trop tôt expose à un squeeze inutile.',
        checklist: [
          'Le sommet de l’Épaule droite est nettement inférieur à celui de la Tête.',
          'Une bougie complète clôture sous le support de la ligne de cou.',
          'L’objectif mesuré offre au moins 1,5x à 2x le risque du Stop-Loss.',
        ],
        realExample: {
          title: 'BTC/USD — Cassure en 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Sommet de cycle',
          entryTrigger: 'Clôture 4H sous la ligne de cou à 67 200 $',
          entryPrice: '67 100 $',
          stopLossPrice: '69 750 $',
          takeProfitPrice: '61 800 $',
          moveResult: 'Baisse -7,9 % (+2.0R)',
          whyItWorked:
            'Les acheteurs n’ont pas réussi à ramener le Bitcoin vers 71 800 $ lors de l’Épaule droite (69 500 $). La rupture des 67 200 $ a déclenché les stops acheteurs jusqu’à l’objectif théorique.',
        },
      },
      es: {
        name: 'Hombro-Cabeza-Hombro',
        tagline: 'Detecta cuándo una tendencia alcista pierde fuerza antes de girar a la baja',
        plainSummary:
          'El precio forma un pico (Hombro izquierdo), un pico más alto (Cabeza) y un rebote más débil (Hombro derecho). Al romper la línea de cuello hacia abajo, los vendedores toman el mando.',
        correctSteps: [
          'Identifica Hombro izquierdo, Cabeza más alta y Hombro derecho más bajo sobre la línea de cuello.',
          'Espera con paciencia el cierre de vela debajo de la línea de cuello.',
          'Vende tras la ruptura o retesteo con Stop-Loss sobre el Hombro derecho y objetivo igual a la altura Cabeza–Cuello.',
        ],
        mistakeSteps: [
          'Entrar en venta justo en la cima de la Cabeza mientras la tendencia sigue fuerte.',
          'Operar sin esperar ruptura de cuello o sin Stop-Loss de protección.',
          'Un último impulso alcista te saca en pérdida antes de completarse el patrón.',
        ],
        correctOutcome: 'Ruptura confirmada + Stop-Loss claro ofrece una operación limpia 1:2.0.',
        mistakeOutcome: 'Adivinar el techo demasiado pronto termina en pérdida evitable.',
        checklist: [
          'El pico del Hombro derecho es claramente más bajo que la Cabeza.',
          'Una vela completa cierra por debajo de la línea de cuello.',
          'La distancia al objetivo es al menos 1.5x–2x tu riesgo en Stop-Loss.',
        ],
        realExample: {
          title: 'BTC/USD — Ruptura en 4H',
          timeframe: 'Gráfico 4H',
          dateWindow: 'Techo de ciclo',
          entryTrigger: 'Cierre 4H bajo línea de cuello en $67,200',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: 'Caída -7.9% (+2.0R)',
          whyItWorked:
            'Los compradores no lograron volver a $71,800 en el Hombro derecho ($69,500). Al perder $67,200, el precio aceleró directo al objetivo proyectado.',
        },
      },
      ar: {
        name: 'نموذج الرأس والكتفين',
        tagline: 'اكتشف ضعف المشترين ونهاية الاتجاه الصاعد قبل الانعكاس الهبوطي',
        plainSummary:
          'يشكّل السعر قمة أولى (الكتف الأيسر)، ثم قمة أعلى (الرأس)، ثم ارتداداً أضعف (الكتف الأيمن). عند كسر خط العنق للأسفل يسيطر البائعون.',
        correctSteps: [
          'حدّد الكتف الأيسر والرأس الأعلى والكتف الأيمن الأدنى فوق خط العنق.',
          'انتظر إغلاق شمعة واضحة أسفل خط العنق ولا تستعجل الدخول.',
          'ادخل بيعاً بعد الكسر مع وقف خسارة فوق الكتف الأيمن وهدف يساوي ارتفاع الرأس عن خط العنق.',
        ],
        mistakeSteps: [
          'البيع المبكر عند قمة الرأس أثناء اندفاع المشترين القوي.',
          'تجاهل كسر خط العنق أو التداول بدون وقف خسارة واضح.',
          'ارتداد السعر للأعلى يضرب الصفقة قبل اكتمال الكتف الأيمن.',
        ],
        correctOutcome: 'تأكيد كسر خط العنق مع وقف خسارة محدد يحقق صفقة بيع بنسبة عائد 1:2.0.',
        mistakeOutcome: 'محاولة تخمين القمة مبكراً تؤدي غالباً لخسارة سريعة.',
        checklist: [
          'قمة الكتف الأيمن أقل بوضوح من قمة الرأس.',
          'إغلاق شمعة كاملة أسفل دعم خط العنق.',
          'المسافة إلى الهدف لا تقل عن 1.5x إلى 2x من مسافة وقف الخسارة.',
        ],
        realExample: {
          title: 'مثال BTC/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'قمة دورة سوقية',
          entryTrigger: 'إغلاق شمعة 4 ساعات أسفل خط العنق 67,200$',
          entryPrice: '$67,100',
          stopLossPrice: '$69,750',
          takeProfitPrice: '$61,800',
          moveResult: 'هبوط -7.9% (ربح +2.0R)',
          whyItWorked:
            'فشل المشترون في العودة لقمة 71,800$ عند الكتف الأيمن (69,500$). وبمجرد كسر 67,200$، تسارع الهبوط مباشرة نحو الهدف المحسوب.',
        },
      },
    },
  },
  {
    id: 'double-bottom',
    category: 'reversal',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'EUR/USD',
    typicalRiskReward: '1 : 2.2',
    examplePath: [
      [8, 28],
      [25, 76],
      [43, 48],
      [60, 75],
      [75, 48],
      [94, 18],
    ],
    exampleKeyLevels: {
      entryY: 48,
      stopY: 82,
      targetY: 18,
      triggerX: 75,
    },
    translations: {
      en: {
        name: 'Double Bottom ("W" Pattern)',
        tagline: 'Catch a strong floor bounce when sellers fail twice to break lower',
        plainSummary:
          'After a downtrend, price bounces off support (Bottom 1), peaks at a middle resistance (Neckline), drops back to test the same support (Bottom 2), and rallies cleanly above the Neckline.',
        correctSteps: [
          'Identify two distinct lows near the same support floor forming a clear "W" shape.',
          'Wait for price to break above the middle peak (Neckline) to confirm buyers won.',
          'Buy on breakout with Stop-Loss safely beneath Bottom 2 and Target equal to the "W" height.',
        ],
        mistakeSteps: [
          'Buying on the first drop before seeing whether the support floor actually holds.',
          'Entering while price is still trapped below the middle Neckline resistance.',
          'Price slices straight through support into a fresh downtrend.',
        ],
        correctOutcome: 'Confirmed "W" breakout protects downside and rides the new uptrend.',
        mistakeOutcome: 'Catching a falling knife without confirmation leads to avoidable losses.',
        checklist: [
          'Bottom 1 and Bottom 2 bounce off roughly the same horizontal support zone.',
          'Bullish candle closes above the middle "W" peak (Neckline).',
          'Stop-Loss sits safely below the lowest wick of the two bottoms.',
        ],
        realExample: {
          title: 'EUR/USD 4H Support Reversal',
          timeframe: '4H Forex Chart',
          dateWindow: 'Major Support Zone',
          entryTrigger: 'Break & close above 1.0745 mid-peak',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R gain)',
          whyItWorked:
            'Sellers pushed EUR/USD down to 1.0660 twice but ran out of momentum both times. Clearing 1.0745 flipped market structure bullish and kicked off a steady 230-pip rally.',
        },
      },
      fr: {
        name: 'Double Creux (Figure en "W")',
        tagline: 'Capturez un retournement haussier lorsque les vendeurs échouent deux fois sur un support',
        plainSummary:
          'Après une baisse, le prix rebondit sur un support (Creux 1), bloque sur un sommet intermédiaire (Ligne de cou), reteste le support (Creux 2) puis casse la ligne de cou vers le haut.',
        correctSteps: [
          'Repérez deux creux au même niveau de support formant un "W" lisible.',
          'Attendez la cassure au-dessus du sommet central pour valider la reprise acheteuse.',
          'Achetez à la cassure avec Stop-Loss sous le Creux 2 et objectif égal à la hauteur du "W".',
        ],
        mistakeSteps: [
          'Acheter dès la première chute avant de vérifier si le support tient vraiment.',
          'Entrer alors que le prix reste bloqué sous la résistance centrale.',
          'Le support cède immédiatement et la tendance baissière continue.',
        ],
        correctOutcome: 'La cassure du "W" limite le risque et suit le nouvel élan haussier.',
        mistakeOutcome: 'Rattraper un couteau qui tombe sans confirmation coûte cher.',
        checklist: [
          'Les deux creux rebondissent sur une même zone horizontale de support.',
          'Une bougie clôture nettement au-dessus du pic central du "W".',
          'Le Stop-Loss est placé sous la mèche la plus basse des deux creux.',
        ],
        realExample: {
          title: 'EUR/USD — Rebond 4H sur support',
          timeframe: 'Graphique 4H',
          dateWindow: 'Zone de support majeure',
          entryTrigger: 'Clôture au-dessus du pic 1,0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R)',
          whyItWorked:
            'Les vendeurs ont échoué deux fois autour de 1,0660. Le franchissement des 1,0745 a confirmé le retour des acheteurs pour une hausse propre de 230 pips.',
        },
      },
      es: {
        name: 'Doble Suelo (Patrón en "W")',
        tagline: 'Aprovecha el giro alcista cuando los vendedores fallan dos veces en romper un soporte',
        plainSummary:
          'Tras una caída, el precio rebota en un soporte (Suelo 1), marca un pico intermedio, vuelve a probar el mismo piso (Suelo 2) y rompe finalmente al alza por encima del pico central.',
        correctSteps: [
          'Localiza dos mínimos en la misma zona de soporte formando una "W".',
          'Espera la ruptura por encima del pico central (línea de cuello).',
          'Compra en la ruptura con Stop-Loss debajo del Suelo 2 y objetivo igual a la altura de la "W".',
        ],
        mistakeSteps: [
          'Comprar en la primera caída sin confirmar que el soporte resista.',
          'Entrar mientras el precio sigue atrapado debajo de la resistencia media.',
          'El soporte se rompe y la tendencia bajista continúa.',
        ],
        correctOutcome: 'La ruptura confirmada de la "W" protege tu capital y captura el impulso.',
        mistakeOutcome: 'Intentar atrapar un cuchillo cayendo sin señal suele acabar en Stop-Loss.',
        checklist: [
          'Los dos mínimos rebotan aproximadamente en la misma zona de soporte.',
          'Una vela alcista cierra por encima del pico central de la "W".',
          'El Stop-Loss queda por debajo de la mecha más baja de ambos suelos.',
        ],
        realExample: {
          title: 'EUR/USD — Reversión 4H',
          timeframe: 'Gráfico 4H Forex',
          dateWindow: 'Soporte clave',
          entryTrigger: 'Ruptura y cierre sobre 1.0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 pips (+2.2R)',
          whyItWorked:
            'Los vendedores testaron 1.0660 dos veces sin éxito. Superar 1.0745 confirmó el cambio de estructura y generó una subida limpia de 230 pips.',
        },
      },
      ar: {
        name: 'القاع المزدوج (نموذج W)',
        tagline: 'التقط ارتداداً صاعداً قوياً عندما يفشل البائعون مرتين في كسر الدعم',
        plainSummary:
          'بعد موجة هبوط، يرتد السعر من منطقة دعم (القاع الأول)، يلامس قمة وسطى، ثم يعود لاختبار نفس الدعم (القاع الثاني) قبل اختراق القمة الوسطى صعوداً.',
        correctSteps: [
          'حدّد قاعين متقاربين على نفس مستوى الدعم بشكل يشبه حرف W.',
          'انتظر اختراق القمة الوسطى (خط العنق) لتأكيد سيطرة المشترين.',
          'ادخل شراءً مع وقف خسارة أسفل القاع الثاني وهدف يساوي ارتفاع نموذج W.',
        ],
        mistakeSteps: [
          'الشراء أثناء الهبوط الأول قبل التأكد من تماسك الدعم.',
          'الدخول قبل اختراق المقاومة الوسطى أثناء بقاء السعر محصوراً.',
          'استمرار الهبوط وكسر الدعم فوراً بعد الدخول المتسرع.',
        ],
        correctOutcome: 'اختراق نموذج W بعد التأكيد يحمي حسابك ويستهدف بداية الصعود.',
        mistakeOutcome: 'الشراء العشوائي في منتصف الهبوط يؤدي لخسائر متكررة.',
        checklist: [
          'القاع الأول والثاني يرتدان من نفس منطقة الدعم الأفقية تقريباً.',
          'إغلاق شمعة صاعدة واضحة أعلى القمة الوسطى.',
          'وضع وقف الخسارة بأمان أسفل أدنى ذيل للقاعين.',
        ],
        realExample: {
          title: 'مثال EUR/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'منطقة دعم رئيسية',
          entryTrigger: 'اختراق وإغلاق أعلى القمة الوسطى 1.0745',
          entryPrice: '1.0750',
          stopLossPrice: '1.0645',
          takeProfitPrice: '1.0980',
          moveResult: '+230 نقطة (ربح +2.2R)',
          whyItWorked:
            'اختبر البائعون مستوى 1.0660 مرتين دون كسره. اختراق 1.0745 حوّل الاتجاه إلى صاعد ودفع الزوج لصعود متواصل بمقدار 230 نقطة.',
        },
      },
    },
  },
  {
    id: 'breakout-retest',
    category: 'continuation',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'ETH/USD',
    typicalRiskReward: '1 : 2.8',
    examplePath: [
      [8, 72],
      [22, 56],
      [35, 68],
      [48, 56],
      [62, 36],
      [74, 56],
      [94, 16],
    ],
    exampleKeyLevels: {
      entryY: 56,
      stopY: 70,
      targetY: 16,
      triggerX: 74,
    },
    translations: {
      en: {
        name: 'Breakout & Retest',
        tagline: 'Wait for old resistance to flip into new support instead of chasing green candles',
        plainSummary:
          'Instead of buying at the top of a sudden breakout spike, patient traders let price pull back and bounce off the broken ceiling (retest). That bounce offers a tight Stop-Loss and much higher Reward.',
        correctSteps: [
          'Draw a clear horizontal ceiling where price got rejected at least twice.',
          'Let a strong candle break above the ceiling, then patiently wait for the pullback.',
          'Buy when the old ceiling holds as a new floor, placing Stop-Loss just beneath it.',
        ],
        mistakeSteps: [
          'Chasing FOMO at the very top of the initial breakout candle.',
          'Putting a wide random Stop-Loss or panicking out during the normal pullback.',
          'Selling in fear right where smart buyers enter on the retest.',
        ],
        correctOutcome: 'Retest entry gives a tiny Stop-Loss and high 1:2.8 Risk:Reward.',
        mistakeOutcome: 'Chasing spikes puts you underwater as soon as price pulls back to retest.',
        checklist: [
          'Resistance ceiling was tested clearly 2+ times before the breakout.',
          'Breakout candle closed decisively above the resistance zone.',
          'Retest candle shows buyers defending the flipped level (wick rejection or bounce).',
        ],
        realExample: {
          title: 'ETH/USD 4H Resistance Flip',
          timeframe: '4H Crypto Chart',
          dateWindow: 'Range Breakout',
          entryTrigger: 'Pullback bounce at flipped $3,220 level',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: '+7.8% rally (+2.8R gain)',
          whyItWorked:
            'Ethereum broke cleanly above its $3,220 ceiling to $3,330, then dipped back to $3,220 where buyers defended the level. Entering on the retest kept risk tight ($90) for a $250 upside move.',
        },
      },
      fr: {
        name: 'Cassure & Retest (Break & Retest)',
        tagline: 'Laissez l’ancienne résistance devenir un support au lieu d’acheter en plein FOMO',
        plainSummary:
          'Plutôt que d’acheter tout en haut d’une bougie explosive, attendez que le prix revienne tester l’ancien plafond cassé. Ce rebond offre un Stop-Loss très court et un excellent ratio.',
        correctSteps: [
          'Tracez un plafond horizontal ayant rejeté le prix au moins deux fois.',
          'Laissez une bougie forte casser le plafond, puis attendez le repli.',
          'Achetez quand l’ancien plafond rebondit comme nouveau plancher, avec Stop-Loss juste en dessous.',
        ],
        mistakeSteps: [
          'Acheter par FOMO tout en haut de la grande bougie verte de cassure.',
          'Paniquer et clôturer en perte pendant le pullback normal de retest.',
          'Vendre exactement là où les traders patients entrent à l’achat.',
        ],
        correctOutcome: 'Entrer sur le retest réduit le Stop-Loss pour un ratio de 1:2.8.',
        mistakeOutcome: 'Poursuivre le prix expose immédiatement au repli technique.',
        checklist: [
          'Le plafond de résistance a bloqué le prix au moins 2 fois avant la cassure.',
          'La bougie de cassure a clôturé franchement au-dessus du niveau.',
          'Le retest montre un rebond clair (mèche basse ou bougie verte).',
        ],
        realExample: {
          title: 'ETH/USD — Cassure & Retest 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Sortie de range',
          entryTrigger: 'Rebond sur l’ancien plafond à 3 220 $',
          entryPrice: '3 225 $',
          stopLossPrice: '3 135 $',
          takeProfitPrice: '3 475 $',
          moveResult: 'Hausse +7,8 % (+2.8R)',
          whyItWorked:
            'Ethereum a cassé 3 220 $ jusqu’à 3 330 $, puis est revenu s’appuyer sur 3 220 $. L’entrée sur retest a limité le risque à 90 $ pour viser +250 $.',
        },
      },
      es: {
        name: 'Ruptura y Retesteo',
        tagline: 'Espera a que la antigua resistencia actúe como nuevo soporte en vez de perseguir velas',
        plainSummary:
          'En lugar de comprar en la cima de un impulso repentino, espera a que el precio retroceda hasta el techo roto y rebote. Ese apoyo permite un Stop-Loss ajustado y mayor beneficio.',
        correctSteps: [
          'Marca un techo horizontal claro que haya rechazado al precio al menos dos veces.',
          'Deja que una vela fuerte rompa el nivel y espera el retroceso.',
          'Compra cuando el antiguo techo sostenga al precio como piso, con Stop-Loss justo debajo.',
        ],
        mistakeSteps: [
          'Comprar por FOMO en la punta máxima de la vela de ruptura.',
          'Asustarse y vender en pérdida cuando ocurre el retroceso normal del retesteo.',
          'Salir justo en el nivel donde entran los compradores pacientes.',
        ],
        correctOutcome: 'Entrar en el retesteo ofrece un Stop-Loss corto y un ratio 1:2.8.',
        mistakeOutcome: 'Perseguir el precio te deja atrapado durante el retroceso sano.',
        checklist: [
          'La resistencia fue probada claramente 2 o más veces antes de romper.',
          'La vela de ruptura cerró con fuerza por encima de la zona.',
          'La vela de retesteo muestra rechazo bajista y rebote comprador.',
        ],
        realExample: {
          title: 'ETH/USD — Ruptura y Retesteo 4H',
          timeframe: 'Gráfico 4H Cripto',
          dateWindow: 'Ruptura de rango',
          entryTrigger: 'Rebote en nivel convertido a soporte $3,220',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: 'Subida +7.8% (+2.8R)',
          whyItWorked:
            'Ethereum rompió $3,220 hasta $3,330 y luego retrocedió a validar $3,220 como suelo. Entrar ahí redujo el riesgo a $90 para capturar $250.',
        },
      },
      ar: {
        name: 'الاختراق وإعادة الاختبار',
        tagline: 'انتظر تحوّل المقاومة السابقة إلى دعم جديد بدلاً من مطاردة الشموع الصاعدة',
        plainSummary:
          'بدلاً من الشراء عند قمة شمعة الاختراق المفاجئة، ينتظر المتداول الصبور عودة السعر لملامسة سقف المقاومة المكسور والارتداد منه، ما يمنح وقف خسارة صغيراً وعائداً أكبر.',
        correctSteps: [
          'ارسم خط مقاومة أفقياً واضحاً ردّ السعر مرتين على الأقل.',
          'دع شمعة قوية تخترق السقف ثم انتظر التراجع بهدوء.',
          'ادخل شراءً عند ارتداد السعر فوق المقاومة السابقة مع وقف خسارة أسفلها مباشرة.',
        ],
        mistakeSteps: [
          'مطاردة السعر بدافع الخوف من فوات الفرصة (FOMO) عند أعلى قمة.',
          'الذعر والبيع بخسارة أثناء التراجع الطبيعي لإعادة الاختبار.',
          'الخروج في النقطة نفسها التي يدخل عندها المشترون المحترفون.',
        ],
        correctOutcome: 'الدخول عند إعادة الاختبار يقلل وقف الخسارة ويحقق نسبة عائد 1:2.8.',
        mistakeOutcome: 'مطاردة الاندفاع المفاجئ تجعلك تحت الضغط فور بدء التراجع الطبيعي.',
        checklist: [
          'تم اختبار المقاومة مرتين على الأقل قبل الاختراق.',
          'أغلقت شمعة الاختراق بوضوح أعلى منطقة المقاومة.',
          'أظهرت شمعة إعادة الاختبار دفاع المشترين عن المستوى بذيل سفلي أو ارتداد قوي.',
        ],
        realExample: {
          title: 'مثال ETH/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'اختراق نطاق عرضي',
          entryTrigger: 'ارتداد بعد إعادة اختبار مستوى 3,220$',
          entryPrice: '$3,225',
          stopLossPrice: '$3,135',
          takeProfitPrice: '$3,475',
          moveResult: 'صعود +7.8% (ربح +2.8R)',
          whyItWorked:
            'اخترق إيثيريوم سقف 3,220$ نحو 3,330$ ثم عاد لاختبار 3,220$ كدعم جديد. هذا الدخول أبقى المخاطرة عند 90$ مقابل ربح مستهدف 250$.',
        },
      },
    },
  },
  {
    id: 'bull-flag',
    category: 'continuation',
    level: 'Beginner',
    bias: 'bullish',
    practiceSymbol: 'SOL/USD',
    typicalRiskReward: '1 : 2.5',
    examplePath: [
      [10, 82],
      [30, 32],
      [42, 42],
      [52, 36],
      [64, 48],
      [74, 38],
      [94, 14],
    ],
    exampleKeyLevels: {
      entryY: 38,
      stopY: 50,
      targetY: 14,
      triggerX: 74,
    },
    translations: {
      en: {
        name: 'Bull Flag Continuation',
        tagline: 'Join a strong uptrend after a calm, orderly pause ("the Flag")',
        plainSummary:
          'A sharp rally (the Flagpole) pauses in a tight, slightly downward-sloping channel (the Flag) as early buyers take small profits. Breaking above the top of the Flag launches the next leg up.',
        correctSteps: [
          'Spot a steep upward surge (Flagpole) followed by a calm, narrow pullback channel.',
          'Wait for price to break out above the upper trendline of the Flag channel.',
          'Enter long with Stop-Loss under the Flag low and Target equal to the Flagpole move.',
        ],
        mistakeSteps: [
          'Shorting the gentle pullback inside the Flag thinking the uptrend is dead.',
          'Entering while price is drifting sideways inside the channel before breakout.',
          'Getting swept away when the main trend resumes violently upward.',
        ],
        correctOutcome: 'Trading with the Flagpole trend captures fast continuation gains (1:2.5).',
        mistakeOutcome: 'Betting against a healthy pause fights the dominant trend.',
        checklist: [
          'Flagpole shows a strong, clean upward impulse move.',
          'Pullback inside the Flag stays shallow (less than 38–50% of the pole).',
          'Entry triggers on a decisive candle break above the upper Flag line.',
        ],
        realExample: {
          title: 'SOL/USD 1H Trend Continuation',
          timeframe: '1H Crypto Chart',
          dateWindow: 'Momentum Rally',
          entryTrigger: 'Break above $201 upper flag channel',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: '+8.7% surge (+2.5R gain)',
          whyItWorked:
            'Solana surged from $182 to $204 (Flagpole), then drifted gently down to $195 in a neat parallel channel without heavy selling. Breaking $201 ignited the second wave straight past $218.',
        },
      },
      fr: {
        name: 'Drapeau Haussier (Bull Flag)',
        tagline: 'Rejoignez une tendance haussière forte après une pause calme et ordonnée',
        plainSummary:
          'Une forte impulsion (le Mât) est suivie d’un petit canal légèrement descendant (le Drapeau). La sortie par le haut du drapeau relance la tendance initiale.',
        correctSteps: [
          'Repérez une impulsion verticale (Mât) suivie d’un repli serré et ordonné.',
          'Attendez la cassure au-dessus de la borne haute du canal du drapeau.',
          'Achetez avec Stop-Loss sous le bas du drapeau et objectif égal à la taille du Mât.',
        ],
        mistakeSteps: [
          'Vendre à découvert la petite pause en pensant que la tendance est terminée.',
          'Entrer au hasard au milieu du canal avant la cassure haute.',
          'Subir la reprise brutale de la tendance haussière.',
        ],
        correctOutcome: 'Suivre le mât après cassure capture une continuation rapide (1:2.5).',
        mistakeOutcome: 'Parier contre une respiration saine expose au contre-pied.',
        checklist: [
          'Le mât montre une impulsion haussière franche.',
          'Le repli reste modéré (moins de 38–50 % du mât).',
          'Une bougie clôture clairement au-dessus de la ligne haute du drapeau.',
        ],
        realExample: {
          title: 'SOL/USD — Continuation 1H',
          timeframe: 'Graphique 1H',
          dateWindow: 'Tendance haussière',
          entryTrigger: 'Cassure du canal à 201,00 $',
          entryPrice: '201,00 $',
          stopLossPrice: '194,00 $',
          takeProfitPrice: '218,50 $',
          moveResult: 'Hausse +8,7 % (+2.5R)',
          whyItWorked:
            'Solana a grimpé de 182 $ à 204 $, puis s’est reposé calmement vers 195 $ sans pression vendeuse. La cassure des 201 $ a propulsé la seconde vague vers 218,50 $.',
        },
      },
      es: {
        name: 'Bandera Alcista (Bull Flag)',
        tagline: 'Súbete a una tendencia fuerte justo cuando termina una pausa ordenada',
        plainSummary:
          'Tras una subida rápida (el Mástil), el precio descansa en un canal estrecho levemente inclinado hacia abajo (la Bandera). Al romper por arriba, continúa el impulso.',
        correctSteps: [
          'Identifica un impulso fuerte (Mástil) seguido de una consolidación estrecha.',
          'Espera que el precio rompa por encima de la línea superior de la Bandera.',
          'Compra con Stop-Loss debajo de la Bandera y objetivo igual a la altura del Mástil.',
        ],
        mistakeSteps: [
          'Vender en corto durante el pequeño descanso pensando que ya terminó la subida.',
          'Entrar en medio del canal sin esperar la señal de ruptura.',
          'Quedar atrapado cuando la tendencia principal vuelve a acelerar.',
        ],
        correctOutcome: 'Seguir la dirección del mástil ofrece una continuación rápida (1:2.5).',
        mistakeOutcome: 'Ir contra una pausa saludable es operar en contra de la tendencia.',
        checklist: [
          'El mástil muestra un impulso comprador limpio y potente.',
          'El retroceso de la bandera es poco profundo (menos del 38–50% del mástil).',
          'Una vela rompe con claridad el techo diagonal de la bandera.',
        ],
        realExample: {
          title: 'SOL/USD — Continuación 1H',
          timeframe: 'Gráfico 1H Cripto',
          dateWindow: 'Impulso alcista',
          entryTrigger: 'Ruptura del canal superior en $201.00',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: 'Subida +8.7% (+2.5R)',
          whyItWorked:
            'Solana subió de $182 a $204 y descansó ordenadamente hacia $195 sin ventas agresivas. Superar $201 activó la segunda ola hasta $218.50.',
        },
      },
      ar: {
        name: 'نموذج العَلَم الصاعد (Bull Flag)',
        tagline: 'انضم إلى اتجاه صاعد قوي بعد استراحة هادئة ومنظمة',
        plainSummary:
          'بعد قفزة سعرية حادة (السارية)، يهدأ السعر داخل قناة ضيقة مائلة قليلاً للأسفل (العَلَم) لجني أرباح خفيف، ثم يخترق سقف القناة ليكمل الصعود.',
        correctSteps: [
          'لاحظ اندفاعاً قوياً للأعلى (السارية) يتبعه تراجع هادئ ومحدود.',
          'انتظر اختراق الحد العلوي لقناة العَلَم قبل الدخول.',
          'اشترِ عند الاختراق مع وقف خسارة أسفل العَلَم وهدف يساوي طول السارية.',
        ],
        mistakeSteps: [
          'البيع عكس الاتجاه داخل الاستراحة ظناً أن الصعود انتهى.',
          'الدخول العشوائي وسط القناة قبل تأكيد الاختراق.',
          'مواجهة موجة صعود سريعة تدفع الصفقة للخسارة.',
        ],
        correctOutcome: 'التداول مع اتجاه السارية يلتقط موجة استمرار سريعة بنسبة 1:2.5.',
        mistakeOutcome: 'معاكسة استراحة صحية في اتجاه صاعد خطأ شائع ومكلف.',
        checklist: [
          'وجود موجة صعود أولية قوية وواضحة (السارية).',
          'التراجع داخل العَلَم محدود (أقل من 38–50% من السارية).',
          'إغلاق شمعة واضحة أعلى الخط العلوي لنموذج العَلَم.',
        ],
        realExample: {
          title: 'مثال SOL/USD على إطار ساعة',
          timeframe: 'إطار ساعة واحدة',
          dateWindow: 'موجة زخم صاعدة',
          entryTrigger: 'اختراق سقف قناة العَلَم عند 201.00$',
          entryPrice: '$201.00',
          stopLossPrice: '$194.00',
          takeProfitPrice: '$218.50',
          moveResult: 'صعود +8.7% (ربح +2.5R)',
          whyItWorked:
            'قفزت سولانا من 182$ إلى 204$ ثم تراجعت بهدوء نحو 195$ دون بيع عنيف. اختراق 201$ أطلق الموجة الثانية مباشرة فوق 218$.',
        },
      },
    },
  },
  {
    id: 'rsi-divergence',
    category: 'momentum',
    level: 'Intermediate',
    bias: 'bullish',
    practiceSymbol: 'GBP/USD',
    typicalRiskReward: '1 : 2.3',
    examplePath: [
      [8, 30],
      [26, 62],
      [42, 46],
      [62, 74],
      [76, 54],
      [94, 24],
    ],
    exampleKeyLevels: {
      entryY: 54,
      stopY: 78,
      targetY: 24,
      triggerX: 76,
    },
    translations: {
      en: {
        name: 'Bullish RSI Divergence',
        tagline: 'See hidden buyer strength when price makes a lower low but RSI rises',
        plainSummary:
          'When price dips to a slightly Lower Low while the RSI(14) indicator prints a Higher Low, selling pressure is quietly fading. Wait for price to break a short-term bounce high to enter safely.',
        correctSteps: [
          'Compare two price lows: Price prints a Lower Low while RSI forms a Higher Low below 40.',
          'Wait for a bullish structure break (price clearing the small bounce high between lows).',
          'Enter long with Stop-Loss under the second low and Target at the prior swing resistance.',
        ],
        mistakeSteps: [
          'Buying instantly on RSI divergence alone while candles are still crashing vertically.',
          'Ignoring the trend context—divergence is an early warning, not a standalone buy button.',
          'Price keeps sliding deeper into oversold territory before any bounce happens.',
        ],
        correctOutcome: 'Divergence + price confirmation catches reversals right as sellers tire out.',
        mistakeOutcome: 'Trading RSI without price confirmation leads to early entries.',
        checklist: [
          'Price makes a clear Lower Low while RSI(14) makes a clear Higher Low.',
          'First RSI trough started in or near the oversold zone (< 35).',
          'A bullish candle breaks above the minor swing peak between the two lows.',
        ],
        realExample: {
          title: 'GBP/USD 4H Momentum Shift',
          timeframe: '4H Forex Chart',
          dateWindow: 'Oversold Exhaustion',
          entryTrigger: 'Bullish close above 1.2520 swing high',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R gain)',
          whyItWorked:
            'GBP/USD dipped from 1.2510 down to 1.2465, yet RSI jumped from 26 to 35—revealing sellers lost strength. Clearing 1.2520 confirmed the shift and carried the pair up 175 pips.',
        },
      },
      fr: {
        name: 'Divergence Haussière RSI',
        tagline: 'Détectez l’épuisement des vendeurs quand le prix baisse mais que le RSI remonte',
        plainSummary:
          'Si le prix inscrit un creux plus bas alors que le RSI(14) forme un creux plus haut, la pression vendeuse s’épuise. Attendez ensuite la cassure d’un petit sommet de prix pour entrer.',
        correctSteps: [
          'Repérez un creux plus bas sur le prix face à un creux plus haut sur le RSI.',
          'Attendez une bougie haussière cassant le petit rebond intermédiaire.',
          'Achetez avec Stop-Loss sous le second creux et objectif vers l’ancienne résistance.',
        ],
        mistakeSteps: [
          'Acheter immédiatement sur la divergence pendant que les bougies chutent encore.',
          'Oublier que le RSI est un avertissement, pas un signal d’achat sans confirmation du prix.',
          'Le prix continue de glisser avant de réellement se retourner.',
        ],
        correctOutcome: 'Divergence + cassure de structure = entrée précise dès l’essoufflement vendeur.',
        mistakeOutcome: 'Entrer sur le RSI seul expose à des entrées prématurées.',
        checklist: [
          'Prix en creux plus bas tandis que le RSI(14) trace un creux plus haut.',
          'Le premier creux du RSI était proche de la zone de survente (< 35).',
          'Le prix casse à la hausse le petit sommet entre les deux creux.',
        ],
        realExample: {
          title: 'GBP/USD — Divergence RSI 4H',
          timeframe: 'Graphique 4H',
          dateWindow: 'Zone de survente',
          entryTrigger: 'Clôture haussière au-dessus de 1,2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R)',
          whyItWorked:
            'GBP/USD a glissé de 1,2510 à 1,2465 pendant que le RSI remontait de 26 à 35. Le passage au-dessus de 1,2520 a validé le retournement pour +175 pips.',
        },
      },
      es: {
        name: 'Divergencia Alcista RSI',
        tagline: 'Detecta fuerza oculta cuando el precio hace un mínimo menor pero el RSI sube',
        plainSummary:
          'Cuando el precio marca un mínimo ligeramente más bajo mientras el RSI(14) marca un mínimo más alto, la fuerza vendedora se agota. Espera a que el precio supere un techo menor para entrar.',
        correctSteps: [
          'Compara dos mínimos: el precio cae más bajo mientras el RSI forma un mínimo más alto.',
          'Espera una vela alcista que rompa el pequeño rebote entre ambos mínimos.',
          'Compra con Stop-Loss bajo el segundo mínimo y objetivo en la resistencia previa.',
        ],
        mistakeSteps: [
          'Comprar al instante solo por el RSI mientras el precio sigue desplomándose.',
          'Usar el oscilador sin esperar confirmación en la acción del precio.',
          'El precio sigue cayendo en sobreventa antes de girar.',
        ],
        correctOutcome: 'Divergencia + ruptura de precio captura el giro justo al agotarse la venta.',
        mistakeOutcome: 'Entrar sin confirmación del precio suele provocar entradas adelantadas.',
        checklist: [
          'El precio forma un mínimo más bajo y el RSI(14) un mínimo más alto.',
          'El primer mínimo del RSI nació en o cerca de sobreventa (< 35).',
          'Una vela rompe al alza el pequeño pico intermedio entre ambos mínimos.',
        ],
        realExample: {
          title: 'GBP/USD — Divergencia 4H',
          timeframe: 'Gráfico 4H Forex',
          dateWindow: 'Agotamiento bajista',
          entryTrigger: 'Cierre alcista sobre 1.2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 pips (+2.3R)',
          whyItWorked:
            'GBP/USD bajó de 1.2510 a 1.2465 mientras el RSI subía de 26 a 35. Romper 1.2520 confirmó el giro y entregó 175 pips.',
        },
      },
      ar: {
        name: 'الدايفرجنس الإيجابي لمؤشر RSI',
        tagline: 'اكتشف ضعف البائعين الخفي عندما يهبط السعر لقاع أدنى بينما يصعد مؤشر RSI',
        plainSummary:
          'عندما يسجل السعر قاعاً أقل قليلاً بينما يسجل مؤشر RSI(14) قاعاً أعلى، فهذا يكشف تراجع قوة البيع. انتظر اختراق قمة ارتداد صغيرة لتأكيد الدخول الآمن.',
        correctSteps: [
          'قارن قاعين: السعر يصنع قاعاً أدنى بينما يصنع RSI قاعاً أعلى أسفل 40.',
          'انتظر شمعة صاعدة تخترق القمة الصغيرة الفاصلة بين القاعين.',
          'ادخل شراءً مع وقف خسارة أسفل القاع الثاني وهدف عند المقاومة السابقة.',
        ],
        mistakeSteps: [
          'الشراء فوراً بمجرد رؤية الدايفرجنس أثناء استمرار الهبوط الحاد.',
          'التعامل مع المؤشر كزر شراء تلقائي بدون تأكيد حركة السعر.',
          'استمرار السعر في الهبوط لمنطقة تشبع بيعي أعمق قبل الارتداد.',
        ],
        correctOutcome: 'الدايفرجنس مع كسر هيكل السعر يلتقط الانعكاس عند نفاد طاقة البائعين.',
        mistakeOutcome: 'الدخول عبر المؤشر وحده يؤدي غالباً لدخول مبكر وخسارة.',
        checklist: [
          'السعر يكوّن قاعاً أدنى بوضوح ومؤشر RSI(14) يكوّن قاعاً أعلى.',
          'القاع الأول للمؤشر بدأ داخل أو قرب منطقة التشبع البيعي (أقل من 35).',
          'شمعة صاعدة تخترق القمة القصيرة الواقعة بين القاعين.',
        ],
        realExample: {
          title: 'مثال GBP/USD على إطار 4 ساعات',
          timeframe: 'إطار 4 ساعات',
          dateWindow: 'تشبع بيعي وانعكاس',
          entryTrigger: 'إغلاق صاعد أعلى القمة الصغيرة 1.2520',
          entryPrice: '1.2520',
          stopLossPrice: '1.2445',
          takeProfitPrice: '1.2695',
          moveResult: '+175 نقطة (ربح +2.3R)',
          whyItWorked:
            'هبط الجنيه من 1.2510 إلى 1.2465 بينما ارتفع مؤشر RSI من 26 إلى 35. تجاوز 1.2520 أكد تحوّل الزخم وصعد الزوج 175 نقطة.',
        },
      },
    },
  },
];
```

### `src/hooks/useAchievements.ts`

```ts
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {AchievementId, AchievementStatus, DailyMissionId, LessonProgress, Position, TradeLog} from '../types/trading';

const ACHIEVEMENTS_KEY = 'meridian_achievements_v1';

const ALL_ACHIEVEMENT_IDS: AchievementId[] = [
  'first-trade',
  'perfect-quiz',
  'streak-7',
  'risk-protector',
  'playbook-collector',
  'course-graduate',
];

function readUnlockedMap(): Partial<Record<AchievementId, number>> {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Record<AchievementId, number>> = {};
    for (const id of ALL_ACHIEVEMENT_IDS) {
      if (typeof parsed[id] === 'number' && Number.isFinite(parsed[id])) {
        out[id] = parsed[id] as number;
      }
    }
    return out;
  } catch {
    return {};
  }
}

interface UseAchievementsInput {
  totalTrades: number;
  positions: Position[];
  pendingOrdersCount: number;
  tradeLogs: TradeLog[];
  progress: Record<string, LessonProgress>;
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  longestStreak: number;
  savedStrategiesCount: number;
  completedMissionIds: DailyMissionId[];
  onUnlock?: (id: AchievementId) => void;
}

export function useAchievements({
  totalTrades,
  positions,
  pendingOrdersCount,
  tradeLogs,
  progress,
  completedLessons,
  totalLessons,
  streakDays,
  longestStreak,
  savedStrategiesCount,
  completedMissionIds,
  onUnlock,
}: UseAchievementsInput) {
  const [unlockedMap, setUnlockedMap] = useState<Partial<Record<AchievementId, number>>>(readUnlockedMap);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedMap));
    } catch {
      // ignore storage errors
    }
  }, [unlockedMap]);

  const progressValues = useMemo(() => {
    const tradesAttempted = totalTrades + positions.length + pendingOrdersCount;
    const hasPerfectQuiz = Object.values(progress).some(
      (p) => p.totalQuestions > 0 && p.bestScore >= p.totalQuestions
    );
    const bestQuizPct = Object.values(progress).reduce((best, p) => {
      if (!p.totalQuestions) return best;
      return Math.max(best, Math.round((p.bestScore / p.totalQuestions) * 100));
    }, 0);
    const bestStreak = Math.max(streakDays, longestStreak);
    const hasRiskProtection =
      positions.some((p) => p.stopLoss !== undefined || p.takeProfit !== undefined) ||
      tradeLogs.some((l) => l.closeReason === 'stop-loss' || l.closeReason === 'take-profit') ||
      completedMissionIds.includes('risk-guard');

    return {
      'first-trade': {
        met: tradesAttempted >= 1,
        current: Math.min(1, tradesAttempted),
        target: 1,
      },
      'perfect-quiz': {
        met: hasPerfectQuiz,
        current: hasPerfectQuiz ? 100 : bestQuizPct,
        target: 100,
      },
      'streak-7': {
        met: bestStreak >= 7,
        current: Math.min(7, bestStreak),
        target: 7,
      },
      'risk-protector': {
        met: hasRiskProtection,
        current: hasRiskProtection ? 1 : 0,
        target: 1,
      },
      'playbook-collector': {
        met: savedStrategiesCount >= 2,
        current: Math.min(2, savedStrategiesCount),
        target: 2,
      },
      'course-graduate': {
        met: totalLessons > 0 && completedLessons >= totalLessons,
        current: Math.min(totalLessons, completedLessons),
        target: totalLessons,
      },
    } as Record<AchievementId, {met: boolean; current: number; target: number}>;
  }, [
    totalTrades,
    positions,
    pendingOrdersCount,
    tradeLogs,
    progress,
    streakDays,
    longestStreak,
    savedStrategiesCount,
    completedMissionIds,
    completedLessons,
    totalLessons,
  ]);

  useEffect(() => {
    const newlyUnlocked: AchievementId[] = [];
    setUnlockedMap((prev) => {
      let next: Partial<Record<AchievementId, number>> | null = null;
      const now = Date.now();
      for (const id of ALL_ACHIEVEMENT_IDS) {
        if (progressValues[id].met && !prev[id]) {
          if (!next) next = {...prev};
          next[id] = now;
          newlyUnlocked.push(id);
        }
      }
      return next ?? prev;
    });

    if (hydratedRef.current && newlyUnlocked.length > 0) {
      for (const id of newlyUnlocked) {
        onUnlockRef.current?.(id);
      }
    }
    hydratedRef.current = true;
  }, [progressValues]);

  const achievements: AchievementStatus[] = useMemo(
    () =>
      ALL_ACHIEVEMENT_IDS.map((id) => {
        const unlockedAt = unlockedMap[id];
        const unlocked = Boolean(unlockedAt || progressValues[id].met);
        return {
          id,
          unlocked,
          unlockedAt,
          current: unlocked ? progressValues[id].target : progressValues[id].current,
          target: progressValues[id].target,
        };
      }),
    [unlockedMap, progressValues]
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const resetAchievements = useCallback(() => {
    setUnlockedMap({});
  }, []);

  return {
    achievements,
    unlockedCount,
    totalCount: ALL_ACHIEVEMENT_IDS.length,
    resetAchievements,
  };
}
```

### `src/hooks/useDailyMissions.ts`

```ts
import {useCallback, useEffect, useState} from 'react';
import type {DailyMissionId, DailyMissionsState} from '../types/trading';

const MISSIONS_KEY = 'meridian_daily_missions_v1';
export const DAILY_ALL_CLEAR_BONUS_XP = 50;

export const MISSION_XP_REWARDS: Record<DailyMissionId, number> = {
  'long-trade': 50,
  'risk-guard': 40,
  'strategy-guide': 30,
  'academy-quiz': 40,
};

function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readInitialMissions(): DailyMissionsState {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) {
      return {
        dateKey: today,
        totalXp: 0,
        completedIds: [],
        bonusClaimedDate: null,
      };
    }
    const parsed = JSON.parse(raw) as Partial<DailyMissionsState>;
    const totalXp = typeof parsed.totalXp === 'number' && Number.isFinite(parsed.totalXp) ? parsed.totalXp : 0;
    const isSameDay = parsed.dateKey === today;
    const completedIds =
      isSameDay && Array.isArray(parsed.completedIds)
        ? (parsed.completedIds.filter(
            (id): id is DailyMissionId =>
              id === 'long-trade' ||
              id === 'risk-guard' ||
              id === 'strategy-guide' ||
              id === 'academy-quiz'
          ) as DailyMissionId[])
        : [];
    return {
      dateKey: today,
      totalXp,
      completedIds,
      bonusClaimedDate: parsed.bonusClaimedDate === today ? today : null,
    };
  } catch {
    return {
      dateKey: today,
      totalXp: 0,
      completedIds: [],
      bonusClaimedDate: null,
    };
  }
}

export function useDailyMissions(
  onRecordStreakActivity: () => void,
  onMissionEarned?: (missionId: DailyMissionId, xpEarned: number, bonusEarned: boolean) => void
) {
  const [state, setState] = useState<DailyMissionsState>(readInitialMissions);

  useEffect(() => {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(state));
  }, [state]);

  const completeMission = useCallback(
    (missionId: DailyMissionId) => {
      const today = getTodayKey();
      let xpEarned = 0;
      let bonusEarned = false;

      setState((prev) => {
        const currentCompleted = prev.dateKey === today ? prev.completedIds : [];
        if (currentCompleted.includes(missionId)) {
          return prev.dateKey === today
            ? prev
            : {
                dateKey: today,
                totalXp: prev.totalXp,
                completedIds: currentCompleted,
                bonusClaimedDate: null,
              };
        }

        const nextCompleted = [...currentCompleted, missionId];
        xpEarned = MISSION_XP_REWARDS[missionId];
        const allFourDone = nextCompleted.length === 4;
        const shouldAwardBonus = allFourDone && prev.bonusClaimedDate !== today;
        bonusEarned = shouldAwardBonus;
        const bonusXp = shouldAwardBonus ? DAILY_ALL_CLEAR_BONUS_XP : 0;

        return {
          dateKey: today,
          totalXp: prev.totalXp + xpEarned + bonusXp,
          completedIds: nextCompleted,
          bonusClaimedDate: shouldAwardBonus ? today : prev.dateKey === today ? prev.bonusClaimedDate : null,
        };
      });

      if (xpEarned > 0) {
        onRecordStreakActivity();
        onMissionEarned?.(missionId, xpEarned + (bonusEarned ? DAILY_ALL_CLEAR_BONUS_XP : 0), bonusEarned);
      }
    },
    [onRecordStreakActivity, onMissionEarned]
  );

  const resetMissions = useCallback(() => {
    setState({
      dateKey: getTodayKey(),
      totalXp: 0,
      completedIds: [],
      bonusClaimedDate: null,
    });
  }, []);

  const today = getTodayKey();
  const completedIds = state.dateKey === today ? state.completedIds : [];
  const bonusClaimedToday = state.bonusClaimedDate === today;
  const level = Math.floor(state.totalXp / 150) + 1;
  const levelFloor = (level - 1) * 150;
  const levelProgressPct = Math.round(((state.totalXp - levelFloor) / 150) * 100);

  return {
    totalXp: state.totalXp,
    level,
    levelProgressPct,
    completedIds,
    bonusClaimedToday,
    completeMission,
    resetMissions,
  };
}
```

### `src/hooks/useLeaderboard.ts`

```ts
import {useCallback, useEffect, useMemo, useState} from 'react';
import type {LeaderboardEntry} from '../types/trading';

const LEARNER_NAME_KEY = 'meridian_learner_name_v1';

interface BenchmarkLearner {
  id: string;
  name: string;
  lessonXp: number;
  missionXp: number;
}

const COHORT_PEERS: BenchmarkLearner[] = [
  {id: 'peer-amira', name: 'Amira K.', lessonXp: 555, missionXp: 680},
  {id: 'peer-lucas', name: 'Lucas M.', lessonXp: 480, missionXp: 520},
  {id: 'peer-sofia', name: 'Sofia R.', lessonXp: 385, missionXp: 410},
  {id: 'peer-noah', name: 'Noah T.', lessonXp: 290, missionXp: 310},
  {id: 'peer-lina', name: 'Lina B.', lessonXp: 205, missionXp: 190},
  {id: 'peer-mateo', name: 'Mateo V.', lessonXp: 145, missionXp: 140},
  {id: 'peer-hana', name: 'Hana S.', lessonXp: 60, missionXp: 70},
];

function readLearnerName(): string {
  try {
    const saved = localStorage.getItem(LEARNER_NAME_KEY);
    return saved && saved.trim() ? saved.trim().slice(0, 24) : '';
  } catch {
    return '';
  }
}

export function useLeaderboard(
  lessonXp: number,
  missionXp: number,
  fallbackSelfLabel: string
) {
  const [customName, setCustomName] = useState<string>(readLearnerName);

  useEffect(() => {
    try {
      if (customName) {
        localStorage.setItem(LEARNER_NAME_KEY, customName);
      } else {
        localStorage.removeItem(LEARNER_NAME_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [customName]);

  const updateDisplayName = useCallback((nextName: string) => {
    setCustomName(nextName.trim().slice(0, 24));
  }, []);

  const userTotalXp = lessonXp + missionXp;
  const userLevel = Math.floor(userTotalXp / 150) + 1;
  const resolvedSelfName = customName || fallbackSelfLabel;

  const entries = useMemo<LeaderboardEntry[]>(() => {
    const raw: Array<Omit<LeaderboardEntry, 'rank'>> = [
      ...COHORT_PEERS.map((peer) => {
        const total = peer.lessonXp + peer.missionXp;
        return {
          id: peer.id,
          name: peer.name,
          lessonXp: peer.lessonXp,
          missionXp: peer.missionXp,
          totalXp: total,
          level: Math.floor(total / 150) + 1,
          isCurrentUser: false,
        };
      }),
      {
        id: 'current-user',
        name: resolvedSelfName,
        lessonXp,
        missionXp,
        totalXp: userTotalXp,
        level: userLevel,
        isCurrentUser: true,
      },
    ];

    raw.sort((a, b) => {
      if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
      if (a.isCurrentUser && !b.isCurrentUser) return -1;
      if (!a.isCurrentUser && b.isCurrentUser) return 1;
      return a.name.localeCompare(b.name);
    });

    return raw.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [lessonXp, missionXp, userTotalXp, userLevel, resolvedSelfName]);

  const userEntry = entries.find((e) => e.isCurrentUser) ?? entries[entries.length - 1];
  const aboveEntry = userEntry.rank > 1 ? entries[userEntry.rank - 2] : null;
  const xpToNextRank = aboveEntry ? Math.max(1, aboveEntry.totalXp - userEntry.totalXp + 1) : 0;

  return {
    entries,
    userEntry,
    aboveEntry,
    xpToNextRank,
    customName,
    updateDisplayName,
  };
}
```

### `src/hooks/useLessonProgress.ts`

```ts
import {useCallback, useEffect, useState} from 'react';
import {LESSONS} from '../data/curriculum';
import type {LearningStreak, LessonProgress} from '../types/trading';

const PROGRESS_KEY = 'meridian_lesson_progress_v1';
const STREAK_KEY = 'meridian_learning_streak_v1';

function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getShiftedDateKey(daysDelta: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysDelta);
  return getLocalDateKey(date);
}

const EMPTY_STREAK: LearningStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  activeDays: [],
};

function readInitialStreak(): LearningStreak {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return EMPTY_STREAK;
    const parsed = JSON.parse(raw) as Partial<LearningStreak>;
    const today = getLocalDateKey();
    const yesterday = getShiftedDateKey(-1);
    const lastActiveDate = typeof parsed.lastActiveDate === 'string' ? parsed.lastActiveDate : null;
    const isAlive = lastActiveDate === today || lastActiveDate === yesterday;
    const currentStreak = isAlive && typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0;
    const longestStreak = typeof parsed.longestStreak === 'number' ? parsed.longestStreak : currentStreak;
    const activeDays = Array.isArray(parsed.activeDays)
      ? parsed.activeDays.filter((d): d is string => typeof d === 'string').slice(-14)
      : [];
    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastActiveDate,
      activeDays,
    };
  } catch {
    return EMPTY_STREAK;
  }
}

export function useLessonProgress() {
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, LessonProgress>) : {};
    } catch {
      return {};
    }
  });

  const [streakState, setStreakState] = useState<LearningStreak>(readInitialStreak);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakState));
  }, [streakState]);

  const recordDailyActivity = useCallback(() => {
    const today = getLocalDateKey();
    const yesterday = getShiftedDateKey(-1);
    setStreakState((prev) => {
      if (prev.lastActiveDate === today && prev.activeDays.includes(today)) {
        return prev;
      }
      const nextCurrent = prev.lastActiveDate === yesterday ? prev.currentStreak + 1 : 1;
      const nextLongest = Math.max(prev.longestStreak, nextCurrent);
      const nextDays = Array.from(new Set([...prev.activeDays, today])).slice(-14);
      return {
        currentStreak: nextCurrent,
        longestStreak: nextLongest,
        lastActiveDate: today,
        activeDays: nextDays,
      };
    });
  }, []);

  const recordQuizAttempt = useCallback(
    (lessonId: string, score: number, totalQuestions: number) => {
      setProgress((prev) => {
        const existing = prev[lessonId];
        const bestScore = Math.max(existing?.bestScore ?? 0, score);
        const passed = score >= Math.ceil(totalQuestions * 0.75);
        return {
          ...prev,
          [lessonId]: {
            completed: Boolean(existing?.completed || passed),
            bestScore,
            totalQuestions,
            lastAttemptAt: Date.now(),
          },
        };
      });
      recordDailyActivity();
    },
    [recordDailyActivity]
  );

  const markLessonCompleted = useCallback(
    (lessonId: string, totalQuestions: number) => {
      setProgress((prev) => {
        const existing = prev[lessonId];
        return {
          ...prev,
          [lessonId]: {
            completed: true,
            bestScore: existing?.bestScore ?? 0,
            totalQuestions,
            lastAttemptAt: existing?.lastAttemptAt ?? Date.now(),
          },
        };
      });
      recordDailyActivity();
    },
    [recordDailyActivity]
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    setStreakState(EMPTY_STREAK);
  }, []);

  const today = getLocalDateKey();
  const yesterday = getShiftedDateKey(-1);
  const effectiveCurrent =
    streakState.lastActiveDate === today || streakState.lastActiveDate === yesterday
      ? streakState.currentStreak
      : 0;

  const streak = {
    currentStreak: effectiveCurrent,
    longestStreak: streakState.longestStreak,
    lastActiveDate: streakState.lastActiveDate,
    activeDays: streakState.activeDays,
    activeToday: streakState.lastActiveDate === today,
  };

  const isLessonUnlocked = useCallback(
    (lessonId: string): boolean => {
      const idx = LESSONS.findIndex((l) => l.id === lessonId);
      if (idx <= 0) return true;
      const prevLesson = LESSONS[idx - 1];
      return Boolean(progress[prevLesson.id]?.completed || progress[lessonId]?.completed);
    },
    [progress]
  );

  const completedCount = LESSONS.filter((l) => progress[l.id]?.completed).length;
  const totalLessons = LESSONS.length;
  const perfectQuizCount = LESSONS.filter((l) => {
    const p = progress[l.id];
    return Boolean(p && p.totalQuestions > 0 && p.bestScore >= p.totalQuestions);
  }).length;
  const lessonXp = completedCount * 60 + perfectQuizCount * 25;
  const unlockedCount = LESSONS.filter((l) => isLessonUnlocked(l.id)).length;
  const currentUnlockedLessonId =
    LESSONS.find((l) => isLessonUnlocked(l.id) && !progress[l.id]?.completed)?.id ??
    LESSONS[LESSONS.length - 1].id;

  return {
    progress,
    completedCount,
    totalLessons,
    perfectQuizCount,
    lessonXp,
    unlockedCount,
    currentUnlockedLessonId,
    isLessonUnlocked,
    streak,
    recordDailyActivity,
    recordQuizAttempt,
    markLessonCompleted,
    resetProgress,
  };
}
```

### `src/hooks/useMarketStream.ts`

```ts
import {useEffect, useState} from 'react';
import type {MarketQuote} from '../types/trading';

export type StreamStatus = 'connecting' | 'live' | 'reconnecting';

export function useMarketStream() {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  useEffect(() => {
    let active = true;
    let eventSource: EventSource | null = null;
    let pollTimer: number | null = null;

    const applyQuotes = (list: MarketQuote[]) => {
      if (!active || !Array.isArray(list)) return;
      const map: Record<string, MarketQuote> = {};
      for (const q of list) {
        map[q.symbol] = q;
      }
      setQuotes(map);
      setLastUpdated(Date.now());
      setStatus('live');
    };

    const fetchOnce = async () => {
      try {
        const res = await fetch('/api/market/quotes');
        if (res.ok) {
          const data = (await res.json()) as {quotes: MarketQuote[]};
          applyQuotes(data.quotes);
        }
      } catch {
        if (active) setStatus('reconnecting');
      }
    };

    void fetchOnce();

    try {
      eventSource = new EventSource('/api/market/stream');
      eventSource.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data) as MarketQuote[];
          applyQuotes(parsed);
        } catch {
          // ignore malformed tick
        }
      };
      eventSource.onerror = () => {
        if (!active) return;
        setStatus('reconnecting');
        if (!pollTimer) {
          pollTimer = window.setInterval(() => {
            void fetchOnce();
          }, 3000);
        }
      };
    } catch {
      pollTimer = window.setInterval(() => {
        void fetchOnce();
      }, 2000);
    }

    return () => {
      active = false;
      eventSource?.close();
      if (pollTimer) window.clearInterval(pollTimer);
    };
  }, []);

  return {quotes, status, lastUpdated};
}
```

### `src/hooks/useNotifications.ts`

```ts
import {useCallback, useEffect, useState} from 'react';
import {formatPrice} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppNotification, MarketQuote, NotificationPrefs, PriceAlert} from '../types/trading';

const ALERTS_KEY = 'meridian_price_alerts_v1';
const NOTIFS_KEY = 'meridian_notifications_v1';
const PREFS_KEY = 'meridian_notif_prefs_v1';

const DEFAULT_PREFS: NotificationPrefs = {
  pushEnabled: true,
  marketAlerts: true,
  orderFills: true,
  stopTakeTriggers: true,
  equityMilestones: true,
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useNotifications(quotes: Record<string, MarketQuote>) {
  const {t} = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => loadJson(ALERTS_KEY, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadJson(NOTIFS_KEY, []));
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => loadJson(PREFS_KEY, DEFAULT_PREFS));
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications.slice(0, 60)));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const dispatchBrowserPush = useCallback(
    async (title: string, body: string, tag?: string) => {
      if (!prefs.pushEnabled) return;
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: tag || `meridian-${Date.now()}`,
            });
            return;
          }
        }
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          tag: tag || `meridian-${Date.now()}`,
        });
      } catch {
        // Fallback silently to in-app toast when running inside restricted sandboxes
      }
    },
    [prefs.pushEnabled]
  );

  const pushNotification = useCallback(
    (payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      if (payload.category === 'market-alert' && !prefs.marketAlerts) return;
      if (payload.category === 'portfolio-update' && !prefs.orderFills && !prefs.stopTakeTriggers) return;

      const entry: AppNotification = {
        ...payload,
        id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [entry, ...prev].slice(0, 60));
      setToasts((prev) => [entry, ...prev].slice(0, 3));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== entry.id));
      }, 5500);

      void dispatchBrowserPush(entry.title, entry.body, entry.id);
    },
    [dispatchBrowserPush, prefs.marketAlerts, prefs.orderFills, prefs.stopTakeTriggers]
  );

  const requestPushPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported' as const;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        void dispatchBrowserPush(t.notifications.alertsActiveTitle, t.notifications.alertsActiveBody);
      }
      return result;
    } catch {
      return permission;
    }
  }, [dispatchBrowserPush, permission, t]);

  const sendTestPush = useCallback(() => {
    pushNotification({
      category: 'market-alert',
      title: t.notifications.testTitle,
      body: t.notifications.testBody,
    });
  }, [pushNotification, t]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const now = Date.now();
    let changed = false;

    const updatedAlerts = alerts.map((alert) => {
      if (!alert.active) return alert;
      const quote = quotes[alert.symbol];
      if (!quote) return alert;

      if (alert.lastTriggeredAt && now - alert.lastTriggeredAt < 60_000) {
        return alert;
      }

      const hit =
        (alert.condition === 'above' && quote.price >= alert.targetPrice) ||
        (alert.condition === 'below' && quote.price <= alert.targetPrice);

      if (!hit) return alert;

      changed = true;
      const directionLabel =
        alert.condition === 'above' ? t.notifications.crossedAbove : t.notifications.droppedBelow;
      pushNotification({
        category: 'market-alert',
        symbol: alert.symbol,
        title: `${alert.symbol} ${t.notifications.priceAlertTitle}`,
        body: `${alert.symbol} ${directionLabel} ${formatPrice(alert.targetPrice, alert.symbol)} (${t.notifications.now}: ${formatPrice(quote.price, alert.symbol)})${alert.note ? ` — ${alert.note}` : ''}`,
      });

      return {
        ...alert,
        active: alert.recurring ? true : false,
        lastTriggeredAt: now,
      };
    });

    if (changed) {
      setAlerts(updatedAlerts);
    }
  }, [alerts, quotes, pushNotification, t]);

  const createAlert = useCallback(
    (input: {symbol: string; condition: 'above' | 'below'; targetPrice: number; note?: string; recurring?: boolean}) => {
      const next: PriceAlert = {
        id: `alt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        symbol: input.symbol,
        condition: input.condition,
        targetPrice: input.targetPrice,
        note: input.note?.trim() || undefined,
        active: true,
        recurring: Boolean(input.recurring),
        createdAt: Date.now(),
      };
      setAlerts((prev) => [next, ...prev]);
      return next;
    },
    []
  );

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? {...a, active: !a.active} : a)));
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({...n, read: true})));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    alerts,
    notifications,
    unreadCount,
    toasts,
    prefs,
    setPrefs,
    permission,
    requestPushPermission,
    sendTestPush,
    pushNotification,
    createAlert,
    toggleAlert,
    deleteAlert,
    markAllRead,
    clearNotifications,
    dismissToast,
  };
}
```

### `src/hooks/useOnlineStatus.ts`

```ts
import {useEffect, useState} from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### `src/hooks/usePaperAccount.ts`

```ts
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
```

### `src/hooks/usePWAInstall.ts`

```ts
import {useEffect, useState} from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'; platform: string}>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as {standalone?: boolean}).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}
```

### `src/hooks/useTradingPlaybook.ts`

```ts
import {useCallback, useEffect, useState} from 'react';
import {TRADING_STRATEGIES} from '../data/strategies';
import type {StrategyId} from '../types/trading';

const PLAYBOOK_KEY = 'meridian_trading_playbook_v1';
const VALID_IDS = new Set<StrategyId>(TRADING_STRATEGIES.map((s) => s.id));

function readSavedStrategies(): StrategyId[] {
  try {
    const raw = localStorage.getItem(PLAYBOOK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is StrategyId => VALID_IDS.has(id as StrategyId));
  } catch {
    return [];
  }
}

export function useTradingPlaybook() {
  const [savedIds, setSavedIds] = useState<StrategyId[]>(readSavedStrategies);

  useEffect(() => {
    localStorage.setItem(PLAYBOOK_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleBookmark = useCallback((id: StrategyId) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
    );
  }, []);

  const removeBookmark = useCallback((id: StrategyId) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const isSaved = useCallback((id: StrategyId) => savedIds.includes(id), [savedIds]);

  return {
    savedIds,
    isSaved,
    toggleBookmark,
    removeBookmark,
  };
}
```

### `src/i18n/curriculumTranslations.ts`

```ts
import type {Lesson} from '../types/trading';
import type {Language} from './types';

export type LessonOverlay = Pick<Lesson, 'moduleTitle' | 'title' | 'summary' | 'sections'> & {
  quiz: Array<{
    id: string;
    question: string;
    options: string[];
    explanation: string;
  }>;
};

export const INSTRUMENT_NOTES_I18N: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  fr: {
    'BTC/USD': 'La plus grande cryptomonnaie. Très liquide, négociée 24h/24 et 7j/7.',
    'ETH/USD': 'Principal réseau de contrats intelligents. Suit souvent le Bitcoin avec des variations plus amples.',
    'SOL/USD': 'Blockchain rapide connue pour sa forte volatilité quotidienne — gardez des tailles modestes.',
    'XRP/USD': 'Jeton de paiements transfrontaliers avec un prix unitaire bas et des seuils ronds nets.',
    'ADA/USD': 'Actif blockchain adapté pour s’entraîner aux mouvements intermédiaires.',
    'AVAX/USD': 'Plateforme réactive lors des grandes tendances du marché crypto.',
    'EUR/USD': 'La paire de devises la plus échangée au monde. Spreads très faibles et mouvements fluides.',
    'GBP/USD': 'Surnommée « Cable ». Plus active pendant l’ouverture conjointe de Londres et New York.',
    'USD/JPY': 'Attention : 1 pip correspond à 0,01 (2e décimale) au lieu de 0,0001.',
    'AUD/USD': 'Paire liée aux matières premières, idéale pour pratiquer le suivi de tendance.',
    'USD/CHF': 'Paire européenne refuge qui évolue souvent à l’inverse de l’EUR/USD.',
    'EUR/GBP': 'Paire européenne stable avec des amplitudes journalières modérées pour débuter sereinement.',
  },
  es: {
    'BTC/USD': 'La mayor criptomoneda por capitalización. Alta liquidez, opera 24/7.',
    'ETH/USD': 'Red líder de contratos inteligentes. Suele moverse junto a Bitcoin con mayor variación porcentual.',
    'SOL/USD': 'Blockchain rápida conocida por su fuerte volatilidad diaria — usa montos pequeños.',
    'XRP/USD': 'Token de pagos internacionales con precio unitario bajo y niveles redondos claros.',
    'ADA/USD': 'Activo blockchain útil para practicar operaciones de varios días.',
    'AVAX/USD': 'Plataforma que reacciona con fuerza en los giros del mercado cripto.',
    'EUR/USD': 'El par de divisas más operado del mundo. Spreads mínimos y movimientos ordenados.',
    'GBP/USD': 'Conocido como «Cable». Más activo durante el cruce de Londres y Nueva York.',
    'USD/JPY': 'Nota: 1 pip equivale a 0.01 (2.º decimal) en lugar de 0.0001.',
    'AUD/USD': 'Par ligado a materias primas, muy usado para aprender a seguir tendencias.',
    'USD/CHF': 'Par refugio europeo que a menudo se mueve en dirección opuesta al EUR/USD.',
    'EUR/GBP': 'Par cruzado europeo estable con rangos diarios moderados para practicar con calma.',
  },
  ar: {
    'BTC/USD': 'أكبر عملة رقمية من حيث القيمة السوقية. سيولة عالية وتداول متواصل ٢٤/٧.',
    'ETH/USD': 'شبكة العقود الذكية الرائدة. غالباً ما تتحرك مع البيتكوين بتقلبات نسبية أكبر.',
    'SOL/USD': 'شبكة سريعة معروفة بتقلباتها اليومية القوية — يُنصح بأحجام صفقات أصغر.',
    'XRP/USD': 'عملة مدفوعات دولية بسعر منخفض للوحدة ومستويات دعم واضحة.',
    'ADA/USD': 'أصل رقمي مناسب للتدرّب على التداول المتوسط المدى.',
    'AVAX/USD': 'منصة تتفاعل بقوة مع تحركات الزخم العامة في سوق العملات الرقمية.',
    'EUR/USD': 'أكثر زوج عملات تداولاً في العالم. أقل سبريد وحركات سعرية منظمة للمبتدئين.',
    'GBP/USD': 'يُعرف باسم «الكيبل». يزداد نشاطه خلال تداخل جلستي لندن ونيويورك.',
    'USD/JPY': 'ملاحظة: النقطة الواحدة (Pip) هي 0.01 (الخانة العشرية الثانية) بدلاً من 0.0001.',
    'AUD/USD': 'زوج مرتبط بالسلع يُستخدم كثيراً لتعلّم متابعة الاتجاهات.',
    'USD/CHF': 'زوج أوروبي ملاذ آمن يتحرك غالباً عكس اتجاه EUR/USD.',
    'EUR/GBP': 'زوج أوروبي هادئ بنطاق حركة يومي معتدل ومناسب للتمرين الهادئ.',
  },
};

export const CURRICULUM_I18N: Record<Exclude<Language, 'en'>, Record<string, LessonOverlay>> = {
  fr: {
    'lesson-1': {
      moduleTitle: 'Module 1 : Bases du Trading',
      title: 'Achat, vente et fonctionnement du Spread',
      summary: 'Comprenez les prix Bid et Ask, pourquoi un trade démarre légèrement négatif et comment choisir un marché liquide.',
      sections: [
        {
          heading: 'Deux prix à l’écran : Bid et Ask',
          body: 'Sur Bitcoin comme sur l’EUR/USD, deux prix existent en même temps : le Bid (prix auquel vous pouvez vendre immédiatement) et l’Ask (prix auquel vous achetez immédiatement). L’Ask est toujours légèrement supérieur au Bid.',
          keyTakeaway: 'Vous achetez au prix Ask et vous vendez au prix Bid.',
        },
        {
          heading: 'Qu’est-ce que le Spread ?',
          body: 'L’écart entre l’Ask et le Bid s’appelle le Spread. C’est comme un bureau de change : il reprend vos devises un peu moins cher qu’il ne les vend. Les marchés populaires comme BTC/USD et EUR/USD ont des spreads minuscules, ce qui réduit vos coûts.',
          keyTakeaway: 'Un petit spread réduit vos frais d’entrée et accélère l’atteinte du seuil de rentabilité.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'Si EUR/USD affiche un Bid à 1,0580 et un Ask à 1,0582, à quel prix achetez-vous tout de suite ?',
          options: ['1,0580 (le Bid)', '1,0582 (l’Ask)', '1,0581 (le milieu)', 'Le prix d’hier'],
          explanation: 'Lorsque vous achetez immédiatement, vous payez le prix vendeur (Ask) à 1,0582.',
        },
        {
          id: 'l1-q2',
          question: 'Pourquoi un trade tout juste ouvert affiche-t-il souvent un léger montant négatif ?',
          options: [
            'Une erreur de calcul du serveur',
            'À cause du spread entre l’Ask d’achat et le Bid de revente',
            'Les prix chutent toujours après un achat',
            'Vous perdez automatiquement 10 % à l’ouverture',
          ],
          explanation: 'Vous achetez à l’Ask et votre valeur de sortie actuelle est mesurée au Bid ; le spread est ce petit écart initial.',
        },
        {
          id: 'l1-q3',
          question: 'Quel marché offre généralement le spread le plus faible pour débuter ?',
          options: [
            'Les paires très actives comme EUR/USD ou BTC/USD',
            'Les jetons rares très peu échangés',
            'Les marchés fermés un jour férié',
            'Tous les actifs ont exactement le même spread',
          ],
          explanation: 'Une forte liquidité rapproche acheteurs et vendeurs et réduit le spread.',
        },
        {
          id: 'l1-q4',
          question: 'Si vous pensez qu’un prix va BAISSER et voulez en profiter, que faites-vous ?',
          options: ['Acheter (Long)', 'Vendre (Short)', 'Attendre un spread plus large', 'Fermer le compte'],
          explanation: 'Vendre (Short) permet de gagner lorsque le prix baisse par rapport à votre entrée.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'Module 1 : Bases du Trading',
      title: 'Ordres Market, Limit, Stop-Loss & Take-Profit',
      summary: 'Maîtrisez les quatre types d’ordres essentiels pour ne jamais entrer au hasard ni oublier votre protection.',
      sections: [
        {
          heading: 'Ordre au Marché (Market) vs Ordre Limite',
          body: 'Un ordre Market exécute l’achat ou la vente immédiatement au meilleur prix disponible. Un ordre Limit vous permet de fixer votre prix : « Acheter du Bitcoin seulement s’il descend à 88 000 $ ». Vous contrôlez le prix, mais l’ordre ne se déclenche que si le marché l’atteint.',
          keyTakeaway: 'Utilisez Market pour entrer tout de suite ; utilisez Limit pour attendre un meilleur prix.',
        },
        {
          heading: 'Votre filet de sécurité : Stop-Loss & Take-Profit',
          body: 'Le Stop-Loss clôture automatiquement votre trade si le prix part dans le mauvais sens, empêchant une petite erreur de devenir une grosse perte. Le Take-Profit encaisse automatiquement vos gains dès que votre objectif est atteint.',
          keyTakeaway: 'N’ouvrez jamais un trade sans savoir où couper si vous avez tort (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'Le Bitcoin vaut 91 000 $ et vous voulez acheter uniquement s’il baisse à 89 500 $. Quel ordre placer ?',
          options: ['Ordre d’achat Market', 'Ordre d’achat Limite à 89 500 $', 'Stop-Loss', 'Ordre de vente Market'],
          explanation: 'Un achat Limite attend sous le prix actuel et s’exécute seulement si le cours atteint 89 500 $ ou moins.',
        },
        {
          id: 'l2-q2',
          question: 'Quel est le rôle principal d’un Stop-Loss ?',
          options: [
            'Garantir un gain sur chaque trade',
            'Clôturer automatiquement une position perdante au seuil fixé pour garder la perte petite',
            'Doubler automatiquement votre mise',
            'Mettre le graphique en pause',
          ],
          explanation: 'Le Stop-Loss agit comme une ceinture de sécurité qui plafonne votre perte maximale.',
        },
        {
          id: 'l2-q3',
          question: 'Vous achetez ETH à 3 000 $ avec un Take-Profit à 3 300 $. Que se passe-t-il si ETH atteint 3 300 $ en votre absence ?',
          options: [
            'Rien sans clic manuel',
            'Le trade se clôture automatiquement vers 3 300 $ et sécurise le gain',
            'Votre Stop-Loss est supprimé',
            'Le trade reste ouvert indéfiniment',
          ],
          explanation: 'Le Take-Profit exécute automatiquement la sortie dès que votre cible de gain est touchée.',
        },
        {
          id: 'l2-q4',
          question: 'Quand privilégier un ordre au Marché (Market) ?',
          options: [
            'Parce qu’il donne toujours un meilleur prix qu’un ordre Limite',
            'Quand la rapidité compte : il garantit l’exécution immédiate au prix Bid/Ask actuel',
            'Parce qu’il interdit le Stop-Loss',
            'Uniquement sur le Forex',
          ],
          explanation: 'L’ordre Market privilégie la vitesse d’exécution ; l’ordre Limite privilégie la précision du prix.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'Module 2 : Marchés Crypto',
      title: 'Essentiels Crypto : Volatilité 24/7 & Cycles',
      summary: 'Comprenez pourquoi la crypto ne ferme jamais, pourquoi les altcoins suivent le Bitcoin et comment gérer les fortes variations.',
      sections: [
        {
          heading: 'Ouvert en continu, mouvements plus rapides',
          body: 'Contrairement aux bourses traditionnelles, les cryptomonnaies s’échangent 24h/24 et 7j/7, week-ends inclus. Bitcoin ou Solana peuvent varier de 3 % à 8 % en une seule journée, contre souvent moins de 1 % sur les grandes paires Forex.',
          keyTakeaway: 'Comme la crypto bouge vite, les débutants doivent utiliser des montants plus modestes par trade.',
        },
        {
          heading: 'Le Bitcoin donne le rythme',
          body: 'Lorsque le Bitcoin fait un grand mouvement, les autres cryptos (ETH, SOL, ADA) suivent généralement la même direction, souvent avec des variations encore plus fortes. Regardez toujours BTC/USD avant d’acheter une autre crypto.',
          keyTakeaway: 'Observez d’abord la tendance du Bitcoin : il guide l’ensemble du marché crypto.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: 'À quelle heure ferme le marché des cryptomonnaies le week-end ?',
          options: ['Vendredi à 17h', 'Samedi à minuit', 'Jamais — il fonctionne 24h/24 et 7j/7', 'Les jours fériés bancaires'],
          explanation: 'Les réseaux crypto fonctionnent en continu toute l’année, jour et nuit.',
        },
        {
          id: 'l3-q2',
          question: 'Par rapport à EUR/USD, pourquoi réduire la taille de position sur SOL/USD ?',
          options: [
            'La crypto connaît des variations quotidiennes bien plus amples',
            'Solana ne se vend pas le mardi',
            'Les spreads crypto sont de 0 %',
            'Le Forex est plus cher par unité',
          ],
          explanation: 'Plus la volatilité est élevée, plus une petite taille suffit à générer gains ou pertes.',
        },
        {
          id: 'l3-q3',
          question: 'Pourquoi consulter BTC/USD avant d’acheter ADA/USD ?',
          options: [
            'Il faut posséder du BTC pour acheter ADA',
            'La direction du Bitcoin influence fortement tout le marché crypto',
            'Les altcoins ne bougent que si BTC est figé',
            'Bitcoin fixe les taux Forex',
          ],
          explanation: 'Le Bitcoin représente la plus grande part du marché et dicte le sentiment global.',
        },
        {
          id: 'l3-q4',
          question: 'Quelle est une bonne habitude crypto le week-end ?',
          options: [
            'Retirer tous les Stop-Loss',
            'Garder des Stop-Loss actifs car le volume réduit peut causer des pics soudains',
            'Passer au levier 20x',
            'Ignorer ses limites de risque',
          ],
          explanation: 'Une liquidité plus faible le week-end favorise des mèches brusques : les Stop-Loss vous protègent.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'Module 3 : Fondamentaux Forex',
      title: 'Paires de devises, Pips & Cotations Forex',
      summary: 'Décodez EUR/USD et USD/JPY simplement et calculez la valeur exacte d’un mouvement de 10 pips.',
      sections: [
        {
          heading: 'Toujours comparer deux monnaies',
          body: 'Sur le Forex, on échange toujours une devise contre une autre, comme EUR/USD. La première (EUR) est la devise de base ; la seconde (USD) est la devise de cotation. Si EUR/USD = 1,0600, 1 euro coûte 1,0600 dollar. Acheter signifie parier sur la hausse de l’euro face au dollar.',
          keyTakeaway: 'Acheter = la 1re devise monte face à la 2e. Vendre = la 1re devise baisse.',
        },
        {
          heading: 'Qu’est-ce qu’un Pip ?',
          body: 'Les devises bougent par fractions infimes, mesurées en « Pips ». Pour la plupart des paires comme EUR/USD, 1 pip correspond à la 4e décimale (0,0001). Pour les paires avec le yen japonais (USD/JPY), 1 pip correspond à la 2e décimale (0,01).',
          keyTakeaway: 'Si EUR/USD passe de 1,0600 à 1,0625, c’est une hausse de +25 pips.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'Dans la paire GBP/USD, quelle est la devise de base ?',
          options: ['USD (Dollar US)', 'GBP (Livre sterling)', 'EUR (Euro)', 'Les deux'],
          explanation: 'La première devise affichée dans une paire Forex est toujours la devise de base.',
        },
        {
          id: 'l4-q2',
          question: 'EUR/USD passe de 1,0550 à 1,0580. De combien de pips a-t-il monté ?',
          options: ['3 pips', '30 pips', '300 pips', '0,3 pip'],
          explanation: '0,0030 divisé par 0,0001 (1 pip) égale 30 pips.',
        },
        {
          id: 'l4-q3',
          question: 'Quelle paire mesure 1 pip à la 2e décimale (0,01) au lieu de la 4e ?',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'Les paires en yen japonais (JPY) cotent autour de 100–160, donc 1 pip vaut 0,01.',
        },
        {
          id: 'l4-q4',
          question: 'Si vous pensez que le dollar US va se RENFORCER face à l’euro, que faites-vous sur EUR/USD ?',
          options: ['Acheter EUR/USD', 'Vendre (Short) EUR/USD', 'Acheter BTC', 'Attendre 0 pip'],
          explanation: 'Si le dollar monte, EUR/USD baisse : vendre EUR/USD génère alors un gain.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'Module 4 : Lire les Graphiques',
      title: 'Lire les bougies japonaises & les tendances',
      summary: 'Décryptez chaque bougie verte ou rouge : Ouverture, Plus Haut, Plus Bas, Clôture et pression acheteurs/vendeurs.',
      sections: [
        {
          heading: 'Les 4 chiffres dans chaque bougie',
          body: 'Chaque bougie résume l’activité pendant une durée choisie (15 min, 1h...). Le rectangle plein (« corps ») relie l’Ouverture et la Clôture. Bougie verte = clôture plus haute que l’ouverture ; bougie rouge = clôture plus basse.',
          keyTakeaway: 'Corps vert = acheteurs gagnants sur la période. Corps rouge = vendeurs gagnants.',
        },
        {
          heading: 'Que révèlent les longues mèches ?',
          body: 'Les traits fins au-dessus et en dessous sont les mèches : elles montrent les extrêmes atteints. Une longue mèche basse signifie que le prix a chuté, puis que les acheteurs ont vigoureusement repoussé le prix vers le haut.',
          keyTakeaway: 'Les longues mèches indiquent souvent un rejet sur un niveau clé.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'Sur un graphique 15 minutes, que représente une bougie verte ?',
          options: [
            'Un seul échange passé',
            'Ouverture, clôture plus haute, plus haut et plus bas durant ces 15 minutes',
            'Un gain garanti',
            'Un outil réservé au Forex',
          ],
          explanation: 'Chaque bougie affiche les quatre prix (Ouverture, Haut, Bas, Clôture) de son intervalle.',
        },
        {
          id: 'l5-q2',
          question: 'Que signale généralement une très longue mèche sous une bougie ?',
          options: [
            'Un bug d’affichage',
            'Le prix a baissé puis les acheteurs sont intervenus fortement pour le remonter',
            'Un volume nul',
            'Une victoire totale des vendeurs',
          ],
          explanation: 'Une longue mèche inférieure montre un fort rejet haussier après un creux.',
        },
        {
          id: 'l5-q3',
          question: 'Dans une tendance haussière saine, que forment les bougies ?',
          options: [
            'Sommets et creux de plus en plus bas',
            'Sommets et creux de plus en plus hauts',
            'Une ligne horizontale immobile',
            'Des sauts aléatoires',
          ],
          explanation: 'Une tendance haussière monte en escalier avec des sommets et creux ascendants.',
        },
        {
          id: 'l5-q4',
          question: 'Quelle unité de temps offre une vue plus calme et lisible aux débutants ?',
          options: ['1 minute', '1 heure (1H) ou 4 heures (4H)', '5 secondes', 'Carnet tick par tick'],
          explanation: 'Les unités 1H et 4H filtrent le bruit court terme et montrent des tendances plus nettes.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'Module 4 : Lire les Graphiques',
      title: 'Indicateurs simples : Moyennes Mobiles, Bollinger & RSI',
      summary: 'Activez les indicateurs utiles : repérez la tendance avec la SMA/EMA et évitez d’acheter au sommet avec le RSI.',
      sections: [
        {
          heading: 'Moyennes Mobiles (SMA 20 & EMA 50)',
          body: 'Une moyenne mobile trace la moyenne lissée des 20 ou 50 dernières bougies. Lorsque le prix reste au-dessus d’une moyenne qui monte, la tendance est haussière. Les débutants s’en servent pour éviter d’acheter contre la tendance.',
          keyTakeaway: 'Prix au-dessus d’une SMA/EMA montante = biais haussier.',
        },
        {
          heading: 'Bandes de Bollinger & RSI',
          body: 'Les bandes de Bollinger forment un canal qui s’élargit avec la volatilité. Le RSI (0 à 100) mesure la vitesse du mouvement : au-dessus de 70, la hausse est peut-être surchauffée ; sous 30, la baisse est peut-être excessive.',
          keyTakeaway: 'Les indicateurs confirment le prix — n’achetez jamais les yeux fermés sur un seul chiffre RSI.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'Si le prix évolue régulièrement AU-DESSUS d’une SMA 20 montante, quelle est la lecture la plus simple ?',
          options: ['Le marché est en tendance haussière', 'Le marché est figé', 'Il faut vendre immédiatement', 'Le volume est négatif'],
          explanation: 'Un cours qui se maintient au-dessus d’une moyenne mobile ascendante indique une dynamique haussière.',
        },
        {
          id: 'l6-q2',
          question: 'Que suggère traditionnellement un RSI supérieur à 70 ?',
          options: [
            'Une hausse très rapide pouvant être surachetée / proche d’une pause',
            'L’actif ne vaut rien',
            'Utiliser un levier 20x',
            'Le spread a doublé',
          ],
          explanation: 'Un RSI > 70 reflète une forte poussée haussière parfois étirée à court terme.',
        },
        {
          id: 'l6-q3',
          question: 'Pourquoi les bandes de Bollinger s’écartent-elles et se resserrent-elles ?',
          options: [
            'Elles s’adaptent aux variations de volatilité',
            'Elles changent au hasard à minuit',
            'Elles mesurent la taille du pip',
            'Elles affichent votre solde',
          ],
          explanation: 'Les bandes s’élargissent quand la volatilité augmente et se resserrent en phase calme.',
        },
        {
          id: 'l6-q4',
          question: 'Quelle est la meilleure façon d’utiliser RSI et moyennes mobiles ?',
          options: [
            'Ajouter 15 indicateurs sur le graphique',
            'Combiner 1 outil de tendance + 1 de momentum avec un Stop-Loss clair',
            'Supprimer le Stop-Loss quand RSI < 30',
            'Trader uniquement selon la couleur',
          ],
          explanation: 'La simplicité gagne : un indicateur de tendance, un oscillateur et une règle de risque stricte.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'Module 5 : Risque & Discipline',
      title: 'Règle des 1–2 %, Ratio Risque/Gain & Taille de position',
      summary: 'Découvrez la formule n°1 qui protège votre compte — même si la moitié de vos trades sont perdants.',
      sections: [
        {
          heading: 'Ne jamais tout miser sur une seule idée',
          body: 'Même les meilleurs traders perdent 40 à 50 % de leurs trades. Leur secret : ils ne risquent que 1 % à 2 % du compte total si leur Stop-Loss est touché. Sur 100 000 $, risquer 1 % signifie 1 000 $ de perte max : il faudrait 100 pertes d’affilée pour vider le compte.',
          keyTakeaway: 'Risquez 1 % ou moins par trade en débutant. Protéger le capital passe avant tout.',
        },
        {
          heading: 'Ratio Risque / Récompense (1:2 ou mieux)',
          body: 'Avant d’entrer, comparez votre perte possible au Stop-Loss face au gain visé au Take-Profit. Risquer 500 $ pour viser 1 000 $ donne un ratio de 1:2. Avec un ratio 1:2, gagner seulement 34 % de vos trades suffit à être à l’équilibre !',
          keyTakeaway: 'Visez des opportunités où le gain potentiel vaut au moins 2× le risque.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'Sur un compte de 100 000 $ avec la règle de 1 %, quelle perte maximale autoriser sur un trade ?',
          options: ['10 000 $', '1 000 $', '50 000 $', '100 $'],
          explanation: '1 % de 100 000 $ correspond exactement à 1 000 $ de perte maximale planifiée.',
        },
        {
          id: 'l7-q2',
          question: 'Chaque gain rapporte +600 $ et chaque perte coûte -300 $ (ratio 1:2). Si vous gagnez 50 % de 10 trades, quel est le bilan ?',
          options: ['0 $', '+1 500 $ de profit', '-1 500 $ de perte', '+3 000 $ de profit'],
          explanation: '5 gains × 600 $ = +3 000 $ ; 5 pertes × -300 $ = -1 500 $ ; Net = +1 500 $.',
        },
        {
          id: 'l7-q3',
          question: 'Quel est le danger caché d’un fort effet de levier (ex. 20x) pour un débutant ?',
          options: [
            'Il réduit les frais',
            'Un simple mouvement de 5 % contre vous peut effacer 100 % de la marge engagée',
            'Il désactive les bougies',
            'Il fonctionne uniquement en démo',
          ],
          explanation: 'Le levier multiplie les pertes autant que les gains : à 20x, 5 % × 20 = 100 %.',
        },
        {
          id: 'l7-q4',
          question: 'Quand faut-il éloigner son Stop-Loss pendant un trade perdant ?',
          options: [
            'Dès qu’on espère un rebond',
            'Jamais — déplacer le Stop-Loss brise votre plan et transforme une petite perte en grosse perte',
            'Le vendredi après-midi',
            'Quand le RSI dépasse 50',
          ],
          explanation: 'Respecter son Stop-Loss initial protège votre capital et garde vos statistiques fiables.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'Module 6 : Stratégies Pratiques',
      title: 'Deux stratégies simples à tester dès aujourd’hui',
      summary: 'Passez à la pratique avec deux plans étape par étape : Repli de tendance et Rebond sur bande.',
      sections: [
        {
          heading: 'Stratégie A : Repli sur tendance (Suivre le courant)',
          body: '1. Passez en 1H ou 4H avec la SMA 20. 2. Vérifiez que le prix est au-dessus d’une SMA 20 montante. 3. Attendez un léger repli calme près de la SMA 20 au lieu de courir après une grande bougie verte. 4. Achetez avec Stop-Loss sous le dernier creux et objectif 2× le risque.',
          keyTakeaway: 'Achetez les replis sains dans une tendance établie plutôt que les sommets.',
        },
        {
          heading: 'Stratégie B : Rebond Bollinger + RSI en range',
          body: 'Quand une paire comme EUR/USD oscille latéralement : 1. Activez Bandes de Bollinger et RSI. 2. Repérez le prix touchant la bande basse avec un RSI proche de 30–35 puis une bougie verte de rejet. 3. Visez la ligne centrale avec un Stop-Loss serré.',
          keyTakeaway: 'Analysez ensuite vos 10–20 trades dans le journal pour voir quel style vous réussit le mieux.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'Dans la stratégie de repli sur tendance, quel est le meilleur moment pour acheter ?',
          options: [
            'Après une immense bougie verte déjà loin de la SMA 20',
            'Après un repli calme ramenant le prix près de la SMA 20 montante',
            'Quand la SMA 20 chute fortement',
            'Sans Stop-Loss',
          ],
          explanation: 'Entrer sur un repli près du support offre un Stop-Loss plus court et un meilleur ratio gain/risque.',
        },
        {
          id: 'l8-q2',
          question: 'Pourquoi relire votre journal de trades après 10–20 opérations virtuelles ?',
          options: [
            'Pour mesurer votre vrai taux de réussite et identifier ce qui fonctionne',
            'Parce que le journal s’efface après 24h',
            'Pour supprimer les trades perdants',
            'Uniquement pour changer les couleurs',
          ],
          explanation: 'Vos statistiques transforment la pratique en progrès mesurable.',
        },
        {
          id: 'l8-q3',
          question: 'Comment les alertes de prix vous aident-elles à trader sereinement ?',
          options: [
            'Elles vous préviennent automatiquement quand le prix touche votre zone prévue sans fixer l’écran',
            'Elles passent des ordres au hasard',
            'Elles prédisent les journaux télévisés',
            'Elles suppriment le spread',
          ],
          explanation: 'Les alertes vous permettent d’agir uniquement lorsque vos conditions de prix sont réunies.',
        },
        {
          id: 'l8-q4',
          question: 'Quel est le meilleur signe de progrès dans votre compte virtuel ?',
          options: [
            'Un gros coup de chance avec levier maximal',
            'Respecter vos règles de taille et de Stop-Loss sur au moins 15–20 trades enregistrés',
            'Désactiver toutes les protections',
            'Choisir au hasard selon le logo',
          ],
          explanation: 'La régularité d’exécution sur un échantillon suffisant est la clé du trading durable.',
        },
      ],
    },
  },

  es: {
    'lesson-1': {
      moduleTitle: 'Módulo 1: Bases del Trading',
      title: 'Cómo funcionan Compra, Venta y el Spread',
      summary: 'Aprende qué significan Bid y Ask, por qué las operaciones inician algo negativas y cómo elegir mercados líquidos.',
      sections: [
        {
          heading: 'Dos precios en pantalla: Bid y Ask',
          body: 'Al mirar Bitcoin o EUR/USD siempre hay dos precios: el Bid (lo que ofrecen los compradores si vendes ahora) y el Ask (lo que piden los vendedores si compras ahora). El Ask siempre es ligeramente más alto que el Bid.',
          keyTakeaway: 'Compras al precio Ask y vendes al precio Bid.',
        },
        {
          heading: '¿Qué es el Spread?',
          body: 'La pequeña diferencia entre Ask y Bid se llama Spread. Es como una casa de cambio: te compra divisa un poco más barata de lo que la vende. Pares muy populares como BTC/USD y EUR/USD tienen spreads muy pequeños, lo que reduce tus costos.',
          keyTakeaway: 'Un spread pequeño significa menores costos y alcanzar el punto de equilibrio más rápido.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'Si EUR/USD muestra Bid 1.0580 y Ask 1.0582, ¿a qué precio compras ahora mismo?',
          options: ['1.0580 (el Bid)', '1.0582 (el Ask)', '1.0581 (punto medio)', 'El precio de ayer'],
          explanation: 'Al comprar de inmediato aceptas el precio de los vendedores, que es el Ask (1.0582).',
        },
        {
          id: 'l1-q2',
          question: '¿Por qué una operación nueva suele empezar con una pequeña pérdida al abrirse?',
          options: [
            'Por un error de cálculo',
            'Por el spread entre el Ask al que compraste y el Bid al que podrías cerrar',
            'El precio siempre cae tras comprar',
            'Pierdes 10% automático en cada orden',
          ],
          explanation: 'Entras al Ask y tu valor de cierre inmediato se calcula al Bid; esa diferencia es el spread.',
        },
        {
          id: 'l1-q3',
          question: '¿Qué mercado suele tener el spread más bajo para principiantes?',
          options: [
            'Pares muy negociados como EUR/USD o BTC/USD',
            'Monedas raras sin apenas volumen',
            'Mercados cerrados en festivo',
            'Todos tienen exactamente el mismo spread',
          ],
          explanation: 'La alta liquidez acerca compradores y vendedores y encoge el spread.',
        },
        {
          id: 'l1-q4',
          question: 'Si crees que el precio va a BAJAR y quieres ganar con la caída, ¿qué haces?',
          options: ['Comprar (Long)', 'Vender (Short)', 'Esperar un spread mayor', 'Cerrar la cuenta'],
          explanation: 'Vender (ir en corto / Short) genera ganancia cuando el precio cae desde tu entrada.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'Módulo 1: Bases del Trading',
      title: 'Órdenes Market, Limit, Stop-Loss y Take-Profit',
      summary: 'Domina los cuatro tipos de órdenes clave para entrar con control y proteger siempre tu saldo.',
      sections: [
        {
          heading: 'Orden de Mercado (Market) vs. Orden Límite',
          body: 'Una orden Market compra o vende al instante al mejor precio actual. Una orden Limit te deja elegir tu precio y esperar: «Solo comprar Bitcoin si baja a $88,000». Controlas el precio, pero solo se ejecuta si el mercado llega allí.',
          keyTakeaway: 'Usa Market para entrar ya; usa Limit para esperar un mejor precio.',
        },
        {
          heading: 'Tu red de seguridad: Stop-Loss y Take-Profit',
          body: 'El Stop-Loss cierra automáticamente tu operación si el precio va en contra más de lo planeado, evitando grandes pérdidas. El Take-Profit asegura tus ganancias automáticamente cuando el precio toca tu objetivo.',
          keyTakeaway: 'Nunca abras una operación sin definir antes dónde salir si te equivocas (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'Bitcoin está en $91,000 y solo quieres comprar si baja a $89,500. ¿Qué orden usas?',
          options: ['Compra Market', 'Compra Límite en $89,500', 'Stop-Loss', 'Venta Market'],
          explanation: 'Una orden Compra Límite espera por debajo del precio actual y solo se llena en $89,500 o menos.',
        },
        {
          id: 'l2-q2',
          question: '¿Cuál es la función principal de un Stop-Loss?',
          options: [
            'Garantizar que todas las operaciones ganen',
            'Cerrar automáticamente una operación perdedora en tu límite para mantener pérdidas pequeñas',
            'Duplicar tu tamaño automáticamente',
            'Pausar el gráfico',
          ],
          explanation: 'El Stop-Loss actúa como cinturón de seguridad limitando tu pérdida máxima.',
        },
        {
          id: 'l2-q3',
          question: 'Compraste ETH en $3,000 con Take-Profit en $3,300. ¿Qué ocurre si ETH toca $3,300 mientras no miras?',
          options: [
            'Nada hasta que pulses Cerrar',
            'Se cierra automáticamente cerca de $3,300 asegurando tu ganancia',
            'Se borra tu Stop-Loss',
            'Queda abierta para siempre',
          ],
          explanation: 'El Take-Profit ejecuta la salida automáticamente al alcanzar tu meta de beneficio.',
        },
        {
          id: 'l2-q4',
          question: '¿Cuándo prefieren los traders una orden de Mercado (Market)?',
          options: [
            'Porque siempre da mejor precio que Limit',
            'Cuando importa la rapidez: garantiza ejecución inmediata al Bid/Ask actual',
            'Porque desactiva el Stop-Loss',
            'Solo en Forex',
          ],
          explanation: 'Las órdenes Market priorizan velocidad; las Limit priorizan el precio exacto.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'Módulo 2: Mercados Cripto',
      title: 'Esenciales Cripto: Volatilidad 24/7 y Ciclos',
      summary: 'Entiende por qué cripto nunca cierra, por qué las monedas siguen a Bitcoin y cómo dimensionar operaciones.',
      sections: [
        {
          heading: 'Abierto siempre, cambios más rápidos',
          body: 'A diferencia de bolsas y bancos, cripto opera 24 horas al día, los 7 días de la semana. Bitcoin o Solana pueden moverse 3% a 8% en un solo día, frente a menos del 1% típico en grandes pares Forex.',
          keyTakeaway: 'Como cripto oscila más fuerte, los principiantes deben usar montos menores por operación.',
        },
        {
          heading: 'Bitcoin marca el paso',
          body: 'Cuando Bitcoin da un giro brusco, otras criptos como ETH, SOL o ADA suelen seguir la misma dirección con porcentajes aún mayores. Revisa siempre BTC/USD antes de operar otra moneda.',
          keyTakeaway: 'Mira primero la tendencia de Bitcoin: marca el ánimo de todo el mercado cripto.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: '¿Cuándo cierra el mercado de criptomonedas el fin de semana?',
          options: ['Viernes 17:00', 'Sábado a medianoche', 'Nunca — opera 24/7 todo el año', 'Solo en festivos'],
          explanation: 'Las redes cripto funcionan de forma continua día y noche todo el año.',
        },
        {
          id: 'l3-q2',
          question: 'En comparación con EUR/USD, ¿por qué usar montos menores en SOL/USD?',
          options: [
            'Cripto tiene variaciones porcentuales diarias mucho mayores',
            'Solana no se vende los martes',
            'Los spreads cripto son 0%',
            'Forex cuesta más por unidad',
          ],
          explanation: 'Mayor volatilidad implica mayores ganancias y pérdidas posibles con el mismo dinero.',
        },
        {
          id: 'l3-q3',
          question: '¿Por qué revisar BTC/USD antes de comprar ADA/USD?',
          options: [
            'No puedes comprar ADA sin tener BTC',
            'La dirección de Bitcoin influye fuertemente en el resto del mercado cripto',
            'Las altcoins solo suben si BTC no se mueve',
            'Bitcoin fija tasas Forex',
          ],
          explanation: 'Bitcoin concentra la mayor parte del mercado y guía el sentimiento general.',
        },
        {
          id: 'l3-q4',
          question: '¿Qué buen hábito conviene mantener en cripto los fines de semana?',
          options: [
            'Quitar todos los Stop-Loss',
            'Mantener Stop-Loss activos porque el menor volumen provoca picos repentinos',
            'Usar apalancamiento 20x',
            'Ignorar límites de riesgo',
          ],
          explanation: 'Con menor liquidez en fin de semana pueden darse mechas bruscas; el Stop-Loss te protege.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'Módulo 3: Fundamentos Forex',
      title: 'Pares de Divisas, Pips y Cotizaciones Forex',
      summary: 'Aprende a leer EUR/USD y USD/JPY en lenguaje sencillo y calcula cuánto vale cada pip.',
      sections: [
        {
          heading: 'Siempre operas dos monedas a la vez',
          body: 'En Forex comparas una moneda frente a otra, como EUR/USD. La primera (EUR) es la moneda base; la segunda (USD) es la cotizada. Si EUR/USD = 1.0600, 1 euro cuesta 1.0600 dólares. Al comprar, apuestas a que el euro sube frente al dólar.',
          keyTakeaway: 'Comprar = la primera divisa sube frente a la segunda. Vender = la primera baja.',
        },
        {
          heading: '¿Qué es un Pip?',
          body: 'Las divisas cambian en fracciones pequeñas medidas en «Pips». En la mayoría de pares como EUR/USD, 1 pip es el 4.º decimal (0.0001). En pares con yen japonés (USD/JPY), 1 pip es el 2.º decimal (0.01).',
          keyTakeaway: 'Si EUR/USD sube de 1.0600 a 1.0625, avanzó +25 pips.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'En el par GBP/USD, ¿cuál es la moneda base?',
          options: ['USD (Dólar estadounidense)', 'GBP (Libra esterlina)', 'EUR (Euro)', 'Ambas'],
          explanation: 'La primera divisa escrita en cualquier par Forex es siempre la moneda base.',
        },
        {
          id: 'l4-q2',
          question: 'EUR/USD sube de 1.0550 a 1.0580. ¿Cuántos pips subió?',
          options: ['3 pips', '30 pips', '300 pips', '0.3 pips'],
          explanation: '0.0030 dividido entre 0.0001 (1 pip) equivale a 30 pips.',
        },
        {
          id: 'l4-q3',
          question: '¿Qué par mide 1 pip en el 2.º decimal (0.01) en lugar del 4.º?',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'Los pares con yen japonés (JPY) cotizan cerca de 100–160, así que 1 pip es 0.01.',
        },
        {
          id: 'l4-q4',
          question: 'Si esperas que el dólar (USD) se FORTALEZCA frente al euro, ¿qué haces en EUR/USD?',
          options: ['Comprar EUR/USD', 'Vender (Short) EUR/USD', 'Comprar BTC', 'Esperar 0 pips'],
          explanation: 'Si el USD sube, EUR/USD baja; vender EUR/USD aprovecha esa caída.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'Módulo 4: Leer Gráficos',
      title: 'Cómo leer Velas Japonesas y Tendencias',
      summary: 'Descubre la historia de cada vela verde y roja: Apertura, Máximo, Mínimo, Cierre y presión del mercado.',
      sections: [
        {
          heading: 'Los 4 datos dentro de cada vela',
          body: 'Cada vela resume toda la actividad de un intervalo (15 min, 1h...). El rectángulo («cuerpo») muestra dónde abrió y cerró el precio. Vela verde = cerró más alto que abrió; vela roja = cerró más bajo.',
          keyTakeaway: 'Cuerpo verde = ganaron los compradores. Cuerpo rojo = ganaron los vendedores.',
        },
        {
          heading: '¿Qué indican las mechas largas?',
          body: 'Las líneas finas arriba y abajo son las mechas y muestran los extremos alcanzados. Una mecha inferior larga indica que el precio cayó, pero los compradores entraron con fuerza y lo impulsaron hacia arriba.',
          keyTakeaway: 'Las mechas largas suelen señalar rechazo en niveles importantes.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'En un gráfico de 15 minutos, ¿qué muestra una vela verde?',
          options: [
            'Solo una operación antigua',
            'Apertura, cierre superior, máximo y mínimo dentro de esos 15 minutos',
            'Ganancia asegurada',
            'Un indicador exclusivo de Forex',
          ],
          explanation: 'Cada vela resume los cuatro precios (Apertura, Máximo, Mínimo, Cierre) de su periodo.',
        },
        {
          id: 'l5-q2',
          question: '¿Qué suele significar una mecha muy larga por DEBAJO de la vela?',
          options: [
            'Error del gráfico',
            'El precio cayó con fuerza y luego los compradores lo empujaron hacia arriba',
            'Volumen cero',
            'Victoria total vendedora',
          ],
          explanation: 'Una mecha inferior larga refleja fuerte rechazo alcista tras una caída.',
        },
        {
          id: 'l5-q3',
          question: 'En una tendencia alcista sana, ¿qué patrón forman las velas?',
          options: [
            'Máximos y mínimos cada vez más bajos',
            'Máximos y mínimos cada vez más altos',
            'Línea totalmente plana',
            'Saltos aleatorios',
          ],
          explanation: 'Una tendencia alcista sube en escalera con máximos y mínimos crecientes.',
        },
        {
          id: 'l5-q4',
          question: '¿Qué temporalidad ofrece una lectura más tranquila y clara para principiantes?',
          options: ['1 minuto', '1 hora (1H) o 4 horas (4H)', '5 segundos', 'Registro tick a tick'],
          explanation: 'Los marcos 1H y 4H filtran el ruido corto y muestran tendencias más limpias.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'Módulo 4: Leer Gráficos',
      title: 'Indicadores simples: Medias Móviles, Bollinger y RSI',
      summary: 'Usa indicadores con propósito: detecta la dirección con SMA/EMA y evita perseguir precios estirados con RSI.',
      sections: [
        {
          heading: 'Medias Móviles (SMA 20 y EMA 50)',
          body: 'Una Media Móvil dibuja una línea suave con el promedio de las últimas 20 o 50 velas. Si el precio cotiza encima de una media que sube, la tendencia es alcista y ayuda a no comprar contra corriente.',
          keyTakeaway: 'Precio sobre SMA/EMA ascendente = sesgo alcista.',
        },
        {
          heading: 'Bandas de Bollinger y RSI',
          body: 'Las Bandas de Bollinger crean un canal dinámico según la volatilidad. El RSI (0–100) mide la velocidad: sobre 70 indica posible sobrecompra; bajo 30 indica posible sobreventa.',
          keyTakeaway: 'Los indicadores apoyan tu lectura del precio — nunca compres a ciegas solo por el RSI.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'Si el precio se mantiene POR ENCIMA de una SMA 20 que sube, ¿cuál es la lectura más directa?',
          options: ['El mercado está en tendencia alcista', 'El mercado está congelado', 'Debes vender ya', 'Volumen negativo'],
          explanation: 'Sostenerse encima de una media móvil ascendente confirma impulso alcista.',
        },
        {
          id: 'l6-q2',
          question: '¿Qué suele sugerir un RSI por encima de 70?',
          options: [
            'Que el precio subió muy rápido y podría estar sobrecomprado / próximo a pausar',
            'Que el activo no vale nada',
            'Que debes usar 20x',
            'Que el spread se duplicó',
          ],
          explanation: 'RSI > 70 refleja fuerte impulso alcista que puede estar estirado a corto plazo.',
        },
        {
          id: 'l6-q3',
          question: '¿Por qué las Bandas de Bollinger se ensanchan y estrechan?',
          options: [
            'Se ajustan a los cambios de volatilidad del mercado',
            'Cambian al azar a medianoche',
            'Miden el tamaño del pip',
            'Muestran tu saldo',
          ],
          explanation: 'Las bandas se expanden con alta volatilidad y se contraen en consolidaciones calmas.',
        },
        {
          id: 'l6-q4',
          question: '¿Cuál es la mejor forma de usar RSI y Medias Móviles?',
          options: [
            'Poner 15 indicadores juntos',
            'Usar 1 herramienta de tendencia + 1 de impulso junto a un Stop-Loss claro',
            'Quitar el Stop-Loss si RSI < 30',
            'Operar solo por colores',
          ],
          explanation: 'La simplicidad funciona mejor: tendencia + momento + control estricto del riesgo.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'Módulo 5: Riesgo y Disciplina',
      title: 'La regla del 1–2%, Riesgo/Beneficio y Tamaño',
      summary: 'Aprende la fórmula #1 que protege a los traders — incluso cuando pierden la mitad de sus operaciones.',
      sections: [
        {
          heading: 'Nunca arriesgues demasiado en una sola idea',
          body: 'Incluso los grandes traders pierden 40–50% de sus operaciones. Su secreto es el tamaño: arriesgan solo 1% a 2% de su cuenta si salta el Stop-Loss. En $100,000, arriesgar 1% significa perder máximo $1,000; necesitarías 100 pérdidas seguidas para quedar en cero.',
          keyTakeaway: 'Arriesga 1% o menos al empezar. Sobrevivir va antes que ganar rápido.',
        },
        {
          heading: 'Relación Riesgo / Beneficio (1:2 o mejor)',
          body: 'Antes de entrar, compara lo que arriesgas en tu Stop-Loss frente a tu meta en Take-Profit. Arriesgar $500 para buscar $1,000 es un ratio 1:2. ¡Con 1:2 solo necesitas acertar el 34% de tus operaciones para empatar!',
          keyTakeaway: 'Busca operaciones donde tu ganancia potencial sea al menos 2× tu riesgo.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'Con una cuenta de $100,000 y la regla del 1%, ¿cuál es la pérdida máxima permitida en una operación?',
          options: ['$10,000', '$1,000', '$50,000', '$100'],
          explanation: 'El 1% de $100,000 equivale a $1,000 de pérdida máxima planeada.',
        },
        {
          id: 'l7-q2',
          question: 'Cada acierto gana +$600 y cada fallo pierde -$300 (ratio 1:2). Si aciertas 50% de 10 operaciones, ¿cuál es tu resultado?',
          options: ['$0', '+$1,500 de ganancia', '-$1,500 de pérdida', '+$3,000 de ganancia'],
          explanation: '5 aciertos × $600 = +$3,000; 5 fallos × -$300 = -$1,500; Neto = +$1,500.',
        },
        {
          id: 'l7-q3',
          question: '¿Cuál es el peligro oculto de usar apalancamiento alto (como 20x) siendo principiante?',
          options: [
            'Baja las comisiones',
            'Un movimiento del 5% en contra puede borrar el 100% de tu margen',
            'Desactiva las velas',
            'Solo funciona en demo',
          ],
          explanation: 'El apalancamiento multiplica pérdidas igual que ganancias: 5% × 20 = 100%.',
        },
        {
          id: 'l7-q4',
          question: '¿Cuándo debes alejar tu Stop-Loss durante una operación perdedora?',
          options: [
            'Cuando tengas esperanza de rebote',
            'Nunca — alejar el Stop-Loss rompe tu plan y convierte pérdidas pequeñas en grandes',
            'Cada viernes',
            'Cuando el RSI pase de 50',
          ],
          explanation: 'Respetar tu Stop-Loss original protege tu capital y mantiene tus estadísticas honestas.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'Módulo 6: Estrategias Prácticas',
      title: 'Dos estrategias para practicar hoy mismo',
      summary: 'Aplica todo con dos listas claras: Retroceso en Tendencia y Rebote en Rango.',
      sections: [
        {
          heading: 'Estrategia A: Retroceso en Tendencia',
          body: '1. Cambia a gráfico 1H o 4H con SMA 20. 2. Confirma que el precio está encima de una SMA 20 ascendente. 3. Espera un retroceso calmado cerca de la SMA 20 en lugar de perseguir velas verdes largas. 4. Compra con Stop-Loss bajo el último mínimo y meta de 2× tu riesgo.',
          keyTakeaway: 'Compra retrocesos sanos dentro de una tendencia existente.',
        },
        {
          heading: 'Estrategia B: Rebote Bollinger + RSI',
          body: 'Cuando un par como EUR/USD se mueve lateralmente: 1. Activa Bandas de Bollinger y RSI. 2. Busca el precio tocando la banda inferior con RSI cerca de 30–35 y vela verde de giro. 3. Apunta a la línea media con Stop-Loss ajustado.',
          keyTakeaway: 'Revisa tus 10–20 operaciones en el historial para descubrir qué estrategia te funciona mejor.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'En la estrategia de Retroceso en Tendencia, ¿cuándo conviene entrar en Compra?',
          options: [
            'Tras una vela verde gigante muy lejos de la SMA 20',
            'Tras un retroceso tranquilo que acerca el precio a la SMA 20 ascendente',
            'Cuando la SMA 20 cae fuerte',
            'Sin Stop-Loss',
          ],
          explanation: 'Entrar en un retroceso cerca del soporte da un Stop-Loss más corto y mejor Riesgo/Beneficio.',
        },
        {
          id: 'l8-q2',
          question: '¿Por qué revisar tu historial tras 10–20 operaciones simuladas?',
          options: [
            'Para medir tu tasa real de acierto y descubrir qué patrones te funcionan',
            'Porque el historial caduca en 24h',
            'Para borrar las pérdidas',
            'Solo para cambiar colores',
          ],
          explanation: 'Tus estadísticas convierten la práctica en mejora medible.',
        },
        {
          id: 'l8-q3',
          question: '¿Cómo ayudan las alertas de precio a operar con calma?',
          options: [
            'Te avisan automáticamente cuando el precio toca tu zona planeada sin mirar la pantalla todo el día',
            'Abren operaciones al azar',
            'Predicen las noticias',
            'Eliminan el spread',
          ],
          explanation: 'Las alertas te dejan actuar únicamente cuando el mercado llega a tu nivel planeado.',
        },
        {
          id: 'l8-q4',
          question: '¿Cuál es la mejor señal de progreso en tu cuenta de práctica?',
          options: [
            'Un golpe de suerte con máximo apalancamiento',
            'Seguir tus reglas de tamaño y Stop-Loss de forma constante durante 15–20 operaciones',
            'Desactivar todas las salidas de seguridad',
            'Elegir monedas por su logotipo',
          ],
          explanation: 'La consistencia disciplinada a lo largo de varias operaciones es la base del éxito.',
        },
      ],
    },
  },

  ar: {
    'lesson-1': {
      moduleTitle: 'الوحدة ١: أساسيات التداول',
      title: 'كيف يعمل الشراء والبيع وفارق السعر (Spread)',
      summary: 'تعلّم معنى سعري العرض والطلب (Bid و Ask)، ولماذا تبدأ الصفقة بخسارة طفيفة، وكيف تختار أسواقاً عالية السيولة.',
      sections: [
        {
          heading: 'سعران على كل شاشة: Bid و Ask',
          body: 'عندما تنظر إلى البيتكوين أو زوج EUR/USD، هناك دائماً سعران: سعر Bid (السعر الذي يمكنك البيع به فوراً) وسعر Ask (السعر الذي يمكنك الشراء به فوراً). ويكون سعر Ask دائماً أعلى بقليل من سعر Bid.',
          keyTakeaway: 'أنت تشتري بسعر Ask وتبيع بسعر Bid.',
        },
        {
          heading: 'ما هو السبريد (Spread)؟',
          body: 'الفارق البسيط بين Ask و Bid يُسمى السبريد. تخيّله مثل مكتب صرافة: يشتري العملة بسعر أقل قليلاً مما يبيعها به. الأسواق النشطة مثل BTC/USD و EUR/USD لها سبريد صغير جداً مما يقلل تكلفتك.',
          keyTakeaway: 'السبريد الأصغر يعني تكلفة دخول أقل ووصولاً أسرع لنقطة التعادل.',
        },
      ],
      quiz: [
        {
          id: 'l1-q1',
          question: 'إذا كان EUR/USD يعرض Bid عند 1.0580 و Ask عند 1.0582، بأي سعر تشتري الآن؟',
          options: ['1.0580 (سعر Bid)', '1.0582 (سعر Ask)', '1.0581 (المنتصف)', 'سعر الأمس'],
          explanation: 'عند الشراء الفوري تشتري من البائعين بسعر Ask وهو 1.0582.',
        },
        {
          id: 'l1-q2',
          question: 'لماذا تبدأ الصفقة الجديدة غالباً برقم سالب بسيط فور فتحها؟',
          options: [
            'بسبب خطأ في الحساب',
            'بسبب السبريد بين سعر الشراء (Ask) وسعر البيع الفوري (Bid)',
            'الأسعار تهبط دائماً بعد الشراء',
            'تخسر ١٠٪ تلقائياً في كل صفقة',
          ],
          explanation: 'أنت تدخل على سعر Ask ويُحسب تقييم خروجك اللحظي على سعر Bid، والسبريد هو هذا الفارق الأولي.',
        },
        {
          id: 'l1-q3',
          question: 'أي سوق يتميز عادةً بأصغر وأرخص سبريد للمبتدئين؟',
          options: [
            'الأزواج النشطة عالية السيولة مثل EUR/USD أو BTC/USD',
            'العملات النادرة التي بالكاد تتداول يومياً',
            'الأسواق المغلقة في العطلات',
            'جميع الأصول لها نفس السبريد دائماً',
          ],
          explanation: 'السيولة العالية تقرّب المشترين من البائعين فتقلّص الفارق السعري.',
        },
        {
          id: 'l1-q4',
          question: 'إذا توقعت هبوط السعر وأردت الربح من الهبوط، ماذا تفعل؟',
          options: ['شراء (Long)', 'بيع (Short)', 'انتظار سبريد أكبر', 'إغلاق الحساب'],
          explanation: 'صفقة البيع (Short) تحقق ربحاً عندما ينخفض السعر عن نقطة دخولك.',
        },
      ],
    },
    'lesson-2': {
      moduleTitle: 'الوحدة ١: أساسيات التداول',
      title: 'أوامر السوق والحد ووقف الخسارة وجني الأرباح',
      summary: 'أتقن الأوامر الأربعة الأساسية حتى لا تدخل عشوائياً ولا تنسى حماية رصيدك أبداً.',
      sections: [
        {
          heading: 'أمر السوق (Market) مقابل الأمر المحدد (Limit)',
          body: 'أمر Market ينفذ الشراء أو البيع فوراً بالسعر المتاح الآن. أما أمر Limit فيسمح لك بتحديد سعرك والانتظار بصبر، مثل: «اشترِ البيتكوين فقط إذا هبط إلى 88,000$». تتحكم بالسعر لكنه يُنفذ فقط إذا وصل السوق لهدفك.',
          keyTakeaway: 'استخدم Market للدخول الفوري، واستخدم Limit لانتظار سعر أفضل.',
        },
        {
          heading: 'شبكة الأمان: وقف الخسارة وجني الأرباح',
          body: 'وقف الخسارة (Stop-Loss) يغلق صفقتك تلقائياً إذا تحرك السعر ضدك بمقدار محدد ليمنع تحول الخطأ الصغير إلى خسارة كبيرة. جني الأرباح (Take-Profit) يغلق الصفقة ويحجز أرباحك تلقائياً عند الوصول لهدفك.',
          keyTakeaway: 'لا تفتح صفقة أبداً دون تحديد نقطة الخروج إذا كنت مخطئاً (Stop-Loss).',
        },
      ],
      quiz: [
        {
          id: 'l2-q1',
          question: 'البيتكوين الآن عند 91,000$ وتريد الشراء فقط إذا هبط إلى 89,500$. أي أمر تضع؟',
          options: ['أمر شراء Market', 'أمر شراء Limit عند 89,500$', 'أمر Stop-Loss', 'أمر بيع Market'],
          explanation: 'أمر الشراء المحدد (Buy Limit) ينتظر أسفل السعر الحالي ويُنفذ فقط عند 89,500$ أو أقل.',
        },
        {
          id: 'l2-q2',
          question: 'ما الوظيفة الأساسية لأمر وقف الخسارة (Stop-Loss)؟',
          options: [
            'ضمان ربح كل صفقة',
            'إغلاق الصفقة الخاسرة تلقائياً عند حدك المسبق لإبقاء الخسائر صغيرة',
            'مضاعفة حجم الصفقة تلقائياً',
            'إيقاف الرسم البياني',
          ],
          explanation: 'وقف الخسارة يعمل كحزام أمان يحدّ من أقصى خسارة ممكنة قبل تدخل العاطفة.',
        },
        {
          id: 'l2-q3',
          question: 'اشتريت ETH عند 3,000$ ووضعت جني الأرباح عند 3,300$. ماذا يحدث إذا وصل السعر إلى 3,300$ أثناء غيابك؟',
          options: [
            'لا يحدث شيء حتى تضغط إغلاق يدوياً',
            'تُغلق الصفقة تلقائياً قرب 3,300$ ويُحجز الربح',
            'يُحذف وقف الخسارة',
            'تبقى الصفقة مفتوحة للأبد',
          ],
          explanation: 'أمر Take-Profit ينفذ الإغلاق تلقائياً بمجرد ملامسة السعر لهدفك.',
        },
        {
          id: 'l2-q4',
          question: 'لماذا يُستخدم أمر السوق (Market) عند أهمية التوقيت؟',
          options: [
            'لأنه يعطي دائماً سعراً أفضل من Limit',
            'لأنه يضمن التنفيذ الفوري بالسعر الحالي للعرض أو الطلب',
            'لأنه يلغي وقف الخسارة',
            'يعمل فقط في الفوركس',
          ],
          explanation: 'أمر Market يعطي الأولوية للسرعة، بينما أمر Limit يعطي الأولوية للسعر الدقيق.',
        },
      ],
    },
    'lesson-3': {
      moduleTitle: 'الوحدة ٢: أسواق العملات الرقمية',
      title: 'أساسيات الكريبتو: تداول ٢٤/٧ والتقلبات والدورات',
      summary: 'افهم لماذا لا يُغلق سوق الكريبتو أبداً، وكيف تقود البيتكوين بقية العملات، وكيف تضبط حجم صفقاتك.',
      sections: [
        {
          heading: 'مفتوح دائماً بتحركات أسرع',
          body: 'بخلاف البورصات والبنوك، تعمل أسواق العملات الرقمية ٢٤ ساعة طوال أيام الأسبوع بما في ذلك العطلات. قد تتحرك بيتكوين أو سولانا بنسبة 3% إلى 8% في يوم واحد مقارنة بأقل من 1% عادة في أزواج الفوركس الرئيسية.',
          keyTakeaway: 'لأن تقلبات الكريبتو أكبر، يُنصح للمبتدئين التداول بمبالغ أصغر في كل صفقة.',
        },
        {
          heading: 'البيتكوين تقود السوق',
          body: 'عندما تتحرك البيتكوين بقوة صعوداً أو هبوطاً، غالباً ما تتبعها العملات البديلة مثل إيثيريوم وسولانا وكاردانو في نفس الاتجاه وبنسب أكبر. ألقِ نظرة دائماً على BTC/USD قبل تداول أي عملة أخرى.',
          keyTakeaway: 'تحقق من اتجاه البيتكوين أولاً — فهي تحدد المزاج العام لسوق الكريبتو.',
        },
      ],
      quiz: [
        {
          id: 'l3-q1',
          question: 'متى يُغلق سوق العملات الرقمية في عطلة نهاية الأسبوع؟',
          options: ['الجمعة ٥ مساءً', 'السبت منتصف الليل', 'لا يُغلق أبداً — يعمل ٢٤/٧', 'في العطل البنكية فقط'],
          explanation: 'تعمل شبكات العملات الرقمية بشكل متواصل طوال العام ليلاً ونهاراً.',
        },
        {
          id: 'l3-q2',
          question: 'مقارنة بزوج EUR/USD، لماذا يفضل المبتدئ تقليل حجم الصفقة على SOL/USD؟',
          options: [
            'العملات الرقمية تشهد تقلبات يومية أكبر بكثير',
            'لا يمكن بيع سولانا يوم الثلاثاء',
            'سبريد الكريبتو دائماً 0%',
            'الفوركس أغلى سعراً للوحدة',
          ],
          explanation: 'التقلب الأعلى يعني أرباحاً وخسائر أكبر لنفس المبلغ، لذا الحجم الأصغر يحفظ توازن المخاطرة.',
        },
        {
          id: 'l3-q3',
          question: 'لماذا تراقب BTC/USD قبل شراء عملة مثل ADA/USD؟',
          options: [
            'لا يمكن شراء ADA بدون امتلاك BTC',
            'اتجاه البيتكوين يؤثر بقوة على بقية سوق العملات الرقمية',
            'العملات البديلة لا تتحرك إلا عند ثبات BTC',
            'البيتكوين تحدد أسعار الفائدة',
          ],
          explanation: 'تمثل البيتكوين أكبر وزن في السوق وتقود المعنويات العامة.',
        },
        {
          id: 'l3-q4',
          question: 'ما العادة الذكية خلال عطلة نهاية الأسبوع في الكريبتو؟',
          options: [
            'إزالة جميع أوامر وقف الخسارة',
            'إبقاء وقف الخسارة مفعلاً لأن انخفاض السيولة قد يسبب قفزات حادة',
            'استخدام رافعة 20x',
            'تجاهل حدود المخاطرة',
          ],
          explanation: 'انخفاض السيولة في العطلات يزيد احتمالية التذبذب المفاجئ؛ وقف الخسارة يحميك.',
        },
      ],
    },
    'lesson-4': {
      moduleTitle: 'الوحدة ٣: أساسيات الفوركس',
      title: 'أزواج العملات والنقاط (Pips) وتسعير الفوركس',
      summary: 'افهم أزواج EUR/USD و USD/JPY ببساطة واحسب القيمة الدقيقة لحركة ١٠ نقاط.',
      sections: [
        {
          heading: 'تداول عملتين مقابل بعضهما دائماً',
          body: 'في الفوركس تقارن عملة بأخرى مثل EUR/USD. الأولى (EUR) هي العملة الأساسية، والثانية (USD) هي عملة التسعير. إذا كان السعر 1.0600 فهذا يعني أن ١ يورو يساوي 1.0600 دولار. الشراء يعني توقع ارتفاع اليورو مقابل الدولار.',
          keyTakeaway: 'الشراء = ارتفاع العملة الأولى مقابل الثانية. البيع = انخفاض العملة الأولى.',
        },
        {
          heading: 'ما هي النقطة (Pip)؟',
          body: 'تتحرك العملات بأجزاء صغيرة جداً تُقاس بـ«النقاط» (Pips). في معظم الأزواج مثل EUR/USD، النقطة الواحدة هي الخانة العشرية الرابعة (0.0001). أما في أزواج الين الياباني مثل USD/JPY، فالنقطة هي الخانة الثانية (0.01).',
          keyTakeaway: 'ارتفاع EUR/USD من 1.0600 إلى 1.0625 يعني ربح +٢٥ نقطة.',
        },
      ],
      quiz: [
        {
          id: 'l4-q1',
          question: 'في زوج GBP/USD، أي عملة هي العملة الأساسية (Base)؟',
          options: ['USD (الدولار الأمريكي)', 'GBP (الجنيه الإسترليني)', 'EUR (اليورو)', 'كلاهما معاً'],
          explanation: 'العملة المكتوبة أولاً في أي زوج فوركس هي دائماً العملة الأساسية.',
        },
        {
          id: 'l4-q2',
          question: 'ارتفع EUR/USD من 1.0550 إلى 1.0580. كم نقطة تحرك؟',
          options: ['3 نقاط', '30 نقطة', '300 نقطة', '0.3 نقطة'],
          explanation: '0.0030 مقسوماً على 0.0001 (قيمة النقطة) يساوي ٣٠ نقطة.',
        },
        {
          id: 'l4-q3',
          question: 'أي زوج يقيس النقطة الواحدة عند الخانة العشرية الثانية (0.01) بدلاً من الرابعة؟',
          options: ['EUR/USD', 'AUD/USD', 'USD/JPY', 'GBP/USD'],
          explanation: 'أزواج الين الياباني (JPY) تُسعّر قرب 100–160، لذا فإن النقطة هي 0.01.',
        },
        {
          id: 'l4-q4',
          question: 'إذا توقعت أن يقوى الدولار الأمريكي مقابل اليورو، ماذا تفعل على EUR/USD؟',
          options: ['شراء EUR/USD', 'بيع (Short) EUR/USD', 'شراء بيتكوين', 'انتظار 0 نقطة'],
          explanation: 'عندما يقوى الدولار ينخفض سعر EUR/USD، لذا يحقق البيع ربحاً.',
        },
      ],
    },
    'lesson-5': {
      moduleTitle: 'الوحدة ٤: قراءة الرسوم البيانية',
      title: 'قراءة الشموع اليابانية والاتجاهات',
      summary: 'اقرأ قصة كل شمعة خضراء وحمراء: الافتتاح والأعلى والأدنى والإغلاق وصراع المشترين والبائعين.',
      sections: [
        {
          heading: 'الأرقام الأربعة داخل كل شمعة',
          body: 'تلخص كل شمعة حركة التداول خلال فترة محددة (مثل ١٥ دقيقة أو ساعة). المستطيل («الجسم») يوضح سعر الافتتاح والإغلاق. الشمعة الخضراء تعني أن الإغلاق أعلى من الافتتاح، والحمراء تعني إغلاقاً أدنى.',
          keyTakeaway: 'جسم أخضر = انتصر المشترون في تلك الفترة. جسم أحمر = انتصر البائعون.',
        },
        {
          heading: 'ماذا تخبرنا الذيول الطويلة؟',
          body: 'الخطوط الرفيعة أعلى وأسفل الجسم هي «الذيول» وتُظهر أعلى وأدنى سعر تم الوصول إليه. الذيل السفلي الطويل يعني أن البائعين دفعوا السعر للهبوط، لكن المشترين تدخلوا بقوة وأعادوه للأعلى.',
          keyTakeaway: 'الذيول الطويلة تشير غالباً إلى رفض سعري عند مستويات الدعم أو المقاومة.',
        },
      ],
      quiz: [
        {
          id: 'l5-q1',
          question: 'على رسم ١٥ دقيقة، ماذا تمثل الشمعة الخضراء الواحدة؟',
          options: [
            'صفقة واحدة قديمة',
            'الافتتاح، والإغلاق الأعلى، وأعلى وأدنى سعر خلال تلك الـ١٥ دقيقة',
            'ربحاً مضموناً للساعة القادمة',
            'مؤشراً خاصاً بالفوركس فقط',
          ],
          explanation: 'تعرض كل شمعة الأسعار الأربعة (الافتتاح، الأعلى، الأدنى، الإغلاق) لإطارها الزمني.',
        },
        {
          id: 'l5-q2',
          question: 'ماذا يعني وجود ذيل طويل جداً أسفل الشمعة عادةً؟',
          options: [
            'عطل في الرسم البياني',
            'هبط السعر بقوة ثم تدخل المشترون بقوة ورفعوه مجدداً',
            'انعدام حجم التداول',
            'انتصار كامل للبائعين بلا مقاومة',
          ],
          explanation: 'الذيل السفلي الطويل يدل على رفض شرائي قوي بعد الهبوط.',
        },
        {
          id: 'l5-q3',
          question: 'في الاتجاه الصاعد الصحي، ما النمط الذي تشكله الشموع عادةً؟',
          options: [
            'قمم وقيعان هابطة',
            'قمم أعلى وقيعان أعلى',
            'خط أفقي تماماً',
            'فجوات عشوائية فقط',
          ],
          explanation: 'يصعد الاتجاه الصاعد كالسلالم بحيث تكون كل قمة وكل قاع أعلى من سابقه.',
        },
        {
          id: 'l5-q4',
          question: 'أي إطار زمني يمنح المبتدئين رؤية أهدأ وأوضح وأقل ضجيجاً؟',
          options: ['رسم ١ دقيقة', 'رسم ١ ساعة (1H) أو ٤ ساعات (4H)', '٥ ثوانٍ', 'سجل كل حركة لحظية'],
          explanation: 'الأطر الأكبر (1H و 4H) تزيل التذبذب العشوائي وتظهر اتجاهات أنظف.',
        },
      ],
    },
    'lesson-6': {
      moduleTitle: 'الوحدة ٤: قراءة الرسوم البيانية',
      title: 'مؤشرات مبسطة: المتوسطات المتحركة وبولينجر و RSI',
      summary: 'استخدم المؤشرات بوضوح: حدد الاتجاه بـ SMA/EMA وتجنب ملاحقة الارتفاعات المفرطة بمؤشر RSI.',
      sections: [
        {
          heading: 'المتوسطات المتحركة (SMA 20 و EMA 50)',
          body: 'يرسم المتوسط المتحرك خطاً سلساً لمتوسط السعر خلال آخر ٢٠ أو ٥٠ شمعة. عندما يكون السعر فوق متوسط صاعد، يكون الاتجاه صاعداً ويساعدك ذلك على تجنب الشراء عكس الاتجاه العام.',
          keyTakeaway: 'السعر فوق متوسط صاعد = ميل صعودي. تحت متوسط هابط = ميل هبوطي.',
        },
        {
          heading: 'حزم بولينجر ومؤشر RSI',
          body: 'ترسم حزم بولينجر قناة تتسع وتضيق حسب التقلب. ويقيس RSI (من 0 إلى 100) سرعة الحركة: فوق 70 يعني تشبعاً شرائياً محتملاً، وتحت 30 يعني تشبعاً بيعياً محتملاً.',
          keyTakeaway: 'المؤشرات تدعم قراءتك للسعر — لا تشترِ عشوائياً لمجرد وصول RSI إلى 30.',
        },
      ],
      quiz: [
        {
          id: 'l6-q1',
          question: 'إذا كان السعر يتداول بثبات فوق متوسط SMA 20 صاعد، ما أبسط تفسير؟',
          options: ['السوق في اتجاه صاعد', 'السوق متوقف', 'يجب البيع فوراً', 'الحجم سالب'],
          explanation: 'بقاء السعر فوق متوسط متحرك صاعد علامة كلاسيكية على الزخم الصعودي.',
        },
        {
          id: 'l6-q2',
          question: 'إلى ماذا يشير وصول RSI فوق 70 تقليدياً؟',
          options: [
            'تحرك السعر صعوداً بسرعة وقد يكون متشبعاً شرائياً وقريباً من تهدئة',
            'الأصل بلا قيمة',
            'يجب استخدام رافعة 20x',
            'تضاعف السبريد',
          ],
          explanation: 'RSI فوق 70 يعكس زخماً صاعداً قوياً قد يكون ممدداً على المدى القصير.',
        },
        {
          id: 'l6-q3',
          question: 'لماذا تتسع حزم بولينجر وتضيق بمرور الوقت؟',
          options: [
            'لأنها تتفاعل مع تغيرات تقلب السوق',
            'تتغير عشوائياً كل منتصف ليل',
            'تقيس حجم النقطة فقط',
            'تعرض رصيد حسابك',
          ],
          explanation: 'تتسع الحزم عند ارتفاع التقلب وتضيق أثناء الهدوء والتماسك.',
        },
        {
          id: 'l6-q4',
          question: 'ما أذكى طريقة لاستخدام مؤشرات مثل RSI والمتوسطات المتحركة؟',
          options: [
            'إضافة ١٥ مؤشراً فوق الرسم',
            'استخدام مؤشر اتجاه + مؤشر زخم مع وقف خسارة واضح',
            'تجاهل إدارة المخاطر عند RSI < 30',
            'التداول حسب الألوان فقط',
          ],
          explanation: 'البساطة تتفوق: أداة اتجاه واحدة + أداة زخم واحدة + قاعدة مخاطرة واضحة.',
        },
      ],
    },
    'lesson-7': {
      moduleTitle: 'الوحدة ٥: المخاطرة والانضباط',
      title: 'قاعدة 1–2%، نسبة العائد للمخاطرة، وحجم الصفقة',
      summary: 'تعلّم المعادلة الأولى التي تحفظ استمرارية المتداولين — حتى لو خسروا نصف صفقاتهم.',
      sections: [
        {
          heading: 'لا تخاطر برصيدك في فكرة واحدة',
          body: 'حتى المحترفون يخسرون 40–50% من صفقاتهم. سرّهم هو الحجم: يخاطرون فقط بنسبة 1% إلى 2% من الرصيد عند تفعيل وقف الخسارة. في حساب 100,000$، المخاطرة بـ 1% تعني خسارة قصوى 1,000$ — ستحتاج ١٠٠ خسارة متتالية لتفقد الحساب!',
          keyTakeaway: 'خاطر بـ 1% أو أقل كمبتدئ. حماية رأس المال أولاً.',
        },
        {
          heading: 'نسبة المخاطرة إلى العائد (1:2 أو أفضل)',
          body: 'قبل الشراء أو البيع، قارن خسارتك المحتملة عند وقف الخسارة بربحك المستهدف عند جني الأرباح. المخاطرة بـ 500$ لربح 1,000$ هي نسبة 1:2. عند هذه النسبة تحتاج الفوز في 34% فقط من صفقاتك للتعادل!',
          keyTakeaway: 'استهدف صفقات يكون فيها الربح المحتمل ضعف المخاطرة على الأقل.',
        },
      ],
      quiz: [
        {
          id: 'l7-q1',
          question: 'في حساب 100,000$ وباستخدام قاعدة 1%، ما أقصى خسارة تسمح بها في صفقة واحدة؟',
          options: ['10,000$', '1,000$', '50,000$', '100$'],
          explanation: '1% من 100,000$ يساوي 1,000$ كحد أقصى للخسارة عند وقف الخسارة.',
        },
        {
          id: 'l7-q2',
          question: 'كل صفقة رابحة تكسب +600$ وكل خاسرة تخسر -300$ (نسبة 1:2). إذا ربحت 50% من ١٠ صفقات، ما صافي الربح؟',
          options: ['0$', '+1,500$ ربح', '-1,500$ خسارة', '+3,000$ ربح'],
          explanation: '٥ أرباح × 600$ = +3,000$؛ ٥ خسائر × -300$ = -1,500$؛ الصافي = +1,500$.',
        },
        {
          id: 'l7-q3',
          question: 'ما الخطر الخفي للرافعة المالية العالية (مثل 20x) على المبتدئين؟',
          options: [
            'تقلل الرسوم',
            'تحرك بسيط بنسبة 5% ضدك قد يمحو 100% من هامش الصفقة',
            'تعطل الشموع',
            'تعمل في الحساب التجريبي فقط',
          ],
          explanation: 'الرافعة تضاعف الخسائر كما تضاعف الأرباح: 5% × 20 = 100%.',
        },
        {
          id: 'l7-q4',
          question: 'متى يجب إبعاد وقف الخسارة أكثر أثناء صفقة خاسرة؟',
          options: [
            'كلما تمنيت ارتداد السعر',
            'أبداً — تحريك وقف الخسارة بعيداً يكسر خطتك ويحول الخسارة الصغيرة لكبيرة',
            'كل يوم جمعة',
            'عندما يتجاوز RSI قيمة 50',
          ],
          explanation: 'الالتزام بوقف الخسارة الأصلي يحمي رأس مالك ويبقي تحليلاتك دقيقة.',
        },
      ],
    },
    'lesson-8': {
      moduleTitle: 'الوحدة ٦: خطط التدريب العملي',
      title: 'استراتيجيتان للمبتدئين يمكنك تجربتهما اليوم',
      summary: 'اجمع ما تعلمته في خطتين واضحتين: الارتداد مع الاتجاه والارتداد داخل النطاق.',
      sections: [
        {
          heading: 'الخطة أ: التراجع مع الاتجاه (Trend Pullback)',
          body: '١. انتقل لإطار 1H أو 4H وشغّل SMA 20. ٢. تأكد أن السعر فوق متوسط SMA 20 صاعد. ٣. انتظر تراجعاً هادئاً نحو المتوسط بدلاً من مطاردة الشموع الخضراء الكبيرة. ٤. اشترِ مع وقف خسارة أسفل القاع الأخير وهدف ضعف المخاطرة.',
          keyTakeaway: 'اشترِ التراجعات الصحية داخل اتجاه قائم بدلاً من ملاحقة القمم.',
        },
        {
          heading: 'الخطة ب: ارتداد بولينجر + RSI في النطاق العرضي',
          body: 'عندما يتحرك زوج مثل EUR/USD جانبياً بهدوء: ١. فعّل حزم بولينجر و RSI. ٢. ابحث عن ملامسة السعر للحد السفلي مع RSI قرب 30–35 ثم شمعة انعكاس خضراء. ٣. استهدف الخط الأوسط مع وقف خسارة قريب.',
          keyTakeaway: 'راجع سجل صفقاتك بعد ١٠–٢٠ صفقة تجريبية لتعرف أي أسلوب يناسبك أكثر.',
        },
      ],
      quiz: [
        {
          id: 'l8-q1',
          question: 'في خطة التراجع مع الاتجاه، ما التوقيت الأفضل للشراء؟',
          options: [
            'بعد شمعة خضراء ضخمة بعيدة جداً عن SMA 20',
            'بعد تراجع هادئ يعيد السعر قرب متوسط SMA 20 الصاعد',
            'عندما يهبط SMA 20 بحدة',
            'بدون وقف خسارة',
          ],
          explanation: 'الدخول عند تراجع قرب الدعم/SMA 20 يمنحك وقف خسارة أقرب ونسبة عائد أفضل.',
        },
        {
          id: 'l8-q2',
          question: 'لماذا تراجع سجل الصفقات التاريخي بعد ١٠–٢٠ صفقة تجريبية؟',
          options: [
            'لقياس نسبة نجاحك الفعلية ومعرفة الصفقات التي تناسبك',
            'لأن السجل يُحذف بعد ٢٤ ساعة',
            'لمسح الصفقات الخاسرة',
            'لتغيير ألوان الرسم فقط',
          ],
          explanation: 'تحليلات أدائك تحوّل التمرين إلى مهارة قابلة للقياس.',
        },
        {
          id: 'l8-q3',
          question: 'كيف تساعدك تنبيهات الأسعار على التداول بهدوء؟',
          options: [
            'تُعلمك تلقائياً عند وصول السعر لمنطقتك المخططة دون مراقبة الشاشة طوال اليوم',
            'تفتح صفقات عشوائية',
            'تتنبأ بالأخبار',
            'تلغي السبريد',
          ],
          explanation: 'التنبيهات تتيح لك التصرف فقط عند تحقق شروط السعر التي خططت لها.',
        },
        {
          id: 'l8-q4',
          question: 'ما أفضل علامة على تقدمك في الحساب التجريبي؟',
          options: [
            'ضربة حظ واحدة بأقصى رافعة',
            'الالتزام بقواعد حجم الصفقة ووقف الخسارة بانتظام خلال ١٥–٢٠ صفقة مسجلة',
            'تعطيل أوامر الحماية',
            'الاختيار العشوائي حسب الشعار',
          ],
          explanation: 'الاتساق والانضباط عبر عينة كافية من الصفقات هما أساس المهارة الحقيقية.',
        },
      ],
    },
  },
};
```

### `src/i18n/LanguageContext.tsx`

```tsx
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {LESSONS} from '../data/curriculum';
import {INSTRUMENTS} from '../data/instruments';
import type {Lesson} from '../types/trading';
import {CURRICULUM_I18N, INSTRUMENT_NOTES_I18N} from './curriculumTranslations';
import {TRANSLATIONS} from './translations';
import {LANGUAGE_OPTIONS, type Language, type Translations} from './types';

const LANG_KEY = 'meridian_lang_v1';

interface LanguageContextValue {
  lang: Language;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  t: Translations;
  lessons: Lesson[];
  getInstrumentNote: (symbol: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'es' || saved === 'ar')) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'en';
}

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [lang, setLangState] = useState<Language>(detectInitialLang);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const t = TRANSLATIONS[lang];

  const lessons = useMemo<Lesson[]>(() => {
    if (lang === 'en') return LESSONS;
    const overlayMap = CURRICULUM_I18N[lang];
    return LESSONS.map((base) => {
      const ov = overlayMap[base.id];
      if (!ov) return base;
      return {
        ...base,
        moduleTitle: ov.moduleTitle,
        title: ov.title,
        summary: ov.summary,
        sections: ov.sections,
        quiz: base.quiz.map((q) => {
          const ovQ = ov.quiz.find((item) => item.id === q.id);
          return ovQ
            ? {
                ...q,
                question: ovQ.question,
                options: ovQ.options,
                explanation: ovQ.explanation,
              }
            : q;
        }),
      };
    });
  }, [lang]);

  const getInstrumentNote = useCallback(
    (symbol: string) => {
      if (lang !== 'en') {
        const translated = INSTRUMENT_NOTES_I18N[lang]?.[symbol];
        if (translated) return translated;
      }
      return INSTRUMENTS.find((i) => i.symbol === symbol)?.beginnerNote ?? '';
    },
    [lang]
  );

  const value = useMemo(
    () => ({lang, dir, setLang, t, lessons, getInstrumentNote}),
    [lang, dir, setLang, t, lessons, getInstrumentNote]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export {LANGUAGE_OPTIONS};
```

### `src/i18n/translations.ts`

```ts
import type {Language, Translations} from './types';

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    common: {
      brand: 'Meridian',
      language: 'Language',
      close: 'Close',
      cancel: 'Cancel',
      confirmReset: 'Confirm Reset',
      all: 'All',
      crypto: 'Crypto',
      forex: 'Forex',
      buy: 'Buy',
      sell: 'Sell',
      optional: 'Optional',
      min: 'min',
      loadingChart: 'Loading live chart data...',
      offlineNotice: 'Offline Mode — Cached lessons and saved trades remain available.',
      installApp: 'Install Meridian App',
      installIos: 'Install on iPhone / iPad',
      installIosTitle: 'Install on iOS',
      installIosStep1: "1. Tap the Share button in Safari's toolbar.",
      installIosStep2: '2. Scroll down and tap Add to Home Screen.',
      gotIt: 'Got it',
    },
    nav: {
      overview: 'Overview',
      trade: 'Trade',
      practice: 'Practice',
      academy: 'Academy',
      strategies: 'Strategies',
      alerts: 'Alerts',
      account: 'Account',
      toggleSidebar: 'Toggle sidebar',
      openMenu: 'Open navigation menu',
      paperBalance: 'Paper Equity',
    },
    drawer: {
      title: 'Account & Preferences',
      subtitle: 'Language · Paper balance · Display · Push notifications',
      displayLearning: 'Display & Learning',
      colorTheme: 'Color Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      beginnerHints: 'Beginner Explanations',
      beginnerHintsSub: 'Show plain-English tips next to metrics and orders',
      on: 'ON',
      off: 'OFF',
      pushNotifications: 'Push Notifications',
      browserStatus: 'Browser status',
      enableBrowserPush: 'Enable Browser Push',
      sendTestNotification: 'Send Test Notification',
      prefMarketAlerts: 'Price Target Alerts',
      prefOrderFills: 'Order Executions & Fills',
      prefStopTake: 'Stop-Loss & Take-Profit Exits',
      paperAccount: 'Simulated Paper Account',
      equity: 'Equity',
      paperDesc: 'Choose starting virtual cash and reset your simulated portfolio anytime. No real money is ever used.',
      resetAccountTo: 'Reset Paper Account to',
      resetWarning: 'This clears your open paper trades and trade log history. Continue?',
      resetAcademy: 'Reset Academy Quiz Progress',
    },
    overview: {
      title: 'Portfolio & Performance Overview',
      subtitle: 'Track your virtual paper account, learning progress, and historical trade analytics in one place.',
      openAcademy: 'Open Academy',
      resumeCourseBtn: 'Continue Course',
      placePracticeTrade: 'Place Practice Trade',
      quickStartTitle: 'Beginner Quick-Start Path',
      quickStartSub: 'Follow these 3 simple steps with zero real-money risk',
      step1: 'Step 01',
      step1Start: 'Start here',
      step1Done: 'completed',
      step1Title: 'Learn Trading & Take Quizzes',
      step1Desc: '4-minute lessons on spreads, candlesticks, pips, and risk rules.',
      step2: 'Step 02',
      step2Active: 'Active',
      step2Cash: '$100k Virtual Cash',
      step2Title: 'Practice on Live Charts',
      step2Desc: 'Buy or sell live Crypto & Forex pairs with Stop-Loss safety presets.',
      step3: 'Step 03',
      step3Active: 'active',
      step3Ready: 'Push Ready',
      step3Title: 'Set Market Push Alerts',
      step3Desc: 'Get notified automatically when BTC or EUR/USD reaches your target price.',
      totalEquity: 'Total Account Equity',
      overallReturn: 'overall return',
      hintEquity: 'Cash plus current value of all open trades.',
      availableCash: 'Available Virtual Cash',
      inActiveTrades: 'In active trades:',
      hintCash: 'Unused paper funds ready for new trades.',
      realizedLivePnl: 'Realized & Live P&L',
      closedLabel: 'Closed:',
      openLabel: 'Open:',
      hintPnl: 'Combined profit or loss across finished and active trades.',
      winRatePf: 'Win Rate & Profit Factor',
      hintWinRate: 'Profit Factor > 1.0 means gains exceed losses.',
      equityCurveTitle: 'Account Equity Curve',
      startingCapital: 'Starting capital:',
      dashedRef: 'dashed reference line',
      latestEquity: 'Latest Account Equity',
      equityCurveEmpty: 'Complete at least one practice trade to plot your equity curve over time.',
      avgWin: 'Avg. Winning Trade',
      avgLoss: 'Avg. Losing Trade',
      maxDrawdown: 'Max Drawdown',
      avgResultTrade: 'Avg. Result / Trade',
      strategyBreakdown: 'Strategy & Market Breakdown',
      cryptoTrades: 'Crypto Trades',
      forexTrades: 'Forex Trades',
      buyWinRate: 'Buy (Long) Win Rate',
      sellWinRate: 'Sell (Short) Win Rate',
      bestTrade: 'Best Single Trade',
      worstTrade: 'Worst Single Trade',
      activePositions: 'Active Open Positions',
      openLiveChart: 'Open Live Chart',
      market: 'Market',
      side: 'Side',
      size: 'Size',
      entryPrice: 'Entry Price',
      livePrice: 'Live Price',
      unrealizedPnl: 'Unrealized P&L',
      action: 'Action',
      closeBtn: 'Close',
      tradeLogsTitle: 'Historical Trade Logs',
      tradeLogsSub: 'Complete record of your closed paper trades, exit triggers, and net profit/loss.',
      filterSymbol: 'Filter symbol...',
      downloadCsv: 'Download CSV',
      emptyLogsTitle: 'Your trade log is empty — ready for your first practice trade',
      emptyLogsDesc: 'Every closed paper trade is automatically recorded here with entry/exit prices, fees, and performance stats.',
      goToTradingDesk: 'Go to Live Trading Desk',
      loadSampleTrades: 'Load 6 Sample Trades to Preview Analytics',
      noMatchingTrades: 'No trades match your current filter.',
      colClosed: 'Closed',
      colMarket: 'Market',
      colDirection: 'Direction',
      colTradeSize: 'Trade Size',
      colEntry: 'Entry',
      colExit: 'Exit',
      colExitType: 'Exit Type',
      colNetPnl: 'Net P&L',
      reasonManual: 'Manual',
      reasonStopLoss: 'Stop-Loss',
      reasonTakeProfit: 'Take-Profit',
      reasonLiquidation: 'Liquidation',
      missionsTitle: 'Daily Missions',
      missionsSub: 'Complete daily trading and learning tasks to earn XP and keep your streak alive.',
      missionsLevel: 'Level',
      missionsXp: 'XP',
      missionsStreak: 'Streak',
      missionsBonusLabel: 'All 4 bonus: +50 XP',
      missionsBonusUnlocked: 'All-clear bonus unlocked (+50 XP)',
      missionsCompleted: 'Completed',
      missionLongTitle: 'Execute one long trade',
      missionLongDesc: 'Open a Buy practice position on any Crypto or Forex pair.',
      missionLongCta: 'Go to Practice',
      missionRiskTitle: 'Protect with Stop-Loss / TP',
      missionRiskDesc: 'Place a practice trade with a Stop-Loss or Take-Profit.',
      missionRiskCta: 'Set Safety Exit',
      missionStrategyTitle: 'Check a strategy guide',
      missionStrategyDesc: 'Explore an animated chart setup like Head & Shoulders.',
      missionStrategyCta: 'Open Strategies',
      missionQuizTitle: 'Complete a lesson quiz',
      missionQuizDesc: 'Finish a 4-question Academy quiz to sharpen your edge.',
      missionQuizCta: 'Open Academy',
      missionToastTitle: 'Daily Mission Completed',
    },
    trade: {
      liveMarkets: 'Live Markets',
      liveApi: 'Live API',
      liveStream: 'Live Stream',
      searchMarkets: 'Search BTC, EUR/USD...',
      crypto247: '24/7 Crypto',
      forexPair: 'Forex Pair',
      plusOneAlert: '+1% Alert',
      alertSetAbove: 'Alert set above',
      simpleLine: 'Simple Line',
      candles: 'Candles',
      openPositions: 'Open Positions',
      pendingOrders: 'Pending Orders',
      recentClosed: 'Recent Closed',
      noOpenPositions: 'No open paper trades right now. Use the ticket on the right to place a practice trade.',
      noPendingOrders: 'No waiting limit orders. Open Advanced Options in the order ticket to place a Limit order.',
      noClosedTrades: 'Closed trades will appear here once you exit a position.',
      current: 'Current',
      livePnl: 'Live P&L',
      targetLimit: 'Target Limit',
      netPnl: 'Net P&L',
      practiceOrder: 'Practice Order',
      virtualCash: 'Virtual cash:',
      buyPriceUp: 'Buy (Price Up)',
      sellPriceDown: 'Sell (Price Down)',
      amountUsd: 'Amount to Trade (USD)',
      safetyExits: 'Safety Exits (Optional)',
      autoFillPreset: 'Auto-fill 1:2 (-2% / +4%)',
      stopLossLabel: 'Stop-Loss (Limit Loss)',
      takeProfitLabel: 'Take-Profit (Lock Gain)',
      ifSlHits: 'If Stop-Loss hits:',
      ifTpHits: 'If Take-Profit hits:',
      riskReward: 'Risk / Reward:',
      advancedOptions: 'Advanced Options (Limit & Leverage)',
      marketOrder: 'Market Order',
      limitOrder: 'Limit Order',
      targetEntryPrice: 'Target Entry Price',
      leverageLabel: 'Leverage (Beginners: stay at 1x)',
      marginLocked: 'Margin locked:',
      placeBuyLimit: 'Place Buy Limit',
      placeSellLimit: 'Place Sell Limit',
      buyNow: 'Buy',
      sellNow: 'Sell',
      orderPlacedBuy: 'Buy order placed on',
      orderPlacedSell: 'Sell order placed on',
      errWaitingPrice: 'Waiting for live market price. Try again in a moment.',
      errMinSize: 'Minimum practice trade size is $10.',
      errInsufficientCash: 'Not enough available cash for this trade size.',
      errInvalidLimit: 'Enter a valid Limit Price.',
      errSlBuy: 'For a Buy trade, Stop-Loss must be below the current entry price.',
      errSlSell: 'For a Sell trade, Stop-Loss must be above the current entry price.',
      errTpBuy: 'For a Buy trade, Take-Profit must be above the current entry price.',
      errTpSell: 'For a Sell trade, Take-Profit must be below the current entry price.',
    },
    academy: {
      title: 'Beginner Trading Academy',
      subtitle: 'Step-by-step lessons in plain language. Play with each simulator, take the 4-question quiz, then practice with paper cash.',
      courseProgress: 'Course Progress',
      roadmap: 'Curriculum Roadmap',
      allModules: 'All Modules',
      lessonsCount: 'Lessons',
      lessonOf: 'Lesson',
      read: 'read',
      completed: 'Completed',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      keyRule: 'Key Rule:',
      practiceOnChart: 'Practice on Live Chart:',
      nextLesson: 'Next Lesson:',
      quizTitle: 'Lesson Quiz',
      questionsWord: 'Questions',
      quizPassRule: 'Score 3 out of 4 or higher to complete this lesson.',
      bestScore: 'Best score:',
      scoreLabel: 'Score:',
      passed: 'Passed',
      tryAgain: 'Try Again',
      explanation: 'Explanation:',
      checkAnswers: 'Check Answers',
      retakeQuiz: 'Retake Quiz',
      streakLabel: 'Daily Learning Streak',
      daySingular: 'day',
      daysPlural: 'days',
      streakBest: 'Best:',
      streakActiveToday: 'Active today',
      streakStartToday: 'Study a lesson today',
      lessonProgressLabel: 'Lesson completion',
      stepLabel: 'Course',
      lockedLabel: 'Locked',
      unlockRequirement: 'Complete Course {n} to unlock',
      currentFocusLabel: 'Current Focus',
      phaseLearn: '1. Concept & Example',
      phaseLab: '2. Interactive Lab',
      phaseQuiz: '3. Quiz to Unlock',
      continueToLab: 'Continue to Interactive Lab',
      continueToQuiz: 'Continue to Unlock Quiz',
      backToConcepts: 'Back to Concepts',
      backToLab: 'Back to Interactive Lab',
      nextUnlockedBanner: 'Course completed! The next course is now unlocked.',
      continueToCourse: 'Continue to Course',
      passQuizToUnlock: 'Pass the quiz (3/4+) to unlock the next course',
      lockedToastTitle: 'Complete the previous course first',
      goToCurrentCourse: 'Go to Current Course',
      allCoursesMasteredTitle: 'Full Learning Path Completed',
      allCoursesMasteredDesc: 'You unlocked and passed every course step. Put your skills to work on live paper charts or explore visual strategies.',
      resumeStepPrefix: 'Current step:',
    },
    strategies: {
      title: 'Visual Trading Strategies',
      subtitle: 'Master classic chart patterns with animated execution walkthroughs, real Crypto & Forex trade examples, and mistake breakdowns.',
      filterAll: 'All Strategies',
      catReversal: 'Reversal',
      catContinuation: 'Trend / Continuation',
      catMomentum: 'Momentum',
      correctMode: 'Correct Execution',
      mistakeMode: 'Common Beginner Mistake',
      playBtn: 'Play',
      pauseBtn: 'Pause',
      replayBtn: 'Replay',
      scrubHint: 'Drag to inspect pattern phases',
      stepWord: 'Phase',
      realExampleTitle: 'Real Market Case Study',
      marketLabel: 'Market',
      timeframeLabel: 'Timeframe',
      entryLabel: 'Entry Trigger',
      stopLossLabel: 'Stop-Loss',
      takeProfitLabel: 'Take-Profit',
      riskRewardLabel: 'Risk : Reward',
      whyWorkedLabel: 'Why This Trade Worked',
      checklistTitle: 'Pre-Trade Confirmation Checklist',
      practiceBtn: 'Practice on Live Chart:',
      beginnerLabel: 'Beginner',
      intermediateLabel: 'Intermediate',
      bearishBias: 'Bearish Setup (Sell)',
      bullishBias: 'Bullish Setup (Buy)',
      saveToPlaybook: 'Save to Playbook',
      savedInPlaybook: 'Saved in Playbook',
      playbookSectionTitle: 'Saved Strategies',
      savedEmptyHint: 'Bookmark strategy guides to keep your go-to setups one click away.',
      browseStrategies: 'Browse strategies',
      removeBookmark: 'Remove from Playbook',
    },
    sim: {
      spreadTitle: 'Interactive Lab: See How the Spread Affects Your Trade',
      spreadSub: 'Move the sliders to see why liquid markets (smaller spread) cost less to enter.',
      tradeAmount: 'Trade Amount',
      marketSpread: 'Market Spread (%)',
      sellBid: 'Sell Price (Bid)',
      buyAsk: 'Buy Price (Ask)',
      startingCost: 'Starting Spread Cost',
      orderTitle: 'Interactive Lab: Watch Limit, Stop-Loss & Take-Profit React',
      orderSub: 'Slide the market price down to $96 to trigger a Buy Limit, then test $92 (Stop-Loss) or $108 (Take-Profit).',
      simMarketPrice: 'Simulated Market Price',
      stopLoss: 'Stop-Loss',
      buyLimit: 'Buy Limit',
      takeProfit: 'Take-Profit',
      orderWait: 'Waiting: Price is above your Limit Buy ($96). Order has not filled yet.',
      orderSlHit: 'Stop-Loss Triggered at $92! Your safety exit closed the trade to prevent larger losses.',
      orderTpHit: 'Take-Profit Reached at $108! Your gains (+12.5% from $96) are automatically locked in.',
      orderFilled: 'Limit Order Filled at $96! Position is active.',
      pipTitle: 'Interactive Lab: Forex Pip Value Explorer',
      pipSub: 'See how many dollars a pip move creates based on your position size.',
      tradeSizeUsd: 'Trade Size (USD)',
      priceMovePips: 'Price Move (Pips)',
      pipPer: 'per pip',
      candleTitle: 'Interactive Lab: Build & Read a Candlestick',
      candleSub: 'Adjust Open, Close, High, and Low to see how candles tell the story of buyer vs. seller pressure.',
      open: 'Open',
      close: 'Close',
      high: 'High',
      low: 'Low',
      candleBull: 'Bullish Candle: Buyers pushed the closing price higher than the opening price.',
      candleBear: 'Bearish Candle: Sellers pushed the closing price lower than the opening price.',
      candleHammer: 'Long Lower Wick (Hammer-style): Sellers tried to push price down, but buyers rejected the low strongly.',
      candleShooting: 'Long Upper Wick (Rejection): Buyers pushed up early, then sellers stepped in near the highs.',
      sizerTitle: 'Interactive Lab: Safe Position Size Calculator (1–2% Rule)',
      sizerSub: 'Calculate the exact dollar size to trade so a Stop-Loss hit never hurts your account badly.',
      account: 'Account',
      maxRiskPct: 'Max Risk %',
      slDistance: 'Stop-Loss Distance',
      recommendedSize: 'Recommended Trade Size',
      maxLossAtSl: 'Max Loss at Stop-Loss',
      targetGain2R: 'Target Gain (1:2 R:R)',
      rsiTitle: 'Interactive Lab: RSI Momentum Gauge (0–100)',
      rsiSub: 'Slide RSI across 30 and 70 to see how traders spot stretched moves.',
      currentRsi: 'Current RSI(14)',
      oversold: '30 (Oversold)',
      midline: '50 (Midline)',
      overbought: '70 (Overbought)',
      rsiNeutral: 'Neutral Momentum (30–70): Normal trend conditions — look at price vs. Moving Averages.',
      rsiOverbought: 'Overbought (RSI ≥ 70): Price surged fast. Chasing a Buy right here carries pullback risk.',
      rsiOversold: 'Oversold (RSI ≤ 30): Heavy selling recently. Watch for a green reversal candle before buying.',
    },
    alerts: {
      title: 'Market Alerts & Push Notifications',
      subtitle: 'Get instant push notifications when live prices hit your target or when a paper trade closes.',
      enablePushBtn: 'Enable Browser Push Alerts',
      testBtn: 'Test Notification',
      pushDelivery: 'Push Delivery:',
      statusGranted: 'Browser push notifications are enabled alongside in-app alerts.',
      statusDenied: 'Browser notifications are blocked in site settings — in-app toast & feed alerts remain active.',
      statusDefault: 'Click "Enable Browser Push Alerts" to receive OS-level notifications, or use the live feed below.',
      priceTargets: 'Price Targets',
      orderFills: 'Order Fills',
      slTpExits: 'SL / TP Exits',
      createTitle: 'Create a Price Alert',
      marketPair: 'Market Pair',
      currentPrice: 'Current price:',
      notifyWhenPrice: 'Notify When Price',
      risesAbove: 'Rises Above (≥)',
      dropsBelow: 'Drops Below (≤)',
      targetPrice: 'Target Price',
      noteLabel: 'Personal Reminder Note (Optional)',
      notePlaceholder: 'e.g., Check 1H pullback setup',
      recurringLabel: 'Keep alert active after triggering (1-minute cooldown)',
      createBtn: 'Create Price Alert',
      yourAlerts: 'Your Price Alerts',
      noAlerts: 'No price alerts created yet. Add one above to watch a market automatically.',
      watchingLive: 'Watching live',
      triggeredPaused: 'Triggered / Paused',
      away: 'away',
      feedTitle: 'Notification Feed',
      feedSub: 'Real-time log of triggered market alerts and portfolio trade updates.',
      markRead: 'Mark Read',
      clear: 'Clear',
      noNotifications: 'No notifications yet. Place a practice trade, create a price alert, or click "Test Notification" above.',
      catMarket: 'Market Alert',
      catPortfolio: 'Portfolio Update',
      catLearning: 'Learning',
      newBadge: 'New',
      quickChartNote: 'Quick chart alert',
    },
    notifications: {
      alertsActiveTitle: 'Meridian Alerts Active',
      alertsActiveBody: 'You will now receive push alerts for price targets and paper trade updates.',
      testTitle: 'Test Push Notification',
      testBody: 'Market alerts and portfolio updates are configured and working.',
      priceAlertTitle: 'Price Alert Triggered',
      crossedAbove: 'crossed above',
      droppedBelow: 'dropped below',
      now: 'Now',
      tpReached: 'Take-Profit Reached',
      slTriggered: 'Stop-Loss Triggered',
      liquidated: 'Position Liquidated',
      closedAt: 'Closed',
      limitFilled: 'Limit Order Filled',
      bought: 'Bought',
      sold: 'Sold',
      limitPlaced: 'Limit Order Placed',
      queuedAt: 'queued at',
      orderExecuted: 'Executed',
      openedAt: 'Opened',
      positionClosed: 'Position Closed',
      exitedAt: 'Exited at',
      quizPassedTitle: 'Lesson Quiz Passed',
      quizPassedBody: 'You unlocked progress in the Trading Academy.',
    },
    achievements: {
      sectionTitle: 'Milestones & Achievements',
      sectionSub: 'Earn milestone badges as you complete courses, build streaks, and practice disciplined trades.',
      unlockedCountLabel: 'Unlocked',
      badgeUnlocked: 'Earned',
      badgeLocked: 'Locked',
      toastTitle: 'Achievement Unlocked',
      firstTradeTitle: 'First Trade',
      firstTradeDesc: 'Place your first practice order on Crypto or Forex.',
      perfectQuizTitle: 'Perfect Quiz Score',
      perfectQuizDesc: 'Score 4/4 on any Academy course quiz.',
      streak7Title: '7-Day Learning Streak',
      streak7Desc: 'Study or practice for 7 consecutive days.',
      riskProtectorTitle: 'Risk Protector',
      riskProtectorDesc: 'Attach a Stop-Loss or Take-Profit to a trade.',
      playbookCollectorTitle: 'Playbook Curator',
      playbookCollectorDesc: 'Save at least 2 strategies to your Trading Playbook.',
      courseGraduateTitle: 'Course Graduate',
      courseGraduateDesc: 'Unlock and complete all 8 sequential courses.',
    },
    leaderboard: {
      title: 'XP Leaderboard',
      yourRank: 'Your Rank',
      selfDefaultName: 'You',
      editName: 'Edit name',
      saveName: 'Save',
      lessonsShort: 'Lessons',
      missionsShort: 'Missions',
      xpToNext: 'XP to rank',
      topRankReached: 'Top of the leaderboard!',
      showAll: 'Show all',
      showCompact: 'Top & you',
      levelPrefix: 'Lv.',
    },
  },

  fr: {
    common: {
      brand: 'Meridian',
      language: 'Langue',
      close: 'Fermer',
      cancel: 'Annuler',
      confirmReset: 'Confirmer la réinitialisation',
      all: 'Tout',
      crypto: 'Crypto',
      forex: 'Forex',
      buy: 'Acheter',
      sell: 'Vendre',
      optional: 'Optionnel',
      min: 'min',
      loadingChart: 'Chargement du graphique en direct...',
      offlineNotice: 'Mode hors ligne — Les leçons en cache et vos trades enregistrés restent accessibles.',
      installApp: 'Installer Meridian',
      installIos: 'Installer sur iPhone / iPad',
      installIosTitle: 'Installer sur iOS',
      installIosStep1: '1. Touchez le bouton Partager dans la barre Safari.',
      installIosStep2: "2. Faites défiler et touchez Sur l'écran d'accueil.",
      gotIt: 'Compris',
    },
    nav: {
      overview: 'Aperçu',
      trade: 'Trader',
      practice: 'Pratique',
      academy: 'Académie',
      strategies: 'Stratégies',
      alerts: 'Alertes',
      account: 'Compte',
      toggleSidebar: 'Réduire le menu',
      openMenu: 'Ouvrir le menu',
      paperBalance: 'Capital virtuel',
    },
    drawer: {
      title: 'Compte & Préférences',
      subtitle: 'Langue · Solde virtuel · Affichage · Notifications push',
      displayLearning: 'Affichage & Apprentissage',
      colorTheme: 'Thème visuel',
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      beginnerHints: 'Explications débutant',
      beginnerHintsSub: 'Afficher des conseils simples à côté des indicateurs et ordres',
      on: 'ACTIVÉ',
      off: 'DÉSACTIVÉ',
      pushNotifications: 'Notifications push',
      browserStatus: 'Statut navigateur',
      enableBrowserPush: 'Activer les push navigateur',
      sendTestNotification: 'Envoyer un test',
      prefMarketAlerts: 'Alertes de prix cible',
      prefOrderFills: 'Exécutions d’ordres',
      prefStopTake: 'Sorties Stop-Loss & Take-Profit',
      paperAccount: 'Compte virtuel simulé',
      equity: 'Capital',
      paperDesc: 'Choisissez le capital virtuel de départ et réinitialisez à tout moment. Aucun argent réel utilisé.',
      resetAccountTo: 'Réinitialiser le compte à',
      resetWarning: 'Cela effacera vos positions ouvertes et l’historique des trades. Continuer ?',
      resetAcademy: 'Réinitialiser la progression des quiz',
    },
    overview: {
      title: 'Portefeuille & Performance',
      subtitle: 'Suivez votre solde virtuel, votre progression et vos statistiques de trading en un seul endroit.',
      openAcademy: 'Ouvrir l’Académie',
      resumeCourseBtn: 'Continuer le cours',
      placePracticeTrade: 'Passer un ordre virtuel',
      quickStartTitle: 'Parcours rapide débutant',
      quickStartSub: 'Suivez ces 3 étapes simples sans aucun risque financier',
      step1: 'Étape 01',
      step1Start: 'Commencer ici',
      step1Done: 'terminée(s)',
      step1Title: 'Apprendre & passer les quiz',
      step1Desc: 'Leçons de 4 minutes sur le spread, les bougies, les pips et le risque.',
      step2: 'Étape 02',
      step2Active: 'Actif',
      step2Cash: '100 000 $ virtuels',
      step2Title: 'S’entraîner sur graphiques réels',
      step2Desc: 'Achetez ou vendez Crypto & Forex avec des protections Stop-Loss.',
      step3: 'Étape 03',
      step3Active: 'active(s)',
      step3Ready: 'Push prêt',
      step3Title: 'Créer des alertes de marché',
      step3Desc: 'Soyez notifié automatiquement quand BTC ou EUR/USD atteint votre objectif.',
      totalEquity: 'Capital total du compte',
      overallReturn: 'rendement global',
      hintEquity: 'Solde disponible plus valeur actuelle des positions ouvertes.',
      availableCash: 'Liquidités virtuelles',
      inActiveTrades: 'Engagé en cours :',
      hintCash: 'Fonds virtuels disponibles pour de nouveaux trades.',
      realizedLivePnl: 'Gains/Pertes réalisés & latents',
      closedLabel: 'Clôturés :',
      openLabel: 'Ouverts :',
      hintPnl: 'Total des profits ou pertes sur trades clôturés et actifs.',
      winRatePf: 'Taux de réussite & Facteur de profit',
      hintWinRate: 'Un facteur de profit > 1,0 signifie que les gains dépassent les pertes.',
      equityCurveTitle: 'Courbe de capital',
      startingCapital: 'Capital initial :',
      dashedRef: 'ligne de référence pointillée',
      latestEquity: 'Dernier capital total',
      equityCurveEmpty: 'Clôturez au moins un trade virtuel pour tracer votre courbe de performance.',
      avgWin: 'Gain moyen',
      avgLoss: 'Perte moyenne',
      maxDrawdown: 'Perte maximale (Drawdown)',
      avgResultTrade: 'Résultat moyen / trade',
      strategyBreakdown: 'Répartition par marché',
      cryptoTrades: 'Trades Crypto',
      forexTrades: 'Trades Forex',
      buyWinRate: 'Réussite à l’achat (Long)',
      sellWinRate: 'Réussite à la vente (Short)',
      bestTrade: 'Meilleur trade',
      worstTrade: 'Pire trade',
      activePositions: 'Positions ouvertes',
      openLiveChart: 'Voir le graphique',
      market: 'Marché',
      side: 'Sens',
      size: 'Taille',
      entryPrice: 'Prix d’entrée',
      livePrice: 'Prix actuel',
      unrealizedPnl: 'P&L latent',
      action: 'Action',
      closeBtn: 'Clôturer',
      tradeLogsTitle: 'Historique complet des trades',
      tradeLogsSub: 'Journal détaillé de vos trades clôturés, types de sortie et résultat net.',
      filterSymbol: 'Filtrer paire...',
      downloadCsv: 'Télécharger CSV',
      emptyLogsTitle: 'Votre journal est vide — prêt pour votre premier essai',
      emptyLogsDesc: 'Chaque trade virtuel clôturé est enregistré ici avec ses prix d’entrée/sortie et statistiques.',
      goToTradingDesk: 'Aller au terminal de trading',
      loadSampleTrades: 'Charger 6 trades exemples pour voir les stats',
      noMatchingTrades: 'Aucun trade ne correspond à ce filtre.',
      colClosed: 'Clôturé',
      colMarket: 'Marché',
      colDirection: 'Direction',
      colTradeSize: 'Montant',
      colEntry: 'Entrée',
      colExit: 'Sortie',
      colExitType: 'Type de sortie',
      colNetPnl: 'P&L net',
      reasonManual: 'Manuel',
      reasonStopLoss: 'Stop-Loss',
      reasonTakeProfit: 'Take-Profit',
      reasonLiquidation: 'Liquidation',
      missionsTitle: 'Missions du jour',
      missionsSub: 'Accomplissez vos tâches quotidiennes pour gagner de l’XP et prolonger votre série.',
      missionsLevel: 'Niveau',
      missionsXp: 'XP',
      missionsStreak: 'Série',
      missionsBonusLabel: 'Bonus 4/4 : +50 XP',
      missionsBonusUnlocked: 'Bonus complet débloqué (+50 XP)',
      missionsCompleted: 'Accomplie',
      missionLongTitle: 'Exécuter un achat (Long)',
      missionLongDesc: 'Ouvrez une position d’achat virtuelle sur Crypto ou Forex.',
      missionLongCta: 'Aller en Pratique',
      missionRiskTitle: 'Protéger avec Stop-Loss / TP',
      missionRiskDesc: 'Placez un ordre avec Stop-Loss ou Take-Profit défini.',
      missionRiskCta: 'Configurer la sécurité',
      missionStrategyTitle: 'Consulter un guide Stratégie',
      missionStrategyDesc: 'Étudiez une figure animée comme Épaule-Tête-Épaule.',
      missionStrategyCta: 'Ouvrir Stratégies',
      missionQuizTitle: 'Répondre à un quiz',
      missionQuizDesc: 'Complétez un quiz de 4 questions dans l’Académie.',
      missionQuizCta: 'Ouvrir l’Académie',
      missionToastTitle: 'Mission du jour accomplie',
    },
    trade: {
      liveMarkets: 'Marchés en direct',
      liveApi: 'API en direct',
      liveStream: 'Flux direct',
      searchMarkets: 'Chercher BTC, EUR/USD...',
      crypto247: 'Crypto 24/7',
      forexPair: 'Paire Forex',
      plusOneAlert: 'Alerte +1%',
      alertSetAbove: 'Alerte définie au-dessus de',
      simpleLine: 'Ligne simple',
      candles: 'Bougies',
      openPositions: 'Positions ouvertes',
      pendingOrders: 'Ordres en attente',
      recentClosed: 'Clôturés récents',
      noOpenPositions: 'Aucune position ouverte. Utilisez le panneau à droite pour passer un ordre virtuel.',
      noPendingOrders: 'Aucun ordre limite en attente. Ouvrez les Options avancées pour placer un ordre Limite.',
      noClosedTrades: 'Vos trades clôturés apparaîtront ici dès que vous sortez d’une position.',
      current: 'Actuel',
      livePnl: 'P&L direct',
      targetLimit: 'Limite cible',
      netPnl: 'P&L net',
      practiceOrder: 'Ordre virtuel',
      virtualCash: 'Solde disponible :',
      buyPriceUp: 'Acheter (Hausse)',
      sellPriceDown: 'Vendre (Baisse)',
      amountUsd: 'Montant du trade (USD)',
      safetyExits: 'Sorties automatiques (Optionnel)',
      autoFillPreset: 'Auto 1:2 (-2% / +4%)',
      stopLossLabel: 'Stop-Loss (Limiter la perte)',
      takeProfitLabel: 'Take-Profit (Prendre le gain)',
      ifSlHits: 'Si Stop-Loss touché :',
      ifTpHits: 'Si Take-Profit touché :',
      riskReward: 'Risque / Rendement :',
      advancedOptions: 'Options avancées (Limite & Levier)',
      marketOrder: 'Ordre au marché',
      limitOrder: 'Ordre limite',
      targetEntryPrice: 'Prix d’entrée souhaité',
      leverageLabel: 'Effet de levier (Débutants : rester à 1x)',
      marginLocked: 'Marge bloquée :',
      placeBuyLimit: 'Placer achat limite',
      placeSellLimit: 'Placer vente limite',
      buyNow: 'Acheter',
      sellNow: 'Vendre',
      orderPlacedBuy: 'Ordre d’achat exécuté sur',
      orderPlacedSell: 'Ordre de vente exécuté sur',
      errWaitingPrice: 'En attente du prix en direct. Réessayez dans un instant.',
      errMinSize: 'Le montant minimum est de 10 $.',
      errInsufficientCash: 'Liquidités insuffisantes pour ce montant.',
      errInvalidLimit: 'Veuillez saisir un prix limite valide.',
      errSlBuy: 'Pour un achat, le Stop-Loss doit être sous le prix d’entrée.',
      errSlSell: 'Pour une vente, le Stop-Loss doit être au-dessus du prix d’entrée.',
      errTpBuy: 'Pour un achat, le Take-Profit doit être au-dessus du prix d’entrée.',
      errTpSell: 'Pour une vente, le Take-Profit doit être sous le prix d’entrée.',
    },
    academy: {
      title: 'Académie de Trading Débutant',
      subtitle: 'Des leçons claires sans jargon inutile. Testez chaque simulateur, répondez au quiz, puis pratiquez en virtuel.',
      courseProgress: 'Progression du cours',
      roadmap: 'Programme des leçons',
      allModules: 'Tous les modules',
      lessonsCount: 'Leçons',
      lessonOf: 'Leçon',
      read: 'de lecture',
      completed: 'Terminée',
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      keyRule: 'Règle clé :',
      practiceOnChart: 'Pratiquer sur le graphique :',
      nextLesson: 'Leçon suivante :',
      quizTitle: 'Quiz de la leçon',
      questionsWord: 'Questions',
      quizPassRule: 'Obtenez 3 bonnes réponses sur 4 ou plus pour valider cette leçon.',
      bestScore: 'Meilleur score :',
      scoreLabel: 'Score :',
      passed: 'Réussi',
      tryAgain: 'Réessayer',
      explanation: 'Explication :',
      checkAnswers: 'Vérifier les réponses',
      retakeQuiz: 'Refaire le quiz',
      streakLabel: 'Série d’apprentissage',
      daySingular: 'jour',
      daysPlural: 'jours',
      streakBest: 'Record :',
      streakActiveToday: 'Actif aujourd’hui',
      streakStartToday: 'Étudiez une leçon aujourd’hui',
      lessonProgressLabel: 'Progression de la leçon',
      stepLabel: 'Cours',
      lockedLabel: 'Verrouillé',
      unlockRequirement: 'Terminez le cours {n} pour débloquer',
      currentFocusLabel: 'Étape actuelle',
      phaseLearn: '1. Concept & Exemple',
      phaseLab: '2. Atelier interactif',
      phaseQuiz: '3. Quiz de validation',
      continueToLab: 'Passer à l’atelier interactif',
      continueToQuiz: 'Passer au quiz de validation',
      backToConcepts: 'Retour aux concepts',
      backToLab: 'Retour à l’atelier',
      nextUnlockedBanner: 'Cours terminé ! Le cours suivant est maintenant débloqué.',
      continueToCourse: 'Continuer vers le cours',
      passQuizToUnlock: 'Réussissez le quiz (3/4+) pour débloquer le cours suivant',
      lockedToastTitle: 'Terminez d’abord le cours précédent',
      goToCurrentCourse: 'Aller au cours actuel',
      allCoursesMasteredTitle: 'Parcours complet terminé',
      allCoursesMasteredDesc: 'Vous avez débloqué et réussi toutes les étapes du cours. Entraînez-vous sur les graphiques en direct ou explorez les stratégies.',
      resumeStepPrefix: 'Étape en cours :',
    },
    strategies: {
      title: 'Stratégies de Trading Visuelles',
      subtitle: 'Maîtrisez les figures chartistes classiques grâce aux animations pas-à-pas, exemples réels Crypto & Forex et pièges à éviter.',
      filterAll: 'Toutes',
      catReversal: 'Retournement',
      catContinuation: 'Tendance / Continuation',
      catMomentum: 'Momentum',
      correctMode: 'Exécution correcte',
      mistakeMode: 'Erreur fréquente',
      playBtn: 'Lire',
      pauseBtn: 'Pause',
      replayBtn: 'Rejouer',
      scrubHint: 'Glisser pour inspecter chaque phase',
      stepWord: 'Phase',
      realExampleTitle: 'Cas réel de marché',
      marketLabel: 'Marché',
      timeframeLabel: 'Unité de temps',
      entryLabel: 'Signal d’entrée',
      stopLossLabel: 'Stop-Loss',
      takeProfitLabel: 'Take-Profit',
      riskRewardLabel: 'Risque : Gain',
      whyWorkedLabel: 'Pourquoi ce trade a fonctionné',
      checklistTitle: 'Checklist avant d’entrer en position',
      practiceBtn: 'Pratiquer sur le graphique :',
      beginnerLabel: 'Débutant',
      intermediateLabel: 'Intermédiaire',
      bearishBias: 'Baissier (Vente)',
      bullishBias: 'Haussier (Achat)',
      saveToPlaybook: 'Enregistrer',
      savedInPlaybook: 'Enregistrée',
      playbookSectionTitle: 'Stratégies enregistrées',
      savedEmptyHint: 'Ajoutez vos figures favorites pour les retrouver en un clic.',
      browseStrategies: 'Voir les stratégies',
      removeBookmark: 'Retirer des favoris',
    },
    sim: {
      spreadTitle: 'Atelier interactif : L’impact du Spread sur votre trade',
      spreadSub: 'Déplacez les curseurs pour voir pourquoi un petit spread réduit vos frais d’entrée.',
      tradeAmount: 'Montant du trade',
      marketSpread: 'Spread du marché (%)',
      sellBid: 'Prix de vente (Bid)',
      buyAsk: 'Prix d’achat (Ask)',
      startingCost: 'Coût initial du spread',
      orderTitle: 'Atelier interactif : Ordre Limite, Stop-Loss & Take-Profit',
      orderSub: 'Faites glisser le prix vers 96 $ pour déclencher l’achat limite, puis testez 92 $ ou 108 $.',
      simMarketPrice: 'Prix simulé du marché',
      stopLoss: 'Stop-Loss',
      buyLimit: 'Achat Limite',
      takeProfit: 'Take-Profit',
      orderWait: 'En attente : le prix est au-dessus de votre ordre limite (96 $).',
      orderSlHit: 'Stop-Loss déclenché à 92 $ ! Votre sécurité a clôturé la position pour limiter la perte.',
      orderTpHit: 'Take-Profit atteint à 108 $ ! Vos gains (+12,5 % depuis 96 $) sont sécurisés.',
      orderFilled: 'Ordre limite exécuté à 96 $ ! Position active.',
      pipTitle: 'Atelier interactif : Calculateur de valeur du Pip Forex',
      pipSub: 'Découvrez combien vaut un mouvement en pips selon la taille de votre position.',
      tradeSizeUsd: 'Taille du trade (USD)',
      priceMovePips: 'Mouvement (Pips)',
      pipPer: 'par pip',
      candleTitle: 'Atelier interactif : Construire et lire une bougie',
      candleSub: 'Ajustez Ouverture, Clôture, Plus Haut et Plus Bas pour voir la lutte acheteurs/vendeurs.',
      open: 'Ouverture',
      close: 'Clôture',
      high: 'Plus haut',
      low: 'Plus bas',
      candleBull: 'Bougie haussière : les acheteurs ont clôturé plus haut que l’ouverture.',
      candleBear: 'Bougie baissière : les vendeurs ont clôturé plus bas que l’ouverture.',
      candleHammer: 'Longue mèche basse : forte réaction acheteuse après une baisse.',
      candleShooting: 'Longue mèche haute : les vendeurs ont repoussé le prix depuis les sommets.',
      sizerTitle: 'Atelier interactif : Calculateur de taille sûre (Règle 1–2 %)',
      sizerSub: 'Calculez la taille idéale pour qu’un Stop-Loss ne mette jamais votre compte en danger.',
      account: 'Capital',
      maxRiskPct: 'Risque max %',
      slDistance: 'Distance Stop-Loss',
      recommendedSize: 'Taille recommandée',
      maxLossAtSl: 'Perte max au Stop',
      targetGain2R: 'Gain visé (Ratio 1:2)',
      rsiTitle: 'Atelier interactif : Jauge de momentum RSI (0–100)',
      rsiSub: 'Glissez le RSI sous 30 ou au-dessus de 70 pour repérer les excès.',
      currentRsi: 'RSI(14) actuel',
      oversold: '30 (Survendu)',
      midline: '50 (Neutre)',
      overbought: '70 (Suracheté)',
      rsiNeutral: 'Zone neutre (30–70) : tendance normale — observez les moyennes mobiles.',
      rsiOverbought: 'Suracheté (RSI ≥ 70) : hausse rapide. Acheter ici comporte un risque de repli.',
      rsiOversold: 'Survendu (RSI ≤ 30) : forte baisse récente. Attendez une bougie verte de rebond.',
    },
    alerts: {
      title: 'Alertes de marché & Notifications push',
      subtitle: 'Recevez des notifications instantanées lorsqu’un prix cible est atteint ou qu’un trade se clôture.',
      enablePushBtn: 'Activer les alertes push',
      testBtn: 'Tester une notification',
      pushDelivery: 'Statut Push :',
      statusGranted: 'Les notifications navigateur sont activées avec le fil d’alertes intégré.',
      statusDenied: 'Notifications bloquées par le navigateur — les alertes intégrées restent actives.',
      statusDefault: 'Cliquez sur « Activer les alertes push » pour recevoir des notifications système.',
      priceTargets: 'Prix cibles',
      orderFills: 'Ordres exécutés',
      slTpExits: 'Sorties SL / TP',
      createTitle: 'Créer une alerte de prix',
      marketPair: 'Paire de marché',
      currentPrice: 'Prix actuel :',
      notifyWhenPrice: 'Notifier quand le prix',
      risesAbove: 'Dépasse (≥)',
      dropsBelow: 'Passe sous (≤)',
      targetPrice: 'Prix cible',
      noteLabel: 'Note personnelle (Optionnel)',
      notePlaceholder: 'ex. Vérifier repli sur 1H',
      recurringLabel: 'Garder l’alerte active après déclenchement (pause 1 min)',
      createBtn: 'Créer l’alerte',
      yourAlerts: 'Vos alertes de prix',
      noAlerts: 'Aucune alerte créée. Ajoutez-en une ci-dessus pour surveiller un marché.',
      watchingLive: 'Surveillance active',
      triggeredPaused: 'Déclenchée / En pause',
      away: 'd’écart',
      feedTitle: 'Journal des notifications',
      feedSub: 'Historique en direct des alertes de prix et mises à jour de portefeuille.',
      markRead: 'Tout marquer lu',
      clear: 'Effacer',
      noNotifications: 'Aucune notification pour le moment. Passez un ordre virtuel ou testez une alerte.',
      catMarket: 'Alerte marché',
      catPortfolio: 'Mise à jour portefeuille',
      catLearning: 'Académie',
      newBadge: 'Nouveau',
      quickChartNote: 'Alerte rapide graphique',
    },
    notifications: {
      alertsActiveTitle: 'Alertes Meridian activées',
      alertsActiveBody: 'Vous recevrez désormais des alertes push pour vos objectifs de prix et trades virtuels.',
      testTitle: 'Notification test',
      testBody: 'Les alertes marché et mises à jour de portefeuille fonctionnent correctement.',
      priceAlertTitle: 'Alerte de prix déclenchée',
      crossedAbove: 'a dépassé',
      droppedBelow: 'est passé sous',
      now: 'Actuel',
      tpReached: 'Take-Profit atteint',
      slTriggered: 'Stop-Loss déclenché',
      liquidated: 'Position liquidée',
      closedAt: 'Clôturé',
      limitFilled: 'Ordre limite exécuté',
      bought: 'Achat de',
      sold: 'Vente de',
      limitPlaced: 'Ordre limite placé',
      queuedAt: 'en attente à',
      orderExecuted: 'Exécuté',
      openedAt: 'Ouvert',
      positionClosed: 'Position clôturée',
      exitedAt: 'Sortie à',
      quizPassedTitle: 'Quiz réussi',
      quizPassedBody: 'Votre progression dans l’Académie a été enregistrée.',
    },
    achievements: {
      sectionTitle: 'Succès & Badges',
      sectionSub: 'Débloquez des badges en terminant vos cours, en gardant votre série et en protégeant vos trades.',
      unlockedCountLabel: 'Débloqués',
      badgeUnlocked: 'Obtenu',
      badgeLocked: 'Verrouillé',
      toastTitle: 'Nouveau badge débloqué',
      firstTradeTitle: 'Premier trade',
      firstTradeDesc: 'Placez votre premier ordre virtuel sur Crypto ou Forex.',
      perfectQuizTitle: 'Score parfait au quiz',
      perfectQuizDesc: 'Obtenez 4/4 à un quiz de l’Académie.',
      streak7Title: 'Série de 7 jours',
      streak7Desc: 'Apprenez ou pratiquez 7 jours consécutifs.',
      riskProtectorTitle: 'Gardien du risque',
      riskProtectorDesc: 'Ajoutez un Stop-Loss ou Take-Profit à une position.',
      playbookCollectorTitle: 'Collectionneur de setups',
      playbookCollectorDesc: 'Enregistrez au moins 2 stratégies dans vos favoris.',
      courseGraduateTitle: 'Diplômé du parcours',
      courseGraduateDesc: 'Débloquez et réussissez les 8 cours du programme.',
    },
    leaderboard: {
      title: 'Classement XP',
      yourRank: 'Votre rang',
      selfDefaultName: 'Vous',
      editName: 'Modifier le nom',
      saveName: 'OK',
      lessonsShort: 'Cours',
      missionsShort: 'Missions',
      xpToNext: 'XP pour rang',
      topRankReached: 'N° 1 du classement !',
      showAll: 'Tout voir',
      showCompact: 'Top & vous',
      levelPrefix: 'Niv.',
    },
  },

  es: {
    common: {
      brand: 'Meridian',
      language: 'Idioma',
      close: 'Cerrar',
      cancel: 'Cancelar',
      confirmReset: 'Confirmar reinicio',
      all: 'Todo',
      crypto: 'Cripto',
      forex: 'Forex',
      buy: 'Comprar',
      sell: 'Vender',
      optional: 'Opcional',
      min: 'min',
      loadingChart: 'Cargando gráfico en vivo...',
      offlineNotice: 'Modo sin conexión — Las lecciones guardadas y tus operaciones siguen disponibles.',
      installApp: 'Instalar Meridian',
      installIos: 'Instalar en iPhone / iPad',
      installIosTitle: 'Instalar en iOS',
      installIosStep1: '1. Toca el botón Compartir en la barra de Safari.',
      installIosStep2: '2. Desplázate y toca Añadir a pantalla de inicio.',
      gotIt: 'Entendido',
    },
    nav: {
      overview: 'Resumen',
      trade: 'Operar',
      practice: 'Práctica',
      academy: 'Academia',
      strategies: 'Estrategias',
      alerts: 'Alertas',
      account: 'Cuenta',
      toggleSidebar: 'Contraer menú',
      openMenu: 'Abrir menú',
      paperBalance: 'Capital virtual',
    },
    drawer: {
      title: 'Cuenta y Preferencias',
      subtitle: 'Idioma · Saldo virtual · Pantalla · Notificaciones push',
      displayLearning: 'Pantalla y Aprendizaje',
      colorTheme: 'Tema de color',
      darkMode: 'Modo oscuro',
      lightMode: 'Modo claro',
      beginnerHints: 'Explicaciones para principiantes',
      beginnerHintsSub: 'Mostrar consejos sencillos junto a métricas y órdenes',
      on: 'ACTIVADO',
      off: 'DESACTIVADO',
      pushNotifications: 'Notificaciones push',
      browserStatus: 'Estado del navegador',
      enableBrowserPush: 'Activar push del navegador',
      sendTestNotification: 'Enviar prueba',
      prefMarketAlerts: 'Alertas de precio objetivo',
      prefOrderFills: 'Ejecuciones de órdenes',
      prefStopTake: 'Salidas Stop-Loss y Take-Profit',
      paperAccount: 'Cuenta de práctica simulada',
      equity: 'Capital',
      paperDesc: 'Elige tu saldo virtual inicial y reinicia tu portafolio cuando quieras. Nunca se usa dinero real.',
      resetAccountTo: 'Reiniciar cuenta a',
      resetWarning: 'Esto borrará tus operaciones abiertas y el historial. ¿Continuar?',
      resetAcademy: 'Reiniciar progreso de cuestionarios',
    },
    overview: {
      title: 'Resumen de Portafolio y Rendimiento',
      subtitle: 'Controla tu saldo virtual, progreso educativo y estadísticas históricas en un solo lugar.',
      openAcademy: 'Abrir Academia',
      resumeCourseBtn: 'Continuar curso',
      placePracticeTrade: 'Nueva operación virtual',
      quickStartTitle: 'Ruta rápida para principiantes',
      quickStartSub: 'Sigue estos 3 pasos simples sin arriesgar dinero real',
      step1: 'Paso 01',
      step1Start: 'Empieza aquí',
      step1Done: 'completada(s)',
      step1Title: 'Aprende y haz cuestionarios',
      step1Desc: 'Lecciones de 4 minutos sobre spread, velas, pips y gestión de riesgo.',
      step2: 'Paso 02',
      step2Active: 'Activo',
      step2Cash: '$100k virtuales',
      step2Title: 'Practica en gráficos en vivo',
      step2Desc: 'Compra o vende pares Cripto y Forex con límites Stop-Loss automáticos.',
      step3: 'Paso 03',
      step3Active: 'activa(s)',
      step3Ready: 'Push listo',
      step3Title: 'Configura alertas de precio',
      step3Desc: 'Recibe avisos automáticos cuando BTC o EUR/USD alcance tu precio objetivo.',
      totalEquity: 'Capital total de la cuenta',
      overallReturn: 'rendimiento total',
      hintEquity: 'Efectivo disponible más valor actual de posiciones abiertas.',
      availableCash: 'Efectivo virtual disponible',
      inActiveTrades: 'En operaciones activas:',
      hintCash: 'Fondos simulados listos para nuevas operaciones.',
      realizedLivePnl: 'G/P realizado y en vivo',
      closedLabel: 'Cerradas:',
      openLabel: 'Abiertas:',
      hintPnl: 'Ganancia o pérdida combinada en operaciones cerradas y activas.',
      winRatePf: 'Tasa de acierto y Factor de beneficio',
      hintWinRate: 'Un Factor > 1.0 significa que tus ganancias superan a tus pérdidas.',
      equityCurveTitle: 'Curva de capital',
      startingCapital: 'Capital inicial:',
      dashedRef: 'línea punteada de referencia',
      latestEquity: 'Capital actual',
      equityCurveEmpty: 'Completa al menos una operación simulada para ver tu curva de capital.',
      avgWin: 'Ganancia media',
      avgLoss: 'Pérdida media',
      maxDrawdown: 'Caída máxima (Drawdown)',
      avgResultTrade: 'Resultado medio / operación',
      strategyBreakdown: 'Desglose por mercado',
      cryptoTrades: 'Operaciones Cripto',
      forexTrades: 'Operaciones Forex',
      buyWinRate: 'Acierto en Compra (Long)',
      sellWinRate: 'Acierto en Venta (Short)',
      bestTrade: 'Mejor operación',
      worstTrade: 'Peor operación',
      activePositions: 'Posiciones abiertas',
      openLiveChart: 'Ver gráfico en vivo',
      market: 'Mercado',
      side: 'Lado',
      size: 'Tamaño',
      entryPrice: 'Precio de entrada',
      livePrice: 'Precio actual',
      unrealizedPnl: 'G/P en vivo',
      action: 'Acción',
      closeBtn: 'Cerrar',
      tradeLogsTitle: 'Historial de operaciones',
      tradeLogsSub: 'Registro completo de tus operaciones cerradas, motivo de salida y resultado neto.',
      filterSymbol: 'Buscar símbolo...',
      downloadCsv: 'Descargar CSV',
      emptyLogsTitle: 'Tu registro está vacío — listo para tu primera práctica',
      emptyLogsDesc: 'Cada operación virtual cerrada se guarda aquí con sus precios, comisiones y estadísticas.',
      goToTradingDesk: 'Ir a la mesa de operaciones',
      loadSampleTrades: 'Cargar 6 operaciones de ejemplo',
      noMatchingTrades: 'Ninguna operación coincide con este filtro.',
      colClosed: 'Cerrada',
      colMarket: 'Mercado',
      colDirection: 'Dirección',
      colTradeSize: 'Tamaño',
      colEntry: 'Entrada',
      colExit: 'Salida',
      colExitType: 'Tipo de salida',
      colNetPnl: 'G/P neto',
      reasonManual: 'Manual',
      reasonStopLoss: 'Stop-Loss',
      reasonTakeProfit: 'Take-Profit',
      reasonLiquidation: 'Liquidación',
      missionsTitle: 'Misiones diarias',
      missionsSub: 'Completa tareas diarias de práctica y estudio para ganar XP y reforzar tu racha.',
      missionsLevel: 'Nivel',
      missionsXp: 'XP',
      missionsStreak: 'Racha',
      missionsBonusLabel: 'Bonus 4/4: +50 XP',
      missionsBonusUnlocked: 'Bono diario desbloqueado (+50 XP)',
      missionsCompleted: 'Completada',
      missionLongTitle: 'Ejecutar una compra (Long)',
      missionLongDesc: 'Abre una operación de compra virtual en Cripto o Forex.',
      missionLongCta: 'Ir a Práctica',
      missionRiskTitle: 'Proteger con Stop-Loss / TP',
      missionRiskDesc: 'Configura un Stop-Loss o Take-Profit en tu operación.',
      missionRiskCta: 'Configurar salida',
      missionStrategyTitle: 'Revisar una estrategia',
      missionStrategyDesc: 'Explora un patrón animado como Hombro-Cabeza-Hombro.',
      missionStrategyCta: 'Abrir Estrategias',
      missionQuizTitle: 'Completar un cuestionario',
      missionQuizDesc: 'Responde un cuestionario de 4 preguntas en la Academia.',
      missionQuizCta: 'Abrir Academia',
      missionToastTitle: 'Misión diaria completada',
    },
    trade: {
      liveMarkets: 'Mercados en vivo',
      liveApi: 'API en vivo',
      liveStream: 'Flujo directo',
      searchMarkets: 'Buscar BTC, EUR/USD...',
      crypto247: 'Cripto 24/7',
      forexPair: 'Par Forex',
      plusOneAlert: 'Alerta +1%',
      alertSetAbove: 'Alerta creada sobre',
      simpleLine: 'Línea simple',
      candles: 'Velas',
      openPositions: 'Posiciones abiertas',
      pendingOrders: 'Órdenes pendientes',
      recentClosed: 'Cerradas recientes',
      noOpenPositions: 'No hay operaciones abiertas. Usa el panel derecho para abrir una práctica.',
      noPendingOrders: 'Sin órdenes límite pendientes. Abre Opciones avanzadas para crear una orden Límite.',
      noClosedTrades: 'Las operaciones cerradas aparecerán aquí cuando salgas de una posición.',
      current: 'Actual',
      livePnl: 'G/P en vivo',
      targetLimit: 'Límite objetivo',
      netPnl: 'G/P neto',
      practiceOrder: 'Orden de práctica',
      virtualCash: 'Saldo disponible:',
      buyPriceUp: 'Comprar (Sube)',
      sellPriceDown: 'Vender (Baja)',
      amountUsd: 'Monto a operar (USD)',
      safetyExits: 'Salidas de seguridad (Opcional)',
      autoFillPreset: 'Auto 1:2 (-2% / +4%)',
      stopLossLabel: 'Stop-Loss (Limitar pérdida)',
      takeProfitLabel: 'Take-Profit (Asegurar ganancia)',
      ifSlHits: 'Si toca Stop-Loss:',
      ifTpHits: 'Si toca Take-Profit:',
      riskReward: 'Riesgo / Beneficio:',
      advancedOptions: 'Opciones avanzadas (Límite y Apalancamiento)',
      marketOrder: 'Orden de mercado',
      limitOrder: 'Orden límite',
      targetEntryPrice: 'Precio de entrada deseado',
      leverageLabel: 'Apalancamiento (Principiantes: 1x)',
      marginLocked: 'Margen retenido:',
      placeBuyLimit: 'Crear compra límite',
      placeSellLimit: 'Crear venta límite',
      buyNow: 'Comprar',
      sellNow: 'Vender',
      orderPlacedBuy: 'Orden de compra enviada en',
      orderPlacedSell: 'Orden de venta enviada en',
      errWaitingPrice: 'Esperando precio en vivo. Intenta en un segundo.',
      errMinSize: 'El tamaño mínimo de práctica es $10.',
      errInsufficientCash: 'No tienes suficiente efectivo disponible.',
      errInvalidLimit: 'Ingresa un precio límite válido.',
      errSlBuy: 'En compra, el Stop-Loss debe estar por debajo del precio de entrada.',
      errSlSell: 'En venta, el Stop-Loss debe estar por encima del precio de entrada.',
      errTpBuy: 'En compra, el Take-Profit debe estar por encima del precio de entrada.',
      errTpSell: 'En venta, el Take-Profit debe estar por debajo del precio de entrada.',
    },
    academy: {
      title: 'Academia de Trading para Principiantes',
      subtitle: 'Lecciones paso a paso sin tecnicismos complejos. Prueba cada simulador, responde el cuestionario y practica sin riesgo.',
      courseProgress: 'Progreso del curso',
      roadmap: 'Plan de estudios',
      allModules: 'Todos los módulos',
      lessonsCount: 'Lecciones',
      lessonOf: 'Lección',
      read: 'lectura',
      completed: 'Completada',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      keyRule: 'Regla clave:',
      practiceOnChart: 'Practicar en gráfico:',
      nextLesson: 'Siguiente lección:',
      quizTitle: 'Cuestionario de la lección',
      questionsWord: 'Preguntas',
      quizPassRule: 'Responde 3 de 4 o más correctamente para completar la lección.',
      bestScore: 'Mejor puntaje:',
      scoreLabel: 'Puntaje:',
      passed: 'Aprobado',
      tryAgain: 'Intentar de nuevo',
      explanation: 'Explicación:',
      checkAnswers: 'Comprobar respuestas',
      retakeQuiz: 'Repetir cuestionario',
      streakLabel: 'Racha de aprendizaje',
      daySingular: 'día',
      daysPlural: 'días',
      streakBest: 'Mejor:',
      streakActiveToday: 'Activo hoy',
      streakStartToday: 'Estudia una lección hoy',
      lessonProgressLabel: 'Progreso de la lección',
      stepLabel: 'Curso',
      lockedLabel: 'Bloqueado',
      unlockRequirement: 'Completa el curso {n} para desbloquear',
      currentFocusLabel: 'Enfoque actual',
      phaseLearn: '1. Concepto y Ejemplo',
      phaseLab: '2. Laboratorio',
      phaseQuiz: '3. Cuestionario',
      continueToLab: 'Continuar al laboratorio',
      continueToQuiz: 'Ir al cuestionario',
      backToConcepts: 'Volver a conceptos',
      backToLab: 'Volver al laboratorio',
      nextUnlockedBanner: '¡Curso completado! El siguiente curso está desbloqueado.',
      continueToCourse: 'Continuar al curso',
      passQuizToUnlock: 'Aprueba el cuestionario (3/4+) para desbloquear el siguiente',
      lockedToastTitle: 'Completa primero el curso anterior',
      goToCurrentCourse: 'Ir al curso actual',
      allCoursesMasteredTitle: 'Ruta de aprendizaje completada',
      allCoursesMasteredDesc: 'Has desbloqueado y aprobado cada curso. Pon en práctica lo aprendido en gráficos reales o explora las estrategias.',
      resumeStepPrefix: 'Paso actual:',
    },
    strategies: {
      title: 'Estrategias Visuales de Trading',
      subtitle: 'Domina patrones clásicos con explicaciones animadas, ejemplos reales de Cripto y Forex, y errores comunes que debes evitar.',
      filterAll: 'Todas',
      catReversal: 'Reversión',
      catContinuation: 'Tendencia / Continuación',
      catMomentum: 'Impulso',
      correctMode: 'Ejecución correcta',
      mistakeMode: 'Error común',
      playBtn: 'Reproducir',
      pauseBtn: 'Pausar',
      replayBtn: 'Repetir',
      scrubHint: 'Desliza para ver cada fase',
      stepWord: 'Fase',
      realExampleTitle: 'Caso real de mercado',
      marketLabel: 'Mercado',
      timeframeLabel: 'Temporalidad',
      entryLabel: 'Disparador de entrada',
      stopLossLabel: 'Stop-Loss',
      takeProfitLabel: 'Take-Profit',
      riskRewardLabel: 'Riesgo : Beneficio',
      whyWorkedLabel: 'Por qué funcionó esta operación',
      checklistTitle: 'Lista de confirmación previa',
      practiceBtn: 'Practicar en gráfico en vivo:',
      beginnerLabel: 'Principiante',
      intermediateLabel: 'Intermedio',
      bearishBias: 'Sesgo bajista (Venta)',
      bullishBias: 'Sesgo alcista (Compra)',
      saveToPlaybook: 'Guardar en Playbook',
      savedInPlaybook: 'Guardada en Playbook',
      playbookSectionTitle: 'Estrategias guardadas',
      savedEmptyHint: 'Guarda tus estrategias favoritas para consultarlas en un clic.',
      browseStrategies: 'Ver estrategias',
      removeBookmark: 'Quitar de guardadas',
    },
    sim: {
      spreadTitle: 'Laboratorio: Cómo afecta el Spread a tu operación',
      spreadSub: 'Mueve los controles para ver por qué mercados líquidos cuestan menos al entrar.',
      tradeAmount: 'Monto operado',
      marketSpread: 'Spread del mercado (%)',
      sellBid: 'Precio de venta (Bid)',
      buyAsk: 'Precio de compra (Ask)',
      startingCost: 'Costo inicial del spread',
      orderTitle: 'Laboratorio: Órdenes Límite, Stop-Loss y Take-Profit',
      orderSub: 'Desliza el precio a $96 para activar la compra límite y prueba $92 o $108.',
      simMarketPrice: 'Precio simulado',
      stopLoss: 'Stop-Loss',
      buyLimit: 'Compra Límite',
      takeProfit: 'Take-Profit',
      orderWait: 'En espera: el precio está por encima de tu compra límite ($96).',
      orderSlHit: '¡Stop-Loss activado en $92! Tu salida de seguridad cerró la operación a tiempo.',
      orderTpHit: '¡Take-Profit alcanzado en $108! Ganancia (+12.5% desde $96) asegurada.',
      orderFilled: '¡Orden límite ejecutada en $96! Posición abierta.',
      pipTitle: 'Laboratorio: Calculadora de valor del Pip en Forex',
      pipSub: 'Descubre cuántos dólares genera un movimiento en pips según el tamaño de tu operación.',
      tradeSizeUsd: 'Tamaño (USD)',
      priceMovePips: 'Movimiento (Pips)',
      pipPer: 'por pip',
      candleTitle: 'Laboratorio: Construye y lee una vela japonesa',
      candleSub: 'Ajusta Apertura, Cierre, Máximo y Mínimo para ver la fuerza de compradores vs. vendedores.',
      open: 'Apertura',
      close: 'Cierre',
      high: 'Máximo',
      low: 'Mínimo',
      candleBull: 'Vela alcista: los compradores cerraron por encima de la apertura.',
      candleBear: 'Vela bajista: los vendedores cerraron por debajo de la apertura.',
      candleHammer: 'Mecha inferior larga: rechazo fuerte de compradores tras una caída.',
      candleShooting: 'Mecha superior larga: los vendedores frenaron la subida cerca del máximo.',
      sizerTitle: 'Laboratorio: Tamaño seguro de posición (Regla 1–2%)',
      sizerSub: 'Calcula el monto exacto para que un Stop-Loss nunca dañe seriamente tu cuenta.',
      account: 'Cuenta',
      maxRiskPct: 'Riesgo máx. %',
      slDistance: 'Distancia Stop-Loss',
      recommendedSize: 'Tamaño recomendado',
      maxLossAtSl: 'Pérdida máx. en Stop',
      targetGain2R: 'Meta de ganancia (1:2)',
      rsiTitle: 'Laboratorio: Medidor de impulso RSI (0–100)',
      rsiSub: 'Mueve el RSI entre 30 y 70 para identificar precios estirados.',
      currentRsi: 'RSI(14) actual',
      oversold: '30 (Sobrevendido)',
      midline: '50 (Medio)',
      overbought: '70 (Sobrecomprado)',
      rsiNeutral: 'Impulso neutral (30–70): condiciones normales — mira las medias móviles.',
      rsiOverbought: 'Sobrecompra (RSI ≥ 70): subida muy rápida. Comprar aquí tiene riesgo de retroceso.',
      rsiOversold: 'Sobreventa (RSI ≤ 30): caída fuerte reciente. Espera una vela verde de giro.',
    },
    alerts: {
      title: 'Alertas de Mercado y Notificaciones Push',
      subtitle: 'Recibe avisos instantáneos cuando el precio toque tu objetivo o se cierre una operación.',
      enablePushBtn: 'Activar notificaciones push',
      testBtn: 'Probar notificación',
      pushDelivery: 'Entrega push:',
      statusGranted: 'Las notificaciones del navegador están activadas junto con las alertas internas.',
      statusDenied: 'Notificaciones bloqueadas en el navegador — las alertas en pantalla siguen activas.',
      statusDefault: 'Haz clic en «Activar notificaciones push» para recibir avisos del sistema.',
      priceTargets: 'Objetivos de precio',
      orderFills: 'Órdenes ejecutadas',
      slTpExits: 'Salidas SL / TP',
      createTitle: 'Crear alerta de precio',
      marketPair: 'Par de mercado',
      currentPrice: 'Precio actual:',
      notifyWhenPrice: 'Avisar cuando el precio',
      risesAbove: 'Suba sobre (≥)',
      dropsBelow: 'Baje bajo (≤)',
      targetPrice: 'Precio objetivo',
      noteLabel: 'Nota recordatoria (Opcional)',
      notePlaceholder: 'ej. Revisar retroceso en 1H',
      recurringLabel: 'Mantener alerta activa tras activarse (pausa 1 min)',
      createBtn: 'Crear alerta de precio',
      yourAlerts: 'Tus alertas activas',
      noAlerts: 'No hay alertas creadas aún. Añade una arriba para vigilar cualquier mercado.',
      watchingLive: 'Vigilando en vivo',
      triggeredPaused: 'Activada / Pausada',
      away: 'de distancia',
      feedTitle: 'Historial de notificaciones',
      feedSub: 'Registro en tiempo real de alertas de mercado y cambios en tu portafolio.',
      markRead: 'Marcar leídas',
      clear: 'Limpiar',
      noNotifications: 'Sin notificaciones todavía. Abre una operación virtual o prueba una alerta.',
      catMarket: 'Alerta de mercado',
      catPortfolio: 'Portafolio',
      catLearning: 'Academia',
      newBadge: 'Nueva',
      quickChartNote: 'Alerta rápida desde gráfico',
    },
    notifications: {
      alertsActiveTitle: 'Alertas Meridian activadas',
      alertsActiveBody: 'Recibirás alertas push para tus precios objetivo y operaciones virtuales.',
      testTitle: 'Notificación de prueba',
      testBody: 'Las alertas de mercado y actualizaciones del portafolio funcionan correctamente.',
      priceAlertTitle: 'Alerta de precio activada',
      crossedAbove: 'superó',
      droppedBelow: 'cayó por debajo de',
      now: 'Ahora',
      tpReached: 'Take-Profit alcanzado',
      slTriggered: 'Stop-Loss activado',
      liquidated: 'Posición liquidada',
      closedAt: 'Cerrado',
      limitFilled: 'Orden límite ejecutada',
      bought: 'Comprado',
      sold: 'Vendido',
      limitPlaced: 'Orden límite creada',
      queuedAt: 'en espera en',
      orderExecuted: 'Ejecutado',
      openedAt: 'Abierto',
      positionClosed: 'Posición cerrada',
      exitedAt: 'Salida en',
      quizPassedTitle: 'Cuestionario aprobado',
      quizPassedBody: 'Has guardado tu progreso en la Academia de Trading.',
    },
    achievements: {
      sectionTitle: 'Logros y Medallas',
      sectionSub: 'Desbloquea medallas al completar cursos, mantener rachas y proteger tus operaciones.',
      unlockedCountLabel: 'Desbloqueados',
      badgeUnlocked: 'Obtenido',
      badgeLocked: 'Bloqueado',
      toastTitle: 'Logro desbloqueado',
      firstTradeTitle: 'Primera operación',
      firstTradeDesc: 'Envía tu primera orden de práctica en Cripto o Forex.',
      perfectQuizTitle: 'Cuestionario perfecto',
      perfectQuizDesc: 'Obtén 4/4 en cualquier cuestionario de la Academia.',
      streak7Title: 'Racha de 7 días',
      streak7Desc: 'Estudia o practica durante 7 días seguidos.',
      riskProtectorTitle: 'Protector de riesgo',
      riskProtectorDesc: 'Configura un Stop-Loss o Take-Profit en una operación.',
      playbookCollectorTitle: 'Curador de estrategias',
      playbookCollectorDesc: 'Guarda al menos 2 estrategias en tu Playbook.',
      courseGraduateTitle: 'Graduado del curso',
      courseGraduateDesc: 'Desbloquea y aprueba los 8 cursos secuenciales.',
    },
    leaderboard: {
      title: 'Clasificación XP',
      yourRank: 'Tu puesto',
      selfDefaultName: 'Tú',
      editName: 'Editar nombre',
      saveName: 'Guardar',
      lessonsShort: 'Cursos',
      missionsShort: 'Misiones',
      xpToNext: 'XP para puesto',
      topRankReached: '¡N.º 1 del ranking!',
      showAll: 'Ver todos',
      showCompact: 'Top y tú',
      levelPrefix: 'Nv.',
    },
  },

  ar: {
    common: {
      brand: 'Meridian',
      language: 'اللغة',
      close: 'إغلاق',
      cancel: 'إلغاء',
      confirmReset: 'تأكيد إعادة الضبط',
      all: 'الكل',
      crypto: 'عملات رقمية',
      forex: 'فوركس',
      buy: 'شراء',
      sell: 'بيع',
      optional: 'اختياري',
      min: 'د',
      loadingChart: 'جاري تحميل بيانات الرسم البياني المباشر...',
      offlineNotice: 'وضع عدم الاتصال — الدروس المحفوظة وصفقاتك التجريبية متاحة.',
      installApp: 'تثبيت تطبيق Meridian',
      installIos: 'التثبيت على iPhone / iPad',
      installIosTitle: 'التثبيت على نظام iOS',
      installIosStep1: '١. اضغط على زر المشاركة في شريط متصفح Safari.',
      installIosStep2: '٢. مرّر للأسفل واختر إضافة إلى الشاشة الرئيسية.',
      gotIt: 'فهمت',
    },
    nav: {
      overview: 'نظرة عامة',
      trade: 'التداول',
      practice: 'التدريب',
      academy: 'الأكاديمية',
      strategies: 'الاستراتيجيات',
      alerts: 'التنبيهات',
      account: 'الحساب',
      toggleSidebar: 'تبديل القائمة الجانبية',
      openMenu: 'فتح قائمة التنقل',
      paperBalance: 'الرصيد التجريبي',
    },
    drawer: {
      title: 'الحساب والتفضيلات',
      subtitle: 'اللغة · الرصيد الافتراضي · المظهر · إشعارات الدفع',
      displayLearning: 'العرض والتعلّم',
      colorTheme: 'سمة الألوان',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      beginnerHints: 'شروحات للمبتدئين',
      beginnerHintsSub: 'إظهار نصائح مبسطة بجانب المؤشرات والأوامر',
      on: 'مُفعّل',
      off: 'معطّل',
      pushNotifications: 'إشعارات الدفع',
      browserStatus: 'حالة المتصفح',
      enableBrowserPush: 'تفعيل إشعارات المتصفح',
      sendTestNotification: 'إرسال إشعار تجريبي',
      prefMarketAlerts: 'تنبيهات الأسعار المستهدفة',
      prefOrderFills: 'تنفيذ الأوامر',
      prefStopTake: 'إغلاق وقف الخسارة وجني الأرباح',
      paperAccount: 'حساب التداول التجريبي',
      equity: 'إجمالي الرصيد',
      paperDesc: 'اختر رأس المال الافتراضي وأعد ضبط محفظتك في أي وقت دون أي أموال حقيقية.',
      resetAccountTo: 'إعادة ضبط الحساب إلى',
      resetWarning: 'سيؤدي هذا إلى مسح صفقاتك المفتوحة وسجل الصفقات. هل تريد المتابعة؟',
      resetAcademy: 'إعادة ضبط تقدم اختبارات الأكاديمية',
    },
    overview: {
      title: 'ملخص المحفظة والأداء',
      subtitle: 'تابع رصيدك التجريبي، تقدمك التعليمي، وتحليلات صفقاتك السابقة في مكان واحد.',
      openAcademy: 'فتح الأكاديمية',
      resumeCourseBtn: 'متابعة الدورة',
      placePracticeTrade: 'فتح صفقة تجريبية',
      quickStartTitle: 'مسار البداية السريع للمبتدئين',
      quickStartSub: 'اتبع هذه الخطوات الثلاث البسيطة بدون أي مخاطرة مالية',
      step1: 'الخطوة ٠١',
      step1Start: 'ابدأ هنا',
      step1Done: 'مكتمل',
      step1Title: 'تعلّم الأساسيات وأكمل الاختبارات',
      step1Desc: 'دروس قصيرة لمدة ٤ دقائق حول السبريد والشموع والنقاط وإدارة المخاطر.',
      step2: 'الخطوة ٠٢',
      step2Active: 'نشط',
      step2Cash: '١٠٠ ألف دولار افتراضي',
      step2Title: 'تدرّب على الأسعار المباشرة',
      step2Desc: 'اشترِ أو بِع أزواج العملات الرقمية والفوركس مع أوامر حماية تلقائية.',
      step3: 'الخطوة ٠٣',
      step3Active: 'نشط',
      step3Ready: 'الإشعارات جاهزة',
      step3Title: 'فعّل تنبيهات الأسعار',
      step3Desc: 'احصل على إشعار فوري عندما يصل السعر إلى هدفك المحدد.',
      totalEquity: 'إجمالي قيمة الحساب',
      overallReturn: 'العائد الإجمالي',
      hintEquity: 'الرصيد المتاح مضافاً إليه قيمة الصفقات المفتوحة حالياً.',
      availableCash: 'النقد الافتراضي المتاح',
      inActiveTrades: 'المستخدم في الصفقات:',
      hintCash: 'الأموال التجريبية الجاهزة لفتح صفقات جديدة.',
      realizedLivePnl: 'الأرباح/الخسائر المحققة والمفتوحة',
      closedLabel: 'المغلقة:',
      openLabel: 'المفتوحة:',
      hintPnl: 'مجموع الأرباح أو الخسائر عبر الصفقات المنتهية والنشطة.',
      winRatePf: 'نسبة النجاح ومعامل الربح',
      hintWinRate: 'معامل ربح أعلى من 1.0 يعني أن أرباحك تفوق خسائرك.',
      equityCurveTitle: 'منحنى نمو الحساب',
      startingCapital: 'رأس المال الأولي:',
      dashedRef: 'الخط المرجعي المتقطع',
      latestEquity: 'أحدث قيمة للحساب',
      equityCurveEmpty: 'أكمل صفقة تجريبية واحدة على الأقل لعرض منحنى أداء حسابك.',
      avgWin: 'متوسط الصفقة الرابحة',
      avgLoss: 'متوسط الصفقة الخاسرة',
      maxDrawdown: 'أقصى تراجع (Drawdown)',
      avgResultTrade: 'متوسط النتيجة / صفقة',
      strategyBreakdown: 'توزيع الأداء حسب السوق',
      cryptoTrades: 'صفقات العملات الرقمية',
      forexTrades: 'صفقات الفوركس',
      buyWinRate: 'نسبة نجاح الشراء (Long)',
      sellWinRate: 'نسبة نجاح البيع (Short)',
      bestTrade: 'أفضل صفقة',
      worstTrade: 'أسوأ صفقة',
      activePositions: 'الصفقات المفتوحة حالياً',
      openLiveChart: 'عرض الرسم المباشر',
      market: 'السوق',
      side: 'النوع',
      size: 'الحجم',
      entryPrice: 'سعر الدخول',
      livePrice: 'السعر الحالي',
      unrealizedPnl: 'الربح/الخسارة اللحظية',
      action: 'إجراء',
      closeBtn: 'إغلاق',
      tradeLogsTitle: 'سجل الصفقات التاريخي',
      tradeLogsSub: 'سجل كامل لجميع صفقاتك المغلقة، سبب الإغلاق، وصافي النتيجة.',
      filterSymbol: 'تصفية حسب الرمز...',
      downloadCsv: 'تنزيل CSV',
      emptyLogsTitle: 'سجل الصفقات فارغ — جاهز لأول صفقة تجريبية',
      emptyLogsDesc: 'يتم تسجيل كل صفقة مغلقة هنا تلقائياً مع أسعار الدخول والخروج والنتائج.',
      goToTradingDesk: 'الانتقال إلى منصة التداول',
      loadSampleTrades: 'تحميل ٦ صفقات تجريبية لمعاينة التحليلات',
      noMatchingTrades: 'لا توجد صفقات تطابق التصفية الحالية.',
      colClosed: 'تاريخ الإغلاق',
      colMarket: 'السوق',
      colDirection: 'الاتجاه',
      colTradeSize: 'قيمة الصفقة',
      colEntry: 'الدخول',
      colExit: 'الخروج',
      colExitType: 'سبب الخروج',
      colNetPnl: 'الصافي',
      reasonManual: 'إغلاق يدوي',
      reasonStopLoss: 'وقف خسارة',
      reasonTakeProfit: 'جني أرباح',
      reasonLiquidation: 'تصفية',
      missionsTitle: 'المهام اليومية',
      missionsSub: 'أكمل مهام التداول والتعلّم اليومية لكسب نقاط الخبرة وتعزيز سلسلتك اليومية.',
      missionsLevel: 'المستوى',
      missionsXp: 'XP',
      missionsStreak: 'السلسلة',
      missionsBonusLabel: 'مكافأة 4/4: +50 XP',
      missionsBonusUnlocked: 'تم فتح مكافأة الإنجاز الكامل (+50 XP)',
      missionsCompleted: 'مكتملة',
      missionLongTitle: 'تنفيذ صفقة شراء (Long)',
      missionLongDesc: 'افتح صفقة شراء تجريبية على أي زوج كريبتو أو فوركس.',
      missionLongCta: 'الذهاب للتدريب',
      missionRiskTitle: 'حماية الصفقة بوقف الخسارة',
      missionRiskDesc: 'أضف أمر وقف الخسارة أو جني الأرباح لأي صفقة تجريبية.',
      missionRiskCta: 'تفعيل الحماية',
      missionStrategyTitle: 'استعراض دليل استراتيجية',
      missionStrategyDesc: 'تصفّح شرحاً متحركاً مثل نموذج الرأس والكتفين.',
      missionStrategyCta: 'فتح الاستراتيجيات',
      missionQuizTitle: 'إكمال اختبار درس',
      missionQuizDesc: 'أنهِ اختباراً من 4 أسئلة في الأكاديمية لتطوير مهاراتك.',
      missionQuizCta: 'فتح الأكاديمية',
      missionToastTitle: 'اكتملت مهمة يومية',
    },
    trade: {
      liveMarkets: 'الأسواق المباشرة',
      liveApi: 'بيانات حية',
      liveStream: 'بث مباشر',
      searchMarkets: 'ابحث عن BTC أو EUR/USD...',
      crypto247: 'عملات رقمية ٢٤/٧',
      forexPair: 'زوج عملات فوركس',
      plusOneAlert: 'تنبيه +1%',
      alertSetAbove: 'تم ضبط التنبيه فوق',
      simpleLine: 'خط بسيط',
      candles: 'شموع يابانية',
      openPositions: 'الصفقات المفتوحة',
      pendingOrders: 'الأوامر المعلقة',
      recentClosed: 'المغلقة مؤخراً',
      noOpenPositions: 'لا توجد صفقات مفتوحة الآن. استخدم نموذج الطلب لفتح صفقة تجريبية.',
      noPendingOrders: 'لا توجد أوامر معلقة. افتح الخيارات المتقدمة لوضع أمر محدد السعر.',
      noClosedTrades: 'ستظهر الصفقات المغلقة هنا بمجرد إغلاق أي مركز.',
      current: 'الحالي',
      livePnl: 'الربح اللحظي',
      targetLimit: 'السعر المستهدف',
      netPnl: 'صافي النتيجة',
      practiceOrder: 'طلب تداول تجريبي',
      virtualCash: 'النقد المتاح:',
      buyPriceUp: 'شراء (توقع صعود)',
      sellPriceDown: 'بيع (توقع هبوط)',
      amountUsd: 'مبلغ الصفقة (بالدولار)',
      safetyExits: 'أوامر الحماية التلقائية (اختياري)',
      autoFillPreset: 'تعبئة 1:2 (-2% / +4%)',
      stopLossLabel: 'وقف الخسارة (تحديد الخسارة)',
      takeProfitLabel: 'جني الأرباح (تثبيت الربح)',
      ifSlHits: 'عند تفعيل وقف الخسارة:',
      ifTpHits: 'عند الوصول لجني الأرباح:',
      riskReward: 'نسبة المخاطرة إلى العائد:',
      advancedOptions: 'خيارات متقدمة (أمر محدد والرافعة)',
      marketOrder: 'أمر سوق فوري',
      limitOrder: 'أمر بسعر محدد',
      targetEntryPrice: 'سعر الدخول المستهدف',
      leverageLabel: 'الرافعة المالية (للمبتدئين: 1x)',
      marginLocked: 'الهامش المحجوز:',
      placeBuyLimit: 'وضع أمر شراء محدد',
      placeSellLimit: 'وضع أمر بيع محدد',
      buyNow: 'شراء',
      sellNow: 'بيع',
      orderPlacedBuy: 'تم تنفيذ أمر الشراء على',
      orderPlacedSell: 'تم تنفيذ أمر البيع على',
      errWaitingPrice: 'بانتظار السعر المباشر. حاول مرة أخرى بعد لحظة.',
      errMinSize: 'الحد الأدنى لحجم الصفقة التجريبية هو ١٠ دولارات.',
      errInsufficientCash: 'الرصيد المتاح غير كافٍ لهذه الصفقة.',
      errInvalidLimit: 'أدخل سعراً محدداً صحيحاً.',
      errSlBuy: 'في صفقة الشراء، يجب أن يكون وقف الخسارة أقل من سعر الدخول.',
      errSlSell: 'في صفقة البيع، يجب أن يكون وقف الخسارة أعلى من سعر الدخول.',
      errTpBuy: 'في صفقة الشراء، يجب أن يكون جني الأرباح أعلى من سعر الدخول.',
      errTpSell: 'في صفقة البيع، يجب أن يكون جني الأرباح أقل من سعر الدخول.',
    },
    academy: {
      title: 'أكاديمية التداول للمبتدئين',
      subtitle: 'دروس واضحة بلغة مبسطة. جرّب المحاكي التفاعلي، اختبر فهمك في ٤ أسئلة، ثم تدرّب برصيد افتراضي.',
      courseProgress: 'تقدم الدورة',
      roadmap: 'خطة الدروس',
      allModules: 'جميع الوحدات',
      lessonsCount: 'دروس',
      lessonOf: 'الدرس',
      read: 'قراءة',
      completed: 'مكتمل',
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      keyRule: 'القاعدة الذهبية:',
      practiceOnChart: 'التطبيق على الرسم المباشر:',
      nextLesson: 'الدرس التالي:',
      quizTitle: 'اختبار الدرس',
      questionsWord: 'أسئلة',
      quizPassRule: 'أجب عن ٣ من ٤ أسئلة بشكل صحيح لإتمام الدرس.',
      bestScore: 'أفضل نتيجة:',
      scoreLabel: 'النتيجة:',
      passed: 'ناجح',
      tryAgain: 'حاول مجدداً',
      explanation: 'التوضيح:',
      checkAnswers: 'تحقق من الإجابات',
      retakeQuiz: 'إعادة الاختبار',
      streakLabel: 'سلسلة التعلّم اليومية',
      daySingular: 'يوم',
      daysPlural: 'أيام',
      streakBest: 'الأطول:',
      streakActiveToday: 'نشط اليوم',
      streakStartToday: 'ابدأ درساً اليوم',
      lessonProgressLabel: 'إتمام الدرس',
      stepLabel: 'الدورة',
      lockedLabel: 'مقفلة',
      unlockRequirement: 'أكمل الدورة {n} لفتح هذه المرحلة',
      currentFocusLabel: 'التركيز الحالي',
      phaseLearn: '١. المفهوم والمثال',
      phaseLab: '٢. المختبر التفاعلي',
      phaseQuiz: '٣. اختبار الفتح',
      continueToLab: 'المتابعة إلى المختبر التفاعلي',
      continueToQuiz: 'الانتقال لاختبار الفتح',
      backToConcepts: 'العودة للمفاهيم',
      backToLab: 'العودة للمختبر',
      nextUnlockedBanner: 'تم إتمام الدورة! تم فتح الدورة التالية الآن.',
      continueToCourse: 'المتابعة إلى الدورة',
      passQuizToUnlock: 'اجتز الاختبار (3/4+) لفتح الدورة التالية',
      lockedToastTitle: 'أكمل الدورة السابقة أولاً',
      goToCurrentCourse: 'الانتقال للدورة الحالية',
      allCoursesMasteredTitle: 'تم إكمال المسار التعليمي بالكامل',
      allCoursesMasteredDesc: 'لقد فتحت واجتزت جميع الدورات التدريبية بنجاح. طبّق مهاراتك الآن على الرسوم البيانية المباشرة أو استكشف الاستراتيجيات.',
      resumeStepPrefix: 'المرحلة الحالية:',
    },
    strategies: {
      title: 'استراتيجيات التداول المرئية',
      subtitle: 'تعلّم أنماط الرسم البياني الكلاسيكية عبر شروحات متحركة خطوة بخطوة، وأمثلة حقيقية من الكريبتو والفوركس، والأخطاء الشائعة.',
      filterAll: 'الكل',
      catReversal: 'انعكاس الاتجاه',
      catContinuation: 'استمرار الاتجاه',
      catMomentum: 'الزخم',
      correctMode: 'التنفيذ الصحيح',
      mistakeMode: 'خطأ المبتدئين الشائع',
      playBtn: 'تشغيل',
      pauseBtn: 'إيقاف مؤقت',
      replayBtn: 'إعادة',
      scrubHint: 'اسحب لاستعراض مراحل النمط',
      stepWord: 'المرحلة',
      realExampleTitle: 'مثال حقيقي من السوق',
      marketLabel: 'السوق',
      timeframeLabel: 'الإطار الزمني',
      entryLabel: 'نقطة الدخول',
      stopLossLabel: 'وقف الخسارة',
      takeProfitLabel: 'جني الأرباح',
      riskRewardLabel: 'المخاطرة : العائد',
      whyWorkedLabel: 'لماذا نجحت هذه الصفقة',
      checklistTitle: 'قائمة التأكيد قبل الدخول',
      practiceBtn: 'التدريب على الرسم المباشر:',
      beginnerLabel: 'مبتدئ',
      intermediateLabel: 'متوسط',
      bearishBias: 'صفقة بيع (هبوط)',
      bullishBias: 'صفقة شراء (صعود)',
      saveToPlaybook: 'حفظ في دليل التداول',
      savedInPlaybook: 'محفوظة في الدليل',
      playbookSectionTitle: 'الاستراتيجيات المحفوظة',
      savedEmptyHint: 'احفظ أمثلة الاستراتيجيات المهمة للوصول إليها بنقرة واحدة.',
      browseStrategies: 'تصفح الاستراتيجيات',
      removeBookmark: 'إزالة من المحفوظات',
    },
    sim: {
      spreadTitle: 'مختبر تفاعلي: كيف يؤثر السبريد على صفقتك',
      spreadSub: 'حرّك المنزلقات لترى لماذا تكلف الأسواق عالية السيولة رسوم دخول أقل.',
      tradeAmount: 'مبلغ الصفقة',
      marketSpread: 'نسبة السبريد (%)',
      sellBid: 'سعر البيع (Bid)',
      buyAsk: 'سعر الشراء (Ask)',
      startingCost: 'تكلفة السبريد المبدئية',
      orderTitle: 'مختبر تفاعلي: أوامر الحد ووقف الخسارة وجني الأرباح',
      orderSub: 'حرّك السعر إلى 96$ لتنفيذ الشراء المحدد، ثم اختبر 92$ (وقف الخسارة) أو 108$ (جني الأرباح).',
      simMarketPrice: 'سعر السوق الافتراضي',
      stopLoss: 'وقف الخسارة',
      buyLimit: 'شراء محدد',
      takeProfit: 'جني الأرباح',
      orderWait: 'بانتظار التنفيذ: السعر ما زال أعلى من أمر الشراء المحدد (96$).',
      orderSlHit: 'تم تفعيل وقف الخسارة عند 92$! أغلق نظام الحماية الصفقة لمنع خسائر أكبر.',
      orderTpHit: 'تم الوصول إلى جني الأرباح عند 108$! تم تأمين ربحك (+12.5%) تلقائياً.',
      orderFilled: 'تم تنفيذ الشراء المحدد عند 96$! الصفقة مفتوحة الآن.',
      pipTitle: 'مختبر تفاعلي: حاسبة قيمة النقطة (Pip) في الفوركس',
      pipSub: 'اكتشف قيمة الربح أو الخسارة بالدولار لكل حركة بالنقاط حسب حجم صفقتك.',
      tradeSizeUsd: 'حجم الصفقة (دولار)',
      priceMovePips: 'الحركة (نقاط)',
      pipPer: 'لكل نقطة',
      candleTitle: 'مختبر تفاعلي: بناء وقراءة الشمعة اليابانية',
      candleSub: 'عدّل سعر الافتتاح والإغلاق والأعلى والأدنى لفهم صراع المشترين والبائعين.',
      open: 'الافتتاح',
      close: 'الإغلاق',
      high: 'الأعلى',
      low: 'الأدنى',
      candleBull: 'شمعة صاعدة: نجح المشترون في إغلاق السعر أعلى من الافتتاح.',
      candleBear: 'شمعة هابطة: دفع البائعون سعر الإغلاق ليكون أقل من الافتتاح.',
      candleHammer: 'ذيل سفلي طويل: حاول البائعون الهبوط لكن المشترين رفضوا السعر ودفعوه للأعلى.',
      candleShooting: 'ذيل علوي طويل: صعد المشترون ثم تدخل البائعون بقوة قرب القمة.',
      sizerTitle: 'مختبر تفاعلي: حاسبة حجم الصفقة الآمن (قاعدة 1–2%)',
      sizerSub: 'احسب الحجم الدقيق لصفقتك بحيث لا تؤثر خسارة واحدة على حسابك.',
      account: 'الحساب',
      maxRiskPct: 'أقصى مخاطرة %',
      slDistance: 'مسافة وقف الخسارة',
      recommendedSize: 'الحجم الموصى به',
      maxLossAtSl: 'أقصى خسارة عند الوقف',
      targetGain2R: 'الربح المستهدف (1:2)',
      rsiTitle: 'مختبر تفاعلي: مؤشر الزخم RSI (من 0 إلى 100)',
      rsiSub: 'حرّك مؤشر RSI بين 30 و70 للتعرف على حالات التشبع الشرائي والبيعي.',
      currentRsi: 'قيمة RSI(14) الحالية',
      oversold: '30 (تشبع بيعي)',
      midline: '50 (متوازن)',
      overbought: '70 (تشبع شرائي)',
      rsiNeutral: 'زخم متوازن (30–70): حركة طبيعية — راقب اتجاه المتوسطات المتحركة.',
      rsiOverbought: 'تشبع شرائي (RSI ≥ 70): ارتفع السعر بسرعة. الشراء هنا يحمل خطر تصحيح.',
      rsiOversold: 'تشبع بيعي (RSI ≤ 30): هبوط حاد مؤخراً. انتظر شمعة ارتداد خضراء قبل الشراء.',
    },
    alerts: {
      title: 'تنبيهات السوق وإشعارات الدفع',
      subtitle: 'احصل على إشعارات فورية عندما يصل السعر لهدفك أو عند إغلاق أي صفقة.',
      enablePushBtn: 'تفعيل إشعارات المتصفح',
      testBtn: 'إشعار تجريبي',
      pushDelivery: 'حالة الإشعارات:',
      statusGranted: 'إشعارات المتصفح مفعلة جنباً إلى جنب مع التنبيهات الداخلية.',
      statusDenied: 'الإشعارات محظورة في إعدادات المتصفح — تظل التنبيهات داخل التطبيق نشطة.',
      statusDefault: 'اضغط على «تفعيل إشعارات المتصفح» لتلقي تنبيهات فورية على جهازك.',
      priceTargets: 'أهداف الأسعار',
      orderFills: 'تنفيذ الأوامر',
      slTpExits: 'إغلاق الوقف والهدف',
      createTitle: 'إنشاء تنبيه سعر جديد',
      marketPair: 'الزوج / العملة',
      currentPrice: 'السعر الحالي:',
      notifyWhenPrice: 'أرسل تنبيهاً عندما',
      risesAbove: 'يرتفع فوق (≥)',
      dropsBelow: 'يهبط تحت (≤)',
      targetPrice: 'السعر المستهدف',
      noteLabel: 'ملاحظة شخصية (اختياري)',
      notePlaceholder: 'مثال: مراجعة الارتداد على إطار الساعة',
      recurringLabel: 'إبقاء التنبيه نشطاً بعد التفعيل (انتظار دقيقة واحدة)',
      createBtn: 'إنشاء تنبيه السعر',
      yourAlerts: 'تنبيهات الأسعار الخاصة بك',
      noAlerts: 'لا توجد تنبيهات بعد. أضف تنبيهاً أعلاه لمراقبة أي سوق تلقائياً.',
      watchingLive: 'مراقبة مباشرة',
      triggeredPaused: 'تم التفعيل / متوقف',
      away: 'متبقي',
      feedTitle: 'سجل الإشعارات',
      feedSub: 'سجل مباشر لتنبيهات الأسعار وتحديثات محفظتك التجريبية.',
      markRead: 'تحديد كمقروء',
      clear: 'مسح',
      noNotifications: 'لا توجد إشعارات بعد. نفّذ صفقة تجريبية أو أنشئ تنبيه سعر.',
      catMarket: 'تنبيه سوق',
      catPortfolio: 'تحديث المحفظة',
      catLearning: 'التعليم',
      newBadge: 'جديد',
      quickChartNote: 'تنبيه سريع من الرسم البياني',
    },
    notifications: {
      alertsActiveTitle: 'تنبيهات Meridian نشطة',
      alertsActiveBody: 'ستتلقى الآن إشعارات فورية لأهداف الأسعار وتحديثات صفقاتك.',
      testTitle: 'إشعار دفع تجريبي',
      testBody: 'تنبيهات السوق وتحديثات المحفظة مضبوطة وتعمل بنجاح.',
      priceAlertTitle: 'تنبيه سعر مُفعّل',
      crossedAbove: 'تجاوز صعوداً',
      droppedBelow: 'هبط دون',
      now: 'الآن',
      tpReached: 'تم تحقيق جني الأرباح',
      slTriggered: 'تم تفعيل وقف الخسارة',
      liquidated: 'تمت تصفية المركز',
      closedAt: 'تم إغلاق',
      limitFilled: 'تم تنفيذ الأمر المحدد',
      bought: 'شراء',
      sold: 'بيع',
      limitPlaced: 'تم وضع أمر محدد',
      queuedAt: 'في الانتظار عند',
      orderExecuted: 'تم التنفيذ',
      openedAt: 'تم فتح',
      positionClosed: 'تم إغلاق الصفقة',
      exitedAt: 'الخروج عند',
      quizPassedTitle: 'تم اجتياز اختبار الدرس',
      quizPassedBody: 'تم تسجيل تقدمك بنجاح في أكاديمية التداول.',
    },
    achievements: {
      sectionTitle: 'الإنجازات والشارات',
      sectionSub: 'احصل على شارات الإنجاز عند إتمام الدورات، الحفاظ على السلسلة، وحماية صفقاتك.',
      unlockedCountLabel: 'مفتوحة',
      badgeUnlocked: 'مكتسب',
      badgeLocked: 'مقفلة',
      toastTitle: 'تم فتح إنجاز جديد',
      firstTradeTitle: 'أول صفقة',
      firstTradeDesc: 'نفّذ أول صفقة تجريبية على الكريبتو أو الفوركس.',
      perfectQuizTitle: 'درجة كاملة في الاختبار',
      perfectQuizDesc: 'احصل على 4/4 في أي اختبار بالأكاديمية.',
      streak7Title: 'سلسلة تعلّم 7 أيام',
      streak7Desc: 'تعلّم أو تدرّب لمدة 7 أيام متتالية.',
      riskProtectorTitle: 'حامي المخاطر',
      riskProtectorDesc: 'أضف أمر وقف خسارة أو جني أرباح لأي صفقة.',
      playbookCollectorTitle: 'منسّق الاستراتيجيات',
      playbookCollectorDesc: 'احفظ استراتيجيتين على الأقل في دليل التداول.',
      courseGraduateTitle: 'خريج الأكاديمية',
      courseGraduateDesc: 'افتح وأتمم جميع الدورات الثماني بنجاح.',
    },
    leaderboard: {
      title: 'لوحة المتصدرين',
      yourRank: 'ترتيبك',
      selfDefaultName: 'أنت',
      editName: 'تعديل الاسم',
      saveName: 'حفظ',
      lessonsShort: 'الدروس',
      missionsShort: 'المهام',
      xpToNext: 'XP للمركز',
      topRankReached: 'أنت في الصدارة!',
      showAll: 'عرض الكل',
      showCompact: 'الأوائل وأنت',
      levelPrefix: 'م.',
    },
  },
};
```

### `src/i18n/types.ts`

```ts
export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface LanguageOption {
  code: Language;
  nativeLabel: string;
  shortLabel: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {code: 'en', nativeLabel: 'English', shortLabel: 'EN', dir: 'ltr'},
  {code: 'fr', nativeLabel: 'Français', shortLabel: 'FR', dir: 'ltr'},
  {code: 'es', nativeLabel: 'Español', shortLabel: 'ES', dir: 'ltr'},
  {code: 'ar', nativeLabel: 'العربية', shortLabel: 'AR', dir: 'rtl'},
];

export interface Translations {
  common: {
    brand: string;
    language: string;
    close: string;
    cancel: string;
    confirmReset: string;
    all: string;
    crypto: string;
    forex: string;
    buy: string;
    sell: string;
    optional: string;
    min: string;
    loadingChart: string;
    offlineNotice: string;
    installApp: string;
    installIos: string;
    installIosTitle: string;
    installIosStep1: string;
    installIosStep2: string;
    gotIt: string;
  };
  nav: {
    overview: string;
    trade: string;
    practice: string;
    academy: string;
    strategies: string;
    alerts: string;
    account: string;
    toggleSidebar: string;
    openMenu: string;
    paperBalance: string;
  };
  drawer: {
    title: string;
    subtitle: string;
    displayLearning: string;
    colorTheme: string;
    darkMode: string;
    lightMode: string;
    beginnerHints: string;
    beginnerHintsSub: string;
    on: string;
    off: string;
    pushNotifications: string;
    browserStatus: string;
    enableBrowserPush: string;
    sendTestNotification: string;
    prefMarketAlerts: string;
    prefOrderFills: string;
    prefStopTake: string;
    paperAccount: string;
    equity: string;
    paperDesc: string;
    resetAccountTo: string;
    resetWarning: string;
    resetAcademy: string;
  };
  overview: {
    title: string;
    subtitle: string;
    openAcademy: string;
    resumeCourseBtn: string;
    placePracticeTrade: string;
    quickStartTitle: string;
    quickStartSub: string;
    step1: string;
    step1Start: string;
    step1Done: string;
    step1Title: string;
    step1Desc: string;
    step2: string;
    step2Active: string;
    step2Cash: string;
    step2Title: string;
    step2Desc: string;
    step3: string;
    step3Active: string;
    step3Ready: string;
    step3Title: string;
    step3Desc: string;
    totalEquity: string;
    overallReturn: string;
    hintEquity: string;
    availableCash: string;
    inActiveTrades: string;
    hintCash: string;
    realizedLivePnl: string;
    closedLabel: string;
    openLabel: string;
    hintPnl: string;
    winRatePf: string;
    hintWinRate: string;
    equityCurveTitle: string;
    startingCapital: string;
    dashedRef: string;
    latestEquity: string;
    equityCurveEmpty: string;
    avgWin: string;
    avgLoss: string;
    maxDrawdown: string;
    avgResultTrade: string;
    strategyBreakdown: string;
    cryptoTrades: string;
    forexTrades: string;
    buyWinRate: string;
    sellWinRate: string;
    bestTrade: string;
    worstTrade: string;
    activePositions: string;
    openLiveChart: string;
    market: string;
    side: string;
    size: string;
    entryPrice: string;
    livePrice: string;
    unrealizedPnl: string;
    action: string;
    closeBtn: string;
    tradeLogsTitle: string;
    tradeLogsSub: string;
    filterSymbol: string;
    downloadCsv: string;
    emptyLogsTitle: string;
    emptyLogsDesc: string;
    goToTradingDesk: string;
    loadSampleTrades: string;
    noMatchingTrades: string;
    colClosed: string;
    colMarket: string;
    colDirection: string;
    colTradeSize: string;
    colEntry: string;
    colExit: string;
    colExitType: string;
    colNetPnl: string;
    reasonManual: string;
    reasonStopLoss: string;
    reasonTakeProfit: string;
    reasonLiquidation: string;
    missionsTitle: string;
    missionsSub: string;
    missionsLevel: string;
    missionsXp: string;
    missionsStreak: string;
    missionsBonusLabel: string;
    missionsBonusUnlocked: string;
    missionsCompleted: string;
    missionLongTitle: string;
    missionLongDesc: string;
    missionLongCta: string;
    missionRiskTitle: string;
    missionRiskDesc: string;
    missionRiskCta: string;
    missionStrategyTitle: string;
    missionStrategyDesc: string;
    missionStrategyCta: string;
    missionQuizTitle: string;
    missionQuizDesc: string;
    missionQuizCta: string;
    missionToastTitle: string;
  };
  trade: {
    liveMarkets: string;
    liveApi: string;
    liveStream: string;
    searchMarkets: string;
    crypto247: string;
    forexPair: string;
    plusOneAlert: string;
    alertSetAbove: string;
    simpleLine: string;
    candles: string;
    openPositions: string;
    pendingOrders: string;
    recentClosed: string;
    noOpenPositions: string;
    noPendingOrders: string;
    noClosedTrades: string;
    current: string;
    livePnl: string;
    targetLimit: string;
    netPnl: string;
    practiceOrder: string;
    virtualCash: string;
    buyPriceUp: string;
    sellPriceDown: string;
    amountUsd: string;
    safetyExits: string;
    autoFillPreset: string;
    stopLossLabel: string;
    takeProfitLabel: string;
    ifSlHits: string;
    ifTpHits: string;
    riskReward: string;
    advancedOptions: string;
    marketOrder: string;
    limitOrder: string;
    targetEntryPrice: string;
    leverageLabel: string;
    marginLocked: string;
    placeBuyLimit: string;
    placeSellLimit: string;
    buyNow: string;
    sellNow: string;
    orderPlacedBuy: string;
    orderPlacedSell: string;
    errWaitingPrice: string;
    errMinSize: string;
    errInsufficientCash: string;
    errInvalidLimit: string;
    errSlBuy: string;
    errSlSell: string;
    errTpBuy: string;
    errTpSell: string;
  };
  academy: {
    title: string;
    subtitle: string;
    courseProgress: string;
    roadmap: string;
    allModules: string;
    lessonsCount: string;
    lessonOf: string;
    read: string;
    completed: string;
    beginner: string;
    intermediate: string;
    keyRule: string;
    practiceOnChart: string;
    nextLesson: string;
    quizTitle: string;
    questionsWord: string;
    quizPassRule: string;
    bestScore: string;
    scoreLabel: string;
    passed: string;
    tryAgain: string;
    explanation: string;
    checkAnswers: string;
    retakeQuiz: string;
    streakLabel: string;
    daySingular: string;
    daysPlural: string;
    streakBest: string;
    streakActiveToday: string;
    streakStartToday: string;
    lessonProgressLabel: string;
    stepLabel: string;
    lockedLabel: string;
    unlockRequirement: string;
    currentFocusLabel: string;
    phaseLearn: string;
    phaseLab: string;
    phaseQuiz: string;
    continueToLab: string;
    continueToQuiz: string;
    backToConcepts: string;
    backToLab: string;
    nextUnlockedBanner: string;
    continueToCourse: string;
    passQuizToUnlock: string;
    lockedToastTitle: string;
    goToCurrentCourse: string;
    allCoursesMasteredTitle: string;
    allCoursesMasteredDesc: string;
    resumeStepPrefix: string;
  };
  strategies: {
    title: string;
    subtitle: string;
    filterAll: string;
    catReversal: string;
    catContinuation: string;
    catMomentum: string;
    correctMode: string;
    mistakeMode: string;
    playBtn: string;
    pauseBtn: string;
    replayBtn: string;
    scrubHint: string;
    stepWord: string;
    realExampleTitle: string;
    marketLabel: string;
    timeframeLabel: string;
    entryLabel: string;
    stopLossLabel: string;
    takeProfitLabel: string;
    riskRewardLabel: string;
    whyWorkedLabel: string;
    checklistTitle: string;
    practiceBtn: string;
    beginnerLabel: string;
    intermediateLabel: string;
    bearishBias: string;
    bullishBias: string;
    saveToPlaybook: string;
    savedInPlaybook: string;
    playbookSectionTitle: string;
    savedEmptyHint: string;
    browseStrategies: string;
    removeBookmark: string;
  };
  sim: {
    spreadTitle: string;
    spreadSub: string;
    tradeAmount: string;
    marketSpread: string;
    sellBid: string;
    buyAsk: string;
    startingCost: string;
    orderTitle: string;
    orderSub: string;
    simMarketPrice: string;
    stopLoss: string;
    buyLimit: string;
    takeProfit: string;
    orderWait: string;
    orderSlHit: string;
    orderTpHit: string;
    orderFilled: string;
    pipTitle: string;
    pipSub: string;
    tradeSizeUsd: string;
    priceMovePips: string;
    pipPer: string;
    candleTitle: string;
    candleSub: string;
    open: string;
    close: string;
    high: string;
    low: string;
    candleBull: string;
    candleBear: string;
    candleHammer: string;
    candleShooting: string;
    sizerTitle: string;
    sizerSub: string;
    account: string;
    maxRiskPct: string;
    slDistance: string;
    recommendedSize: string;
    maxLossAtSl: string;
    targetGain2R: string;
    rsiTitle: string;
    rsiSub: string;
    currentRsi: string;
    oversold: string;
    midline: string;
    overbought: string;
    rsiNeutral: string;
    rsiOverbought: string;
    rsiOversold: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    enablePushBtn: string;
    testBtn: string;
    pushDelivery: string;
    statusGranted: string;
    statusDenied: string;
    statusDefault: string;
    priceTargets: string;
    orderFills: string;
    slTpExits: string;
    createTitle: string;
    marketPair: string;
    currentPrice: string;
    notifyWhenPrice: string;
    risesAbove: string;
    dropsBelow: string;
    targetPrice: string;
    noteLabel: string;
    notePlaceholder: string;
    recurringLabel: string;
    createBtn: string;
    yourAlerts: string;
    noAlerts: string;
    watchingLive: string;
    triggeredPaused: string;
    away: string;
    feedTitle: string;
    feedSub: string;
    markRead: string;
    clear: string;
    noNotifications: string;
    catMarket: string;
    catPortfolio: string;
    catLearning: string;
    newBadge: string;
    quickChartNote: string;
  };
  notifications: {
    alertsActiveTitle: string;
    alertsActiveBody: string;
    testTitle: string;
    testBody: string;
    priceAlertTitle: string;
    crossedAbove: string;
    droppedBelow: string;
    now: string;
    tpReached: string;
    slTriggered: string;
    liquidated: string;
    closedAt: string;
    limitFilled: string;
    bought: string;
    sold: string;
    limitPlaced: string;
    queuedAt: string;
    orderExecuted: string;
    openedAt: string;
    positionClosed: string;
    exitedAt: string;
    quizPassedTitle: string;
    quizPassedBody: string;
  };
  achievements: {
    sectionTitle: string;
    sectionSub: string;
    unlockedCountLabel: string;
    badgeUnlocked: string;
    badgeLocked: string;
    toastTitle: string;
    firstTradeTitle: string;
    firstTradeDesc: string;
    perfectQuizTitle: string;
    perfectQuizDesc: string;
    streak7Title: string;
    streak7Desc: string;
    riskProtectorTitle: string;
    riskProtectorDesc: string;
    playbookCollectorTitle: string;
    playbookCollectorDesc: string;
    courseGraduateTitle: string;
    courseGraduateDesc: string;
  };
  leaderboard: {
    title: string;
    yourRank: string;
    selfDefaultName: string;
    editName: string;
    saveName: string;
    lessonsShort: string;
    missionsShort: string;
    xpToNext: string;
    topRankReached: string;
    showAll: string;
    showCompact: string;
    levelPrefix: string;
  };
}
```

### `src/i18n/walkthroughTranslations.ts`

```ts
import type {Language} from './types';

export interface WalkthroughStep {
  title: string;
  caption: string;
}

export interface LessonWalkthroughData {
  title: string;
  subtitle: string;
  pairBadge: string;
  correctSummary: string;
  correctOutcome: string;
  correctSteps: [WalkthroughStep, WalkthroughStep, WalkthroughStep];
  mistakeSummary: string;
  mistakeOutcome: string;
  mistakeSteps: [WalkthroughStep, WalkthroughStep, WalkthroughStep];
}

export interface WalkthroughUiStrings {
  badgeLabel: string;
  correctWay: string;
  commonMistake: string;
  play: string;
  pause: string;
  replay: string;
  stepPrefix: string;
  outcomeLabel: string;
}

export const WALKTHROUGH_UI: Record<Language, WalkthroughUiStrings> = {
  en: {
    badgeLabel: 'Animated Trade Example',
    correctWay: 'How to Trade It Correctly',
    commonMistake: 'Common Beginner Mistake',
    play: 'Play Animation',
    pause: 'Pause',
    replay: 'Replay',
    stepPrefix: 'Step',
    outcomeLabel: 'Outcome',
  },
  fr: {
    badgeLabel: 'Exemple animé pas à pas',
    correctWay: 'La bonne méthode',
    commonMistake: 'Erreur fréquente à éviter',
    play: 'Lancer l’animation',
    pause: 'Pause',
    replay: 'Rejouer',
    stepPrefix: 'Étape',
    outcomeLabel: 'Résultat',
  },
  es: {
    badgeLabel: 'Ejemplo animado paso a paso',
    correctWay: 'Cómo operar correctamente',
    commonMistake: 'Error común de principiante',
    play: 'Reproducir animación',
    pause: 'Pausar',
    replay: 'Repetir',
    stepPrefix: 'Paso',
    outcomeLabel: 'Resultado',
  },
  ar: {
    badgeLabel: 'مثال تداول متحرك خطوة بخطوة',
    correctWay: 'الطريقة الصحيحة للتداول',
    commonMistake: 'خطأ شائع يجب تجنبه',
    play: 'تشغيل الشرح',
    pause: 'إيقاف مؤقت',
    replay: 'إعادة التشغيل',
    stepPrefix: 'الخطوة',
    outcomeLabel: 'النتيجة',
  },
};

export const WALKTHROUGH_LESSONS: Record<Language, Record<string, LessonWalkthroughData>> = {
  en: {
    'lesson-1': {
      title: 'Entering a Liquid Pair vs. Paying a Wide Spread',
      subtitle: 'Watch how Bid and Ask prices affect your trade the moment you click Buy.',
      pairBadge: 'EUR/USD ($5,000 Trade)',
      correctSummary: 'Pick a high-volume pair (EUR/USD) with a tiny 0.02% spread.',
      correctOutcome: '+$49.00 Net Profit (spread cost was only $1.00)',
      correctSteps: [
        {title: 'Check Bid vs. Ask', caption: 'Ask is 1.0602 and Bid is 1.0600 — a tiny 2-pip gap ($1 cost).'},
        {title: 'Buy at Ask (1.0602)', caption: 'Your trade starts at -$1.00, so it breaks even almost immediately.'},
        {title: 'Price Rises +1%', caption: 'Selling at Bid captures nearly the full move as profit.'},
      ],
      mistakeSummary: 'Trading a thin, low-volume coin with a huge 1.50% spread.',
      mistakeOutcome: '-$25.00 Loss even though price went UP +1%!',
      mistakeSteps: [
        {title: 'Ignore Wide Spread', caption: 'Ask is $101.50 while Bid is $100.00 — you lose $75 just entering.'},
        {title: 'Buy at Ask ($101.50)', caption: 'Price must rise 1.5% just to get back to $0 profit.'},
        {title: 'Small +1% Gain Isn’t Enough', caption: 'Even after a +1% bounce, Bid is still below your Ask entry.'},
      ],
    },
    'lesson-2': {
      title: 'Using Limit, Stop-Loss & Take-Profit Together',
      subtitle: 'Let automatic orders enter at a dip and lock profits while you step away.',
      pairBadge: 'BTC/USD ($2,000 Trade)',
      correctSummary: 'Place a patient Buy Limit on a dip with Stop-Loss and 1:2 Take-Profit.',
      correctOutcome: '+$178.00 Locked Automatically (+8.9% at Take-Profit)',
      correctSteps: [
        {title: 'Wait with Buy Limit', caption: 'BTC is $91,500. You place a Buy Limit at $89,500 instead of chasing.'},
        {title: 'Dip Fills Your Order', caption: 'Price taps $89,500 — your Stop-Loss ($87,500) and TP ($93,500) activate.'},
        {title: 'Take-Profit Hits $93,500', caption: 'Price rallies and closes automatically at your goal — zero stress.'},
      ],
      mistakeSummary: 'Buying with a Market order after a spike with no Stop-Loss.',
      mistakeOutcome: '-$240.00 Uncapped Loss (-12% drop without protection)',
      mistakeSteps: [
        {title: 'Chase the Top', caption: 'You click Market Buy right at $93,500 after a fast green spike.'},
        {title: 'Skip the Stop-Loss', caption: 'When BTC pulls back to $89,500, nothing stops the loss.'},
        {title: 'Panic Sell the Bottom', caption: 'Price drops to $82,300 and fear forces a big manual loss.'},
      ],
    },
    'lesson-3': {
      title: 'Checking Bitcoin First & Sizing Down for Crypto',
      subtitle: 'See how altcoins follow Bitcoin’s direction with larger percentage swings.',
      pairBadge: 'BTC/USD + SOL/USD',
      correctSummary: 'Confirm BTC is trending up, then trade SOL with a modest 1% risk size.',
      correctOutcome: '+$140.00 Gain with calm, controlled swings',
      correctSteps: [
        {title: 'Check BTC/USD First', caption: 'Bitcoin breaks cleanly above support — market mood is bullish.'},
        {title: 'Size Small for Volatility', caption: 'Because SOL swings 2x faster, you trade $1,500 instead of $10,000.'},
        {title: 'Ride the Altcoin Follow-Through', caption: 'SOL rallies +9.3% while a normal pullback never scares you out.'},
      ],
      mistakeSummary: 'Buying a volatile altcoin with huge size while Bitcoin is dropping.',
      mistakeOutcome: '-$950.00 Heavy Loss as altcoin drops 2x faster than BTC',
      mistakeSteps: [
        {title: 'Ignore BTC Downtrend', caption: 'BTC is making lower lows, but you buy SOL anyway.'},
        {title: 'Oversized Position', caption: 'You put $10,000 in SOL assuming it moves slowly like Forex.'},
        {title: '2x Drop Triggers Wipeout', caption: 'BTC dips -4.5%, dragging SOL down -9.5% right into a huge loss.'},
      ],
    },
    'lesson-4': {
      title: 'Reading Currency Pairs & Calculating Pip Profits',
      subtitle: 'Understand Base vs. Quote currency and watch pips turn into dollars.',
      pairBadge: 'EUR/USD ($10,000 Size)',
      correctSummary: 'Buy EUR/USD when EUR strengthens (or Sell when USD strengthens).',
      correctOutcome: '+$37.70 Profit from a +40 pip move (0.0040)',
      correctSteps: [
        {title: 'Read the Pair Properly', caption: 'In EUR/USD, EUR is first (Base). You expect Euro to rise vs. Dollar.'},
        {title: 'Buy at 1.0560', caption: 'Entry locked at 1.0560 with Stop-Loss 20 pips below at 1.0540.'},
        {title: 'Count +40 Pips to 1.0600', caption: 'Each pip on $10k equals ~$0.94, locking in +$37.70 calmly.'},
      ],
      mistakeSummary: 'Confusing which side of the pair rises when the US Dollar gets stronger.',
      mistakeOutcome: '-$37.70 Loss from trading the opposite direction',
      mistakeSteps: [
        {title: 'Expect Strong USD', caption: 'You believe USD is rising, but mistakenly click BUY on EUR/USD.'},
        {title: 'Pair Drops Instead', caption: 'A stronger USD pushes EUR/USD down from 1.0600 to 1.0560.'},
        {title: '-40 Pips Against You', caption: 'Remember: strong second currency (USD) makes EUR/USD go DOWN.'},
      ],
    },
    'lesson-5': {
      title: 'Waiting for Candle Close & Reading Rejection Wicks',
      subtitle: 'Watch a 15-minute candle form live to see why waiting for close matters.',
      pairBadge: 'ETH/USD · 15m Candle',
      correctSummary: 'Wait for the candle to close with a long lower wick before entering.',
      correctOutcome: '+$160.00 Profit riding the confirmed bounce',
      correctSteps: [
        {title: 'Watch Sellers Test Support', caption: 'Mid-candle, price dips to $3,080 — looks scary and red.'},
        {title: 'Buyers Reject the Low', caption: 'Before the 15m close, buyers surge back to $3,145, leaving a long lower wick.'},
        {title: 'Enter After Confirmation', caption: 'You buy on the next candle open and ride ETH up to $3,225.'},
      ],
      mistakeSummary: 'Reacting mid-candle before buyers and sellers finish the 15-minute fight.',
      mistakeOutcome: '-$110.00 Loss selling right at the bottom wick',
      mistakeSteps: [
        {title: 'See Red Mid-Candle', caption: 'With 8 minutes left, ETH dips briefly below support.'},
        {title: 'Sell in Panic Too Early', caption: 'You short at $3,085 without waiting for the candle to close.'},
        {title: 'Wick Snaps Back Up', caption: 'Candle closes green as a Hammer, leaving you trapped on the wrong side.'},
      ],
    },
    'lesson-6': {
      title: 'Combining SMA 20 Trend + RSI Timing',
      subtitle: 'See how a trend line and momentum gauge filter out bad entries.',
      pairBadge: 'SOL/USD · SMA 20 + RSI(14)',
      correctSummary: 'Buy when price pulls back to a rising SMA 20 and RSI resets near 42.',
      correctOutcome: '+$210.00 Clean Trend Continuation',
      correctSteps: [
        {title: 'Confirm Uptrend Slope', caption: 'Price stays above a smoothly rising SMA 20 line.'},
        {title: 'Wait for RSI Reset (42)', caption: 'Instead of chasing RSI > 75, wait until a dip brings price near SMA 20.'},
        {title: 'Enter with Trend Momentum', caption: 'Price bounces off SMA 20 while RSI climbs cleanly from 42 to 64.'},
      ],
      mistakeSummary: 'Buying right when price is far above SMA 20 and RSI screams 82.',
      mistakeOutcome: '-$145.00 Caught in an overbought pullback',
      mistakeSteps: [
        {title: 'Ignore Overheated RSI (82)', caption: 'SOL already jumped +12% in hours and sits far above SMA 20.'},
        {title: 'Buy at the Peak', caption: 'You enter right before exhausted buyers take profits.'},
        {title: 'Snap-Back to SMA 20', caption: 'Price cools back down toward the moving average, hitting your stop.'},
      ],
    },
    'lesson-7': {
      title: 'The Math of 1% Risk & 1:2 Reward Across 5 Trades',
      subtitle: 'Watch how winning just 2 out of 5 trades still grows your account!',
      pairBadge: '$100,000 Account · 5 Trades',
      correctSummary: 'Risk 1% ($1,000) to make 2% ($2,000) — win 2, lose 3, still profit.',
      correctOutcome: '+$1,000.00 Net Account Growth ($101,000)',
      correctSteps: [
        {title: 'Trades 1 & 2 Lose (-$1k each)', caption: 'Two Stop-Losses hit at -$1,000 each ($98,000 left — totally safe).'},
        {title: 'Trade 3 Wins (+$2,000)', caption: 'One 1:2 Take-Profit erases BOTH prior losses ($100,000 even).'},
        {title: 'Trades 4 & 5: -1k then +2k', caption: 'Even with a 40% win rate (2W / 3L), equity climbs to $101,000!'},
      ],
      mistakeSummary: 'Risking 20% per trade with high leverage and no fixed risk rule.',
      mistakeOutcome: '-$36,000.00 Drawdown after just two normal losses ($64,000 left)',
      mistakeSteps: [
        {title: 'Overbet 20% on Trade 1', caption: 'Using 10x leverage with no Stop-Loss caps causes a -$20,000 hit.'},
        {title: 'Revenge Trade to Recover', caption: 'You bet big again to win it back quickly and lose another -$16,000.'},
        {title: 'Account Crippled', caption: 'Now you need a huge +56% gain just to get back to where you started.'},
      ],
    },
    'lesson-8': {
      title: 'Executing the Trend Pullback Playbook Step by Step',
      subtitle: 'Follow the exact 3-step checklist professionals use before every entry.',
      pairBadge: 'EUR/USD · 1H Pullback Setup',
      correctSummary: 'Spot rising SMA 20 → Wait for calm dip → Enter with Stop-Loss & 2R target.',
      correctOutcome: '+$300.00 Clean 1:2 Playbook Win (Risk $150 → Make $300)',
      correctSteps: [
        {title: 'Identify Rising Structure', caption: 'Higher highs and higher lows holding neatly above SMA 20.'},
        {title: 'Buy the Calm Dip', caption: 'Enter near SMA 20 support at 1.0580 with Stop-Loss at 1.0565.'},
        {title: 'Exit at 1:2 Target (1.0610)', caption: 'Take-Profit locks +30 pips (+$300) for only 15 pips risked.'},
      ],
      mistakeSummary: 'Chasing an extended spike far away from support with a loose Stop-Loss.',
      mistakeOutcome: '-$300.00 Stopped out on a normal healthy pullback',
      mistakeSteps: [
        {title: 'FOMO Into Vertical Spike', caption: 'You buy at 1.0615 right as price stretches far above SMA 20.'},
        {title: 'Normal Dip Hits Your Entry', caption: 'Price simply pulls back to 1.0580 where smart buyers are waiting.'},
        {title: 'Stopped Out Right Before Bounce', caption: 'You lose -$300 at the exact level you should have bought.'},
      ],
    },
  },

  fr: {
    'lesson-1': {
      title: 'Choisir une paire liquide vs payer un spread élevé',
      subtitle: 'Observez comment les prix Bid et Ask influencent votre trade dès l’ouverture.',
      pairBadge: 'EUR/USD (Trade 5 000 $)',
      correctSummary: 'Choisissez une paire très active (EUR/USD) avec un spread minuscule de 0,02 %.',
      correctOutcome: '+49,00 $ de gain net (coût du spread : seulement 1,00 $)',
      correctSteps: [
        {title: 'Comparer Bid et Ask', caption: 'Ask à 1,0602 et Bid à 1,0600 — un écart de 2 pips (1 $ de coût).'},
        {title: 'Acheter au prix Ask', caption: 'Votre trade démarre à -1,00 $, donc le seuil de rentabilité est immédiat.'},
        {title: 'Le prix monte de +1 %', caption: 'La revente au Bid conserve presque toute la hausse en profit.'},
      ],
      mistakeSummary: 'Trader un actif peu liquide avec un énorme spread de 1,50 %.',
      mistakeOutcome: '-25,00 $ de perte même si le prix a MONTÉ de +1 % !',
      mistakeSteps: [
        {title: 'Ignorer le spread large', caption: 'Ask à 101,50 $ contre Bid à 100,00 $ — 75 $ perdus à l’entrée.'},
        {title: 'Entrée trop coûteuse', caption: 'Le marché doit monter de +1,5 % rien que pour revenir à 0 $.'},
        {title: 'Un rebond de +1 % ne suffit pas', caption: 'Même après +1 %, le Bid reste sous votre prix d’achat.'},
      ],
    },
    'lesson-2': {
      title: 'Combiner Ordre Limite, Stop-Loss et Take-Profit',
      subtitle: 'Laissez les ordres automatiques acheter un repli et sécuriser vos gains.',
      pairBadge: 'BTC/USD (Trade 2 000 $)',
      correctSummary: 'Placez un Achat Limite patient sur un repli avec Stop-Loss et Take-Profit 1:2.',
      correctOutcome: '+178,00 $ sécurisés automatiquement (+8,9 % au Take-Profit)',
      correctSteps: [
        {title: 'Attendre avec l’ordre Limite', caption: 'BTC est à 91 500 $. Vous placez un achat limite à 89 500 $.'},
        {title: 'Exécution sur le repli', caption: 'Le prix touche 89 500 $ : Stop-Loss (87 500 $) et TP (93 500 $) s’activent.'},
        {title: 'Objectif atteint à 93 500 $', caption: 'La position se clôture toute seule avec un gain net sans stress.'},
      ],
      mistakeSummary: 'Acheter au marché après une hausse rapide sans aucun Stop-Loss.',
      mistakeOutcome: '-240,00 $ de perte non maîtrisée (-12 % sans protection)',
      mistakeSteps: [
        {title: 'Poursuivre le sommet', caption: 'Vous cliquez sur Acheter au marché à 93 500 $ après un pic.'},
        {title: 'Oublier le Stop-Loss', caption: 'Quand BTC retombe vers 89 500 $, aucune limite n’arrête la perte.'},
        {title: 'Vendre dans la panique', caption: 'À 82 300 $, la peur provoque une lourde clôture manuelle.'},
      ],
    },
    'lesson-3': {
      title: 'Vérifier Bitcoin d’abord & réduire la taille en Crypto',
      subtitle: 'Voyez comment les altcoins suivent Bitcoin avec des variations plus fortes.',
      pairBadge: 'BTC/USD + SOL/USD',
      correctSummary: 'Vérifiez la hausse de BTC, puis ouvrez une taille modérée sur SOL.',
      correctOutcome: '+140,00 $ de gain avec des oscillations maîtrisées',
      correctSteps: [
        {title: 'Regarder BTC/USD d’abord', caption: 'Bitcoin tient son support et repart à la hausse.'},
        {title: 'Adapter la taille au risque', caption: 'SOL étant 2x plus volatil, vous n’engagez que 1 500 $ au lieu de 10 000 $.'},
        {title: 'Profiter de l’élan haussier', caption: 'SOL progresse de +9,3 % sans stress lors des respirations.'},
      ],
      mistakeSummary: 'Miser gros sur un altcoin pendant que Bitcoin est en baisse.',
      mistakeOutcome: '-950,00 $ de lourde perte : l’altcoin chute 2x plus vite que BTC',
      mistakeSteps: [
        {title: 'Ignorer la baisse de BTC', caption: 'Bitcoin enchaîne des sommets plus bas, mais vous achetez SOL.'},
        {title: 'Position surdimensionnée', caption: 'Vous engagez 10 000 $ sur SOL comme s’il bougeait lentement.'},
        {title: 'Chute amplifiée', caption: 'BTC recule de -4,5 % et entraîne SOL à -9,5 %.'},
      ],
    },
    'lesson-4': {
      title: 'Lire une paire de devises & calculer les Pips',
      subtitle: 'Comprenez la devise de Base vs Cotation et suivez la valeur des pips.',
      pairBadge: 'EUR/USD (Taille 10 000 $)',
      correctSummary: 'Achetez EUR/USD si l’Euro monte, vendez si le Dollar se renforce.',
      correctOutcome: '+37,70 $ de gain sur un mouvement de +40 pips',
      correctSteps: [
        {title: 'Identifier la devise de Base', caption: 'EUR est en premier : vous achetez si l’Euro doit battre le Dollar.'},
        {title: 'Entrée à 1,0560', caption: 'Position ouverte avec Stop-Loss à 1,0540 (20 pips de risque).'},
        {title: 'Gain de +40 pips à 1,0600', caption: 'Chaque pip rapporte ~0,94 $, soit +37,70 $ propres.'},
      ],
      mistakeSummary: 'Cliquer sur Acheter EUR/USD alors qu’on prévoit un Dollar plus fort.',
      mistakeOutcome: '-37,70 $ de perte en allant dans le sens opposé',
      mistakeSteps: [
        {title: 'Prévision d’un Dollar fort', caption: 'Vous pensez que le USD monte, mais vous achetez EUR/USD par erreur.'},
        {title: 'La paire baisse', caption: 'Un Dollar fort fait baisser EUR/USD de 1,0600 à 1,0560.'},
        {title: '-40 pips contre vous', caption: 'Retenez : si la 2e devise (USD) monte, la paire baisse.'},
      ],
    },
    'lesson-5': {
      title: 'Attendre la clôture de bougie & lire les mèches',
      subtitle: 'Observez une bougie de 15 min se former pour éviter les faux signaux.',
      pairBadge: 'ETH/USD · Bougie 15m',
      correctSummary: 'Attendez la clôture avec une longue mèche basse avant d’entrer.',
      correctOutcome: '+160,00 $ de profit sur un rebond confirmé',
      correctSteps: [
        {title: 'Test du support en cours', caption: 'À mi-bougie, le prix glisse à 3 080 $ et paraît rouge.'},
        {title: 'Rejet net des acheteurs', caption: 'Avant la clôture, les acheteurs remontent à 3 145 $ (longue mèche basse).'},
        {title: 'Entrée après confirmation', caption: 'Vous achetez à l’ouverture suivante vers 3 225 $.'},
      ],
      mistakeSummary: 'Vendre dans la panique avant même la clôture de la bougie.',
      mistakeOutcome: '-110,00 $ de perte pile au point bas de la mèche',
      mistakeSteps: [
        {title: 'Peur sur une mèche rouge', caption: 'Il reste 8 minutes et ETH passe brièvement sous le support.'},
        {title: 'Vente précipitée', caption: 'Vous vendez à 3 085 $ sans attendre la clôture 15m.'},
        {title: 'Rebond immédiat', caption: 'La bougie clôture verte en marteau et piège votre vente.'},
      ],
    },
    'lesson-6': {
      title: 'Aligner la tendance SMA 20 et le timing RSI',
      subtitle: 'Utilisez moyenne mobile et RSI ensemble pour éviter d’acheter trop haut.',
      pairBadge: 'SOL/USD · SMA 20 + RSI(14)',
      correctSummary: 'Achetez sur repli près de la SMA 20 montante quand le RSI revient vers 42.',
      correctOutcome: '+210,00 $ dans le sens de la tendance',
      correctSteps: [
        {title: 'Valider la pente SMA 20', caption: 'Le prix évolue au-dessus d’une SMA 20 clairement orientée en hausse.'},
        {title: 'Attendre la pause RSI (42)', caption: 'Un petit repli ramène le prix vers la SMA 20 sans surchauffe.'},
        {title: 'Rebond propre', caption: 'Le prix repart depuis la SMA 20 et le RSI remonte de 42 à 64.'},
      ],
      mistakeSummary: 'Acheter loin au-dessus de la SMA 20 quand le RSI dépasse 80.',
      mistakeOutcome: '-145,00 $ piégé par un repli de surachat',
      mistakeSteps: [
        {title: 'Ignorer le RSI à 82', caption: 'SOL vient de grimper de +12 % très loin de sa SMA 20.'},
        {title: 'Achat au sommet', caption: 'Vous achetez juste quand les premiers acheteurs prennent leurs gains.'},
        {title: 'Retour vers la moyenne', caption: 'Le prix corrige vers la SMA 20 et touche votre Stop-Loss.'},
      ],
    },
    'lesson-7': {
      title: 'La magie du risque 1 % et du ratio 1:2 sur 5 trades',
      subtitle: 'Voyez comment réussir seulement 2 trades sur 5 reste rentable !',
      pairBadge: 'Compte 100 000 $ · 5 Trades',
      correctSummary: 'Risquez 1 % (1 000 $) pour viser 2 % (2 000 $) : 2 gains et 3 pertes = positif.',
      correctOutcome: '+1 000,00 $ de gain net (Capital à 101 000 $)',
      correctSteps: [
        {title: 'Trades 1 & 2 perdants (-1k chacun)', caption: 'Deux Stop-Loss contrôlés laissent 98 000 $ intacts.'},
        {title: 'Trade 3 gagnant (+2 000 $)', caption: 'Un seul objectif 1:2 efface les DEUX pertes précédentes (100 000 $).'},
        {title: 'Trades 4 & 5 (-1k puis +2k)', caption: 'Avec seulement 40 % de réussite, le compte monte à 101 000 $.'},
      ],
      mistakeSummary: 'Miser 20 % par trade avec fort levier sans règle fixe.',
      mistakeOutcome: '-36 000,00 $ perdus en deux mauvais trades seulement',
      mistakeSteps: [
        {title: 'Mise énorme de 20 %', caption: 'Un levier 10x sans Stop-Loss coûte -20 000 $ d’un coup.'},
        {title: 'Trade de revanche', caption: 'Vous remisez gros pour vous refaire vite : -16 000 $ de plus.'},
        {title: 'Capital fragilisé', caption: 'Il faut désormais +56 % de gains juste pour revenir à zéro.'},
      ],
    },
    'lesson-8': {
      title: 'Appliquer la stratégie Retour sur Tendance pas à pas',
      subtitle: 'Suivez les 3 vérifications simples des traders disciplinés.',
      pairBadge: 'EUR/USD · Plan 1H',
      correctSummary: 'Tendance SMA 20 → Attendre le repli calme → Entrer avec Stop & objectif 2R.',
      correctOutcome: '+300,00 $ de gain net (Risque 150 $ → Gain 300 $)',
      correctSteps: [
        {title: 'Identifier la tendance nette', caption: 'Creux et sommets montants au-dessus de la SMA 20.'},
        {title: 'Acheter le repli à 1,0580', caption: 'Entrée calme sur support avec Stop-Loss serré à 1,0565.'},
        {title: 'Sortir à l’objectif 1,0610', caption: '+30 pips sécurisés pour seulement 15 pips de risque.'},
      ],
      mistakeSummary: 'Courir après une grande bougie verte déjà loin du support.',
      mistakeOutcome: '-300,00 $ perdus lors d’un simple repli normal',
      mistakeSteps: [
        {title: 'Entrée tardive par FOMO', caption: 'Vous achetez à 1,0615 tout en haut d’une accélération.'},
        {title: 'Repli technique normal', caption: 'Le prix redescend à 1,0580 là où les patients achètent.'},
        {title: 'Stop touché avant la hausse', caption: 'Vous perdez -300 $ exactement au niveau où il fallait acheter.'},
      ],
    },
  },

  es: {
    'lesson-1': {
      title: 'Elegir un par líquido vs. pagar un spread alto',
      subtitle: 'Observa cómo los precios Bid y Ask afectan tu operación al instante.',
      pairBadge: 'EUR/USD (Operación $5,000)',
      correctSummary: 'Elige un par muy líquido (EUR/USD) con un spread mínimo de 0.02%.',
      correctOutcome: '+$49.00 ganancia neta (costo de spread: solo $1.00)',
      correctSteps: [
        {title: 'Compara Bid y Ask', caption: 'Ask 1.0602 y Bid 1.0600 — diferencia de 2 pips (costo de $1).'},
        {title: 'Compra al Ask (1.0602)', caption: 'Inicias en -$1.00, por lo que llegas a equilibrio casi al instante.'},
        {title: 'El precio sube +1%', caption: 'Al vender en Bid conservas casi toda la subida como ganancia.'},
      ],
      mistakeSummary: 'Operar una moneda con poco volumen y un spread enorme de 1.50%.',
      mistakeOutcome: '-$25.00 de pérdida ¡incluso cuando el precio SUBIÓ +1%!',
      mistakeSteps: [
        {title: 'Ignorar el spread alto', caption: 'Ask $101.50 vs Bid $100.00 — pierdes $75 solo al entrar.'},
        {title: 'Entrada muy cara', caption: 'El precio debe subir +1.5% solo para empatar en $0.'},
        {title: 'Un +1% no alcanza', caption: 'Incluso tras subir +1%, el Bid sigue por debajo de tu compra.'},
      ],
    },
    'lesson-2': {
      title: 'Usar Orden Límite, Stop-Loss y Take-Profit juntos',
      subtitle: 'Deja órdenes automáticas para comprar retrocesos y asegurar ganancias.',
      pairBadge: 'BTC/USD (Operación $2,000)',
      correctSummary: 'Coloca una Compra Límite en un retroceso con Stop-Loss y Take-Profit 1:2.',
      correctOutcome: '+$178.00 asegurados automáticamente (+8.9% en Take-Profit)',
      correctSteps: [
        {title: 'Espera con Orden Límite', caption: 'BTC está en $91,500. Pones Compra Límite en $89,500 sin perseguir.'},
        {title: 'El retroceso activa tu orden', caption: 'Al tocar $89,500 se activan tu Stop-Loss ($87,500) y TP ($93,500).'},
        {title: 'Take-Profit en $93,500', caption: 'El precio sube y cierra automáticamente en tu meta sin estrés.'},
      ],
      mistakeSummary: 'Comprar a mercado tras un pico vertical sin colocar Stop-Loss.',
      mistakeOutcome: '-$240.00 pérdida sin límite (-12% sin protección)',
      mistakeSteps: [
        {title: 'Perseguir la subida', caption: 'Compras a mercado en $93,500 justo tras una vela verde grande.'},
        {title: 'Omitir el Stop-Loss', caption: 'Cuando BTC cae a $89,500 no hay nada que frene tu pérdida.'},
        {title: 'Vender por pánico', caption: 'En $82,300 el miedo te hace cerrar con una gran pérdida.'},
      ],
    },
    'lesson-3': {
      title: 'Revisar Bitcoin primero y reducir tamaño en Cripto',
      subtitle: 'Mira cómo las altcoins siguen a Bitcoin con movimientos más amplios.',
      pairBadge: 'BTC/USD + SOL/USD',
      correctSummary: 'Confirma tendencia alcista en BTC y opera SOL con un monto prudente.',
      correctOutcome: '+$140.00 de ganancia con volatilidad controlada',
      correctSteps: [
        {title: 'Revisa BTC/USD primero', caption: 'Bitcoin rebota con fuerza sobre soporte: el mercado acompaña.'},
        {title: 'Usa tamaño moderado', caption: 'SOL se mueve 2x más rápido, así que operas $1,500 en vez de $10,000.'},
        {title: 'Aprovecha la continuación', caption: 'SOL sube +9.3% y los retrocesos normales no te sacan.'},
      ],
      mistakeSummary: 'Apostar grande en una altcoin mientras Bitcoin está cayendo.',
      mistakeOutcome: '-$950.00 pérdida fuerte: la altcoin cae 2x más rápido que BTC',
      mistakeSteps: [
        {title: 'Ignorar caída de BTC', caption: 'Bitcoin marca mínimos decrecientes, pero compras SOL igual.'},
        {title: 'Tamaño excesivo', caption: 'Metes $10,000 en SOL pensando que se mueve lento como Forex.'},
        {title: 'Caída doble', caption: 'BTC baja -4.5% y arrastra a SOL un -9.5% en poco tiempo.'},
      ],
    },
    'lesson-4': {
      title: 'Entender pares de divisas y calcular Pips',
      subtitle: 'Distingue moneda Base vs. Cotizada y convierte pips en dólares.',
      pairBadge: 'EUR/USD (Tamaño $10,000)',
      correctSummary: 'Compra EUR/USD si sube el Euro; vende si se fortalece el Dólar.',
      correctOutcome: '+$37.70 de ganancia con un movimiento de +40 pips',
      correctSteps: [
        {title: 'Lee la moneda Base', caption: 'EUR va primero: compras si esperas que el Euro supere al Dólar.'},
        {title: 'Compra en 1.0560', caption: 'Entrada fijada con Stop-Loss 20 pips abajo en 1.0540.'},
        {title: 'Suma +40 pips a 1.0600', caption: 'Cada pip en $10k vale ~$0.94: +$37.70 asegurados.'},
      ],
      mistakeSummary: 'Comprar EUR/USD cuando en realidad esperas que suba el Dólar.',
      mistakeOutcome: '-$37.70 de pérdida por operar al revés',
      mistakeSteps: [
        {title: 'Esperar Dólar fuerte', caption: 'Crees que USD subirá, pero por error haces clic en COMPRAR EUR/USD.'},
        {title: 'El par baja', caption: 'Un Dólar fuerte hace caer EUR/USD de 1.0600 a 1.0560.'},
        {title: '-40 pips en contra', caption: 'Recuerda: si sube la segunda divisa (USD), el par BAJA.'},
      ],
    },
    'lesson-5': {
      title: 'Esperar el cierre de vela y leer mechas de rechazo',
      subtitle: 'Observa cómo se forma una vela de 15m para evitar salidas por pánico.',
      pairBadge: 'ETH/USD · Vela 15m',
      correctSummary: 'Espera que cierre la vela con mecha inferior larga antes de entrar.',
      correctOutcome: '+$160.00 de ganancia siguiendo el rebote confirmado',
      correctSteps: [
        {title: 'Prueba de soporte', caption: 'A mitad de vela, el precio baja a $3,080 y se ve roja.'},
        {title: 'Rechazo comprador', caption: 'Antes del cierre 15m, compradores empujan a $3,145 dejando mecha larga.'},
        {title: 'Entra tras confirmación', caption: 'Compras en la siguiente vela rumbo a $3,225.'},
      ],
      mistakeSummary: 'Vender por miedo antes de que termine de cerrarse la vela.',
      mistakeOutcome: '-$110.00 de pérdida justo en la punta de la mecha',
      mistakeSteps: [
        {title: 'Pánico en vela sin cerrar', caption: 'Faltan 8 minutos y ETH cae brevemente bajo el soporte.'},
        {title: 'Venta apresurada', caption: 'Vendes en $3,085 sin esperar el cierre de 15 minutos.'},
        {title: 'Rebote inmediato', caption: 'La vela cierra verde tipo Martillo y te deja atrapado.'},
      ],
    },
    'lesson-6': {
      title: 'Combinar tendencia SMA 20 + momento RSI',
      subtitle: 'Usa media móvil y RSI juntos para no comprar en zonas agotadas.',
      pairBadge: 'SOL/USD · SMA 20 + RSI(14)',
      correctSummary: 'Compra en retrocesos hacia la SMA 20 alcista con RSI cerca de 42.',
      correctOutcome: '+$210.00 en continuación limpia de tendencia',
      correctSteps: [
        {title: 'Confirma tendencia SMA 20', caption: 'El precio se mantiene sobre una SMA 20 ascendente.'},
        {title: 'Espera alivio en RSI (42)', caption: 'En vez de comprar con RSI > 75, espera un descanso cerca de SMA 20.'},
        {title: 'Impulso a favor', caption: 'Rebota desde SMA 20 mientras RSI sube sano de 42 a 64.'},
      ],
      mistakeSummary: 'Comprar muy lejos de la SMA 20 cuando el RSI marca 82.',
      mistakeOutcome: '-$145.00 atrapado en un retroceso por sobrecompra',
      mistakeSteps: [
        {title: 'Ignorar RSI extremo (82)', caption: 'SOL ya subió +12% muy separado de su SMA 20.'},
        {title: 'Comprar en el techo', caption: 'Entras justo cuando otros toman ganancias.'},
        {title: 'Regreso a la media', caption: 'El precio corrige hacia la SMA 20 y activa tu Stop-Loss.'},
      ],
    },
    'lesson-7': {
      title: 'Regla del 1% y Beneficio 1:2 en 5 operaciones',
      subtitle: '¡Mira cómo ganar solo 2 de 5 operaciones sigue haciendo crecer tu cuenta!',
      pairBadge: 'Cuenta $100,000 · 5 Trades',
      correctSummary: 'Arriesga 1% ($1,000) para ganar 2% ($2,000): 2 aciertos / 3 fallos = ganancia.',
      correctOutcome: '+$1,000.00 crecimiento neto ($101,000)',
      correctSteps: [
        {title: 'Trades 1 y 2 pierden (-$1k c/u)', caption: 'Dos Stop-Loss controlados dejan $98,000 intactos.'},
        {title: 'Trade 3 gana (+$2,000)', caption: 'Un Take-Profit 1:2 recupera AMBAS pérdidas previas ($100,000).'},
        {title: 'Trades 4 y 5: -1k y +2k', caption: 'Con solo 40% de acierto, tu cuenta sube a $101,000.'},
      ],
      mistakeSummary: 'Arriesgar 20% por operación con alto apalancamiento sin control.',
      mistakeOutcome: '-$36,000.00 de caída tras solo dos malas rachas ($64,000)',
      mistakeSteps: [
        {title: 'Sobreapuesta del 20%', caption: 'Apalancamiento 10x sin Stop-Loss cuesta -$20,000 de golpe.'},
        {title: 'Operar por revancha', caption: 'Vuelves a apostar fuerte para recuperar y pierdes -$16,000 más.'},
        {title: 'Cuenta dañada', caption: 'Ahora necesitas ganar +56% solo para volver a empezar.'},
      ],
    },
    'lesson-8': {
      title: 'Ejecutar la estrategia Retroceso en Tendencia paso a paso',
      subtitle: 'Sigue la lista exacta de 3 pasos antes de cada entrada.',
      pairBadge: 'EUR/USD · Plan 1H',
      correctSummary: 'SMA 20 alcista → Esperar retroceso calmo → Entrar con Stop y meta 2R.',
      correctOutcome: '+$300.00 ganancia neta 1:2 (Riesgo $150 → Ganancia $300)',
      correctSteps: [
        {title: 'Detectar estructura alcista', caption: 'Máximos y mínimos crecientes sobre la SMA 20.'},
        {title: 'Comprar retroceso en 1.0580', caption: 'Entrada ordenada en soporte con Stop-Loss en 1.0565.'},
        {title: 'Cerrar en meta 1.0610', caption: '+30 pips ganados arriesgando solo 15 pips.'},
      ],
      mistakeSummary: 'Perseguir una vela vertical lejos del soporte por miedo a perderla.',
      mistakeOutcome: '-$300.00 sacado por un retroceso completamente normal',
      mistakeSteps: [
        {title: 'Entrar por FOMO arriba', caption: 'Compras en 1.0615 lejos de la SMA 20 tras un salto rápido.'},
        {title: 'Retroceso técnico normal', caption: 'El precio vuelve a 1.0580 donde esperan los compradores.'},
        {title: 'Stop tocado antes de subir', caption: 'Pierdes -$300 justo en el nivel donde debías comprar.'},
      ],
    },
  },

  ar: {
    'lesson-1': {
      title: 'اختيار زوج عالي السيولة مقابل دفع سبريد مرتفع',
      subtitle: 'شاهد كيف يؤثر سعر العرض (Bid) والطلب (Ask) على صفقتك فور الضغط على شراء.',
      pairBadge: 'EUR/USD (صفقة $5,000)',
      correctSummary: 'اختر زوجاً نشطاً مثل EUR/USD بفارق سبريد صغير جداً 0.02%.',
      correctOutcome: '+$49.00 ربح صافي (تكلفة السبريد كانت $1.00 فقط)',
      correctSteps: [
        {title: 'قارن سعر الطلب والعرض', caption: 'الطلب 1.0602 والعرض 1.0600 — فجوة صغيرة بمقدار نقطتين ($1 فقط).'},
        {title: 'الشراء بسعر الطلب', caption: 'تبدأ الصفقة عند -$1.00 فتصل لنقطة التعادل بسرعة كبيرة.'},
        {title: 'ارتفاع السعر +1%', caption: 'البيع بسعر العرض يحتفظ بمعظم الحركة كربح صافٍ.'},
      ],
      mistakeSummary: 'تداول عملة ضعيفة السيولة بفارق سبريد ضخم يبلغ 1.50%.',
      mistakeOutcome: '-$25.00 خسارة رغم أن السعر ارتفع +1%!',
      mistakeSteps: [
        {title: 'تجاهل اتساع السبريد', caption: 'الطلب $101.50 والعرض $100.00 — تخسر $75 فور الدخول.'},
        {title: 'دخول مكلف جداً', caption: 'يجب أن يرتفع السعر 1.5% فقط لتعود إلى $0.'},
        {title: 'صعود +1% لا يكفي', caption: 'حتى بعد ارتداد +1%، يظل سعر البيع أقل من سعر شرائك.'},
      ],
    },
    'lesson-2': {
      title: 'استخدام الأمر المحدد ووقف الخسارة وجني الربح معاً',
      subtitle: 'اترك الأوامر التلقائية تشتري عند الهبوط وتؤمّن أرباحك دون مراقبة مستمرة.',
      pairBadge: 'BTC/USD (صفقة $2,000)',
      correctSummary: 'ضع أمر شراء محدد بصبر عند التراجع مع وقف خسارة وجني ربح 1:2.',
      correctOutcome: '+$178.00 ربح محجوز تلقائياً (+8.9% عند جني الربح)',
      correctSteps: [
        {title: 'انتظر بأمر الشراء المحدد', caption: 'بيتكوين عند $91,500. تضع أمر شراء عند $89,500 بدل المطاردة.'},
        {title: 'التراجع يفعّل الصفقة', caption: 'يلامس السعر $89,500 ويتفعل وقف الخسارة ($87,500) والهدف ($93,500).'},
        {title: 'تحقق الهدف عند $93,500', caption: 'تُغلق الصفقة تلقائياً على ربح ممتاز دون توتر.'},
      ],
      mistakeSummary: 'الشراء بأمر سوق بعد قفزة سريعة وبدون وضع وقف خسارة.',
      mistakeOutcome: '-$240.00 خسارة مفتوحة (-12% هبوط بدون حماية)',
      mistakeSteps: [
        {title: 'مطاردة القمة', caption: 'تشتري فوراً بسعر $93,500 بعد شمعة خضراء سريعة.'},
        {title: 'تجاهل وقف الخسارة', caption: 'عندما يتراجع السعر نحو $89,500 لا يوجد ما يوقف النزيف.'},
        {title: 'البيع بذعر في القاع', caption: 'يهبط السعر إلى $82,300 فتغلق بخسارة يدوية كبيرة.'},
      ],
    },
    'lesson-3': {
      title: 'فحص بيتكوين أولاً وتقليل الحجم في العملات الرقمية',
      subtitle: 'لاحظ كيف تتبع العملات البديلة اتجاه بيتكوين بتقلبات مضاعفة.',
      pairBadge: 'BTC/USD + SOL/USD',
      correctSummary: 'تأكد من صعود بيتكوين أولاً ثم تداول سولانا بحجم متوازن يراعي التقلب.',
      correctOutcome: '+$140.00 ربح مع تقلب هادئ ومحكوم',
      correctSteps: [
        {title: 'افحص BTC/USD أولاً', caption: 'بيتكوين يتماسك فوق الدعم ويتجه صعوداً — المزاج العام إيجابي.'},
        {title: 'صغّر الحجم للتقلب', caption: 'لأن SOL أسرع بمرتين، تدخل بـ $1,500 بدل $10,000.'},
        {title: 'استفد من موجة الصعود', caption: 'ترتفع SOL بنسبة +9.3% دون أن تُخرجك التراجعات العادية.'},
      ],
      mistakeSummary: 'الدخول بحجم ضخم في عملة بديلة بينما بيتكوين في اتجاه هابط.',
      mistakeOutcome: '-$950.00 خسارة ثقيلة لأن البديلة تهبط أسرع بمرتين',
      mistakeSteps: [
        {title: 'تجاهل هبوط بيتكوين', caption: 'بيتكوين يسجل قيعاناً هابطة ومع ذلك تشتري SOL.'},
        {title: 'حجم صفقة مبالغ فيه', caption: 'تضع $10,000 في SOL وكأنها زوج عملات بطيء.'},
        {title: 'هبوط مضاعف', caption: 'يتراجع بيتكوين -4.5% فيهوي بسولانا -9.5% مباشرة.'},
      ],
    },
    'lesson-4': {
      title: 'قراءة أزواج الفوركس وحساب قيمة النقاط (Pips)',
      subtitle: 'افهم العملة الأساسية مقابل عملة التسعير وشاهد كيف تتحول النقاط إلى دولارات.',
      pairBadge: 'EUR/USD (حجم $10,000)',
      correctSummary: 'اشترِ EUR/USD عند قوة اليورو، وبِع عندما يقوى الدولار.',
      correctOutcome: '+$37.70 ربح من حركة صعودية بمقدار +40 نقطة',
      correctSteps: [
        {title: 'اقرأ الزوج بشكل صحيح', caption: 'اليورو هو الأول (الأساس): تشتري إذا توقعت ارتفاع اليورو أمام الدولار.'},
        {title: 'شراء عند 1.0560', caption: 'دخول محمي بوقف خسارة 20 نقطة أسفل عند 1.0540.'},
        {title: 'احسب +40 نقطة إلى 1.0600', caption: 'كل نقطة على $10k تساوي ~$0.94 فتجني +$37.70 بهدوء.'},
      ],
      mistakeSummary: 'الضغط على شراء EUR/USD بينما تتوقع صعود الدولار الأمريكي.',
      mistakeOutcome: '-$37.70 خسارة بسبب التداول في الاتجاه المعاكس',
      mistakeSteps: [
        {title: 'توقع دولار قوي', caption: 'تتوقع صعود الدولار لكنك تشتري EUR/USD بالخطأ.'},
        {title: 'الزوج يهبط بدلاً من الصعود', caption: 'قوة الدولار تدفع EUR/USD للهبوط من 1.0600 إلى 1.0560.'},
        {title: '-40 نقطة ضدك', caption: 'تذكر: قوة العملة الثانية (USD) تجعل الزوج يهبط.'},
      ],
    },
    'lesson-5': {
      title: 'انتظار إغلاق الشمعة وقراءة ذيول الرفض',
      subtitle: 'راقب تشكل شمعة 15 دقيقة لترى لماذا ينقذك انتظار الإغلاق.',
      pairBadge: 'ETH/USD · شمعة 15د',
      correctSummary: 'انتظر إغلاق الشمعة بذيل سفلي طويل يؤكد دخول المشترين.',
      correctOutcome: '+$160.00 ربح من ارتداد مؤكد',
      correctSteps: [
        {title: 'اختبار البائعين للدعم', caption: 'في منتصف الشمعة يهبط السعر إلى $3,080 ويبدو أحمر مخيفاً.'},
        {title: 'رفض قوي من المشترين', caption: 'قبل الإغلاق يدفع المشترون السعر إلى $3,145 تاركين ذيلاً طويلاً.'},
        {title: 'الدخول بعد التأكيد', caption: 'تشتري مع افتتاح الشمعة التالية نحو $3,225.'},
      ],
      mistakeSummary: 'البيع بذعر قبل انتهاء وقت الشمعة واكتمال المعركة.',
      mistakeOutcome: '-$110.00 خسارة عند أدنى نقطة في الذيل',
      mistakeSteps: [
        {title: 'خوف مبكر قبل الإغلاق', caption: 'مع بقاء 8 دقائق، يكسر ETH الدعم للحظات.'},
        {title: 'بيع متسرع', caption: 'تفتح بيعاً عند $3,085 دون انتظار إغلاق شمعة 15 دقيقة.'},
        {title: 'ارتداد سريع', caption: 'تغلق الشمعة خضراء على شكل مطرقة وتحبسك في الاتجاه الخاطئ.'},
      ],
    },
    'lesson-6': {
      title: 'الجمع بين اتجاه SMA 20 وتوقيت مؤشر RSI',
      subtitle: 'شاهد كيف يمنعك المتوسط المتحرك ومؤشر الزخم من الشراء في القمم.',
      pairBadge: 'SOL/USD · SMA 20 + RSI(14)',
      correctSummary: 'اشترِ عند عودة السعر نحو SMA 20 الصاعد مع هدوء RSI قرب 42.',
      correctOutcome: '+$210.00 ربح مع استمرار الاتجاه',
      correctSteps: [
        {title: 'تأكيد صعود SMA 20', caption: 'السعر يتحرك بثبات فوق متوسط SMA 20 الصاعد.'},
        {title: 'انتظار تهدئة RSI (42)', caption: 'بدل الشراء عند RSI > 75، انتظر تراجعاً هادئاً نحو المتوسط.'},
        {title: 'انطلاقة جديدة', caption: 'يرتد السعر من SMA 20 ويرتفع RSI من 42 إلى 64.'},
      ],
      mistakeSummary: 'الشراء والسعر بعيد جداً فوق SMA 20 ومؤشر RSI عند 82.',
      mistakeOutcome: '-$145.00 خسارة في تصحيح طبيعي بعد التشبع',
      mistakeSteps: [
        {title: 'تجاهل تشبع RSI (82)', caption: 'قفزت SOL بالفعل +12% وابتعدت كثيراً عن SMA 20.'},
        {title: 'الشراء عند الذروة', caption: 'تدخل تماماً لحظة بدء جني الأرباح.'},
        {title: 'عودة السعر للمتوسط', caption: 'يهبط السعر نحو SMA 20 ويضرب وقف الخسارة.'},
      ],
    },
    'lesson-7': {
      title: 'رياضيات قاعدة 1% وعائد 1:2 خلال 5 صفقات',
      subtitle: 'شاهد كيف ينمو حسابك حتى لو نجحت صفقتان فقط من أصل 5!',
      pairBadge: 'حساب $100,000 · 5 صفقات',
      correctSummary: 'خاطر بـ 1% ($1,000) لربح 2% ($2,000): صفقتان رابحتان و3 خاسرات = ربح صافٍ.',
      correctOutcome: '+$1,000.00 نمو صافٍ للحساب ($101,000)',
      correctSteps: [
        {title: 'خسارة الصفقتين 1 و2 (-$1k لكل منهما)', caption: 'وقف خسارة منضبط يبقي الرصيد عند $98,000 بأمان تام.'},
        {title: 'ربح الصفقة 3 (+$2,000)', caption: 'هدف واحد 1:2 يمحو الخسارتين السابقتين تماماً ($100,000).'},
        {title: 'الصفقتان 4 و5 (-1k ثم +2k)', caption: 'بنسبة نجاح 40% فقط يرتفع الرصيد إلى $101,000!'},
      ],
      mistakeSummary: 'المخاطرة بـ 20% في الصفقة مع رافعة عالية وبدون قواعد.',
      mistakeOutcome: '-$36,000.00 تراجع قاسٍ بعد خسارتين عاديتين ($64,000 متبقية)',
      mistakeSteps: [
        {title: 'مخاطرة 20% بالصفقة 1', caption: 'رافعة 10x بدون وقف خسارة تسبب ضربة -$20,000 فوراً.'},
        {title: 'تداول انتقامي للتعويض', caption: 'تراهن بحجم كبير لتعويض الخسارة فتخسر -$16,000 إضافية.'},
        {title: 'استنزاف الحساب', caption: 'تحتاج الآن إلى +56% ربح لمجرد العودة لنقطة البداية.'},
      ],
    },
    'lesson-8': {
      title: 'تطبيق استراتيجية الارتداد مع الاتجاه خطوة بخطوة',
      subtitle: 'اتبع قائمة التحقق البسيطة من 3 خطوات قبل أي صفقة.',
      pairBadge: 'EUR/USD · خطة ساعة واحدة',
      correctSummary: 'اتجاه صاعد فوق SMA 20 ← انتظار التراجع الهادئ ← دخول بوقف وهدف 2R.',
      correctOutcome: '+$300.00 ربح 1:2 نظيف (مخاطرة $150 ← ربح $300)',
      correctSteps: [
        {title: 'رصد الهيكل الصاعد', caption: 'قمم وقيعان صاعدة بثبات فوق متوسط SMA 20.'},
        {title: 'شراء التراجع عند 1.0580', caption: 'دخول هادئ قرب الدعم مع وقف خسارة محكم عند 1.0565.'},
        {title: 'الإغلاق عند الهدف 1.0610', caption: 'جني +30 نقطة مقابل مخاطرة 15 نقطة فقط.'},
      ],
      mistakeSummary: 'مطاردة شمعة صعود عمودية بعيدة عن الدعم بدافع الخوف من فوات الفرصة.',
      mistakeOutcome: '-$300.00 خروج مبكر بسبب تراجع تصحيحي طبيعي',
      mistakeSteps: [
        {title: 'دخول متأخر في القمة', caption: 'تشتري عند 1.0615 بعيداً جداً عن SMA 20.'},
        {title: 'تصحيح فني طبيعي', caption: 'يعود السعر بهدوء إلى 1.0580 حيث ينتظر المشترون.'},
        {title: 'ضرب الوقف قبل الصعود', caption: 'تخسر -$300 عند نفس السعر الذي كان عليك الشراء منه.'},
      ],
    },
  },
};
```

### `src/index.css`

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  :root {
    --font-display: 'Plus Jakarta Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif;
    --font-sans: 'DM Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, .font-display {
    font-family: var(--font-display);
  }

  .font-mono {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

@keyframes panelEnter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-panel-enter {
  animation: panelEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes checkPop {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  70% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-check-pop {
  animation: checkPop 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### `src/main.tsx`

```tsx
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {LanguageProvider} from './i18n/LanguageContext';
import './index.css';

if ('serviceWorker' in navigator) {
  registerSW({immediate: true});
}

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
```

### `src/types/trading.ts`

```ts
export type AssetClass = 'crypto' | 'forex';

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export interface Instrument {
  symbol: string;
  name: string;
  base: string;
  quote: string;
  assetClass: AssetClass;
  decimals: number;
  pipSize: number;
  typicalSpreadPct: number;
  beginnerNote: string;
}

export interface MarketQuote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  open24h: number;
  high24h: number;
  low24h: number;
  change24hPct: number;
  volume24h: number;
  source: 'live-api' | 'live-feed';
  updatedAt: number;
}

export interface Candle {
  time: number; // unix ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  quantity: number; // units of base asset
  notionalUsd: number;
  marginUsd: number;
  leverage: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: number;
  strategyTag?: string;
}

export interface PendingOrder {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  notionalUsd: number;
  leverage: number;
  limitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  createdAt: number;
}

export interface TradeLog {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  side: OrderSide;
  quantity: number;
  notionalUsd: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  realizedPnl: number;
  returnPct: number;
  closeReason: 'manual' | 'stop-loss' | 'take-profit' | 'liquidation';
  openedAt: number;
  closedAt: number;
  feeUsd: number;
}

export interface EquityPoint {
  time: number;
  equity: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  note?: string;
  active: boolean;
  recurring: boolean;
  createdAt: number;
  lastTriggeredAt?: number;
}

export interface AppNotification {
  id: string;
  category: 'market-alert' | 'portfolio-update' | 'learning';
  title: string;
  body: string;
  symbol?: string;
  timestamp: number;
  read: boolean;
}

export interface NotificationPrefs {
  pushEnabled: boolean;
  marketAlerts: boolean;
  orderFills: boolean;
  stopTakeTriggers: boolean;
  equityMilestones: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type SimulatorKind =
  | 'spread-lab'
  | 'order-sandbox'
  | 'pip-calculator'
  | 'candlestick-anatomy'
  | 'position-sizer'
  | 'indicator-lab';

export interface LessonSection {
  heading: string;
  body: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  number: number;
  title: string;
  level: 'Beginner' | 'Intermediate';
  durationMinutes: number;
  summary: string;
  practiceSymbol: string;
  sections: LessonSection[];
  simulator: SimulatorKind;
  quiz: QuizQuestion[];
}

export interface LessonProgress {
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  lastAttemptAt?: number;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  activeDays: string[];
}

export type StrategyId =
  | 'head-shoulders'
  | 'double-bottom'
  | 'breakout-retest'
  | 'bull-flag'
  | 'rsi-divergence';

export type StrategyCategory = 'reversal' | 'continuation' | 'momentum';

export type DailyMissionId = 'long-trade' | 'risk-guard' | 'strategy-guide' | 'academy-quiz';

export interface DailyMissionsState {
  dateKey: string;
  totalXp: number;
  completedIds: DailyMissionId[];
  bonusClaimedDate: string | null;
}

export type AchievementId =
  | 'first-trade'
  | 'perfect-quiz'
  | 'streak-7'
  | 'risk-protector'
  | 'playbook-collector'
  | 'course-graduate';

export interface AchievementStatus {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt?: number;
  current: number;
  target: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  lessonXp: number;
  missionXp: number;
  totalXp: number;
  level: number;
  rank: number;
  isCurrentUser: boolean;
}

export type AppTab = 'overview' | 'trade' | 'academy' | 'strategies' | 'alerts';
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client", "vite-plugin-pwa/client"],
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "exclude": ["dist"]
}
```

### `vite.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          id: '/',
          name: 'Meridian Trading Academy',
          short_name: 'Meridian',
          description: 'Beginner-friendly crypto and forex trading academy with live market data, paper trading, interactive quizzes, and push alerts.',
          theme_color: '#0B0F17',
          background_color: '#0B0F17',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: process.env.DISABLE_HMR !== 'true',
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
```
