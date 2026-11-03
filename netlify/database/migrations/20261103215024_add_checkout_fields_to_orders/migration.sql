ALTER TABLE "orders" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping" jsonb;--> statement-breakpoint
CREATE INDEX "orders_checkout_session_idx" ON "orders" ("checkout_session_id");