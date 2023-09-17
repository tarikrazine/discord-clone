import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as profileSchema from "@/db/schema/profile";
import * as serverSchema from "@/db/schema/server";
import * as memberSchema from "@/db/schema/member";
import * as channelSchema from "@/db/schema/channel";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  schema: {
    ...profileSchema,
    ...serverSchema,
    ...memberSchema,
    ...channelSchema,
  },
});
