import {useCallback, useEffect, useState} from 'react';
import {TRADING_STRATEGIES} from '../data/strategies';
import type {StrategyId} from '../types/trading';

const PLAYBOOK_KEY = 'meridian_trading_playbook_v1';
const VALID_IDS = new Set<StrategyId>(TRADING_STRATEGIES.map((s) => s.id));

function readSavedStrategies(): StrategyId[] {
  try {
    const raw = localStorage.getItem(PLAYBOOK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is StrategyId => VALID_IDS.has(id as StrategyId));
  } catch {
    return [];
  }
}

export function useTradingPlaybook() {
  const [savedIds, setSavedIds] = useState<StrategyId[]>(readSavedStrategies);

  useEffect(() => {
    localStorage.setItem(PLAYBOOK_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleBookmark = useCallback((id: StrategyId) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
    );
  }, []);

  const removeBookmark = useCallback((id: StrategyId) => {
    setSavedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const isSaved = useCallback((id: StrategyId) => savedIds.includes(id), [savedIds]);

  return {
    savedIds,
    isSaved,
    toggleBookmark,
    removeBookmark,
  };
}
