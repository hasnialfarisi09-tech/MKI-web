import type { Metadata } from "next";
import { PortfolioPageClient } from "@/components/pages/PortfolioPageClient";
import { company } from "@/constants/company";
import { richPortfolioItems } from "@/constants/portfolio";

export const metadata: Metadata = {
  title: "Galeri Portfolio Interior Custom MKI | Bandung & Indonesia",
  description:
    "Eksplorasi portfolio hasil pengerjaan interior custom MKI (PT Menuju Keindahan Indonesia). Desain kitchen set, bedroom, wardrobe, backdrop TV premium Bandung.",
  keywords: [
    "portfolio interior bandung",
    "hasil kerja interior mki",
    "proyek interior custom bandung",
    "kitchen set bandung portfolio",
    "kamar set custom bandung",
  ],
  alternates: {
    canonical: `${company.siteUrl}/portfolio`,
  },
  openGraph: {
    title: "Galeri Portfolio Interior Custom MKI | Bandung & Indonesia",
    description:
      "Eksplorasi portfolio hasil pengerjaan interior custom MKI. Desain kitchen set, bedroom, wardrobe, backdrop TV premium Bandung.",
    url: `${company.siteUrl}/portfolio`,
    siteName: company.name,
    images: [
      {
        url: `${company.siteUrl}/images/brand/mki-logo.png`,
        width: 669,
        height: 373,
        alt: "Logo PT Menuju Keindahan Indonesia",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galeri Portfolio Interior Custom MKI | Bandung & Indonesia",
    description:
      "Eksplorasi portfolio hasil pengerjaan interior custom MKI. Desain kitchen set, bedroom, wardrobe, backdrop TV premium Bandung.",
    images: [`${company.siteUrl}/images/brand/mki-logo.png`],
  },
};

export default function PortfolioPage() {
  // Generate JSON-LD ItemList schema markup for Google Rich Snippets
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Portfolio Interior Custom MKI",
    "description": "Kumpulan hasil eksekusi furnitur dan pengerjaan interior custom terstruktur oleh MKI.",
    "numberOfItems": richPortfolioItems.length,
    "itemListElement": richPortfolioItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": item.title,
        "description": item.description,
        "image": `${company.siteUrl}${item.images[0]}`,
        "category": item.category,
      }
    }))
  };

  return (
    <>
      <script
        id="portfolio-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <PortfolioPageClient />
    </>
  );
}
