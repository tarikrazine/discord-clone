import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const profile = sqliteTable("profile", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  userId: text("user_id").unique().notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  email: text("email").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
