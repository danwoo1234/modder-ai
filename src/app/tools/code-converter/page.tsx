"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const platformOptions = ["Spigot → Fabric", "Spigot → Forge", "Fabric → Spigot", "Fabric → Forge", "Forge → Spigot", "Forge → Fabric"];

export default function CodeConverterPage() {
  return (
    <AuthGate requiredTier="pro">
      <CodeConverter />
    </AuthGate>
  );
}

function CodeConverter() {
  const { data: session } = useSession();
  const [conversion, setConversion] = useState("Spigot → Fabric");
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!inputCode.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "code-converter",
          prompt: `Convert this Minecraft plugin/mod code:
Conversion: ${conversion}

Source code:
${inputCode}`,
          options: { conversion },
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔀</span>
          <div>
            <h1 className="text-2xl font-black">Code Converter</h1>
            <p className="text-sm text-foreground/50">Convert code between Spigot, Fabric, and Forge</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <div className="mb-6">
          <label className="text-sm font-medium text-foreground/70 mb-2 block">Conversion Direction</label>
          <div className="grid grid-cols-3 gap-2">
            {platformOptions.map((opt) => (
              <button key={opt} onClick={() => setConversion(opt)} className={`p-3 rounded-lg text-sm border transition-colors ${conversion === opt ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid ${result ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
          <div>
            <label className="text-sm font-medium text-foreground/70 mb-2 block">Source Code ({conversion.split(" → ")[0]})</label>
            <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Paste your source code here..." className="w-full h-96 p-4 rounded-xl bg-surface border border-border text-foreground text-sm font-mono resize-none" />
          </div>

          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground/70">Converted ({conversion.split(" → ")[1]})</label>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="h-96 p-4 rounded-xl bg-surface border border-border text-sm text-foreground/80 font-mono overflow-auto"><code>{result}</code></pre>
            </div>
          )}
        </div>

        <button onClick={handleConvert} disabled={!inputCode.trim() || loading} className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
          {loading ? "🔀 Converting..." : "🔀 Convert Code"}
        </button>
      </div>
    </div>
  );
}
