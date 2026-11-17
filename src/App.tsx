import React, {useEffect, useState} from 'react';
import {Globe, Menu} from 'lucide-react';
import {AccountDrawer} from './components/AccountDrawer';
import {AlertsCenter} from './components/AlertsCenter';
import {AcademyView} from './components/AcademyView';
import {AmbientBackground} from './components/AmbientBackground';
import {BrandLogo} from './components/BrandLogo';
import {OfflineIndicator} from './components/OfflineIndicator';
import {OverviewDashboard} from './components/OverviewDashboard';
import {Sidebar} from './components/Sidebar';
import {StrategiesView} from './components/StrategiesView';
import {ToastBanner} from './components/ToastBanner';
import {TradingTerminal} from './components/TradingTerminal';
import {TRADING_STRATEGIES} from './data/strategies';
import {useAchievements} from './hooks/useAchievements';
import {useDailyMissions} from './hooks/useDailyMissions';
import {useLeaderboard} from './hooks/useLeaderboard';
import {useLessonProgress} from './hooks/useLessonProgress';
import {useMarketStream} from './hooks/useMarketStream';
import {useNotifications} from './hooks/useNotifications';
import {usePaperAccount} from './hooks/usePaperAccount';
import {useTradingPlaybook} from './hooks/useTradingPlaybook';
import {LANGUAGE_OPTIONS, useLanguage} from './i18n/LanguageContext';
import type {AchievementId, AppTab, StrategyId} from './types/trading';

const THEME_KEY = 'meridian_theme_v1';
const HINTS_KEY = 'meridian_beginner_hints_v1';
const SIDEBAR_KEY = 'meridian_sidebar_collapsed_v1';

