import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ctaLabels } from "@/constants/content";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl dark:bg-background/90">
      <div className="container grid h-[76px] grid-cols-[auto_auto] items-center justify-between gap-4 xl:grid-cols-[minmax(120px,auto)_1fr_auto]">
        <Logo compact />
        <NavLinks />
        <div className="hidden items-center gap-3 justify-self-end xl:flex">
          <ThemeToggle />
          <Button asChild>
            <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <IconBrandWhatsapp className="size-4" />
              {ctaLabels.consult}
            </a>
          </Button>
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
