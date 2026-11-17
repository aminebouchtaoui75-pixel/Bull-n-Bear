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
