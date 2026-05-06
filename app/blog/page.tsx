import ListLayout from '@/layouts/ListLayoutWithTags';
import { getAllPostsSorted, getTagCounts, allCoreContent } from '@/content/queries';
import { genPageMetadata } from 'app/seo';

const POSTS_PER_PAGE = 5;

export const metadata = genPageMetadata({ title: 'Blog' });

export default function BlogPage() {
  const posts = allCoreContent(getAllPostsSorted());
  const tagCounts = getTagCounts();
  const pageNumber = 1;
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={posts}
      tagCounts={tagCounts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  );
}