'use client';

import Link from './Link';
import { usePathname } from 'next/navigation';
import headerNavLinks from '@/data/headerNavLinks';
import { useT } from '@/lib/i18n/I18nProvider';

export default function NavLinks() {
  const pathname = usePathname();
  const { dict } = useT();

  return (
    <>
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const isActive =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          const label = dict.nav[link.key];
          return (
            <Link
              key={link.key}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={isActive ? `${label} (${dict.a11y.activeNavLink})` : undefined}
              className={
                'hidden font-medium sm:block ' +
                (isActive
                  ? 'rounded-full bg-primary-500/12 px-3 py-1 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
                  : 'px-3 py-1 text-gray-700 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-900/40 dark:hover:text-primary-300')
              }
            >
              {label}
            </Link>
          );
        })}
    </>
  );
}
