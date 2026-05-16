export type Dictionary = {
  nav: {
    home: string;
    blog: string;
    travelMap: string;
    tags: string;
    eqchange: string;
    contact: string;
  };
  home: {
    heroGreeting: string;
    heroBody: string;
    heroLinkBlog: string;
    heroLinkEqchange: string;
    heroLinkBucketlist: string;
    heroLinkContact: string;
    noPosts: string;
    readMore: string;
    allPosts: string;
  };
  blog: {
    title: string;
    previous: string;
    next: string;
    of: string;
    allPostsHeading: string;
    filterTravel: string;
    filterDev: string;
    filterLife: string;
  };
  travelMap: {
    title: string;
    subtitle: string;
    allDestinations: string;
    trips: string;
    readMore: string;
    statCountries: string;
    statCities: string;
    statReportages: string;
  };
  tags: {
    title: string;
    noTags: string;
  };
  bucketlist: {
    title: string;
    subtitleLine1: string;
    subtitleLine2: string;
  };
  projects: {
    title: string;
    subtitle: string;
  };
  postLayout: {
    authorsHeading: string;
    viewOnGithub: string;
    previousArticle: string;
    nextArticle: string;
    back: string;
    tagsHeading: string;
    tocHeading: string;
    relatedPostsHeading: string;
  };
  langSwitch: {
    pl: string;
    en: string;
    aria: string;
  };
};

export const pl: Dictionary = {
  nav: {
    home: 'Strona główna',
    blog: 'blog',
    travelMap: 'mapa podróży',
    tags: 'tagi',
    eqchange: 'eqchange',
    contact: 'kontakt',
  },
  home: {
    heroGreeting: 'Siema!',
    heroBody:
      'To mój blog osobisty, nazywam się Patryk Nizio. Jestem programistą oraz pasjonatem JS/TS. Uwielbiam realizować swoje pomysły i cele. Na tym blogu dzielę się swoją wiedzą i doświadczeniem. Czasem piszę o technologiach, czasem o życiu i podróżach. Zapraszam do czytania!',
    heroLinkBlog: 'Blog',
    heroLinkEqchange: 'Platforma eqchange',
    heroLinkBucketlist: 'Lista celów',
    heroLinkContact: 'Kontakt',
    noPosts: 'Brak wpisów.',
    readMore: 'Czytaj dalej',
    allPosts: 'Wszystkie wpisy',
  },
  blog: {
    title: 'Wszystkie wpisy',
    previous: 'Poprzednia',
    next: 'Następna',
    of: 'z',
    allPostsHeading: 'Wszystkie wpisy',
    filterTravel: 'Podróże',
    filterDev: 'Dev',
    filterLife: 'Życie',
  },
  travelMap: {
    title: 'Mapa podróży',
    subtitle: 'Mapa świata ze wszystkimi miejscami i linkami do wpisów.',
    allDestinations: 'Wszystkie miejsca',
    trips: 'Wyprawy',
    readMore: 'Czytaj dalej',
    statCountries: 'krajów',
    statCities: 'miast',
    statReportages: 'reportaży',
  },
  tags: {
    title: 'Tagi',
    noTags: 'Brak tagów.',
  },
  bucketlist: {
    title: 'Lista celów',
    subtitleLine1: 'Mówili — jedź daleko!',
    subtitleLine2: 'Oczywiście, jechanie tam jest na mojej liście.',
  },
  projects: {
    title: 'Projekty',
    subtitle: 'Moje prywatne projekty, nad którymi pracuję.',
  },
  postLayout: {
    authorsHeading: 'Autorzy',
    viewOnGithub: 'Zobacz na GitHubie',
    previousArticle: 'Poprzedni wpis',
    nextArticle: 'Następny wpis',
    back: 'Powrót',
    tagsHeading: 'Tagi',
    tocHeading: 'Spis treści',
    relatedPostsHeading: 'Powiązane wpisy',
  },
  langSwitch: {
    pl: 'PL',
    en: 'EN',
    aria: 'Zmień język',
  },
};
