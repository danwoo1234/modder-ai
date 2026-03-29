"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const presets = [
  { id: "performance", name: "Performance", desc: "Optimized for smooth gameplay", icon: "⚡" },
  { id: "adventure", name: "Adventure", desc: "Quests, RPG mechanics, exploration", icon: "🗺️" },
  { id: "tech", name: "Technical", desc: "Redstone, automation, factories", icon: "⚙️" },
  { id: "magic", name: "Magic & Fantasy", desc: "Spells, enchantments, dimensions", icon: "🔮" },
  { id: "building", name: "Building", desc: "Decorations, furniture, structures", icon: "🏗️" },
  { id: "hardcore", name: "Hardcore", desc: "Difficulty, realism, survival", icon: "💀" },
];

const loaders = ["Forge", "Fabric", "NeoForge", "Quilt"];
const mcVersions = ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"];

export default function ModpackCreatorPage() {
  return (
    <AuthGate requiredTier="pro">
      <ModpackCreator />
    </AuthGate>
  );
}

function ModpackCreator() {
  const { data: session } = useSession();
  const [packName, setPackName] = useState("");
  const [preset, setPreset] = useState("adventure");
  const [loader, setLoader] = useState("Fabric");
  const [mcVersion, setMcVersion] = useState("1.21");
  const [modCount, setModCount] = useState("30");
  const [extras, setExtras] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!packName.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "modpack-creator",
          prompt: `Create a complete Minecraft modpack configuration called "${packName}":
- Preset: ${presets.find((p) => p.id === preset)?.name}
- Mod Loader: ${loader}
- MC Version: ${mcVersion}
- Target Mod Count: ~${modCount} mods
${extras ? `- Extra Requirements: ${extras}` : ""}

Generate a detailed modpack manifest with: mod list (name + CurseForge/Modrinth slug + why it's included), recommended config tweaks, load order notes, compatibility warnings, and performance tips. Format as a structured guide.`,
          options: { packName, preset, loader, mcVersion, modCount, extras },
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
          <span className="text-3xl">📁</span>
          <div>
            <h1 className="text-2xl font-black">Modpack Creator</h1>
            <p className="text-sm text-foreground/50">AI-curated modpack configurations</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <input value={packName} onChange={(e) => setPackName(e.target.value)} placeholder="Modpack name..." className="w-full p-4 rounded-xl bg-surface border border-border text-foreground text-lg focus:border-primary/40 outline-none" />

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Preset</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {presets.map((p) => (
                  <button key={p.id} onClick={() => setPreset(p.id)} className={`p-4 rounded-xl text-left border transition-all ${preset === p.id ? "bg-primary/20 border-primary/40" : "bg-surface border-border hover:border-primary/20"}`}>
                    <span className="text-xl">{p.icon}</span>
                    <p className="font-bold text-sm mt-1">{p.name}</p>
                    <p className="text-xs text-foreground/50">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Mod Loader</label>
                <div className="grid grid-cols-2 gap-2">
                  {loaders.map((l) => (
                    <button key={l} onClick={() => setLoader(l)} className={`p-2 rounded-xl text-xs font-medium border transition-all ${loader === l ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border hover:border-primary/20"}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">MC Version</label>
                <select value={mcVersion} onChange={(e) => setMcVersion(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {mcVersions.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">~Mod Count</label>
                <select value={modCount} onChange={(e) => setModCount(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {["15", "30", "50", "75", "100", "150+"].map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>

            <textarea value={extras} onChange={(e) => setExtras(e.target.value)} rows={3} className="w-full p-4 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary/40 outline-none resize-none" placeholder="Extra requirements or must-have mods (optional)..." />

            <button onClick={handleGenerate} disabled={!packName.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "📁 Curating Mods..." : "📁 Generate Modpack"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Modpack Configuration Ready!</p>
              <p className="text-xs text-foreground/50 mt-1">{packName} • {loader} • MC {mcVersion}</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">modpack-guide.md</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap"><code>{result}</code></pre>
            </div>
            <button onClick={() => { setResult(null); setPackName(""); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Create Another Modpack</button>
          </div>
        )}
      </div>
    </div>
  );
}
