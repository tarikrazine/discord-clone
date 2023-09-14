import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { server } from "./server";
import { member } from "./member";
import { channel } from "./channel";

export const profile = sqliteTable("profile", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id").unique().notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const serversRelations = relations(profile, ({ many }) => ({
  servers: many(server),
}));

export const membersRelations = relations(profile, ({ many }) => ({
  members: many(member),
}));

export const channelsRelations = relations(profile, ({ many }) => ({
  channels: many(channel),
}));
