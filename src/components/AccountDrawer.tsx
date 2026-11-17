import React, {useState} from 'react';
import {Bell, Globe, HelpCircle, Moon, RotateCcw, Sun, X} from 'lucide-react';
import {formatUsd} from '../data/instruments';
import {LANGUAGE_OPTIONS, useLanguage} from '../i18n/LanguageContext';
import type {NotificationPrefs} from '../types/trading';
import {PWAInstallButton} from './PWAInstallButton';

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  beginnerHints: boolean;
  onToggleBeginnerHints: () => void;
  initialCapital: number;
  totalEquity: number;
  onResetAccount: (capital: number) => void;
  onResetAcademy: () => void;
  permission: NotificationPermission | 'unsupported';
  onRequestPush: () => Promise<unknown>;
  onSendTestPush: () => void;
  prefs: NotificationPrefs;
  onUpdatePrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  open,
  onClose,
  theme,
  onToggleTheme,
  beginnerHints,
  onToggleBeginnerHints,
  initialCapital,
  totalEquity,
  onResetAccount,
  onResetAcademy,
  permission,
  onRequestPush,
  onSendTestPush,
  prefs,
  onUpdatePrefs,
}) => {
  const {lang, setLang, t} = useLanguage();
  const [selectedCapital, setSelectedCapital] = useState<number>(initialCapital || 100000);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[1px]">
      <div
        role="dialog"
        aria-label={t.drawer.title}
        className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-[#0F1623] border-s border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {t.drawer.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.drawer.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selector */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.common.language}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    active
                      ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{opt.nativeLabel}</span>
                  <span className="font-mono text-[10px] opacity-70">{opt.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Display & Beginner Guidance */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.displayLearning}</h3>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
              {t.drawer.colorTheme}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? t.drawer.darkMode : t.drawer.lightMode}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleBeginnerHints}
            className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer text-start"
          >
            <span className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t.drawer.beginnerHints}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {t.drawer.beginnerHintsSub}
                </span>
              </span>
            </span>
            <span className={`text-xs font-semibold shrink-0 ms-2 ${beginnerHints ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {beginnerHints ? t.drawer.on : t.drawer.off}
            </span>
          </button>
        </section>

        {/* Push Notifications */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.pushNotifications}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.drawer.browserStatus}: {permission}
            </span>
          </div>

          <div className="flex gap-2">
            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                type="button"
                onClick={() => void onRequestPush()}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                {t.drawer.enableBrowserPush}
              </button>
            )}
            <button
              type="button"
              onClick={onSendTestPush}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t.drawer.sendTestNotification}
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {[
              {key: 'marketAlerts' as const, label: t.drawer.prefMarketAlerts},
              {key: 'orderFills' as const, label: t.drawer.prefOrderFills},
              {key: 'stopTakeTriggers' as const, label: t.drawer.prefStopTake},
            ].map((row) => (
              <label
                key={row.key}
                className="flex items-center justify-between py-1.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>{row.label}</span>
                <input
                  type="checkbox"
                  checked={prefs[row.key]}
                  onChange={(e) => onUpdatePrefs((prev) => ({...prev, [row.key]: e.target.checked}))}
                  className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Paper Account Reset */}
        <section className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.drawer.paperAccount}</h3>
            <span className="font-mono text-xs font-medium text-slate-900 dark:text-white" dir="ltr">
              {t.drawer.equity}: {formatUsd(totalEquity)}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">{t.drawer.paperDesc}</p>

          <div className="grid grid-cols-3 gap-2" dir="ltr">
            {[10000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedCapital(amt)}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                  selectedCapital === amt
                    ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {formatUsd(amt).replace('.00', '')}
              </button>
            ))}
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.drawer.resetAccountTo} {formatUsd(selectedCapital).replace('.00', '')}
            </button>
          ) : (
            <div className="p-3 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 space-y-2">
              <p className="text-xs text-red-700 dark:text-red-300">{t.drawer.resetWarning}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetAccount(selectedCapital);
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-1.5 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 cursor-pointer"
                >
                  {t.common.confirmReset}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onResetAcademy}
            className="w-full py-2 px-3 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {t.drawer.resetAcademy}
          </button>
        </section>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
