# MKI Website — Implementation Plan (Phase 2 output, for Phase 4 execution)

Sequencing for the section-by-section rework defined in [redesign-strategy.md](./redesign-strategy.md) and [component-map.md](./component-map.md). Each step is a single component's worth of change, checked before moving to the next — not one large multi-file diff.

## Order of operations

1. **Foundation change first**: make `eyebrow` optional on [SectionHeader.tsx](../src/components/sections/SectionHeader.tsx). This is a non-breaking prop change — verify every current caller still compiles before touching any section body.
2. **Low-risk, high-visibility wins next** (pattern-background removal only, no structural change): Coverage, Faq, Contact, Partnership, Social Proof, Growth Plan, About — each is a one-line `<div>` removal per file. Build-check after this batch.
3. **Structural rework, one at a time**, in this order (simplest → most involved):
   - Stats → metric wall
   - Growth Plan → roadmap list
   - Why Choose Us → capability strip
   - Services → asymmetric bento
   - Production Capacity → specification strip (keep pattern zone)
   - Portfolio → masonry variation (keep tabs/filter logic untouched)
4. **Final pass**: re-check vertical spacing (`py-*`) on every section that lost its eyebrow, since removing the badge changes the effective top padding rhythm.

## Per-section checklist (repeat for each file in step 2 and 3)

- [ ] Visual: matches target family from `component-map.md`
- [ ] `SectionHeader` `align` and `eyebrow` match the plan table
- [ ] No `bg-pattern-*` left except in Hero and Production Capacity
- [ ] Mobile collapse explicit (checked in browser preview, not assumed)
- [ ] `prefers-reduced-motion` still respected (no new `useState`-driven scroll listeners introduced)
- [ ] `npm run build` passes (TypeScript + static export)
- [ ] No new lint errors (`npm run lint`)
- [ ] No console errors in browser preview
- [ ] No CTA/anchor/label changed (spot-check against `information-architecture.md`)

## Validation before declaring Phase 4 done

- `npm run build`
- `npm run lint`
- `npm run type-check`
- Manual responsive check at 375px, 768px, 1280px in the browser preview (per section touched)
- Re-run the visual audit checklist from `current-site-audit.md` (V1-V4) to confirm the counts actually dropped: pattern-bg sections 13→2, eyebrow sections 12→4, 3-col-card families 5→1 (Portfolio only, and even that is now masonry-varied)

## Post-implementation documentation (Phase 6, not done yet)

Per the original workflow, after implementation: `docs/preservation-audit.md`, `docs/accessibility-audit.md`, `docs/performance-audit.md`, `docs/seo-audit.md` (includes fixing the duplicate JSON-LD `@id` found in Phase 1), `docs/final-preflight.md`. Not created now — these require the implementation to exist first.

## Open item carried from Phase 1 (not blocking, but should be fixed alongside this work)

- Duplicate `"@type": "WebSite"` entries with identical `@id` in [layout.tsx](../src/app/layout.tsx)'s JSON-LD `@graph` — merge into one entry. Unrelated to the visual redesign but cheap to fix in the same pass.
