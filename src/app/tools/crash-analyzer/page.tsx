"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthGate from "@/components/AuthGate";

export default function CrashAnalyzerPage() {
  return (
    <AuthGate requiredTier="free">
      <CrashAnalyzer />
    </AuthGate>
  );
}

function CrashAnalyzer() {
  const { data: session } = useSession();
  const [crashLog, setCrashLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    severity: string;
    rootCause: string;
    affectedPlugin: string | null;
    fixes: string[];
    conflicts: string[];
    codeRecommendation: string;
    prevention: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!crashLog.trim()) return;
    if (!session?.user) { signIn("google"); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "crash-analyzer",
          prompt: `Analyze this Minecraft crash log:\n\n${crashLog}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      try {
        const parsed = JSON.parse(data.data.content);
        setResult(parsed);
      } catch {
        setResult({
          severity: "unknown",
          rootCause: data.data.content,
          affectedPlugin: null,
          fixes: ["See analysis above"],
          conflicts: [],
          codeRecommendation: "",
          prevention: "",
        });
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const severityColors: Record<string, string> = {
    low: "text-green-400 bg-green-500/10 border-green-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-2xl font-black">Crash Analyzer</h1>
            <p className="text-sm text-foreground/50">Paste your crash log and AI will diagnose the issue</p>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        {!result && (
          <div className="space-y-4">
            <textarea
              value={crashLog}
              onChange={(e) => setCrashLog(e.target.value)}
              placeholder="Paste your Minecraft crash log, server log, or error message here..."
              className="w-full h-64 p-4 rounded-xl bg-surface border border-border text-foreground text-sm font-mono resize-none focus:outline-none focus:border-primary/50 placeholder:text-foreground/30"
            />
            <button
              onClick={handleAnalyze}
              disabled={!crashLog.trim() || loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg hover:opacity-90 transition-all disabled:opacity-40"
            >
              {loading ? "🔍 Analyzing..." : "🔍 Analyze Crash Log"}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className={`rounded-xl border p-4 ${severityColors[result.severity] || severityColors.medium}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">Severity: {result.severity?.toUpperCase()}</span>
                {result.affectedPlugin && <span className="text-sm">Plugin: {result.affectedPlugin}</span>}
              </div>
              <p className="text-sm">{result.rootCause}</p>
            </div>

            <div className="rounded-xl bg-surface border border-border p-6">
              <h3 className="font-bold mb-3">🔧 Fixes</h3>
              <ol className="space-y-2">
                {result.fixes.map((fix, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/70">
                    <span className="text-primary-light font-bold shrink-0">{i + 1}.</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ol>
            </div>

            {result.conflicts.length > 0 && (
              <div className="rounded-xl bg-surface border border-border p-6">
                <h3 className="font-bold mb-3">⚠️ Conflicts Detected</h3>
                <ul className="space-y-1">
                  {result.conflicts.map((c, i) => (
                    <li key={i} className="text-sm text-yellow-400">• {c}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.codeRecommendation && (
              <div className="rounded-xl bg-surface border border-border p-6">
                <h3 className="font-bold mb-3">💡 Code Recommendation</h3>
                <pre className="p-3 rounded-lg bg-background text-sm overflow-x-auto"><code>{result.codeRecommendation}</code></pre>
              </div>
            )}

            {result.prevention && (
              <div className="rounded-xl bg-surface border border-border p-6">
                <h3 className="font-bold mb-3">🛡️ Prevention</h3>
                <p className="text-sm text-foreground/70">{result.prevention}</p>
              </div>
            )}

            <button onClick={() => { setResult(null); setCrashLog(""); }} className="w-full py-3 rounded-xl bg-surface-light border border-border text-sm font-medium hover:border-primary/30 transition-colors">
              Analyze Another Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
