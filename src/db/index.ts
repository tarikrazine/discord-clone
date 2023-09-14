import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { createClient } from "@libsql/client";
import Database from "better-sqlite3";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";

function clientLocally() {
  const client = new Database("local.db");

  return drizzleSqlite(client, {
    schema: {
      ...profileSchema,
      ...serverSchema,
      ...memberSchema,
      ...channelSchema,
    },
  });
}

function client() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });

  return drizzleLibsql(client, {
    schema: {
      ...profileSchema,
      ...serverSchema,
      ...memberSchema,
      ...channelSchema,
    },
  });
}

export const db = process.env.NODE_ENV === "development"
  ? clientLocally()
  : client();
