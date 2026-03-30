export const platforms = ["Paper", "Spigot", "Purpur", "Fabric", "Forge", "NeoForge", "Velocity", "BungeeCord", "Sponge", "Bukkit", "Folia", "Datapack"];

export const mcVersions = ["1.21", "1.20.4", "1.20.2", "1.20.1", "1.19.4", "1.19.2", "1.18.2", "1.16.5", "1.12.2", "1.8.8", "1.7.10"];

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: "free" | "pro" | "vip";
  category: string;
  href: string;
  color: string;
  features: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "generation", label: "Generation", icon: "⚡" },
  { id: "analysis", label: "Analysis", icon: "🔍" },
  { id: "conversion", label: "Conversion", icon: "🔄" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "server", label: "Server", icon: "🖥️" },
  { id: "learning", label: "Learning", icon: "📖" },
];

export const tools: Tool[] = [
  {
    id: "ai-generator",
    name: "AI Mod Generator",
    description: "Describe your mod idea and get a fully working plugin with auto-JAR building. Supports all major platforms and MC versions.",
    icon: "⚡",
    tier: "free",
    category: "generation",
    href: "/tools/ai-generator",
    color: "from-purple-500 to-blue-500",
    features: ["Auto-JAR building", "12+ loaders supported", "plugin.yml generation", "Multi-file output"],
  },
  {
    id: "item-creator",
    name: "Custom Item Creator",
    description: "Design unique custom items with special abilities, rarity tiers, damage values, and cooldowns. Export ready-to-use code.",
    icon: "🗡️",
    tier: "free",
    category: "generation",
    href: "/tools/item-creator",
    color: "from-orange-500 to-red-500",
    features: ["Custom abilities", "Rarity tiers", "Damage & cooldowns", "Lore generation"],
  },
  {
    id: "command-generator",
    name: "Command Generator",
    description: "Generate complex Minecraft commands for plugins, datapacks, or command blocks. Supports teleports, scoreboards, boss bars, and more.",
    icon: "📝",
    tier: "free",
    category: "generation",
    href: "/tools/command-generator",
    color: "from-green-500 to-emerald-500",
    features: ["Plugin commands (Java)", "mcfunction output", "Command block format", "Multiple command types"],
  },
  {
    id: "block-script",
    name: "Block Script Playground",
    description: "Visual block-based coding for Minecraft plugins. Drag events, conditions, and actions to build plugin logic without writing code.",
    icon: "🧩",
    tier: "free",
    category: "generation",
    href: "/tools/block-script",
    color: "from-yellow-500 to-orange-500",
    features: ["Visual block coding", "Event/condition/action blocks", "Java code export", "No coding required"],
  },
  {
    id: "crash-analyzer",
    name: "Crash Analyzer",
    description: "Paste any server crash log and get an instant AI-powered diagnosis with root cause, severity level, and step-by-step fixes.",
    icon: "🔍",
    tier: "free",
    category: "analysis",
    href: "/tools/crash-analyzer",
    color: "from-red-500 to-pink-500",
    features: ["Instant diagnosis", "Severity detection", "Fix recommendations", "Conflict detection"],
  },
  {
    id: "datapack-library",
    name: "Datapack Library",
    description: "Generate complete datapack structures with crafting recipes, worldgen, loot tables, advancements, and more for any MC version.",
    icon: "📦",
    tier: "free",
    category: "generation",
    href: "/tools/datapack-library",
    color: "from-cyan-500 to-blue-500",
    features: ["Complete pack structure", "Multiple categories", "Version-specific", "Namespace support"],
  },
  {
    id: "server-setup",
    name: "Server Setup Wizard",
    description: "Get a complete server configuration guide tailored to your software, player count, and server type. Includes optimized settings.",
    icon: "🖥️",
    tier: "free",
    category: "server",
    href: "/tools/server-setup",
    color: "from-slate-500 to-gray-600",
    features: ["Software selection", "Optimized configs", "RAM recommendations", "Plugin suggestions"],
  },
  {
    id: "jar-tutorial",
    name: "JAR Tutorial",
    description: "Step-by-step guide to building and exporting JAR files. Covers JDK setup, Gradle/Maven builds, and platform-specific configurations.",
    icon: "📖",
    tier: "free",
    category: "learning",
    href: "/tools/jar-tutorial",
    color: "from-indigo-500 to-violet-500",
    features: ["JDK setup guide", "Gradle & Maven", "Fabric/Forge setup", "Auto-JAR explained"],
  },
  {
    id: "quest-generator",
    name: "Quest Generator",
    description: "Build rich quest systems with story lines, NPC dialogues, branching paths, and difficulty scaling. Generate complete quest plugin code.",
    icon: "📜",
    tier: "pro",
    category: "generation",
    href: "/tools/quest-generator",
    color: "from-amber-500 to-yellow-500",
    features: ["Branching storylines", "NPC dialogues", "Difficulty scaling", "Reward systems"],
  },
  {
    id: "minigame-creator",
    name: "Minigame Creator",
    description: "Design full minigame plugins with arenas, teams, kits, scoreboards, and game logic. Supports PvP, Spleef, CTF, and custom games.",
    icon: "🎮",
    tier: "pro",
    category: "generation",
    href: "/tools/minigame-creator",
    color: "from-pink-500 to-rose-500",
    features: ["Multiple game types", "Team support", "Kit system", "Arena management"],
  },
  {
    id: "gui-builder",
    name: "GUI Builder",
    description: "Visual inventory GUI designer. Paint slots with items, glass panes, buttons, and borders, then export as a working Java plugin.",
    icon: "🖼️",
    tier: "pro",
    category: "design",
    href: "/tools/gui-builder",
    color: "from-violet-500 to-purple-500",
    features: ["Visual grid editor", "Slot painting", "Click actions", "Java export"],
  },
  {
    id: "texture-generator",
    name: "Texture Generator",
    description: "Generate texture specifications for blocks, items, mobs, armor, GUIs, and particles in various art styles and resolutions.",
    icon: "🎨",
    tier: "pro",
    category: "design",
    href: "/tools/texture-generator",
    color: "from-teal-500 to-cyan-500",
    features: ["Multiple texture types", "Art style selection", "Resolution options", "Color palettes"],
  },
  {
    id: "modpack-creator",
    name: "Modpack Creator",
    description: "AI-curated modpack builder. Choose a preset, loader, and MC version, then get a complete mod list with compatibility checks.",
    icon: "📚",
    tier: "pro",
    category: "generation",
    href: "/tools/modpack-creator",
    color: "from-emerald-500 to-green-500",
    features: ["Preset themes", "Compatibility checks", "Loader support", "Performance optimized"],
  },
  {
    id: "code-optimizer",
    name: "Code Optimizer",
    description: "Optimize your Minecraft plugin code for performance, memory usage, or readability. Get detailed improvement suggestions.",
    icon: "⚙️",
    tier: "pro",
    category: "analysis",
    href: "/tools/code-optimizer",
    color: "from-blue-500 to-indigo-500",
    features: ["Performance analysis", "Memory optimization", "Readability improvements", "Benchmark estimates"],
  },
  {
    id: "code-converter",
    name: "Code Converter",
    description: "Convert plugin code between platforms: Spigot, Fabric, and Forge. Handles API differences, event systems, and mappings.",
    icon: "🔄",
    tier: "pro",
    category: "conversion",
    href: "/tools/code-converter",
    color: "from-sky-500 to-blue-500",
    features: ["Cross-platform conversion", "API mapping", "Event translation", "Import fixing"],
  },
  {
    id: "ai-simulator",
    name: "AI Server Simulator",
    description: "Simulate your plugin under real server conditions — 100 players, redstone farms, TPS drops. Get a detailed performance report.",
    icon: "🧪",
    tier: "vip",
    category: "analysis",
    href: "/tools/ai-simulator",
    color: "from-gold to-amber-600",
    features: ["Stress testing", "TPS analysis", "Memory profiling", "Optimization report"],
  },
  {
    id: "ai-upgrader",
    name: "AI Version Upgrader",
    description: "Automatically upgrade your plugin code between Minecraft versions. Handles API changes, deprecations, and compatibility fixes.",
    icon: "⬆️",
    tier: "vip",
    category: "conversion",
    href: "/tools/ai-upgrader",
    color: "from-gold to-amber-600",
    features: ["Version migration", "API updates", "Deprecation fixes", "Compatibility notes"],
  },
];
