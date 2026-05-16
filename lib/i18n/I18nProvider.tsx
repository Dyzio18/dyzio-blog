'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from './dictionaries/pl';
import type { Lang } from './types';

type I18nValue = {
  lang: Lang;
  dict: Dictionary;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  lang,
  dict,
  children,
}: I18nValue & { children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, dict }}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useT must be used within I18nProvider');
  }
  return ctx;
}
