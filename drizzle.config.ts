import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "./.env.local" });

export default {
  schema: "./src/db/schema/*",
  out: "./src/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for my confirmation
  strict: true,
} satisfies Config;
