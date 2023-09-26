DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('ADMIN', 'MODERATOR', 'GUEST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('TEXT', 'AUDIO', 'VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "type" DEFAULT 'TEXT',
	"profile_id" text,
	"server_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "role" DEFAULT 'GUEST',
	"profile_id" text,
	"server_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text,
	"image_url" text,
	"email" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "server" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"image_url" text,
	"invite_code" text NOT NULL,
	"profile_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "server_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "channel" ("profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "server_idx" ON "channel" ("server_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "member" ("profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "server_idx" ON "member" ("server_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "server" ("profile_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_server_id_server_id_fk" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
