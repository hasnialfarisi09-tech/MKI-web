# MKI Website — Content Audit (Phase 1 Discovery)

Scope: konsistensi data bisnis, klaim, dan copy across `src/constants/content.ts` dan `src/constants/company.ts`. Tidak ada konten yang diubah untuk membuat dokumen ini.

## Konsistensi angka statistik

Ditelusuri lewat pencarian semua kemunculan angka utama di `content.ts`:

| Metrik | Nilai | Konsisten di semua kemunculan? |
|---|---|---|
| Total project | 4.048+ / 4048+ | Ya secara nilai, **tidak konsisten format** — kadang `4048+` (tanpa titik, di `heroContent.miniStats` dan `stats`), kadang `4.048+` (dengan titik, di `partnerships[].metrics`, `portfolioSection.description`, `coverageSection.projectRecord`) |
| Workshop aktif | 23 | Konsisten |
| Tenaga ahli | 150+ | Konsisten |
| Personel workshop terdata | 156 | Konsisten (hanya muncul di `productionMetrics` dan FAQ) |
| Account/mitra | 62+ | Konsisten (hanya muncul di `stats` dan `partnerships.agency.metrics`) |
| Kapasitas produksi | 2.690m/bulan | Konsisten |
| Kota/kabupaten coverage | 28 Kota | Konsisten |
| Provinsi | 3 Provinsi | Konsisten |
| Rekam jejak 2021-2026 | 3.895 project + 153 project Jan-Feb 2026 = 4.048+ | Perhitungan konsisten (3.895 + 153 = 4.048) — **ini justru bukti bagus**, bukan angka karangan |

**Temuan:** hanya ada 1 masalah nyata — **inkonsistensi format penulisan angka** (`4048+` vs `4.048+`). Tidak ditemukan konflik nilai (angka berbeda untuk metrik yang sama). Rekomendasi: standardisasi ke satu format (`4.048+` dengan titik ribuan lebih sesuai konvensi Bahasa Indonesia) di Phase 2.

## Klaim yang perlu diverifikasi

- `coverageSection.description` mengklaim area operasional di 3 provinsi: **Jawa Barat, DKI Jakarta, Bali**. Namun `coverageCities` (daftar 28 kota/kabupaten) yang terbaca hanya mencantumkan kota-kota di Jawa Barat + Tangerang/Jakarta (DKI Jakarta) — **tidak ada satu kota pun dari Bali** dalam daftar `coverageCities`, padahal `workshopItems` (data workshop per grup) MEMANG mencantumkan grup "Bali" dengan 5 workshop (WS AN, WS IB, WS NO, WS RI, WS NK). Ini kemungkinan bukan kesalahan data, hanya perbedaan cakupan (coverage kota vs lokasi workshop), tapi berpotensi membingungkan pembaca yang membandingkan kedua section tersebut. **[DATA PERLU DIVERIFIKASI]** — apakah project benar sudah berjalan di kota-kota Bali (bukan hanya workshop berlokasi di sana)?
- Klaim "sejak 2018" — konsisten di `company.foundedYear`, hero badge, dan about section.
- Tidak ditemukan klaim superlatif tanpa bukti ("nomor satu", "terbaik", "terpercaya" tanpa dasar) pada teks yang terbaca — bagus, sudah sesuai arahan skill untuk menghindari copywriting hiperbolis.

## Bahasa dan tone

- Bahasa Indonesia konsisten profesional, tidak ditemukan typo mencolok pada teks yang dibaca.
- Istilah asing dipakai secukupnya dan relevan secara industri ("quality control," "workshop," "faceless content") — tidak berlebihan.
- Tidak ditemukan em dash/en dash pada teks yang dibaca (`content.ts` konsisten memakai hyphen biasa, contoh: "2021-2026", "Januari-Februari") — sudah sesuai aturan skill.
- Kata "premium" dipakai berulang tapi wajar untuk positioning brand (bukan di setiap kalimat).

## Rekomendasi
1. Standardisasi format angka `4.048+` di seluruh file (ganti 2 kemunculan `4048+` menjadi `4.048+`).
2. Minta konfirmasi bisnis: apakah project di Bali benar sudah berjalan (untuk klaim 3 provinsi), atau apakah klaim sebaiknya diperjelas jadi "workshop aktif di 3 provinsi" vs "project berjalan di 28 kota Jawa Barat & Jakarta."
