import { InferSelectModel } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

export const type = pgEnum("type", ["TEXT", "AUDIO", "VIDEO"]);
