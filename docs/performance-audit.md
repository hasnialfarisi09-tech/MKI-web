# MKI Website — Performance Audit (Phase 6)

**Limitation:** no Lighthouse run was performed (would require a full browser automation pass this session didn't execute against a served build). This audit is code-level: image handling, bundle structure, and script patterns.

## What Phase 4 changed performance-wise

- **Net DOM reduction**: removed 12 decorative `bg-pattern-*` `<div>` elements (one per section) — each was a `position: absolute; inset: 0` layer with a repeating background-image, painted on every scroll frame it was visible. Fewer painted layers = less GPU work, especially on the sections that previously stacked 2 pattern divs (Process had `bg-pattern-grid` + `bg-pattern-grid-sm` together — now down to zero there).
- **Card-count reduction**: Stats and Growth Plan no longer render `StatCard`/pillar `<article>` components with individual `Tilt` (mouse-tracking) wrappers per item — the new metric-wall and roadmap-list layouts are plain flex/grid rows. Fewer `Tilt` instances means fewer pointer-move listeners active on-screen at once.
- **No new dependencies added.** All restructuring reused existing Tailwind utilities, the existing `Reveal`/`Icon`/`AnimatedValue` components — no bundle size increase from Phase 4.

## Existing patterns verified (not changed)

| Area | Finding | Status |
|---|---|---|
| Images | All images use `next/image` with explicit `sizes` attributes; Hero image has `priority` (correct for LCP). | Good |
| Fonts | `Plus Jakarta Sans` + `Fraunces` loaded via `next/font/google` (self-hosted at build time, `display: swap`) — no runtime Google Fonts CDN request. | Good |
| Code splitting | `src/app/page.tsx` uses `next/dynamic` for every below-the-fold section (About through Contact) — only `HeroSection` and `StatsSection` are eagerly bundled. Confirmed unchanged by Phase 4 (page.tsx wasn't touched). | Good |
| Static export | `next.config.ts` → `output: "export"`; `npm run build` completed in ~11s with 7 static routes, no server runtime needed. | Good |

## Flagged, not fixed in this pass

- **`window.addEventListener("scroll", ...)` in `FloatingCta.tsx` and `ScrollToTop.tsx`.** Both debounce with `requestAnimationFrame` and mutate DOM style directly (no React re-render per scroll frame), so the actual runtime cost is low — but this is exactly the raw-scroll-listener pattern the anti-slop skill flags as a hard-avoid in favor of `IntersectionObserver` (zero-cost when not intersecting) or Motion's `useScroll()`. Left as-is because it predates this redesign and isn't part of any of the 14 reworked sections — flagging here as a candidate for a future cleanup pass, not a regression introduced now.
- **No bundle-size measurement was run** (e.g. `next build` doesn't print a bundle analyzer report by default, and no `@next/bundle-analyzer` is configured). If a real Core Web Vitals number is needed, recommend running Lighthouse against the deployed `out/` build directly, since dev-mode timings aren't representative.

## Verification performed this session

- `npm run build` — succeeded, ~11s compile, static export to 7 routes, no build warnings about unused/oversized assets.
- Confirmed via grep that no new `<img>` tags (bypassing `next/image`) were introduced in any of the 14 edited files.
