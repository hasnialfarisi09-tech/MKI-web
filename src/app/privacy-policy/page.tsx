import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/constants/company";
import { 
  ShieldCheck, 
  Bell, 
  HardDrive, 
  MapPin, 
  Wifi, 
  Lock, 
  Mail, 
  Building2, 
  ArrowLeft 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) | Estimasi Biaya MKI",
  description:
    "Kebijakan Privasi aplikasi Estimasi Biaya dan platform PT Menuju Keindahan Indonesia (MKI). Penjelasan transparansi pengumpulan, penggunaan, dan perlindungan data pengguna.",
  alternates: {
    canonical: `${company.siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: "Kebijakan Privasi (Privacy Policy) | Estimasi Biaya MKI",
    description:
      "Kebijakan Privasi resmi aplikasi Estimasi Biaya dan platform PT Menuju Keindahan Indonesia.",
    url: `${company.siteUrl}/privacy-policy`,
    siteName: company.name,
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "8 Oktober 2026";

  return (
    <div className="min-h-screen bg-background text-foreground py-16 md:py-24">
      <div className="container max-w-4xl px-4 sm:px-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header Section */}
        <header className="border-b border-border pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <ShieldCheck className="size-4" />
            <span>Dokumen Resmi & Transparansi Pengguna</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-serif">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Aplikasi: <strong className="text-foreground">Estimasi Biaya (Kalkulator Interior MKI)</strong> | Package ID: <code className="bg-muted px-2 py-0.5 rounded text-xs">id.mki.kalkulatorinterior</code>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Terakhir Diperbarui: {lastUpdated} | Dikelola oleh: <strong>{company.name}</strong>
          </p>
        </header>

        {/* Content Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-sm sm:text-base leading-relaxed text-muted-foreground">
          
          {/* Pendahuluan */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              1. Pendahuluan
            </h2>
            <p>
              Selamat datang di aplikasi <strong>Estimasi Biaya</strong> yang dikembangkan dan dioperasikan oleh <strong>{company.name}</strong> (&quot;MKI&quot;, &quot;kami&quot;, atau &quot;perusahaan&quot;).
              Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi seluruh informasi yang berkaitan dengan penggunaan aplikasi mobile Android dan layanan website kami.
            </p>
            <p>
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, serta menjaga keamanan data saat Anda mengoperasikan aplikasi Estimasi Biaya baik dalam mode online maupun offline.
            </p>
          </section>

          {/* Data yang Kami Kumpulkan */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              2. Data dan Informasi yang Dikumpulkan
            </h2>
            <p>
              Aplikasi Estimasi Biaya dirancang dengan prinsip minimasi data (<em>data minimization</em>). Kami memprioritaskan privasi pengguna dengan tidak memungut data sensitif pribadi secara otomatis:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 mt-4 not-prose">
              <div className="p-4 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-1.5">
                  <HardDrive className="size-4 text-primary" />
                  Data Simulasi Proyek
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dimensi ukuran ruang, tipe furnitur, pilihan bahan baku (finishing & hardware). Data ini disimpan secara <strong>lokal di memori perangkat Anda</strong> dan tidak diunggah ke server publik kami tanpa persetujuan Anda.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-1.5">
                  <Mail className="size-4 text-primary" />
                  Data Kontak Sukarela
                </h3>
                <p className="text-xs text-muted-foreground">
                  Nama atau nomor WhatsApp yang Anda masukkan saat memilih untuk melanjutkan konsultasi resmi atau mencetak penawaran harga RAB secara langsung ke tim workshop MKI.
                </p>
              </div>
            </div>
          </section>

          {/* Izin Perangkat Android */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              3. Penggunaan Izin Perangkat Android (Permissions)
            </h2>
            <p>
              Aplikasi memerlukan izin perangkat tertentu untuk mengoperasikan fitur inti secara optimal. Anda memiliki kendali penuh untuk mengaktifkan atau menonaktifkan izin ini melalui Pengaturan Perangkat Anda kapan saja:
            </p>

            <div className="space-y-3 mt-4 not-prose">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Notifikasi (POST_NOTIFICATIONS)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Digunakan pada Android 13+ untuk menampilkan pemberitahuan status bar resmi ketika tersedia versi aplikasi baru atau saat katalog tarif material Google Sheets workshop diperbarui.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Wifi className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Akses Jaringan & Internet (INTERNET & ACCESS_NETWORK_STATE)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Digunakan untuk menyinkronkan data katalog harga workshop terkini dari spreadsheet resmi secara berkala dan memeriksa ketersediaan pembaruan sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <HardDrive className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Penyimpanan Perangkat (Storage)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Digunakan untuk menyimpan salinan file dokumen PDF rincian estimasi biaya (RAB) yang Anda unduh langsung ke memori internal ponsel.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border">
                <div className="size-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Lokasi (ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION - Opsional)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Digunakan secara opsional untuk membantu menghitung estimasi jarak pengiriman material dari workshop terdekat MKI ke lokasi proyek Anda. Aplikasi <strong>tidak pernah</strong> melacak koordinat lokasi Anda di latar belakang (background location).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Layanan Pihak Ketiga */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              4. Layanan Pihak Ketiga
            </h2>
            <p>
              Untuk mendukung ketersediaan data secara akurat, aplikasi memanfaatkan layanan pihak ketiga berikut:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google Sheets / Apps Script:</strong> Digunakan untuk mengambil data katalog material publik secara berkala tanpa menyertakan pengidentifikasi pribadi Anda.
              </li>
              <li>
                <strong>WhatsApp Messenger:</strong> Digunakan sebagai jembatan komunikasi eksternal sukarela apabila Anda menekan tombol konsultasi langsung ke customer support workshop MKI.
              </li>
              <li>
                <strong>Google Play Services:</strong> Digunakan untuk distribusi aplikasi dan manajemen update resmi melalui Google Play Store.
              </li>
            </ul>
          </section>

          {/* Keamanan & Penyimpanan */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              5. Keamanan Data & Penyimpanan
            </h2>
            <p>
              Kami mengutamakan keamanan seluruh informasi pengguna dengan menerapkan enkripsi standar industri (HTTPS/TLS) untuk seluruh komunikasi jaringan. 
              Data simulasi kalkulasi disimpan secara lokal di ruang penyimpanan pribadi aplikasi Anda. Anda dapat menghapus seluruh data simulasi kapan saja dengan melakukan <em>Clear Cache / Clear Data</em> melalui Setelan Aplikasi Android Anda.
            </p>
          </section>

          {/* Privasi Anak */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              6. Kebijakan Privasi Anak
            </h2>
            <p>
              Layanan dan aplikasi kami ditujukan untuk audiens umum, pemilik properti, konsultan, dan praktisi industri interior yang berusia 18 tahun ke atas. Kami tidak secara sengaja mengumpulkan atau meminta data pribadi dari anak-anak di bawah usia 13 tahun.
            </p>
          </section>

          {/* Hak Pengguna */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              7. Hak Pengguna & Penghapusan Data
            </h2>
            <p>
              Sesuai ketentuan perlindungan data pribadi yang berlaku, Anda memiliki hak untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Menolak atau mencabut izin perangkat (notifikasi, lokasi, penyimpanan) melalui setelan ponsel Anda.</li>
              <li>Menghapus seluruh riwayat kalkulasi yang tersimpan di perangkat Anda kapan saja.</li>
              <li>Meminta penghapusan data kontak konsultasi yang pernah Anda kirimkan kepada kami melalui email resmi perusahaan.</li>
            </ul>
          </section>

          {/* Pembaruan Kebijakan */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
              8. Pembaruan Kebijakan Privasi
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk menyesuaikan dengan penambahan fitur atau regulasi hukum yang berlaku. Segala perubahan akan dipublikasikan secara langsung pada halaman ini dengan tanggal pembaruan yang diperbarui.
            </p>
          </section>

          {/* Kontak Resmi */}
          <section className="p-6 rounded-3xl bg-muted/30 border border-border not-prose">
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              9. Kontak Resmi Pengembang & Perusahaan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Jika Anda memiliki pertanyaan, masukan, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi kami melalui saluran resmi berikut:
            </p>

            <div className="mt-4 space-y-2 text-xs sm:text-sm text-foreground">
              <p>
                <strong>Entitas:</strong> {company.name} ({company.shortName})
              </p>
              <p>
                <strong>Alamat Kantor & Workshop:</strong> {company.address}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${company.email}`} className="text-primary hover:underline font-medium">
                  {company.email}
                </a>
              </p>
              <p>
                <strong>Telepon / WhatsApp:</strong>{" "}
                <span className="font-medium">{company.phone}</span>
              </p>
              <p>
                <strong>Website Resmi:</strong>{" "}
                <a href={company.siteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                  {company.siteUrl}
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
