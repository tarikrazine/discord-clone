import { InferSelectModel, relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { profile } from "./profile";
import { member } from "./member";
import { channel } from "./channel";

export const server = pgTable(
  "server",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text("name"),
    imageUrl: text("image_url"),
    inviteCode: text("invite_code").notNull(),
    profileId: text("profile_id").references(() => profile.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
  },
  (server) => {
    return {
      profileIdx: index("profile_server_idx").on(server.profileId),
    };
  },
);

export const serverRelations = relations(server, ({ one, many }) => ({
  profile: one(profile, {
    fields: [server.profileId],
    references: [profile.id],
  }),
  members: many(member),
  channels: many(channel),
}));
