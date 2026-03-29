"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import AuthGate from "@/components/AuthGate";

const galleryItems = [
  { id: 1, name: "SkyWars Plugin", author: "CraftMaster42", platform: "Paper", version: "1.21", downloads: 2847, likes: 156, category: "Minigame", icon: "🎮" },
  { id: 2, name: "Custom Enchants+", author: "EnchantPro", platform: "Spigot", version: "1.20.4", downloads: 5213, likes: 342, category: "Plugin", icon: "✨" },
  { id: 3, name: "Dragon Boss Fight", author: "BossNinja", platform: "Paper", version: "1.21", downloads: 1532, likes: 98, category: "Boss", icon: "🐉" },
  { id: 4, name: "Economy Overhaul", author: "TradeKing", platform: "Paper", version: "1.21", downloads: 8921, likes: 567, category: "Economy", icon: "💰" },
  { id: 5, name: "Custom Biomes Datapack", author: "WorldBuilder", platform: "Datapack", version: "1.21", downloads: 3456, likes: 234, category: "Datapack", icon: "🌍" },
  { id: 6, name: "PvP Kit System", author: "FightClub", platform: "Paper", version: "1.20.4", downloads: 4123, likes: 287, category: "PvP", icon: "⚔️" },
  { id: 7, name: "Furniture Mod", author: "HomeDesigner", platform: "Fabric", version: "1.21", downloads: 12304, likes: 891, category: "Mod", icon: "🪑" },
  { id: 8, name: "Magic Spells", author: "WizardCraft", platform: "Paper", version: "1.21", downloads: 6789, likes: 445, category: "Plugin", icon: "🔮" },
  { id: 9, name: "Survival+", author: "SurvivalPro", platform: "Fabric", version: "1.20.4", downloads: 15678, likes: 1023, category: "Mod", icon: "🏕️" },
  { id: 10, name: "NPC Dialogue System", author: "StoryTeller", platform: "Paper", version: "1.21", downloads: 2345, likes: 178, category: "Plugin", icon: "💬" },
  { id: 11, name: "Parkour Generator", author: "JumpKing", platform: "Paper", version: "1.21", downloads: 1876, likes: 134, category: "Minigame", icon: "🏃" },
  { id: 12, name: "Texture Pack - Medieval", author: "ArtisanPack", platform: "Resource Pack", version: "1.21", downloads: 9876, likes: 654, category: "Resource Pack", icon: "🎨" },
];

const filterCategories = ["All", "Plugin", "Mod", "Minigame", "Datapack", "Resource Pack", "Economy", "PvP", "Boss"];

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");

  const filtered = galleryItems
    .filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "popular") return b.downloads - a.downloads;
      if (sort === "liked") return b.likes - a.likes;
      return b.id - a.id;
    });

  return (
    <AuthGate requiredTier="free">
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black">Community Gallery</h1>
          <p className="text-sm text-foreground/50 mt-1">Discover and share AI-generated mods, plugins, and datapacks</p>
        </div>

        <AdBanner slot="gallery-top" />

        {/* Search & Sort */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creations..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm"
          >
            <option value="popular">Most Downloaded</option>
            <option value="liked">Most Liked</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {filterCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === c ? "bg-primary text-white" : "bg-surface-light text-foreground/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl bg-surface border border-border p-4 hover:border-primary/30 transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                  <p className="text-[11px] text-foreground/40">by {item.author}</p>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-light text-foreground/40">{item.platform}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-foreground/40">
                  <span>⬇️ {item.downloads.toLocaleString()}</span>
                  <span>❤️ {item.likes}</span>
                </div>
                <span className="text-[10px] text-foreground/30">MC {item.version}</span>
              </div>
              <button className="w-full mt-3 py-2 rounded-lg bg-surface-light border border-border text-xs font-medium hover:border-primary/30 transition-colors">
                View &amp; Download
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <AdBanner slot="gallery-bottom" />
        </div>
      </div>
    </div>
    </AuthGate>
  );
}
