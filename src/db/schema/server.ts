import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { member } from "./member";
import { channel } from "./channel";

export const server = sqliteTable(
  "server",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text("name"),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").notNull(),
    profileId: integer("profile_id").references(() => profile.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
  },
  (server) => {
    return {
      profileIdx: index("profile_server_idx").on(server.profileId),
    };
  },
);

export const profileRelations = relations(server, ({ one }) => ({
  profile: one(profile, {
    fields: [server.profileId],
    references: [profile.id],
  }),
}));

export const membersRelations = relations(server, ({ many }) => ({
  members: many(member),
}));

export const channelsRelations = relations(server, ({ many }) => ({
  channels: many(channel),
}));
