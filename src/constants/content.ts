import { siteImages } from "@/assets/images";
import type {
  CoverageCity,
  FaqItem,
  FeatureItem,
  GrowthPillar,
  LogoItem,
  PartnershipItem,
  PortfolioCategory,
  PortfolioItem,
  ProcessStep,
  ProductionMetric,
  ServiceItem,
  StatItem,
  WorkshopItem,
} from "@/constants/types";

export const ctaLabels = {
  consult: "Konsultasi Sekarang",
  portfolio: "Lihat Portfolio",
  partnership: "Ajukan Kemitraan",
  allPortfolio: "Lihat Semua Portfolio",
  sendWhatsApp: "Kirim via WhatsApp",
  location: "Lihat Lokasi",
};

export const heroContent = {
  badge: "Since 2018",
  title: "Wujudkan Interior Premium Terukur",
  description:
    "PT Menuju Keindahan Indonesia membantu klien, arsitek, agensi, dan influencer merealisasikan project interior dengan dukungan workshop aktif, tenaga ahli, kontrol kualitas, dan sistem produksi yang terstandarisasi.",
  imageAlt: "Interior premium modern sebagai representasi project MKI",
  image: siteImages.hero,
  miniStats: [
    { value: "4048+", label: "Project" },
    { value: "23", label: "Workshop" },
    { value: "150+", label: "Tenaga Ahli" },
  ],
};

export const stats: StatItem[] = [
  {
    value: "4048+",
    label: "Total Project",
    description: "Rekam jejak project selesai sejak 2018.",
    icon: "building",
  },
  {
    value: "62+",
    label: "Account / Mitra",
    description: "Kolaborasi aktif dengan berbagai klien dan partner.",
    icon: "users",
  },
  {
    value: "23",
    label: "Workshop Aktif",
    description: "Jaringan produksi aktif untuk kapasitas yang scalable.",
    icon: "factory",
  },
  {
    value: "150+",
    label: "Tenaga Ahli",
    description: "Tim produksi, finishing, dan instalasi berpengalaman.",
    icon: "hammer",
  },
  {
    value: "28 Kota",
    label: "Jangkauan Project",
    description: "Cakupan operasional di berbagai area strategis.",
    icon: "mapPin",
  },
  {
    value: "3 Provinsi",
    label: "Area Operasional",
    description: "Dukungan jaringan pengerjaan lintas wilayah.",
    icon: "checkCircle",
  },
];

export const aboutContent = {
  eyebrow: "Company Overview",
  title: "Tentang PT Menuju Keindahan Indonesia",
  description:
    "Sejak 2018, MKI membangun ekosistem produksi interior yang berfokus pada presisi, efisiensi, dan konsistensi hasil. Rekam jejak 2021-2026 menunjukkan 3.895 project berjalan ditambah 153 project pada Januari-Februari 2026, membentuk total 4.048+ project yang menjadi bukti kapasitas eksekusi MKI.",
  image: siteImages.about,
  imageAlt: "Gedung Putra Corporation sebagai representasi ekosistem produksi dan bisnis MKI",
  highlights: [
    "Sistem produksi dan instalasi terstruktur",
    "Kontrol kualitas dari workshop sampai final checking",
    "23 workshop aktif dengan kapasitas 2.690m/bulan",
    "150+ tenaga ahli produksi, finishing, dan instalasi",
    "Siap mendukung residential, komersial, dan kemitraan",
  ],
};

export const services: ServiceItem[] = [
  {
    title: "Kitchen Set",
    description: "Interior dapur custom modern, rapi, fungsional, dan premium.",
    icon: "utensils",
    details: ["Kabinet atas dan bawah", "Kitchen island", "Storage efisien", "Finishing premium"],
  },
  {
    title: "Bedroom Interior",
    description: "Interior kamar tidur custom, headboard, backdrop, storage, dan furniture built-in.",
    icon: "bed",
    details: ["Headboard custom", "Backdrop panel", "Built-in storage", "Meja rias dan bedside"],
  },
  {
    title: "Living Room",
    description: "Backdrop TV, wall panel, cabinet display, dan interior ruang keluarga premium.",
    icon: "home",
    details: ["Backdrop TV", "Wall panel", "Display cabinet", "Detail pencahayaan"],
  },
  {
    title: "Wardrobe",
    description: "Lemari pakaian custom, walk-in closet, dan storage system.",
    icon: "wardrobe",
    details: ["Walk-in closet", "Modul gantung dan drawer", "Rak aksesori", "Lighting cabinet"],
  },
  {
    title: "Under The Stairs",
    description: "Pemanfaatan area bawah tangga menjadi storage, cabinet, atau display fungsional.",
    icon: "stairs",
    details: ["Shoe rack", "Storage tertutup", "Display shelf", "Cabinet compact"],
  },
];

