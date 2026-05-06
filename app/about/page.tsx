import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer';
import AuthorLayout from '@/layouts/AuthorLayout';
import { getAuthorBySlug, coreAuthor } from '@/content/queries'
import { genPageMetadata } from 'app/seo';

export const metadata = genPageMetadata({ title: 'About' });

export default function Page() {
  const author = getAuthorBySlug('default');
  if (!author) {
    return null;
  }
  const mainContent = coreAuthor(author);

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.bodyCode} />
      </AuthorLayout>
    </>
  );
}