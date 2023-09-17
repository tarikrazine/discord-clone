import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";
import { role } from "./roleMember";

export const member = pgTable("member", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  role: role("role").default("GUEST"),
  profileId: text("profile_id").references(() => profile.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  serverId: text("server_id").references(() => server.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull(),
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
