import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first (takes precedence), then fall back to .env
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
