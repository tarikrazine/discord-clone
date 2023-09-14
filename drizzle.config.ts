import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./src/migrations",
  driver: "turso",
  dbCredentials: {
    url: "file:./local.db",
  },
  // Print all statements
  verbose: true,
  // Always ask for my confirmation
  strict: true,
} satisfies Config;
