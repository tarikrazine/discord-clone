import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";

import { env } from "@/env.mjs";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, {
  schema: {
    ...profileSchema,
    ...serverSchema,
    ...memberSchema,
    ...channelSchema,
  },
});
