"use client";

import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import AdBanner from "@/components/AdBanner";

interface UserData {
  tier: string;
  generationsUsed: number;
  generationsLimit: number;
  hasSubscription: boolean;
  isAdmin: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user").then((r) => r.json()).then((d) => {
        if (d.tier) setUserData(d);
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">⛏️</div>
          <p className="text-sm text-foreground/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <span className="text-5xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-black mb-2">Sign In Required</h1>
          <p className="text-sm text-foreground/50 mb-6">Sign in to access your dashboard and tools</p>
          <button onClick={() => signIn("google")} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-opacity">Sign in with Google</button>
        </div>
      </div>
    );
  }

  const currentTier = userData?.tier || "free";
  const generationsUsed = userData?.generationsUsed ?? 0;
  const generationsLimit = userData?.generationsLimit ?? 1;
  const remaining = Math.max(0, generationsLimit - generationsUsed);

  const filtered = tools.filter((t) => {
    if (filter !== "all" && t.category !== filter) return false;
    if (tierFilter !== "all" && t.tier !== tierFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black">Dashboard</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${currentTier === "free" ? "bg-success/10 text-success" : currentTier === "pro" ? "bg-primary/10 text-primary-light" : "bg-gold/10 text-gold"}`}>
                {currentTier.toUpperCase()}
              </span>
              {userData?.isAdmin && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400">
                  ADMIN
                </span>
              )}
              <span className="text-sm text-foreground/50">
                {currentTier === "free" ? `${remaining} gen remaining` : "Unlimited generations"}
              </span>
            </div>
          </div>
          {currentTier === "free" && (
            <Link href="/pricing" className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Upgrade Plan
            </Link>
          )}
        </div>

        {currentTier === "free" && <div className="mb-6"><AdBanner slot="dashboard-top" /></div>}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link href="/tools/ai-generator" className="rounded-xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold mt-2 text-sm">Generate a Mod</h3>
            <p className="text-xs text-foreground/40">Describe your mod, get a working JAR</p>
          </Link>
          <Link href="/tools/crash-analyzer" className="rounded-xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors">
            <span className="text-2xl">🔍</span>
            <h3 className="font-bold mt-2 text-sm">Analyze a Crash</h3>
            <p className="text-xs text-foreground/40">Paste a crash log for instant fix</p>
          </Link>
          <Link href="/tools/jar-tutorial" className="rounded-xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors">
            <span className="text-2xl">📖</span>
            <h3 className="font-bold mt-2 text-sm">JAR Tutorial</h3>
            <p className="text-xs text-foreground/40">Learn to build and export JARs</p>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-primary text-white" : "bg-surface-light text-foreground/50 hover:text-foreground"}`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === c.id ? "bg-primary text-white" : "bg-surface-light text-foreground/50 hover:text-foreground"}`}>
              {c.icon} {c.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1.5">
            {["all", "free", "pro", "vip"].map((t) => (
              <button key={t} onClick={() => setTierFilter(t)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${tierFilter === t ? "bg-primary text-white" : "bg-surface-light text-foreground/50 hover:text-foreground"}`}>
                {t === "all" ? "All" : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((tool) => {
            const tierOrder = { free: 0, pro: 1, vip: 2 };
            const locked = (tierOrder[tool.tier as keyof typeof tierOrder] ?? 0) > (tierOrder[currentTier as keyof typeof tierOrder] ?? 0);
            return (
              <Link
                key={tool.id}
                href={locked ? "/pricing" : tool.href}
                className={`group rounded-xl bg-surface border border-border p-4 transition-all hover:border-primary/30 hover:-translate-y-0.5 relative ${locked ? "opacity-50" : ""}`}
              >
                {locked && (
                  <div className="absolute inset-0 bg-surface/70 rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <span className="text-xl">🔒</span>
                      <p className="text-[10px] text-foreground/40 mt-0.5">{tool.tier.toUpperCase()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl shrink-0">{tool.icon}</span>
                  <h3 className="font-semibold text-sm group-hover:text-primary-light transition-colors truncate flex-1">
                    {tool.name}
                  </h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${tool.tier === "free" ? "bg-success/10 text-success" : tool.tier === "pro" ? "bg-primary/10 text-primary-light" : "bg-gold/10 text-gold"}`}>
                    {tool.tier === "free" ? "FREE" : tool.tier.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-foreground/45 line-clamp-2 mb-2">{tool.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 2).map((f) => (
                    <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-light text-foreground/35">{f}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {currentTier === "free" && <div className="mt-8"><AdBanner slot="dashboard-bottom" /></div>}
      </div>
    </div>
  );
}
