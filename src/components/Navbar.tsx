"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <span className="text-xl">⛏️</span>
          <span>Modder AI</span>
        </Link>

        <div className="hidden sm:flex items-center gap-5 text-sm">
          <Link href="/dashboard" className="text-foreground/60 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/gallery" className="text-foreground/60 hover:text-foreground transition-colors">
            Gallery
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden sm:inline">{session.user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-surface-light transition-colors" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-light transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
