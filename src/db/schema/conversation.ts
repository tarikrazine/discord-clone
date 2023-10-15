import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { member } from "./member";
import { relations } from "drizzle-orm";
import { directMessage } from "./directMessage";

export const conversation = pgTable("conversation", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  memberOneId: text("member_one_id").references(() => member.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  memberTwoId: text("member_two_id").references(() => member.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
}, (conversation) => {
  return {
    memberOneIdx: index("member_one_idx").on(conversation.memberOneId),
    memberTwoIdx: index("member_two_idx").on(conversation.memberTwoId),
    memberOneUIdx: uniqueIndex("member_one_idx").on(conversation.memberOneId),
    memberTwoUIdx: uniqueIndex("member_two_idx").on(conversation.memberTwoId),
  };
});

export const conversationRelations = relations(
  conversation,
  ({ one, many }) => ({
    memberOne: one(member, {
      fields: [conversation.memberOneId],
      references: [member.id],
      relationName: "member_one",
    }),
    memberTwo: one(member, {
      fields: [conversation.memberTwoId],
      references: [member.id],
      relationName: "member_two",
    }),
    directMessages: many(directMessage),
  }),
);
