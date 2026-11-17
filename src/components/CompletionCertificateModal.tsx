import React, {useEffect, useMemo, useState} from 'react';
import {Award, CheckCircle2, Download, Printer, ShieldCheck, X} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {Lesson, LessonProgress} from '../types/trading';

interface CompletionCertificateModalProps {
  open: boolean;
  onClose: () => void;
  onPracticeMarkets: () => void;
  lessons: Lesson[];
  progress: Record<string, LessonProgress>;
  learnerName: string;
  onUpdateLearnerName: (name: string) => void;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const CompletionCertificateModal: React.FC<CompletionCertificateModalProps> = ({
  open,
  onClose,
  onPracticeMarkets,
  lessons,
  progress,
  learnerName,
  onUpdateLearnerName,
}) => {
  const {t, lang, dir} = useLanguage();
  const [nameInput, setNameInput] = useState(learnerName);

  useEffect(() => {
    setNameInput(learnerName);
  }, [learnerName, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const stats = useMemo(() => {
    let earnedScore = 0;
    let totalQuestions = 0;
    let latestTs = 0;
    let completedCount = 0;

    for (const lesson of lessons) {
      const p = progress[lesson.id];
      const qCount = p?.totalQuestions || lesson.quiz.length;
      if (p?.completed) {
        completedCount += 1;
        earnedScore += p.bestScore > 0 ? p.bestScore : qCount;
        totalQuestions += qCount;
        if (p.lastAttemptAt && p.lastAttemptAt > latestTs) {
          latestTs = p.lastAttemptAt;
        }
      }
    }

    const accuracyPct =
      totalQuestions > 0 ? Math.min(100, Math.round((earnedScore / totalQuestions) * 100)) : 100;
    const completionDate = new Date(latestTs || Date.now());
    const formattedDate = new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(completionDate);

    const yr = completionDate.getFullYear();
    const hashSeed = ((latestTs || 202605) % 8999) + 1000;
    const credentialId = `MRD-${yr}-${String(lessons.length).padStart(2, '0')}C-${hashSeed}`;

    return {
      completedCount,
      totalCount: lessons.length,
      accuracyPct,
      formattedDate,
      credentialId,
    };
  }, [lessons, progress, lang]);

  const resolvedRecipient = nameInput.trim() || t.leaderboard.selfDefaultName;

  const handleNameChange = (val: string) => {
    setNameInput(val);
    onUpdateLearnerName(val.slice(0, 32));
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    const W = 1600;
    const H = 1130;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Archival ivory paper backdrop
    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, W, H);

    // Subtle geometric dot matrix watermark
    ctx.fillStyle = 'rgba(15, 23, 42, 0.035)';
    for (let x = 80; x < W - 60; x += 36) {
      for (let y = 80; y < H - 60; y += 36) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Outer deep slate hairline border + inner emerald/gold accent border
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.strokeRect(44, 44, W - 88, H - 88);

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    // Corner precision ticks
    const corners: Array<[number, number, number, number]> = [
      [60, 60, 1, 1],
      [W - 60, 60, -1, 1],
      [60, H - 60, 1, -1],
      [W - 60, H - 60, -1, -1],
    ];
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 3;
    for (const [cx, cy, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * 28);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * 28, cy);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    if ('direction' in ctx) {
      (ctx as CanvasRenderingContext2D & {direction: CanvasDirection}).direction = dir;
    }

    // Brand crest + Issuer
    ctx.fillStyle = '#059669';
    ctx.font = '700 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.certificate.issuerLabel.toUpperCase(), W / 2, 138);

    // Main heading
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 58px Georgia, "Times New Roman", serif';
    ctx.fillText(t.certificate.certHeading, W / 2, 214);

    // Subheading
    ctx.fillStyle = '#475569';
    ctx.font = '600 23px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.certificate.certSubheading, W / 2, 260);

    // Divider hairline
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(460, 296);
    ctx.lineTo(W - 460, 296);
    ctx.stroke();

    // Presented to label
    ctx.fillStyle = '#64748B';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.certificate.certPresentedTo, W / 2, 356);

    // Recipient name
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 64px Georgia, "Times New Roman", serif';
    ctx.fillText(resolvedRecipient, W / 2, 444);

    // Underline under recipient
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 472);
    ctx.lineTo(W - 400, 472);
    ctx.stroke();

    // Body citation wrapped cleanly
    ctx.fillStyle = '#334155';
    ctx.font = '400 23px system-ui, -apple-system, sans-serif';
    const bodyLines = wrapCanvasText(ctx, t.certificate.certBody, 1080);
    bodyLines.forEach((line, idx) => {
      ctx.fillText(line, W / 2, 536 + idx * 36);
    });

    // 4-Metric verification strip
    const boxY = 675;
    const boxW = 1220;
    const boxX = (W - boxW) / 2;
    const colW = boxW / 4;
    ctx.fillStyle = '#F4F1EA';
    ctx.fillRect(boxX, boxY, boxW, 126);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boxX, boxY, boxW, 126);

    const metricItems = [
      {
        label: t.certificate.coursesCompletedLabel,
        value: `${stats.completedCount} / ${stats.totalCount}`,
      },
      {
        label: t.certificate.quizAccuracyLabel,
        value: `${stats.accuracyPct}%`,
      },
      {
        label: t.certificate.completionDateLabel,
        value: stats.formattedDate,
      },
      {
        label: t.certificate.credentialIdLabel,
        value: stats.credentialId,
      },
    ];

    metricItems.forEach((m, i) => {
      const cx = boxX + colW * i + colW / 2;
      if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(boxX + colW * i, boxY + 20);
        ctx.lineTo(boxX + colW * i, boxY + 106);
        ctx.stroke();
      }
      ctx.fillStyle = '#64748B';
      ctx.font = '600 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(m.label, cx, boxY + 48);
      ctx.fillStyle = '#0F172A';
      ctx.font = '700 24px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(m.value, cx, boxY + 88);
    });

