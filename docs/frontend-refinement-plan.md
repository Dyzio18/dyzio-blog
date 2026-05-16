# Dyzio.me — Frontend Refinement Plan

> Status: draft v1 · Author: claude review · Date: 2026-05-15
> Scope: visual/UX/UI refinement of the public-facing blog (Next.js 16 / Tailwind 3 / Space Grotesk / dark+light)
> Method: code review + dev-server browser pass (homepage captured; other routes reviewed from source after browser-permission denials)

## TL;DR

The blog is structurally sound (clean Next 16 App Router, Tailwind, Space Grotesk, dark mode, MDX). It feels like a **Tailwind Starter Blog with personal content layered on top** — generic editorial baseline, no real personality, several copy-language inconsistencies (PL vs EN), and a few visible bugs (commented-out travel map, double-numbered bucketlist, washed-out hero).

The opportunity: lean into Patryk's actual brand — **a Polish-language travel+dev journal** — with editorial typography, a more confident hero, image-first post cards on listing pages, an active travel map, and consistent Polish copy.

---

## 1. What I actually saw

**Captured (browser):** homepage `/` at 1440×900, dark theme.

Visual findings on the homepage screenshot:

- The "Siema!" hero uses `.bg-dot` with `opacity: 0.8` on the whole block, which dims the headline and body copy and produces a slightly muddy, "demo-template" feel rather than a confident first impression.
- The hero headline `Siema!` is an `<h2>` — no semantic `<h1>` on the homepage (bad for SEO and a11y).
- The four hero CTAs ("Blog →", "Platforma eqchange →", "Lista celów →", "Kontakt →") are plain inline links, not visually-weighted buttons; they read as a footer rather than a call to action.
- Tags below each post are uniformly bright pink, ALL CAPS, with no background/chip — they out-shout the post titles and break the visual hierarchy.
- Post list cards have **no images**, no reading time, no excerpt-image distinction — six rows of nearly-identical text blocks.
- Header nav links are lowercase brand-style ("blog · travel map · tags · eqchange · contact"), but there is **no active-page indicator** and the labels mix Polish ("eqchange") with English ("travel map", "tags", "contact").
- Footer is fine but minimal: stub `facebook.com`/`youtube.com` social icons that are commented out in code; mastodon points to `@mastodonuser` placeholder in `siteMetadata.js`.

**Reviewed via code (browser blocked navigation to other routes):**

- `app/blog/`, `app/tags/page.tsx`, `layouts/ListLayoutWithTags.tsx`, `layouts/PostLayout.tsx`, `layouts/AuthorLayout.tsx`, `app/bucketlist/page.tsx`, `app/projects/page.tsx`, `app/travel-map/page.tsx`, `app/eqchange/page.tsx`, `app/about/page.tsx`, `components/*`, `data/siteMetadata.js`, `data/headerNavLinks.ts`, `tailwind.config.js`, `css/tailwind.css`.

---

## 2. Bugs / regressions that block "ship quality"

These are not opinions — they are visible defects that should land first.

