import Link from "next/link";
import Image from "next/image";
import { company } from "@/constants/company";
import { cn } from "@/lib/utils";

type LogoProps = {
  dark?: boolean;
  compact?: boolean;
  fullText?: boolean;
  className?: string;
};

export function Logo({ dark = false, compact = false, fullText = false, className }: LogoProps) {
  return (
    <Link href="#home" className={cn("group flex min-w-0 items-center gap-3", compact && "mt-1", className)} aria-label={company.name}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-start",
          compact ? "w-20 sm:w-24 xl:w-28" : "w-28 sm:w-32 xl:w-36"
        )}
      >
        <Image
          src="/images/brand/mki-logo.png"
          alt={company.shortName}
          width={669}
          height={373}
          className="h-auto w-full object-contain object-left"
          priority
        />
      </span>
      <span className={cn("min-w-0 leading-tight", compact && "hidden")}>
        <span className={cn("block whitespace-nowrap text-sm font-black", dark ? "text-white" : "text-mki-charcoal")}>
          {fullText ? company.name : company.shortName}
        </span>
        {!compact ? (
          <span
            className={cn(
              "block max-w-[12rem] truncate whitespace-nowrap text-xs font-semibold sm:max-w-[15rem] xl:max-w-[18rem]",
              dark ? "text-white/55" : "text-mki-gray",
            )}
            title={company.tagline}
          >
            {company.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
