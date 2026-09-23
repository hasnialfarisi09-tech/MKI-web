export const navigationItems = [
  { label: "Home", href: "/#home" },
  { label: "Tentang Kami", href: "/#about" },
  { label: "Layanan", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Kemitraan", href: "/#partnership" },
  { label: "Keunggulan", href: "/#why-us" },
  { label: "FAQ", href: "/#faq" },
  { label: "Kontak", href: "/#contact" },
];

/** Subset navigasi yang ditampilkan di footer — ubah di sini jika perlu mengubah link footer. */
export const footerNavItems = navigationItems.filter((item) =>
  ["/#about", "/#services", "/#portfolio", "/#partnership", "/#why-us"].includes(item.href),
);
