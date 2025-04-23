import {
  CamelCasePlugin,
  DeduplicateJoinsPlugin,
  Kysely,
  PostgresDialect,
} from "kysely";
import pg from "pg";

import { serverEnv } from "./env/server";

import type { DB } from "@/types/database-schemas";

const { Pool } = pg;

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: serverEnv.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  log: (event) => {
    if (event.level === "query") {
      console.log("SQL:", event.query.sql);
      console.log("Parameters:", event.query.parameters);
    } else {
      console.error("Error:", event.error);
    }
    console.log("-------------");
  },
  plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
});