- [ ] **Travel map is invisible.** `app/travel-map/page.tsx:94` `<TravelMapClient />` is commented out. The page shows only the trip cards beneath an empty heading. Either re-enable the Leaflet client or remove the empty "All Destinations" section.
- [ ] **Bucket list shows numbers twice.** `app/bucketlist/page.tsx:74-80` wraps items in `<ol className="list-decimal">` AND prepends `{index + 1}.` inside each `<li>` → output looks like `1. 1. Kathmandu`. Pick one.
- [ ] **`bucketlist` page metadata says "Projects".** `app/bucketlist/page.tsx:5` `genPageMetadata({ title: 'Projects' })` is copy-pasted from `projects/page.tsx`. Title in browser tab is wrong.
- [ ] **Hero headline is `<h2>`, no `<h1>` on `/`.** `app/Main.tsx:91`. Add a single semantic `<h1>` for the page.
- [ ] **About page heading is hard-coded English** ("About Me / Contact") despite `locale: pl-PL` and Polish content. `layouts/AuthorLayout.tsx:20`.
- [ ] **Pagination labels are English** ("Previous", "Next", "X of Y") on a Polish site. `layouts/ListLayoutWithTags.tsx:33,43,53`.
- [ ] **"View on GitHub" / "← Back" / "Read more →" / "All Posts" / "Tags" / "Previous Article" / "Next Article"** are hard-coded English strings across `layouts/PostLayout.tsx`, `layouts/ListLayoutWithTags.tsx`, `app/Main.tsx`, `app/tags/page.tsx`. On a Polish blog these should be Polish (or wired through a tiny i18n dict).
- [ ] **Stub social links.** `data/siteMetadata.js`: `facebook: 'https://facebook.com'`, `youtube: 'https://youtube.com'`, `mastodon: 'https://mastodon.social/@mastodonuser'`. Delete or replace.
- [ ] **`headerNavLinks` declares `{ href: '/', title: 'Home' }`** but the Header filters it out (`Header.tsx:26`). Dead entry — remove.
- [ ] **`ThemeSwitch` uses `useSyncExternalStore` with no-op subscribe.** `components/ThemeSwitch.tsx:7-11`. Works but is unusual; the standard `useEffect + useState(mounted)` pattern is clearer and less error-prone on Next 16 / React 19 streaming.
- [ ] **`Card.tsx` className typo: `"md max-w-[544px]"`.** `components/Card.tsx:5` — the leading `md` is a leftover from `md:w-1/2` and renders as a CSS class that doesn't exist.
- [ ] **`Header` filters out `/` from nav but title casing is inconsistent.** "blog" / "travel map" / "tags" / "eqchange" / "contact" — choose one casing system.
- [ ] **No active-link state in `Header.tsx`.** Users have no indication of where they are.

---

## 3. UX / Information architecture

- [ ] **Make the homepage an actual landing page, not a post list.** Today `/` = hero + first 5 posts + newsletter. Better: hero → "Latest travel reportage" feature card (with image) → "Latest dev post" feature card → "All posts" link → newsletter. This mirrors what the about page promises ("travel reportages and posts about programming and AI").
- [ ] **Split content by stream.** The blog has two distinct voices: **travel** (long-form, photo-heavy) and **dev/AI** (technical, code-heavy). Today they're mixed in one list. Add a filter chip row above the post list (Wszystkie · Podróże · Dev · Życie) or split into two index pages.
- [ ] **Travel map should be the killer feature.** Re-enable `TravelMapClient`, make it the hero of `/travel-map`, and link individual pins to their reportage post. Today the cards exist but the map is commented out.
- [ ] **Active page indicator in navigation.** Add `usePathname` to `Header.tsx` and underline or pink-dot the current section.
- [ ] **Tag filter chip on `/blog`** is hidden on mobile (`hidden sm:flex` in `ListLayoutWithTags.tsx:85`). On mobile users have no way to filter by tag from the list view — add a horizontal scrollable chip row at the top.
- [ ] **No reading time on post cards.** The `reading-time` package is already a dependency (`package.json:34`). Surface it next to the date.
- [ ] **No "next/prev post" on the homepage post cards** — fine — but on individual posts the prev/next are only shown if both `prev` and `next` exist. Show whichever is available.
- [ ] **Search button shows ⌘K on mobile** — there's no ⌘ key on mobile. Show only on `sm:` and up.
- [ ] **No skip-to-content link** for keyboard users. Add one at the top of `app/layout.tsx`.
- [ ] **Newsletter copy is good but always visible at bottom of `/`.** Consider hiding after a successful submit and persisting via localStorage so returning readers aren't re-prompted.
- [ ] **About page is in English** while the rest of the site is Polish. Translate or label both languages.
- [ ] **No 404 personality.** `app/not-found.tsx` exists — give it a "Zgubiłeś się?" travel-themed treatment.

---

## 4. Visual / aesthetic refinement

The current aesthetic is **Tailwind-blog-template-dark**. To feel like Patryk's blog instead of a template, pick one direction below and execute it.

