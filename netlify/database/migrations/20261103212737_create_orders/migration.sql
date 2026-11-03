CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_type" text NOT NULL,
	"build_name" text NOT NULL,
	"config" jsonb NOT NULL,
	"total_price" integer NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'enquiry_received' NOT NULL,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