export const serviceSection = {
  eyebrow: "Layanan",
  title: "Layanan Interior Custom Bandung",
  description:
    "Solusi interior custom untuk kebutuhan residential, komersial, dan project kemitraan. Kitchen set, bedroom, wardrobe, living room, dan area bawah tangga dengan standar produksi terstruktur.",
};

export const productionSection = {
  eyebrow: "Infrastructure",
  title: "Kekuatan Manufaktur MKI",
  description:
    "Data company overview menunjukkan MKI bukan hanya vendor interior, tetapi sistem produksi dengan 23 workshop aktif, kapasitas 2.690m per bulan, 156 personel workshop terdata, dan 150+ tenaga ahli lintas produksi sampai instalasi.",
  summary:
    "Infrastruktur ini membantu menjaga kecepatan eksekusi, konsistensi finishing, distribusi produksi, dan kontrol kualitas untuk project residential, komersial, arsitek, agensi, influencer, serta kemitraan skala besar.",
};

export const productionMetrics: ProductionMetric[] = [
  {
    value: "2.690m",
    label: "Kapasitas Produksi / Bulan",
    description: "Akumulasi kapasitas workshop aktif untuk mendukung volume project besar.",
    icon: "factory",
  },
  {
    value: "23",
    label: "Workshop Aktif",
    description: "Jaringan workshop terintegrasi dengan alur produksi dan instalasi.",
    icon: "building",
  },
  {
    value: "156",
    label: "Personel Workshop Terdata",
    description: "Tim produksi inti dari data workshop company overview.",
    icon: "users",
  },
  {
    value: "150+",
    label: "Tenaga Ahli",
    description: "Tenaga produksi, finishing, instalasi, dan dukungan teknis berpengalaman.",
    icon: "hammer",
  },
];

