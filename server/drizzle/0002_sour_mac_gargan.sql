CREATE TABLE IF NOT EXISTS "refreshToken" (
	"refresh_token_id" serial PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"account_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
