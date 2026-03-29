"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];
const abilities = ["Fire Aspect", "Life Steal", "Lightning Strike", "Teleport", "Shield", "Speed Boost", "Poison Cloud", "Knockback Wave"];

export default function ItemCreatorPage() {
  return (
    <AuthGate requiredTier="free">
      <ItemCreator />
    </AuthGate>
  );
}

function ItemCreator() {
  const { data: session } = useSession();
  const [itemName, setItemName] = useState("");
  const [rarity, setRarity] = useState("Rare");
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [damage, setDamage] = useState(10);
  const [cooldown, setCooldown] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const toggleAbility = (ab: string) => {
    setSelectedAbilities((prev) => prev.includes(ab) ? prev.filter((a) => a !== ab) : [...prev, ab]);
  };

  const handleGenerate = async () => {
    if (!itemName.trim()) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "item-creator",
          prompt: `Create a custom Minecraft item:
Name: ${itemName}
Rarity: ${rarity}
Abilities: ${selectedAbilities.join(", ") || "None"}
Description/Lore: ${description}
Base Damage: ${damage}
Ability Cooldown: ${cooldown}s

Generate complete Java code for a Bukkit/Spigot plugin that creates this custom item with all specified abilities, proper cooldowns, particle effects, and sound effects.`,
          options: { rarity, abilities: selectedAbilities, damage, cooldown },
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
          <span className="text-3xl">⚔️</span>
          <div>
            <h1 className="text-2xl font-black">Item Creator</h1>
            <p className="text-sm text-foreground/50">Create custom items with special abilities</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Item Name</label>
                <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Blade of the Thunder God" className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Rarity</label>
                <select value={rarity} onChange={(e) => setRarity(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm">
                  {rarities.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Abilities</label>
              <div className="flex flex-wrap gap-2">
                {abilities.map((ab) => (
                  <button key={ab} onClick={() => toggleAbility(ab)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedAbilities.includes(ab) ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                    {ab}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Description / Lore</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Forged in the heart of a dying star..." className="w-full h-24 p-3 rounded-xl bg-surface border border-border text-foreground text-sm resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Base Damage: {damage}</label>
                <input type="range" min={1} max={50} value={damage} onChange={(e) => setDamage(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70 mb-2 block">Cooldown: {cooldown}s</label>
                <input type="range" min={0} max={60} value={cooldown} onChange={(e) => setCooldown(Number(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!itemName.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "⚔️ Creating Item..." : "⚔️ Create Custom Item"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Item Created!</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">{itemName}Item.java</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Create Another Item</button>
          </div>
        )}
      </div>
    </div>
  );
}
