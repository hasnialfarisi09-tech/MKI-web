"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ctaLabels } from "@/constants/content";
import { navigationItems } from "@/constants/navigation";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="xl:hidden" aria-label="Buka menu">
          <IconMenu2 className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
        <Logo />
        <nav className="mt-10 grid gap-2">
          {navigationItems.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="rounded-2xl px-4 py-3 text-base font-bold text-foreground transition hover:bg-secondary"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
        <Button asChild className="mt-8 w-full" size="lg">
          <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
            {ctaLabels.consult}
          </a>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
