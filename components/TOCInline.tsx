import Link from '@/components/Link';

type TocEntry = {
  value: string;
  url: string;
  depth: number;
};

interface TocInlineProps {
  toc?: TocEntry[];
  fromHeading?: number;
  toHeading?: number;
  exclude?: string | string[];
}

export default function TOCInline({
  toc = [],
  fromHeading = 1,
  toHeading = 6,
  exclude = [],
}: TocInlineProps) {
  const exclusions = Array.isArray(exclude) ? exclude : [exclude];
  const items = toc.filter(
    (entry) =>
      entry.depth >= fromHeading &&
      entry.depth <= toHeading &&
      !exclusions.some((value) => value && entry.value.includes(value))
  );

  if (!items.length) {
    return null;
  }

  return (
    <nav className="my-8 rounded-2xl border border-gray-200 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/70">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        Spis treści
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((entry) => (
          <li key={entry.url} style={{ paddingLeft: `${(entry.depth - fromHeading) * 12}px` }}>
            <Link
              href={entry.url}
              className="text-sm text-gray-700 transition hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
            >
              {entry.value}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}