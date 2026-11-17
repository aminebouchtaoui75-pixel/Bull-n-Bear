import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Compass, X} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  targetRef: React.RefObject<HTMLElement | null>;
  preferredSide?: 'right' | 'left' | 'bottom' | 'top';
}

interface GuidedTradingOverlayProps {
  open: boolean;
  steps: GuidedStep[];
  stepIndex: number;
  onStepChange: (index: number) => void;
  onComplete: () => void;
}

interface RectBox {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

const SPOTLIGHT_PAD = 6;
const VIEWPORT_MARGIN = 16;
const TOOLTIP_GAP = 14;

export const GuidedTradingOverlay: React.FC<GuidedTradingOverlayProps> = ({
  open,
  steps,
  stepIndex,
  onStepChange,
  onComplete,
}) => {
  const {t, dir} = useLanguage();
  const isRtl = dir === 'rtl';
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [targetRect, setTargetRect] = useState<RectBox | null>(null);
  const [cardSize, setCardSize] = useState<{width: number; height: number}>({width: 336, height: 220});
  const [viewport, setViewport] = useState<{width: number; height: number}>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  const currentStep = steps[stepIndex];

  const measureTarget = useCallback(() => {
    if (!open || !currentStep) return;
    const el = currentStep.targetRef.current;
    setViewport({width: window.innerWidth, height: window.innerHeight});
    if (!el) {
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setTargetRect(null);
      return;
    }
    const top = Math.max(0, rect.top - SPOTLIGHT_PAD);
    const left = Math.max(0, rect.left - SPOTLIGHT_PAD);
    const right = Math.min(window.innerWidth, rect.right + SPOTLIGHT_PAD);
    const bottom = Math.min(window.innerHeight, rect.bottom + SPOTLIGHT_PAD);
    setTargetRect({
      top,
      left,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
      right,
      bottom,
    });
  }, [open, currentStep]);

  // Smoothly scroll step target into view when step changes or tour opens
  useEffect(() => {
    if (!open || !currentStep) return;
    const el = currentStep.targetRef.current;
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
    }
    let rafId = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureTarget);
    };
    scheduleMeasure();
    // Re-measure shortly after smooth scroll settles
    const settleTimer = window.setTimeout(scheduleMeasure, 240);

    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('scroll', scheduleMeasure, true);

