"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const textureTypes = ["Block", "Item", "Mob/Entity", "Armor", "GUI", "Particle"];
const styles = ["Vanilla", "Faithful 32x", "Modern HD", "Pixel Art", "Fantasy", "Sci-Fi"];
const resolutions = ["16x16", "32x32", "64x64", "128x128"];

export default function TextureGeneratorPage() {
  return (
    <AuthGate requiredTier="pro">
      <TextureGenerator />
    </AuthGate>
  );
}

function TextureGenerator() {
  const { data: session } = useSession();
  const [textureType, setTextureType] = useState("Block");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("Vanilla");
  const [resolution, setResolution] = useState("16x16");
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
          toolId: "texture-generator",
          prompt: `Generate a Minecraft texture specification:
Type: ${textureType}
Description: ${description}
Style: ${style}
Resolution: ${resolution}

Provide a detailed color palette with hex values and a pixel-by-pixel description for each row of the texture.`,
          options: { textureType, style, resolution },
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
          <span className="text-3xl">🎨</span>
          <div>
            <h1 className="text-2xl font-black">Texture Generator</h1>
            <p className="text-sm text-foreground/50">AI-generated texture specifications for resource packs</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {textureTypes.map((tt) => (
                <button key={tt} onClick={() => setTextureType(tt)} className={`p-3 rounded-lg text-sm border transition-colors ${textureType === tt ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                  {tt}
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the texture you want... e.g., 'A crystalline ice block with blue and white gradients, frosted corners'" className="w-full h-32 p-4 rounded-xl bg-surface border border-border text-foreground text-sm resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm">
                  {styles.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm">
                  {resolutions.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!description.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "🎨 Generating..." : "🎨 Generate Texture Spec"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Texture Specification Generated!</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">texture_spec.json</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Generate Another Texture</button>
          </div>
        )}
      </div>
    </div>
  );
}
