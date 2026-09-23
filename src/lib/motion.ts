"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Hydration-safe wrapper around Framer Motion's useReducedMotion hook.
 * Returns false on the server and initial client render, then resolves
 * to the actual device preferences on mount.
 */
export function useSafeReducedMotion() {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? reduce : false;
}
