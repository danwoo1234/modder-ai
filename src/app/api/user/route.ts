import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    tier: user.tier,
    generationsUsed: user.generationsUsed,
    generationsLimit: user.generationsLimit,
    hasSubscription: user.tier !== "free",
    isAdmin: user.isAdmin ?? false,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  });
}
