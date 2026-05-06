import Script from 'next/script';
import siteMetadata from '@/data/siteMetadata';

export default function Analytics() {
  const websiteId = siteMetadata.analytics?.umamiAnalytics?.umamiWebsiteId;

  if (!websiteId) {
    return null;
  }

  return (
    <Script
      async
      defer
      data-website-id={websiteId}
      src="https://analytics.umami.is/script.js"
      strategy="afterInteractive"
    />
  );
}