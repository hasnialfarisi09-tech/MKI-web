# MKI Website — Copyright & Asset Audit (Phase 1 Discovery)

Scope: identifikasi sumber dan status izin seluruh aset visual yang dipakai di situs. Ini audit berbasis nama file dan struktur folder saja — saya tidak bisa memverifikasi lisensi/izin nyata dari sini; semua status di bawah adalah kondisi awal yang wajib dikonfirmasi pemilik bisnis sebelum diklaim "Approved."

## Ringkasan risiko

| Kategori | Jumlah aset | Risiko | Status default |
|---|---|---|---|
| Logo MKI | 1 (`mki-logo.png`) | Rendah — milik sendiri | Approved (asumsi) |
| Foto katalog interior (`mki-catalog/`) | 10 file | Rendah jika benar hasil project MKI, tinggi jika stock/AI | Needs confirmation |
| Foto bahan portofolio (`bahan_porto/`) | banyak, per kategori | Sama seperti di atas | Needs confirmation |
| Logo partner eksternal (`brand/`) | ~13 file | **Tinggi** — logo milik pihak lain, butuh izin publikasi eksplisit | Needs confirmation |
| QR code WhatsApp | 2 file | Rendah — dibuat sendiri dari nomor sendiri | Approved (asumsi) |

## Detail — Logo Partner Eksternal (risiko tertinggi)

File di `public/images/brand/` (selain `mki-logo.png`): `home putra interior.webp`, `savoy interior.png`, `patner interior.jpg`, `kitchenset bandung barat.jpg`, `akbar interior.jpg`, `garis interior.png`, `porto interior.jpg`, `pusat interior.jpg`, `furniture cimahi.png`, `home interior bandung.png`, `home-interior-bandung-logo.png`, `Dekorinterior.jpg`, `argo_interior.jpg`, `Mewah interior.webp`.

Ini semua dipakai di `clientLogos` (`content.ts`) sebagai social-proof logo wall dengan link Instagram masing-masing. **Skill anti-slop dan brief bisnis sama-sama menegaskan: jangan tampilkan logo partner tanpa izin publikasi.** Karena entri ini sudah punya link Instagram resmi per akun, kemungkinan besar ini memang partner nyata yang sudah dikenal — tapi saya tidak punya cara memverifikasi apakah mereka sudah setuju logonya dipajang di situs MKI.

**Rekomendasi:** sebelum redesign publish, konfirmasi ke masing-masing 13 partner bahwa logo mereka boleh tetap tampil (atau sudah ada kesepakatan kemitraan tertulis yang mencakup ini). Tandai di `asset-register.md`.

## Detail — Foto Katalog & Portofolio

`public/images/mki-catalog/` (hero, about, kitchen, bedroom, living, wardrobe, stairs, commercial, coverage, putra-corporation-building) dan `public/images/bahan_porto/` (subfolder per kategori: BACKDROP TV, BENCH CABINET, KAMARSET, KITCHENSET, LEMARI BAWAH TANGGA, LIVING ROOM, MINI BAR, WALL PANEL, WARDROBE) — nama folder dan penamaan file (Bahasa Indonesia, kapital tidak konsisten) mengindikasikan ini foto internal/dokumentasi project asli, bukan stock photo generik. Ini konsisten dengan arahan brief ("gunakan foto nyata MKI").

**Catatan dari Hero Section (temuan visual sebelumnya):** foto hero (`hero.webp`) menampilkan interior dengan TV menyala menampilkan gambar pemandangan — bukan konten berhak cipta pihak ketiga di layar (hanya wallpaper/screensaver generik), jadi risikonya rendah, tapi tetap perlu dicek manual pada Phase 2 apakah ada logo brand elektronik atau konten bermerek lain yang terlihat di foto manapun.

**Rekomendasi:** konfirmasi kepemilikan penuh (bukan hasil unduhan referensi/Pinterest) untuk seluruh isi `mki-catalog/` dan `bahan_porto/`.

## Aset yang TIDAK ditemukan (baik)

- Tidak ada folder aset bergaya "stock photo umum" (mis. Unsplash/Pexels hotlink) — semua gambar disimpan lokal di `public/images/`, sesuai praktik baik yang diminta skill (tidak hotlink, tidak CDN eksternal untuk gambar).
- Tidak ditemukan font berbayar tanpa lisensi — font (`Plus Jakarta Sans`, `Fraunces`) dimuat lewat `next/font/google`, self-hosted otomatis oleh Next.js, bukan CDN eksternal.
- Tidak ditemukan icon library eksternal via CDN — `lucide-react` adalah dependency npm lokal, bukan hotlink.

## Tindak lanjut wajib sebelum redesign dianggap "production-ready"

1. Konfirmasi tertulis (atau bukti kesepakatan kemitraan yang sudah ada) untuk penggunaan 13 logo partner eksternal.
2. Konfirmasi kepemilikan penuh atas seluruh foto di `mki-catalog/` dan `bahan_porto/`.
3. Cek manual (bukan dari nama file) apakah ada watermark pihak ketiga tersisa di foto manapun.

Detail per-file ada di [asset-register.md](./asset-register.md).
