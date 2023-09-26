DROP INDEX IF EXISTS "profile_channel_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "server_channel_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_member_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "server_member_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "profile_server_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "channel" ("profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "server_idx" ON "channel" ("server_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "member" ("profile_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "server_idx" ON "member" ("server_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profile_idx" ON "server" ("profile_id");