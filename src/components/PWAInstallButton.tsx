import React, {useState} from 'react';
import {Download, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {useLanguage} from '../i18n/LanguageContext';

export const PWAInstallButton: React.FC = () => {
  const {t} = useLanguage();
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        {t.common.installApp}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          {t.common.installIos}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t.common.installIosTitle}</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={t.common.close}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.common.installIosStep1}
                <br />
                {t.common.installIosStep2}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.common.gotIt}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
