import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as dotenv from "dotenv";

neonConfig.fetchConnectionCache = true;

dotenv.config();

async function main() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    console.log("Running migrations");

    await migrate(db, { migrationsFolder: "./src/migrations" });

    console.log("Migrated successfully");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed");
    console.error(error);
    process.exit(1);
  }
}

main();