### Chosen direction — dual aesthetic (A + B)

Your content has two distinct voices and the design should follow:

- **Travel reportages** → **Option A: Editorial Travel Journal**
- **Dev / AI posts** → **Option B: Dev Notebook / Brutalist**
- **Shared shell** (header, footer, homepage, about, travel-map, bucketlist) → neutral baseline that doesn't fight either mode.

Posts switch aesthetic automatically based on the post's primary tag/category (e.g., `tags` contains `travel` OR `dev`). The homepage shows both feeds side-by-side, each in its own visual language.

**Shared baseline** (always-on)
- Two fonts loaded globally: a serif display (`--font-display-serif`) and a mono display (`--font-display-mono`). Body stays Space Grotesk.
- Two background tokens: warm paper (`#FAF7F2` light / `#0F0E0C` dark) for travel; pure paper (`#FFFFFF` light / `#000000` dark) for dev.
- A single CSS data-attribute `data-mode="travel" | "dev" | "default"` set on `<article>` or `<main>` decides which palette + display font cascade in.
- Both modes share Space Grotesk for UI chrome (header, footer, tags, buttons) so the navigation never shifts.

**Travel mode (A)** — applied to `/blog/[slug]` where tags include `travel`, and on `/travel-map`
- Display font: Fraunces (or Newsreader as alt)
- Background: `#FAF7F2` light / `#0F0E0C` dark
- Accent: terracotta `#C2410C` (replace pink primary in this mode)
- Generous whitespace, asymmetric date placement, large photo-driven cards
- Optional: subtle film-grain noise overlay on hero / cover images
- Drop-cap on first paragraph

**Dev mode (B)** — applied to `/blog/[slug]` where tags include `dev`, `ai`, `js`, `ts`, `react`, `nextjs`, and on `/dev` once it exists
- Display font: JetBrains Mono (or IBM Plex Mono as alt)
- Background: pure `#FFFFFF` light / pure `#000000` dark
- Accent: electric green `#22C55E` light / `#A3E635` dark (replace pink primary in this mode)
- Hard 1px borders, no shadows, square corners (`rounded-none` overrides), tight gutters
- Code blocks visually elevated (large `text-base`, dark window-chrome frame, copy-to-clipboard button)
- ASCII-style dividers (`─`), monospace metadata (date, reading time)

**Homepage** — neutral shell, but the two latest-post slots inherit their respective mode. Travel-latest card uses serif title + terracotta tag; dev-latest card uses mono title + green tag. The contrast is the design statement.

**How mode is detected**
- Add a `mode` derived field at the content-layer query (`src/content/queries.ts`): inspect `tags`; if any matches the travel tag set return `'travel'`, if matches the dev tag set return `'dev'`, else `'default'`.
- Pass `mode` to `PostLayout` and `Main` and set `data-mode` on the outermost article wrapper.
- All theming is pure CSS via attribute selectors — no per-component branching.

### Concrete CSS / Tailwind changes (apply to whichever option)

