# RFC-0001: Migracja z Contentlayer do własnego silnika contentu i custom CMS

- Status: Draft
- Data: 2026-05-05
- Autor: Patryk Nizio / GitHub Copilot
- Decyzja: Zastępujemy `contentlayer` i `next-contentlayer` własną warstwą contentową oraz własnym kontraktem CMS, zachowując MDX jako format autorski w pierwszej fazie migracji.

## 1. Kontekst

Obecny blog działa na `Next 16`, `React 19`, `contentlayer 0.3.4`, `next-contentlayer 0.3.4` oraz `pliny 0.4.1`. update turbopack.

Ten układ ma trzy problemy architektoniczne:

1. Warstwa contentowa jest ciasno spięta z przestarzałym generatorem typów i build pipeline.
2. Routing, layouty, search index, RSS i sitemap czytają dane z `.contentlayer`, więc model danych nie należy do aplikacji.
3. Migracje frameworkowe są trudne, bo content, rendering MDX i utilities są rozproszone między `contentlayer` i `pliny`.

Objawy w repo:

1. `package.json` uruchamia build przez `contentlayer build`.
2. Widoki importują `allBlogs`, `allAuthors`, `allCMs` z `contentlayer/generated`.
3. Layouty i listingi używają typów z `contentlayer/generated` oraz helperów z `pliny/utils/contentlayer`.
4. Assety pomocnicze, takie jak `search.json`, `tag-data.json` i RSS, są budowane ze struktury `.contentlayer`.

## 2. Problem

Obecny model nie pozwala traktować contentu jako własnej domeny. Blog działa, ale nie ma własnego kontraktu danych, własnego pipeline'u MDX ani własnej granicy pomiędzy storage, kompilacją contentu i prezentacją.

W praktyce oznacza to, że każda większa zmiana w stosie frontendowym albo wydawniczym wymaga utrzymywania zgodności z historycznym narzędziem, zamiast rozwijania własnego systemu publikacji.

## 3. Cel

Budujemy własny silnik contentu i własny kontrakt CMS, tak aby:

1. aplikacja czytała content przez nasze repozytorium domenowe, a nie przez `contentlayer/generated`,
2. MDX był kompilowany przez nasz pipeline,
3. search index, RSS, sitemap, tag counts i metadata były generowane z naszego modelu,
4. migracja do panelu admina lub zewnętrznego storage była możliwa bez przepisywania routów,
5. `Next` i `React` mogły być aktualizowane niezależnie od starego toolingu contentowego.

## 4. Non-goals

Ta decyzja nie obejmuje w pierwszej iteracji:

1. budowy pełnego wizualnego panelu admina,
2. migracji z MDX na rich text,
3. zmiany wizualnej bloga,
4. zmiany struktury URL,
5. zmiany źródła komentarzy i newslettera, o ile nie blokują migracji.

## 5. Decyzja

W pierwszej fazie odchodzimy od `Contentlayer`, ale nie odchodzimy od plikowego modelu authoringu. Źródłem prawdy pozostają pliki MDX w repo, natomiast ich odczyt, walidacja, kompilacja i projekcja na model domenowy przechodzą do naszego kodu.

Docelowo wprowadzamy trzy warstwy:

1. `storage`: skąd pochodzą dokumenty,
2. `engine`: jak dokumenty są parsowane, walidowane i kompilowane,
3. `delivery`: jak aplikacja korzysta z gotowego modelu contentu.

## 6. Kontrakt domenowy

Poniższy kontrakt staje się własnością aplikacji. Nie importujemy go z generatora zewnętrznego.

```ts
export type ContentKind = 'post' | 'author' | 'page'

export interface BaseContentDocument {
  kind: ContentKind
  id: string
  slug: string
  path: string
  sourcePath: string
  title?: string
  draft?: boolean
  bodyRaw: string
  bodyCode: string
  excerpt?: string
  toc: TocHeading[]
}

export interface TocHeading {
  value: string
  url: string
  depth: number
}

export interface AuthorDocument extends BaseContentDocument {
  kind: 'author'
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  instagram?: string
  layout?: string
}

export interface PostDocument extends BaseContentDocument {
  kind: 'post'
  title: string
  date: string
  lastmod?: string
  summary?: string
  tags: string[]
  images?: string[]
  authors: string[]
  layout?: 'PostSimple' | 'PostLayout' | 'PostBanner'
  bibliography?: string
  canonicalUrl?: string
  readingTime: {
    text: string
    minutes: number
    words: number
  }
  structuredData: Record<string, unknown>
}

export interface StaticPageDocument extends BaseContentDocument {
  kind: 'page'
  name?: string
  date?: string
}
```

