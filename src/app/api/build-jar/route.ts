import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { pluginName, files, platform, version } = body;

  if (!pluginName || !files || !Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: "Missing pluginName or files" }, { status: 400 });
  }

  try {
    const zip = new JSZip();

    for (const file of files) {
      const filePath = file.path || file.name;
      zip.file(filePath, file.content);
    }

    // Add a basic MANIFEST.MF
    zip.file(
      "META-INF/MANIFEST.MF",
      `Manifest-Version: 1.0\nCreated-By: ModderAI\nPlugin-Name: ${pluginName}\nPlatform: ${platform || "Paper"}\nMC-Version: ${version || "1.21"}\n`
    );

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const jarBase64 = zipBuffer.toString("base64");
    const size =
      zipBuffer.length < 1024
        ? `${zipBuffer.length} B`
        : zipBuffer.length < 1024 * 1024
          ? `${(zipBuffer.length / 1024).toFixed(1)} KB`
          : `${(zipBuffer.length / (1024 * 1024)).toFixed(1)} MB`;

    return NextResponse.json({
      success: true,
      data: {
        jarBase64,
        size,
      },
    });
  } catch (error) {
    console.error("JAR build error:", error);
    return NextResponse.json({ error: "Failed to build JAR" }, { status: 500 });
  }
}
