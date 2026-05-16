'use client';

import { useSearch } from '@/components/search/SearchProvider';

const SearchButton = () => {
  const { enabled, openSearch } = useSearch();

  if (!enabled) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Open search"
      onClick={openSearch}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-primary-600 dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:text-primary-300 sm:border sm:border-gray-200/60 sm:px-3 sm:dark:border-gray-800/60 w-9 sm:w-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <span className="hidden text-sm sm:inline">Szukaj</span>
      <span className="hidden rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400 md:inline">
        ⌘K
      </span>
    </button>
  );
};

export default SearchButton;
