import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("doctors")
    .addColumn("display_order", "integer")
    .execute();

  await sql`
    UPDATE doctors 
    SET display_order = subquery.row_num
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
      FROM doctors
    ) AS subquery
    WHERE doctors.id = subquery.id
  `.execute(db);

  await db.schema
    .alterTable("doctors")
    .alterColumn("display_order", (col) => col.setNotNull())
    .execute();

  await sql`
    CREATE FUNCTION set_doctor_display_order()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      IF NEW.display_order IS NULL THEN
        NEW.display_order := COALESCE((SELECT MAX(display_order) FROM doctors), 0) + 1;
      END IF;
      RETURN NEW;
    END
    $$;
  `.execute(db);

  await sql`
    CREATE TRIGGER auto_set_doctor_display_order
    BEFORE INSERT ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION set_doctor_display_order();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS auto_set_doctor_display_order ON doctors`.execute(
    db,
  );
  await sql`DROP FUNCTION IF EXISTS set_doctor_display_order()`.execute(db);
  await db.schema.alterTable("doctors").dropColumn("display_order").execute();
}
