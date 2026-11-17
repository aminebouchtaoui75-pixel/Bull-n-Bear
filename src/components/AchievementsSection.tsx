import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Award,
  BookmarkCheck,
  CandlestickChart,
  Check,
  CheckCircle2,
  Flame,
  GraduationCap,
  Lock,
  Share2,
  ShieldCheck,
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
    accentSurface: string;
    accentText: string;
  }
> = {
  'first-trade': {
    icon: CandlestickChart,
    accentSurface: 'bg-blue-500/12 border-blue-500/35',
    accentText: 'text-blue-600 dark:text-blue-400',
  },
  'perfect-quiz': {
    icon: Award,
    accentSurface: 'bg-amber-500/12 border-amber-500/35',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  'streak-7': {
    icon: Flame,
    accentSurface: 'bg-orange-500/12 border-orange-500/35',
    accentText: 'text-orange-600 dark:text-orange-400',
  },
  'risk-protector': {
    icon: ShieldCheck,
    accentSurface: 'bg-emerald-500/12 border-emerald-500/35',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  'playbook-collector': {
    icon: BookmarkCheck,
    accentSurface: 'bg-indigo-500/12 border-indigo-500/35',
    accentText: 'text-indigo-600 dark:text-indigo-400',
  },
  'course-graduate': {
    icon: GraduationCap,
    accentSurface: 'bg-emerald-500/14 border-emerald-500/40',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
};

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  unlockedCount,
  totalCount,
}) => {
  const {t, lang} = useLanguage();
  const [shareFeedback, setShareFeedback] = useState<{id: AchievementId; kind: 'shared' | 'copied'} | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const showTransientFeedback = useCallback((id: AchievementId, kind: 'shared' | 'copied') => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    setShareFeedback({id, kind});
    resetTimerRef.current = window.setTimeout(() => {
      setShareFeedback(null);
      resetTimerRef.current = null;
    }, 2500);
  }, []);

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

  const handleShareAchievement = async (item: AchievementStatus, copy: {title: string; desc: string}) => {
    if (!item.unlocked) return;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `${t.common.brand} — ${copy.title}`;
    const shareText = t.achievements.shareMessageTemplate
      .replace('{title}', copy.title)
      .replace('{desc}', copy.desc)
      .replace('{unlocked}', String(unlockedCount))
      .replace('{total}', String(totalCount));

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showTransientFeedback(item.id, 'shared');
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        // Fall through cleanly to clipboard copy if native share is unavailable or disallowed
      }
    }

    const fullCopy = shareUrl ? `${shareText} ${shareUrl}` : shareText;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullCopy);
        showTransientFeedback(item.id, 'copied');
        return;
      }
    } catch {
      // Fallback textarea copy below
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = fullCopy;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showTransientFeedback(item.id, 'copied');
    } catch {
      // Ignore copy failure in restricted contexts
    }
  };

  return (
    <section className="rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-[#0F1623]/90 backdrop-blur-[2px] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-white truncate">
            {t.achievements.sectionTitle}
          </h2>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums me-1" dir="ltr">
            {unlockedCount}/{totalCount}
          </span>
          <span>{t.achievements.unlockedCountLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200/75 dark:bg-slate-800/75">
        {achievements.map((item) => {
          const meta = BADGE_META[item.id];
          const Icon = meta.icon;
          const copy = getBadgeCopy(item.id);
          const activeFeedback = shareFeedback?.id === item.id ? shareFeedback.kind : null;

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#0F1623] p-4 flex flex-col justify-between gap-3 transition-colors ${
                item.unlocked ? '' : 'opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                    item.unlocked
                      ? `${meta.accentSurface} ${meta.accentText}`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-slate-400 dark:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {copy.title}
                    </p>
                    {item.unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.unlockedAt && dateFmt.format(new Date(item.unlockedAt))}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums shrink-0" dir="ltr">
                        <Lock className="w-2.5 h-2.5" />
                        {item.current}
                        {copy.unit}/{item.target}
                        {copy.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {copy.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  disabled={!item.unlocked}
                  title={!item.unlocked ? t.achievements.unlockToShare : undefined}
                  onClick={() => void handleShareAchievement(item, copy)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    !item.unlocked
                      ? 'border-slate-200/80 dark:border-slate-800/80 bg-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : activeFeedback
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 cursor-pointer'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] text-slate-700 dark:text-slate-200 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer'
                  }`}
                >
                  {activeFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{activeFeedback === 'shared' ? t.achievements.sharedLabel : t.achievements.copiedLabel}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.achievements.shareBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
