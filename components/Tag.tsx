import Link from 'next/link';
import { slug } from 'github-slugger';
import tagDisplayNames from '@/data/tagDisplayNames';
interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  const displayName = tagDisplayNames[slug(text)] || text;
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-2 mb-2 inline-flex items-center rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.04em] text-primary-600 transition hover:bg-primary-500/20 dark:text-primary-300 dark:hover:bg-primary-500/25"
    >
      <span aria-hidden className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary-500"></span>
      {displayName}
    </Link>
  );
};

export default Tag;
