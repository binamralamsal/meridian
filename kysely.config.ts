import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import { Pool } from "pg";

import { serverEnv } from "./src/config/env/server";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: serverEnv.DATABASE_URL,
    max: 10,
  }),
});

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: "migrations",
  },
});
