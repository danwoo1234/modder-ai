"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

type SlotState = "empty" | "item" | "glass" | "button" | "border";
const slotColors: Record<SlotState, string> = {
  empty: "bg-gray-800/50 border-gray-700",
  item: "bg-amber-500/30 border-amber-500/50",
  glass: "bg-cyan-500/20 border-cyan-500/40",
  button: "bg-green-500/30 border-green-500/50",
  border: "bg-gray-600/40 border-gray-500/50",
};
const slotLabels: Record<SlotState, string> = {
  empty: "", item: "📦", glass: "🔷", button: "🟢", border: "⬛",
};

const guiSizes = [
  { rows: 1, label: "1 row (9 slots)" },
  { rows: 2, label: "2 rows (18 slots)" },
  { rows: 3, label: "3 rows (27 slots)" },
  { rows: 4, label: "4 rows (36 slots)" },
  { rows: 5, label: "5 rows (45 slots)" },
  { rows: 6, label: "6 rows (54 slots)" },
];

export default function GuiBuilderPage() {
  return (
    <AuthGate requiredTier="pro">
      <GuiBuilder />
    </AuthGate>
  );
}

function GuiBuilder() {
  const { data: session } = useSession();
  const [guiName, setGuiName] = useState("Custom Menu");
  const [rows, setRows] = useState(3);
  const [slots, setSlots] = useState<SlotState[]>(Array(27).fill("empty"));
  const [activeTool, setActiveTool] = useState<SlotState>("item");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const updateRows = (newRows: number) => {
    setRows(newRows);
    const size = newRows * 9;
    setSlots((prev) => {
      const next = Array(size).fill("empty") as SlotState[];
      prev.forEach((s, i) => { if (i < size) next[i] = s; });
      return next;
    });
  };

  const paint = (i: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[i] = next[i] === activeTool ? "empty" : activeTool;
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!session?.user) { signIn("google"); return; }
    setLoading(true);
    setError(null);

    const grid = [];
    for (let r = 0; r < rows; r++) {
      const row = slots.slice(r * 9, r * 9 + 9);
      grid.push(row.map((s, col) => `[${r},${col}]=${s}`).join(" "));
    }

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "gui-builder",
          prompt: `Generate a complete Bukkit/Paper inventory GUI plugin for "${guiName}" with ${rows} rows.

Layout grid:
${grid.join("\n")}

Legend: item=clickable item slot, glass=decorative glass pane, button=interactive button, border=border decoration, empty=empty slot.

Generate a complete Java plugin with InventoryHolder, click event handling, and proper item placement matching the grid layout.`,
          options: { guiName, rows, slots },
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

  const tools: { type: SlotState; label: string; color: string }[] = [
    { type: "item", label: "📦 Item", color: "bg-amber-500/20 border-amber-500/40" },
    { type: "glass", label: "🔷 Glass", color: "bg-cyan-500/20 border-cyan-500/40" },
    { type: "button", label: "🟢 Button", color: "bg-green-500/20 border-green-500/40" },
    { type: "border", label: "⬛ Border", color: "bg-gray-500/20 border-gray-500/40" },
    { type: "empty", label: "🚫 Erase", color: "bg-red-500/20 border-red-500/40" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🖼️</span>
          <div>
            <h1 className="text-2xl font-black">GUI Builder</h1>
            <p className="text-sm text-foreground/50">Visual inventory GUI designer</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={guiName} onChange={(e) => setGuiName(e.target.value)} placeholder="GUI name..." className="p-3 rounded-xl bg-surface border border-border text-foreground text-sm focus:border-primary/40 outline-none" />
              <select value={rows} onChange={(e) => updateRows(Number(e.target.value))} className="p-3 rounded-xl bg-surface border border-border text-foreground text-sm">
                {guiSizes.map((s) => (<option key={s.rows} value={s.rows}>{s.label}</option>))}
              </select>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <button key={t.type} onClick={() => setActiveTool(t.type)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${activeTool === t.type ? t.color + " ring-2 ring-white/20" : "bg-surface border-border opacity-60 hover:opacity-100"}`}>{t.label}</button>
              ))}
            </div>

            {/* Grid */}
            <div className="rounded-xl bg-surface border border-border p-4 overflow-x-auto">
              <div className="inline-grid grid-cols-9 gap-1" style={{ minWidth: 360 }}>
                {slots.map((s, i) => (
                  <button key={i} onClick={() => paint(i)} className={`w-10 h-10 rounded border text-sm flex items-center justify-center transition-all hover:scale-110 ${slotColors[s]}`}>
                    {slotLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "🖼️ Generating GUI Plugin..." : "🖼️ Export to Java Plugin"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ GUI Plugin Generated!</p>
              <p className="text-xs text-foreground/50 mt-1">{guiName} • {rows} rows • {rows * 9} slots</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">{guiName.replace(/\s/g, "")}GUI.java</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => { setResult(null); setSlots(Array(rows * 9).fill("empty")); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Design New GUI</button>
          </div>
        )}
      </div>
    </div>
  );
}
