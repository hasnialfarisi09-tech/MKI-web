# MKI Website — Information Architecture (Phase 2)

No changes proposed to navigation, anchors, or page order — Phase 1 found no UX defect in the current structure. This document exists to make the "unchanged" baseline explicit before implementation touches component internals.

## Navigation (unchanged)

Source: [src/constants/navigation.ts](../src/constants/navigation.ts)

| Label | Anchor |
|---|---|
| Home | `/#home` |
| Tentang Kami | `/#about` |
| Layanan | `/#services` |
| Portfolio | `/#portfolio` |
| Kemitraan | `/#partnership` |
| Keunggulan | `/#why-us` |
| FAQ | `/#faq` |
| Kontak | `/#contact` |

Footer nav is a filtered subset (`about`, `services`, `portfolio`, `partnership`, `why-us`) — also unchanged.

## Page section order (unchanged)

Source: [src/app/page.tsx](../src/app/page.tsx)

1. Hero (`#home`)
2. Stats
3. About (`#about`)
4. Production Capacity
5. Services (`#services`)
6. Portfolio (`#portfolio`)
7. Partnership (`#partnership`)
8. Growth Plan
9. Why Choose Us (`#why-us`)
10. Process
11. Coverage
12. Social Proof
13. FAQ (`#faq`)
14. Contact (`#contact`)

Stats, Production Capacity, Growth Plan, Process, Coverage, and Social Proof have no direct nav anchor — they're supporting content between the anchored sections. This is intentional and stays as-is.

## Routes (unchanged)

- `/` — single-page site (all sections above)
- `/portfolio` — dedicated portfolio gallery page (found during Phase 1 exploration, referenced in git history as "portfolio gallery page" feature)
- `/robots.txt`, `/sitemap.xml` — generated, unaffected by visual redesign

## What Phase 4 must not change without separate approval

Per the preservation list in [current-site-audit.md](./current-site-audit.md): navigation labels, anchor hrefs, form field names, phone numbers, address, and route paths. The redesign strategy in [redesign-strategy.md](./redesign-strategy.md) only restructures section *internals* (layout family, decoration, header treatment) — it does not touch this IA.
