import { slug } from 'github-slugger';
import { getAllPosts, allCoreContent } from '@/content/queries';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayoutWithTags';
import tagData from 'app/tag-data.json';
import { genPageMetadata } from 'app/seo';
import { Metadata } from 'next';
import tagDisplayNames from '@/data/tagDisplayNames';

export async function generateMetadata({ params }: { params: Promise<{ tag: string; }>; }): Promise<Metadata> {
  const { tag: tagParam } = await params;
  const tag = decodeURI(tagParam);
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>;
  const tagKeys = Object.keys(tagCounts);
  const paths = tagKeys.map((tag) => ({
    tag: tag,
  }));
  return paths;
};

export default async function TagPage({ params }: { params: Promise<{ tag: string; }>; }) {
  const { tag: tagParam } = await params;
  const tag = decodeURI(tagParam);
  const title = tagDisplayNames[tag] || (tag[0].toUpperCase() + tag.slice(1));
  const filteredPosts = allCoreContent(
    getAllPosts().filter(
      (post) => post.draft !== true && post.tags && post.tags.map((t) => slug(t)).includes(tag)
    )
  );
  return <ListLayout posts={filteredPosts} title={title} />;
}