- [ ] **Fix `.bg-dot` washout.** `css/tailwind.css:33-47`. Remove `opacity: 0.8` from the parent; instead control opacity on the pseudo-background only, OR drop the dot pattern in favor of a subtle gradient.
- [ ] **Add a display font.** In `app/layout.tsx`, load a second font (`next/font/google`) for headlines and expose as `--font-display`. Update `tailwind.config.js` `fontFamily.display`.
- [ ] **Soften or restyle Tag pills.** `components/Tag.tsx`: today they're bare uppercase pink text. Either keep uppercase but add `rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs`, or drop uppercase and use sentence case with subtle underline.
- [ ] **Introduce a real typographic scale.** Today `text-2xl`, `text-3xl`, `text-4xl`, `text-6xl` are sprinkled inconsistently. Define three sizes: `display` (hero), `title` (h1/h2), `body`. Use Tailwind plugin or CSS vars.
- [ ] **Replace `colors.pink` as `primary`.** `tailwind.config.js:28`. Pink-500 is a default Tailwind palette and is the #1 reason this site looks like a starter. Even keeping the pink direction, customize the actual hex.
- [ ] **Card hover states.** Post cards on `/` and `/blog` have no hover treatment. Add a left-border-on-hover or background-tint transition.
- [ ] **Image-led post cards.** Add a 16:9 thumbnail to each post card on `/` and `/blog`. Pull from frontmatter `images[0]` or a new `cover` field in MDX.
- [ ] **Featured/Hero post slot.** First post on `/blog` rendered larger, full-width image, larger title.
- [ ] **Drop-cap on long-form posts.** First letter of first paragraph styled with `::first-letter` in prose. Cheap, high-impact for the travel reportages.
- [ ] **Replace `prose` defaults' indigo code color.** `tailwind.config.js:49` — `code` is indigo, but primary is pink. Pick one.
- [ ] **Reading progress bar** on `/blog/[slug]` — single 2px primary-color fixed bar at top, width = scroll %.
- [ ] **Table of contents** for long posts — already there in `corePage` toc data, but `PostLayout.tsx` doesn't render it. Render in the left rail on `xl:` breakpoints.

---

## 5. Motion & micro-interactions

Restrained list — Tailwind only, no JS animation library needed.

- [ ] Hero copy: stagger-fade entrance via CSS `@keyframes` with `animation-delay` per child (50ms / 100ms / 150ms / 200ms).
- [ ] Post card on hover: `transform: translateY(-2px)` + accent left-border slide-in (200ms ease).
- [ ] Theme toggle: 200ms ease for sun↔moon icon rotation/scale.
- [ ] Tag chips: scale-95 → 100 on click for tactile feedback.
- [ ] Mobile nav: today it's a flat overlay with `translate-x-full → translate-x-0`. Add staggered link fade-in (0ms, 60ms, 120ms…) for a more premium feel.
- [ ] Scroll-to-top button: fade in instead of hard appear once `scrollY > 50`.
- [ ] No parallax. No "magic" scroll-driven choreography. Keep it editorial.

---

## 6. Performance / quality

- [ ] **Verify Cumulative Layout Shift.** Post cards have no image placeholder — once images are added, ensure aspect-ratio reservation.
- [ ] **`<Image>` on hero / avatars** uses Next Image — good. Make sure all MDX images go through the existing `MdxImage` component (`components/MDXComponents.tsx`).
- [ ] **Font display: 'swap'** is already on Space Grotesk — good. Apply same to any new display font.
- [ ] **`lang="pl-PL"`** correctly set via `siteMetadata.language` — good.
- [ ] **OG image per post.** Today `socialBanner` is a single site-wide image. Add a Next.js `opengraph-image.tsx` at `app/blog/[...slug]/` that generates per-post OG with title + tag.
- [ ] **`scroll-smooth`** on `<html>` is fine but breaks reduced-motion users. Wrap in `@media (prefers-reduced-motion: no-preference)`.
- [ ] **`engines.node: "24.x"`** in `package.json` but current dev box runs Node 22.10 (pnpm warning at startup). Decide on the actual minimum and align.
- [ ] **Uncommitted artifacts in `data/authors/default.mdx`, `next-env.d.ts`, `tsconfig.tsbuildinfo`.** Either commit or `.gitignore` the build outputs.

---

## 7. Accessibility

- [ ] Add `<h1>` on the homepage (see bug list).
- [ ] Skip-to-content link in `app/layout.tsx`.
- [ ] Tag pills: bright pink on dark-grey backgrounds → check WCAG contrast (`text-primary-500` = `#EC4899` on `bg-gray-950` → currently borderline ~3.2:1 for normal text, **fails AA**). Either bump to `primary-400` in dark mode or add a background chip.
- [ ] `MobileNav.tsx` toggles `document.body.style.overflow` — also lock `<html>` scrollbar to prevent layout jump and trap focus inside the open menu.
- [ ] `ScrollTopAndComment.tsx` listens to scroll without `passive: true` and without throttle. Fine for now but worth a `requestAnimationFrame` debounce.
- [ ] Travel-map trip cards: emoji 📍 next to destination name → wrap in `<span aria-hidden="true">` so screen readers don't announce "pin".
- [ ] Verify all interactive elements have visible `:focus-visible` styles. Tailwind default ring on dark bg is faint.