export const workshopItems: WorkshopItem[] = [
  { group: "Bandung", name: "WS AP", location: "Bandung", capacity: "200 meter/bulan", capacityValue: 200, team: "11 orang", teamValue: 11 },
  { group: "Bandung", name: "WS EG", location: "Bandung", capacity: "70 meter/bulan", capacityValue: 70, team: "5 orang", teamValue: 5 },
  { group: "Bandung", name: "WS EY", location: "Bandung", capacity: "150 meter/bulan", capacityValue: 150, team: "8 orang", teamValue: 8 },
  { group: "Bandung", name: "WS AC", location: "Bandung", capacity: "60 meter/bulan", capacityValue: 60, team: "4 orang", teamValue: 4 },
  { group: "Bandung", name: "WS BA", location: "Bandung", capacity: "100 meter/bulan", capacityValue: 100, team: "7 orang", teamValue: 7 },
  { group: "Bandung", name: "WS IA", location: "Bandung", capacity: "250 meter/bulan", capacityValue: 250, team: "12 orang", teamValue: 12 },
  { group: "Bandung", name: "WS IN", location: "Bandung", capacity: "80 meter/bulan", capacityValue: 80, team: "6 orang", teamValue: 6 },
  { group: "Bandung", name: "WS UN", location: "Bandung", capacity: "150 meter/bulan", capacityValue: 150, team: "7 orang", teamValue: 7 },
  { group: "Bandung", name: "WS BL", location: "Bandung", capacity: "100 meter/bulan", capacityValue: 100, team: "4 orang", teamValue: 4 },
  { group: "Bandung", name: "WS SP", location: "Bandung", capacity: "100 meter/bulan", capacityValue: 100, team: "7 orang", teamValue: 7 },
  { group: "Bandung", name: "WS UP", location: "Bandung", capacity: "50 meter/bulan", capacityValue: 50, team: "5 orang", teamValue: 5 },
  { group: "Bandung", name: "WS BI", location: "Bandung", capacity: "100 meter/bulan", capacityValue: 100, team: "8 orang", teamValue: 8 },
  { group: "Bandung", name: "WS FY", location: "Bandung", capacity: "150 meter/bulan", capacityValue: 150, team: "9 orang", teamValue: 9 },
  { group: "Bali", name: "WS AN", location: "Bali", capacity: "80 meter/bulan", capacityValue: 80, team: "5 orang", teamValue: 5 },
  { group: "Bali", name: "WS IB", location: "Bali", capacity: "150 meter/bulan", capacityValue: 150, team: "6 orang", teamValue: 6 },
  { group: "Bali", name: "WS NO", location: "Bali", capacity: "200 meter/bulan", capacityValue: 200, team: "10 orang", teamValue: 10 },
  { group: "Bali", name: "WS RI", location: "Bali", capacity: "150 meter/bulan", capacityValue: 150, team: "10 orang", teamValue: 10 },
  { group: "Bali", name: "WS NK", location: "Bali", capacity: "50 meter/bulan", capacityValue: 50, team: "3 orang", teamValue: 3 },
  { group: "Parahyangan Timur", name: "WS AD", location: "Garut", capacity: "50 meter/bulan", capacityValue: 50, team: "5 orang", teamValue: 5 },
  { group: "Parahyangan Timur", name: "WS RT", location: "Tasikmalaya", capacity: "150 meter/bulan", capacityValue: 150, team: "9 orang", teamValue: 9 },
  { group: "Parahyangan Timur", name: "WS AS", location: "Banjar", capacity: "100 meter/bulan", capacityValue: 100, team: "6 orang", teamValue: 6 },
  { group: "Parahyangan Timur", name: "WS HA", location: "Garut", capacity: "50 meter/bulan", capacityValue: 50, team: "3 orang", teamValue: 3 },
  { group: "Parahyangan Timur", name: "WS UR", location: "Garut", capacity: "150 meter/bulan", capacityValue: 150, team: "6 orang", teamValue: 6 },
];

export const portfolioCategories: PortfolioCategory[] = [
  "All",
  "Kitchen Set",
  "Bedroom",
  "Living Room",
  "Wardrobe",
  "Under The Stairs",
];

export const portfolioSection = {
  eyebrow: "Portfolio",
  title: "Portfolio Interior Custom MKI",
  description: "Hasil nyata dari 4.048+ project interior — kitchen set, bedroom, living room, wardrobe, dan area bawah tangga yang telah dikerjakan di 28 kota Indonesia.",
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Modern Kitchen Set",
    category: "Kitchen Set",
    description: "Dapur custom dengan storage efisien dan finishing premium.",
    image: siteImages.portfolio.kitchen,
  },
  {
    title: "Premium Bedroom Interior",
    category: "Bedroom",
    description: "Kamar tidur custom dengan backdrop, panel, dan built-in storage.",
    image: siteImages.portfolio.bedroom,
  },
  {
    title: "Living Room Backdrop",
    category: "Living Room",
    description: "Backdrop TV dan cabinet display untuk ruang keluarga modern.",
    image: siteImages.portfolio.living,
  },
  {
    title: "Custom Wardrobe",
    category: "Wardrobe",
    description: "Wardrobe custom dan storage system yang rapi serta fungsional.",
    image: siteImages.portfolio.wardrobe,
  },
  {
    title: "Under Stairs Storage",
    category: "Under The Stairs",
    description: "Area bawah tangga diolah menjadi storage dan display compact.",
    image: siteImages.portfolio.stairs,
  },
  {
    title: "Commercial Interior Detail",
    category: "Living Room",
    description: "Eksekusi interior custom untuk kebutuhan komersial dan premium space.",
    image: siteImages.portfolio.commercial,
  },
];

export const partnershipSection = {
  eyebrow: "Kemitraan",
  title: "Kemitraan Strategis MKI",
  description:
    "MKI tidak hanya melayani customer umum, tetapi juga menjadi partner produksi dan eksekusi untuk arsitek, agensi, influencer, dan mitra bisnis.",
};

