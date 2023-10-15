import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { member } from "./member";
import { relations } from "drizzle-orm";
import { conversation } from "./conversation";

export const directMessage = pgTable("direct_message", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  memberId: text("member_id").references(() => member.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  conversationId: text("conversation_id").references(() => conversation.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  fileUrl: text("file_url"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
}, (directMessage) => {
  return {
    memberIdx: index("member_idx").on(directMessage.memberId),
    conversationIdx: index("conversation_idx").on(directMessage.conversationId),
  };
});

export const directMessageRelations = relations(directMessage, ({ one }) => ({
  member: one(member, {
    fields: [directMessage.memberId],
    references: [member.id],
  }),
  conversation: one(conversation, {
    fields: [directMessage.conversationId],
    references: [conversation.id],
  }),
}));
