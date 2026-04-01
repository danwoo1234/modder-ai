import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail, incrementGenerations, getEffectiveTier } from "@/lib/db";
import { generateWithAI } from "@/lib/ai";

const SYSTEM_PROMPT = `You are a Minecraft plugin/mod developer. Given a description, generate a complete, working plugin.

IMPORTANT: You MUST respond in valid JSON with this exact structure:
{
  "pluginName": "MyPlugin",
  "files": [
    {
      "name": "MyPlugin.java",
      "path": "src/main/java/com/example/myplugin/MyPlugin.java",
      "content": "package com.example.myplugin;\\n..."
    },
    {
      "name": "plugin.yml",
      "path": "plugin.yml",
      "content": "name: MyPlugin\\nversion: 1.0\\n..."
    }
  ]
}

Generate proper Java code for the target platform and version. Always include a plugin.yml (or fabric.mod.json / mods.toml for Fabric/Forge). Make sure the code compiles and works.`;

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
  const { prompt, platform, version } = body;

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  // Rate limit check
  const genCheck = await incrementGenerations(user.id);
  if (!genCheck.allowed) {
    return NextResponse.json(
      {
        error: "Generation limit reached for this month",
        used: genCheck.used,
        limit: genCheck.limit,
        tier: getEffectiveTier(user),
      },
      { status: 429 }
    );
  }

  try {
    const fullPrompt = `Platform: ${platform || "Paper"}\nMinecraft Version: ${version || "1.21"}\n\nDescription:\n${prompt}`;

    const result = await generateWithAI({
      prompt: fullPrompt,
      systemPrompt: SYSTEM_PROMPT,
      tier: getEffectiveTier(user),
      maxTokens: 4096,
    });

    // Try to parse JSON from response
    let parsed: { pluginName: string; files: { name: string; path: string; content: string }[] };

    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result.content);
    } catch {
      // Fallback: treat entire response as a single Java file
      const name = "GeneratedPlugin.java";
      parsed = {
        pluginName: "GeneratedPlugin",
        files: [
          { name, path: `src/main/java/com/example/generated/${name}`, content: result.content },
          {
            name: "plugin.yml",
            path: "plugin.yml",
            content: `name: GeneratedPlugin\nversion: 1.0\nmain: com.example.generated.GeneratedPlugin\napi-version: "${version || "1.21"}"\n`,
          },
        ],
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        pluginName: parsed.pluginName,
        files: parsed.files,
        model: result.modelLabel,
        generationsUsed: genCheck.used,
        generationsLimit: genCheck.limit,
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 500 });
  }
}