export const partnerships: PartnershipItem[] = [
  {
    id: "architect",
    segment: "Architect",
    label: "Untuk Arsitek",
    title: "Partner Eksekusi Interior untuk Arsitek",
    description:
      "MKI membantu arsitek merealisasikan desain menjadi hasil akhir yang presisi, rapi, dan sesuai konsep tanpa menurunkan standar visual maupun fungsi.",
    points: [
      "Menerjemahkan detail desain ke produksi dan instalasi lapangan",
      "Menjaga konsistensi material, finishing, dan fungsi",
      "Mengurangi risiko keterlambatan lewat alur kerja terukur",
      "Fleksibel untuk residential, komersial, dan project skala besar",
    ],
    outcomes: [
      "Desain arsitek tetap utuh saat dieksekusi",
      "Koordinasi teknis lebih jelas dari survey sampai serah terima",
      "Partner produksi yang dapat menjadi extension of execution team",
    ],
    metrics: [
      { value: "4.048+", label: "project selesai" },
      { value: "2.690m", label: "kapasitas/bulan" },
      { value: "150+", label: "tenaga ahli" },
    ],
  },
  {
    id: "agency",
    segment: "Agency",
    label: "Untuk Agensi",
    title: "Partner Infrastruktur Skala Agensi",
    description:
      "MKI mendukung agensi dengan infrastruktur manufaktur riil untuk mengubah jaringan talent, audience, dan lead digital menjadi project interior yang bisa dieksekusi aman.",
    points: [
      "Proteksi reputasi talent melalui standar produksi dan finishing",
      "Sistem exclusive area untuk mengurangi konflik antar partner",
      "Dukungan lead-to-installation dari produksi sampai pemasangan",
      "Model profit dan performa yang lebih mudah diukur",
    ],
    outcomes: [
      "Agensi dapat fokus mengelola talent, campaign, dan audience",
      "Promise konten didukung kapasitas produksi nyata",
      "Jangkauan 28 kota memudahkan ekspansi pasar lintas area",
    ],
    metrics: [
      { value: "62+", label: "account/mitra" },
      { value: "23", label: "workshop aktif" },
      { value: "28", label: "kota coverage" },
    ],
  },
  {
    id: "influencer",
    segment: "Influencer",
    label: "Untuk Influencer",
    title: "Partner Pertumbuhan Skala Nasional",
    description:
      "MKI membantu influencer membangun otoritas bisnis interior dengan sistem produksi nyata, territory collaboration, dan dukungan operasional yang menjaga reputasi personal brand.",
    points: [
      "Membangun brand authority dari konten aesthetic menjadi layanan interior",
      "Mendukung target premium market dengan standar visual high-end",
      "Faceless content friendly untuk promosi interior tanpa over-personalization",
      "Pertumbuhan terkontrol dengan kualitas, logistik, dan instalasi yang dijaga",
    ],
    outcomes: [
      "Influencer fokus pada konten dan audience",
      "MKI menangani produksi, quality control, dan instalasi",
      "Exclusive area membantu pertumbuhan lebih sehat per wilayah",
    ],
    metrics: [
      { value: "3", label: "provinsi" },
      { value: "4.048+", label: "bukti pasar" },
      { value: "150+", label: "tim ahli" },
    ],
  },
];

export const growthSection = {
  eyebrow: "Strategic Growth",
  title: "Model Pertumbuhan Berbasis Kinerja",
  description:
    "Dari company overview, arah ekspansi MKI dibangun sebagai kemitraan sederhana, transparan, terukur, dan berbasis performa. Partner dapat ikut bertumbuh tanpa harus ikut mengurus detail operasional harian.",
};

export const growthPillars: GrowthPillar[] = [
  {
    title: "Sistem Teruji",
    description: "Model bisnis didukung rekam jejak ribuan project, workshop aktif, dan alur produksi yang sudah berjalan sejak 2018.",
    icon: "workflow",
  },
  {
    title: "Laporan Transparan",
    description: "Performa kemitraan dapat dipantau melalui volume project, progres produksi, dan capaian operasional yang terukur.",
    icon: "badgeCheck",
  },
  {
    title: "Risiko Terkontrol",
    description: "Partner tidak perlu membangun workshop dari nol karena eksekusi dijalankan oleh sistem produksi MKI.",
    icon: "shield",
  },
  {
    title: "Skala Nasional",
    description: "Pertumbuhan project, area, dan kemitraan diarahkan untuk memperkuat ekosistem interior jangka panjang.",
    icon: "mapPin",
  },
];

