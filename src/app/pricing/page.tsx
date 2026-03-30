"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for trying things out. Get 5 AI generations per month with access to all free tools.",
    features: [
      "5 generations / month",
      "8 free tools",
      "Community support",
      "Basic AI models",
    ],
    cta: "Get Started",
    ctaAction: "dashboard",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/ month",
    desc: "For serious creators. Unlock every tool and generate up to 100 mods per month with priority AI models.",
    features: [
      "100 generations / month",
      "All 15+ tools unlocked",
      "Priority AI models",
      "Email support",
      "Quest Generator",
      "Minigame Creator",
      "GUI Builder",
      "Modpack Creator",
      "Code Optimizer & Converter",
      "Texture Generator",
    ],
    cta: "Upgrade to Pro",
    ctaAction: "checkout-pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "VIP",
    price: "$59",
    period: "/ month",
    desc: "Unlimited everything. VIP-exclusive tools, fastest AI models, and priority support for power users.",
    features: [
      "Unlimited generations",
      "All Pro features included",
      "VIP-exclusive tools",
      "AI Server Simulator",
      "AI Version Upgrader",
      "Fastest AI models (GPT-4o / Claude Sonnet)",
      "Priority support",
      "Early access to new tools",
    ],
    cta: "Go VIP",
    ctaAction: "checkout-vip",
    highlight: false,
    badge: "Best Value",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  const handleCta = (action: string) => {
    if (action === "dashboard") {
      window.location.href = "/dashboard";
      return;
    }
    if (!session) {
      signIn("google");
      return;
    }
    // TODO: integrate with Lemon Squeezy checkout
    alert("Payment integration coming soon! Contact support@modderai.net for early access.");
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-foreground/50 max-w-xl mx-auto">
            Start free. Upgrade when you need more power. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border flex flex-col ${
                plan.highlight
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                  : "bg-surface border-border"
              }`}
            >
              {plan.badge && (
                <div className={`text-xs font-bold mb-3 uppercase tracking-wider ${
                  plan.highlight ? "text-primary-light" : "text-gold"
                }`}>
                  {plan.badge}
                </div>
              )}
              <h2 className="text-2xl font-black mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-sm text-foreground/40">{plan.period}</span>
              </div>
              <p className="text-sm text-foreground/50 mb-6">{plan.desc}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                    <span className="text-success mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCta(plan.ctaAction)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-surface-light border border-border text-foreground/70 hover:border-primary/30"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What counts as a generation?",
                a: "Each time you use an AI tool to generate code, analyze a crash log, or create content, that counts as one generation.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel your subscription at any time with no penalties. You'll keep access until the end of your billing period.",
              },
              {
                q: "Do I keep the code I generate?",
                a: "Absolutely. All generated code is yours to use, modify, and distribute however you like. No attribution required.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and PayPal through our payment provider Lemon Squeezy.",
              },
              {
                q: "Is there a refund policy?",
                a: "If you're not satisfied, contact us within 7 days of purchase for a full refund. No questions asked.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl bg-surface border border-border p-5">
                <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
                <p className="text-sm text-foreground/50">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