## 7. Źródła contentu

W fazie 1 wspieramy trzy istniejące kolekcje:

1. `data/blog/**/*.mdx`
2. `data/authors/**/*.mdx`
3. `data/cms/**/*.mdx`

Mapowanie domenowe:

1. `data/blog` -> `PostDocument`
2. `data/authors` -> `AuthorDocument`
3. `data/cms` -> `StaticPageDocument`

To pozwala zachować obecny workflow pisania, zgodność z Obsidianowym myśleniem o plikach oraz prosty Git-based publishing flow.

## 8. Architektura docelowa

Proponowana struktura modułów:

```text
src/
  content/
    schema/
      post.ts
      author.ts
      page.ts
    storage/
      file-system.ts
    engine/
      parse-frontmatter.ts
      compile-mdx.ts
      compute-reading-time.ts
      build-toc.ts
      build-structured-data.ts
    repository/
      content-repository.ts
      posts-repository.ts
      authors-repository.ts
      pages-repository.ts
    queries/
      get-all-posts.ts
      get-post-by-slug.ts
      get-post-pagination.ts
      get-post-tags.ts
      get-author-by-slug.ts
      get-page-by-slug.ts
    projections/
      build-search-index.ts
      build-tag-counts.ts
      build-rss-items.ts
```

Zasady:

1. `repository` ukrywa sposób pobierania danych,
2. `engine` nie zna routów Next.js,
3. `app/` nie zna frontmatter parsera ani źródła storage,
4. build scripts korzystają z `queries` i `projections`, nie z wygenerowanych plików.

## 9. Zakres feature parity

Migracja jest uznana za kompletną dopiero wtedy, gdy nowy silnik wspiera co najmniej obecne możliwości.

### 9.1 Must-have

1. listowanie wpisów,
2. render wpisu po slug,
3. strony tagów,
4. `generateStaticParams` dla wpisów i paginacji,
5. autorzy i strona `about`,
6. strona `eqchange`,
7. frontmatter i draft filtering,
8. TOC,
9. reading time,
10. KaTeX,
11. Prism/highlight kodu,
12. `structuredData`,
13. sitemap,
14. RSS,
15. search index,
16. tag counts.

### 9.2 Nice-to-have

1. preview unpublished content,
2. cache invalidation po edycji,
3. zewnętrzny storage assets,
4. panel admina do edycji MDX.

## 10. Miejsca w aplikacji do przepięcia

Najważniejsze aktualne punkty zależności:

1. `app/page.tsx`
2. `app/blog/page.tsx`
3. `app/blog/page/[page]/page.tsx`
4. `app/blog/[...slug]/page.tsx`
5. `app/tags/[tag]/page.tsx`
6. `app/about/page.tsx`
7. `app/eqchange/page.tsx`
8. `app/sitemap.ts`
9. `scripts/generate-content-assets.mjs`
10. `scripts/rss.mjs`
11. `layouts/PostLayout.tsx`
12. `layouts/PostSimple.tsx`
13. `layouts/PostBanner.tsx`
14. `layouts/ListLayout.tsx`
15. `layouts/ListLayoutWithTags.tsx`

Drugorzędne zależności do oceny po migracji rdzenia:

1. `components/MDXComponents.tsx`
2. `components/SearchButton.tsx`
3. `app/layout.tsx`
4. `app/api/newsletter/route.ts`
5. `components/Comments.tsx`

## 11. Plan migracji

### Faza 0: Stabilizacja granicy

Cel: odseparować aplikację od bezpośrednich importów `contentlayer/generated`.

Zakres:

1. wprowadzić własne typy domenowe,
2. dodać własne helpery `sortPosts`, `pickCoreContent`, `formatDate` tam, gdzie dziś bierzemy je z `pliny`,
3. dodać `content repository`, które początkowo może jeszcze czytać istniejące dane.

Rezultat:

1. route handlers i layouty przestają znać Contentlayer jako API.

### Faza 1: Własny odczyt i kompilacja MDX

Cel: usunąć generowanie `.contentlayer` z krytycznej ścieżki builda.

Zakres:

1. czytanie plików z `data/` przez filesystem,
2. parsing frontmatter,
3. kompilacja MDX do `bodyCode`,
4. budowa `toc`, `readingTime`, `structuredData`,
5. odwzorowanie remark i rehype pluginów z obecnej konfiguracji.

Rezultat:

1. wszystkie strony czytają content z naszej warstwy.

### Faza 2: Assety i SEO

Cel: przebudować skrypty zależne od `.contentlayer`.

Zakres:

1. przepisać `generate-content-assets.mjs`,
2. przepisać `rss.mjs`,
3. przepisać `app/sitemap.ts`,
4. generować `tag-data.json` i `search.json` z naszych projection queries.

Rezultat:

1. pipeline wydawniczy jest w pełni nasz.

### Faza 3: Usunięcie zależności historycznych

Cel: usunąć niewspierany tooling.

Zakres:

1. usunąć `contentlayer.config.ts`,
2. usunąć `contentlayer` i `next-contentlayer` z `package.json`,
3. uprościć skrypty `build`, `dev`, `analyze`,
4. ograniczyć zależność od `pliny` tylko do elementów UI, które świadomie zostają.

Rezultat:

1. build nie zależy od Contentlayer.

### Faza 4: Custom CMS

Cel: dodać warstwę operacyjną do zarządzania contentem.

Proponowany kierunek MVP:

1. Git-backed CMS,
2. formularze do wpisów, authorów i static pages,
3. draft, publish, unpublish,
4. preview,
5. walidacja frontmatter zgodnie z naszym schematem.

Powód:

1. zachowujemy przenośność,
2. nie zrywamy z workflow MDX,
3. możemy później dodać bazę jako alternatywne `storage`.

## 12. Ryzyka

1. Migracja MDX może chwilowo rozjechać rendering wpisów zawierających custom JSX.
2. Search i RSS mogą zmienić wynik, jeśli nowa normalizacja tagów lub excerptów będzie inna.
3. Część helperów z `pliny` trzeba będzie odtworzyć lokalnie, żeby nie wymieniać naraz zbyt wielu warstw.
4. Jeśli od razu połączymy migrację engine i panel admina, zakres stanie się zbyt szeroki.

## 13. Alternatywy rozważane

### A. Zostać przy Contentlayer i tylko łatać kompatybilność

Odrzucone, bo nie rozwiązuje problemu własności modelu danych i dalej blokuje rozwój stosu.

### B. Przejść od razu na zewnętrzny SaaS CMS

Odrzucone w pierwszej iteracji, bo wprowadza zbyt wiele zmian naraz: storage, authoring, preview, deploy i integracje.

### C. Zastąpić Contentlayer innym generatorem plikowym 1:1

Odrzucone, bo nadal zostajemy zakładnikiem zewnętrznej warstwy domenowej, tylko pod inną nazwą.

## 14. Kryteria akceptacji

RFC jest zrealizowane, gdy:

1. `pnpm build` działa bez `contentlayer build`,
2. żaden plik w `app/`, `layouts/` i `scripts/` nie importuje `contentlayer/generated`,
3. wpisy blogowe renderują się poprawnie z MDX i custom komponentami,
4. `search.json`, `tag-data.json`, RSS i sitemap są budowane z naszej warstwy,
5. da się dodać nowy wpis MDX bez użycia Contentlayer,
6. domenowy model contentu jest zdefiniowany i testowalny wewnątrz repo.

## 15. Otwarte pytania

1. Czy chcemy zachować `pliny/mdx-components` w fazie przejściowej, czy od razu przejąć także renderer MDX?
2. Czy search pozostaje przy obecnym modelu, czy od razu przechodzi na lokalny full-text index?
3. Czy custom CMS ma od początku zarządzać assets, czy tylko treścią i frontmatter?
4. Czy `data/cms` ma pozostać osobną kolekcją, czy zostać uogólnione do `pages`?

## 16. Rekomendacja wykonawcza

Pierwszy wdrażany krok po akceptacji RFC:

1. dodać własne typy `PostDocument`, `AuthorDocument`, `StaticPageDocument`,
2. wprowadzić `content repository` jako warstwę pośrednią,
3. przepiąć na nią najpierw `app/blog/[...slug]/page.tsx` i `app/blog/page.tsx`,
4. dopiero potem budować własny pipeline MDX.

To jest najbezpieczniejsza kolejność, bo najpierw rozcina zależność domenową, a dopiero potem wymienia silnik kompilacji.