---

## 8. Content / copy

- [ ] **Pick one language and stick.** `locale: pl-PL` and `language: pl-PL` say Polish; about page MDX is English. Either translate the about page or add an EN/PL toggle.
- [ ] **Hero copy is decent** but reads as "blog osobisty" boilerplate. Tighten to one sentence: who you are + what you write about + why someone should stay.
- [ ] **About avatar size 192×192 (rendered 48×48 via `w-48 h-48`)** — `layouts/AuthorLayout.tsx:31`. Width attribute matches but display is large; ensure the source PNG is high-res enough.
- [ ] **`Card.tsx` `description`** is wrapped in `prose` class — fine for paragraphs but adds default link/heading styles inside a card. Use a slimmer text style.

---

## 9. Plan for AI agents (descriptive)

These are agent-sized tasks designed for `claude` subagents or the user spawning them directly. Each is bounded, has clear acceptance criteria, and is sequenced.

### Phase 0 — Hygiene (one agent, ~30 min)
**Agent prompt seed:**
> Fix listed defects in `docs/frontend-refinement-plan.md` section "Bugs / regressions". Specifically:
> 1. Re-enable `TravelMapClient` in `app/travel-map/page.tsx:94` (and verify Leaflet SSR is correctly dynamic-imported).
> 2. Fix double-numbering in `app/bucketlist/page.tsx` — keep `<ol>` numbers, remove `{index+1}.` from text.
> 3. Fix copy-paste metadata in `app/bucketlist/page.tsx:5` → title `'Bucket list'`.
> 4. Promote homepage `<h2>Siema!</h2>` to `<h1>` in `app/Main.tsx:91`.
> 5. Remove the `Card.tsx` stray `"md"` className.
> 6. Remove the dead `{ href: '/', title: 'Home' }` entry from `data/headerNavLinks.ts`.
> 7. Remove stub social URLs (`facebook`, `youtube`, `mastodon`) from `data/siteMetadata.js` and remove their icons from `Footer.tsx`.
> Run `pnpm lint` and Next build. Open one PR titled `chore: fix copy/markup defects`.

**Acceptance:** all items checked off, build passes, screenshots of `/`, `/bucketlist`, `/travel-map` show fixed state.

### Phase 1 — i18n sweep (one agent, ~45 min)
**Agent prompt seed:**
> The site is Polish (`locale: pl-PL`) but English strings are scattered through layouts and pages. Create a tiny dictionary at `data/i18n.ts` exporting an object with keys for: `readMore`, `allPosts`, `tags`, `previous`, `next`, `previousArticle`, `nextArticle`, `back`, `viewOnGithub`, `aboutTitle`, `pageOf` (template `'{n} z {total}'`). Replace hard-coded strings in `app/Main.tsx`, `layouts/ListLayoutWithTags.tsx`, `layouts/PostLayout.tsx`, `layouts/AuthorLayout.tsx`, `app/tags/page.tsx` with the dictionary. Do NOT introduce `next-intl` or any i18n lib — keep it a simple TS object. Also translate the body of `data/authors/default.mdx` to Polish (preserve links).

**Acceptance:** every visible label on the public site is Polish, except brand terms (eqchange, blog, GitHub).

