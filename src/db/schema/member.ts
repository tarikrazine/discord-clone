import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";

export const member = sqliteTable("member", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  role: text("role", { enum: ["ADMIN", "MODERATOR", "GUEST"] }).default(
    "GUEST",
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
}, (member) => {
  return {
    profileIdx: index("profile_member_idx").on(member.profileId),
    serverIdx: index("server_member_idx").on(member.serverId),
  };
});

export const profileRelations = relations(member, ({ one }) => ({
  profile: one(profile, {
    fields: [member.profileId],
    references: [profile.id],
  }),
}));

export const serverRelations = relations(member, ({ one }) => ({
  server: one(server, {
    fields: [member.serverId],
    references: [server.id],
  }),
}));
