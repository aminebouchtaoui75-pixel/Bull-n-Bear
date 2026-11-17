import React, {useEffect, useRef, useState} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
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
import {CompletionCertificateModal} from './CompletionCertificateModal';
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
  learnerName: string;
  onUpdateLearnerName: (name: string) => void;
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

const CERT_SEEN_KEY = 'meridian_cert_congrats_seen_v1';

export const AcademyView: React.FC<AcademyViewProps> = ({
  progress,
  completedCount,
  totalLessons,
  currentUnlockedLessonId,
  isLessonUnlocked,
  streak,
  learnerName,
  onUpdateLearnerName,
  onRecordActivity,
  onRecordQuiz,
  onPracticeSymbol,
}) => {
  const {t, lessons, dir, lang} = useLanguage();
  const [activeLessonId, setActiveLessonId] = useState<string>(currentUnlockedLessonId);
  const [phase, setPhase] = useState<LessonPhase>('learn');
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [lockedNoticeTarget, setLockedNoticeTarget] = useState<{
    attemptedNumber: number;
    requiredNumber: number;
  } | null>(null);
  const stageTopRef = useRef<HTMLDivElement | null>(null);

  const allCompleted = totalLessons > 0 && completedCount === totalLessons;

  // Congratulate graduate once when all courses are completed; reset flag if progress resets/expands
  useEffect(() => {
    try {
      if (allCompleted) {
        if (localStorage.getItem(CERT_SEEN_KEY) !== 'true') {
          setCertModalOpen(true);
          localStorage.setItem(CERT_SEEN_KEY, 'true');
        }
      } else {
        localStorage.removeItem(CERT_SEEN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [allCompleted]);

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
            {/* Dynamic Multi-Step Visual Track */}
            <div
              className="grid gap-1"
              style={{gridTemplateColumns: `repeat(${lessons.length}, minmax(0, 1fr))`}}
              aria-hidden="true"
            >
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

          {/* Full Curriculum Completion & Certificate Banner */}
          {allCompleted && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/8 dark:bg-emerald-950/25 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg border border-emerald-500/35 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {t.certificate.congratsTitle}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {t.academy.allCoursesMasteredDesc}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{t.certificate.openCertificateBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPracticeSymbol(activeLesson.practiceSymbol)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    {t.academy.practiceOnChart} <span dir="ltr">{activeLesson.practiceSymbol}</span>
                  </span>
                  <NextArrow className="w-3.5 h-3.5" />
                </button>
              </div>
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

                {/* Final Course Graduation & Certificate Gate */}
                {!nextLesson && allCompleted && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/8 dark:bg-emerald-950/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {t.certificate.congratsTitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {t.certificate.congratsSubtitle}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{t.certificate.openCertificateBtn}</span>
                    </button>
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

      <CompletionCertificateModal
        open={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        onPracticeMarkets={() => onPracticeSymbol(activeLesson.practiceSymbol)}
        lessons={lessons}
        progress={progress}
        learnerName={learnerName}
        onUpdateLearnerName={onUpdateLearnerName}
      />
    </div>
  );
};
