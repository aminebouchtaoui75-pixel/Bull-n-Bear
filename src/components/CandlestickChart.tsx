import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {Bell, BellOff, GripHorizontal, X} from 'lucide-react';
import {INSTRUMENT_MAP, formatPrice} from '../data/instruments';
import type {Candle, Position, PriceAlert} from '../types/trading';
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
  alerts?: PriceAlert[];
  onUpdateAlert?: (id: string, targetPrice: number, condition: 'above' | 'below') => void;
  onToggleAlert?: (id: string) => void;
  onDeleteAlert?: (id: string) => void;
  chartMode: 'candles' | 'line';
  indicators: IndicatorConfig;
  theme: 'dark' | 'light';
}

interface DragState {
  id: string;
  pointerId: number;
  startClientY: number;
  startY: number;
  hasMoved: boolean;
  previewPrice: number;
  previewCondition: 'above' | 'below';
  frozenMinP: number;
  frozenMaxP: number;
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

const PAD_RIGHT = 76;
const PAD_LEFT = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  candles,
  livePrice,
  positions,
  alerts = [],
  onUpdateAlert,
  onToggleAlert,
  onDeleteAlert,
  chartMode,
  indicators,
  theme,
}) => {
  const {t} = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoveredAlertId, setHoveredAlertId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [size, setSize] = useState({width: 800, height: 380});

  const decimals = INSTRUMENT_MAP.get(symbol)?.decimals ?? 2;

  const roundToDecimals = useCallback(
    (value: number) => Number(value.toFixed(decimals)),
    [decimals]
  );

  const symbolAlerts = useMemo(
    () => alerts.filter((a) => a.symbol === symbol),
    [alerts, symbol]
  );

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
    setDragState(null);
    setHoveredAlertId(null);
  }, [symbol]);

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

  const layout = useMemo(() => {
    const rsiHeight = indicators.rsi ? 76 : 0;
    const rsiGap = indicators.rsi ? 14 : 0;
    const plotW = Math.max(100, size.width - PAD_LEFT - PAD_RIGHT);
    const plotH = Math.max(120, size.height - PAD_TOP - PAD_BOTTOM - rsiHeight - rsiGap);
    return {rsiHeight, rsiGap, plotW, plotH};
  }, [indicators.rsi, size.width, size.height]);

  const naturalBounds = useMemo(() => {
    if (mergedCandles.length === 0) {
      return {minP: 0, maxP: 1, maxVol: 0};
    }

    let minP = Infinity;
    let maxP = -Infinity;
    let maxVol = 0;
    const count = mergedCandles.length;

    for (let i = 0; i < count; i++) {
      const c = mergedCandles[i];
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
      if (computed.boll?.upper[i]) maxP = Math.max(maxP, computed.boll.upper[i]!);
      if (computed.boll?.lower[i]) minP = Math.min(minP, computed.boll.lower[i]!);
    }

    const candleMid = (minP + maxP) / 2 || 1;

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

    for (const a of symbolAlerts) {
      if (Math.abs(a.targetPrice - candleMid) <= candleMid * 0.45) {
        minP = Math.min(minP, a.targetPrice);
        maxP = Math.max(maxP, a.targetPrice);
      }
    }

    const span = Math.max(maxP - minP, maxP * 0.002);
    return {
      minP: minP - span * 0.08,
      maxP: maxP + span * 0.08,
      maxVol,
    };
  }, [mergedCandles, computed.boll, positions, symbolAlerts, symbol]);

  const activeBounds = dragState
    ? {minP: dragState.frozenMinP, maxP: dragState.frozenMaxP, maxVol: naturalBounds.maxVol}
    : naturalBounds;

  const priceToY = useCallback(
    (p: number) => {
      const denom = activeBounds.maxP - activeBounds.minP || 1;
      return PAD_TOP + ((activeBounds.maxP - p) / denom) * layout.plotH;
    },
    [activeBounds.minP, activeBounds.maxP, layout.plotH]
  );

  const yToPrice = useCallback(
    (y: number, minP: number, maxP: number) => {
      const clampedY = Math.max(PAD_TOP, Math.min(PAD_TOP + layout.plotH, y));
      const ratio = (clampedY - PAD_TOP) / layout.plotH;
      const raw = maxP - ratio * (maxP - minP);
      return roundToDecimals(Math.max(0.00001, raw));
    },
    [layout.plotH, roundToDecimals]
  );

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
      alertAbove: isDark ? '#F59E0B' : '#D97706',
      alertBelow: isDark ? '#38BDF8' : '#0284C7',
      alertPaused: isDark ? '#64748B' : '#94A3B8',
    };

    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, size.width, size.height);

    const {plotW, plotH, rsiHeight, rsiGap} = layout;
    const {minP, maxP, maxVol} = activeBounds;

    const count = mergedCandles.length;
    const stepX = plotW / count;
    const candleW = Math.max(2, Math.min(12, stepX * 0.66));
    const idxToX = (i: number) => PAD_LEFT + (i + 0.5) * stepX;

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
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(size.width - PAD_RIGHT, y);
      ctx.stroke();

      ctx.fillStyle = colors.text;
      ctx.fillText(formatPrice(val, symbol), size.width - PAD_RIGHT + 6, y);
    }

    // Volume bars in bottom 18% of main plot
    const volMaxH = plotH * 0.18;
    for (let i = 0; i < count; i++) {
      const c = mergedCandles[i];
      const vh = maxVol > 0 ? (c.volume / maxVol) * volMaxH : 0;
      const x = idxToX(i) - candleW / 2;
      const y = PAD_TOP + plotH - vh;
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
      const grad = ctx.createLinearGradient(0, PAD_TOP, 0, PAD_TOP + plotH);
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

      ctx.lineTo(idxToX(count - 1), PAD_TOP + plotH);
      ctx.lineTo(idxToX(0), PAD_TOP + plotH);
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
        ctx.moveTo(PAD_LEFT, y);
        ctx.lineTo(size.width - PAD_RIGHT, y);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillText(label, PAD_LEFT + 6, y - 7);
        ctx.restore();
      };
      drawLevel(pos.entryPrice, '#3B82F6', `Entry (${pos.side.toUpperCase()})`);
      if (pos.stopLoss) drawLevel(pos.stopLoss, colors.down, 'Stop-Loss');
      if (pos.takeProfit) drawLevel(pos.takeProfit, colors.up, 'Take-Profit');
    }

    // Interactive Price Alert lines + right-axis price tags
    for (const alert of symbolAlerts) {
      const isDragging = dragState?.id === alert.id;
      const isHovered = hoveredAlertId === alert.id;
      const displayPrice = isDragging ? dragState.previewPrice : alert.targetPrice;
      const displayCondition = isDragging ? dragState.previewCondition : alert.condition;
      const rawY = priceToY(displayPrice);
      const y = Math.max(PAD_TOP + 2, Math.min(PAD_TOP + plotH - 2, rawY));

      const strokeCol =
        !alert.active && !isDragging
          ? colors.alertPaused
          : displayCondition === 'above'
            ? colors.alertAbove
            : colors.alertBelow;

      ctx.save();
      if (isDragging || isHovered) {
        ctx.fillStyle =
          displayCondition === 'above'
            ? 'rgba(245, 158, 11, 0.08)'
            : 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(PAD_LEFT, y - 8, plotW, 16);
      }

      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = isDragging ? 2 : isHovered ? 1.75 : 1.25;
      ctx.setLineDash(isDragging ? [8, 4] : alert.active ? [6, 4] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(size.width - PAD_RIGHT, y);
      ctx.stroke();
      ctx.restore();

      // Axis tag on right price scale
      ctx.save();
      ctx.fillStyle = strokeCol;
      ctx.fillRect(size.width - PAD_RIGHT + 2, y - 9, PAD_RIGHT - 4, 18);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(displayPrice, symbol), size.width - PAD_RIGHT + 6, y);
      ctx.restore();
    }

    // Live price line + pill tag on right axis (drawn after static alerts, or below dragging alert tag)
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
      ctx.moveTo(PAD_LEFT, y);
      ctx.lineTo(size.width - PAD_RIGHT, y);
      ctx.stroke();
      ctx.restore();

      if (!dragState) {
        ctx.fillStyle = tagCol;
        ctx.fillRect(size.width - PAD_RIGHT + 2, y - 9, PAD_RIGHT - 4, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatPrice(lp, symbol), size.width - PAD_RIGHT + 6, y);
      }
    }

    // Redraw actively dragged alert axis tag on top so live price never obscures dragged price
    if (dragState) {
      const rawY = priceToY(dragState.previewPrice);
      const y = Math.max(PAD_TOP + 2, Math.min(PAD_TOP + plotH - 2, rawY));
      const strokeCol = dragState.previewCondition === 'above' ? colors.alertAbove : colors.alertBelow;
      ctx.save();
      ctx.fillStyle = strokeCol;
      ctx.fillRect(size.width - PAD_RIGHT + 2, y - 10, PAD_RIGHT - 4, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(dragState.previewPrice, symbol), size.width - PAD_RIGHT + 6, y);
      ctx.restore();
    }

    // RSI Sub-pane
    if (indicators.rsi && computed.rsi.length > 0) {
      const rsiTop = PAD_TOP + plotH + rsiGap;
      ctx.strokeStyle = colors.grid;
      ctx.strokeRect(PAD_LEFT, rsiTop, plotW, rsiHeight);

      const y70 = rsiTop + ((100 - 70) / 100) * rsiHeight;
      const y30 = rsiTop + ((100 - 30) / 100) * rsiHeight;
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = isDark ? 'rgba(239,68,68,0.35)' : 'rgba(220,38,38,0.3)';
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y70);
      ctx.lineTo(PAD_LEFT + plotW, y70);
      ctx.stroke();

      ctx.strokeStyle = isDark ? 'rgba(16,185,129,0.35)' : 'rgba(5,150,105,0.3)';
      ctx.beginPath();
      ctx.moveTo(PAD_LEFT, y30);
      ctx.lineTo(PAD_LEFT + plotW, y30);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = colors.text;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('RSI 70', size.width - PAD_RIGHT + 6, y70);
      ctx.fillText('RSI 30', size.width - PAD_RIGHT + 6, y30);

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
      ctx.moveTo(x, PAD_TOP);
      ctx.lineTo(x, size.height - PAD_BOTTOM);
      ctx.stroke();
      ctx.restore();
    }
  }, [
    mergedCandles,
    size,
    theme,
    chartMode,
    indicators,
    computed,
    positions,
    symbolAlerts,
    symbol,
    hoverIndex,
    hoveredAlertId,
    dragState,
    layout,
    activeBounds,
    priceToY,
  ]);

  const activeCandle = hoverIndex !== null ? mergedCandles[hoverIndex] : mergedCandles[mergedCandles.length - 1];
  const activeRsi =
    hoverIndex !== null ? computed.rsi[hoverIndex] : computed.rsi[computed.rsi.length - 1];

  const updateHoverFromClientX = useCallback(
    (clientX: number) => {
      const canvas = canvasRef.current;
      if (!canvas || mergedCandles.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const rel = Math.max(0, Math.min(layout.plotW, x - PAD_LEFT));
      const idx = Math.min(
        mergedCandles.length - 1,
        Math.max(0, Math.floor((rel / layout.plotW) * mergedCandles.length))
      );
      setHoverIndex(idx);
    },
    [mergedCandles.length, layout.plotW]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateHoverFromClientX(e.clientX);
  };

  const handleAlertPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    alert: PriceAlert,
    clampedY: number
  ) => {
    if (!onUpdateAlert || e.button > 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const initialCondition =
      livePrice !== undefined ? (alert.targetPrice >= livePrice ? 'above' : 'below') : alert.condition;

    setDragState({
      id: alert.id,
      pointerId: e.pointerId,
      startClientY: e.clientY,
      startY: clampedY,
      hasMoved: false,
      previewPrice: alert.targetPrice,
      previewCondition: initialCondition,
      frozenMinP: naturalBounds.minP,
      frozenMaxP: naturalBounds.maxP,
    });
  };

  const handleAlertPointerMove = (e: React.PointerEvent<HTMLDivElement>, alert: PriceAlert) => {
    updateHoverFromClientX(e.clientX);
    if (!dragState || dragState.id !== alert.id || dragState.pointerId !== e.pointerId) return;

    const deltaY = e.clientY - dragState.startClientY;
    const movedEnough = dragState.hasMoved || Math.abs(deltaY) >= 2;
    const nextY = Math.max(PAD_TOP, Math.min(PAD_TOP + layout.plotH, dragState.startY + deltaY));
    const nextPrice = yToPrice(nextY, dragState.frozenMinP, dragState.frozenMaxP);
    const nextCondition =
      livePrice !== undefined ? (nextPrice >= livePrice ? 'above' : 'below') : alert.condition;

    setDragState((prev) =>
      prev && prev.id === alert.id
        ? {
            ...prev,
            hasMoved: movedEnough,
            previewPrice: nextPrice,
            previewCondition: nextCondition,
          }
        : prev
    );
  };

  const commitOrCancelDrag = (
    e: React.PointerEvent<HTMLDivElement>,
    alert: PriceAlert,
    commit: boolean
  ) => {
    if (!dragState || dragState.id !== alert.id || dragState.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const finalState = dragState;
    setDragState(null);

    if (
      commit &&
      finalState.hasMoved &&
      onUpdateAlert &&
      (finalState.previewPrice !== alert.targetPrice || finalState.previewCondition !== alert.condition)
    ) {
      onUpdateAlert(alert.id, finalState.previewPrice, finalState.previewCondition);
    }
  };

  const handleAlertKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, alert: PriceAlert) => {
    if (!onUpdateAlert) return;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();

    const span = Math.max(naturalBounds.maxP - naturalBounds.minP, naturalBounds.maxP * 0.002);
    const baseStep = Math.max(Math.pow(10, -decimals), roundToDecimals(span * 0.008));
    const step = e.shiftKey ? baseStep * 5 : baseStep;
    const dir = e.key === 'ArrowUp' ? 1 : -1;
    const nextPrice = roundToDecimals(Math.max(Math.pow(10, -decimals), alert.targetPrice + dir * step));
    const nextCondition =
      livePrice !== undefined ? (nextPrice >= livePrice ? 'above' : 'below') : alert.condition;

    onUpdateAlert(alert.id, nextPrice, nextCondition);
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

      <div ref={containerRef} className="relative w-full h-[360px] sm:h-[410px] overflow-hidden">
        {mergedCandles.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            {t.common.loadingChart}
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
              className="w-full h-full block cursor-crosshair"
            />

            {/* Interactive horizontal alert overlay handles */}
            {symbolAlerts.length > 0 && (
              <div className="absolute inset-0 pointer-events-none select-none">
                {symbolAlerts.map((alert) => {
                  const isDragging = dragState?.id === alert.id;
                  const isHovered = hoveredAlertId === alert.id;
                  const displayPrice = isDragging ? dragState.previewPrice : alert.targetPrice;
                  const displayCondition = isDragging ? dragState.previewCondition : alert.condition;
                  const rawY = priceToY(displayPrice);
                  const clampedY = Math.max(PAD_TOP + 2, Math.min(PAD_TOP + layout.plotH - 2, rawY));
                  const clampedAbove = rawY < PAD_TOP + 2;
                  const clampedBelow = rawY > PAD_TOP + layout.plotH - 2;

                  const toneClasses = !alert.active && !isDragging
                    ? 'border-slate-400/70 bg-slate-100/95 text-slate-700 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-300'
                    : displayCondition === 'above'
                      ? 'border-amber-500/80 bg-amber-50/95 text-amber-900 dark:border-amber-500/80 dark:bg-[#1E1910]/95 dark:text-amber-300'
                      : 'border-sky-500/80 bg-sky-50/95 text-sky-900 dark:border-sky-500/80 dark:bg-[#0D1E2E]/95 dark:text-sky-300';

                  return (
                    <div
                      key={alert.id}
                      role="slider"
                      tabIndex={0}
                      aria-label={`${symbol} ${
                        displayCondition === 'above' ? t.trade.alertAboveShort : t.trade.alertBelowShort
                      } ${formatPrice(displayPrice, symbol)}`}
                      aria-valuemin={roundToDecimals(activeBounds.minP)}
                      aria-valuemax={roundToDecimals(activeBounds.maxP)}
                      aria-valuenow={displayPrice}
                      onPointerEnter={() => setHoveredAlertId(alert.id)}
                      onPointerLeave={() =>
                        setHoveredAlertId((prev) => (prev === alert.id ? null : prev))
                      }
                      onPointerDown={(e) => handleAlertPointerDown(e, alert, clampedY)}
                      onPointerMove={(e) => handleAlertPointerMove(e, alert)}
                      onPointerUp={(e) => commitOrCancelDrag(e, alert, true)}
                      onPointerCancel={(e) => commitOrCancelDrag(e, alert, false)}
                      onKeyDown={(e) => handleAlertKeyDown(e, alert)}
                      style={{
                        top: `${clampedY}px`,
                        left: `${PAD_LEFT}px`,
                        right: `${PAD_RIGHT}px`,
                      }}
                      className={`group absolute -translate-y-1/2 h-5 pointer-events-auto touch-none flex items-center justify-end pr-1.5 focus:outline-none ${
                        onUpdateAlert ? 'cursor-ns-resize' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono tabular-nums shadow-xs backdrop-blur-xs transition-shadow ${toneClasses} ${
                          isDragging
                            ? 'ring-2 ring-blue-500/50 shadow-md scale-[1.02]'
                            : isHovered
                              ? 'shadow-sm'
                              : ''
                        }`}
                      >
                        <GripHorizontal className="w-3 h-3 opacity-60 shrink-0" aria-hidden="true" />
                        <span className="font-semibold">
                          {clampedAbove ? '▲ ' : clampedBelow ? '▼ ' : displayCondition === 'above' ? '≥ ' : '≤ '}
                          {formatPrice(displayPrice, symbol)}
                        </span>
                        {!alert.active && !isDragging && (
                          <span className="font-sans text-[10px] opacity-75">
                            ({t.trade.alertPausedTag})
                          </span>
                        )}
                        {onToggleAlert && (
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleAlert(alert.id);
                            }}
                            aria-label={t.trade.toggleAlertAria}
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            {alert.active ? (
                              <Bell className="w-3 h-3" />
                            ) : (
                              <BellOff className="w-3 h-3 opacity-75" />
                            )}
                          </button>
                        )}
                        {onDeleteAlert && (
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteAlert(alert.id);
                            }}
                            aria-label={t.trade.removeAlertAria}
                            className="p-0.5 rounded hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
