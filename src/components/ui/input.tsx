import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-mki-orange focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
