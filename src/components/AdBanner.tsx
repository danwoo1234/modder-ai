"use client";

export default function AdBanner({ slot }: { slot: string }) {
  return (
    <div
      className="w-full rounded-lg bg-surface-light/50 border border-border/50 flex items-center justify-center py-3 text-xs text-foreground/20"
      data-ad-slot={slot}
    >
      Ad Space
    </div>
  );
}
