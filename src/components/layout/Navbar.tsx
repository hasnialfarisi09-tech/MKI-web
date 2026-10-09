import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { RefreshButton } from "@/components/layout/RefreshButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ctaLabels } from "@/constants/content";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl transition-all duration-200 dark:bg-background/90">
      <div className="mx-auto flex h-[74px] w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex shrink-0 items-center">
          <Logo compact />
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-center px-2 xl:flex">
          <NavLinks />
        </div>

        {/* Right: Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
          <RefreshButton />
          <ThemeToggle />
          <Button asChild size="sm" className="h-9 rounded-full px-4 text-xs font-bold tracking-wide shadow-glow hover:shadow-soft">
            <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <IconBrandWhatsapp className="size-4 shrink-0" />
              <span>{ctaLabels.consult}</span>
            </a>
          </Button>
        </div>

        {/* Mobile & Tablet Actions */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <RefreshButton />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
