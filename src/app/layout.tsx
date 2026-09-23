import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { company } from "@/constants/company";
import { heroContent } from "@/constants/content";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

// Fraunces — characterful optical serif for display headings (editorial luxury)
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

// SEO-optimized title: primary keyword first, brand second, under 60 chars
const seoTitle = "PT Menuju Keindahan Indonesia | Jasa Interior Custom Bandung";

// SEO-optimized description: keywords + proof + CTA, under 160 chars
const seoDescription =
  "Jasa interior custom Bandung terpercaya sejak 2018. Kitchen set, bedroom, wardrobe & living room. 23 workshop aktif, 4.048+ project, 28 kota. Konsultasi gratis!";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: seoTitle,
    template: `%s | MKI Interior Bandung`,
  },
  description: seoDescription,
  keywords: company.keywords,
  alternates: {
    // Absolute canonical URL — prevents duplicate content issues
    canonical: company.siteUrl,
    languages: {
      // hreflang for Indonesian content — signals Google this is ID-language content
      "id-ID": company.siteUrl,
    },
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: company.siteUrl,
    siteName: company.name,
    images: [
      {
        // OG image must be an absolute URL for social sharing crawlers
        url: `${company.siteUrl}${heroContent.image}`,
        width: 1400,
        height: 933,
        alt: heroContent.imageAlt,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [`${company.siteUrl}${heroContent.image}`],
    creator: "@mki.interior",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verification tokens — add actual values from Search Console
  // verification: { google: "YOUR_VERIFICATION_TOKEN" },
};

/**
 * Enhanced JSON-LD structured data.
 * Uses @graph to combine LocalBusiness + Organization + Service schemas.
 * Inline in <head> (not afterInteractive) so Googlebot reads it on first crawl.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
      "@id": `${company.siteUrl}/#organization`,
      name: company.name,
      alternateName: [company.shortName, "MKI Interior", "MKI Interior Bandung"],
      description: company.description,
      url: company.siteUrl,
      telephone: company.phone,
      email: company.email,
      foundingDate: company.foundedYear,
      priceRange: "$$",
      image: company.logoUrl,
      logo: {
        "@type": "ImageObject",
        url: company.logoUrl,
        width: 669,
        height: 373,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Nasional III, Citatah, Cipatat",
        addressLocality: "Kabupaten Bandung Barat",
        addressRegion: "Jawa Barat",
        postalCode: "40554",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "-6.8583",
        longitude: "107.4444",
      },
      areaServed: [
        { "@type": "State", name: "Jawa Barat" },
        { "@type": "State", name: "DKI Jakarta" },
        { "@type": "State", name: "Bali" },
        { "@type": "AdministrativeArea", name: "Indonesia" },
      ],
      sameAs: [
        `https://www.instagram.com/mki.interior/`,
        `https://wa.me/6282240352844`,
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: company.phone,
          contactType: "customer service",
          contactOption: "TollFree",
          areaServed: "ID",
          availableLanguage: "Indonesian",
        },
        {
          "@type": "ContactPoint",
          telephone: company.partnershipPhone,
          contactType: "sales",
          areaServed: "ID",
          availableLanguage: "Indonesian",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Layanan Interior Custom MKI",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Kitchen Set Custom Bandung",
              description: "Interior dapur custom modern, rapi, fungsional, dan premium.",
              areaServed: "Bandung",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Bedroom Interior Custom",
              description: "Interior kamar tidur custom, headboard, backdrop, storage, dan furniture built-in.",
              areaServed: "Bandung",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Living Room Interior",
              description: "Backdrop TV, wall panel, cabinet display, dan interior ruang keluarga premium.",
              areaServed: "Bandung",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Wardrobe Custom",
              description: "Lemari pakaian custom, walk-in closet, dan storage system.",
              areaServed: "Bandung",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Under The Stairs Storage",
              description: "Pemanfaatan area bawah tangga menjadi storage, cabinet, atau display fungsional.",
              areaServed: "Bandung",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${company.siteUrl}/#website`,
      url: company.siteUrl,
      name: company.name,
      alternateName: ["MKI", "PT MKI"],
      description: company.description,
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${company.siteUrl}/?s={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        {/*
         * JSON-LD structured data — inline in <head> so Googlebot reads it on first crawl.
         */}
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script src="/theme.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <div className="grain-overlay" aria-hidden />
          <ScrollProgress />
          <SmoothScroll />
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
          <FloatingCta />
        </ThemeProvider>
      </body>
    </html>
  );
}