export default function App() {
  const {lang, setLang, t, lessons} = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('academy');
  const [activeStrategyId, setActiveStrategyId] = useState<StrategyId>(TRADING_STRATEGIES[0].id);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USD');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [beginnerHints, setBeginnerHints] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(HINTS_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(HINTS_KEY, String(beginnerHints));
  }, [beginnerHints]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const {quotes} = useMarketStream();
  const {
    alerts,
    notifications,
    unreadCount,
    toasts,
    prefs,
    setPrefs,
    permission,
    requestPushPermission,
    sendTestPush,
    pushNotification,
    createAlert,
    toggleAlert,
    updateAlertTarget,
    deleteAlert,
    markAllRead,
    clearNotifications,
    dismissToast,
  } = useNotifications(quotes);

  const {account, analytics, placeOrder, closePosition, cancelPendingOrder, resetAccount, loadSampleHistory} =
    usePaperAccount(quotes, pushNotification);

  const {
    progress,
    completedCount,
    totalLessons,
    lessonXp,
    currentUnlockedLessonId,
    isLessonUnlocked,
    streak,
    recordDailyActivity,
    recordQuizAttempt,
    resetProgress,
  } = useLessonProgress();

  const {savedIds, toggleBookmark, removeBookmark} = useTradingPlaybook();

  const {
    totalXp: missionXp,
    completedIds,
    bonusClaimedToday,
    completeMission,
    resetMissions,
  } = useDailyMissions(recordDailyActivity, (missionId, xpEarned) => {
    const label =
      missionId === 'long-trade'
        ? t.overview.missionLongTitle
        : missionId === 'risk-guard'
          ? t.overview.missionRiskTitle
          : missionId === 'strategy-guide'
            ? t.overview.missionStrategyTitle
            : t.overview.missionQuizTitle;
    pushNotification({
      category: 'learning',
      title: t.overview.missionToastTitle,
      body: `${label} (+${xpEarned} ${t.overview.missionsXp})`,
    });
  });

  const combinedTotalXp = lessonXp + missionXp;
  const combinedLevel = Math.floor(combinedTotalXp / 150) + 1;
  const combinedLevelFloor = (combinedLevel - 1) * 150;
  const combinedLevelProgressPct = Math.round(((combinedTotalXp - combinedLevelFloor) / 150) * 100);

  const getAchievementTitle = (id: AchievementId) => {
    switch (id) {
      case 'first-trade':
        return t.achievements.firstTradeTitle;
      case 'perfect-quiz':
        return t.achievements.perfectQuizTitle;
      case 'streak-7':
        return t.achievements.streak7Title;
      case 'risk-protector':
        return t.achievements.riskProtectorTitle;
      case 'playbook-collector':
        return t.achievements.playbookCollectorTitle;
      case 'course-graduate':
        return t.achievements.courseGraduateTitle;
    }
  };

  const {
    achievements,
    unlockedCount: achievementsUnlockedCount,
    totalCount: achievementsTotalCount,
    resetAchievements,
  } = useAchievements({
    totalTrades: analytics.totalTrades,
    positions: account.positions,
    pendingOrdersCount: account.pendingOrders.length,
    tradeLogs: account.tradeLogs,
    progress,
    completedLessons: completedCount,
    totalLessons,
    streakDays: streak.currentStreak,
    longestStreak: streak.longestStreak,
    savedStrategiesCount: savedIds.length,
    completedMissionIds: completedIds,
    onUnlock: (id) => {
      pushNotification({
        category: 'learning',
        title: t.achievements.toastTitle,
        body: getAchievementTitle(id),
      });
    },
  });

  const leaderboard = useLeaderboard(lessonXp, missionXp, t.leaderboard.selfDefaultName);

  useEffect(() => {
    if (activeTab === 'strategies') {
      completeMission('strategy-guide');
    }
  }, [activeTab, completeMission]);

  const handlePlaceOrderWithMissions = (params: Parameters<typeof placeOrder>[0]) => {
    const res = placeOrder(params);
    if (res.ok) {
      if (params.side === 'buy') {
        completeMission('long-trade');
      }
      if (params.stopLoss !== undefined || params.takeProfit !== undefined) {
        completeMission('risk-guard');
      }
    }
    return res;
  };

  const handlePracticeSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('trade');
  };

  const handleQuickAlert = (symbol: string, targetPrice: number, condition: 'above' | 'below') => {
    createAlert({
      symbol,
      condition,
      targetPrice,
      note: t.alerts.quickChartNote,
    });
  };

  const activeAlertsCount = alerts.filter((a) => a.active).length;
  const currentCourse = lessons.find((l) => l.id === currentUnlockedLessonId) ?? lessons[0];

  const activeSectionTitle =
    activeTab === 'overview'
      ? t.nav.overview
      : activeTab === 'trade'
        ? t.nav.practice
        : activeTab === 'academy'
          ? t.nav.academy
          : activeTab === 'strategies'
            ? t.nav.strategies
            : t.nav.alerts;

  return (
    <div className="relative min-h-screen flex bg-[#F8FAFC] dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      <AmbientBackground />

      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'alerts') markAllRead();
        }}
        unreadCount={unreadCount}
        completedLessons={completedCount}
        totalLessons={totalLessons}
        totalEquity={analytics.totalEquity}
        savedStrategyIds={savedIds}
        activeStrategyId={activeStrategyId}
        onOpenSavedStrategy={(id) => {
          setActiveStrategyId(id);
          setActiveTab('strategies');
        }}
        onRemoveSavedStrategy={removeBookmark}
        leaderboard={{
          entries: leaderboard.entries,
          userEntry: leaderboard.userEntry,
          aboveEntry: leaderboard.aboveEntry,
          xpToNextRank: leaderboard.xpToNextRank,
          customName: leaderboard.customName,
          onUpdateName: leaderboard.updateDisplayName,
        }}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenSettings={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        {/* Slim Workspace Top Utility Bar */}
        <header className="sticky top-0 z-20 h-14 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/85 dark:bg-[#090D16]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t.nav.openMenu}
              className="lg:hidden p-2 -ms-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('academy')}
              className="lg:hidden flex items-center gap-2 font-display text-base font-bold tracking-tight text-slate-900 dark:text-white cursor-pointer"
            >
              <BrandLogo size="sm" />
              <span>{t.common.brand}</span>
            </button>
            <span className="hidden lg:inline-block font-display text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {activeSectionTitle}
            </span>
          </div>

          <div
            role="group"
            aria-label={t.common.language}
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-50 dark:bg-[#0F1623] border border-slate-200/90 dark:border-slate-800/90 overflow-x-auto max-w-full"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 ms-1.5 me-1 shrink-0 hidden sm:block" aria-hidden="true" />
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.nativeLabel}
                </button>
              );
            })}
          </div>
        </header>

        <main key={activeTab} className="flex-1 animate-panel-enter">
        {activeTab === 'overview' && (
          <OverviewDashboard
            analytics={analytics}
            positions={account.positions}
            tradeLogs={account.tradeLogs}
            quotes={quotes}
            completedLessons={completedCount}
            totalLessons={totalLessons}
            currentCourseNumber={currentCourse.number}
            currentCourseTitle={currentCourse.title}
            activeAlertsCount={activeAlertsCount}
            beginnerHints={beginnerHints}
            missions={{
              totalXp: combinedTotalXp,
              level: combinedLevel,
              levelProgressPct: combinedLevelProgressPct,
              completedIds,
              bonusClaimedToday,
            }}
            achievements={achievements}
            achievementsUnlockedCount={achievementsUnlockedCount}
            achievementsTotalCount={achievementsTotalCount}
            streakDays={streak.currentStreak}
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (tab === 'alerts') markAllRead();
            }}
            onClosePosition={closePosition}
            onLoadSampleHistory={loadSampleHistory}
          />
        )}

        {activeTab === 'trade' && (
          <TradingTerminal
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
            quotes={quotes}
            cash={account.cash}
            positions={account.positions}
            pendingOrders={account.pendingOrders}
            tradeLogs={account.tradeLogs}
            alerts={alerts}
            onPlaceOrder={handlePlaceOrderWithMissions}
            onClosePosition={closePosition}
            onCancelPending={cancelPendingOrder}
            onQuickAlert={handleQuickAlert}
            onUpdateAlert={updateAlertTarget}
            onToggleAlert={toggleAlert}
            onDeleteAlert={deleteAlert}
            beginnerHints={beginnerHints}
            theme={theme}
          />
        )}

        {activeTab === 'academy' && (
          <AcademyView
            progress={progress}
            completedCount={completedCount}
            totalLessons={totalLessons}
            currentUnlockedLessonId={currentUnlockedLessonId}
            isLessonUnlocked={isLessonUnlocked}
            streak={streak}
            learnerName={leaderboard.customName}
            onUpdateLearnerName={leaderboard.updateDisplayName}
            onRecordActivity={recordDailyActivity}
            onRecordQuiz={(lessonId, score, total) => {
              recordQuizAttempt(lessonId, score, total);
              completeMission('academy-quiz');
              if (score >= Math.ceil(total * 0.75)) {
                pushNotification({
                  category: 'learning',
                  title: t.notifications.quizPassedTitle,
                  body: `${t.academy.scoreLabel} ${score}/${total} — ${t.notifications.quizPassedBody}`,
                });
              }
            }}
            onPracticeSymbol={handlePracticeSymbol}
          />
        )}

        {activeTab === 'strategies' && (
          <StrategiesView
            activeStrategyId={activeStrategyId}
            onSelectStrategyId={setActiveStrategyId}
            savedIds={savedIds}
            onToggleBookmark={toggleBookmark}
            onPracticeSymbol={handlePracticeSymbol}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsCenter
            quotes={quotes}
            alerts={alerts}
            notifications={notifications}
            permission={permission}
            prefs={prefs}
            onUpdatePrefs={setPrefs}
            onRequestPush={requestPushPermission}
            onSendTestPush={sendTestPush}
            onCreateAlert={createAlert}
            onToggleAlert={toggleAlert}
            onDeleteAlert={deleteAlert}
            onMarkAllRead={markAllRead}
            onClearNotifications={clearNotifications}
          />
        )}
        </main>
      </div>

      <AccountDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        beginnerHints={beginnerHints}
        onToggleBeginnerHints={() => setBeginnerHints((b) => !b)}
        initialCapital={account.initialCapital}
        totalEquity={analytics.totalEquity}
        onResetAccount={(cap) => {
          resetAccount(cap);
          setSettingsOpen(false);
        }}
        onResetAcademy={() => {
          resetProgress();
          resetMissions();
          resetAchievements();
          try {
            localStorage.removeItem('meridian_cert_congrats_seen_v1');
          } catch {
            // ignore storage errors
          }
          setSettingsOpen(false);
        }}
        permission={permission}
        onRequestPush={requestPushPermission}
        onSendTestPush={sendTestPush}
        prefs={prefs}
        onUpdatePrefs={setPrefs}
      />

      <ToastBanner toasts={toasts} onDismiss={dismissToast} />
      <OfflineIndicator />
    </div>
  );
}
