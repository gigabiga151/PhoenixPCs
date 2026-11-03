import { pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  orderType: text("order_type").notNull(),
  buildName: text("build_name").notNull(),
  config: jsonb().notNull(),
  totalPrice: integer("total_price").notNull(),
  customerName: text("customer_name").notNull(),
  email: text().notNull(),
  phone: text().notNull().default(""),
  notes: text().notNull().default(""),
  status: text().notNull().default("enquiry_received"),
  paidAmount: integer("paid_amount").notNull().default(0),
  quantity: integer().notNull().default(1),
  checkoutSessionId: text("checkout_session_id"),
  shipping: jsonb(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("orders_checkout_session_idx").on(t.checkoutSessionId)]);
