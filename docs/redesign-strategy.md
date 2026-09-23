# MKI Website — Redesign Strategy (Phase 2)

Builds directly on the findings in [current-site-audit.md](./current-site-audit.md). This is a strategy document only — no code changes yet, per the audit-first workflow. Mode: **Redesign-Preserve** (brand identity is sound; the problem is structural repetition, not color/typography).

## Why not a brand-new color/typography system

The current implementation already satisfies most of the skill's brand-color rules: single orange accent, no purple/neon drift, consistent radius/shadow tokens, working dark mode. Phase 1 found **zero color or typography defects** — it found *layout* defects (dot patterns on 13/14 sections, eyebrows on 12/14, 5 sections sharing the same 3-column-card family, 9/14 headers centered). Replacing the palette or fonts now would be change for its own sake and would violate the preservation rule from `DESIGN.md`'s redesign protocol. **Strategy: keep the tokens, fix the repetition.**

## Design concept

**"Terukur, bukan template."** (Measured, not templated.) The site already earns "premium interior manufacturing" through photography, Fraunces display type, and orange-on-charcoal contrast. What it's missing is *visual rhythm* — right now every section reaches for the same three moves (dot background → centered eyebrow+headline → 3-card grid). The fix is compositional variety, not new decoration.

## Design dials (confirmed from Phase 1)

- `DESIGN_VARIANCE`: **7** — force distinct layout families per section (below).
- `MOTION_INTENSITY`: **5-6** — unchanged, Motion usage is already appropriate; don't add more.
- `VISUAL_DENSITY`: **3-4** — unchanged.

## Token strategy (no new tokens, tighter usage rules)

| Token area | Decision |
|---|---|
| Color | Keep `mki.*` + HSL semantic tokens exactly as-is. Document them as final in [brand-color-system.md](./brand-color-system.md) (already done); retire `DESIGN.md`'s old hex values as superseded. |
| Typography | Keep Fraunces (display) + Plus Jakarta Sans (body). No new font families. |
| Radius / Shadow | Keep `--radius: 1.4rem`, `shadow-soft`, `shadow-glow`. Do not introduce a second radius scale. |
| Motion | Keep Motion (`motion/react`) as the only animation library. No GSAP addition — current scroll-reveal and parallax patterns are sufficient once decoration noise is removed. |
| Decorative background patterns | **Ration to 2 zones only**: Hero (already has grid+aurora, keep) and Production Capacity/Infrastructure section (reframe as the site's one deliberate "manufacturing blueprint" identity moment). Remove `bg-pattern-*` from the other 12 sections. |
| Section eyebrow | Make `eyebrow` optional on `SectionHeader`. Cap usage at **4 sections total** (see table below) instead of 12, per the skill's "max 1 per 3 sections" rule. |

## Section-by-section layout family plan

14 sections, current page order preserved (URL anchors and nav labels are unchanged per the preservation list). Each row states the **current** family (per Phase 1 grep) and the **target** family, so no two adjacent sections share a family and no family besides Portfolio's gallery repeats a plain 3-equal-card grid.

| # | Section | Current family | Target family | Eyebrow? | Pattern bg? |
|---|---|---|---|---|---|
| 1 | Hero | Asymmetric split + glass | Asymmetric split (keep, already cleaned) | Yes (badge) | Yes (kept zone) |
| 2 | Stats | 3-col stat cards | **Metric wall** — full-width horizontal strip, numbers separated by hairline dividers, no card boxes | No | No |
| 3 | About | 2-col split, left-aligned | Split narrative (keep), tighten to true asymmetric ratio (not 50/50) | No | No |
| 4 | Production Capacity | 4-metric grid + dot bg | **Specification strip** — production-spec styling (value + unit + context line per metric), reframed as the brand's technical-identity moment | No | Yes (kept zone) |
| 5 | Services | 3-col cards, centered header | **Asymmetric bento** — 1 larger featured service + 4 smaller tiles, left-aligned header | No | No |
| 6 | Portfolio | 3-col gallery + tabs | Gallery (keep, legitimate use), vary card sizing to light masonry instead of uniform grid | Yes | No |
| 7 | Partnership | Dark tabs, 3-col, centered | Editorial tabbed section (keep dark bg + tabs, distinct enough), remove dot bg | No | No |
| 8 | Growth Plan | Grid-sm dot bg, pillar cards | **Roadmap list** — numbered vertical list, not cards | No | No |
| 9 | Why Choose Us | 3-col cards, cross-pattern bg | **Horizontal capability strip** — 6 items as a 2-row inline list with icon+label, no card boxes | No | No |
| 10 | Process | Timeline + grid bg | Process timeline (keep, already distinct), remove pattern bg | Yes (gap of 4 from Portfolio) | No |
| 11 | Coverage | Map/image + dot bg | **Large photography with overlaid data** (keep image+stat pairing), remove pattern bg | No | No |
| 12 | Social Proof | Marquee + dot bg | Logo marquee (keep, only marquee on the page), remove pattern bg | No | No |
| 13 | FAQ | Accordion, left-aligned, grid bg | Accordion (keep), remove pattern bg | No | No |
| 14 | Contact | Split form/info, dot bg, centered-ish | Split contact (keep), remove pattern bg | Yes | No |

Result: 14 distinct compositions across 14 sections (well above the skill's minimum of 6 layout families), eyebrows down from 12 to **4** (Hero, Portfolio, Process, Contact — each with a gap of 4+ sections from the next, satisfying "max 1 per 3 sections" with margin instead of exactly meeting it), decorative pattern zones down from 13 to 2 (Hero, Production Capacity).

## Conversion flow (unchanged, already sound)

Hero (value prop + CTA) → Stats (quick trust numbers) → About (credibility story) → Production Capacity (proof of real manufacturing) → Services (what we do) → Portfolio (proof of work) → Partnership (B2B path) → Growth Plan → Why Choose Us → Process (reduce uncertainty) → Coverage (reach) → Social Proof → FAQ (remove objections) → Contact (convert). No reordering needed — Phase 1 found no UX defect in this sequence.

## Mobile strategy

Each target family gets an explicit collapse rule (detailed per-component in Phase 4, not here):
- Metric wall → 2-col grid on mobile (not 1-col, numbers need to stay scannable).
- Specification strip → stacked cards, one per row.
- Asymmetric bento → single column, featured item first.
- Roadmap list → already vertical-friendly, no change needed.
- Capability strip → 2-col grid on mobile instead of horizontal strip.
- All `min-h-[100dvh]` / viewport rules already used in Hero — carry forward, don't reintroduce `h-screen`.

## Component-level changes required (see [component-map.md](./component-map.md) for the full table)

1. `SectionHeader.tsx` — make `eyebrow` prop optional.
2. Remove `bg-pattern-*` overlay `<div>` from 12 section files (keep only in `HeroSection.tsx` and `ProductionCapacitySection.tsx`).
3. New shared layout pattern (not a new library, just a Tailwind/Motion composition) for "Metric wall" and "Roadmap list" — no new dependency needed.
4. `StatsSection.tsx`, `WhyChooseUsSection.tsx`, `GrowthPlanSection.tsx`, `ServicesSection.tsx` need their grid markup restructured to their target family — these are the four sections currently most identical to each other.

## Risks

- Restructuring 12 of 14 sections is a large diff. Recommend implementing and build-checking one section at a time (see [implementation-plan.md](./implementation-plan.md)), not one giant commit.
- Removing `eyebrow` from 8 sections changes vertical rhythm slightly (less top padding needed) — each affected section's spacing should be re-checked, not just have the badge deleted in place.
