import React from 'react';
import {Bell, TrendingUp, X} from 'lucide-react';
import type {AppNotification} from '../types/trading';

interface ToastBannerProps {
  toasts: AppNotification[];
  onDismiss: (id: string) => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({toasts, onDismiss}) => {
  if (toasts.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] p-3.5 shadow-lg"
        >
          <div className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
            {toast.category === 'market-alert' ? <Bell className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{toast.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">{toast.body}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
