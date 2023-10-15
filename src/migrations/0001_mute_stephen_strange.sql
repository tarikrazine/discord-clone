CREATE TABLE IF NOT EXISTS "conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"member_one_id" text,
	"member_two_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "direct_message" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"conversation_id" text,
	"content" text NOT NULL,
	"file_url" text,
	"deleted" boolean DEFAULT false,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"file_url" text,
	"deleted" boolean DEFAULT false,
	"member_id" text,
	"channel_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "member_one_idx" ON "conversation" ("member_one_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "member_two_idx" ON "conversation" ("member_two_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_idx" ON "direct_message" ("member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversation_idx" ON "direct_message" ("conversation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_idx" ON "message" ("member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "channel_idx" ON "message" ("channel_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_member_one_id_member_id_fk" FOREIGN KEY ("member_one_id") REFERENCES "member"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation" ADD CONSTRAINT "conversation_member_two_id_member_id_fk" FOREIGN KEY ("member_two_id") REFERENCES "member"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
