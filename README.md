# Vento Café — website

Bilingual (Ελληνικά / English) one-page site for **Vento Café**, Lamia — *In Coffee We Trust*, since 2011.
Built with Vite, React 19 and TypeScript, styled with plain CSS.

## Scripts

| Command          | What it does                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| `npm run dev`    | Local dev server with hot reload                                             |
| `npm run build`  | Type-check and build the production site into `dist/`                       |
| `npm run preview`| Serve the production build locally                                           |
| `npm test`       | Unit tests for the opening-hours logic (Node's built-in test runner)         |
| `npm run lint`   | Lint with oxlint                                                             |
| `npm run images` | Regenerate the optimised images, favicons and share image from the originals |

## Changing content

- **Hours, delivery, phones, address, map, Facebook:** `src/data/site.ts`. This is the single source of truth: the page,
  the live “open now” badge, the 24-hour dial, the structured data for Google and the no-JavaScript fallback all read from
  it. Times are minutes after midnight via `at(hours, minutes)`; `at(24)` means midnight, and values past 24 hours
  (e.g. `at(26)` = 02:00) are supported for late nights.
- **Text (both languages):** `src/i18n/translations.ts`. The Greek dictionary must match the English one key for key —
  TypeScript fails the build if either is missing something. Greek eyebrow labels are written in capitals without accents
  on purpose (Greek typography drops the τόνοι in all-caps text). A few sentences mention “midnight” in prose; update them
  too if the closing time changes.
- **Menu and prices:** `src/data/menu.ts`, transcribed from the printed menu in `src/assets/images/menu/`. Each item
  has a Greek and an English name (`tx('Άλφα', 'Alfa')`; one argument when both are the same) and a price in euros.
- **Photos:** originals live in `src/assets/images/set-foundation/`. Map a file to a name in `PHOTOS` inside
  `scripts/optimize-images.mjs`, run `npm run images`, then use it with `<Photo name="…" />`.
- **Logo:** `src/assets/images/logos/logo-white.png` (for dark backgrounds) and `logo-black.png` (for light backgrounds).
  Run `npm run images` after replacing them; the header’s compact logo and the favicons are cut from these.

## How it works

- **Live status:** open/closed and delivery status are computed in Lamia time (Europe/Athens, DST-aware) whatever the
  visitor’s time zone, and refresh every 15 seconds.
- **Language:** Greek by default; `?lang=en` opens the English version and the visitor’s choice is remembered. The
  `<html lang>`, page title and description switch with it.
- **SEO:** schema.org `CafeOrCoffeeShop` structured data and a plain-HTML fallback are generated from `site.ts` at build
  time (see `vite.config.ts`).
- **Images:** responsive WebP sizes with blur-up placeholders; fonts (Noto Serif Display, Manrope) are self-hosted and
  only the Latin and Greek subsets are downloaded.
- **Accessibility:** keyboard-friendly menu and gallery (native `<dialog>`), skip link, reduced-motion support.

## Before going live

- Replace `og:image` in `index.html` with the absolute URL of `/og-image.jpg` once the domain is known — Facebook and
  others ignore relative share-image URLs.
- The Google Business listing currently shows closing at 02:00; the site says 00:00. Update whichever one is wrong.
