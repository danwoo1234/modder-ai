"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";
import { platforms } from "@/lib/tools";

type Block = { id: string; type: "event" | "condition" | "action"; label: string };

const eventBlocks: Block[] = [
  { id: "player-join", type: "event", label: "On Player Join" },
  { id: "player-break", type: "event", label: "On Block Break" },
  { id: "player-click", type: "event", label: "On Right Click" },
  { id: "player-chat", type: "event", label: "On Chat Message" },
  { id: "entity-death", type: "event", label: "On Entity Death" },
  { id: "player-move", type: "event", label: "On Player Move" },
];

const conditionBlocks: Block[] = [
  { id: "has-perm", type: "condition", label: "Has Permission" },
  { id: "is-op", type: "condition", label: "Is OP" },
  { id: "holding-item", type: "condition", label: "Holding Item" },
  { id: "in-world", type: "condition", label: "In World" },
  { id: "health-check", type: "condition", label: "Health Check" },
];

const actionBlocks: Block[] = [
  { id: "send-msg", type: "action", label: "Send Message" },
  { id: "teleport", type: "action", label: "Teleport" },
  { id: "give-item", type: "action", label: "Give Item" },
  { id: "play-sound", type: "action", label: "Play Sound" },
  { id: "spawn-particle", type: "action", label: "Spawn Particle" },
  { id: "run-command", type: "action", label: "Run Command" },
];

export default function BlockScriptPage() {
  return (
    <AuthGate requiredTier="free">
      <BlockScript />
    </AuthGate>
  );
}

function BlockScript() {
  const { data: session } = useSession();
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const [platform, setPlatform] = useState("Paper");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const addBlock = (block: Block) => {
    setSelectedBlocks((prev) => [...prev, block]);
  };

  const removeBlock = (index: number) => {
    setSelectedBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (selectedBlocks.length === 0) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    const blockDescription = selectedBlocks
      .map((b) => `[${b.type.toUpperCase()}] ${b.label}`)
      .join("\n");

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "block-script",
          prompt: `Convert this block-based script to a ${platform} Java plugin:

Block Script:
${blockDescription}

Generate a complete, working Java plugin that implements all these blocks in order.`,
          options: { platform, blocks: selectedBlocks },
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

  const typeColors = { event: "bg-blue-500/20 border-blue-500/40 text-blue-300", condition: "bg-yellow-500/20 border-yellow-500/40 text-yellow-300", action: "bg-green-500/20 border-green-500/40 text-green-300" };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🧩</span>
          <div>
            <h1 className="text-2xl font-black">Block Script Playground</h1>
            <p className="text-sm text-foreground/50">Visual block-based coding — no code needed</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Block Palette */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm">📘 Events</h3>
              <div className="space-y-1">
                {eventBlocks.map((b) => (
                  <button key={b.id} onClick={() => addBlock(b)} className="w-full text-left p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/20 transition-colors">+ {b.label}</button>
                ))}
              </div>
              <h3 className="font-bold text-sm">🔶 Conditions</h3>
              <div className="space-y-1">
                {conditionBlocks.map((b) => (
                  <button key={b.id} onClick={() => addBlock(b)} className="w-full text-left p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm hover:bg-yellow-500/20 transition-colors">+ {b.label}</button>
                ))}
              </div>
              <h3 className="font-bold text-sm">🟢 Actions</h3>
              <div className="space-y-1">
                {actionBlocks.map((b) => (
                  <button key={b.id} onClick={() => addBlock(b)} className="w-full text-left p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-sm hover:bg-green-500/20 transition-colors">+ {b.label}</button>
                ))}
              </div>
            </div>

            {/* Script Canvas */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Your Script</h3>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="p-2 rounded-lg bg-surface border border-border text-foreground text-xs">
                  {platforms.slice(0, 6).map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>

              <div className="min-h-[300px] rounded-xl bg-surface border border-border p-4">
                {selectedBlocks.length === 0 ? (
                  <p className="text-sm text-foreground/30 text-center py-20">Click blocks from the palette to build your script</p>
                ) : (
                  <div className="space-y-2">
                    {selectedBlocks.map((b, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${typeColors[b.type]}`}>
                        <span className="text-sm font-medium">{b.label}</span>
                        <button onClick={() => removeBlock(i)} className="text-xs opacity-50 hover:opacity-100">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleGenerate} disabled={selectedBlocks.length === 0 || loading} className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
                {loading ? "🧩 Generating Java Code..." : `🧩 Export to ${platform} Java`}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Java Code Generated from Block Script!</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">BlockScriptPlugin.java</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => { setResult(null); setSelectedBlocks([]); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Create New Script</button>
          </div>
        )}
      </div>
    </div>
  );
}
