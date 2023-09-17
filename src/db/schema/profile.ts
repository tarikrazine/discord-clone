import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

import { server } from "./server";
import { member } from "./member";
import { channel } from "./channel";

export const profile = pgTable("profile", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id").unique().notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }),
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
