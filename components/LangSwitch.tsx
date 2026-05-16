'use client';

import { useRouter } from 'next/navigation';
import { useT } from '@/lib/i18n/I18nProvider';
import { LANG_COOKIE, type Lang } from '@/lib/i18n/types';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setLangCookie(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export default function LangSwitch() {
  const router = useRouter();
  const { lang, dict } = useT();

  const handleClick = (next: Lang) => {
    if (next === lang) return;
    setLangCookie(next);
    router.refresh();
  };

  const base = 'text-sm font-medium px-1';
  const active = 'text-gray-900 dark:text-gray-100 font-bold';
  const inactive = 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300';

  return (
    <div className="flex items-center" aria-label={dict.langSwitch.aria}>
      <button
        type="button"
        onClick={() => handleClick('pl')}
        className={`${base} ${lang === 'pl' ? active : inactive}`}
        aria-pressed={lang === 'pl'}
      >
        {dict.langSwitch.pl}
      </button>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <button
        type="button"
        onClick={() => handleClick('en')}
        className={`${base} ${lang === 'en' ? active : inactive}`}
        aria-pressed={lang === 'en'}
      >
        {dict.langSwitch.en}
      </button>
    </div>
  );
}
