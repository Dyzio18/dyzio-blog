import 'css/prism.css';
import 'katex/dist/katex.css';

import PageTitle from '@/components/PageTitle';
import { components } from '@/components/MDXComponents';
import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer';
import { getAllPostsSorted, getPostBySlug, getAuthorBySlug, allCoreContent, coreContent, coreAuthor } from '@/content/queries';
import type { CorePost, CoreAuthor } from '@/content/queries';
import PostSimple from '@/layouts/PostSimple';
import PostLayout from '@/layouts/PostLayout';
import PostBanner from '@/layouts/PostBanner';
import { Metadata } from 'next';
import siteMetadata from '@/data/siteMetadata';

const defaultLayout = 'PostLayout';
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[]; }>;
}): Promise<Metadata | undefined> {
  const { slug: slugSegments } = await params;
  const slug = decodeURI(slugSegments.join('/'));
  const post = getPostBySlug(slug);
  if (!post) {
    return;
  }

  const authorList = post.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = getAuthorBySlug(author);
    return authorResults ? coreAuthor(authorResults) : null;
  }).filter(Boolean) as CoreAuthor[];

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  let imageList = [siteMetadata.socialBanner];
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    };
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  const posts = getAllPostsSorted();
  const paths = posts.map((p) => ({ slug: p.slug.split('/') }));

  return paths;
};

// Revalidate blog post pages every hour to pick up content updates without a full redeploy
export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ slug: string[]; }>; }) {
  const { slug: slugSegments } = await params;
  const slug = decodeURI(slugSegments.join('/'));
  const sortedCoreContents = allCoreContent(getAllPostsSorted());
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>
          Under Construction{' '}
          <span role="img" aria-label="roadwork sign">
            🚧
          </span>
        </PageTitle>
      </div>
    );
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = getPostBySlug(slug);
  if (!post) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>
          Under Construction{' '}
          <span role="img" aria-label="roadwork sign">
            🚧
          </span>
        </PageTitle>
      </div>
    );
  }
  const authorList = post.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = getAuthorBySlug(author);
    return authorResults ? coreAuthor(authorResults) : null;
  }).filter(Boolean) as CoreAuthor[];
  const mainContent = coreContent(post);
  const jsonLd = post.structuredData;
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    };
  });

  const Layout = layouts[(post.layout || defaultLayout) as keyof typeof layouts];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.bodyCode} components={components} toc={post.toc} />
      </Layout>
    </>
  );
}