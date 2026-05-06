import { MDXLayoutRenderer } from '@/components/MDXLayoutRenderer';
import { components } from '@/components/MDXComponents';
import { getPageBySlug, corePage } from '@/content/queries';
import { genPageMetadata } from 'app/seo';
import LayoutWrapper from '../../components/LayoutWrapper';
import PostSimple from '../../layouts/PostSimple';

export const metadata = genPageMetadata({ title: 'About' });

export default function Page() {
  const cms = getPageBySlug('eqchange');
  if (!cms) {
    return null;
  }
  const mainContent = corePage(cms);

  return (
    <PostSimple content={mainContent}>
      <MDXLayoutRenderer code={cms.bodyCode} components={components} toc={cms.toc} />
    </PostSimple>
  );
}