export const whyChooseSection = {
  eyebrow: "Keunggulan",
  title: "Mengapa Memilih MKI?",
  description:
    "Sistem kerja MKI dirancang untuk menjaga kualitas, kapasitas, dan konsistensi eksekusi interior.",
};

export const features: FeatureItem[] = [
  {
    title: "Sistem Produksi Terstruktur",
    description: "Setiap project berjalan dengan alur kerja yang jelas agar hasil lebih rapi, konsisten, dan sesuai spesifikasi.",
    icon: "workflow",
  },
  {
    title: "Kontrol Kualitas Premium",
    description: "Setiap proses dikontrol agar hasil akhir tetap stabil dari produksi sampai pemasangan.",
    icon: "shield",
  },
  {
    title: "Jaringan Workshop Aktif",
    description: "Dukungan workshop aktif membantu pengerjaan project lebih scalable dan efisien.",
    icon: "factory",
  },
  {
    title: "Tenaga Ahli Berpengalaman",
    description: "Didukung tenaga produksi, finishing, dan instalasi yang terbiasa menangani project interior.",
    icon: "users",
  },
  {
    title: "Eksekusi Lebih Efisien",
    description: "Koordinasi kerja yang baik membantu mempercepat proses tanpa mengorbankan kualitas.",
    icon: "sparkles",
  },
  {
    title: "Siap untuk Kemitraan",
    description: "Sistem MKI cocok untuk arsitek, agensi, influencer, dan pengembangan bisnis interior.",
    icon: "briefcase",
  },
];

export const processSection = {
  eyebrow: "Alur Kerja",
  title: "Alur Kerja Project",
  description:
    "Setiap project dikerjakan melalui alur yang jelas agar hasil akhir lebih terukur, rapi, dan sesuai kebutuhan.",
};

export const processSteps: ProcessStep[] = [
  { step: "01", title: "Konsultasi kebutuhan", description: "Menggali kebutuhan, gaya, anggaran, dan target ruang Anda." },
  { step: "02", title: "Survey lokasi", description: "Peninjauan kondisi lapangan secara langsung." },
  { step: "03", title: "Pengukuran dan analisis ruang", description: "Pengukuran presisi dan analisis potensi ruang." },
  { step: "04", title: "Desain atau validasi desain", description: "Penyusunan atau validasi desain agar sesuai konsep." },
  { step: "05", title: "Penawaran dan persetujuan", description: "Rincian biaya, material, dan persetujuan lingkup kerja." },
  { step: "06", title: "Produksi workshop", description: "Pengerjaan presisi di jaringan workshop aktif MKI." },
  { step: "07", title: "Quality control", description: "Pemeriksaan kualitas sebelum keluar dari workshop." },
  { step: "08", title: "Pengiriman dan instalasi", description: "Distribusi dan pemasangan yang rapi di lokasi." },
  { step: "09", title: "Final checking", description: "Pengecekan akhir detail, fungsi, dan finishing." },
  { step: "10", title: "Serah terima project", description: "Serah terima hasil akhir dan dokumentasi ke klien." },
];

export const coverageSection = {
  eyebrow: "Coverage",
  title: "Jangkauan Operasional 28 Kota, 3 Provinsi",
  description:
    "Portfolio 2021-2026 mencatat jangkauan project MKI di 28 kota/kabupaten dan 3 provinsi (Jawa Barat, DKI Jakarta, Bali). Coverage ini didukung 23 workshop aktif untuk menjaga kapasitas pengerjaan, efisiensi produksi, dan kualitas hasil akhir.",
  image: siteImages.coverage,
  imageAlt: "Peta jangkauan operasional jasa interior MKI di 28 kota Indonesia",
  projectRecord: {
    title: "Rekam Jejak Project 2021-2026",
    description: "3.895 project pada periode 2021-2026 ditambah 153 project Januari-Februari 2026, membentuk total 4.048+ project.",
  },
  highlights: [
    { value: "28 Kota", label: "Jangkauan Project" },
    { value: "3 Provinsi", label: "Area Operasional" },
    { value: "23", label: "Workshop Aktif" },
    { value: "150+", label: "Tenaga Produksi dan Instalasi" },
  ],
};

