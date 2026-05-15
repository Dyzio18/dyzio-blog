import Link from '@/components/Link';
import NewsletterForm from '@/components/NewsletterForm';
import Tag from '@/components/Tag';
import { formatDate } from '@/content/utils/formatDate';
import siteMetadata from '@/data/siteMetadata';
import type { Dictionary } from '@/lib/i18n/dictionaries/pl';

const MAX_DISPLAY = 5;

interface HomeProps {
  posts: {
    slug: string;
    date: string;
    title: string;
    summary?: string;
    tags: string[];
  }[];
  dict: Dictionary;
}

export default function Home({ posts, dict }: HomeProps) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <HeroSection dict={dict} />
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 mt-5">
          {!posts.length && dict.home.noPosts}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post;
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          {dict.home.readMore} &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            {dict.home.allPosts} &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  );
}

const HeroSection = ({ dict }: { dict: Dictionary }) => {
  return (
    <div className="bg-dot relative isolate overflow-hidden bg-gray-900 py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{dict.home.heroGreeting}</h1>
          <p className="mt-6 text-xl leading-8">
            {dict.home.heroBody}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 sm:grid-cols-2 md:flex lg:gap-x-10">
            <Link href="/blog">
              {dict.home.heroLinkBlog} <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/eqchange">
              {dict.home.heroLinkEqchange} <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/bucketlist">
              {dict.home.heroLinkBucketlist} <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/about">
              {dict.home.heroLinkContact} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
