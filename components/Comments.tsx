'use client';

import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';
import siteMetadata from '@/data/siteMetadata';

export default function Comments({ slug }: { slug: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadComments, setLoadComments] = useState(false);
  const { resolvedTheme } = useTheme();

  const config = useMemo(() => {
    if (siteMetadata.comments?.provider !== 'giscus') {
      return null;
    }

    return siteMetadata.comments.giscusConfig;
  }, []);

  const theme = resolvedTheme === 'dark' ? config?.darkTheme || 'dark' : config?.theme || 'light';

  useEffect(() => {
    if (!loadComments || !config || !containerRef.current) {
      return;
    }

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', config.repo || '');
    script.setAttribute('data-repo-id', config.repositoryId || '');
    script.setAttribute('data-category', config.category || '');
    script.setAttribute('data-category-id', config.categoryId || '');
    script.setAttribute('data-mapping', config.mapping || 'pathname');
    script.setAttribute('data-reactions-enabled', config.reactions || '1');
    script.setAttribute('data-emit-metadata', config.metadata || '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', config.lang || 'pl');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-term', slug);

    containerRef.current.appendChild(script);
  }, [config, loadComments, slug, theme]);

  useEffect(() => {
    if (!loadComments) {
      return;
    }

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme,
          },
        },
      },
      'https://giscus.app'
    );
  }, [loadComments, theme]);

  if (!config) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {!loadComments && (
        <button
          type="button"
          onClick={() => setLoadComments(true)}
          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:text-white"
        >
          Pokaż komentarze
        </button>
      )}
      {loadComments && <div ref={containerRef} className="min-h-28" />}
    </div>
  );
}
