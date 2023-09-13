import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";

const dbConnection = process.env.NODE_ENV === "development"
  ? { url: "file:./local.db" }
  : {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN as string,
  };

const client = createClient(dbConnection);

export const db = drizzle(client, {
  schema: {
    ...profileSchema,
    ...serverSchema,
    ...memberSchema,
    ...channelSchema,
  },
});
