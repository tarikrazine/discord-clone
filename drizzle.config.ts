import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";

// dotenv.config({ path: "./.env.local" });

export default {
  schema: "./src/db/schema/*",
  out: "./src/migrations",
  driver: "turso",
  dbCredentials: {
    // url: process.env.DATABASE_URL!,
    // authToken: process.env.DATABASE_AUTH_TOKEN!,
    url: "file:./local.db",
  },
  // Print all statements
  verbose: true,
  // Always ask for my confirmation
  strict: true,
} satisfies Config;