# MKI Website — Preservation Audit (Phase 6)

Verifies that the Phase 4 implementation did not silently change anything on the preservation list from [current-site-audit.md](./current-site-audit.md) and [information-architecture.md](./information-architecture.md).

| Item | Before | After | Status |
|---|---|---|---|
| Nav labels (`src/constants/navigation.ts`) | Home, Tentang Kami, Layanan, Portfolio, Kemitraan, Keunggulan, FAQ, Kontak | Unchanged — file not touched | PASS |
| Anchor hrefs (`/#home`, `/#about`, etc.) | 8 anchors | Unchanged — no `id="..."` attributes were touched on any section | PASS |
| Route paths (`/`, `/portfolio`) | 2 routes | Unchanged | PASS |
| Phone numbers, email, address (`src/constants/company.ts`) | 3 phone numbers, 2 emails, 2 addresses | File not touched | PASS |
| Form field names (`src/constants/content.ts` → `contactSection.form`) | name, phone, category, location, message | Not touched — `ContactSection.tsx` only had its decorative `bg-pattern-dots-dark` div removed | PASS |
| Logo MKI | `mki-logo.png` in Navbar/Footer/JSON-LD | Not touched | PASS |
| Business statistics (4.048+, 23, 150+, 156, 2.690m, 28 kota, 3 provinsi) | Displayed across Hero, Stats, About, Production Capacity, Coverage | Same values, same source (`content.ts`) — only the *container markup* around them changed (metric wall, spec strip), not the data | PASS |
| Brand color tokens (`tailwind.config.ts`, `globals.css`) | `mki.orange` etc. | Not touched — Phase 2 explicitly decided against a token rewrite | PASS |
| Legal/consent copy | None present | N/A | N/A |

## What actually changed (for the record)

Only these categories of change were made, all confirmed non-breaking to the above:
1. `eyebrow` prop made optional on `SectionHeader.tsx` (additive, backward-compatible).
2. Decorative `bg-pattern-*` `<div>`s removed from 12 of 14 sections.
3. Grid/flex markup restructured in `StatsSection.tsx`, `ProductionCapacitySection.tsx`, `ServicesSection.tsx`, `GrowthPlanSection.tsx`, `WhyChooseUsSection.tsx`, `AboutSection.tsx` (column ratio only), `PortfolioSection.tsx` (card sizing only) — all presentational, no data or copy changes.
4. `layout.tsx` JSON-LD: merged two `WebSite` entries with a duplicate `@id` into one (see [seo-audit.md](./seo-audit.md)).

No file under `src/constants/`, `src/lib/`, or `src/app/page.tsx` was modified except the JSON-LD fix in `layout.tsx`, which only removed a duplicate schema entry and preserved every field value.

## Verification method

Diffed the intent against each edit made during Phase 4 (tracked via the 16-item task list) and re-confirmed via `get_page_text` in the browser preview that every business number, nav label, and CTA label still renders identically to the Phase 1 audit snapshot.
