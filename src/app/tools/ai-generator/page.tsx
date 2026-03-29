"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AdBanner from "@/components/AdBanner";
import AuthGate from "@/components/AuthGate";
import { platforms, mcVersions } from "@/lib/tools";

type GenStep = "input" | "generating" | "result";

const modTemplates = [
  { name: "Survival Plugin", desc: "Custom survival features", prompt: "Create a survival plugin with custom crafting recipes, land claiming, and a home system" },
  { name: "Economy System", desc: "Full economy with shops", prompt: "Create an economy plugin with virtual currency, player shops, auction house, and admin commands" },
  { name: "PvP Arena", desc: "PvP arena with kits", prompt: "Create a PvP arena plugin with multiple arenas, kit selection, ELO ranking, and spectator mode" },
  { name: "Custom Mobs", desc: "AI-driven custom mobs", prompt: "Create a custom mobs plugin with 5 unique boss mobs, special abilities, drop tables, and spawn conditions" },
  { name: "Teleportation", desc: "Warps & teleports", prompt: "Create a teleportation plugin with /home, /warp, /tpa, /spawn commands with cooldowns and permissions" },
  { name: "Chat System", desc: "Advanced chat formatting", prompt: "Create a chat plugin with ranks, colors, channels, private messages, and chat filter" },
];

interface GeneratedFile {
  name: string;
  path: string;
  content: string;
}

