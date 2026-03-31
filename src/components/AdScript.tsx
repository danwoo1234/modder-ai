"use client";

import { useSession } from "next-auth/react";
import Script from "next/script";

export default function AdScript() {
  const { data: session } = useSession();
  const tier = session?.user?.tier;

  // Only load AdSense for free tier (or not logged in)
  if (tier === "pro" || tier === "vip") return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3656867929224668"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
