# MKI Website — Current-Site Audit (Phase 1 Discovery)

Scope: brand, UX, and visual audit of the site as it exists today, before any redesign work. No code was changed to produce this document.

## Design Read

Website company-profile dan lead-generation untuk perusahaan interior manufacturing (PT Menuju Keindahan Indonesia / MKI), ditujukan ke pemilik rumah, arsitek, agensi, influencer, dan calon mitra bisnis. Bahasa visual saat ini: premium-editorial dengan aksen orange/charcoal, serif display (Fraunces) + sans modern (Plus Jakarta Sans), banyak motion (Motion/Framer), kartu rounded besar, dan glass/aurora decorative layer. Secara keseluruhan sudah jauh dari "template SaaS murahan," tetapi punya beberapa pola berulang yang membuatnya terasa seragam antar-section (lihat Visual Audit).

## Design Dials (usulan, untuk Phase 2)

| Dial | Nilai saat ini (estimasi dari kode) | Usulan |
|---|---|---|
| DESIGN_VARIANCE | ~4-5 (banyak section pakai grid 3-kolom + header center yang sama) | 7 |
| MOTION_INTENSITY | ~6 (Motion di hampir semua section, scroll reveal, parallax hero) | 5-6 (pertahankan, jangan tambah) |
| VISUAL_DENSITY | ~4 | 3-4 (pertahankan) |

Alasan: variance perlu naik karena struktur section terlalu seragam (lihat temuan V2 dan V3 di bawah); motion dan density sudah berada di rentang yang wajar untuk brief "premium interior manufacturing," tidak perlu diubah drastis.

---

## Brand Audit

- **Warna aktual vs `DESIGN.md` berbeda.** `DESIGN.md` (brief awal) menyebut `--primary-orange: #E85D04`, `--dark-charcoal: #1F2933`, `--dark-navy: #111827`. Implementasi aktual di [tailwind.config.ts](../tailwind.config.ts) dan [globals.css](../src/app/globals.css) memakai `mki.orange: #E5571F`, `mki.charcoal: #212529`, `mki.navy: #0F141C`, dan HSL token `--primary: 18 84% 51%`. **Ini konflik data brand** — brief lama tidak lagi jadi sumber kebenaran warna. Rekomendasi: jadikan implementasi saat ini (`tailwind.config.ts`) sebagai baseline resmi di `docs/brand-color-system.md`, bukan `DESIGN.md`.
- **Font aktual vs brief juga berbeda.** `DESIGN.md` minta Inter/Plus Jakarta Sans (sans-only). Implementasi memakai **Fraunces (serif display) + Plus Jakarta Sans (sans body)** — pergeseran ke arah editorial-premium yang lebih kuat daripada brief awal. Ini keputusan desain yang sudah berjalan, bukan bug, tapi perlu dikonfirmasi apakah tetap dipertahankan pada redesign berikutnya.
- **Radius, shadow, dan card style konsisten.** `--radius: 1.4rem`, `.premium-card`, `shadow-soft`/`shadow-glow` dipakai seragam lewat token, bukan nilai hardcoded per komponen — ini fondasi yang baik untuk dipertahankan.
- **Dark mode sudah didefinisikan penuh** (`.dark` block di globals.css) dengan token terpisah, bukan sekadar invert warna — baik.

## UX Audit

- Struktur navigasi sesuai brief: Home, Tentang Kami, Layanan, Portfolio, Kemitraan, Keunggulan, FAQ, Kontak (perlu dikonfirmasi label persis di `Navbar.tsx` pada Phase 2, belum dibaca detail di audit ini).
- CTA konsultasi konsisten satu label ("Konsultasi Sekarang") dan satu sumber nomor WhatsApp di [src/lib/whatsapp.ts](../src/lib/whatsapp.ts) + [src/constants/company.ts](../src/constants/company.ts) — bagus, tidak ada nomor hardcoded tersebar.
- Ada 3 nomor WhatsApp berbeda by-context (main, partnership, portfolio) — perlu dipastikan pengunjung tidak bingung nomor mana yang aktif untuk kebutuhan apa; sebaiknya didokumentasikan eksplisit di UX copy (misalnya label kecil di dekat CTA yang menyebut "tim kemitraan" vs "tim konsultasi").
- Portfolio punya filter kategori (Tabs berbasis Radix) — accessible by default lewat Radix, baik.
- `FloatingCta`, `ScrollToTop`, `ScrollProgress`, dan `SmoothScroll` semuanya aktif bersamaan di [layout.tsx](../src/app/layout.tsx) — ini kombinasi 4 elemen mengambang/global sekaligus. Perlu dicek pada Phase 2 apakah tidak saling tumpang tindih di mobile (terutama FloatingCta vs ScrollToTop di pojok yang sama).

## Visual Audit (temuan utama — anti-slop)

### V1. Dot/grid decorative background di HAMPIR SEMUA section
Grep atas 15 file section menunjukkan pola `bg-pattern-{dots,grid,cross}` muncul di **13 dari 14 section berkonten** (Hero, About, Services, WhyChooseUs, Stats, ProductionCapacity, GrowthPlan, Portfolio, Partnership, Coverage, SocialProof, Process, Faq, Contact). Ini persis pola yang ditandai skill `design-taste-frontend` sebagai AI-tell ("grid dots pada setiap background" — dilarang kecuali dibatasi 1-2 area sebagai identitas teknis). Saat ini pola dipakai di praktis SEMUA section, sehingga terasa seperti template berulang, bukan detail yang disengaja.
**Rekomendasi Phase 2:** pilih 2-3 section saja yang benar-benar butuh tekstur (misalnya Hero dan satu section teknis/production), hapus di sisanya, ganti dengan whitespace atau border tipis.

