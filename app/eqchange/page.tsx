import { Authors, allAuthors, allCMs, CMS } from 'contentlayer/generated';
import { MDXLayoutRenderer } from 'pliny/mdx-components';
import { components } from '@/components/MDXComponents';
import { coreContent } from 'pliny/utils/contentlayer';
import { genPageMetadata } from 'app/seo';
import LayoutWrapper from '../../components/LayoutWrapper';
import PostSimple from '../../layouts/PostSimple';
import PostLayout from '../../layouts/PostLayout';
import PostBanner from '../../layouts/PostBanner';

export const metadata = genPageMetadata({ title: 'About' });

const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
};

export default function Page() {
  const cms = allCMs.find((p) => p.slug === 'eqchange') as CMS;
  const mainContent = coreContent(cms);

  const Layout = layouts['PostSimple'];

  return (
    <PostSimple content={mainContent}>
      <MDXLayoutRenderer code={cms.body.code} components={components} toc={cms.toc} />
    </PostSimple>
  );
}
