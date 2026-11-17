import React, {useState} from 'react';
import {Check, ChevronDown, ChevronUp, Crown, Pencil, Trophy} from 'lucide-react';
import {useLanguage} from '../i18n/LanguageContext';
import type {LeaderboardEntry} from '../types/trading';

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry;
  aboveEntry: LeaderboardEntry | null;
  xpToNextRank: number;
  customName: string;
  onUpdateName: (name: string) => void;
  compact: boolean;
  onExpandSidebar: () => void;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  entries,
  userEntry,
  aboveEntry,
  xpToNextRank,
  customName,
  onUpdateName,
  compact,
  onExpandSidebar,
}) => {
  const {t} = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(customName);

  if (compact) {
    return (
      <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          type="button"
          onClick={onExpandSidebar}
          title={`${t.leaderboard.title} · #${userEntry.rank} (${userEntry.totalXp} XP)`}
          aria-label={`${t.leaderboard.title} #${userEntry.rank}`}
          className="relative w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-amber-500 transition-colors cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span
            dir="ltr"
            className="absolute top-1.5 end-1 font-mono text-[9px] font-bold text-slate-700 dark:text-slate-200 tabular-nums"
          >
            #{userEntry.rank}
          </span>
        </button>
      </div>
    );
  }

  const visibleEntries = showAll
    ? entries
    : entries.filter((e) => e.rank <= 3 || e.isCurrentUser);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(draftName);
    setEditing(false);
  };

  return (
    <div className="pt-4 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
      {/* Header Row */}
      <div className="px-2 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 truncate">
          <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="truncate">{t.leaderboard.title}</span>
        </span>
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums shrink-0" dir="ltr">
          #{userEntry.rank}/{entries.length}
        </span>
      </div>

      {/* User XP Summary & Inline Name Edit */}
      <div className="mx-1 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] p-2.5 space-y-2">
        {editing ? (
          <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder={t.leaderboard.selfDefaultName}
              maxLength={24}
              autoFocus
              className="min-w-0 flex-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-2 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              aria-label={t.leaderboard.saveName}
              className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shrink-0"
            >
              <Check className="w-3 h-3" />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {userEntry.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDraftName(customName);
                    setEditing(true);
                  }}
                  aria-label={t.leaderboard.editName}
                  title={t.leaderboard.editName}
                  className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                {t.leaderboard.lessonsShort}: <span dir="ltr">{userEntry.lessonXp}</span> ·{' '}
                {t.leaderboard.missionsShort}: <span dir="ltr">{userEntry.missionXp}</span>
              </div>
            </div>

            <div className="text-end shrink-0">
              <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums" dir="ltr">
                {userEntry.totalXp} XP
              </div>
              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 tabular-nums" dir="ltr">
                {t.leaderboard.levelPrefix}{userEntry.level}
              </div>
            </div>
          </div>
        )}

        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/70 dark:border-slate-800/80">
          {aboveEntry ? (
            <span>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums" dir="ltr">
                +{xpToNextRank}
              </span>{' '}
              {t.leaderboard.xpToNext} <span className="font-mono" dir="ltr">#{aboveEntry.rank}</span>
            </span>
          ) : (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t.leaderboard.topRankReached}
            </span>
          )}
        </div>
      </div>

      {/* Ranked Cohort Rows */}
      <div className="space-y-1">
        {visibleEntries.map((entry, index) => {
          const prevEntry = index > 0 ? visibleEntries[index - 1] : null;
          const hasGap = prevEntry && entry.rank - prevEntry.rank > 1;

          const rankColor =
            entry.rank === 1
              ? 'text-amber-500 dark:text-amber-400'
              : entry.rank === 2
                ? 'text-slate-500 dark:text-slate-300'
                : entry.rank === 3
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-slate-400 dark:text-slate-500';

          return (
            <React.Fragment key={entry.id}>
              {hasGap && (
                <div className="text-center font-mono text-[10px] text-slate-400 dark:text-slate-600 leading-none py-0.5">
                  ···
                </div>
              )}
              <div
                className={`mx-1 px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 text-xs transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-blue-600/10 dark:bg-blue-500/15 ring-1 ring-inset ring-blue-500/30 font-semibold text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    dir="ltr"
                    className={`w-5 font-mono text-[11px] font-bold tabular-nums shrink-0 inline-flex items-center gap-0.5 ${rankColor}`}
                  >
                    {entry.rank === 1 ? <Crown className="w-3 h-3" /> : `#${entry.rank}`}
                  </span>
                  <span className="truncate">{entry.name}</span>
                </div>

                <span
                  dir="ltr"
                  className="font-mono text-[11px] font-semibold tabular-nums shrink-0 text-slate-600 dark:text-slate-300"
                >
                  {entry.totalXp} XP
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowAll((s) => !s)}
        className="w-full px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1 cursor-pointer"
      >
        <span>{showAll ? t.leaderboard.showCompact : t.leaderboard.showAll}</span>
        {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
    </div>
  );
};
