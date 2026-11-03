import type { Config } from "@netlify/functions";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { ORDER_STAGES } from "../../lib/catalog.js";

export default async (req: Request) => {
  const url = new URL(req.url);
  const ref = (url.searchParams.get("ref") ?? "").trim().toLowerCase();
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!/^[0-9a-f-]{8,36}$/.test(ref)) {
    return Response.json({ error: "Enter your 8-character order reference" }, { status: 400 });
  }
  if (!email) return Response.json({ error: "Enter the email used for the order" }, { status: 400 });

  const [order] = await db
    .select()
    .from(orders)
    .where(and(sql`${orders.id}::text LIKE ${ref + "%"}`, eq(orders.email, email), inArray(orders.status, ORDER_STAGES)))
    .limit(1);

  if (!order) {
    return Response.json({ error: "No order found with that reference and email" }, { status: 404 });
  }

  return Response.json({
    order_ref: order.id.slice(0, 8).toUpperCase(),
    build_name: order.buildName,
    order_type: order.orderType,
    quantity: order.quantity,
    total_price: order.totalPrice,
    paid_amount: order.paidAmount,
    status: order.status,
    stage_index: Math.max(0, ORDER_STAGES.indexOf(order.status)),
    created_at: order.createdAt,
  });
};

export const config: Config = { path: "/api/orders/track", method: "GET" };
