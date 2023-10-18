DROP INDEX IF EXISTS "member_one_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "member_two_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_one_idx" ON "conversation" ("member_one_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_two_idx" ON "conversation" ("member_two_id");--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_member_one_id_unique" UNIQUE("member_one_id");--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_member_two_id_unique" UNIQUE("member_two_id");