"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ctaLabels, portfolioCategories, portfolioSection } from "@/constants/content";
import { richPortfolioItems } from "@/constants/portfolio";
import { SectionHeader } from "@/components/sections/SectionHeader";

export function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding bg-secondary relative overflow-hidden">
      <div className="container relative z-10">
        <SectionHeader eyebrow={portfolioSection.eyebrow} title={portfolioSection.title} description={portfolioSection.description} />
        <Tabs defaultValue="All" className="mt-10">
          <div className="pb-2 sm:flex sm:justify-center">
            <TabsList className="grid w-full min-w-0 grid-cols-2 gap-1 rounded-2xl sm:inline-flex sm:w-auto sm:min-w-0 sm:gap-2 sm:rounded-full">
              {portfolioCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="min-w-0 px-3 text-xs min-[420px]:text-sm sm:px-4">
                  {category === "All" ? "Semua" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {portfolioCategories.map((category) => {
            // Display first 6 featured items for 'All', and first 3 items for specific categories on home page
            const items = category === "All" 
              ? richPortfolioItems.slice(0, 6) 
              : richPortfolioItems.filter((item) => item.category === category).slice(0, 3);

            return (
              <TabsContent value={category} key={category}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <PortfolioCard item={item} key={`${category}-${item.id}`} />
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="secondary" size="lg" className="hover:text-mki-orange">
            <Link href="/portfolio">
              {ctaLabels.allPortfolio}
              <IconArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
