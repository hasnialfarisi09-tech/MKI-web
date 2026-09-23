"use client";

import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-all duration-300 hover:border-mki-orange hover:bg-orange-50 hover:text-mki-orange dark:hover:bg-orange-950/30"
      >
        <span className="size-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground shadow-sm transition-all duration-300 hover:border-mki-orange hover:bg-orange-50 hover:text-mki-orange hover:shadow-glow dark:hover:bg-orange-950/30"
    >
      {/* Sun icon */}
      <IconSun
        className="absolute size-[18px] transition-all duration-500"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
        }}
      />
      {/* Moon icon */}
      <IconMoonStars
        className="absolute size-[18px] transition-all duration-500"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
        }}
      />
    </button>
  );
}
