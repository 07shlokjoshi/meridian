"use client";

import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  active?: boolean;
  className?: string;
}

export function LiveBadge({ active = true, className }: LiveBadgeProps) {
  if (!active) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>
      Live data
    </span>
  );
}
