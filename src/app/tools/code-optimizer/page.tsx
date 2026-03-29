"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const optimizationTypes = ["Performance", "Memory", "Readability", "All"];

export default function CodeOptimizerPage() {
  return (
    <AuthGate requiredTier="pro">
      <CodeOptimizer />
    </AuthGate>
  );
}

function CodeOptimizer() {
  const { data: session } = useSession();
  const [inputCode, setInputCode] = useState("");
  const [optimizeFor, setOptimizeFor] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    optimizedCode: string;
    changes: string[];
    performanceGain: string;
    memoryGain: string;
    warnings: string[];
  } | null>(null);

  const handleOptimize = async () => {
    if (!inputCode.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "code-optimizer",
          prompt: `Optimize this Minecraft plugin code for: ${optimizeFor}

Code:
${inputCode}`,
          options: { optimizeFor },
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      try {
        const parsed = JSON.parse(data.data.content);
        setResult(parsed);
      } catch {
        setResult({
          optimizedCode: data.data.content,
          changes: ["See optimized code"],
          performanceGain: "N/A",
          memoryGain: "N/A",
          warnings: [],
        });
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🚀</span>
          <div>
            <h1 className="text-2xl font-black">Code Optimizer</h1>
            <p className="text-sm text-foreground/50">AI-powered code optimization for Minecraft plugins</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="text-sm font-medium text-foreground/70 mb-2 block">Optimize For</label>
          <div className="flex gap-2">
            {optimizationTypes.map((ot) => (
              <button key={ot} onClick={() => setOptimizeFor(ot)} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${optimizeFor === ot ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                {ot}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${result ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">Original Code</label>
            <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Paste your Minecraft plugin code here..." className="w-full h-80 p-4 rounded-xl bg-surface border border-border text-foreground text-sm font-mono resize-none" />
          </div>

          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground/70">Optimized Code</label>
                <button onClick={() => navigator.clipboard.writeText(result.optimizedCode)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="h-80 p-4 rounded-xl bg-surface border border-border text-sm text-foreground/80 font-mono overflow-auto"><code>{result.optimizedCode}</code></pre>
            </div>
          )}
        </div>

        {!result && (
          <button onClick={handleOptimize} disabled={!inputCode.trim() || loading} className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-lime-500 to-green-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
            {loading ? "🚀 Optimizing..." : "🚀 Optimize Code"}
          </button>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface border border-border p-4">
                <p className="text-sm text-foreground/50 mb-1">Performance Gain</p>
                <p className="text-xl font-bold text-green-400">{result.performanceGain}</p>
              </div>
              <div className="rounded-xl bg-surface border border-border p-4">
                <p className="text-sm text-foreground/50 mb-1">Memory Improvement</p>
                <p className="text-xl font-bold text-cyan-400">{result.memoryGain}</p>
              </div>
            </div>

            <div className="rounded-xl bg-surface border border-border p-4">
              <h3 className="font-bold text-sm mb-2">Changes Made</h3>
              <ul className="space-y-1">
                {result.changes.map((c, i) => (<li key={i} className="text-sm text-foreground/70">• {c}</li>))}
              </ul>
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4">
                <h3 className="font-bold text-sm mb-2 text-yellow-400">Warnings</h3>
                <ul className="space-y-1">
                  {result.warnings.map((w, i) => (<li key={i} className="text-sm text-yellow-300/70">⚠️ {w}</li>))}
                </ul>
              </div>
            )}

            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Optimize More Code</button>
          </div>
        )}
      </div>
    </div>
  );
}