    // Bottom Seal & Signature Row
    const footerY = 936;
    // Left signature
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(220, footerY);
    ctx.lineTo(540, footerY);
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.certificate.boardTitle, 380, footerY + 34);

    // Center gold/emerald verified medallion
    const sealX = W / 2;
    const sealY = footerY - 8;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 54, 0, Math.PI * 2);
    ctx.fillStyle = '#059669';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
    ctx.strokeStyle = '#FCFBF7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Upward trend vector inside seal
    ctx.beginPath();
    ctx.moveTo(sealX - 24, sealY + 12);
    ctx.lineTo(sealX - 8, sealY - 2);
    ctx.lineTo(sealX + 4, sealY + 8);
    ctx.lineTo(sealX + 24, sealY - 14);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Right verification note
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W - 540, footerY);
    ctx.lineTo(W - 220, footerY);
    ctx.stroke();
    ctx.fillStyle = '#059669';
    ctx.font = '700 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(t.certificate.verifiedLabel, W - 380, footerY + 34);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian-certificate-${stats.credentialId.toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-heading"
    >
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] shadow-2xl overflow-hidden my-auto animate-panel-enter">
        {/* Celebratory Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-500/8 dark:bg-emerald-950/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.certificate.congratsBadge}</span>
              </div>
              <h2
                id="certificate-modal-heading"
                className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5"
              >
                {t.certificate.congratsTitle}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl">
                {t.certificate.congratsSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name Customizer + Certificate Sheet */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <label className="block flex-1 max-w-sm space-y-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {t.certificate.recipientLabel}
              </span>
              <input
                type="text"
                maxLength={32}
                value={nameInput}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t.certificate.recipientPlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.certificate.downloadPngBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.certificate.printPdfBtn}</span>
              </button>
            </div>
          </div>

          {/* Printable Institutional Certificate Sheet */}
          <div className="certificate-print-sheet relative rounded-xl bg-[#FCFBF7] text-slate-900 border-2 border-slate-900 p-3 sm:p-4 shadow-md">
            <div className="border border-emerald-700/70 rounded-lg px-5 py-7 sm:px-10 sm:py-9 text-center space-y-5 relative">
              {/* Precision corner accents */}
              <span className="absolute top-0 start-0 w-4 h-4 border-t-2 border-s-2 border-amber-700" aria-hidden="true" />
              <span className="absolute top-0 end-0 w-4 h-4 border-t-2 border-e-2 border-amber-700" aria-hidden="true" />
              <span className="absolute bottom-0 start-0 w-4 h-4 border-b-2 border-s-2 border-amber-700" aria-hidden="true" />
              <span className="absolute bottom-0 end-0 w-4 h-4 border-b-2 border-e-2 border-amber-700" aria-hidden="true" />

              <div className="space-y-1.5">
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-700">
                  {t.certificate.issuerLabel}
                </p>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  {t.certificate.certHeading}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {t.certificate.certSubheading}
                </p>
              </div>

              <div className="w-24 h-px bg-slate-300 mx-auto" />

              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-xs text-slate-500">{t.certificate.certPresentedTo}</p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-950 border-b-2 border-emerald-600/75 inline-block px-6 pb-1">
                  {resolvedRecipient}
                </p>
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pt-1">
                  {t.certificate.certBody}
                </p>
              </div>

              {/* Verification Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-300/90 rounded-lg bg-[#F4F1EA] divide-y sm:divide-y-0 sm:divide-x divide-slate-300/90 text-center">
                <div className="p-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.certificate.coursesCompletedLabel}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900 tabular-nums mt-0.5 block" dir="ltr">
                    {stats.completedCount} / {stats.totalCount}
                  </span>
                </div>
                <div className="p-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.certificate.quizAccuracyLabel}
                  </span>
                  <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums mt-0.5 block" dir="ltr">
                    {stats.accuracyPct}%
                  </span>
                </div>
                <div className="p-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.certificate.completionDateLabel}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 tabular-nums mt-0.5 block">
                    {stats.formattedDate}
                  </span>
                </div>
                <div className="p-3">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {t.certificate.credentialIdLabel}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 tabular-nums mt-0.5 block" dir="ltr">
                    {stats.credentialId}
                  </span>
                </div>
              </div>

              {/* Footer Signatures + Seal */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <div className="border-t border-slate-400 pt-2 mx-auto w-44">
                  <span className="text-[11px] font-semibold text-slate-800">{t.certificate.boardTitle}</span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-700 text-white ring-4 ring-emerald-700/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="border-t border-slate-400 pt-2 mx-auto w-44">
                  <span className="text-[11px] font-semibold text-emerald-700">{t.certificate.verifiedLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.common.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onPracticeMarkets();
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {t.certificate.continuePracticeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
