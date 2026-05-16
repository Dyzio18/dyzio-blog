import siteMetadata from '@/data/siteMetadata';
import Link from './Link';
import MobileNav from './MobileNav';
import ThemeSwitch from './ThemeSwitch';
import SearchButton from './SearchButton';
import LangSwitch from './LangSwitch';
import NavLinks from './NavLinks';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
        <NavLinks />
        <SearchButton />
        <LangSwitch />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
