import type { Config } from "@netlify/functions";
import type Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { getStripe, markSessionPaid } from "../../lib/stripe.js";

export default async (req: Request) => {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("Webhook not configured", { status: 503 });

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(payload, req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markSessionPaid(session);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await db
        .update(orders)
        .set({ status: "payment_failed" })
        .where(and(eq(orders.checkoutSessionId, session.id), eq(orders.status, "awaiting_payment")));
      break;
  }
  return Response.json({ received: true });
};

export const config: Config = { path: "/api/stripe/webhook", method: "POST" };
