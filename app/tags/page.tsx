import Link from '@/components/Link';
import Tag from '@/components/Tag';
import { getTagCounts } from '@/content/queries';
import { slug } from 'github-slugger';
import { genPageMetadata } from 'app/seo';
import { getDictionary } from '@/lib/i18n/getDictionary';

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' });

export default async function Page() {
  const tagCounts = getTagCounts();
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);
  const { dict } = await getDictionary();
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            {dict.tags.title}
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && dict.tags.noTags}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
