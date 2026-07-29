import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,248,240,0.08),rgba(255,248,240,0.03))] p-6 shadow-[0_24px_80px_rgba(7,10,14,0.22)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
