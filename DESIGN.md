# DESIGN.md — PT Menuju Keindahan Indonesia Website

## 1. Project Overview

Buat desain landing page / company profile statis untuk:

**PT MENUJU KEINDAHAN INDONESIA**  
Short name: **MKI**

Website ini harus menampilkan MKI sebagai perusahaan interior, manufaktur interior, workshop produksi, partner eksekusi project interior, dan partner kemitraan untuk arsitek, agensi, serta influencer.

### Brand Positioning

**Interior Manufacturing & Execution Partner**

### Main Goal

Membuat website company profile yang:

- Modern
- Premium
- Profesional
- Responsive
- Mudah dipahami
- High-converting
- Terlihat seperti perusahaan interior besar
- Cocok untuk customer umum, arsitek, agensi, influencer, dan mitra bisnis

---

## 2. Target Audience

### 1. Customer Umum

Orang yang ingin membuat interior custom seperti kitchen set, bedroom, living room, wardrobe, dan area bawah tangga.

### 2. Arsitek

Arsitek yang membutuhkan partner produksi dan instalasi interior agar desain bisa dieksekusi dengan presisi, rapi, dan sesuai konsep.

### 3. Agensi

Agensi yang membutuhkan infrastruktur produksi interior, sistem workshop, dan eksekusi project yang scalable.

### 4. Influencer / Content Creator

Influencer yang ingin membangun bisnis interior dengan dukungan manufaktur riil, workshop aktif, dan sistem kemitraan.

### 5. Partner Bisnis

Mitra yang ingin melihat kredibilitas, kapasitas produksi, portfolio, dan potensi kolaborasi MKI.

---

## 3. Design Direction

### Visual Mood

Desain harus terasa:

- Premium interior
- Modern corporate
- Clean
- High-end
- Terstruktur
- Terpercaya
- Scalable business
- Eksklusif namun tetap mudah dipahami

### Jangan Buat Seperti

- Toko furniture biasa
- Website template murahan
- Terlalu ramai warna
- Terlalu banyak animasi
- Terlalu padat teks
- Terlalu playful

### Gunakan Gaya

- White space luas
- Layout grid rapi
- Card rounded besar
- Shadow lembut
- Visual interior besar
- Aksen geometric orange seperti identitas MKI
- Tipografi besar dan clean
- CTA jelas

---

## 4. Color Palette

Gunakan warna utama berikut:

```css
--primary-orange: #E85D04;
--deep-red-orange: #C7351A;
--dark-charcoal: #1F2933;
--dark-navy: #111827;
--soft-gray: #F5F5F4;
--medium-gray: #6B7280;
--border-gray: #E5E7EB;
--white: #FFFFFF;
```

### Color Usage

- **Primary Orange** untuk CTA, icon highlight, badge, dan aksen visual.
- **Deep Red Orange** untuk gradient, hover state, dan accent block.
- **Dark Charcoal** untuk heading dan teks utama.
- **Soft Gray** untuk background section.
- **White** untuk card dan background utama.
- **Medium Gray** untuk body text dan deskripsi.

### Gradient Recommendation

```css
background: linear-gradient(135deg, #E85D04 0%, #C7351A 100%);
```

Gunakan gradient hanya untuk CTA, badge khusus, atau aksen visual. Jangan berlebihan.

---

## 5. Typography

Gunakan font modern:

- **Inter**
- **Plus Jakarta Sans**
- Atau sans-serif premium yang clean

### Typography Scale

```css
Display / Hero: 56px - 72px desktop, 38px - 44px mobile
Section Title: 40px - 48px desktop, 30px - 36px mobile
Card Title: 20px - 24px
Body: 16px - 18px
Small Text: 14px
Badge: 12px - 14px uppercase
```

### Typography Style

- Heading bold, kuat, dan mudah dibaca.
- Body text jangan terlalu kecil.
- Gunakan line-height luas agar premium.
- Jangan gunakan font dekoratif.

---

## 6. Layout System

### Container

```css
max-width: 1200px;
margin: 0 auto;
padding-left: 24px;
padding-right: 24px;
```

### Section Spacing

```css
padding-top: 96px;
padding-bottom: 96px;
```

Mobile:

```css
padding-top: 64px;
padding-bottom: 64px;
```

### Grid

- Desktop: 12-column feel
- Tablet: 2-column
- Mobile: 1-column
- Gunakan gap besar: 24px - 40px

### Border Radius

```css
--radius-card: 24px;
--radius-button: 999px;
--radius-image: 28px;
```

### Shadow

