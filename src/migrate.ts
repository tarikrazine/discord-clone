import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "@/db";

async function main() {
  console.log("Running migrations");

  await migrate(db, { migrationsFolder: "./migrations" });

  console.log("Migrated successfully");

  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
