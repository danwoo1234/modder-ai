"use client";

import Link from "next/link";
import { tools } from "@/lib/tools";
import { usePathname } from "next/navigation";
import AdBanner from "@/components/AdBanner";

export default function ToolPage() {
  const pathname = usePathname();
  const toolId = pathname.split("/").pop();
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-foreground/50">Tool not found</p>
      </div>
    );
  }

  const isLocked = tool.tier === "vip";

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{tool.icon}</span>
              <div>
                <h1 className="text-2xl font-black">{tool.name}</h1>
                <p className="text-sm text-foreground/50">{tool.description}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                    tool.tier === "free"
                      ? "bg-success/10 text-success"
                      : tool.tier === "pro"
                      ? "bg-primary/10 text-primary-light"
                      : "bg-gold/10 text-gold"
                  }`}
                >
                  {tool.tier.toUpperCase()}
                </span>
              </div>
            </div>

            {isLocked ? (
              <div className="rounded-2xl bg-surface border border-border p-12 text-center">
                <span className="text-5xl mb-4 block">🔒</span>
                <h2 className="text-xl font-bold mb-2">VIP Feature</h2>
                <p className="text-foreground/50 mb-6 max-w-md mx-auto">
                  {tool.name} is available exclusively for VIP members. Upgrade to VIP to unlock this and all advanced AI features including server hosting.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-600 text-black font-bold hover:opacity-90 transition-opacity"
                >
                  Upgrade to VIP — $59/mo
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-xl bg-surface border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-foreground/70">
                        <span className="text-success">✅</span> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-surface border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Describe what you want</h2>
                  <textarea
                    placeholder={`Describe your ${tool.name.toLowerCase()} requirements here...`}
                    className="w-full h-32 p-4 rounded-xl bg-surface-light border border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-foreground/30"
                  />
                  <button
                    className={`w-full mt-4 py-4 rounded-xl bg-gradient-to-r ${tool.color} text-white font-bold text-lg hover:opacity-90 transition-all`}
                  >
                    {tool.icon} Generate with {tool.name}
                  </button>
                  {tool.tier === "pro" && (
                    <p className="text-xs text-center text-foreground/30 mt-2">
                      Requires Pro plan — <Link href="/pricing" className="text-primary-light underline">Upgrade</Link>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <AdBanner slot={`${tool.id}-sidebar`} />
            <div className="rounded-xl bg-surface border border-border p-4">
              <h3 className="font-bold text-sm mb-3">Related Tools</h3>
              <div className="space-y-2">
                {tools
                  .filter((t) => t.category === tool.category && t.id !== tool.id)
                  .slice(0, 4)
                  .map((t) => (
                    <Link
                      key={t.id}
                      href={t.href}
                      className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <span>{t.icon}</span> {t.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
