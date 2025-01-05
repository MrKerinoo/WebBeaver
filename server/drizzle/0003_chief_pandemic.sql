ALTER TABLE "refreshToken" RENAME TO "refresh_token";--> statement-breakpoint
ALTER TABLE "refresh_token" DROP CONSTRAINT "refreshToken_account_id_account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "refresh_token" ALTER COLUMN "token" SET DATA TYPE varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