### Phase 2 — dual-mode foundation (typography + color + mode plumbing) (one agent, ~120 min)
**Agent prompt seed:**
> Implement the dual-aesthetic system (Editorial Travel Journal + Dev Notebook/Brutalist) described in `docs/frontend-refinement-plan.md` section 4.
>
> **Step 1 — fonts (`app/layout.tsx`):**
> - Load Fraunces from `next/font/google`, expose as `--font-display-serif` (subsets: latin, latin-ext for Polish chars; display: swap).
> - Load JetBrains Mono from `next/font/google`, expose as `--font-display-mono`.
> - Keep Space Grotesk as `--font-space-grotesk` for body/UI.
> - Add all three CSS variables to `<html className>`.
>
> **Step 2 — Tailwind theme (`tailwind.config.js`):**
> - `fontFamily.sans` → Space Grotesk (unchanged).
> - `fontFamily.serif` → `['var(--font-display-serif)', ...defaultTheme.fontFamily.serif]`.
> - `fontFamily.mono` → `['var(--font-display-mono)', ...defaultTheme.fontFamily.mono]`.
> - Replace `primary: colors.pink` with a CSS-var-driven palette: `primary: { 50: 'rgb(var(--primary-50) / <alpha-value>)', ..., 950: '...' }` so primary swaps via `data-mode`.
> - Add `paper: 'rgb(var(--paper) / <alpha-value>)'` and `ink: 'rgb(var(--ink) / <alpha-value>)'` for backgrounds.
>
> **Step 3 — CSS tokens (`css/tailwind.css`):**
> - In `:root` define default tokens (current pink + neutral backgrounds — the "shared shell" baseline).
> - In `[data-mode="travel"]` override: `--primary-*` to terracotta scale, `--paper: 250 247 242`, `--ink: 15 14 12`. Add `font-family: var(--font-display-serif)` for `h1, h2`.
> - In `[data-mode="dev"]` override: `--primary-*` to electric green scale, `--paper: 255 255 255`, `--ink: 0 0 0`. Add `font-family: var(--font-display-mono)` for `h1, h2`. Override `border-radius: 0` for `.rounded, .rounded-lg, .rounded-full` (use a `:where()` selector so it's low-specificity and dev-mode-scoped).
> - Mirror both inside `.dark [data-mode="..."]` for dark mode tokens.
> - Rewrite `.bg-dot` to a subtle gradient (drop the `opacity: 0.8` on the parent) — keep class name.
>
> **Step 4 — mode detection at content layer (`src/content/queries.ts` or equivalent):**
> - Define `const TRAVEL_TAGS = new Set(['travel','podroze','azja','amazonia','nepal','maroko','korea','indonezja','tajlandia','peru','kolumbia','brazylia','ameryka-poludniowa'])` and `const DEV_TAGS = new Set(['dev','ai','js','ts','react','nextjs','programming','frontend'])`.
> - Add a helper `getPostMode(tags: string[]): 'travel' | 'dev' | 'default'`.
> - Export `mode` on `CorePost`. Set it in the existing `corePost` mapper. Tags use `github-slugger` slugs — compare against slugged set.
>
> **Step 5 — apply mode in layouts:**
> - `layouts/PostLayout.tsx`: outermost `<article>` gets `data-mode={content.mode}`.
> - `app/Main.tsx`: wrap each post `<li>` in `data-mode={post.mode}` so latest cards inherit their voice on the homepage.
> - `app/travel-map/page.tsx`: outermost wrapper gets `data-mode="travel"`.
>
> **Step 6 — promote homepage `<h2>Siema!</h2>` to `<h1>` (also in Phase 0).**
>
> **Verification:** Start dev server. Visit `/`, `/blog/[a travel post]`, `/blog/[a dev post]`, `/travel-map`. Confirm:
> - Travel posts render Fraunces titles on warm paper with terracotta accents.
> - Dev posts render JetBrains Mono titles on pure white/black with green accents and zero border-radius.
> - Header, footer, nav remain in Space Grotesk and don't shift between routes.
> - Light + dark both work for both modes.
> Capture before/after screenshots at 1440×900 for the four routes above.

**Acceptance:** Both aesthetics visible and switch per-post automatically based on tags. Shell stays neutral. No regressions on existing pages.

### Phase 3 — post cards & listings (mode-aware) (one agent, ~120 min)
**Agent prompt seed:**
> Redesign post listings so each card visually matches its post's mode (travel or dev).
> 1. Add optional `cover` field to MDX frontmatter (already supported in some posts via `images[0]`). Document in `data/blog/*.mdx` examples.
> 2. Update `app/Main.tsx` and `layouts/ListLayoutWithTags.tsx` post card: set `data-mode={post.mode}` on the `<article>` wrapper. CSS variables defined in Phase 2 will then style accents, fonts, and corners automatically.
> 3. Travel cards (default styling under `[data-mode="travel"]`): 16:9 cover image left, serif title + warm tag chip + terracotta "Czytaj reportaż →" right. On mobile stacked. Soft `rounded-lg`, subtle shadow.
> 4. Dev cards (under `[data-mode="dev"]`): no image required; if cover exists, render small 4:3 thumbnail right-aligned. Mono title (smaller than travel — terminal-like), green tag chip, sharp 1px border, no shadow, square corners. Show date+reading time as `─ 5 min · 2026-05-10` in mono.
> 5. Surface reading time using the existing `reading-time` dep (confirm by reading `src/content/queries.ts`).
> 6. Tag pills (`components/Tag.tsx`): convert from bare uppercase pink to `rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium`. In dev mode the parent's `border-radius: 0` override flattens them to squares automatically.
> 7. Featured-post treatment: first post on `/blog` rendered as 2× height, full-width image (travel) or 2-column ASCII-framed callout (dev), larger title.
> 8. Hover: card lifts 2px in travel; accent left-border slides in 200ms in dev. CSS-only.
> 9. Add a horizontal filter chip row at the top of `/blog` mobile view (the sidebar is currently `hidden sm:flex`): "Wszystkie · Podróże · Dev · Życie".

**Acceptance:** `/` shows both card styles side-by-side; `/blog` switches card style per post; CLS < 0.1; tag pills pass WCAG AA in both modes (terracotta on warm paper, green on pure paper).

### Phase 4 — post page polish (mode-aware) (one agent, ~90 min)
**Agent prompt seed:**
> Improve individual post reading experience and split treatment by mode.
> 1. Reading progress bar: 2px fixed-top `bg-primary-500` bar, width = scroll %. Pure CSS via `scroll-timeline` where supported, else tiny JS effect.
> 2. Render the table of contents that already exists in `corePage.toc` — show as sticky left rail on `xl:` breakpoints in `layouts/PostLayout.tsx`. In dev mode style it as a monospace tree (`├─ Heading`, `└─ Heading`); in travel mode style it as a clean serif list.
> 3. **Travel mode only**: drop-cap on first paragraph: `[data-mode="travel"] .prose > p:first-of-type::first-letter { font-family: var(--font-display-serif); font-size: 4rem; float: left; line-height: 0.85; margin-right: 0.5rem; }`.
> 4. **Dev mode only**: render an ASCII rule above each `<h2>` (`pseudo ::before` content `─────`) and style code blocks with a window-chrome header (three dots + filename pulled from `data-language` of the fenced block).
> 5. Move author byline above the title (today it's a sidebar). Single-author site — sidebar is overkill.
> 6. Add "Powiązane wpisy" (related posts) by tag overlap, bottom of post. Pull from existing `getAllPosts()`; cards inherit the mode of each related post.
> 7. Per-post OG image generator at `app/blog/[...slug]/opengraph-image.tsx` using `next/og`. Travel mode: terracotta background + Fraunces title. Dev mode: black background + JetBrains Mono title + green accent line.

**Acceptance:** post pages feel "designed" rather than templated; OG previews show actual titles in social cards.

### Phase 5 — travel map as hero (one agent, ~90 min)
**Agent prompt seed:**
> Make `/travel-map` the centerpiece.
> 1. Verify `TravelMapClient` (`components/TravelMapClient.tsx`) renders correctly with Leaflet under Next 16 (dynamic import with `ssr: false`).
> 2. Move the trip cards into a horizontally-scrollable strip below the map.
> 3. Custom map tiles — switch from default OSM to a muted/sepia tile provider (e.g., Stadia Stamen Toner Lite or CartoDB Positron) to match aesthetic.
> 4. Clicking a marker opens a popup with: photo thumbnail, trip name, "Czytaj reportaż →" link.
> 5. Add a "Last trip" callout at the top: most recent trip name + date + read CTA.
> 6. Add a small stats bar: "X krajów · Y miast · Z reportaży".

**Acceptance:** the map is the visual anchor of the page; a visitor unfamiliar with the blog understands within 5 seconds that this is a travel journal.

### Phase 6 — accessibility & performance pass (one agent, ~45 min)
**Agent prompt seed:**
> Run an a11y + perf pass:
> 1. Add skip-to-content link in `app/layout.tsx`.
> 2. Add active-page indicator to `Header.tsx` via `usePathname`.
> 3. Wrap `scroll-smooth` in a `@media (prefers-reduced-motion: no-preference)` block (in `css/tailwind.css`).
> 4. Focus-visible: ensure rings show on dark backgrounds — add a global `:focus-visible { outline: 2px solid theme(colors.primary.400); outline-offset: 2px; }`.
> 5. Run Lighthouse locally on `/`, `/blog`, `/blog/[latest-post]`, `/travel-map`. Report scores in the PR description.

**Acceptance:** Lighthouse a11y ≥ 95 on all four pages; CLS < 0.1; LCP < 2.5s on local dev.

### Phase 7 — content density (continuous, user-driven)
- Translate `about` to Polish (or add bilingual toggle).
- Write a 404 page that fits the travel theme.
- Audit MDX posts for cover images; add where missing.

---

## 10. Suggested PR sequence

1. `chore: fix copy/markup defects` (Phase 0)
2. `feat: polish-language i18n dictionary` (Phase 1)
3. `feat: dual-mode design system (travel/dev)` (Phase 2)
4. `feat: mode-aware post cards & listings` (Phase 3)
5. `feat: post page polish (TOC, progress, related, OG) per mode` (Phase 4)
6. `feat: interactive travel map` (Phase 5)
7. `chore: accessibility & performance pass` (Phase 6)

Each phase is < 100 lines of net diff in most cases and can be reviewed independently. Phases 0–1 are pure cleanup; Phases 2+ are the actual design refresh.

---

## 11. Out of scope (for this plan)

- Backend/CMS changes — content layer (`src/content/`) is fine as-is.
- Newsletter provider swap.
- Analytics changes.
- Comment system (giscus) styling — leave alone.
- The `eqchange` page (it's an MDX product page; let the product own its design).

---

## Appendix — files touched per phase

| Phase | Files |
| --- | --- |
| 0 | `app/travel-map/page.tsx`, `app/bucketlist/page.tsx`, `app/Main.tsx`, `components/Card.tsx`, `data/headerNavLinks.ts`, `data/siteMetadata.js`, `components/Footer.tsx` |
| 1 | new `data/i18n.ts`, `app/Main.tsx`, `layouts/ListLayoutWithTags.tsx`, `layouts/PostLayout.tsx`, `layouts/AuthorLayout.tsx`, `app/tags/page.tsx`, `data/authors/default.mdx` |
| 2 | `app/layout.tsx`, `tailwind.config.js`, `css/tailwind.css`, `app/Main.tsx`, `components/PageTitle.tsx`, `layouts/PostLayout.tsx`, `app/travel-map/page.tsx`, `src/content/queries.ts` (add `mode` field + tag sets) |
| 3 | `app/Main.tsx`, `layouts/ListLayoutWithTags.tsx`, `components/Tag.tsx`, MDX frontmatter docs (dual-mode card variants via `data-mode`) |
| 4 | `layouts/PostLayout.tsx`, new `app/blog/[...slug]/opengraph-image.tsx`, `components/TOCInline.tsx`, mode-specific CSS in `css/tailwind.css` |
| 5 | `app/travel-map/page.tsx`, `components/TravelMapClient.tsx`, `components/MapLeaflet.tsx` |
| 6 | `app/layout.tsx`, `components/Header.tsx`, `css/tailwind.css` |
