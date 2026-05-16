import 'css/tailwind.css';

import { Space_Grotesk, Fraunces, JetBrains_Mono } from 'next/font/google';
import Analytics from '@/components/Analytics';
import Header from '@/components/Header';
import SectionContainer from '@/components/SectionContainer';
import Footer from '@/components/Footer';
import { SearchProvider } from '@/components/search/SearchProvider';
import siteMetadata from '@/data/siteMetadata';
import { ThemeProviders } from './theme-providers';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/getDictionary';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display-serif',
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-display-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, dict } = await getDictionary();
  return (
    <html
      lang={lang}
      className={`${space_grotesk.variable} ${fraunces.variable} ${jetbrains_mono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white"
        >
          {dict.a11y.skipToContent}
        </a>
        <ThemeProviders>
          <I18nProvider lang={lang} dict={dict}>
            <Analytics />
            <SectionContainer>
              <div className="flex h-screen flex-col justify-between font-sans">
                <SearchProvider searchConfig={siteMetadata.search}>
                  <Header />
                  <main id="main-content" className="mb-auto">{children}</main>
                </SearchProvider>
                <Footer />
              </div>
            </SectionContainer>
          </I18nProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}
