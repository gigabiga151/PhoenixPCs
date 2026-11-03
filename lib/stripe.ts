import Stripe from "stripe";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders } from "../db/schema.js";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}

/** Idempotently marks every order in a paid Checkout Session as paid in full. */
export async function markSessionPaid(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;
  const s = session as any;
  const shipping = s.collected_information?.shipping_details ?? s.shipping_details ?? null;
  await db
    .update(orders)
    .set({ status: "paid_in_full", paidAmount: sql`${orders.totalPrice}`, shipping })
    .where(and(eq(orders.checkoutSessionId, session.id), eq(orders.status, "awaiting_payment")));
}
