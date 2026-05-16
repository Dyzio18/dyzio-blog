import type { Dictionary } from '@/lib/i18n/dictionaries/pl';

type NavKey = keyof Dictionary['nav'];

const headerNavLinks: { href: string; key: NavKey }[] = [
  { href: '/blog', key: 'blog' },
  { href: '/travel-map', key: 'travelMap' },
  { href: '/tags', key: 'tags' },
  { href: '/eqchange', key: 'eqchange' },
  { href: '/about', key: 'contact' },
];

export default headerNavLinks;
