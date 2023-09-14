import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";

export const channel = sqliteTable("channel", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  type: text("role", { enum: ["TEXT", "AUDIO", "VIDEO"] }).default(
    "TEXT",
  ),
  profileId: integer("profile_id").references(() => profile.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  serverId: integer("server_id").references(() => server.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
}, (channel) => {
  return {
    profileIdx: index("profile_channel_idx").on(channel.profileId),
    serverIdx: index("server_channel_idx").on(channel.serverId),
  };
});

export const profileRelations = relations(channel, ({ one }) => ({
  profile: one(profile, {
    fields: [channel.profileId],
    references: [profile.id],
  }),
}));

export const serverRelations = relations(channel, ({ one }) => ({
  server: one(server, {
    fields: [channel.serverId],
    references: [server.id],
  }),
}));
