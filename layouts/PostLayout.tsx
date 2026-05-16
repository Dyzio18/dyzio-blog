import { ReactNode } from 'react';
import type { CorePost, CoreAuthor } from '@/content/queries';
import Comments from '@/components/Comments';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import { getDictionary } from '@/lib/i18n/getDictionary';
import ReadingProgress from '@/components/ReadingProgress';
import PostTOC from '@/components/PostTOC';

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`;

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface LayoutProps {
  content: CorePost;
  authorDetails: CoreAuthor[];
  next?: { path: string; title: string };
  prev?: { path: string; title: string };
  children: ReactNode;
  relatedPosts?: CorePost[];
}

export default async function PostLayout({ content, authorDetails, next, prev, children, relatedPosts = [] }: LayoutProps) {
  const { dict } = await getDictionary();
  const { filePath, path, slug, date, title, tags, mode, toc } = content;
  const basePath = path.split('/')[0];

  return (
    <SectionContainer>
      <ReadingProgress />
      <ScrollTopAndComment />
      <article data-mode={mode}>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700 xl:col-start-1 xl:row-start-1">
              <dt className="sr-only">{dict.postLayout.authorsHeading}</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter.replace('https://twitter.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            {toc && toc.length > 0 && (
              <aside className="hidden xl:block xl:col-start-1 xl:row-start-2 xl:sticky xl:top-8 xl:self-start xl:pt-6">
                <PostTOC toc={toc} mode={mode} label={dict.postLayout.tocHeading} />
              </aside>
            )}
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
              <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={editUrl(filePath)}>{dict.postLayout.viewOnGithub}</Link>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
              {relatedPosts.length > 0 && (
                <aside className="pt-8 pb-2">
                  <h2 className="text-eyebrow font-semibold uppercase text-gray-500 dark:text-gray-400 mb-4">
                    {dict.postLayout.relatedPostsHeading}
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((p) => (
                      <li key={p.slug} data-mode={p.mode}>
                        <Link
                          href={`/${p.path}`}
                          className="block rounded-lg border border-gray-200 p-4 transition hover:border-primary-500 dark:border-gray-800"
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {new Date(p.date).toLocaleDateString(siteMetadata.locale)}
                          </p>
                          <h3 className="mt-1 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
                            {p.title}
                          </h3>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-eyebrow uppercase text-gray-500 dark:text-gray-400">
                      {dict.postLayout.tagsHeading}
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-eyebrow uppercase text-gray-500 dark:text-gray-400">
                          {dict.postLayout.previousArticle}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-eyebrow uppercase text-gray-500 dark:text-gray-400">
                          {dict.postLayout.nextArticle}
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; {dict.postLayout.back}
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
