"use client";

import { Capacitor } from "@capacitor/core";
import OneSignal from "@onesignal/capacitor-plugin";

// OneSignal App ID diambil dari env (NEXT_PUBLIC_ONESIGNAL_APP_ID)
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";

let isInitialized = false;

/**
 * Inisialisasi OneSignal Remote Push Notification
 * Aktif otomatis saat aplikasi Android dibuka pertama kali
 */
export async function initOneSignal(): Promise<void> {
  // Hanya jalankan di platform native Android / iOS (bukan web browser biasa)
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return;
  }

  if (isInitialized) return;

  if (!ONESIGNAL_APP_ID) {
    console.info(
      "[OneSignal] ℹ️ NEXT_PUBLIC_ONESIGNAL_APP_ID belum diisi di .env.local. Siapkan App ID OneSignal untuk mengaktifkan remote push notification saat aplikasi tertutup."
    );
    return;
  }

  try {
    // 1. Inisialisasi OneSignal SDK
    await OneSignal.initialize(ONESIGNAL_APP_ID);

    // 2. Minta izin notifikasi Android (Android 13+ POST_NOTIFICATIONS)
    await OneSignal.Notifications.requestPermission(true);

    // 3. Listener ketika user mengklik notifikasi OneSignal di status bar HP
    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("[OneSignal] Notifikasi di-klik:", event);
      try {
        const additionalData = event?.notification?.additionalData as
          | Record<string, unknown>
          | undefined;

        // Jika notifikasi rilis update mengirim link unduhan APK baru
        if (additionalData?.downloadUrl && typeof additionalData.downloadUrl === "string") {
          window.open(additionalData.downloadUrl, "_blank");
        } else if (additionalData?.url && typeof additionalData.url === "string") {
          window.open(additionalData.url, "_blank");
        }
      } catch (e) {
        console.warn("[OneSignal] Error handling notification click:", e);
      }
    });

    isInitialized = true;
    console.log("[OneSignal] ✅ Remote Push Notification berhasil diaktifkan.");
  } catch (err) {
    console.warn("[OneSignal] Gagal inisialisasi OneSignal:", err);
  }
}

