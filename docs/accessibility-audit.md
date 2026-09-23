# MKI Website — Accessibility Audit (Phase 6)

Targets WCAG 2.2 AA per the skill's accessibility checklist. This is a code-level review (grep + component read), not an automated axe-core/Lighthouse run — that's flagged as a gap below.

## Checks performed

| Check | Finding | Status |
|---|---|---|
| Heading hierarchy | Single `<h1>` in `HeroSection.tsx`; every `SectionHeader` renders `<h2>`; card-level titles use `<h3>`. No skipped levels found. | PASS |
| Form labels | `ContactSection.tsx` wraps every input in a `<label>` (not placeholder-as-label); error text (`errors.name`, `errors.phone`) is linked via `aria-describedby`. Unaffected by Phase 4 (only the pattern-bg div was removed from this file). | PASS |
| Accordion (FAQ) | Uses Radix `Accordion` primitives directly (`accordion.tsx` has no attribute overrides) — Radix handles `aria-expanded`, `aria-controls`, keyboard nav out of the box. | PASS |
| Tabs (Portfolio, Partnership) | Uses Radix `Tabs` — same automatic aria/keyboard handling. `TabsList`/`TabsTrigger` markup untouched by Phase 4 (only the surrounding grid/pattern div changed). | PASS |
| Icon-only buttons | `ScrollToTop.tsx` has `aria-label="Kembali ke atas"`. Theme toggle and mobile menu (`ThemeToggle.tsx`, `MobileMenu.tsx`) already carry aria attributes per Phase 1 grep. | PASS |
| `prefers-reduced-motion` | Global CSS override in `globals.css` (lines ~289-298) collapses all animations/transitions to near-zero duration. Every new/edited section uses the existing `Reveal` component or `useSafeReducedMotion()`, both of which already branch on this — no new motion code bypasses it. | PASS |
| Focus states | `focus-visible` styles present in `button.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx` — not touched by Phase 4. | PASS |
| Color as sole status indicator | New "Roadmap list" (Growth Plan) and "Capability strip" (Why Choose Us) layouts use icon + text + numeral together, not color alone, to differentiate items. | PASS |
| Touch targets (mobile) | `ScrollToTop` is `size-12` (48px), `FloatingCta` buttons are `h-11` (44px) — both meet the ~44px minimum. Unaffected by Phase 4. | PASS |
| Semantic list markup (new Growth Plan) | Rewritten as `<ol><li>...</li></ol>` with `Reveal` placed *inside* each `<li>` (not wrapping it) specifically to avoid an invalid `<div>` between `<ol>` and `<li>`. | PASS (verified during implementation) |

## Gaps / not verified in this pass

- **No automated contrast audit run.** The new metric-wall and spec-strip layouts reuse existing `text-foreground` / `text-muted-foreground` tokens already used elsewhere on the same backgrounds (`bg-secondary/50`, `bg-card`), so contrast risk is low, but this was not run through an automated contrast checker (no such tool available in this session).
- **No screen-reader walkthrough performed** (e.g. VoiceOver/NVDA). Radix primitives make this low-risk for Accordion/Tabs, but a manual pass is recommended before final launch.
- **Keyboard-only navigation** was not manually tested end-to-end in this session (would require interactive browser tabbing through all 14 sections). Recommend a manual Tab-key pass focusing on: Portfolio tabs → card → lightbox dialog → close, and the Contact form.

## Pre-existing item unrelated to this redesign (flagged, not fixed)

`FloatingCta.tsx` and `ScrollToTop.tsx` both use `window.addEventListener("scroll", ...)` directly (with rAF-debounced direct style mutation, not React state). This predates Phase 4 and wasn't part of the section rework, so it wasn't touched — but it's worth noting since the anti-slop skill flags raw scroll listeners as a pattern to avoid in favor of `IntersectionObserver` or Motion's `useScroll()`. Not an accessibility defect (no jank observed, no state thrashing), just a maintainability/perf note — see [performance-audit.md](./performance-audit.md).
