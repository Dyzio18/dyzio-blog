'use client';

import { usePathname } from 'next/navigation';
import { slug } from 'github-slugger';
import { formatDate } from '@/content/utils/formatDate';
import type { CorePost } from '@/content/queries';
import Link from '@/components/Link';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { useT } from '@/lib/i18n/I18nProvider';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}
interface ListLayoutProps {
  posts: CorePost[];
  title: string;
  tagCounts: Record<string, number>;
  initialDisplayPosts?: CorePost[];
  pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.split('/')[1];
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;
  const { dict } = useT();

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            {dict.blog.previous}
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            {dict.blog.previous}
          </Link>
        )}
        <span>
          {currentPage} {dict.blog.of} {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            {dict.blog.next}
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            {dict.blog.next}
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  tagCounts,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname();
  const { dict } = useT();
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="sm:hidden text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden max-h-screen h-full sm:flex flex-wrap bg-gray-50 dark:bg-gray-900/70 shadow-md pt-5 dark:shadow-gray-800/40 rounded min-w-[280px] max-w-[280px] overflow-auto">
            <div className="py-4 px-6">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-500 font-bold uppercase">{dict.blog.allPostsHeading}</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="font-bold uppercase text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
                >
                  {dict.blog.allPostsHeading}
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {pathname.split('/tags/')[1] === slug(t) ? (
                        <h3 className="inline py-2 px-3 uppercase text-sm font-bold text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="py-2 px-3 uppercase text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div>
            {/* Mobile-only filter chips */}
            <div className="mb-4 flex gap-2 overflow-x-auto sm:hidden">
              <Link
                href="/blog"
                className="shrink-0 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-600 transition hover:bg-primary-500/20 dark:text-primary-300 dark:hover:bg-primary-500/25"
              >
                {dict.blog.allPostsHeading}
              </Link>
              <Link
                href="/tags/travel"
                className="shrink-0 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-600 transition hover:bg-primary-500/20 dark:text-primary-300 dark:hover:bg-primary-500/25"
              >
                {dict.blog.filterTravel}
              </Link>
              <Link
                href="/tags/dev"
                className="shrink-0 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-600 transition hover:bg-primary-500/20 dark:text-primary-300 dark:hover:bg-primary-500/25"
              >
                {dict.blog.filterDev}
              </Link>
              <Link
                href="/tags/zycie"
                className="shrink-0 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-600 transition hover:bg-primary-500/20 dark:text-primary-300 dark:hover:bg-primary-500/25"
              >
                {dict.blog.filterLife}
              </Link>
            </div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, mode, images, readingTime } = post;
                const coverImage = images?.[0];
                const rtText = readingTime.text.replace('min read', 'min czytania');
                return (
                  <li key={path} className="py-5" data-mode={mode}>
                    <article className="group flex flex-col gap-4 transition-all hover:-translate-y-0.5">
                      {coverImage && (
                        <Link href={`/${path}`} className="block">
                          <div className="aspect-[16/9] overflow-hidden rounded-lg">
                            <Image
                              src={coverImage}
                              alt={title}
                              width={480}
                              height={270}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </Link>
                      )}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          <span>·</span>
                          <span>{rtText}</span>
                        </div>
                        <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight">
                          <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap">
                          {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                        <div className="prose max-w-none line-clamp-3 text-gray-600 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}