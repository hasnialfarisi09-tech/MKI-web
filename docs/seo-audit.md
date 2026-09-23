# MKI Website — SEO Audit (Phase 6)

## Fixed this session

**Duplicate JSON-LD `@id` (found in Phase 1, fixed in Phase 4).** [layout.tsx](../src/app/layout.tsx)'s `@graph` array previously contained two `"@type": "WebSite"` entries sharing the identical `"@id": "${company.siteUrl}/#website"` — one near the top of the graph (with just `name`/`alternateName`/`url`), one near the bottom (with `description`, `inLanguage`, and the `SearchAction`). Merged into a single `WebSite` entry carrying all fields (`name`, `alternateName: ["MKI", "PT MKI"]`, `url`, `description`, `inLanguage`, `potentialAction`). This removes an ambiguous duplicate `@id` that could have caused Google's Rich Results parser to pick one entry over the other inconsistently.

Verified: `npm run build` still compiles the page cleanly with the merged graph; no other `@id` in the graph is duplicated (`#organization` appears once).

## Confirmed healthy (unchanged by this redesign)

| Area | Finding |
|---|---|
| Title/description | `seoTitle` and `seoDescription` in `layout.tsx` are keyword-first, under the recommended length, include proof points (23 workshop, 4.048+ project) and a CTA. Not touched. |
| Canonical + hreflang | `alternates.canonical` and `id-ID` hreflang set from `company.siteUrl`. Not touched. |
| Open Graph / Twitter | Both reference the hero image with explicit width/height and alt text. Not touched. |
| Robots | `src/app/robots.ts` and `src/app/sitemap.ts` exist and generate at build time (confirmed present via `Route (app)` build output: `/robots.txt`, `/sitemap.xml`). Not touched. |
| FAQPage schema | `FaqSection.tsx` still emits its own `FAQPage` JSON-LD inline in the section (separate from the `layout.tsx` graph) — untouched by the pattern-bg removal in that file. |
| Heading hierarchy | Single `<h1>` (Hero), one `<h2>` per section via `SectionHeader`, `<h3>` for card-level titles — correct nesting for crawlers, confirmed in the accessibility audit. |
| Organization schema | `LocalBusiness`/`HomeAndConstructionBusiness` entry with address, geo coordinates, service catalog, and two `ContactPoint`s — untouched, still valid. |

## Not verified in this pass (flagged as a gap)

- **No live Rich Results Test or Search Console validation was run** against the merged JSON-LD — recommend pasting the final `@graph` into Google's Rich Results Test tool before/after deployment to confirm the fix parses as intended (this session can't make outbound calls to Google's validator).
- **No crawl/broken-link check was run** across all 14 sections' internal links (nav anchors, footer links, portfolio "Lihat Semua Portfolio" → `/portfolio`). Anchors were not renamed in Phase 4, so risk is low, but an automated link-checker pass is recommended before launch per the original workflow's Phase 5 validation step.
