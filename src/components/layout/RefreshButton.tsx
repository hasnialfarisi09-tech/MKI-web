"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function RefreshButton({ className, showLabel = false }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Beri sedikit jeda mikro (120ms) agar animasi putar icon terlihat oleh pengguna sebelum reload
    setTimeout(() => {
      window.location.reload();
    }, 120);
  };

  return (
    <button
      id="refresh-page-btn"
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh Halaman"
      title="Muat ulang halaman"
      className={cn(
        "relative flex items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all duration-300",
        "hover:border-mki-orange hover:bg-orange-50 hover:text-mki-orange hover:shadow-glow dark:hover:bg-orange-950/30 active:scale-95 disabled:opacity-60",
        showLabel ? "h-9 px-3 gap-1.5 text-xs font-medium" : "size-9",
        className
      )}
    >
      <RefreshCw
        className={cn(
          "size-[18px] transition-transform duration-500",
          isRefreshing && "animate-spin text-mki-orange"
        )}
      />
      {showLabel && <span>{isRefreshing ? "Memuat..." : "Refresh"}</span>}
    </button>
  );
}
