"use client";

import { useEffect, useState, useCallback } from "react";
import { CURRENT_APP_VERSION, AppVersionInfo } from "@/constants/appVersion";

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
  openModal: () => void;
  closeModal: () => void;
}

export function useAppUpdate(): AppUpdateState {
  const [updateInfo, setUpdateInfo] = useState<AppVersionInfo | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualCheckStatus, setManualCheckStatus] = useState<"idle" | "latest" | "error">("idle");

  const checkForUpdate = useCallback(async (isManual = false) => {
    if (!APPS_SCRIPT_URL) {
      if (isManual) setManualCheckStatus("error");
      return;
    }

    try {
      setIsChecking(true);
      if (isManual) setManualCheckStatus("idle");

      const res = await fetch(`${APPS_SCRIPT_URL}?action=app_version`, {
        method: "GET",
        redirect: "follow",
        mode: "cors",
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (!json.success || !json.data) {
        if (isManual) setManualCheckStatus("latest");
        return;
      }

      const remote = json.data as AppVersionInfo;
      if (!remote.latestVersion) {
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
    openModal,
    closeModal,
  };
}
