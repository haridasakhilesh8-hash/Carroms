import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sand)]",
        className
      )}
    >
      {children}
    </span>
  );
}
