CREATE TABLE IF NOT EXISTS "contact_form" (
	"contact_form_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(20) NOT NULL,
	"last_name" varchar(20) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"email" varchar(50) NOT NULL,
	"message" varchar(500) NOT NULL,
	"created_at" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "first_name" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "last_name" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "phone" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "email" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "iban" SET DATA TYPE varchar(24);