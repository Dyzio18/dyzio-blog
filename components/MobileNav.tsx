'use client';

import { useState, useEffect } from 'react';
import Link from './Link';
import headerNavLinks from '@/data/headerNavLinks';
import { useT } from '@/lib/i18n/I18nProvider';

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);
  const { dict } = useT();

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto';
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
      }
      return !status;
    });
  };

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-100 h-8 w-8"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`fixed left-0 top-0 z-40 h-full w-full transform bg-white/95 backdrop-blur-xl duration-300 ease-in-out sm:hidden dark:bg-gray-950/95 ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Ambient gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-transparent dark:from-primary-950/30" />
        <div className="relative flex justify-end">
          <button className="mr-8 mt-11 h-8 w-8" aria-label="Toggle Menu" onClick={onToggleNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <nav className="relative mt-8">
          {headerNavLinks.map((link, index) => (
            <div key={link.key} className="px-12 py-4">
              <Link
                href={link.href}
                className="text-3xl font-semibold tracking-tight text-gray-900 transition hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-300 animate-[fadeInUp_0.4s_ease-out_both]"
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={onToggleNav}
              >
                {dict.nav[link.key]}
              </Link>
            </div>
          ))}
        </nav>
        <div className="absolute bottom-10 left-12 text-eyebrow uppercase text-gray-500">Dyzio.me</div>
      </div>
    </>
  );
};

export default MobileNav;
