import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";
import { type } from "./typeChannel";

export const channel = pgTable("channel", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
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
