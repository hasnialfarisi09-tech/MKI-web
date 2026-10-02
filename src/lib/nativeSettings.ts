import { registerPlugin, Capacitor } from "@capacitor/core";

interface NativeSettingsPluginInterface {
  openAppSettings(): Promise<void>;
}

const NativeSettingsPlugin = registerPlugin<NativeSettingsPluginInterface>("NativeSettings");

/**
 * Membuka menu Pengaturan Aplikasi (App Info / Details Settings) di perangkat Android.
 * Dari menu ini pengguna bisa mengatur izin:
 * - Notifikasi (ON / OFF)
 * - Lokasi (Izinkan / Tolak)
 * - Batasi Data Jaringan
 * - Penyimpanan, Kamera, dll.
 */
export async function openAppSettings(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      await NativeSettingsPlugin.openAppSettings();
      return true;
    } catch (error) {
      console.error("Gagal membuka pengaturan native:", error);
      return false;
    }
  }
  return false;
}
