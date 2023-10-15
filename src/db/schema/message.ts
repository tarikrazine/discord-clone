import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { member } from "./member";
import { channel } from "./channel";

export const message = pgTable(
  "message",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    content: text("content").notNull(),
    fileUrl: text("file_url"),
    deleted: boolean("deleted").default(false),
    memberId: text("member_id").references(() => member.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    channelId: text("channel_id").references(() => channel.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
  },
  (message) => {
    return {
      memberIdx: index("member_idx").on(message.memberId),
      channelIdx: index("channel_idx").on(message.channelId),
    };
  },
);

export type MessageType = typeof message.$inferSelect;

export const messageRelations = relations(message, ({ one }) => ({
  member: one(member, {
    fields: [message.memberId],
    references: [member.id],
  }),
  channel: one(channel, {
    fields: [message.channelId],
    references: [channel.id],
  }),
}));
