import type { UserTier } from "./db";

interface GenerateOptions {
  prompt: string;
  systemPrompt: string;
  tier: UserTier;
  maxTokens?: number;
}

interface GenerateResult {
  content: string;
  modelLabel: string;
}

export async function generateWithAI(options: GenerateOptions): Promise<GenerateResult> {
  const { prompt, systemPrompt, tier, maxTokens = 4096 } = options;

  // Use Anthropic SDK if available, otherwise fall back to OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: anthropicKey });
    const model = tier === "vip" ? "claude-sonnet-4-20250514" : "claude-haiku-4-20250414";
    const msg = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return { content: text, modelLabel: model };
  }

  if (openaiKey) {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: openaiKey });
    const model = tier === "vip" ? "gpt-4o" : "gpt-4o-mini";
    const res = await client.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    return { content: res.choices[0]?.message?.content ?? "", modelLabel: model };
  }

  throw new Error("No AI API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
}

export const systemPrompts = {
  questGenerator:
    "You are a Minecraft quest system designer. Generate complete quest plugin code with NPCs, dialogue, objectives, and rewards.",
  itemCreator:
    "You are a Minecraft custom item designer. Generate complete item code with custom abilities, lore, enchantments, and event handlers.",
  commandGenerator:
    "You are a Minecraft command expert. Generate commands for plugins, datapacks, or command blocks based on the user request.",
  crashAnalyzer:
    "You are a Minecraft server crash analyst. Analyze crash logs and provide severity, root cause, step-by-step fixes, and prevention tips.",
  codeConverter:
    "You are a Minecraft plugin code converter. Convert code between Spigot, Fabric, and Forge platforms, handling API differences.",
  codeOptimizer:
    "You are a Minecraft plugin code optimizer. Analyze and optimize code for performance, memory, or readability. Provide before/after comparisons.",
  textureDescription:
    "You are a Minecraft texture designer. Generate detailed texture specifications, color palettes, and pixel art guidelines.",
  minigameCreator:
    "You are a Minecraft minigame plugin developer. Generate complete minigame plugins with arenas, teams, kits, and game logic.",
  serverSetup:
    "You are a Minecraft server administrator. Generate complete server setup guides with optimized configurations and plugin recommendations.",
  blockScript:
    "You are a Minecraft plugin code generator. Convert visual block-based logic (events, conditions, actions) into working Java plugin code.",
  modpackCreator:
    "You are a Minecraft modpack curator. Generate mod lists with compatibility checks, performance notes, and configuration suggestions.",
  datapackLibrary:
    "You are a Minecraft datapack developer. Generate complete datapack structures with JSON files for crafting, worldgen, loot tables, etc.",
  guiBuilder:
    "You are a Minecraft GUI plugin developer. Generate inventory GUI code from slot layouts, handling click events and item placement.",
  aiSimulator:
    "You are a Minecraft server performance analyst. Simulate plugin behavior under various stress conditions and generate detailed reports.",
  aiUpgrader:
    "You are a Minecraft plugin migration specialist. Upgrade plugin code between MC versions, handling API changes and deprecations.",
};
