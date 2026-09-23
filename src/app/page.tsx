import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";

const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then((m) => ({ default: m.AboutSection })));
const ProductionCapacitySection = dynamic(() => import("@/components/sections/ProductionCapacitySection").then((m) => ({ default: m.ProductionCapacitySection })));
const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection").then((m) => ({ default: m.ServicesSection })));
const PortfolioSection = dynamic(() => import("@/components/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection })));
const PartnershipSection = dynamic(() => import("@/components/sections/PartnershipSection").then((m) => ({ default: m.PartnershipSection })));
const GrowthPlanSection = dynamic(() => import("@/components/sections/GrowthPlanSection").then((m) => ({ default: m.GrowthPlanSection })));
const WhyChooseUsSection = dynamic(() => import("@/components/sections/WhyChooseUsSection").then((m) => ({ default: m.WhyChooseUsSection })));
const ProcessSection = dynamic(() => import("@/components/sections/ProcessSection").then((m) => ({ default: m.ProcessSection })));
const CoverageSection = dynamic(() => import("@/components/sections/CoverageSection").then((m) => ({ default: m.CoverageSection })));
const SocialProofSection = dynamic(() => import("@/components/sections/SocialProofSection").then((m) => ({ default: m.SocialProofSection })));
const FaqSection = dynamic(() => import("@/components/sections/FaqSection").then((m) => ({ default: m.FaqSection })));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then((m) => ({ default: m.ContactSection })));

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProductionCapacitySection />
      <ServicesSection />
      <PortfolioSection />
      <PartnershipSection />
      <GrowthPlanSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <CoverageSection />
      <SocialProofSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}

