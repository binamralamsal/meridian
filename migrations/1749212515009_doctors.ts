import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("uploaded_files")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("file_type", "text", (col) => col.notNull())
    .addColumn("uploaded_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE FUNCTION update_uploaded_at_column()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.uploaded_at = now();
      RETURN NEW;
    END
    $$;
  `.execute(db);

  await sql`
    CREATE TRIGGER update_uploaded_files_updated_at
    BEFORE UPDATE ON uploaded_files
    FOR EACH ROW
    EXECUTE FUNCTION update_uploaded_at_column();
  `.execute(db);

  await db.schema
    .createType("day_of_week")
    .asEnum([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ])
    .execute();

  await db.schema
    .createTable("doctors")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("role", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("photo_file_id", "integer", (col) =>
      col.notNull().references("uploaded_files.id").onDelete("set null"),
    )
    .addColumn("department_id", "integer", (col) =>
      col.references("departments.id").onDelete("cascade").notNull(),
    )
    .addColumn("phone_number", "text")
    .addColumn("email", "text")
    .addColumn("location", "text")
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createTable("doctors_appointment_hours")
    .addColumn("id", "integer", (col) =>
      col.generatedByDefaultAsIdentity().primaryKey(),
    )
    .addColumn("doctor_id", "integer", (col) =>
      col.references("doctors.id").onDelete("cascade").notNull(),
    )
    .addColumn("day", sql`day_of_week`, (col) => col.notNull())
    .addColumn("time_start", "text", (col) => col.notNull())
    .addColumn("time_end", "text", (col) => col.notNull())
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_doctors_appointment_hours_updated_at
    BEFORE UPDATE ON doctors_appointment_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createTable("doctors_education")
    .addColumn("id", "integer", (col) =>
      col.generatedByDefaultAsIdentity().primaryKey(),
    )
    .addColumn("doctor_id", "integer", (col) =>
      col.references("doctors.id").onDelete("cascade").notNull(),
    )
    .addColumn("institution", "text", (col) => col.notNull())
    .addColumn("degree", "text", (col) => col.notNull())
    .addColumn("year_of_completion", "integer", (col) => col.notNull())
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_doctors_education_updated_at
    BEFORE UPDATE ON doctors_education
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createTable("doctors_experiences")
    .addColumn("id", "integer", (col) =>
      col.generatedByDefaultAsIdentity().primaryKey(),
    )
    .addColumn("doctor_id", "integer", (col) =>
      col.references("doctors.id").onDelete("cascade").notNull(),
    )
    .addColumn("role", "text", (col) => col.notNull())
    .addColumn("short_description", "text", (col) => col.notNull())
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_doctors_experiences_updated_at
    BEFORE UPDATE ON doctors_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createTable("doctors_achievements")
    .addColumn("id", "integer", (col) =>
      col.generatedByDefaultAsIdentity().primaryKey(),
    )
    .addColumn("doctor_id", "integer", (col) =>
      col.references("doctors.id").onDelete("cascade").notNull(),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("year", "integer", (col) => col.notNull())
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_doctors_achievements_updated_at
    BEFORE UPDATE ON doctors_achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("doctors_achievements").ifExists().execute();
  await db.schema.dropTable("doctors_experiences").ifExists().execute();
  await db.schema.dropTable("doctors_education").ifExists().execute();
  await db.schema.dropTable("doctors_appointment_hours").ifExists().execute();
  await db.schema.dropTable("doctors").ifExists().execute();
  await db.schema.dropTable("uploaded_files").ifExists().execute();
  await db.schema.dropType("day_of_week").ifExists().execute();
  await sql`
  DROP FUNCTION IF EXISTS update_uploaded_at_column();
`.execute(db);
}