Gunakan shadow lembut:

```css
box-shadow: 0 20px 50px rgba(17, 24, 39, 0.08);
```

---

## 7. Page Structure

Buat **single page landing page** dengan section berikut:

1. Navbar
2. Hero Section
3. Stats Section
4. About Section
5. Services Section
6. Portfolio Section
7. Partnership Section
8. Why Choose Us Section
9. Process Section
10. Coverage Section
11. Client / Social Proof Section
12. FAQ Section
13. Contact Section
14. Footer

---

# 8. Section Design Detail

---

## 8.1 Navbar

### Goal

Membuat navigasi website yang jelas, premium, dan mudah digunakan.

### Content

Menu:

- Home
- Tentang Kami
- Layanan
- Portfolio
- Kemitraan
- Keunggulan
- FAQ
- Kontak

CTA Button:

**Konsultasi Sekarang**

### Design

- Sticky navbar di atas.
- Background putih dengan sedikit blur.
- Logo MKI di kiri.
- Menu di tengah atau kanan.
- CTA di kanan.
- Mobile gunakan hamburger menu.
- Navbar height sekitar 72px - 80px.
- Border bawah tipis warna gray.

### Mobile

- Logo kiri.
- Hamburger kanan.
- Saat dibuka tampil menu vertical dengan CTA besar.
- Menu harus mudah diklik.

---

## 8.2 Hero Section

### Goal

Membuat first impression yang kuat dan langsung menjelaskan value MKI.

### Badge

**Since 2018**

### Headline

**Bangun Interior Premium dengan Sistem Produksi Terstruktur**

### Subheadline

PT Menuju Keindahan Indonesia membantu klien, arsitek, agensi, dan influencer merealisasikan project interior dengan dukungan workshop aktif, tenaga ahli, kontrol kualitas, dan sistem produksi yang terstandarisasi.

### CTA

Primary CTA:

**Konsultasi Sekarang**

Secondary CTA:

**Lihat Portfolio**

### Visual

Gunakan visual:

- Interior premium
- Workshop produksi
- Detail furniture custom
- Ruang dapur / bedroom / living room modern

### Design Direction

- Layout 2 kolom desktop.
- Kiri: headline, subheadline, CTA, mini stats.
- Kanan: image besar dengan rounded corner.
- Tambahkan elemen geometris orange ala brand MKI.
- Background putih atau soft gray.
- Hero harus terlihat luas, premium, dan meyakinkan.

### Mini Stats di Hero

Tampilkan kecil di bawah CTA:

- 4048+ Project
- 13+ Workshop
- 150+ Tenaga Ahli

---

## 8.3 Stats Section

### Goal

Membangun trust dengan angka kredibilitas.

### Data

- **4048+** Total Project
- **62+** Account / Mitra
- **13+** Workshop Aktif
- **150+** Tenaga Ahli
- **28 Kota** Jangkauan Project
- **3 Provinsi** Area Operasional

### Design

- Card grid 3 kolom desktop.
- 2 kolom tablet.
- 1 kolom mobile.
- Angka besar warna orange atau charcoal.
- Label jelas.
- Deskripsi singkat.
- Gunakan icon minimalis line style.

### Icon Suggestion

- Building2
- Hammer
- Users
- MapPin
- CheckCircle
- Factory

---

## 8.4 About Section

### Title

**Tentang PT Menuju Keindahan Indonesia**

### Copy

Sejak 2018, MKI membangun sistem bisnis interior berbasis produksi terstruktur dengan standar kualitas premium. Fokus perusahaan bukan hanya mengerjakan project, tetapi membangun sistem eksekusi yang efisien, terukur, dan siap mendukung kebutuhan residential, komersial, arsitek, agensi, influencer, serta mitra bisnis.

### Highlight Points

- Sistem produksi terstruktur
- Kontrol kualitas premium
- Workshop aktif
- Tenaga ahli berpengalaman
- Eksekusi project lebih efisien

### Design

- Layout dua kolom.
- Kiri: image workshop / produksi / interior.
- Kanan: teks about + highlight checklist.
- Gunakan card kecil untuk highlight.
- Tambahkan label kecil: **Company Overview**

---

## 8.5 Services Section

### Title

**Layanan Interior Kami**

### Subtitle

Solusi interior custom untuk kebutuhan residential, komersial, dan project kemitraan dengan standar produksi terstruktur.

### Services

#### 1. Kitchen Set

Interior dapur custom modern, rapi, fungsional, dan premium.

#### 2. Bedroom Interior

Interior kamar tidur custom, headboard, backdrop, storage, dan furniture built-in.

