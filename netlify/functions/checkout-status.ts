import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { getStripe, markSessionPaid } from "../../lib/stripe.js";

export default async (req: Request) => {
  const stripe = getStripe();
  const sessionId = new URL(req.url).searchParams.get("session_id") ?? "";
  if (!stripe || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return Response.json({ error: "Invalid checkout session" }, { status: 400 });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return Response.json({ error: "Checkout session not found" }, { status: 404 });
  }
  await markSessionPaid(session); // in case the webhook hasn't arrived yet

  const rows = await db
    .select({ id: orders.id, buildName: orders.buildName, quantity: orders.quantity, status: orders.status, email: orders.email })
    .from(orders)
    .where(eq(orders.checkoutSessionId, sessionId));

  return Response.json({
    paid: session.payment_status === "paid",
    email: rows[0]?.email ?? "",
    amount_total: (session.amount_total ?? 0) / 100,
    orders: rows.map((r) => ({ order_ref: r.id.slice(0, 8).toUpperCase(), build_name: r.buildName, quantity: r.quantity })),
  });
};

export const config: Config = { path: "/api/checkout/status", method: "GET" };
