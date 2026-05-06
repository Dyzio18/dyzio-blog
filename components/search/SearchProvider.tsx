'use client';

import Link from '@/components/Link';
import { useRouter } from 'next/navigation';
import {
  ReactNode,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type SearchDocument = {
  id: string;
  path: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
};

type SearchConfig = {
  provider?: string;
  indexPath?: string | false;
};

type SearchContextValue = {
  enabled: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const SearchContext = createContext<SearchContextValue>({
  enabled: false,
  openSearch: () => {},
  closeSearch: () => {},
});

export function SearchProvider({
  children,
  searchConfig,
}: {
  children: ReactNode;
  searchConfig?: SearchConfig;
}) {
  const enabled = searchConfig?.provider === 'local' && Boolean(searchConfig.indexPath);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadDocuments = useCallback(async () => {
    if (!enabled || hasLoaded || isLoading || !searchConfig?.indexPath) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/${searchConfig.indexPath}`);
      const payload = await response.json();
      setDocuments(Array.isArray(payload) ? payload : []);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, hasLoaded, isLoading, searchConfig?.indexPath]);

  const closeSearch = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    if (!enabled) {
      return;
    }

    setIsOpen(true);
    void loadDocuments();
  }, [enabled, loadDocuments]);

  const toggleSearch = useCallback(() => {
    if (isOpen) {
      closeSearch();
      return;
    }

    openSearch();
  }, [closeSearch, isOpen, openSearch]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggleSearch();
        return;
      }

      if (event.key === 'Escape') {
        closeSearch();
        return;
      }

      if (!isTypingField && event.key === '/') {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeSearch, enabled, openSearch, toggleSearch]);

  useEffect(() => {
    if (!isOpen) return;

    const currentOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = currentOverflow;
    };
  }, [isOpen]);

  const filteredDocuments = useMemo(() => {
    if (!query.trim()) {
      return documents.slice(0, 8);
    }

    const normalizedQuery = query.toLowerCase();
    return documents.filter((document) => {
      const haystack = [
        document.title,
        document.summary || '',
        document.date,
        ...(document.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [documents, query]);

  return (
    <SearchContext.Provider
      value={{
        enabled,
        openSearch,
        closeSearch,
      }}
    >
      {children}
      {enabled && isOpen && (
        <SearchDialog
          documents={filteredDocuments}
          isLoading={isLoading}
          query={query}
          setQuery={setQuery}
          onClose={closeSearch}
        />
      )}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

function SearchDialog({
  documents,
  isLoading,
  query,
  setQuery,
  onClose,
}: {
  documents: SearchDocument[];
  isLoading: boolean;
  query: string;
  setQuery: (value: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-950/50 px-4 py-16 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj po tytule, tagach albo opisie..."
            className="w-full border-0 bg-transparent p-0 text-base text-gray-950 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 transition hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:text-white"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3">
          {isLoading && <p className="px-3 py-6 text-sm text-gray-500 dark:text-gray-400">Ładuję indeks wyszukiwania...</p>}
          {!isLoading && documents.length === 0 && (
            <p className="px-3 py-6 text-sm text-gray-500 dark:text-gray-400">Brak wyników.</p>
          )}
          {!isLoading && documents.length > 0 && (
            <ul className="space-y-2">
              {documents.slice(0, 20).map((document) => (
                <li key={document.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(`/${document.path}`);
                    }}
                    className="block w-full rounded-2xl border border-transparent px-4 py-3 text-left transition hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{document.title}</p>
                      <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{document.date}</span>
                    </div>
                    {document.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {document.summary}
                      </p>
                    )}
                    {!!document.tags?.length && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {document.tags.slice(0, 4).map((tag) => (
                          <span
                            key={`${document.id}-${tag}`}
                            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          Enter i klik przenoszą do wpisu. Możesz też użyć <Link href="/blog">archiwum bloga</Link>.
        </div>
      </div>
    </div>
  );
}