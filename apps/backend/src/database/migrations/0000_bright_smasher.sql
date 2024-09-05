CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256),
	"role" jsonb DEFAULT '["basic"]'::jsonb,
	"image" varchar(500),
	"created_at" timestamp DEFAULT (current_timestamp),
	"updated_at" timestamp DEFAULT (current_timestamp),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roleIndex" ON "users" USING btree ("role");