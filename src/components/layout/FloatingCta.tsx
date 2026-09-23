"use client";

import { IconBriefcase, IconBrandWhatsapp } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { ctaLabels } from "@/constants/content";
import { createWhatsAppLink } from "@/lib/whatsapp";

/**
 * Floating CTA bar — uses CSS transitions for show/hide (no framer-motion).
 * Passive scroll listener with rAF debouncing for minimum main-thread work.
 */
export function FloatingCta() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const visible = window.scrollY > 520;
        if (el) {
          el.style.opacity = visible ? "1" : "0";
          el.style.pointerEvents = visible ? "auto" : "none";
          el.style.transform = visible ? "translateY(0)" : "translateY(24px)";
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-[1.75rem] border border-border bg-card/95 p-2 shadow-soft backdrop-blur-xl transition-all duration-300 md:hidden"
      style={{ opacity: 0, pointerEvents: "none", transform: "translateY(24px)" }}
    >
      <a
        href={createWhatsAppLink()}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-mki-gradient px-3 text-xs font-extrabold text-white shadow-glow transition-transform active:scale-[0.97] min-[420px]:text-sm"
      >
        <IconBrandWhatsapp className="size-4 shrink-0" />
        <span className="truncate">{ctaLabels.consult}</span>
      </a>
      <a
        href={createWhatsAppLink({ category: ctaLabels.partnership }, { recipient: "partnership" })}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-border bg-secondary px-3 text-xs font-extrabold text-mki-orange shadow-sm transition-transform active:scale-[0.97] min-[420px]:text-sm"
      >
        <IconBriefcase className="size-4 shrink-0" />
        <span className="truncate">{ctaLabels.partnership}</span>
      </a>
    </div>
  );
}

