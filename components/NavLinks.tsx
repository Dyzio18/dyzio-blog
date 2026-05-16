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
                  ? 'text-primary-500 border-b-2 border-primary-500 pb-0.5'
                  : 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400')
              }
            >
              {label}
            </Link>
          );
        })}
    </>
  );
}
