// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";

import { env } from "@/env.mjs";

import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const client = new Client(env.DATABASE_URL);

async function main() {
  await client.connect();
}

main();

export const db = drizzle(client, {
  schema: {
    ...profileSchema,
    ...serverSchema,
    ...memberSchema,
    ...channelSchema,
  },
});
