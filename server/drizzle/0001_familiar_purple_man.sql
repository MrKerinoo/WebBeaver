CREATE TYPE "public"."account_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "role" "account_role" DEFAULT 'USER' NOT NULL;