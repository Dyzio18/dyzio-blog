'use client';

import Link from 'next/link';
import type { TocHeading } from '@/content/schema/types';

interface Props {
  toc: TocHeading[];
  mode: 'travel' | 'dev' | 'default';
  label: string;
}

export default function PostTOC({ toc, mode, label }: Props) {
  if (!toc || toc.length === 0) return null;
  const items = toc.filter((h) => h.depth >= 2 && h.depth <= 3);
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="text-sm">
      <p className="mb-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <ul className={mode === 'dev' ? 'font-mono space-y-1' : 'space-y-2'}>
        {items.map((heading, idx) => {
          const isLast = idx === items.length - 1;
          const prefix = mode === 'dev' ? (isLast ? '└─ ' : '├─ ') : '';
          const indent = heading.depth === 3 ? 'pl-4' : '';
          return (
            <li key={heading.url} className={indent}>
              <Link
                href={heading.url}
                className="text-gray-700 hover:text-primary-500 dark:text-gray-300"
              >
                {prefix}
                {heading.value}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
