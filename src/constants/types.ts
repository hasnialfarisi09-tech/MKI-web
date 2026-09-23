export type IconName =
  | "badgeCheck"
  | "bed"
  | "briefcase"
  | "building"
  | "checkCircle"
  | "factory"
  | "hammer"
  | "home"
  | "mapPin"
  | "message"
  | "ruler"
  | "shield"
  | "sparkles"
  | "stairs"
  | "users"
  | "utensils"
  | "wardrobe"
  | "workflow";

export type StatItem = {
  value: string;
  label: string;
  description: string;
  icon: IconName;
};

export type ServiceItem = {
  title: string;
  description: string;
  icon: IconName;
  details: string[];
};

export type PortfolioCategory =
  | "All"
  | "Kitchen Set"
  | "Bedroom"
  | "Living Room"
  | "Wardrobe"
  | "Under The Stairs";

export type PortfolioItem = {
  title: string;
  category: Exclude<PortfolioCategory, "All">;
  description: string;
  image: string;
};

export type PartnershipItem = {
  id: "architect" | "agency" | "influencer";
  segment: string;
  label: string;
  title: string;
  description: string;
  points: string[];
  outcomes: string[];
  metrics: Array<{
    value: string;
    label: string;
  }>;
};

export type ProductionMetric = {
  value: string;
  label: string;
  description: string;
  icon: IconName;
};

export type WorkshopItem = {
  group: "Bandung" | "Bali" | "Parahyangan Timur";
  name: string;
  location: string;
  capacity: string;
  capacityValue: number;
  team: string;
  teamValue: number;
};

export type GrowthPillar = {
  title: string;
  description: string;
  icon: IconName;
};

export type CoverageCity = {
  name: string;
  type: "Kabupaten" | "Kota";
};

export type FeatureItem = {
  title: string;
  description: string;
  icon: IconName;
};

export type ProcessStep = {
  step: string;
  title: string;
  description?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LogoItem = {
  name: string;
  descriptor: string;
  logo?: string;
  logoFit?: "contain" | "cover";
  logoPadding?: "none" | "default";
  href?: string;
};