#### 3. Living Room

Backdrop TV, wall panel, cabinet display, dan interior ruang keluarga premium.

#### 4. Wardrobe

Lemari pakaian custom, walk-in closet, dan storage system.

#### 5. Under The Stairs

Pemanfaatan area bawah tangga menjadi storage, cabinet, atau display fungsional.

### Design

- Card grid.
- Card rounded 2xl.
- Icon line modern.
- Hover effect: card naik sedikit dan shadow lebih kuat.
- Gunakan nomor kecil atau icon di atas card.
- Jangan terlalu banyak teks.

---

## 8.6 Portfolio Section

### Title

**Portfolio Interior**

### Subtitle

Beberapa kategori interior yang menjadi fokus produksi dan eksekusi MKI.

### Filter Tabs

- All
- Kitchen Set
- Bedroom
- Living Room
- Wardrobe
- Under The Stairs

### Card Content

Setiap card berisi:

- Image
- Category badge
- Project title
- Short description

### Example Project Title

- Modern Kitchen Set
- Premium Bedroom Interior
- Living Room Backdrop
- Custom Wardrobe
- Under Stairs Storage

### Design

- Image grid besar.
- Rounded image.
- Hover zoom halus.
- Overlay gradient tipis.
- Category badge di atas image.
- CTA bawah: **Lihat Semua Portfolio**

### Interaction

Jika ada preview, gunakan modal style untuk detail image.

---

## 8.7 Partnership Section

### Title

**Kemitraan Strategis MKI**

### Subtitle

MKI tidak hanya melayani customer umum, tetapi juga menjadi partner produksi dan eksekusi untuk arsitek, agensi, influencer, dan mitra bisnis.

### Layout Option

Gunakan tabs atau 3 large cards.

### Card 1 — Architect

#### Label

**Untuk Arsitek**

#### Headline

**Partner Eksekusi Interior untuk Arsitek**

#### Description

MKI membantu arsitek merealisasikan desain menjadi hasil akhir yang presisi, rapi, dan sesuai konsep.

#### Points

- Produksi dan instalasi sesuai konsep
- Kontrol kualitas terstandarisasi
- Tenaga ahli berpengalaman
- Cocok untuk residential dan komersial

---

### Card 2 — Agency

#### Label

**Untuk Agensi**

#### Headline

**Partner Infrastruktur Skala Agensi**

#### Description

MKI mendukung agensi dengan sistem produksi, workshop aktif, dan kualitas terstandarisasi untuk membantu konversi project dari jaringan bisnis.

#### Points

- Infrastruktur produksi scalable
- Proteksi reputasi talent
- Kapasitas produksi besar
- Efisiensi operasional

---

### Card 3 — Influencer

#### Label

**Untuk Influencer**

#### Headline

**Partner Pertumbuhan Skala Nasional**

#### Description

MKI membantu influencer membangun bisnis interior dengan dukungan produksi nyata, sistem kemitraan, dan kontrol kualitas.

#### Points

- Membangun otoritas brand
- Dukungan workshop aktif
- Sistem exclusive area
- Pertumbuhan bisnis terukur

### Design

- Buat section ini menonjol.
- Bisa gunakan background dark charcoal.
- Card putih atau dark card dengan border orange.
- Gunakan CTA: **Ajukan Kemitraan**

---

## 8.8 Why Choose Us Section

### Title

**Mengapa Memilih MKI?**

### Features

#### 1. Sistem Produksi Terstruktur

Setiap project berjalan dengan alur kerja yang jelas agar hasil lebih rapi, konsisten, dan sesuai spesifikasi.

#### 2. Kontrol Kualitas Premium

Setiap proses dikontrol agar hasil akhir tetap stabil dari produksi sampai pemasangan.

#### 3. Jaringan Workshop Aktif

Dukungan workshop aktif membantu pengerjaan project lebih scalable dan efisien.

#### 4. Tenaga Ahli Berpengalaman

Didukung tenaga produksi, finishing, dan instalasi yang terbiasa menangani project interior.

#### 5. Eksekusi Lebih Efisien

Koordinasi kerja yang baik membantu mempercepat proses tanpa mengorbankan kualitas.

#### 6. Siap untuk Kemitraan

Sistem MKI cocok untuk arsitek, agensi, influencer, dan pengembangan bisnis interior.

### Design

- 6 feature cards.
- 3 kolom desktop.
- 2 kolom tablet.
- 1 kolom mobile.
- Gunakan icon modern dan accent orange kecil.

---

