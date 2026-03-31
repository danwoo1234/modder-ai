import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();

  const variantId =
    plan === "pro"
      ? process.env.LEMONSQUEEZY_PRO_VARIANT_ID
      : plan === "vip"
        ? process.env.LEMONSQUEEZY_VIP_VARIANT_ID
        : null;

  if (!variantId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!storeId || !apiKey) {
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: session.user.email,
            custom: {
              user_email: session.user.email,
            },
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("LemonSqueezy checkout error:", text);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const checkoutUrl = data.data?.attributes?.url;

  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "No checkout URL returned" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: checkoutUrl });
}
