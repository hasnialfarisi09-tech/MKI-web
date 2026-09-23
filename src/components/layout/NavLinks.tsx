"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

/**
 * Desktop nav with a scroll-spy active-section indicator.
 * IntersectionObserver only (no raw scroll listener) — each anchored section
 * is a bounded element, so a narrow center band decides "current" section.
 */
export function NavLinks() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = navigationItems.map((item) => item.href.replace("/#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden min-w-0 items-center justify-center gap-1 xl:flex">
      {navigationItems.map((item) => {
        const id = item.href.replace("/#", "");
        const isActive = id === active;
        return (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold transition hover:bg-secondary hover:text-foreground 2xl:px-4",
              isActive ? "text-foreground" : "text-mki-gray",
            )}
          >
            {item.label}
            {isActive ? (
              <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-mki-orange 2xl:inset-x-4" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
