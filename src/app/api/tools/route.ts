import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, incrementGenerations } from "@/lib/db";
import { generateWithAI, systemPrompts } from "@/lib/ai";
import type { UserTier } from "@/lib/db";

// Tier requirements for each tool
const toolTierRequirement: Record<string, UserTier> = {
  "ai-generator": "free",
  "item-creator": "free",
  "command-generator": "free",
  "block-script": "free",
  "datapack-library": "free",
  "server-setup": "free",
  "crash-analyzer": "free",
  "quest-generator": "pro",
  "minigame-creator": "pro",
  "gui-builder": "pro",
  "texture-generator": "pro",
  "modpack-creator": "pro",
  "mod-configurator": "pro",
  "event-challenge": "pro",
  "code-optimizer": "pro",
  "code-converter": "pro",
  "ai-simulator": "vip",
  "ai-upgrader": "vip",
};

const tierRank: Record<UserTier, number> = { free: 0, pro: 1, vip: 2 };

function hasAccess(userTier: UserTier, requiredTier: UserTier): boolean {
  return tierRank[userTier] >= tierRank[requiredTier];
}

// Map tool IDs to their system prompts
const toolSystemPrompts: Record<string, string> = {
  "quest-generator": systemPrompts.questGenerator,
  "item-creator": systemPrompts.itemCreator,
  "command-generator": systemPrompts.commandGenerator,
  "crash-analyzer": systemPrompts.crashAnalyzer,
  "code-converter": systemPrompts.codeConverter,
  "code-optimizer": systemPrompts.codeOptimizer,
  "texture-generator": systemPrompts.textureDescription,
  "minigame-creator": systemPrompts.minigameCreator,
  "server-setup": systemPrompts.serverSetup,
  "block-script": systemPrompts.blockScript,
  "modpack-creator": systemPrompts.modpackCreator,
  "datapack-library": systemPrompts.datapackLibrary,
  "gui-builder": systemPrompts.guiBuilder,
  "ai-simulator": systemPrompts.aiSimulator,
  "ai-upgrader": systemPrompts.aiUpgrader,
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized — please sign in" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const { toolId, prompt, options } = body;

  if (!toolId || !prompt) {
    return NextResponse.json(
      { error: "Missing required fields: toolId, prompt" },
      { status: 400 }
    );
  }

  // Tier access check
  const requiredTier = toolTierRequirement[toolId] || "free";
  if (!hasAccess(user.tier, requiredTier)) {
    return NextResponse.json(
      {
        error: `This tool requires ${requiredTier} tier or higher`,
        requiredTier,
        currentTier: user.tier,
      },
      { status: 403 }
    );
  }

  // Rate limit check
  const genCheck = await incrementGenerations(user.id);
  if (!genCheck.allowed) {
    return NextResponse.json(
      {
        error: "Generation limit reached for this month",
        used: genCheck.used,
        limit: genCheck.limit,
        tier: user.tier,
      },
      { status: 429 }
    );
  }

  const systemPrompt = toolSystemPrompts[toolId];
  if (!systemPrompt) {
    return NextResponse.json(
      { error: `Tool ${toolId} is not supported for AI generation` },
      { status: 400 }
    );
  }

  try {
    const fullPrompt = options
      ? `${prompt}\n\nAdditional options:\n${JSON.stringify(options, null, 2)}`
      : prompt;

    const result = await generateWithAI({
      prompt: fullPrompt,
      systemPrompt,
      tier: user.tier,
      maxTokens: 4096,
    });

    // Clean markdown code blocks from response
    const cleanContent = result.content
      .replace(/^```\w*\n?/gm, "")
      .replace(/```$/gm, "")
      .trim();

    return NextResponse.json({
      success: true,
      data: {
        content: cleanContent,
        model: result.modelLabel,
        toolId,
        generationsUsed: genCheck.used,
        generationsLimit: genCheck.limit,
      },
    });
  } catch (error) {
    console.error(`Tool ${toolId} generation error:`, error);
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}
