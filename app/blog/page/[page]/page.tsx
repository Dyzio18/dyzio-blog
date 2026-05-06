import ListLayout from '@/layouts/ListLayoutWithTags';
import { getAllPostsSorted, getTagCounts, allCoreContent } from '@/content/queries';

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () => {
  const posts = getAllPostsSorted();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));

  return paths;
};

export default async function Page({ params }: { params: Promise<{ page: string; }>; }) {
  const { page } = await params;
  const posts = allCoreContent(getAllPostsSorted());
  const tagCounts = getTagCounts();
  const pageNumber = parseInt(page, 10);
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