"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const versionPairs = [
  { from: "1.8", to: "1.12.2", label: "1.8 → 1.12.2" },
  { from: "1.12.2", to: "1.16.5", label: "1.12.2 → 1.16.5" },
  { from: "1.16.5", to: "1.19.4", label: "1.16.5 → 1.19.4" },
  { from: "1.19.4", to: "1.20.4", label: "1.19.4 → 1.20.4" },
  { from: "1.20.4", to: "1.21", label: "1.20.4 → 1.21" },
];

export default function AiUpgraderPage() {
  return (
    <AuthGate requiredTier="vip">
      <AiUpgrader />
    </AuthGate>
  );
}

function AiUpgrader() {
  const { data: session } = useSession();
  const [code, setCode] = useState("");
  const [versionPair, setVersionPair] = useState("1.16.5→1.20.4");
  const [sourceVersion, setSourceVersion] = useState("1.16.5");
  const [targetVersion, setTargetVersion] = useState("1.20.4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const selectPair = (from: string, to: string) => {
    setSourceVersion(from);
    setTargetVersion(to);
    setVersionPair(`${from}→${to}`);
  };

  const handleUpgrade = async () => {
    if (!code.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "ai-upgrader",
          prompt: `Upgrade this Minecraft plugin code from ${sourceVersion} to ${targetVersion}:

\`\`\`java
${code}
\`\`\`

Provide:
1. The fully upgraded code with all API changes applied
2. A detailed changelog of every modification made
3. Breaking API changes encountered and how they were resolved
4. Deprecated method replacements
5. New API features that could improve the code
6. Compatibility notes and testing recommendations`,
          options: { sourceVersion, targetVersion },
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
          <span className="text-3xl">⬆️</span>
          <div>
            <h1 className="text-2xl font-black">AI Version Upgrader</h1>
            <p className="text-sm text-foreground/50">Automatically migrate plugins between Minecraft versions</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Version Migration Path</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {versionPairs.map((p) => (
                  <button key={p.label} onClick={() => selectPair(p.from, p.to)} className={`p-3 rounded-xl text-xs font-medium border transition-all ${versionPair === `${p.from}→${p.to}` ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-surface border-border hover:border-amber-500/20"}`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Plugin Code to Upgrade</label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={18} className="w-full p-4 rounded-xl bg-surface border border-border text-foreground font-mono text-sm focus:border-primary/40 outline-none resize-none" placeholder="Paste your Java plugin code here..." />
            </div>

            <button onClick={handleUpgrade} disabled={!code.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "⬆️ Upgrading Code..." : `⬆️ Upgrade ${sourceVersion} → ${targetVersion}`}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
              <p className="font-bold text-amber-300">⬆️ Upgrade Complete!</p>
              <p className="text-xs text-foreground/50 mt-1">{sourceVersion} → {targetVersion}</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">upgraded-plugin.java</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Upgrade More Code</button>
          </div>
        )}
      </div>
    </div>
  );
}