### V2. Section header eyebrow muncul di 12 dari 14 section
`SectionHeader.tsx` mewajibkan prop `eyebrow` dan selalu merender sebagai badge di atas judul. Hampir semua entri di `content.ts` menyertakan field `eyebrow` (Company Overview, Layanan, Infrastructure, Portfolio, Kemitraan, Strategic Growth, Keunggulan, Alur Kerja, Coverage, Social Proof, FAQ, Kontak). Ini jauh melebihi batas anti-slop "maksimal 1 eyebrow per 3 section" — di sini rasionya hampir 1:1.
**Rekomendasi Phase 2:** buat `eyebrow` opsional di `SectionHeaderProps`, dan hanya tampilkan pada section yang benar-benar butuh kategori tambahan (misalnya Portfolio untuk filter, atau FAQ). Section lain cukup judul saja.

### V3. Grid 3-kolom kartu berulang di banyak section
`grid-cols-3` / `lg:grid-cols-3` dipakai di Services, WhyChooseUs, Stats, Portfolio, dan tab Partnership — pola "tiga kartu sejajar" yang persis dilarang skill sebagai default layout family. Section-section ini secara struktural nyaris identik (header center + grid 3 kolom kartu rounded), meski kontennya berbeda.
**Rekomendasi Phase 2:** terapkan minimal 5-6 keluarga layout berbeda sesuai skill (asymmetric split, editorial statement, horizontal strip, alternating case study, timeline, dll.) — jangan biarkan section-section ini punya "bentuk" yang sama persis.

### V4. Header section rata-tengah secara default
`SectionHeader` default `align="center"`; hanya About, Faq, dan Coverage yang override ke `align="left"`. 9 dari 12 section pengguna `SectionHeader` memakai center alignment — sesuai temuan skill "jangan menaruh semua heading di tengah."
**Rekomendasi Phase 2:** variasikan alignment sesuai komposisi tiap section, terutama section dengan asset visual di sampingnya.

### V5. Hero sudah diperbaiki sebagian (sesi sebelumnya)
Pill overlay di atas foto hero dan scroll-cue dot animasi sudah dihapus pada sesi redesign sebelumnya (lihat riwayat perubahan `HeroSection.tsx`). Pola serupa (badge/pill di atas foto langsung) tidak ditemukan berulang di section lain berdasarkan grep, tapi perlu verifikasi visual manual pada Phase 2 untuk Portfolio card (category badge di atas image — ini legitimate use-case sesuai `DESIGN.md`, bukan pelanggaran, karena berfungsi sebagai filter label, bukan dekorasi kosong).

## Technical Audit

- **Build bersih**: `npm run build` sukses tanpa error TypeScript maupun error build (Next.js 16.2.6, Turbopack, static export ke 7 halaman termasuk `/portfolio`, `sitemap.xml`, `robots.txt`).
- **Struktur project modular dan wajar** — tidak ada file section yang membengkak jadi ribuan baris; data (`content.ts`, `company.ts`, `types.ts`) terpisah dari presentasi.
- **Bug JSON-LD ditemukan**: di [layout.tsx](../src/app/layout.tsx) ada **dua entry `@type: "WebSite"` dengan `@id` yang identik** (`${company.siteUrl}/#website`) di dalam `@graph` yang sama — satu di baris awal graph, satu lagi di akhir dengan `potentialAction` SearchAction. Duplikasi `@id` pada JSON-LD berisiko membuat Google mengambil salah satu secara tidak konsisten atau menganggap schema ambigu. **Perlu digabung jadi satu entry WebSite.**
- **Dependency wajar**: tidak ada GSAP meski beberapa skill reference menyebutnya; Motion (Framer) dipakai konsisten. `lucide-react` dipakai untuk semua icon (bukan hand-rolled SVG) — sesuai praktik baik.
- **4 elemen global mengambang sekaligus** (`FloatingCta`, `ScrollToTop`, `ScrollProgress`, `SmoothScroll`) — potensi z-index/posisi tumpang tindih di mobile, perlu verifikasi visual.
- **Test artifact stale**: ada `test-results/` dengan `error-context.md` dari run Playwright sebelumnya — kemungkinan sisa debugging, aman dihapus setelah dikonfirmasi tidak dibutuhkan.

## Preservation List (wajib dipertahankan tanpa persetujuan eksplisit)

- Nama perusahaan, nama pendek (MKI), tagline, tahun berdiri (2018)
- Semua nomor WhatsApp/telepon, email, alamat di [company.ts](../src/constants/company.ts)
- Navigation labels (Home, Tentang Kami, Layanan, Portfolio, Kemitraan, Keunggulan, FAQ, Kontak)
- Struktur form kontak (field: Nama, Nomor WhatsApp, Kategori kebutuhan, Lokasi project, Pesan)
- Data statistik bisnis (4.048+ project, 23 workshop, 150+ tenaga ahli, 156 personel, 2.690m kapasitas, 28 kota, 3 provinsi) — semua konsisten antar-section, tidak ditemukan konflik angka
- Logo MKI dan warna aksen orange sebagai primary accent
- URL routing (`/`, `/portfolio`) dan anchor section