export const coverageCities: CoverageCity[] = [
  { name: "Indramayu", type: "Kabupaten" },
  { name: "Bandung", type: "Kabupaten" },
  { name: "Bekasi", type: "Kabupaten" },
  { name: "Bogor", type: "Kabupaten" },
  { name: "Cianjur", type: "Kabupaten" },
  { name: "Cirebon", type: "Kabupaten" },
  { name: "Garut", type: "Kabupaten" },
  { name: "Karawang", type: "Kabupaten" },
  { name: "Majalaya", type: "Kabupaten" },
  { name: "Majalengka", type: "Kabupaten" },
  { name: "Purwakarta", type: "Kabupaten" },
  { name: "Subang", type: "Kabupaten" },
  { name: "Sukabumi", type: "Kabupaten" },
  { name: "Sumedang", type: "Kabupaten" },
  { name: "Tangerang", type: "Kabupaten" },
  { name: "Tasikmalaya", type: "Kabupaten" },
  { name: "Ciamis", type: "Kabupaten" },
  { name: "Banjar", type: "Kota" },
  { name: "Bekasi", type: "Kota" },
  { name: "Cimahi", type: "Kota" },
  { name: "Depok", type: "Kota" },
  { name: "Jakarta", type: "Kota" },
  { name: "Jakarta Barat", type: "Kota" },
  { name: "Jakarta Selatan", type: "Kota" },
  { name: "Jakarta Timur", type: "Kota" },
  { name: "Jakarta Utara", type: "Kota" },
  { name: "Tangerang", type: "Kota" },
  { name: "Tangerang Selatan", type: "Kota" },
];

export const socialProofSection = {
  eyebrow: "Social Proof",
  title: "Dipercaya Berbagai Mitra dan Klien",
  description:
    "Kolaborasi, inovasi, dan pertumbuhan menjadi fondasi MKI dalam membangun ekosistem interior yang berkelanjutan.",
};

export const clientLogos: LogoItem[] = [
  {
    name: "Home Putra Interior",
    descriptor: "Strategic Partner",
    logo: "/images/brand/home putra interior.webp",
    href: "https://www.instagram.com/homeputrainterior/",
  },
  {
    name: "Home Interior Bandung",
    descriptor: "Interior Account",
    logo: "/images/brand/home-interior-bandung-logo.png",
    logoPadding: "none",
    href: "https://www.instagram.com/home_interior_bandung/",
  },
  {
    name: "Savoy Interior",
    descriptor: "Interior Network",
    logo: "/images/brand/savoy interior.png",
    href: "https://www.instagram.com/savoy.interior/",
  },
  {
    name: "Patner Interior",
    descriptor: "Brand Partner",
    logo: "/images/brand/patner interior.jpg",
    href: "https://www.instagram.com/partner_interior.id/",
  },
  {
    name: "Kitchenset Bandung Barat",
    descriptor: "Kitchen Set Account",
    logo: "/images/brand/kitchenset bandung barat.jpg",
    href: "https://www.instagram.com/kitchenset_bandungbarat93/",
  },
  {
    name: "Akbar Interior",
    descriptor: "Interior Partner",
    logo: "/images/brand/akbar interior.jpg",
    href: "https://www.instagram.com/akbar_interior.id/",
  },
  {
    name: "Mewah Interior",
    descriptor: "Premium Interior Account",
    logo: "/images/brand/Mewah interior.webp",
    href: "https://www.instagram.com/mewah.interior/",
  },
  {
    name: "Garis Interior",
    descriptor: "Design Partner",
    logo: "/images/brand/garis interior.png",
    href: "https://www.instagram.com/garis_interior.id/",
  },
  {
    name: "Porto Interior",
    descriptor: "Business Partner",
    logo: "/images/brand/porto interior.jpg",
    href: "https://www.instagram.com/porto.interior/",
  },
  {
    name: "Pusat Interior",
    descriptor: "Interior Account",
    logo: "/images/brand/pusat interior.jpg",
    href: "https://www.instagram.com/pusat_interiorcustom/",
  },
  {
    name: "Furniture Cimahi",
    descriptor: "Furniture Account",
    logo: "/images/brand/furniture cimahi.png",
    logoFit: "cover",
    href: "https://www.instagram.com/furniture_cimahi/",
  },
  {
    name: "Argo Interior",
    descriptor: "Interior Partner",
    logo: "/images/brand/argo_interior.jpg",
    href: "https://www.instagram.com/argo_interior.id/",
  },
  {
    name: "Dekor Interior",
    descriptor: "Interior Partner",
    logo: "/images/brand/Dekorinterior.jpg",
    href: "https://www.instagram.com/dekorinterior_/",
  },
  {
    name: "Broto Interior",
    descriptor: "Interior Partner",
    logo: "/images/brand/broto interior.png",
  },
];

