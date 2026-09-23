"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll progress bar using native CSS scroll-driven animations.
 * Falls back to a lightweight rAF-based approach for broader browser compat.
 * No framer-motion — eliminates motion library from this scroll-critical component.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Use native CSS Scroll-driven animation if supported (Chrome 115+, Edge 115+)
    const ScrollTimelineCtor = (window as unknown as { ScrollTimeline?: new (opts: object) => object })
      .ScrollTimeline;
    if (typeof ScrollTimelineCtor === "function") {
      const scrollTimeline = new ScrollTimelineCtor({
        source: document.documentElement,
        axis: "block",
      });
      bar.animate({ transform: ["scaleX(0)", "scaleX(1)"] }, {
        timeline: scrollTimeline as AnimationTimeline,
        fill: "both",
      });
      return;
    }

    // Fallback: lightweight rAF scroll listener
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = document.documentElement;
        const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
        if (bar) bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-mki-gradient"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

