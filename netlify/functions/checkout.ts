import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { priceItem, MAX_LINES, type PricedItem } from "../../lib/pricing.js";
import { getStripe } from "../../lib/stripe.js";

const bad = (error: string, status = 400) => Response.json({ error }, { status });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export default async (req: Request) => {
  const stripe = getStripe();
  if (!stripe) return bad("Online checkout isn't switched on yet. Please check back soon.", 503);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request");
  }

  const customerName = str(body.customer_name, 120);
  const email = str(body.email, 200).toLowerCase();
  if (!customerName) return bad("Please enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Please enter a valid email");

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return bad("Your cart is empty");
  if (items.length > MAX_LINES) return bad(`You can check out up to ${MAX_LINES} builds at once`);

  let priced: PricedItem[];
  try {
    priced = items.map(priceItem);
  } catch (e) {
    return bad((e as Error).message);
  }

  // Create unpaid orders first so the webhook / success page can mark them paid.
  const rows = await db
    .insert(orders)
    .values(
      priced.map((p) => ({
        orderType: p.orderType,
        buildName: p.buildName,
        config: p.config,
        quantity: p.quantity,
        totalPrice: p.unitPrice * p.quantity,
        customerName,
        email,
        phone: str(body.phone, 40),
        notes: str(body.notes, 2000),
        status: "awaiting_payment",
      })),
    )
    .returning({ id: orders.id });

  const origin = new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: priced.map((p) => ({
        quantity: p.quantity,
        price_data: {
          currency: "usd",
          unit_amount: p.unitPrice * 100,
          product_data: { name: `Phoenix PCs · ${p.buildName}`, description: p.description.slice(0, 500) },
        },
      })),
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancel`,
      metadata: { order_ids: rows.map((r) => r.id).join(",").slice(0, 500) },
    });

    for (const r of rows) {
      await db.update(orders).set({ checkoutSessionId: session.id }).where(eq(orders.id, r.id));
    }
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error", e);
    for (const r of rows) {
      await db.update(orders).set({ status: "checkout_failed" }).where(eq(orders.id, r.id));
    }
    if ((e as any)?.type === "StripeAuthenticationError") {
      console.error("STRIPE_SECRET_KEY was rejected by Stripe. Check that the full secret key is set.");
      return bad("Online checkout isn't set up correctly yet. Please check back soon.", 503);
    }
    return bad("We couldn't start checkout. Please try again in a moment.", 502);
  }
};

export const config: Config = { path: "/api/checkout", method: "POST" };
