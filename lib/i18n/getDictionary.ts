import { cookies } from 'next/headers';
import { pl } from './dictionaries/pl';
import { en } from './dictionaries/en';
import { LANG_COOKIE, DEFAULT_LANG, type Lang } from './types';

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return value === 'en' ? 'en' : DEFAULT_LANG;
}

export async function getDictionary() {
  const lang = await getLang();
  const dict = lang === 'en' ? en : pl;
  return { lang, dict };
}
