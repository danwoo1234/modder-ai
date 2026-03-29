"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const serverSoftware = ["Paper", "Spigot", "Purpur", "Velocity", "BungeeCord", "Fabric"];
const serverTypes = ["Survival", "Creative", "Minigames", "Prison", "Skyblock", "Factions", "RPG", "Anarchy"];
const playerCounts = ["1-20", "20-50", "50-100", "100-500", "500+"];

export default function ServerSetupPage() {
  return (
    <AuthGate requiredTier="free">
      <ServerSetup />
    </AuthGate>
  );
}

function ServerSetup() {
  const { data: session } = useSession();
  const [software, setSoftware] = useState("Paper");
  const [serverType, setServerType] = useState("Survival");
  const [playerCount, setPlayerCount] = useState("20-50");
  const [javaVersion, setJavaVersion] = useState("21");
  const [ram, setRam] = useState("4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "server-setup",
          prompt: `Generate a complete server setup guide for:
Server Software: ${software}
Server Type: ${serverType}
Expected Players: ${playerCount}
Java Version: ${javaVersion}
RAM: ${ram}GB

Include: server.properties, recommended plugins/mods, performance tuning, startup script, and security configuration.`,
          options: { software, serverType, playerCount, javaVersion, ram },
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
          <span className="text-3xl">🖥️</span>
          <div>
            <h1 className="text-2xl font-black">Server Setup Wizard</h1>
            <p className="text-sm text-foreground/50">Get a complete, optimized server configuration</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Server Software</label>
                <div className="grid grid-cols-2 gap-2">
                  {serverSoftware.map((s) => (
                    <button key={s} onClick={() => setSoftware(s)} className={`p-3 rounded-xl text-sm font-medium border transition-all ${software === s ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border hover:border-primary/20"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Server Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {serverTypes.map((t) => (
                    <button key={t} onClick={() => setServerType(t)} className={`p-3 rounded-xl text-sm font-medium border transition-all ${serverType === t ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border hover:border-primary/20"}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Expected Players</label>
                <select value={playerCount} onChange={(e) => setPlayerCount(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {playerCounts.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Java Version</label>
                <select value={javaVersion} onChange={(e) => setJavaVersion(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  <option value="17">Java 17</option>
                  <option value="21">Java 21</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">RAM (GB)</label>
                <select value={ram} onChange={(e) => setRam(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {["2", "4", "6", "8", "12", "16", "32"].map((r) => (<option key={r} value={r}>{r}GB</option>))}
                </select>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "🖥️ Generating Setup..." : "🖥️ Generate Server Config"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Server Configuration Generated!</p>
              <p className="text-xs text-foreground/50 mt-1">{software} • {serverType} • {playerCount} players • {ram}GB RAM</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">server-setup-guide.md</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">New Setup</button>
          </div>
        )}
      </div>
    </div>
  );
}
