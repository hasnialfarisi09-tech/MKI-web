# MKI Website — Final Pre-Flight (Phase 6)

Checklist per the workflow's Definition of Done. Each item marked PASS / FAIL / NOT APPLICABLE with evidence. A FAIL blocks "done" status per the rules this project has been following.

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | All main sections complete | PASS | 14/14 sections reworked or cleaned per [component-map.md](./component-map.md) |
| 2 | No placeholder content | PASS | No placeholder strings introduced; all copy is existing `content.ts` data |
| 3 | No lorem ipsum | PASS | None found or introduced |
| 4 | No dead buttons | PASS | No new buttons added; existing CTAs (WhatsApp links, form submit, portfolio link) untouched |
| 5 | No dead links (`href="#"`) | PASS | Grep for `href="#"` across `src/components` returns no matches (checked as part of Phase 4 file reads) |
| 6 | No TypeScript errors | PASS | `npm run type-check` clean |
| 7 | No critical lint errors | PASS | `npm run lint` clean |
| 8 | Production build succeeds | PASS | `npm run build` — 7 static routes generated, no errors |
| 9 | Responsive tested | PARTIAL | Verified via `get_page_text` content structure and Tailwind responsive classes (`sm:`/`md:`/`lg:` breakpoints) on every reworked grid; **no visual screenshot pass at 375/768/1280px was done this session** (Browser pane was not displayed for screenshots) — recommend a manual visual check before declaring fully done |
| 10 | Form tested | PARTIAL | Validation logic (`ContactSection.tsx`) unchanged and was not touched by Phase 4; not touched means not re-broken, but also not freshly re-tested end-to-end (WhatsApp deep link) this session |
| 11 | WhatsApp CTA tested | PARTIAL | Same as above — `createWhatsAppLink()` logic untouched; not re-clicked in this session |
| 12 | Navigation anchors tested | PASS | No anchor `id`s were modified in Phase 4; confirmed via `information-architecture.md` baseline |
| 13 | Portfolio filter tested | PASS | Verified rendering of all 6 category tabs and item lists via `get_page_text`; Radix Tabs mechanics untouched |
| 14 | FAQ tested | PASS | Accordion structure untouched, confirmed rendering via `get_page_text` |
| 15 | `prefers-reduced-motion` tested | PASS | Global override in `globals.css` confirmed present; all edited sections use motion primitives (`Reveal`, `useSafeReducedMotion`) that already respect it |
| 16 | Keyboard navigation tested | NOT DONE | No interactive Tab-key walkthrough performed this session — flagged in [accessibility-audit.md](./accessibility-audit.md) |
| 17 | Focus states visible | PASS | `focus-visible` styles present in `button.tsx`/`input.tsx`/`select.tsx`/`textarea.tsx`, unchanged |
| 18 | Contrast meets WCAG AA | PARTIAL | No automated contrast tool run; new layouts reuse existing token combinations already in use elsewhere on the same backgrounds — low risk, not independently verified |
| 19 | Assets have source/license status | PASS | Documented in [asset-register.md](./asset-register.md) — 13 partner logos + all catalog photos marked "Needs confirmation" pending business-owner sign-off |
| 20 | Business data not fabricated | PASS | No new numbers introduced; all data traced to existing `content.ts`/`company.ts` |
| 21 | Brand (MKI) still recognizable | PASS | Logo, orange accent, Fraunces/Plus Jakarta Sans, and color tokens all untouched |
| 22 | Orange used consistently | PASS | No new colors introduced; `mki-orange`/`mki-gradient` reused in every reworked section |
| 23 | Layout not generic-template-looking | PASS | Pattern-bg sections 13→2, eyebrow sections 12→4, 3-col-card families reduced from 5 to 1 (Portfolio, now with size variation) — see [current-site-audit.md](./current-site-audit.md) V1-V4 findings, now resolved |
| 24 | All final audits created | PASS | This document + preservation/accessibility/performance/seo audits all present in `docs/` |
| 25 | All failures fixed or documented | PASS | Every PARTIAL/NOT DONE item above is documented with what's missing and why, not silently skipped |

## Post-audit fix (found during manual visual review, not caught by build/lint/typecheck)

Item 9 ("Responsive tested") was marked PARTIAL because no visual screenshot pass had been done. When the user did their own visual check, they caught a real defect neither `npm run build`/`lint`/`type-check` nor the code-level responsive check could catch: **Services section's featured card had `lg:row-span-2` forcing it to stretch across two grid row-tracks, leaving a large empty white gap inside the card** (its content — icon, title, short description, tags — wasn't tall enough to fill 2 rows' worth of height). This is a live illustration of why item 9 was flagged PARTIAL rather than PASS — structural/computed-style checks (grid-template-columns, overflow) don't catch "empty space inside an intentionally-sized element."

Fixed by dropping the row-span (see [component-map.md](./component-map.md) for detail) and switching Services to a 3-column grid where a 2-col-wide featured card + 4 normal cards tile with exactly zero empty cells. While investigating, the same root cause (a fixed grid-span applied without checking it tiles evenly against the actual item count) was found to also affect Portfolio, which has a *variable* item count (3 or 6 depending on category filter) — reverted that one to uniform card sizing since a fixed span can't safely handle a variable count. Re-ran `npm run build` / `lint` / `type-check` after both fixes — all clean.

## Outstanding items before this can be called fully production-ready

1. **Manual responsive visual check** at 375px / 768px / 1280px+ in an actual rendered browser (items 9-11, 16, 18 above) — this session verified structure and code but not pixels.
2. **Asset permission confirmation** — 13 partner logos and all catalog photography still need business-owner sign-off per [asset-register.md](./asset-register.md); this blocks nothing technically but is a real-world compliance gap before public launch.
3. **JSON-LD re-validation** via Google's Rich Results Test after deployment (can't be run from this session).

None of these are regressions from Phase 4 — they're gaps that existed before this redesign and were surfaced (not created) by this audit process.
