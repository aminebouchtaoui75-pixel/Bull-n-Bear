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