## 8.9 Process Section

### Title

**Alur Kerja Project**

### Subtitle

Setiap project dikerjakan melalui alur yang jelas agar hasil akhir lebih terukur, rapi, dan sesuai kebutuhan.

### Steps

1. Konsultasi kebutuhan
2. Survey lokasi
3. Pengukuran dan analisis ruang
4. Desain atau validasi desain
5. Penawaran dan persetujuan
6. Produksi workshop
7. Quality control
8. Pengiriman dan instalasi
9. Final checking
10. Serah terima project

### Design

Desktop:

- Timeline horizontal atau step cards 5 + 5.
- Gunakan nomor step besar.
- Garis penghubung halus.

Mobile:

- Vertical timeline.
- Setiap step dalam card kecil.

---

## 8.10 Coverage Section

### Title

**Jangkauan Operasional**

### Copy

MKI memiliki rekam jejak project di berbagai kota dan didukung jaringan workshop aktif untuk menjaga kapasitas pengerjaan, efisiensi produksi, dan kualitas hasil akhir.

### Highlight Data

- 28 Kota
- 3 Provinsi
- 13+ Workshop Aktif
- Dukungan jaringan produksi dan instalasi

### Design

- Gunakan abstract map Indonesia atau visual area.
- Tambahkan card data di samping map.
- Background soft gray.
- Accent orange pada titik lokasi.

---

## 8.11 Client / Social Proof Section

### Title

**Dipercaya Berbagai Mitra dan Klien**

### Copy

Kolaborasi, inovasi, dan pertumbuhan menjadi fondasi MKI dalam membangun ekosistem interior yang berkelanjutan.

### Design

- Logo carousel atau grid logo.
- Logo dibuat grayscale.
- Background putih / soft gray.
- Jangan terlalu ramai.
- Buat terlihat seperti social proof premium.

---

## 8.12 FAQ Section

### Title

**Pertanyaan yang Sering Diajukan**

### Style

Gunakan accordion clean.

### FAQ Items

#### Q: Apakah MKI melayani custom interior?

A: Ya, MKI melayani kebutuhan interior custom seperti kitchen set, bedroom, living room, wardrobe, dan area bawah tangga.

#### Q: Apakah bisa bekerja sama dengan arsitek?

A: Ya, MKI dapat menjadi partner eksekusi interior untuk membantu arsitek merealisasikan desain ke tahap produksi dan instalasi.

#### Q: Apakah MKI menerima kemitraan agensi atau influencer?

A: Ya, MKI memiliki konsep kemitraan untuk agensi dan influencer dengan dukungan workshop, sistem produksi, dan kontrol kualitas.

#### Q: Apakah bisa survey lokasi?

A: Ya, alur project dapat dimulai dari konsultasi dan survey lokasi.

#### Q: Area mana saja yang dilayani?

A: MKI memiliki jangkauan project di berbagai kota dan didukung jaringan workshop aktif.

---

## 8.13 Contact Section

### Title

**Mulai Project Interior Anda Bersama MKI**

### Subtitle

Konsultasikan kebutuhan interior atau kemitraan Anda bersama tim MKI.

### Form Fields

- Nama
- Nomor WhatsApp
- Kategori kebutuhan
- Lokasi project
- Pesan

### Category Options

- Kitchen Set
- Bedroom Interior
- Living Room
- Wardrobe
- Under The Stairs
- Kemitraan Arsitek
- Kemitraan Agensi
- Kemitraan Influencer
- Lainnya

### CTA

**Kirim via WhatsApp**

### Contact Info Card

Tampilkan:

- WhatsApp
- Email
- Alamat
- Instagram

### Design

- Form card putih dengan shadow lembut.
- Contact info di card gelap / orange accent.
- CTA besar dan jelas.
- Background section boleh dark charcoal agar terlihat premium.

---

## 8.14 Footer

### Content

- Logo MKI
- Deskripsi singkat perusahaan
- Quick links
- Layanan
- Kemitraan
- Kontak
- Social media
- Copyright

### Footer Description

PT Menuju Keindahan Indonesia adalah perusahaan interior berbasis sistem produksi terstruktur untuk mendukung kebutuhan residential, komersial, arsitek, agensi, influencer, dan mitra bisnis.

### Design

- Background dark charcoal.
- Text putih dan gray.
- Accent orange.
- Footer clean dan tidak terlalu tinggi.

---

# 9. Component Style Guide

## Button

### Primary Button

- Background orange gradient.
- Text putih.
- Rounded full.
- Padding horizontal besar.
- Hover sedikit naik / shadow.
- Gunakan untuk CTA utama.

