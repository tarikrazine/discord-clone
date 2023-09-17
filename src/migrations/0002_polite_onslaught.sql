ALTER TABLE "channel" ALTER COLUMN "profile_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "channel" ALTER COLUMN "server_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "channel" ADD COLUMN "name" text NOT NULL;