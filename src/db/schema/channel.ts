import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";
import { type } from "./typeChannel";
import { message } from "./message";

export const channel = pgTable("channel", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  type: type("type").default("TEXT"),
  profileId: text("profile_id").references(() => profile.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  serverId: text("server_id").references(() => server.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
}, (channel) => {
  return {
    profileIdx: index("profile_idx").on(channel.profileId),
    serverIdx: index("server_idx").on(channel.serverId),
  };
});

export type ChannelType = typeof channel.$inferSelect;

export const channelRelations = relations(channel, ({ one, many }) => ({
  profile: one(profile, {
    fields: [channel.profileId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [channel.serverId],
    references: [server.id],
  }),
  messages: many(message),
}));
