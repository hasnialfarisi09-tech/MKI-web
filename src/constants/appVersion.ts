/**
 * Versi aplikasi saat ini.
 * Setiap kali Anda ingin merilis update tampilan/kode baru,
 * naikkan angka versi ini (misal dari "1.0.0" -> "1.1.0").
 */
export const CURRENT_APP_VERSION = "1.5.0";
export const CURRENT_BUILD_NUMBER = 6;
export const CURRENT_RELEASE_DATE = "2026-10-02";

export interface AppVersionInfo {
  latestVersion: string;
  minVersion?: string;
  downloadUrl: string;
  changelog?: string;
  forceUpdate?: boolean;
  releaseDate?: string;
}
