CREATE TABLE IF NOT EXISTS "account" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL
);
