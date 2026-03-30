"use client";

import { useSession, signIn } from "next-auth/react";

interface AuthGateProps {
  children: React.ReactNode;
  requiredTier?: "free" | "pro" | "vip";
}

export default function AuthGate({ children, requiredTier = "free" }: AuthGateProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">⛏️</div>
          <p className="text-sm text-foreground/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <span className="text-5xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-black mb-2">Sign In Required</h1>
          <p className="text-sm text-foreground/50 mb-6">
            Sign in to access this tool{requiredTier !== "free" ? ` (requires ${requiredTier.toUpperCase()})` : ""}
          </p>
          <button
            onClick={() => signIn("google")}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:opacity-90 transition-opacity"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
