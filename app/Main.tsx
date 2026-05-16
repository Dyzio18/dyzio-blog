import Link from '@/components/Link';
import Image from '@/components/Image';
import NewsletterForm from '@/components/NewsletterForm';
import Tag from '@/components/Tag';
import { formatDate } from '@/content/utils/formatDate';
import siteMetadata from '@/data/siteMetadata';
import type { Dictionary } from '@/lib/i18n/dictionaries/pl';
import type { PostMode } from '@/content/queries';

const MAX_DISPLAY = 5;

interface PostSummary {
  slug: string;
  date: string;
  title: string;
  summary?: string;
  tags: string[];
  mode: PostMode;
  images?: string[];
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
}

interface HomeProps {
  posts: PostSummary[];
  dict: Dictionary;
}

function readingTimeText(text: string): string {
  return text.replace('min read', 'min czytania');
}

// ── PostCard (regular cards, index >= 1) ─────────────────────────────────────

function PostCard({ post, dict }: { post: PostSummary; dict: Dictionary }) {
  const { slug, date, title, summary, tags, images, readingTime } = post;
  const coverImage = images?.[0];

  return (
    <article className="group transition-all hover:-translate-y-0.5">
      <div className={`flex flex-col gap-4 ${coverImage ? 'md:flex-row md:items-start' : ''}`}>
        {coverImage && (
          <Link href={`/blog/${slug}`} className="shrink-0 md:w-1/3">
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

        <div className={`flex flex-col gap-3 ${coverImage ? 'md:w-2/3' : 'w-full'}`}>
          {!coverImage && post.mode === 'travel' && (
            <div className="border-l-4 border-primary-500 pl-6">
              <CardContent post={post} dict={dict} />
            </div>
          )}
          {!coverImage && post.mode === 'dev' && (
            <>
              <div aria-hidden className="select-none font-mono text-xs text-primary-500">
                ─────────
              </div>
              <CardContent post={post} dict={dict} />
            </>
          )}
          {!coverImage && post.mode === 'default' && <CardContent post={post} dict={dict} />}
          {coverImage && <CardContent post={post} dict={dict} />}
        </div>
      </div>
    </article>
  );
}

function CardContent({ post, dict }: { post: PostSummary; dict: Dictionary }) {
  const { slug, date, title, summary, tags, readingTime } = post;
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
        <span>·</span>
        <span>{readingTimeText(readingTime.text)}</span>
      </div>
      <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight">
        <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
          {title}
        </Link>
      </h2>
      <div className="flex flex-wrap">
        {tags.map((tag) => (
          <Tag key={tag} text={tag} />
        ))}
      </div>
      <div className="prose max-w-none line-clamp-3 text-gray-600 dark:text-gray-400">
        {summary}
      </div>
      <div>
        <Link
          href={`/blog/${slug}`}
          className="text-base font-medium text-primary-500 hover:text-primary-600"
          aria-label={`Read "${title}"`}
        >
          {dict.home.readMore} &rarr;
        </Link>
      </div>
    </>
  );
}

// ── FeaturedCard (first post, index === 0) ────────────────────────────────────

function FeaturedCard({ post, dict }: { post: PostSummary; dict: Dictionary }) {
  const { slug, date, title, summary, tags, images, readingTime } = post;
  const coverImage = images?.[0];

  // If no cover image, fall back to the regular PostCard layout
  if (!coverImage) {
    return <PostCard post={post} dict={dict} />;
  }

  return (
    <article className="group transition-all hover:-translate-y-0.5">
      <Link href={`/blog/${slug}`} className="block">
        <div className="aspect-[21/9] overflow-hidden rounded-lg">
          <Image
            src={coverImage}
            alt={title}
            width={1200}
            height={514}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
      </Link>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
          <span>·</span>
          <span>{readingTimeText(readingTime.text)}</span>
        </div>
        <h2 className="mt-1 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
            {title}
          </Link>
        </h2>
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <div className="prose max-w-none line-clamp-3 text-gray-600 dark:text-gray-400">
          {summary}
        </div>
        <div>
          <Link
            href={`/blog/${slug}`}
            className="text-base font-medium text-primary-500 hover:text-primary-600"
            aria-label={`Read "${title}"`}
          >
            {dict.home.readMore} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home({ posts, dict }: HomeProps) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <HeroSection dict={dict} />
        <ul className="mt-5 divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && dict.home.noPosts}
          {posts.slice(0, MAX_DISPLAY).map((post, index) => {
            const isFeatured = index === 0;
            return (
              <li
                key={post.slug}
                className={isFeatured ? 'pt-2 pb-12' : 'py-10'}
                data-mode={post.mode}
              >
                {isFeatured ? (
                  <FeaturedCard post={post} dict={dict} />
                ) : (
                  <PostCard post={post} dict={dict} />
                )}
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
          <h1 className="text-display-xl font-bold">{dict.home.heroGreeting}</h1>
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
