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
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {displayName}
    </Link>
  );
};

export default Tag;
