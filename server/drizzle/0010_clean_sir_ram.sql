CREATE TYPE "public"."invoice_state" AS ENUM('ZAPLATENÁ', 'NEZAPLATENÁ');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"invoice_id" serial PRIMARY KEY NOT NULL,
	"file" jsonb NOT NULL,
	"state" "invoice_state" DEFAULT 'NEZAPLATENÁ' NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"account_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice" ADD CONSTRAINT "invoice_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
