import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("sessions")
    .addColumn("country", "text", (col) => col.notNull().defaultTo("Unknown"))
    .addColumn("region", "text")
    .addColumn("city", "text")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("sessions")
    .dropColumn("country")
    .dropColumn("region")
    .dropColumn("city")
    .execute();
}
