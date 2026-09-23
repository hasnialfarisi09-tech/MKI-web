import { cn } from "@/lib/utils";

type AuroraProps = {
  className?: string;
  /** "warm" = ember/clay glow, "cool" = espresso depth for dark sections */
  variant?: "warm" | "ember" | "soft";
};

/**
 * Ambient aurora background — slow-drifting blurred gradient blobs that give
 * sections atmosphere and depth instead of a flat fill. Pure CSS animation.
 */
export function Aurora({ className, variant = "warm" }: AuroraProps) {
  const blobs =
    variant === "ember"
      ? ["bg-mki-ember/10", "bg-mki-clay/8", "bg-orange-400/6"]
      : variant === "soft"
        ? ["bg-mki-orange/4", "bg-amber-300/4", "bg-mki-clay/[0.03]"]
        : ["bg-mki-orange/8", "bg-amber-400/6", "bg-mki-clay/6"];

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute -left-[10%] top-[-15%] h-[55vh] w-[55vh] rounded-full blur-[110px] animate-aurora-drift",
          blobs[0],
        )}
      />
      <div
        className={cn(
          "absolute right-[-12%] top-[10%] h-[50vh] w-[50vh] rounded-full blur-[120px] animate-aurora-drift [animation-delay:-7s]",
          blobs[1],
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-20%] left-[30%] h-[48vh] w-[48vh] rounded-full blur-[120px] animate-aurora-drift [animation-delay:-14s]",
          blobs[2],
        )}
      />
    </div>
  );
}
