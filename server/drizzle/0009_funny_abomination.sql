ALTER TABLE "contact_form" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "contact_form" ALTER COLUMN "created_at" SET DEFAULT now();