### Secondary Button

- Background putih.
- Border gray / charcoal.
- Text charcoal.
- Rounded full.
- Hover background soft gray.

## Card

- Background white.
- Border 1px solid #E5E7EB.
- Border radius 24px.
- Padding 24px - 32px.
- Shadow halus.
- Hover: translateY(-4px).

## Badge

- Background orange soft.
- Text orange / red orange.
- Rounded full.
- Uppercase small.
- Letter spacing sedikit.

## Image

- Rounded 28px.
- Object cover.
- Gunakan overlay gradient tipis jika di atasnya ada teks.
- Optimalkan crop agar terlihat premium.

---

# 10. Responsive Rules

## Desktop

- Hero 2 kolom.
- Service 3 kolom.
- Feature 3 kolom.
- Portfolio 3 kolom.
- Partnership 3 card atau tabs lebar.
- Timeline horizontal.

## Tablet

- Hero bisa 2 kolom atau stacked.
- Service 2 kolom.
- Feature 2 kolom.
- Portfolio 2 kolom.

## Mobile

- Semua section stacked 1 kolom.
- Heading lebih kecil.
- Button full width jika perlu.
- Navbar jadi hamburger.
- Timeline vertical.
- Portfolio 1 kolom.
- Jangan ada text terlalu kecil.

---

# 11. Animation Direction

Gunakan animasi halus saja:

- Hero fade-in.
- Section reveal on scroll.
- Card hover naik sedikit.
- Button hover scale 1.02.
- Portfolio image hover zoom 1.05.
- Logo carousel smooth.

Jangan gunakan animasi berat atau terlalu banyak.

---

# 12. Design Quality Checklist

Pastikan desain memenuhi:

- Terlihat premium dan profesional.
- Mudah dipahami dalam 5 detik pertama.
- CTA jelas.
- Data statistik mudah terlihat.
- Portfolio visual dominan.
- Section kemitraan kuat.
- Mobile responsive.
- Tidak terlalu ramai.
- Warna orange hanya sebagai aksen.
- Banyak whitespace.
- Layout konsisten.
- Typography rapi.
- Cocok dikembangkan ke Next.js + Tailwind CSS + shadcn/ui.

---

# 13. Final Prompt for Stitch AI

Gunakan instruksi berikut sebagai ringkasan utama:

```text
Create a premium, modern, responsive company profile landing page for PT Menuju Keindahan Indonesia, also known as MKI.

MKI is an interior manufacturing and execution partner focused on custom interior, structured production, active workshops, project execution, and strategic partnerships for architects, agencies, influencers, and business partners.

Design style: modern corporate, premium interior, clean, elegant, trustworthy, high-end, structured, and scalable. Use lots of whitespace, strong visual hierarchy, large interior visuals, rounded cards, soft shadows, and subtle orange geometric accents inspired by MKI branding.

Color palette:
Primary orange #E85D04, deep red orange #C7351A, dark charcoal #1F2933, dark navy #111827, soft gray #F5F5F4, white #FFFFFF.

Typography:
Use Inter or Plus Jakarta Sans. Large bold headings, clean readable body text.

Create a full single-page landing page with these sections:
1. Sticky navbar with logo, menu, and CTA.
2. Hero section with the headline “Bangun Interior Premium dengan Sistem Produksi Terstruktur”, subheadline, CTA buttons, and premium interior/workshop visual.
3. Stats section with 4048+ total project, 62+ account/mitra, 13+ workshop aktif, 150+ tenaga ahli, 28 kota, and 3 provinsi.
4. About section explaining MKI since 2018 as a structured interior production company.
5. Services section: Kitchen Set, Bedroom Interior, Living Room, Wardrobe, Under The Stairs.
6. Portfolio gallery with category tabs and premium image cards.
7. Partnership section for Architect, Agency, and Influencer.
8. Why Choose Us section with 6 feature cards.
9. Process timeline from consultation to handover.
10. Coverage section showing 28 cities, 3 provinces, and 13+ workshops.
11. Client/social proof logo carousel.
12. FAQ accordion.
13. Contact section with WhatsApp form.
14. Premium dark footer.

The design must look like a serious premium interior company website, not a basic furniture shop. Make it clean, high-converting, responsive, and ready to be implemented in Next.js, Tailwind CSS, and shadcn/ui.
```

---

# 14. Notes for Developer Handoff

Desain ini harus mudah diterjemahkan ke stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Motion
- Embla Carousel
- Static export untuk Hostinger shared hosting

