import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {LESSONS} from '../data/curriculum';
import {INSTRUMENTS} from '../data/instruments';
import type {Lesson} from '../types/trading';
import {CURRICULUM_I18N, INSTRUMENT_NOTES_I18N} from './curriculumTranslations';
import {TRANSLATIONS} from './translations';
import {LANGUAGE_OPTIONS, type Language, type Translations} from './types';

const LANG_KEY = 'meridian_lang_v1';

interface LanguageContextValue {
  lang: Language;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  t: Translations;
  lessons: Lesson[];
  getInstrumentNote: (symbol: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'es' || saved === 'ar')) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'en';
}

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [lang, setLangState] = useState<Language>(detectInitialLang);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const t = TRANSLATIONS[lang];

  const lessons = useMemo<Lesson[]>(() => {
    if (lang === 'en') return LESSONS;
    const overlayMap = CURRICULUM_I18N[lang];
    return LESSONS.map((base) => {
      const ov = overlayMap[base.id];
      if (!ov) return base;
      return {
        ...base,
        moduleTitle: ov.moduleTitle,
        title: ov.title,
        summary: ov.summary,
        sections: ov.sections,
        quiz: base.quiz.map((q) => {
          const ovQ = ov.quiz.find((item) => item.id === q.id);
          return ovQ
            ? {
                ...q,
                question: ovQ.question,
                options: ovQ.options,
                explanation: ovQ.explanation,
              }
            : q;
        }),
      };
    });
  }, [lang]);

  const getInstrumentNote = useCallback(
    (symbol: string) => {
      if (lang !== 'en') {
        const translated = INSTRUMENT_NOTES_I18N[lang]?.[symbol];
        if (translated) return translated;
      }
      return INSTRUMENTS.find((i) => i.symbol === symbol)?.beginnerNote ?? '';
    },
    [lang]
  );

  const value = useMemo(
    () => ({lang, dir, setLang, t, lessons, getInstrumentNote}),
    [lang, dir, setLang, t, lessons, getInstrumentNote]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export {LANGUAGE_OPTIONS};
