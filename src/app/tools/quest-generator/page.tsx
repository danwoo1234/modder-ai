"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const questTypes = ["Main Story", "Side Quest", "Daily Challenge", "Boss Fight", "Puzzle", "Escort", "Collection", "Exploration"];
const difficulties = ["Easy", "Normal", "Hard", "Legendary"];

export default function QuestGeneratorPage() {
  return (
    <AuthGate requiredTier="pro">
      <QuestGenerator />
    </AuthGate>
  );
}

function QuestGenerator() {
  const { data: session } = useSession();
  const [questName, setQuestName] = useState("");
  const [questType, setQuestType] = useState("Main Story");
  const [difficulty, setDifficulty] = useState("Normal");
  const [description, setDescription] = useState("");
  const [npcCount, setNpcCount] = useState(3);
  const [branching, setBranching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!questName.trim()) return;
    if (!session?.user) { signIn("google"); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "quest-generator",
          prompt: `Generate a Minecraft quest system:
Name: ${questName}
Type: ${questType}
Difficulty: ${difficulty}
Description: ${description}
Number of NPCs: ${npcCount}
Branching storyline: ${branching ? "Yes" : "No"}`,
          options: { questType, difficulty, npcCount, branching },
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data.data.content);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📜</span>
          <div>
            <h1 className="text-2xl font-black">Quest Generator</h1>
            <p className="text-sm text-foreground/50">AI-powered quest & story system builder</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Quest Name</label>
              <input value={questName} onChange={(e) => setQuestName(e.target.value)} placeholder="The Dragon's Lair" className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Quest Type</label>
                <select value={questType} onChange={(e) => setQuestType(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm">
                  {questTypes.map((qt) => (<option key={qt} value={qt}>{qt}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm">
                  {difficulties.map((d) => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Quest Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the story, objectives, and setting..." className="w-full h-32 p-4 rounded-xl bg-surface border border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">NPC Count: {npcCount}</label>
                <input type="range" min={1} max={10} value={npcCount} onChange={(e) => setNpcCount(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-foreground/70">
                  <input type="checkbox" checked={branching} onChange={(e) => setBranching(e.target.checked)} className="accent-primary" />
                  Branching Storyline
                </label>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!questName.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-40">
              {loading ? "📜 Generating Quest..." : "📜 Generate Quest System"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Quest Generated!</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">Quest Configuration (JSON)</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30 transition-colors">Generate Another Quest</button>
          </div>
        )}
      </div>
    </div>
  );
}
