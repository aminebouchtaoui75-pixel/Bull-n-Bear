import React from 'react';
import {
  Bell,
  Bookmark,
  CandlestickChart,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import {formatUsd} from '../data/instruments';
import {TRADING_STRATEGIES} from '../data/strategies';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppTab, LeaderboardEntry, StrategyId} from '../types/trading';
import {BrandLogo} from './BrandLogo';
import {LeaderboardPanel} from './LeaderboardPanel';

interface SidebarLeaderboardData {
  entries: LeaderboardEntry[];
  userEntry: LeaderboardEntry;
  aboveEntry: LeaderboardEntry | null;
  xpToNextRank: number;
  customName: string;
  onUpdateName: (name: string) => void;
}

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  unreadCount: number;
  completedLessons: number;
  totalLessons: number;
  totalEquity: number;
  savedStrategyIds: StrategyId[];
  activeStrategyId: StrategyId;
  onOpenSavedStrategy: (id: StrategyId) => void;
  onRemoveSavedStrategy: (id: StrategyId) => void;
  leaderboard: SidebarLeaderboardData;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount,
  completedLessons,
  totalLessons,
  totalEquity,
  savedStrategyIds,
  activeStrategyId,
  onOpenSavedStrategy,
  onRemoveSavedStrategy,
  leaderboard,
  theme,
  onToggleTheme,
  onOpenSettings,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const {t, dir, lang} = useLanguage();

  const savedStrategies = savedStrategyIds
    .map((id) => TRADING_STRATEGIES.find((s) => s.id === id))
    .filter((item): item is (typeof TRADING_STRATEGIES)[number] => Boolean(item));

  const navItems: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{className?: string}>;
    meta?: string;
    hasUnread?: boolean;
  }> = [
    {
      id: 'academy',
      label: t.nav.academy,
      icon: GraduationCap,
      meta: `${completedLessons}/${totalLessons}`,
    },
    {id: 'overview', label: t.nav.overview, icon: LayoutDashboard},
    {id: 'trade', label: t.nav.practice, icon: CandlestickChart},
    {
      id: 'strategies',
      label: t.nav.strategies,
      icon: Compass,
      meta: String(TRADING_STRATEGIES.length),
    },
    {
      id: 'alerts',
      label: t.nav.alerts,
      icon: Bell,
      meta: unreadCount > 0 ? String(unreadCount) : undefined,
      hasUnread: unreadCount > 0,
    },
  ];

  const handleNavClick = (tab: AppTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const isCompact = !isMobileDrawer && collapsed;

    return (
      <div className="h-full flex flex-col bg-white/95 dark:bg-[#0C121E]/95 backdrop-blur-xs border-e border-slate-200/90 dark:border-slate-800/90 select-none">
        {/* Brand & Collapse Row */}
        <div
          className={`h-14 px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center ${
            isCompact ? 'justify-center' : 'justify-between gap-2'
          }`}
        >
          {!isCompact && (
            <button
              type="button"
              onClick={() => handleNavClick('academy')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 rounded-md"
            >
              <BrandLogo size="sm" />
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">
                {t.common.brand}
              </span>
            </button>
          )}

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label={t.common.close}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={t.nav.toggleSidebar}
              aria-label={t.nav.toggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              {isCompact ? (
                <PanelLeftOpen className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              ) : (
                <PanelLeftClose className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav aria-label="Primary navigation" className="flex-1 p-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                title={isCompact ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`relative w-full flex items-center rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 ${
                  isCompact ? 'justify-center px-2 py-2.5' : 'justify-between gap-3 px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCompact && <span className="text-sm truncate">{item.label}</span>}
                </span>

                {!isCompact && item.meta && (
                  <span
                    dir="ltr"
                    className={`font-mono text-[11px] tabular-nums shrink-0 ${
                      item.hasUnread
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {item.meta}
                  </span>
                )}

                {isCompact && item.hasUnread && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-blue-500"
                  />
                )}
              </button>
            );
          })}

          {/* Saved Strategies (Trading Playbook) */}
          {!isCompact ? (
            <div className="pt-4 mt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <div className="px-2 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Bookmark className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="truncate">{t.strategies.playbookSectionTitle}</span>
                </span>
                <span className="font-mono tabular-nums shrink-0" dir="ltr">
                  {savedStrategies.length}/{TRADING_STRATEGIES.length}
                </span>
              </div>

              {savedStrategies.length === 0 ? (
                <div className="mx-1 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-2.5 space-y-2">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.strategies.savedEmptyHint}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavClick('strategies')}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {t.strategies.browseStrategies}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {savedStrategies.map((strat) => {
                    const localized = strat.translations[lang] ?? strat.translations.en;
                    const isFocused = activeTab === 'strategies' && activeStrategyId === strat.id;
                    return (
                      <div
                        key={strat.id}
                        className={`group flex items-center gap-1 rounded-lg transition-colors ${
                          isFocused
                            ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                            : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onOpenSavedStrategy(strat.id);
                            onCloseMobile();
                          }}
                          className="flex-1 min-w-0 text-start px-2.5 py-2 cursor-pointer"
                        >
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                            {localized.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums" dir="ltr">
                            <span>{strat.practiceSymbol}</span>
                            <span>·</span>
                            <span>{localized.realExample.entryPrice}</span>
                            <span>·</span>
                            <span className={strat.bias === 'bullish' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                              {strat.typicalRiskReward}
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSavedStrategy(strat.id);
                          }}
                          aria-label={t.strategies.removeBookmark}
                          title={t.strategies.removeBookmark}
                          className="p-1.5 me-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 opacity-70 group-hover:opacity-100 cursor-pointer shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  if (savedStrategies.length > 0) {
                    onOpenSavedStrategy(savedStrategies[0].id);
                  } else {
                    handleNavClick('strategies');
                  }
                }}
                title={`${t.strategies.playbookSectionTitle} (${savedStrategies.length})`}
                aria-label={t.strategies.playbookSectionTitle}
                className="relative w-full flex items-center justify-center px-2 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <Bookmark
                  className={`w-4 h-4 ${savedStrategies.length > 0 ? 'text-amber-500 dark:text-amber-400' : ''}`}
                />
                {savedStrategies.length > 0 && (
                  <span className="absolute top-1.5 end-1.5 font-mono text-[9px] font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {savedStrategies.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Competitive XP Leaderboard */}
          <LeaderboardPanel
            entries={leaderboard.entries}
            userEntry={leaderboard.userEntry}
            aboveEntry={leaderboard.aboveEntry}
            xpToNextRank={leaderboard.xpToNextRank}
            customName={leaderboard.customName}
            onUpdateName={leaderboard.onUpdateName}
            compact={isCompact}
            onExpandSidebar={onToggleCollapse}
          />
        </nav>

        {/* Bottom Workspace Summary & Actions */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
          {!isCompact && (
            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-[#090D16] px-3 py-2 mb-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{t.nav.paperBalance}</div>
              <div
                className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums mt-0.5"
                dir="ltr"
              >
                {formatUsd(totalEquity)}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            title={isCompact ? (theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode) : undefined}
            className={`w-full flex items-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer ${
              isCompact ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2 text-xs font-medium'
            }`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-500 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            {!isCompact && (
              <span className="truncate">
                {theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            title={isCompact ? t.nav.account : undefined}
            className={`w-full flex items-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer ${
              isCompact ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5 text-xs font-semibold'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            {!isCompact && <span className="truncate">{t.nav.account}</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-[width] duration-200 ease-out z-30 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-label={t.common.brand}
            className="relative w-68 max-w-[82vw] h-full z-10 shadow-2xl"
          >
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
};
