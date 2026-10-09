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
    <nav className="flex items-center justify-center gap-0.5 xl:gap-1 2xl:gap-1.5">
      {navigationItems.map((item) => {
        const id = item.href.replace("/#", "");
        const isActive = id === active;
        const isSimulation = item.href.includes("simulasi-biaya");

        return (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 2xl:px-3 2xl:text-sm",
              isSimulation
                ? "bg-mki-orange/10 font-bold text-mki-orange hover:bg-mki-orange/20"
                : isActive
                ? "bg-secondary/80 font-bold text-foreground dark:bg-secondary/60"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
            )}
          >
            {item.label}
            {isActive && !isSimulation ? (
              <span className="absolute inset-x-2.5 -bottom-0.5 h-[2px] rounded-full bg-mki-orange 2xl:inset-x-3" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
