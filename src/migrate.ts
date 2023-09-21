import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client);

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
