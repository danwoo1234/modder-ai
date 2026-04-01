import { NextRequest, NextResponse } from "next/server";
import { updateUserTier, getUserByEmail } from "@/lib/db";
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
  const email: string | undefined =
    payload.meta?.custom_data?.user_email ??
    payload.data?.attributes?.user_email;

  if (!email) {
    console.error("Webhook: no user email in payload");
    return NextResponse.json({ error: "No user email" }, { status: 400 });
  }

  // -----------------------------------------------------------------------
  // subscription_created / subscription_updated → activate or keep tier
  // subscription_cancelled → downgrade to free at billing period end
  // subscription_expired / subscription_payment_failed → immediate downgrade
  // -----------------------------------------------------------------------

  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated" ||
    eventName === "subscription_resumed"
  ) {
    const variantId = String(payload.data?.attributes?.variant_id ?? "");
    const status: string = payload.data?.attributes?.status ?? "";
    const renewsAt: string | null = payload.data?.attributes?.renews_at ?? null;
    const endsAt: string | null = payload.data?.attributes?.ends_at ?? null;

    // Determine tier from variant ID
    const proVariant = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;
    const vipVariant = process.env.LEMONSQUEEZY_VIP_VARIANT_ID;
    let tier: UserTier = "free";
    if (variantId === vipVariant) tier = "vip";
    else if (variantId === proVariant) tier = "pro";

    if (status === "active" || status === "on_trial") {
      // Admin users are always permanent — skip expiry logic
      const user = await getUserByEmail(email);
      const isPermanent = user?.isAdmin === true;

      // Set expiry to next renewal date (or +35 days buffer for safety)
      const expiresAt = isPermanent
        ? null
        : renewsAt ?? new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString();

      await updateUserTier(email, tier, { expiresAt, permanent: isPermanent });
      console.log(`Webhook: ${email} → ${tier} (expires=${expiresAt}, permanent=${isPermanent})`);
    } else if (status === "cancelled") {
      // Cancelled but still in billing period → keep tier until endsAt
      const expiresAt = endsAt ?? renewsAt ?? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
      await updateUserTier(email, tier, { expiresAt, permanent: false });
      console.log(`Webhook: ${email} cancelled, tier=${tier} until ${expiresAt}`);
    } else {
      // expired / past_due / unpaid → downgrade immediately
      await updateUserTier(email, "free");
      console.log(`Webhook: ${email} → free (status=${status})`);
    }
  }

  if (
    eventName === "subscription_cancelled" ||
    eventName === "subscription_expired" ||
    eventName === "subscription_payment_failed"
  ) {
    const endsAt: string | null = payload.data?.attributes?.ends_at ?? null;

    if (eventName === "subscription_expired" || eventName === "subscription_payment_failed") {
      // Immediate downgrade
      await updateUserTier(email, "free");
      console.log(`Webhook: ${email} → free (event=${eventName})`);
    } else {
      // subscription_cancelled: keep access until billing period ends
      const user = await getUserByEmail(email);
      if (user && user.tier !== "free") {
        const expiresAt = endsAt ?? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString();
        await updateUserTier(email, user.tier, { expiresAt, permanent: false });
        console.log(`Webhook: ${email} cancelled, keeps ${user.tier} until ${expiresAt}`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