    let ro: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleMeasure);
      ro.observe(el);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('scroll', scheduleMeasure, true);
      ro?.disconnect();
    };
  }, [open, currentStep, stepIndex, measureTarget]);

  useLayoutEffect(() => {
    if (!open || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setCardSize((prev) =>
        Math.abs(prev.width - rect.width) > 1 || Math.abs(prev.height - rect.height) > 1
          ? {width: rect.width, height: rect.height}
          : prev
      );
    }
  }, [open, stepIndex, currentStep?.title, currentStep?.description]);

  // Keyboard navigation: Escape dismisses tour
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onComplete]);

  if (!open || !currentStep) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  // Compute smart viewport-clamped tooltip position
  const cardWidth = Math.min(340, viewport.width - VIEWPORT_MARGIN * 2);
  const cardHeight = cardSize.height;

  const computeCardPosition = (): {top: number; left: number} => {
    if (!targetRect) {
      return {
        top: Math.max(VIEWPORT_MARGIN, (viewport.height - cardHeight) / 2),
        left: Math.max(VIEWPORT_MARGIN, (viewport.width - cardWidth) / 2),
      };
    }

    const isMobile = viewport.width < 768;
    const spaceRight = viewport.width - targetRect.right - VIEWPORT_MARGIN;
    const spaceLeft = targetRect.left - VIEWPORT_MARGIN;
    const spaceBottom = viewport.height - targetRect.bottom - VIEWPORT_MARGIN;
    const spaceTop = targetRect.top - VIEWPORT_MARGIN;

    const preferred = currentStep.preferredSide ?? 'bottom';
    let placement: 'right' | 'left' | 'bottom' | 'top' = preferred;

    if (isMobile) {
      placement = spaceBottom >= cardHeight + TOOLTIP_GAP || spaceBottom >= spaceTop ? 'bottom' : 'top';
    } else {
      const fitsRight = spaceRight >= cardWidth + TOOLTIP_GAP;
      const fitsLeft = spaceLeft >= cardWidth + TOOLTIP_GAP;
      const fitsBottom = spaceBottom >= cardHeight + TOOLTIP_GAP;
      const fitsTop = spaceTop >= cardHeight + TOOLTIP_GAP;

      if (preferred === 'right' && !fitsRight) {
        placement = fitsLeft ? 'left' : fitsBottom ? 'bottom' : fitsTop ? 'top' : 'right';
      } else if (preferred === 'left' && !fitsLeft) {
        placement = fitsRight ? 'right' : fitsBottom ? 'bottom' : fitsTop ? 'top' : 'left';
      } else if (preferred === 'bottom' && !fitsBottom) {
        placement = fitsTop ? 'top' : fitsRight ? 'right' : fitsLeft ? 'left' : 'bottom';
      } else if (preferred === 'top' && !fitsTop) {
        placement = fitsBottom ? 'bottom' : fitsRight ? 'right' : fitsLeft ? 'left' : 'top';
      }
    }

    let top = VIEWPORT_MARGIN;
    let left = VIEWPORT_MARGIN;

    if (placement === 'right') {
      left = targetRect.right + TOOLTIP_GAP;
      top = targetRect.top + Math.min(32, targetRect.height * 0.15);
    } else if (placement === 'left') {
      left = targetRect.left - cardWidth - TOOLTIP_GAP;
      top = targetRect.top + Math.min(32, targetRect.height * 0.15);
    } else if (placement === 'top') {
      top = targetRect.top - cardHeight - TOOLTIP_GAP;
      left = targetRect.left + (targetRect.width - cardWidth) / 2;
    } else {
      top = targetRect.bottom + TOOLTIP_GAP;
      left = targetRect.left + (targetRect.width - cardWidth) / 2;
    }

    // Clamp strictly inside viewport bounds
    const maxLeft = Math.max(VIEWPORT_MARGIN, viewport.width - cardWidth - VIEWPORT_MARGIN);
    const maxTop = Math.max(VIEWPORT_MARGIN, viewport.height - cardHeight - VIEWPORT_MARGIN);
    left = Math.min(Math.max(VIEWPORT_MARGIN, left), maxLeft);
    top = Math.min(Math.max(VIEWPORT_MARGIN, top), maxTop);

    return {top, left};
  };

  const cardPos = computeCardPosition();
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      dir={dir}
      role="dialog"
      aria-modal="false"
      aria-label={t.trade.guideTitle}
    >
      {/* 4 non-overlapping scrim cutouts so the spotlighted element remains directly interactive */}
      {targetRect ? (
        <>
          {/* Top scrim */}
          <div
            className="fixed left-0 right-0 top-0 bg-slate-950/55 dark:bg-black/65 pointer-events-auto transition-all duration-200"
            style={{height: targetRect.top}}
          />
          {/* Bottom scrim */}
          <div
            className="fixed left-0 right-0 bottom-0 bg-slate-950/55 dark:bg-black/65 pointer-events-auto transition-all duration-200"
            style={{top: targetRect.bottom}}
          />
          {/* Left scrim */}
          <div
            className="fixed left-0 bg-slate-950/55 dark:bg-black/65 pointer-events-auto transition-all duration-200"
            style={{
              top: targetRect.top,
              height: targetRect.height,
              width: targetRect.left,
            }}
          />
          {/* Right scrim */}
          <div
            className="fixed right-0 bg-slate-950/55 dark:bg-black/65 pointer-events-auto transition-all duration-200"
            style={{
              top: targetRect.top,
              height: targetRect.height,
              left: targetRect.right,
            }}
          />
          {/* Highlight ring around target */}
          <div
            className="fixed rounded-xl border-2 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)] pointer-events-none transition-all duration-200"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-slate-950/55 dark:bg-black/65 pointer-events-auto" />
      )}

      {/* Contextual Tooltip Card */}
      <div
        ref={cardRef}
        className="fixed z-10 pointer-events-auto rounded-xl border border-slate-200 dark:border-slate-700/90 bg-white dark:bg-[#0F1623] shadow-2xl p-4 space-y-3.5 transition-all duration-200"
        style={{
          top: cardPos.top,
          left: cardPos.left,
          width: cardWidth,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
              {t.trade.guideTitle}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono tabular-nums text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t.trade.guideStepLabel} {stepIndex + 1} {t.trade.guideOfLabel} {steps.length}
            </span>
            <button
              type="button"
              onClick={onComplete}
              aria-label={t.trade.guideSkip}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step body */}
        <div className="space-y-1.5 text-start">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-snug">
            {currentStep.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Thin segmented progress bar */}
        <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`}}>
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepChange(idx)}
              aria-label={`${t.trade.guideStepLabel} ${idx + 1}`}
              className={`h-1 rounded-sm transition-colors cursor-pointer ${
                idx <= stepIndex
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            onClick={onComplete}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.trade.guideSkip}
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {!isFirst && (
              <button
                type="button"
                onClick={() => onStepChange(Math.max(0, stepIndex - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PrevIcon className="w-3.5 h-3.5" />
                {t.trade.guideBack}
              </button>
            )}
            {isLast ? (
              <button
                type="button"
                onClick={onComplete}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.trade.guideFinish}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStepChange(Math.min(steps.length - 1, stepIndex + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.trade.guideNext}
                <NextIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
