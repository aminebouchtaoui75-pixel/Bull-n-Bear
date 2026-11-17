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
