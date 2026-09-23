# MKI Website — Component Map (Phase 2)

Maps every section component to its current structure, its target structure from [redesign-strategy.md](./redesign-strategy.md), and the concrete edit each file needs. No new dependencies required — all changes are Tailwind/JSX restructuring within the existing stack (Next.js, Tailwind v3, Motion, Radix, lucide-react).

## Shared components

| Component | Current behavior | Change needed |
|---|---|---|
| [SectionHeader.tsx](../src/components/sections/SectionHeader.tsx) | `eyebrow: string` is a **required** prop; always renders a `Badge` | Make `eyebrow?: string`; render the badge block only when provided. No other prop changes. |
| `.eyebrow` / `bg-pattern-*` utilities in [globals.css](../src/app/globals.css) | Used site-wide | Keep the CSS utilities (still needed for Hero + Production Capacity), just stop *applying* them elsewhere. No CSS deletion needed yet. |

## Section components

| File | Current family | Target family | Concrete change |
|---|---|---|---|
| [HeroSection.tsx](../src/components/sections/HeroSection.tsx) | Asymmetric split (already cleaned in a prior session) | Unchanged | No change in Phase 4 unless new issues found. |
| [StatsSection.tsx](../src/components/sections/StatsSection.tsx) | `grid-cols-3` stat cards + `bg-pattern-grid` | Metric wall (horizontal strip, hairline dividers, no card boxes) | Remove pattern `div`; replace card grid with a flex/grid row using `divide-x` between metrics instead of individual `.premium-card` boxes; drop `eyebrow` prop. |
| [AboutSection.tsx](../src/components/sections/AboutSection.tsx) | 2-col split, left-aligned, `bg-pattern-dots` | Split narrative, true asymmetric ratio | Remove pattern `div`; adjust grid columns from even split to asymmetric (e.g. `lg:grid-cols-[1.1fr_0.9fr]`). Keep `eyebrow` off (already not using one per current audit — confirm during implementation). |
| [ProductionCapacitySection.tsx](../src/components/sections/ProductionCapacitySection.tsx) | 4-metric grid + `bg-pattern-grid-sm` | Specification strip (kept pattern zone) | Keep pattern `div` (this is one of the 2 designated identity zones). Restyle metric tiles to show value + unit + one-line context per metric instead of bare number cards. Drop `eyebrow` (too close to Hero's under the spacing rule; the strip's own heading carries enough weight without it). |
| [ServicesSection.tsx](../src/components/sections/ServicesSection.tsx) | `grid-cols-3` cards, centered header, `bg-pattern-dots` | Asymmetric bento (1 featured + 4 smaller) | Remove pattern `div`; restructure grid to `sm:grid-cols-2 lg:grid-cols-3` with the first item spanning 2 columns (width only — an earlier version also added `row-span-2`, which stretched the featured card's `h-full` wrapper across two row-tracks and left a large dead-space gap inside the card since its content wasn't tall enough to fill it; caught visually and fixed by dropping the row-span and switching to a 3-col grid where 1 wide card + 4 normal cards tile with zero empty cells); switch `SectionHeader` to `align="left"`; drop `eyebrow`. |
| [PortfolioSection.tsx](../src/components/sections/PortfolioSection.tsx) | `grid-cols-3` gallery + tabs + `bg-pattern-grid` | Gallery, uniform grid | Remove pattern `div` only. An earlier version also gave the first card `col-span-2` for masonry variation, but Portfolio's item count varies by category filter (3 or 6 items) so a fixed span left 2 empty trailing cells in the last row for every category — reverted to uniform card sizing since safe asymmetric spans need a fixed, known item count (unlike Services' fixed 5). Keep Radix Tabs filter as-is. Keep `eyebrow` (one of the 4 retained). |
| [PartnershipSection.tsx](../src/components/sections/PartnershipSection.tsx) | Dark bg, `grid-cols-3` tabs, `bg-pattern-dots-dark` | Editorial tabbed section (keep dark bg + tabs) | Remove pattern `div`. Keep Radix Tabs structure (already distinct from card-grid family). Drop `eyebrow`. |
| [GrowthPlanSection.tsx](../src/components/sections/GrowthPlanSection.tsx) | Pillar cards + `bg-pattern-grid-sm` | Roadmap list (numbered vertical list) | Remove pattern `div`; replace card grid with a numbered list layout (large index numeral + title + description per row, hairline divider between rows instead of card borders). Drop `eyebrow`. |
| [WhyChooseUsSection.tsx](../src/components/sections/WhyChooseUsSection.tsx) | `grid-cols-3` cards (6 items) + `bg-pattern-cross` | Horizontal capability strip (2-row inline list) | Remove pattern `div`; replace 3-col card grid with a 2-column (desktop) / 1-column (mobile) checklist-style row layout, icon + title + description inline, no card boxes. Drop `eyebrow`. |
| [ProcessSection.tsx](../src/components/sections/ProcessSection.tsx) | Timeline + `bg-pattern-grid` + `bg-pattern-grid-sm` | Process timeline (keep) | Remove both pattern `div`s. Timeline structure itself stays (already a distinct family). Keep `eyebrow` (one of the 4 retained). |
| [CoverageSection.tsx](../src/components/sections/CoverageSection.tsx) | Map/image + data, left-aligned, `bg-pattern-grid` | Photo + overlaid data (keep) | Remove pattern `div`. Structure otherwise unchanged. |
| [SocialProofSection.tsx](../src/components/sections/SocialProofSection.tsx) | Marquee + `bg-pattern-dots` | Logo marquee (keep, only marquee on page) | Remove pattern `div`. Marquee mechanics unchanged. Drop `eyebrow`. |
| [FaqSection.tsx](../src/components/sections/FaqSection.tsx) | Accordion, left-aligned, `bg-pattern-grid` | Accordion (keep) | Remove pattern `div`. Accordion/JSON-LD unchanged. |
| [ContactSection.tsx](../src/components/sections/ContactSection.tsx) | Split form/info + `bg-pattern-dots-dark` | Split contact (keep) | Remove pattern `div`. Keep `eyebrow` (one of the 4 retained). |

## Net eyebrow usage after Phase 4

Hero (1), Portfolio (6), Process (10), Contact (14) — 4 sections total (including Hero's badge), each separated by 4+ sections, satisfying the "max 1 per 3" rule with margin.

## Net pattern-background usage after Phase 4

Hero (1) and Production Capacity (4) only — down from 13 sections to 2.
