import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/8 blur-[80px]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary-light font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Now supporting MC 1.7.10 – 1.21
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
          Build Minecraft Mods
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Describe your idea in plain English and get a working plugin in seconds.
          Supports Paper, Fabric, Forge, and 9 more loaders. No coding experience needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            Start Creating — Free
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface border border-border text-foreground/70 font-medium hover:border-primary/30 transition-colors"
          >
            View Pricing
          </Link>
        </div>
        <p className="text-xs text-foreground/30">No credit card required. 5 free generations.</p>
      </section>

      {/* What it does */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black mb-3">How Modder AI Works</h2>
          <p className="text-foreground/50 max-w-xl mx-auto">
            Three steps from idea to downloadable plugin. Our AI handles the code, you bring the creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { step: "1", title: "Describe Your Idea", desc: "Tell the AI what you want your mod to do — a custom weapon, minigame, or server management tool. Use plain English.", icon: "💬" },
            { step: "2", title: "AI Generates Code", desc: "Our AI writes production-ready Java code for your chosen platform, including plugin.yml, event handlers, and configs.", icon: "⚡" },
            { step: "3", title: "Download & Play", desc: "Get a compiled JAR file ready to drop into your server. Test, iterate, and share with the community.", icon: "🎮" },
          ].map((item) => (
            <div key={item.step} className="relative rounded-2xl bg-surface border border-border p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mx-auto mb-4">
                {item.icon}
              </div>
              <div className="text-xs text-primary-light font-bold mb-1">STEP {item.step}</div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: "20+", label: "AI-Powered Tools" },
            { value: "12", label: "Loaders Supported" },
            { value: "14", label: "MC Versions" },
            { value: "Free", label: "To Get Started" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-surface border border-border p-5 text-center">
              <div className="text-3xl font-black text-primary-light mb-1">{stat.value}</div>
              <div className="text-xs text-foreground/40">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pricing Preview */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Simple, Transparent Pricing</h2>
          <p className="text-foreground/50 max-w-xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              desc: "Try every tool with 5 free generations per month.",
              features: ["5 generations / month", "8 free tools", "Community support"],
              cta: "Get Started",
              ctaHref: "/dashboard",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$12",
              period: "/ month",
              desc: "Unlock all tools and generate up to 100 times per month.",
              features: ["100 generations / month", "All 15+ tools unlocked", "Priority AI models", "Email support"],
              cta: "Upgrade to Pro",
              ctaHref: "/pricing",
              highlight: true,
            },
            {
              name: "VIP",
              price: "$59",
              period: "/ month",
              desc: "Unlimited generations, VIP-only tools, and fastest AI models.",
              features: ["Unlimited generations", "VIP-exclusive tools", "Fastest AI models", "Priority support", "Early access to new tools"],
              cta: "Go VIP",
              ctaHref: "/pricing",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "bg-surface border-border"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-primary-light mb-3 uppercase tracking-wider">Most Popular</div>
              )}
              <h3 className="text-xl font-black mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-sm text-foreground/40">{plan.period}</span>
              </div>
              <p className="text-sm text-foreground/50 mb-5">{plan.desc}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/60">
                    <span className="text-success text-xs">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.ctaHref}
                className={`block w-full py-3 rounded-xl text-center font-bold text-sm transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-surface-light border border-border text-foreground/70 hover:border-primary/30"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Supported Platforms */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-3">Works With Every Platform</h2>
          <p className="text-foreground/50 max-w-xl mx-auto">
            Generate code for any Minecraft server software or modding framework.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-20">
          {["Paper", "Spigot", "Purpur", "Fabric", "Forge", "NeoForge", "Velocity", "BungeeCord", "Sponge", "Bukkit", "Folia", "Datapack"].map((p) => (
            <span key={p} className="px-4 py-2 rounded-lg bg-surface border border-border text-sm text-foreground/60 font-medium">
              {p}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <h2 className="text-2xl font-black mb-3">Ready to Build Your First Mod?</h2>
          <p className="text-foreground/50 mb-6 max-w-lg mx-auto">
            Join thousands of Minecraft creators using AI to bring their ideas to life.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
          >
            Start Creating — It{"'"}s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/40">
                <li><Link href="/dashboard" className="hover:text-foreground/70 transition-colors">Dashboard</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground/70 transition-colors">Pricing</Link></li>
                <li><Link href="/gallery" className="hover:text-foreground/70 transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Tools</h4>
              <ul className="space-y-2 text-sm text-foreground/40">
                <li><Link href="/tools/ai-generator" className="hover:text-foreground/70 transition-colors">AI Mod Generator</Link></li>
                <li><Link href="/tools/crash-analyzer" className="hover:text-foreground/70 transition-colors">Crash Analyzer</Link></li>
                <li><Link href="/tools/gui-builder" className="hover:text-foreground/70 transition-colors">GUI Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/40">
                <li><Link href="/terms" className="hover:text-foreground/70 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground/70 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/40">
                <li><Link href="mailto:support@modderai.net" className="hover:text-foreground/70 transition-colors">Email Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground/30">© {new Date().getFullYear()} Modder AI. All rights reserved.</p>
            <p className="text-xs text-foreground/30">Not affiliated with Mojang Studios or Microsoft.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
