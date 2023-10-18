ALTER TABLE "conversation" DROP CONSTRAINT "conversation_member_one_id_unique";--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_member_two_id_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_one_uidx" ON "conversation" ("member_one_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_two_uidx" ON "conversation" ("member_two_id");