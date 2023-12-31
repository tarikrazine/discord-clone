import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { relations } from "drizzle-orm";
import { server } from "./server";
import { role } from "./roleMember";
import { message } from "./message";
import { conversation } from "./conversation";
import { directMessage } from "./directMessage";

export const member = pgTable(
  "member",
  {
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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
  },
  (member) => {
    return {
      profileIdx: index("profile_idx").on(member.profileId),
      serverIdx: index("server_idx").on(member.serverId),
    };
  },
);

export type MemberType = typeof member.$inferSelect;

export const memberRelations = relations(member, ({ one, many }) => ({
  profile: one(profile, {
    fields: [member.profileId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [member.serverId],
    references: [server.id],
  }),
  messages: many(message),
  conversationsInitiated: many(conversation, { relationName: "member_one" }),
  conversationsReceived: many(conversation, { relationName: "member_two" }),
  directMessages: many(directMessage),
}));