export const faqSection = {
  eyebrow: "FAQ",
  title: "Pertanyaan yang Sering Diajukan",
  description: "Jawaban singkat untuk kebutuhan layanan, survey, kemitraan, dan coverage MKI.",
};

export const faqs: FaqItem[] = [
  {
    question: "Apakah MKI melayani custom interior?",
    answer:
      "Ya, MKI melayani kebutuhan interior custom seperti kitchen set, bedroom, living room, wardrobe, dan area bawah tangga.",
  },
  {
    question: "Apakah bisa bekerja sama dengan arsitek?",
    answer:
      "Ya, MKI dapat menjadi partner eksekusi interior untuk membantu arsitek menjaga detail desain, material, finishing, dan fungsi saat masuk tahap produksi serta instalasi.",
  },
  {
    question: "Apakah MKI menerima kemitraan agensi atau influencer?",
    answer:
      "Ya, MKI memiliki konsep kemitraan untuk agensi dan influencer dengan dukungan workshop, sistem produksi, dan kontrol kualitas.",
  },
  {
    question: "Apakah bisa survey lokasi?",
    answer: "Ya, alur project dapat dimulai dari konsultasi dan survey lokasi.",
  },
  {
    question: "Area mana saja yang dilayani?",
    answer: "MKI memiliki jangkauan project di 28 kota/kabupaten dan 3 provinsi, dengan dukungan 23 workshop aktif.",
  },
  {
    question: "Apa itu kemitraan exclusive area?",
    answer:
      "Kemitraan exclusive area adalah pengelolaan wilayah agar partner, agensi, atau influencer tidak saling bertabrakan di area yang sama. Model ini membantu pertumbuhan lebih sehat dan reputasi partner lebih terjaga.",
  },
  {
    question: "Seberapa besar kapasitas produksi MKI?",
    answer:
      "Data company overview mencatat kapasitas produksi 2.690m per bulan dari jaringan workshop aktif, didukung 156 personel workshop terdata dan 150+ tenaga ahli lintas produksi, finishing, dan instalasi.",
  },
  {
    question: "Apakah MKI mendukung strategi konten influencer?",
    answer:
      "Ya, konsep kemitraan influencer MKI mendukung pertumbuhan brand interior, termasuk pendekatan faceless content dan fokus pasar premium dengan eksekusi produksi yang tetap dikontrol.",
  },
];

export const contactSection = {
  eyebrow: "Kontak",
  title: "Mulai Project Interior Anda Bersama MKI",
  description: "Konsultasikan kebutuhan interior atau kemitraan Anda bersama tim MKI.",
  infoTitle: "Informasi Kontak",
  form: {
    name: "Nama",
    phone: "Nomor WhatsApp",
    category: "Kategori kebutuhan",
    location: "Lokasi project",
    message: "Pesan",
    namePlaceholder: "Nama Anda",
    phonePlaceholder: "08xx xxxx xxxx",
    locationPlaceholder: "Kota / area project",
    messagePlaceholder: "Ceritakan kebutuhan interior atau kemitraan Anda",
  },
  categories: [
    "Kitchen Set",
    "Bedroom Interior",
    "Living Room",
    "Wardrobe",
    "Under The Stairs",
    "Kemitraan Arsitek",
    "Kemitraan Agensi",
    "Kemitraan Influencer",
    "Kemitraan Bisnis / Investor",
    "Lainnya",
  ],
};

export const footerContent = {
  quickLinks: "Quick Links",
  services: "Layanan",
  partnerships: "Kemitraan",
  contact: "Kontak",
  copyright: "All rights reserved.",
};

export const notFoundContent = {
  title: "Halaman tidak ditemukan",
  description: "Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.",
  action: "Kembali ke Home",
};
