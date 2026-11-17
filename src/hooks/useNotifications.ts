import {useCallback, useEffect, useState} from 'react';
import {formatPrice} from '../data/instruments';
import {useLanguage} from '../i18n/LanguageContext';
import type {AppNotification, MarketQuote, NotificationPrefs, PriceAlert} from '../types/trading';

const ALERTS_KEY = 'meridian_price_alerts_v1';
const NOTIFS_KEY = 'meridian_notifications_v1';
const PREFS_KEY = 'meridian_notif_prefs_v1';

const DEFAULT_PREFS: NotificationPrefs = {
  pushEnabled: true,
  marketAlerts: true,
  orderFills: true,
  stopTakeTriggers: true,
  equityMilestones: true,
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useNotifications(quotes: Record<string, MarketQuote>) {
  const {t} = useLanguage();
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => loadJson(ALERTS_KEY, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadJson(NOTIFS_KEY, []));
  const [prefs, setPrefs] = useState<NotificationPrefs>(() => loadJson(PREFS_KEY, DEFAULT_PREFS));
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  useEffect(() => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications.slice(0, 60)));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const dispatchBrowserPush = useCallback(
    async (title: string, body: string, tag?: string) => {
      if (!prefs.pushEnabled) return;
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: tag || `meridian-${Date.now()}`,
            });
            return;
          }
        }
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          tag: tag || `meridian-${Date.now()}`,
        });
      } catch {
        // Fallback silently to in-app toast when running inside restricted sandboxes
      }
    },
    [prefs.pushEnabled]
  );

  const pushNotification = useCallback(
    (payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      if (payload.category === 'market-alert' && !prefs.marketAlerts) return;
      if (payload.category === 'portfolio-update' && !prefs.orderFills && !prefs.stopTakeTriggers) return;

      const entry: AppNotification = {
        ...payload,
        id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [entry, ...prev].slice(0, 60));
      setToasts((prev) => [entry, ...prev].slice(0, 3));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== entry.id));
      }, 5500);

      void dispatchBrowserPush(entry.title, entry.body, entry.id);
    },
    [dispatchBrowserPush, prefs.marketAlerts, prefs.orderFills, prefs.stopTakeTriggers]
  );

  const requestPushPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return 'unsupported' as const;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        void dispatchBrowserPush(t.notifications.alertsActiveTitle, t.notifications.alertsActiveBody);
      }
      return result;
    } catch {
      return permission;
    }
  }, [dispatchBrowserPush, permission, t]);

  const sendTestPush = useCallback(() => {
    pushNotification({
      category: 'market-alert',
      title: t.notifications.testTitle,
      body: t.notifications.testBody,
    });
  }, [pushNotification, t]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const now = Date.now();
    let changed = false;

    const updatedAlerts = alerts.map((alert) => {
      if (!alert.active) return alert;
      const quote = quotes[alert.symbol];
      if (!quote) return alert;

      if (alert.lastTriggeredAt && now - alert.lastTriggeredAt < 60_000) {
        return alert;
      }

      const hit =
        (alert.condition === 'above' && quote.price >= alert.targetPrice) ||
        (alert.condition === 'below' && quote.price <= alert.targetPrice);

      if (!hit) return alert;

      changed = true;
      const directionLabel =
        alert.condition === 'above' ? t.notifications.crossedAbove : t.notifications.droppedBelow;
      pushNotification({
        category: 'market-alert',
        symbol: alert.symbol,
        title: `${alert.symbol} ${t.notifications.priceAlertTitle}`,
        body: `${alert.symbol} ${directionLabel} ${formatPrice(alert.targetPrice, alert.symbol)} (${t.notifications.now}: ${formatPrice(quote.price, alert.symbol)})${alert.note ? ` — ${alert.note}` : ''}`,
      });

      return {
        ...alert,
        active: alert.recurring ? true : false,
        lastTriggeredAt: now,
      };
    });

    if (changed) {
      setAlerts(updatedAlerts);
    }
  }, [alerts, quotes, pushNotification, t]);

  const createAlert = useCallback(
    (input: {symbol: string; condition: 'above' | 'below'; targetPrice: number; note?: string; recurring?: boolean}) => {
      const next: PriceAlert = {
        id: `alt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        symbol: input.symbol,
        condition: input.condition,
        targetPrice: input.targetPrice,
        note: input.note?.trim() || undefined,
        active: true,
        recurring: Boolean(input.recurring),
        createdAt: Date.now(),
      };
      setAlerts((prev) => [next, ...prev]);
      return next;
    },
    []
  );

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? {...a, active: !a.active} : a)));
  }, []);

  const updateAlertTarget = useCallback(
    (id: string, targetPrice: number, condition?: 'above' | 'below') => {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                targetPrice,
                condition: condition ?? a.condition,
                active: true,
                lastTriggeredAt: undefined,
              }
            : a
        )
      );
    },
    []
  );

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({...n, read: true})));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
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
  };
}
