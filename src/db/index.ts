import { Client } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";
import * as messageSchema from "@/db/schema/message";
import * as conversationSchema from "@/db/schema/conversation";
import * as directMessage from "@/db/schema/directMessage";

import { env } from "@/env.mjs";

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
    ...messageSchema,
    ...conversationSchema,
    ...directMessage,
  },
});
