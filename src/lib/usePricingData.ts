"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  FurnitureItemConfig,
  ProvinceOption,
} from "@/data/pricing-calculator";
import {
  KITCHEN_ITEMS,
  ELECTRONIC_ITEMS,
  ACCESSORIES_ITEMS,
  OTHER_CATEGORIES,
  PROVINCES_DATA,
} from "@/data/pricing-calculator";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PricingDataState = {
  /** Semua item furniture dari semua kategori */
  allItems: FurnitureItemConfig[];
  /** Data provinsi & kota */
  provinces: ProvinceOption[];
  /** true saat sedang fetch pertama kali */
  loading: boolean;
  /** Pesan error jika fetch gagal total */
  error: string | null;
  /** true jika data yang ditampilkan dari API (bukan hardcode) */
  isLive: boolean;
  /** Timestamp terakhir data di-refresh */
  lastUpdated: Date | null;
  /** Fungsi untuk manual refresh */
  refresh: () => void;
};

// ─── Fallback data (hardcode, selalu tersedia offline) ─────────────────────────

function getLocalFallback(): {
  allItems: FurnitureItemConfig[];
  provinces: ProvinceOption[];
} {
  const allItems: FurnitureItemConfig[] = [
    ...KITCHEN_ITEMS,
    ...ELECTRONIC_ITEMS,
    ...ACCESSORIES_ITEMS,
    ...OTHER_CATEGORIES,
  ];
  return { allItems, provinces: PROVINCES_DATA };
}

// ─── Cache di localStorage ─────────────────────────────────────────────────────

const LS_KEY = "mki_pricing_cache";
const LS_TTL_MS = 60 * 60 * 1000; // 1 jam

type LocalCache = {
  allItems: FurnitureItemConfig[];
  provinces: ProvinceOption[];
  cachedAt: number;
};

function readLocalCache(): LocalCache | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed: LocalCache = JSON.parse(raw);
    if (Date.now() - parsed.cachedAt > LS_TTL_MS) return null; // expired
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalCache(
  allItems: FurnitureItemConfig[],
  provinces: ProvinceOption[]
) {
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ allItems, provinces, cachedAt: Date.now() })
    );
  } catch {
    // localStorage penuh atau tidak tersedia, skip
  }
}

// ─── URL Google Apps Script ────────────────────────────────────────────────────
// Dibaca dari env variable yang di-embed saat build (hanya NEXT_PUBLIC_ yang tersedia di client)
// Kita simpan URL di NEXT_PUBLIC_APPS_SCRIPT_URL
const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// Debug: log URL saat module dimuat (tampil di browser console)
if (typeof window !== "undefined") {
  console.log(
    "[usePricingData] Apps Script URL:",
    APPS_SCRIPT_URL ? `${APPS_SCRIPT_URL.slice(0, 60)}...` : "⚠️ KOSONG - env var tidak terbaca!"
  );
}

// ─── Main Hook ─────────────────────────────────────────────────────────────────

/**
 * Hook untuk mengambil data harga & lokasi langsung dari Google Apps Script.
 *
 * Priority data:
 * 1. localStorage cache (jika < 1 jam)
 * 2. Google Apps Script URL langsung (client-side fetch)
 * 3. Fallback ke data hardcode (offline)
 *
 * Kenapa langsung ke Apps Script (bukan lewat Next.js API)?
 * → Karena proyek ini pakai `output: "export"` untuk Capacitor/Android
 *   sehingga API Routes tidak didukung.
 */
export function usePricingData(): PricingDataState {
  const fallback = getLocalFallback();

  const [allItems, setAllItems] = useState<FurnitureItemConfig[]>(
    fallback.allItems
  );
  const [provinces, setProvinces] = useState<ProvinceOption[]>(
    fallback.provinces
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      // 1. Cek localStorage cache dulu (cepat, offline-friendly)
      const cached = readLocalCache();
      if (cached) {
        setAllItems(cached.allItems);
        setProvinces(cached.provinces);
        setIsLive(true);
        setLastUpdated(new Date(cached.cachedAt));
        setLoading(false);
        // Tetap fetch di background untuk memperbarui cache
      }

      // 2. Kalau tidak ada URL Apps Script, skip fetch
      if (!APPS_SCRIPT_URL) {
        if (!cached) {
          // Pakai hardcode fallback
          setIsLive(false);
        }
        setLoading(false);
        return;
      }

      // 3. Fetch langsung ke Google Apps Script
      try {
        console.log("[usePricingData] Fetching dari Apps Script...");
        const res = await fetch(`${APPS_SCRIPT_URL}?action=all`, {
          method: "GET",
          redirect: "follow",   // penting untuk Google Apps Script redirect
          mode: "cors",
        });
        if (cancelled) return;

        console.log("[usePricingData] Response status:", res.status, res.type);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;

        console.log("[usePricingData] Response success:", json.success);
        if (!json.success) throw new Error(json.error || "Unknown error");

        const { pricing, locations } = json.data as {
          pricing: FurnitureItemConfig[];
          locations: ProvinceOption[];
        };

        if (!Array.isArray(pricing) || pricing.length === 0) {
          throw new Error("Data pricing kosong dari Apps Script");
        }

        const resolvedProvinces =
          Array.isArray(locations) && locations.length > 0
            ? locations
            : fallback.provinces;

        setAllItems(pricing);
        setProvinces(resolvedProvinces);
        setIsLive(true);
        setLastUpdated(new Date());
        writeLocalCache(pricing, resolvedProvinces);
        console.log(`[usePricingData] ✅ Berhasil load ${pricing.length} items dari Apps Script`);
      } catch (err) {
        if (cancelled) return;

        const msg = err instanceof Error ? err.message : "Fetch gagal";
        console.warn("[usePricingData] Gagal fetch Apps Script:", msg);

        if (!cached) {
          setError("Menggunakan data bawaan aplikasi (offline mode).");
          setIsLive(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTick]);

  return {
    allItems,
    provinces,
    loading,
    error,
    isLive,
    lastUpdated,
    refresh,
  };
}
