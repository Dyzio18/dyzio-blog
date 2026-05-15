# i18n PL/EN — minimalna polonizacja UI z możliwością przełączenia na EN

**Data:** 2026-05-15
**Autor:** dyzio
**Status:** Zatwierdzony do implementacji

## Kontekst i motywacja

Strona `dyzio.me` ma w GUI dryf językowy: nagłówki i nav po angielsku
("Travel Map", "All Destinations", "blog", "tags"), ale dane i treść postów
po polsku ("Październik 2022", "Trekking wokół Annapurny", "Seul, Korea
Południowa"). Reguła w `CLAUDE.md` mówi: "Default to Polish for user-facing
content unless explicitly asked for English." Treść (posty MDX) jest PL.
Spójność wymaga, żeby chrome UI też był PL.

Wyjątek: strona `/about` musi być po angielsku, bo służy jako landing dla
rekruterów.

Dodatkowo właściciel chce mieć możliwość przełączenia całego chrome'u na EN
(switcher PL/EN), bez tłumaczenia treści postów.

## Cel

1. Uspójnić język UI: chrome po polsku domyślnie, treść postów po polsku.
2. Dodać lekką infrastrukturę i18n umożliwiającą przełączenie chrome'u
   na EN przez switcher w headerze.
3. `/about` pozostaje EN-only, niezależnie od ustawienia switchera.

## Non-cele (świadome YAGNI)

- Tłumaczenie treści postów MDX — posty zostają PL-only.
- Route prefixy `/en/...` — brak duplikacji URL.
- Biblioteka `next-intl` — zbędna pod ten zakres.
- Detekcja `Accept-Language` — SEO zawsze widzi PL.
- Tłumaczenie tagów — tagi to identyfikatory.
- Hreflang / alternate URLs — brak alternate URLs.
- Persistencja per-user poza cookie.

## Architektura

### Mechanizm

**Dictionary + cookie, bez route prefixów.**

- Słowniki: `lib/i18n/dictionaries/pl.ts` i `lib/i18n/dictionaries/en.ts` —
  płaskie obiekty TypeScript ze stringami chrome'u, ten sam kształt w obu
  plikach (typ wymuszony przez `Dictionary` w `lib/i18n/types.ts`).
- Cookie `lang` o wartości `pl` | `en`. Brak cookie → PL.
- Server: `getDictionary()` w `lib/i18n/getDictionary.ts` — czyta cookie
  (`next/headers#cookies`) i zwraca słownik. Synchronously typowane.
- Client: `useT()` w `lib/i18n/useT.ts` — context provider hydrowany
  początkowym językiem z serwera; udostępnia funkcję `t(key)`.
- Switcher: `components/LangSwitch.tsx` — server action lub client `'use client'`
  ustawia cookie `lang` i wywołuje `router.refresh()`.

### Domyślny język

PL na zimno. Brak negocjacji `Accept-Language` — celowo, żeby crawlery i
udostępnione linki zawsze pokazywały PL.

### Struktura słownika

Płaska, kropkowane klucze opcjonalnie (preferowane: zagnieżdżone obiekty
z dot-access przez typed helper). Przykładowy szkielet (nie wyczerpujący):

```ts
// lib/i18n/dictionaries/pl.ts
export const pl = {
  nav: {
    home: 'Strona główna',
    blog: 'blog',
    travelMap: 'mapa podróży',
    tags: 'tagi',
    eqchange: 'eqchange',
    contact: 'kontakt',
  },
  travelMap: {
    title: 'Mapa podróży',
    subtitle: 'Mapa świata ze wszystkimi destynacjami i linkami do wpisów.',
    allDestinations: 'Wszystkie miejsca',
    trips: 'Wyprawy',
    readMore: 'Czytaj dalej →',
  },
  blog: {
    latest: 'Najnowsze',
    allPosts: 'Wszystkie posty',
    previous: 'Poprzednia',
    next: 'Następna',
  },
  common: {
    tags: 'Tagi',
  },
} as const;

export type Dictionary = typeof pl;
```

`en.ts` ma identyczny kształt z angielskimi wartościami; typ wymuszony przez
`: Dictionary`.

### Wyjątek `/about`

`app/about/page.tsx` jest renderowany twardo po angielsku. Implementacyjnie:

- `data/authors/default.mdx` zostaje przepisany na angielski.
- `metadata.title` pozostaje `'About'`.
- Strona nie korzysta z `getDictionary()`; używa hardkodowanych EN stringów
  jeśli jakieś chrome'owe etykiety jej dotyczą (poza nawigacją globalną).
- Header i `<LangSwitch />` są widoczne na tej stronie i działają (ustawiają
  cookie), ale treść samej strony `/about` nie reaguje na cookie.
- Brak komunikatu typu "Available in English only" — cisza, świadomy wybór.

### Switcher UI

- Komponent `LangSwitch` w prawym górnym rogu obok `ThemeSwitch`.
- Wygląd: `PL | EN`, aktywny język pogrubiony, drugi wyszarzony.
- Klik na nieaktywny: cookie `lang` ustawione (path `/`, max-age 1 rok,
  `SameSite=Lax`), `router.refresh()`.
- Brak animacji; minimal.

## Zakres zmian

### Tłumaczone (chrome)

- `components/Header.tsx` (i pochodne) — nav z dictionary.
- `components/Footer.tsx` — etykiety z dictionary.
- `app/page.tsx` / `app/Main.tsx` — chrome strony głównej.
- `app/blog/**` — "Najnowsze", "Wszystkie posty", paginacja, etykiety list.
- `app/travel-map/page.tsx` — wszystkie nagłówki, "Czytaj dalej →".
- `app/tags/**` — "Tagi", liczniki.
- `app/bucketlist/**` — chrome.
- `app/projects/**` — chrome.
- Tytuły `metadata` przez `genPageMetadata` — funkcja przyjmuje słownik lub
  klucze; szczegół do rozstrzygnięcia w planie implementacji.

### Nietłumaczone (zostają PL)

- Treść postów MDX w `data/blog/**.mdx`.
- Tytuły postów (frontmatter `title`).
- Dane wypraw w `app/travel-map/page.tsx` (`allDestinations`, `trips`):
  `name`, `date`, `description`, `destinations[].name`.
- Identyfikatory tagów (`'travel'`, `'nepal'`, itp.).

### EN-only (zostaje EN)

- `app/about/page.tsx` — chrome i metadata.
- `data/authors/default.mdx` — treść po angielsku.

## Nowe pliki

```
lib/i18n/
  types.ts                # type Dictionary, type Lang = 'pl' | 'en'
  dictionaries/
    pl.ts
    en.ts
  getDictionary.ts        # server helper, czyta cookies()
  useT.ts                 # client hook + Provider
components/
  LangSwitch.tsx          # 'use client', ustawia cookie + refresh
```

## Edge cases i decyzje

- **Cookie missing / nieprawidłowa wartość:** fallback PL.
- **SSR vs CSR mismatch:** server renderuje już z poprawnym językiem z
  cookie; client Provider hydruje tą samą wartością. Brak `'use client'`
  na poziomie root layoutu — tylko switcher i komponenty interaktywne.
- **Cache:** strony korzystające z `cookies()` są dynamicznie renderowane;
  to akceptowalne dla osobistego bloga (mała skala).
- **Brak klucza w słowniku:** `t('foo.bar')` zwraca klucz jako fallback +
  warning w dev console. Typy z `as const` powinny to wyeliminować na etapie
  kompilacji.
- **`/about` + cookie=en:** strona nadal renderuje EN — żadnej różnicy.
  Header (nawigacja) renderuje EN nav (spójne z cookie).
- **`/about` + cookie=pl:** strona nadal renderuje EN; header renderuje PL
  nav. Świadoma asymetria — nav jest globalny, treść `/about` jest twarda.

## Kryteria akceptacji

1. `/travel-map` w stanie domyślnym (brak cookie) ma chrome po polsku:
   "Mapa podróży", "Wszystkie miejsca", "Wyprawy", "Czytaj dalej →".
   Dane wypraw pozostają PL bez zmian.
2. Globalny nav po polsku w stanie domyślnym: "blog", "mapa podróży",
   "tagi", "kontakt", "eqchange".
3. `LangSwitch` widoczny w headerze. Klik na "EN" zmienia chrome na
   angielski na wszystkich stronach z dictionary.
4. `/about` renderuje treść po angielsku niezależnie od cookie.
5. Treść postów MDX pozostaje PL niezależnie od cookie.
6. `pnpm lint`, `pnpm typecheck`, `pnpm test` (lub odpowiednik z repo)
   przechodzą.
7. Wizualnie sprawdzona strona `/travel-map` w PL i EN; sprawdzona strona
   `/about`; sprawdzony switcher na kilku innych stronach.

## Otwarte pytania na etap planu

- Dokładny mechanizm `genPageMetadata` z dictionary (server-only context).
- Czy nav w mobile menu wymaga osobnej ścieżki czytania słownika.
- Lista wszystkich stron chrome'u do pokrycia (audyt w planie).

## Powiązane

- `CLAUDE.md` — reguła "Default to Polish for user-facing content".
- `app/travel-map/page.tsx` — miejsce, które uruchomiło dyskusję.
- `data/headerNavLinks.ts` — do zastąpienia/przeniesienia do słownika.
- `data/authors/default.mdx` — do przepisania na EN.
