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
