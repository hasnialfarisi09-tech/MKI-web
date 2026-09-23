import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { company } from "@/constants/company";
import { notFoundContent } from "@/constants/content";

// Prevent Google from indexing 404 pages — wastes crawl budget
export const metadata: Metadata = {
  title: `Halaman Tidak Ditemukan | ${company.shortName} Interior Bandung`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mki-soft px-6 py-24">
      <section className="max-w-xl rounded-3xl border border-border bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-mki-gradient text-base font-black text-white">
          {company.shortName}
        </div>
        <h1 className="mt-6 text-4xl font-black text-mki-charcoal">{notFoundContent.title}</h1>
        <p className="mt-4 text-sm leading-7 text-mki-gray">{notFoundContent.description}</p>
        <Button asChild className="mt-8">
          <Link href="/">{notFoundContent.action}</Link>
        </Button>
      </section>
    </main>
  );
}
