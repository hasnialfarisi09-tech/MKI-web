"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

/**
 * Scroll-to-top button with CSS transition for show/hide.
 * No framer-motion — purely CSS opacity/transform, triggered by a passive scroll listener.
 */
export function ScrollToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const visible = window.scrollY > 520;
        if (btn) {
          btn.style.opacity = visible ? "1" : "0";
          btn.style.pointerEvents = visible ? "auto" : "none";
          btn.style.transform = visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)";
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-all duration-300 hover:border-transparent hover:bg-mki-gradient hover:text-white hover:shadow-glow md:bottom-8 md:right-8"
      style={{ opacity: 0, pointerEvents: "none", transform: "translateY(10px) scale(0.9)" }}
      aria-label="Kembali ke atas"
    >
      <IconArrowUp className="size-5" />
    </button>
  );
}

