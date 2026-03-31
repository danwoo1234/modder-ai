"use client";

import { useSession } from "next-auth/react";

export default function AdBanner({ slot }: { slot: string }) {
  const { data: session } = useSession();
  const tier = session?.user?.tier;

  if (tier === "pro" || tier === "vip") return null;

  return (
    <div
      className="w-full rounded-lg bg-surface-light/50 border border-border/50 flex items-center justify-center py-3 text-xs text-foreground/20"
      data-ad-slot={slot}
    >
      Ad Space
    </div>
  );
}
