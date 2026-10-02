"use client";

import { useEffect, useState, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { CURRENT_APP_VERSION, AppVersionInfo } from "@/constants/appVersion";
import { sendAppUpdateNotification } from "@/lib/appNotifications";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";
const DISMISSED_KEY_PREFIX = "mki_dismissed_update_";

/**
 * Membandingkan 2 string semver (misal "1.1.0" dan "1.0.0").
 * Return:
 *  1 jika v1 > v2 (v1 lebih baru)
 * -1 jika v1 < v2
 *  0 jika sama
 */
export function compareVersions(v1: string, v2: string): number {
  const clean1 = (v1 || "").replace(/^v/i, "").trim().split(".").map((n) => parseInt(n, 10) || 0);
  const clean2 = (v2 || "").replace(/^v/i, "").trim().split(".").map((n) => parseInt(n, 10) || 0);

  const length = Math.max(clean1.length, clean2.length);
  for (let i = 0; i < length; i++) {
    const num1 = clean1[i] ?? 0;
    const num2 = clean2[i] ?? 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

export interface AppUpdateState {
  currentVersion: string;
  updateInfo: AppVersionInfo | null;
  hasUpdate: boolean;
  isForceUpdate: boolean;
  isChecking: boolean;
  isModalOpen: boolean;
  manualCheckStatus: "idle" | "latest" | "error";
  checkForUpdate: (isManual?: boolean) => Promise<void>;
  dismissUpdate: () => void;
  dismissToast: () => void;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Mengambil informasi rilis terbaru dari beberapa sumber terpercaya:
 * 1. File statis web lokal / hosting (/app-version.json)
 * 2. GitHub Raw repository (update real-time saat developer push ke main)
 * 3. GitHub Releases API (jika rilis dibuat via GitHub Releases)
 * 4. Google Apps Script Web App (sebagai opsi cadangan)
 */
async function fetchRemoteVersionInfo(): Promise<AppVersionInfo | null> {
  const cacheBuster = `t=${Date.now()}`;
  const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();

  // 1. Jika di Android Native (APK), utamakan GitHub Raw karena /app-version.json lokal di APK berisi versi lama saat APK di-build
  if (isNative) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/hasnialfarisi09-tech/MKI-web/main/public/app-version.json?${cacheBuster}`;
      const res = await fetch(rawUrl, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.latestVersion) {
          return data as AppVersionInfo;
        }
      }
    } catch (e) {
      console.warn("[useAppUpdate] Gagal fetch GitHub Raw di Android:", e);
    }
  }

  // 2. Coba dari web lokal / domain hosting (/app-version.json)
  if (!isNative && typeof window !== "undefined") {
    try {
      const res = await fetch(`/app-version.json?${cacheBuster}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.latestVersion) {
          return data as AppVersionInfo;
        }
      }
    } catch {
      // Lanjut ke sumber berikutnya jika gagal
    }
  }

  // 3. Fallback GitHub Raw (jika belum dicoba pada mode web)
  if (!isNative) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/hasnialfarisi09-tech/MKI-web/main/public/app-version.json?${cacheBuster}`;
      const res = await fetch(rawUrl, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.latestVersion) {
          return data as AppVersionInfo;
        }
      }
    } catch {
      // Lanjut ke sumber berikutnya
    }
  }

  // 3. Coba dari GitHub Releases resmi
  try {
    const res = await fetch(
      "https://api.github.com/repos/hasnialfarisi09-tech/MKI-web/releases/latest",
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );
    if (res.ok) {
      const release = await res.json();
      if (release?.tag_name) {
        const apkAsset = Array.isArray(release.assets)
          ? (release.assets.find((a: { name?: string }) => a.name?.includes("Estimasi Biaya")) ||
             release.assets.find((a: { name?: string }) => a.name?.endsWith(".apk")))
          : null;
        return {
          latestVersion: release.tag_name.replace(/^v/i, ""),
          downloadUrl: apkAsset?.browser_download_url || release.html_url || "",
          changelog: release.body || "Pembaruan rilis versi terbaru.",
          releaseDate: release.published_at ? release.published_at.slice(0, 10) : "",
          forceUpdate: false,
        };
      }
    }
  } catch {
    // Lanjut ke Apps Script
  }

  // 4. Cadangan: Google Apps Script Web App
  if (APPS_SCRIPT_URL) {
    try {
      const res = await fetch(`${APPS_SCRIPT_URL}?action=app_version`, {
        method: "GET",
        redirect: "follow",
        mode: "cors",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.latestVersion) {
          return json.data as AppVersionInfo;
        }
      }
    } catch (err) {
      console.warn("[useAppUpdate] Apps Script fallback gagal:", err);
    }
  }

  return null;
}

export function useAppUpdate(): AppUpdateState {
  const [updateInfo, setUpdateInfo] = useState<AppVersionInfo | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualCheckStatus, setManualCheckStatus] = useState<"idle" | "latest" | "error">("idle");

  const checkForUpdate = useCallback(async (isManual = false) => {
    try {
      setIsChecking(true);
      if (isManual) setManualCheckStatus("idle");

      const remote = await fetchRemoteVersionInfo();

      if (!remote || !remote.latestVersion) {
        if (isManual) setManualCheckStatus("latest");
        return;
      }

      const isNewer = compareVersions(remote.latestVersion, CURRENT_APP_VERSION) > 0;
      const isMandatory =
        Boolean(remote.forceUpdate) ||
        (remote.minVersion ? compareVersions(CURRENT_APP_VERSION, remote.minVersion) < 0 : false);

      setUpdateInfo(remote);
      setHasUpdate(isNewer);
      setIsForceUpdate(isMandatory);

      if (isNewer) {
        // Picu notifikasi status bar sistem Android
        sendAppUpdateNotification(remote.latestVersion, remote.changelog);

        // Cek apakah user pernah dismiss versi ini (hanya berlaku jika bukan force update)
        let isDismissed = false;
        if (!isMandatory && !isManual) {
          try {
            isDismissed = sessionStorage.getItem(`${DISMISSED_KEY_PREFIX}${remote.latestVersion}`) === "true";
          } catch {
            isDismissed = false;
          }
        }

        if (!isDismissed || isManual) {
          setIsModalOpen(true);
        }
      } else {
        if (isManual) {
          setManualCheckStatus("latest");
        }
      }
    } catch (err) {
      console.warn("[useAppUpdate] Gagal cek versi:", err);
      if (isManual) {
        setManualCheckStatus("error");
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Otomatis hilangkan toast status pengecekan manual (hijau/merah) setelah 5 detik
  useEffect(() => {
    if (manualCheckStatus !== "idle") {
      const timer = setTimeout(() => {
        setManualCheckStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [manualCheckStatus]);

  // Cek otomatis saat pertama kali dibuka
  useEffect(() => {
    // Delay 2 detik agar tidak bentrok dengan initial render / pricing fetch
    const timer = setTimeout(() => {
      checkForUpdate(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkForUpdate]);

  const dismissUpdate = useCallback(() => {
    if (!isForceUpdate && updateInfo?.latestVersion) {
      try {
        sessionStorage.setItem(`${DISMISSED_KEY_PREFIX}${updateInfo.latestVersion}`, "true");
      } catch {
        // Ignore storage errors
      }
      setIsModalOpen(false);
    }
  }, [isForceUpdate, updateInfo]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => {
    if (!isForceUpdate) setIsModalOpen(false);
  }, [isForceUpdate]);

  const dismissToast = useCallback(() => {
    setManualCheckStatus("idle");
  }, []);

  return {
    currentVersion: CURRENT_APP_VERSION,
    updateInfo,
    hasUpdate,
    isForceUpdate,
    isChecking,
    isModalOpen,
    manualCheckStatus,
    checkForUpdate,
    dismissUpdate,
    dismissToast,
    openModal,
    closeModal,
  };
}
