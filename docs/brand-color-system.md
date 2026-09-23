# MKI Website — Brand Color System (Draft, Phase 1)

**Limitation:** this is a code-level audit of the tokens already implemented in [tailwind.config.ts](../tailwind.config.ts) and [globals.css](../src/app/globals.css), not a pixel-sampled extraction from the raw logo file. Precise color-picker sampling from `public/images/brand/mki-logo.png` would need an image-analysis tool outside what's available in this session — flagged here as a gap for Phase 2 (a human designer or a color-sampling tool should verify these hex values against the logo file directly).

## Baseline: current implementation (source of truth over `DESIGN.md`)

`DESIGN.md`'s original palette (`#E85D04` orange / `#1F2933` charcoal / `#111827` navy) does **not** match what's actually shipped. The real, currently-live tokens are:

```css
/* tailwind.config.ts → theme.extend.colors.mki */
--mki-orange: #E5571F;   /* primary accent */
--mki-ember:  #F2682C;   /* brighter orange, gradients/glow */
--mki-red:    #B23A18;   /* deep clay, secondary warm accent */
--mki-clay:   #9C3B1B;
--mki-charcoal: #212529; /* heading / dark text */
--mki-navy:   #0F141C;   /* premium dark slate */
--mki-ink:    #151A22;
--mki-gray:   #6C757D;
--mki-soft:   #E9ECEF;
--mki-ivory:  #F8F9FA;
```

```css
/* globals.css → :root (light theme, HSL) */
--background: 210 12% 97%;
--foreground: 215 25% 12%;
--primary:    18 84% 51%;   /* = ~#E5571F, matches mki.orange */
--border:     210 8% 89%;
--radius:     1.4rem;
```

```css
/* globals.css → .dark (dark theme, HSL) */
--background: 220 20% 8%;
--foreground: 210 15% 90%;
--primary:    18 88% 56%;   /* slightly brighter orange for dark bg */
```

Gradient: `linear-gradient(135deg, #F2682C 0%, #B23A18 100%)` (`bg-mki-gradient`) — stays within the orange → clay family, no unrelated hues. This already satisfies the anti-slop rule against random purple/blue/cyan accents.

## Usage audit

- Orange (`primary`/`mki.orange`) is used consistently as the single primary accent across CTAs, badges, focus rings (`--ring`), and selection color (`::selection`) — good, one accent color, no drift.
- Charcoal/navy used for text and dark-section backgrounds (e.g. Partnership section) — consistent with the "graphite for contrast sections" direction the user's brief describes, even though the exact hex differs from their brief's `#1F2933`/`#111827`.
- No purple, blue-neon, or cyan glow found anywhere in the token files — palette discipline is already good.

## Gaps to close in Phase 2

1. **Verify against the actual logo file.** The current `mki.*` hex values read like a reasonable orange/charcoal/steel-grey interpretation of the logo, but no one has confirmed they were sampled from the real logo pixels. A designer (or a color-sampling tool) should open `public/images/brand/mki-logo.png` and confirm/adjust these hex values before they're called final.
2. **Document `--secondary` / `--muted` / `--accent` HSL tokens as the "steel grey" family** explicitly (they currently exist but aren't named as a deliberate "metallic grey" tier the way orange is named) — would make the system easier to reference in future redesign work.
3. **Reconcile `DESIGN.md`** — either update it to match the live implementation, or explicitly mark it as superseded, so future sessions don't treat its color values as current.
