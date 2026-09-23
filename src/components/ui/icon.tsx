import {
  IconCircleCheckFilled,
  IconShirt,
  IconBed,
  IconBriefcase,
  IconBuilding,
  IconCircleCheck,
  IconBuildingFactory2,
  IconHammer,
  IconHome,
  IconMapPin,
  IconBrandWhatsapp,
  IconRuler,
  IconShieldCheck,
  IconSparkles,
  IconStairs,
  IconUsers,
  IconToolsKitchen2,
  IconTimeline,
} from "@tabler/icons-react";
import type { IconName } from "@/constants/types";

const icons = {
  badgeCheck: IconCircleCheckFilled,
  bed: IconBed,
  briefcase: IconBriefcase,
  building: IconBuilding,
  checkCircle: IconCircleCheck,
  factory: IconBuildingFactory2,
  hammer: IconHammer,
  home: IconHome,
  mapPin: IconMapPin,
  message: IconBrandWhatsapp,
  ruler: IconRuler,
  shield: IconShieldCheck,
  sparkles: IconSparkles,
  stairs: IconStairs,
  users: IconUsers,
  utensils: IconToolsKitchen2,
  wardrobe: IconShirt,
  workflow: IconTimeline,
};

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const TablerIcon = icons[name];

  return <TablerIcon aria-hidden stroke={2} className={className} />;
}
