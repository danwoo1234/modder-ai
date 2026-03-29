"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const gameTypes = ["PvP Arena", "Capture the Flag", "Spleef", "Bedwars", "Parkour", "TNT Run", "Hunger Games", "Build Battle", "Murder Mystery", "Hide & Seek"];
const teamOptions = ["Solo (FFA)", "Duos", "Trios", "Squads (4)", "Teams (8)", "Custom"];

export default function MinigameCreatorPage() {
  return (
    <AuthGate requiredTier="pro">
      <MinigameCreator />
    </AuthGate>
  );
}

function MinigameCreator() {
  const { data: session } = useSession();
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState("PvP Arena");
  const [teams, setTeams] = useState("Solo (FFA)");
  const [maxPlayers, setMaxPlayers] = useState("16");
  const [duration, setDuration] = useState("10");
  const [features, setFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const featureOptions = ["Scoreboards", "Kits", "Spectator Mode", "Countdown Timer", "Power-ups", "Custom Arenas", "Statistics", "Party System"];

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const handleGenerate = async () => {
    if (!gameName.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "minigame-creator",
          prompt: `Create a complete ${gameType} minigame plugin called "${gameName}" with:
- Team format: ${teams}
- Max players: ${maxPlayers}
- Game duration: ${duration} minutes
- Features: ${features.length > 0 ? features.join(", ") : "Basic"}

Generate the full Java plugin code including game state management, arena handling, player tracking, and all specified features.`,
          options: { gameName, gameType, teams, maxPlayers, duration, features },
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
          <span className="text-3xl">🏟️</span>
          <div>
            <h1 className="text-2xl font-black">Minigame Creator</h1>
            <p className="text-sm text-foreground/50">Design complete minigame plugins with AI</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <input value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Minigame name..." className="w-full p-4 rounded-xl bg-surface border border-border text-foreground text-lg focus:border-primary/40 outline-none" />

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Game Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {gameTypes.map((t) => (
                  <button key={t} onClick={() => setGameType(t)} className={`p-2 rounded-xl text-xs font-medium border transition-all ${gameType === t ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-surface border-border hover:border-purple-500/20"}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Team Format</label>
                <select value={teams} onChange={(e) => setTeams(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                  {teamOptions.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Max Players</label>
                <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm" min="2" max="100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/60 mb-2">Duration (min)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 rounded-xl bg-surface border border-border text-foreground text-sm" min="1" max="60" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/60 mb-2">Extra Features</label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((f) => (
                  <button key={f} onClick={() => toggleFeature(f)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${features.includes(f) ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border hover:border-primary/20"}`}>{f}</button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!gameName.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "🏟️ Creating Minigame..." : "🏟️ Generate Minigame Plugin"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Minigame Plugin Generated!</p>
              <p className="text-xs text-foreground/50 mt-1">{gameName} • {gameType} • {teams}</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">{gameName.replace(/\s/g, "")}Plugin.java</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => { setResult(null); setGameName(""); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Create Another Minigame</button>
          </div>
        )}
      </div>
    </div>
  );
}
