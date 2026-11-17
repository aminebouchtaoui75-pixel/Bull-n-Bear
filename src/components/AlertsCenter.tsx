import React, {useEffect, useState} from 'react';
import {Bell, Check, Pause, Play, Trash2} from 'lucide-react';
import {INSTRUMENTS, INSTRUMENT_MAP, formatPrice} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppNotification, MarketQuote, NotificationPrefs, PriceAlert} from '../types/trading';

interface AlertsCenterProps {
  quotes: Record<string, MarketQuote>;
  alerts: PriceAlert[];
  notifications: AppNotification[];
  permission: NotificationPermission | 'unsupported';
  prefs: NotificationPrefs;
  onUpdatePrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
  onRequestPush: () => Promise<unknown>;
  onSendTestPush: () => void;
  onCreateAlert: (input: {
    symbol: string;
    condition: 'above' | 'below';
    targetPrice: number;
    note?: string;
    recurring?: boolean;
  }) => void;
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  quotes,
  alerts,
  notifications,
  permission,
  prefs,
  onUpdatePrefs,
  onRequestPush,
  onSendTestPush,
  onCreateAlert,
  onToggleAlert,
  onDeleteAlert,
  onMarkAllRead,
  onClearNotifications,
}) => {
  const {t} = useLanguage();
  const [symbol, setSymbol] = useState('BTC/USD');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetInput, setTargetInput] = useState('');
  const [note, setNote] = useState('');
  const [recurring, setRecurring] = useState(false);

  const liveQuote = quotes[symbol];
  const inst = INSTRUMENT_MAP.get(symbol) ?? INSTRUMENTS[0];

  useEffect(() => {
    if (liveQuote && !targetInput) {
      setTargetInput((liveQuote.price * 1.01).toFixed(inst.decimals));
    }
  }, [liveQuote, inst.decimals, targetInput]);

  const applyOffset = (pct: number) => {
    if (!liveQuote) return;
    setCondition(pct >= 0 ? 'above' : 'below');
    setTargetInput((liveQuote.price * (1 + pct / 100)).toFixed(inst.decimals));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPrice = parseFloat(targetInput);
    if (!Number.isFinite(targetPrice) || targetPrice <= 0) return;
    onCreateAlert({symbol, condition, targetPrice, note, recurring});
    setNote('');
  };

  const categoryLabel = (cat: AppNotification['category']) => {
    if (cat === 'market-alert') return t.alerts.catMarket;
    if (cat === 'learning') return t.alerts.catLearning;
    return t.alerts.catPortfolio;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.alerts.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.alerts.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {permission !== 'granted' && permission !== 'unsupported' && (
            <button
              type="button"
              onClick={() => void onRequestPush()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              {t.alerts.enablePushBtn}
            </button>
          )}
          <button
            type="button"
            onClick={onSendTestPush}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            {t.alerts.testBtn}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{t.alerts.pushDelivery}</span>{' '}
          {permission === 'granted'
            ? t.alerts.statusGranted
            : permission === 'denied'
              ? t.alerts.statusDenied
              : t.alerts.statusDefault}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.marketAlerts}
              onChange={(e) => onUpdatePrefs((p) => ({...p, marketAlerts: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.priceTargets}
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.orderFills}
              onChange={(e) => onUpdatePrefs((p) => ({...p, orderFills: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.orderFills}
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.stopTakeTriggers}
              onChange={(e) => onUpdatePrefs((p) => ({...p, stopTakeTriggers: e.target.checked}))}
              className="accent-blue-600 cursor-pointer"
            />
            {t.alerts.slTpExits}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.alerts.createTitle}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="alert-symbol" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.alerts.marketPair}
              </label>
              <select
                id="alert-symbol"
                value={symbol}
                onChange={(e) => {
                  const nextSym = e.target.value;
                  setSymbol(nextSym);
                  const q = quotes[nextSym];
                  const nextInst = INSTRUMENT_MAP.get(nextSym);
                  if (q && nextInst) {
                    setTargetInput((q.price * 1.01).toFixed(nextInst.decimals));
                  }
                }}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                {INSTRUMENTS.map((i) => (
                  <option key={i.symbol} value={i.symbol}>
                    {i.symbol} — {i.name}
                  </option>
                ))}
              </select>
              {liveQuote && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {t.alerts.currentPrice} <span dir="ltr">{formatPrice(liveQuote.price, symbol)}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="alert-cond" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.alerts.notifyWhenPrice}
                </label>
                <select
                  id="alert-cond"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="above">{t.alerts.risesAbove}</option>
                  <option value="below">{t.alerts.dropsBelow}</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-price" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.alerts.targetPrice}
                </label>
                <input
                  id="alert-price"
                  type="number"
                  dir="ltr"
                  step="any"
                  required
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 font-mono text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5" dir="ltr">
              {[-2, -0.5, 0.5, 2].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyOffset(pct)}
                  className="py-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="alert-note" className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.alerts.noteLabel}
              </label>
              <input
                id="alert-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.alerts.notePlaceholder}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#090D16] px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="accent-blue-600 cursor-pointer"
              />
              {t.alerts.recurringLabel}
            </label>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              {t.alerts.createBtn}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.alerts.yourAlerts} ({alerts.length})
            </h3>
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
                {t.alerts.noAlerts}
              </p>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {alerts.map((al) => {
                  const q = quotes[al.symbol];
                  const distPct = q ? ((al.targetPrice - q.price) / q.price) * 100 : null;
                  return (
                    <div key={al.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          <span dir="ltr">{al.symbol}</span>{' '}
                          <span className="font-normal text-slate-500">
                            {al.condition === 'above' ? '≥' : '≤'}{' '}
                            <span className="font-mono font-medium text-slate-800 dark:text-slate-200" dir="ltr">
                              {formatPrice(al.targetPrice, al.symbol)}
                            </span>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {al.active ? t.alerts.watchingLive : t.alerts.triggeredPaused}
                          {distPct !== null ? ` · ${distPct >= 0 ? '+' : ''}${distPct.toFixed(2)}% ${t.alerts.away}` : ''}
                          {al.note ? ` · ${al.note}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleAlert(al.id)}
                          aria-label={al.active ? 'Pause' : 'Resume'}
                          className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {al.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(al.id)}
                          aria-label="Delete"
                          className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1623] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.alerts.feedTitle} ({notifications.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.alerts.feedSub}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t.alerts.markRead}
                </button>
                <button
                  type="button"
                  onClick={onClearNotifications}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                >
                  {t.alerts.clear}
                </button>
              </div>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              {t.alerts.noNotifications}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {notifications.map((ntf) => (
                <div
                  key={ntf.id}
                  className={`py-3 flex items-start justify-between gap-4 ${
                    ntf.read ? 'opacity-75' : ''
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{categoryLabel(ntf.category)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono" dir="ltr">
                        {new Date(ntf.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                      </span>
                      {!ntf.read && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{t.alerts.newBadge}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{ntf.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{ntf.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
