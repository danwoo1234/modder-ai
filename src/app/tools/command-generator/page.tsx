"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

const commandTypes = ["Teleport", "Give Item", "Summon Entity", "Scoreboard", "Boss Bar", "Particle", "Title/Subtitle", "World Border", "Execute Chain"];
const outputFormats = ["Plugin Command (Java)", "Datapack Function (mcfunction)", "Command Block"];

export default function CommandGeneratorPage() {
  return (
    <AuthGate requiredTier="free">
      <CommandGenerator />
    </AuthGate>
  );
}

function CommandGenerator() {
  const { data: session } = useSession();
  const [commandType, setCommandType] = useState("Teleport");
  const [description, setDescription] = useState("");
  const [outputFormat, setOutputFormat] = useState("Plugin Command (Java)");
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
          toolId: "command-generator",
          prompt: `Generate a Minecraft command:
Type: ${commandType}
Description: ${description}
Output format: ${outputFormat}

Include proper permission checks, argument parsing, tab completion, and error handling.`,
          options: { commandType, outputFormat },
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
          <span className="text-3xl">💻</span>
          <div>
            <h1 className="text-2xl font-black">Command Generator</h1>
            <p className="text-sm text-foreground/50">Generate complex commands & datapack functions with AI</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Command Type</label>
              <div className="grid grid-cols-3 gap-2">
                {commandTypes.map((ct) => (
                  <button key={ct} onClick={() => setCommandType(ct)} className={`p-3 rounded-lg text-sm border transition-colors ${commandType === ct ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                    {ct}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Describe what the command should do</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Example: A /fly command that toggles creative flight for survival players with a 30 second cooldown..." className="w-full h-32 p-4 rounded-xl bg-surface border border-border text-foreground text-sm resize-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/70 mb-2 block">Output Format</label>
              <div className="flex gap-2">
                {outputFormats.map((fmt) => (
                  <button key={fmt} onClick={() => setOutputFormat(fmt)} className={`flex-1 p-3 rounded-lg text-sm border transition-colors ${outputFormat === fmt ? "bg-primary/20 border-primary/40 text-primary-light" : "bg-surface border-border text-foreground/50 hover:border-primary/30"}`}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleGenerate} disabled={!description.trim() || loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg hover:opacity-90 disabled:opacity-40">
              {loading ? "💻 Generating..." : "💻 Generate Command"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-success/10 border border-success/20 p-4">
              <p className="font-bold text-success">✅ Command Generated!</p>
            </div>
            <div className="code-editor rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                <span className="text-xs text-foreground/40">{outputFormat}</span>
                <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs text-primary-light hover:text-primary">Copy</button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{result}</code></pre>
            </div>
            <button onClick={() => setResult(null)} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30">Generate Another Command</button>
          </div>
        )}
      </div>
    </div>
  );
}
