"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

export default function AiSimulatorPage() {
  return (
    <AuthGate requiredTier="vip">
      <AiSimulator />
    </AuthGate>
  );
}

function AiSimulator() {
  const { data: session } = useSession();
  const [code, setCode] = useState("");
  const [scenario, setScenario] = useState("100-players");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const scenarios = [
    { id: "100-players", label: "100 Players Online", icon: "👥" },
    { id: "heavy-redstone", label: "Heavy Redstone", icon: "⚡" },
    { id: "world-gen", label: "World Generation", icon: "🌍" },
    { id: "entity-spam", label: "Entity Spam (1000+)", icon: "🐄" },
    { id: "tps-drop", label: "TPS Drop Scenario", icon: "📉" },
    { id: "memory-leak", label: "Memory Leak Check", icon: "💾" },
  ];

  const handleSimulate = async () => {
    if (!code.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "ai-simulator",
          prompt: `Analyze this Minecraft plugin code under the "${scenarios.find((s) => s.id === scenario)?.label}" stress scenario:

\`\`\`java
${code}
\`\`\`

Provide a detailed simulation report with:
1. Performance Score (0-100)
2. TPS Impact estimate
3. Memory usage projection
4. CPU hotspots identified
5. Bottleneck analysis
6. Concurrency issues
7. Specific line-by-line performance notes
8. Optimization recommendations with code examples
9. Stress test results under the selected scenario`,
          options: { scenario },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.data.content);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold">VIP</div>
          <span className="text-3xl">🧪</span>
          <div>
            <h1 className="text-2xl font-black">AI Server Simulator</h1>
            <p className="text-sm text-foreground/50">Stress-test your plugin code with AI analysis</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Stress Scenario</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {scenarios.map((s) => (
                  <button key={s.id} onClick={() => setScenario(s.id)} className={`p-3 rounded-xl text-left border transition-all ${scenario === s.id ? "bg-amber-500/20 border-amber-500/40" : "bg-surface border-border hover:border-amber-500/20"}`}>
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Plugin Code</label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={15} className="w-full p-4 rounded-xl bg-surface border border-border text-foreground font-mono text-sm focus:border-primary/40 outline-none resize-none" placeholder="Paste your Java plugin code here..." />
            </div>

            <button onClick={handleSimulate} disabled={!code.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "🧪 Running Simulation..." : "🧪 Simulate Server Load"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="font-bold text-amber-300">🧪 Simulation Complete</p>
              <p className="text-xs text-foreground/50 mt-1">Scenario: {scenarios.find((s) => s.id === scenario)?.label}</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">simulation-report.md</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Run New Simulation</button>
          </div>
        )}
      </div>
    </div>
  );
}
