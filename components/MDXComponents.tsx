import type { MDXComponents } from 'mdx/types';
import BlogNewsletterForm from './BlogNewsletterForm';
import Image from './Image';
import CustomLink from './Link';
import Map from './Map';
import MdxImage from './MdxImage';
import Pre from './Pre';
import TOCInline from './TOCInline';

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  img: MdxImage,
  pre: Pre,
  BlogNewsletterForm,
  Map,
};
