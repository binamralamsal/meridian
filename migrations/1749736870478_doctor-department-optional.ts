import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("doctors")
    .dropConstraint("doctors_department_id_fkey")
    .execute();

  await db.schema
    .alterTable("doctors")
    .alterColumn("department_id", (col) => col.dropNotNull())
    .execute();

  await db.schema
    .alterTable("doctors")
    .addForeignKeyConstraint(
      "doctors_department_id_fkey",
      ["department_id"],
      "departments",
      ["id"],
    )
    .onDelete("set null")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("doctors")
    .dropConstraint("doctors_department_id_fkey")
    .execute();

  await db.schema
    .alterTable("doctors")
    .alterColumn("department_id", (col) => col.setNotNull())
    .execute();

  await db.schema
    .alterTable("doctors")
    .addForeignKeyConstraint(
      "doctors_department_id_fkey",
      ["department_id"],
      "departments",
      ["id"],
    )
    .onDelete("cascade")
    .execute();
}
