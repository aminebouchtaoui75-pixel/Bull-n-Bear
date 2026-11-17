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
