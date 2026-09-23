"use client";

import { useEffect } from "react";

const HEADER_OFFSET = 84;

export function SmoothScroll() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;

      if (!target) {
        return;
      }

      const hash = target.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const element = document.querySelector(hash);

      if (!element) {
        return;
      }

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      window.history.pushState(null, "", hash);
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
