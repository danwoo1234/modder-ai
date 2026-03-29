"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const categories = ["Crafting", "Worldgen", "Loot Tables", "Advancements", "Tags", "Predicates", "Item Modifiers", "Dimensions"];
const mcVersions = ["1.21", "1.20.4", "1.20.2", "1.19.4"];

export default function DatapackLibraryPage() {
  return (
    <AuthGate requiredTier="free">
      <DatapackLibrary />
    </AuthGate>
  );
}

function DatapackLibrary() {
  const { data: session } = useSession();
  const [namespace, setNamespace] = useState("mypack");
  const [category, setCategory] = useState("Crafting");
  const [mcVersion, setMcVersion] = useState("1.21");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "datapack-library",
          prompt: `Create a Minecraft ${mcVersion} datapack in the "${category}" category.
Namespace: ${namespace}
Description: ${description}

Generate the complete datapack structure with all necessary JSON files. Include pack.mcmeta, and all data files with proper folder structure.`,
          options: { namespace, category, mcVersion, description },
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
          <span className="text-3xl">📦</span>
          <div>
            <h1 className="text-2xl font-black">Datapack Library</h1>
            <p className="text-sm text-foreground/50">Generate complete datapack files with AI</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Namespace</label>
                <input value={namespace} onChange={(e) => setNamespace(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary/40 outline-none" placeholder="mypack" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">MC Version</label>
                <select value={mcVersion} onChange={(e) => setMcVersion(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {mcVersions.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`p-3 rounded-xl text-sm font-medium border transition-all ${category === c ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-surface border-border hover:border-cyan-500/20"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">What should the datapack do?</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-4 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary/40 outline-none resize-none" placeholder="e.g., Add custom recipes for diamond tools using copper ingots..." />
            </div>

            <button onClick={handleGenerate} disabled={!description.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "📦 Generating Datapack..." : "📦 Generate Datapack"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Datapack Generated!</p>
              <p className="text-xs text-foreground/50 mt-1">{namespace} • {category} • MC {mcVersion}</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">{namespace}/</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[600px] overflow-y-auto whitespace-pre-wrap"><code>{result}</code></pre>
            </div>
            <button onClick={() => { setResult(null); setDescription(""); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Create Another Datapack</button>
          </div>
        )}
      </div>
    </div>
  );
}
