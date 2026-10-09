"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";

interface RefreshButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function RefreshButton({ className, showLabel = false }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();

    setTimeout(() => {
      // Jika di aplikasi Android Native atau sedang membuka rute simulasi biaya,
      // pastikan refresh tetap berada di halaman Simulasi Biaya
      if (isNative || pathname?.startsWith("/simulasi-biaya")) {
        window.location.replace("/simulasi-biaya/");
      } else {
        window.location.reload();
      }
    }, 150);
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
        "hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-60",
        showLabel ? "h-9 px-3 gap-1.5 text-xs font-medium" : "size-9",
        className
      )}
    >
      <RefreshCw
        className={cn(
          "size-[18px] transition-transform duration-500",
          isRefreshing && "animate-spin text-primary"
        )}
      />
      {showLabel && <span>{isRefreshing ? "Memuat..." : "Refresh"}</span>}
    </button>
  );
}
