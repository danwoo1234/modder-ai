import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Create Minecraft Mods with&nbsp;AI
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-8">
          Describe what you want, get a working plugin. 20+ tools covering every part of
          Minecraft modding — from code generation to crash analysis to server setup.
          Supports Paper, Fabric, Forge, and 9 more loaders across MC 1.7.10–1.21.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
          >
            Open Dashboard
          </Link>
          <Link
            href="#tools"
            className="px-6 py-3 rounded-xl bg-surface border border-border text-foreground/70 font-medium hover:border-primary/30 transition-colors"
          >
            Browse Tools
          </Link>
        </div>
      </section>

      {/* All Tools with Descriptions */}
      <section id="tools" className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-black mb-2">All Tools</h2>
        <p className="text-sm text-foreground/50 mb-8">
          Every tool in one place. Click any card to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group rounded-xl bg-surface border border-border p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="font-bold text-sm group-hover:text-primary-light transition-colors">
                  {tool.name}
                </h3>
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                    tool.tier === "free"
                      ? "bg-success/10 text-success"
                      : tool.tier === "pro"
                      ? "bg-primary/10 text-primary-light"
                      : "bg-gold/10 text-gold"
                  }`}
                >
                  {tool.tier === "free" ? "FREE" : tool.tier.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-foreground/50 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
