import { NextRequest, NextResponse } from "next/server";
import { updateUserTier } from "@/lib/db";
import type { UserTier } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Verify HMAC signature
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;

  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
    const email: string | undefined =
      payload.meta?.custom_data?.user_email ??
      payload.data?.attributes?.user_email;
    const variantId: string | undefined = String(
      payload.data?.attributes?.variant_id ?? ""
    );
    const status: string | undefined = payload.data?.attributes?.status;

    if (!email) {
      console.error("Webhook: no user email in payload");
      return NextResponse.json({ error: "No user email" }, { status: 400 });
    }

    let tier: UserTier = "free";

    if (status === "active" || status === "on_trial") {
      const proVariant = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
      const vipVariant = process.env.LEMONSQUEEZY_VIP_VARIANT_ID;

      if (variantId === vipVariant) {
        tier = "vip";
      } else if (variantId === proVariant) {
        tier = "pro";
      }
    }
    // If status is cancelled / expired / past_due → tier stays "free"

    await updateUserTier(email, tier);
    console.log(`Webhook: updated ${email} to tier=${tier} (event=${eventName}, status=${status})`);
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    const email: string | undefined =
      payload.meta?.custom_data?.user_email ??
      payload.data?.attributes?.user_email;

    if (email) {
      await updateUserTier(email, "free");
      console.log(`Webhook: downgraded ${email} to free (event=${eventName})`);
    }
  }

  return NextResponse.json({ received: true });
}
