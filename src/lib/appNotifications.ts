"use client";

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const NOTIF_STORAGE_PREFIX = "mki_notified_";

/**
 * Inisialisasi Channel Notifikasi Android resmi
 */
export async function initNotificationChannels(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // 1. Channel untuk Pembaruan Aplikasi (APK) - High Priority
    await LocalNotifications.createChannel({
      id: "app_updates",
      name: "Pembaruan Aplikasi",
      description: "Notifikasi ketika ada rilis versi aplikasi terbaru",
      importance: 5, // Heads-up banner + sound + vibration
      visibility: 1, // Tampil di lockscreen
      vibration: true,
    });

    // 2. Channel untuk Pembaruan Harga & Item Katalog Google Sheets
    await LocalNotifications.createChannel({
      id: "pricing_updates",
      name: "Pembaruan Harga & Item",
      description: "Notifikasi saat tarif material dan katalog workshop diperbarui",
      importance: 4, // Sound + vibration
      visibility: 1,
      vibration: true,
    });
  } catch (err) {
    console.warn("[appNotifications] Gagal membuat notification channels:", err);
  }
}

/**
 * Cek dan minta izin notifikasi sistem Android (Android 13+ POST_NOTIFICATIONS)
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") {
      return true;
    }
    const req = await LocalNotifications.requestPermissions();
    return req.display === "granted";
  } catch (err) {
    console.warn("[appNotifications] Gagal meminta izin notifikasi:", err);
    return false;
  }
}

/**
 * 1. Kirim Notifikasi Sistem: Pembaruan Aplikasi (App Update)
 * Muncul di status bar HP seperti notifikasi WhatsApp / SMS
 */
export async function sendAppUpdateNotification(version: string, changelog?: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  // Cegah spam: jika versi ini sudah pernah dinotifikasikan ke status bar, jangan kirim ulang berulang kali
  const notifiedKey = `${NOTIF_STORAGE_PREFIX}app_v${version}`;
  try {
    if (localStorage.getItem(notifiedKey) === "true") {
      return;
    }
  } catch {
    // Ignore storage errors
  }

  const hasPerm = await requestNotificationPermission();
  if (!hasPerm) return;

  await initNotificationChannels();

  try {
    const summary = changelog
      ? changelog.split("\n")[0].replace(/^[•\-\*]\s*/, "")
      : "Fitur baru & perbaikan stabilitas tersedia.";

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1001,
          title: `🚀 Pembaruan Aplikasi Tersedia (v${version})`,
          body: `Versi terbaru siap diunduh! ${summary}`,
          channelId: "app_updates",
          schedule: { at: new Date(Date.now() + 200) },
          extra: {
            type: "app_update",
            version,
          },
        },
      ],
    });

    try {
      localStorage.setItem(notifiedKey, "true");
    } catch {
      // Ignore
    }
    console.log(`[appNotifications] ✅ Notifikasi sistem update v${version} terkirim`);
  } catch (err) {
    console.warn("[appNotifications] Gagal mengirim notifikasi app update:", err);
  }
}

/**
 * 2. Kirim Notifikasi Sistem: Pembaruan Harga / Item Google Sheets
 * Muncul di status bar HP saat ada perubahan harga / penambahan katalog
 */
export async function sendPricingUpdateNotification(options?: {
  itemCount?: number;
  lastUpdatedDate?: Date;
  customMessage?: string;
}): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const hasPerm = await requestNotificationPermission();
  if (!hasPerm) return;

  await initNotificationChannels();

  try {
    const bodyText =
      options?.customMessage ||
      (options?.itemCount
        ? `Terdapat ${options.itemCount} item material & tarif pengerjaan baru dari Google Sheets workshop.`
        : "Tarif bahan dan item furniture telah diperbarui dari Google Sheets.");

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2001,
          title: "🏷️ Pembaruan Harga & Katalog Material",
          body: bodyText,
          channelId: "pricing_updates",
          schedule: { at: new Date(Date.now() + 200) },
          extra: {
            type: "pricing_update",
          },
        },
      ],
    });

    console.log("[appNotifications] ✅ Notifikasi sistem update harga terkirim");
  } catch (err) {
    console.warn("[appNotifications] Gagal mengirim notifikasi pricing update:", err);
  }
}