export default function AIGenerator() {
  const { data: session } = useSession();
  const userTier = ((session?.user as Record<string, unknown>)?.tier as string) || "free";

  const [step, setStep] = useState<GenStep>("input");
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("Paper");
  const [version, setVersion] = useState("1.21");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"code" | "plugin.yml" | "jar">("code");
  const [error, setError] = useState<string | null>(null);

  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [pluginName, setPluginName] = useState("");
  const [modelUsed, setModelUsed] = useState("");
  const [generationsUsed, setGenerationsUsed] = useState(0);
  const [generationsLimit, setGenerationsLimit] = useState(1);
  const [jarData, setJarData] = useState<string | null>(null);
  const [jarSize, setJarSize] = useState("");
  const [buildingJar, setBuildingJar] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!session?.user) {
      signIn("google");
      return;
    }

    setStep("generating");
    setProgress(0);
    setError(null);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 90));
    }, 500);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform, version }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        setStep("input");
        return;
      }

      setProgress(100);
      setGeneratedFiles(data.data.files);
      setPluginName(data.data.pluginName);
      setModelUsed(data.data.model);
      setGenerationsUsed(data.data.generationsUsed || 0);
      setGenerationsLimit(data.data.generationsLimit || 1);

      setTimeout(() => setStep("result"), 500);
    } catch {
      clearInterval(interval);
      setError("Network error — please try again");
      setStep("input");
    }
  };

  const handleBuildJar = async () => {
    if (!generatedFiles.length) return;
    setBuildingJar(true);
    try {
      const res = await fetch("/api/build-jar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginName, files: generatedFiles, platform, version }),
      });
      const data = await res.json();
      if (data.success && data.data.jarBase64) {
        setJarData(data.data.jarBase64);
        setJarSize(data.data.size);
      }
    } catch {
      setError("JAR build failed");
    } finally {
      setBuildingJar(false);
    }
  };

  const handleDownloadJar = () => {
    if (!jarData) return;
    const link = document.createElement("a");
    link.href = `data:application/java-archive;base64,${jarData}`;
    link.download = `${pluginName}.jar`;
    link.click();
  };

  const handleReset = () => {
    setStep("input");
    setPrompt("");
    setProgress(0);
    setError(null);
    setGeneratedFiles([]);
    setJarData(null);
  };

  const mainFile = generatedFiles.find((f) => f.name.endsWith(".java"));
  const ymlFile = generatedFiles.find((f) => f.name === "plugin.yml");

  return (
    <AuthGate requiredTier="free">
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">⚡</span>
              <div>
                <h1 className="text-2xl font-black">AI Mod Generator</h1>
                <p className="text-sm text-foreground/50">Describe your mod and let AI build it — auto-compiled to JAR</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === "input" && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground/70 mb-2 block">Quick Templates</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {modTemplates.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => setPrompt(t.prompt)}
                        className="text-left p-3 rounded-lg bg-surface border border-border hover:border-primary/30 transition-colors"
                      >
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-foreground/40">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/70 mb-2 block">Platform / Loader</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary/50">
                      {platforms.map((p) => (<option key={p} value={p}>{p}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70 mb-2 block">Minecraft Version</label>
                    <select value={version} onChange={(e) => setVersion(e.target.value)} className="w-full p-3 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary/50">
                      {mcVersions.map((v) => (<option key={v} value={v}>{v}</option>))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/70 mb-2 block">Describe your mod / plugin</label>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Example: Create a teleportation plugin with /home, /sethome, /spawn commands. Include cooldowns, permissions, and a config file for settings..." className="w-full h-40 p-4 rounded-xl bg-surface border border-border text-foreground text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-foreground/30" />
                  <p className="text-xs text-foreground/40 mt-1">Be as detailed as possible. Include specific features, commands, and behaviors you want.</p>
                </div>

                <button onClick={handleGenerate} disabled={!prompt.trim()} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {session?.user ? `⚡ Generate Mod (${platform} ${version})` : "Sign In to Generate"}
                </button>

                <p className="text-xs text-center text-foreground/30">
                  {userTier === "free" ? "Free tier: 1 generation / month (GPT-5 Mini) • Upgrade to Pro for unlimited" : userTier === "pro" ? "Pro tier: Unlimited generation (GPT-5.2 Pro)" : "VIP tier: Unlimited generation (Claude Opus 4.6)"}
                </p>
              </div>
            )}

            {step === "generating" && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-6 animate-float">⛏️</div>
                <h2 className="text-xl font-bold mb-2">Generating Your Mod...</h2>
                <p className="text-sm text-foreground/50 mb-8">AI is writing real code for {platform} {version}</p>
                <div className="w-full max-w-md mb-4">
                  <div className="h-3 rounded-full bg-surface-light overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-foreground/50">
                  {progress > 10 && <p className="animate-pulse">✅ Sending to AI model...</p>}
                  {progress > 30 && <p className="animate-pulse">✅ Generating Java code...</p>}
                  {progress > 50 && <p className="animate-pulse">✅ Creating plugin.yml...</p>}
                  {progress > 70 && <p className="animate-pulse">✅ Finalizing output...</p>}
                </div>
              </div>
            )}

            {step === "result" && (
              <div className="space-y-6">
                <div className="rounded-xl bg-success/10 border border-success/20 p-4 flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-bold text-success">Mod Generated Successfully!</p>
                    <p className="text-sm text-foreground/50">{pluginName} — {platform} {version} — Model: {modelUsed}</p>
                  </div>
                </div>

                <div className="flex gap-1 bg-surface-light rounded-lg p-1">
                  {(["code", "plugin.yml", "jar"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"}`}>
                      {tab === "code" ? "📄 Main Code" : tab === "plugin.yml" ? "📋 plugin.yml" : "📦 JAR Download"}
                    </button>
                  ))}
                </div>

                {activeTab === "code" && mainFile && (
                  <div className="code-editor rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                      <span className="text-xs text-foreground/40">{mainFile.name}</span>
                      <button onClick={() => navigator.clipboard.writeText(mainFile.content)} className="text-xs text-primary-light hover:text-primary transition-colors">Copy Code</button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed max-h-[500px] overflow-y-auto"><code>{mainFile.content}</code></pre>
                  </div>
                )}

                {activeTab === "plugin.yml" && ymlFile && (
                  <div className="code-editor rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-surface-light border-b border-border">
                      <span className="text-xs text-foreground/40">plugin.yml</span>
                      <button onClick={() => navigator.clipboard.writeText(ymlFile.content)} className="text-xs text-primary-light hover:text-primary transition-colors">Copy</button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm text-foreground/80 leading-relaxed"><code>{ymlFile.content}</code></pre>
                  </div>
                )}

                {activeTab === "jar" && (
                  <div className="rounded-xl bg-surface border border-border p-8 text-center">
                    <span className="text-5xl mb-4 block">📦</span>
                    <h3 className="text-xl font-bold mb-2">{pluginName}.jar</h3>
                    <p className="text-sm text-foreground/50 mb-1">Auto-compiled JAR file</p>
                    <p className="text-xs text-foreground/40 mb-6">Platform: {platform} | Version: {version} {jarSize && `| Size: ${jarSize}`}</p>

                    {!jarData && !buildingJar && (
                      <button onClick={handleBuildJar} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-opacity">🔨 Build JAR</button>
                    )}
                    {buildingJar && (
                      <div className="flex items-center justify-center gap-2 text-primary-light">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-sm">Compiling...</span>
                      </div>
                    )}
                    {jarData && (
                      <button onClick={handleDownloadJar} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-opacity">⬇️ Download {pluginName}.jar</button>
                    )}
                    <p className="text-xs text-foreground/30 mt-4">Drop this JAR into your server&apos;s plugins/ folder and restart</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30 transition-colors">⚡ Generate Another</button>
                  <button onClick={() => { if (mainFile) { const blob = new Blob([mainFile.content], { type: "text/java" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = mainFile.name; a.click(); URL.revokeObjectURL(url); } }} className="flex-1 py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30 transition-colors">💾 Download Source</button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-72 space-y-4">
            {userTier === "free" && <AdBanner slot="generator-sidebar" />}
            <div className="rounded-xl bg-surface border border-border p-4">
              <h3 className="font-bold text-sm mb-3">Generation Info</h3>
              <div className="space-y-2 text-xs text-foreground/50">
                <div className="flex justify-between"><span>Model</span><span className="text-foreground/70">{userTier === "vip" ? "Claude Opus 4.6" : userTier === "pro" ? "GPT-5.2 Pro" : "GPT-5 Mini"}</span></div>
                <div className="flex justify-between"><span>Platform</span><span className="text-foreground/70">{platform}</span></div>
                <div className="flex justify-between"><span>MC Version</span><span className="text-foreground/70">{version}</span></div>
                <div className="flex justify-between"><span>Auto-JAR</span><span className="text-success">Available</span></div>
                {session?.user && <div className="flex justify-between"><span>Used</span><span className={generationsUsed >= generationsLimit ? "text-red-400" : "text-foreground/70"}>{generationsUsed} / {generationsLimit === 999999 ? "∞" : generationsLimit}</span></div>}
              </div>
            </div>
            {userTier === "free" && (
              <div className="rounded-xl bg-gradient-to-b from-primary/10 to-surface border border-primary/20 p-4">
                <h3 className="font-bold text-sm mb-2">⬆️ Upgrade to Pro</h3>
                <p className="text-xs text-foreground/50 mb-3">Unlock unlimited generation with GPT-5.2 Pro.</p>
                <a href="/pricing" className="block text-center py-2 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity">$19/mo — Upgrade</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AuthGate>
  );
}
