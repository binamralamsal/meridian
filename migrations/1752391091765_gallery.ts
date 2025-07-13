import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("galleries")
    .addColumn("id", "integer", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey(),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("status", sql`blog_status`, (col) =>
      col.defaultTo("draft").notNull(),
    )
    .addColumn("cover_file_id", "integer", (col) =>
      col.references("uploaded_files.id").onDelete("set null"),
    )
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("seo_title", "text")
    .addColumn("seo_description", "text")
    .addColumn("seo_keywords", "text")
    .addColumn("author_id", "integer", (col) =>
      col.references("users.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await sql`
    CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON galleries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await db.schema
    .createTable("gallery_images")
    .addColumn("gallery_id", "integer", (col) =>
      col.references("galleries.id").onDelete("cascade").notNull(),
    )
    .addColumn("file_id", "integer", (col) =>
      col.references("uploaded_files.id").onDelete("cascade").notNull(),
    )
    .addColumn("caption", "text", (col) => col.notNull())
    .addColumn("display_order", "integer", (col) => col.notNull())
    .addPrimaryKeyConstraint("gallery_images_pkey", ["gallery_id", "file_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("gallery_images").execute();
  await db.schema.dropTable("galleries").execute();
}
