import { sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import pg from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { gallerySchema, getAllGalleriesSchema } from "../../galleries.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const saveGalleryFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.object({ values: gallerySchema, id: z.number().optional() }))
  .handler(async ({ data, context }) => {
    const { values, id } = data;

    if (!values.authorId) values.authorId = context.auth.user.id;

    try {
      if (id) {
        await db.transaction().execute(async (trx) => {
          await trx
            .updateTable("galleries")
            .set({
              title: values.title,
              slug: values.slug,
              status: values.status,
              content: values.content,
              authorId: values.authorId,
              coverFileId: values.coverFileId,
              seoTitle: values.seoTitle,
              seoDescription: values.seoDescription,
              seoKeywords: values.seoKeywords,
            })
            .where("id", "=", id)
            .executeTakeFirstOrThrow();

          const existingImages = values.images
            .filter((ex) => !ex.new)
            .map((ex) => ex.fileId);
          await trx
            .deleteFrom("galleryImages")
            .where("galleryId", "=", id)
            .where("fileId", "not in", existingImages)
            .executeTakeFirstOrThrow();

          await trx
            .insertInto("galleryImages")
            .values(
              values.images.map((value) => ({
                caption: value.caption,
                displayOrder: value.displayOrder,
                fileId: value.fileId,
                galleryId: id,
              })),
            )
            .onConflict((oc) =>
              oc.columns(["fileId", "galleryId"]).doUpdateSet((val) => ({
                caption: val.ref("excluded.caption"),
                displayOrder: val.ref("excluded.displayOrder"),
              })),
            )
            .executeTakeFirstOrThrow();
        });

        return { status: "SUCCESS", message: "Updated gallery successfully!" };
      } else {
        await db.transaction().execute(async (trx) => {
          const gallery = await trx
            .insertInto("galleries")
            .values({
              title: values.title,
              slug: values.slug,
              status: values.status,
              content: values.content,
              authorId: values.authorId,
              coverFileId: values.coverFileId,
              seoTitle: values.seoTitle,
              seoDescription: values.seoDescription,
              seoKeywords: values.seoKeywords,
            })
            .returning("id")
            .executeTakeFirstOrThrow();

          await trx
            .insertInto("galleryImages")
            .values(
              values.images.map((value) => ({
                caption: value.caption,
                displayOrder: value.displayOrder,
                fileId: value.fileId,
                galleryId: gallery.id,
              })),
            )
            .executeTakeFirstOrThrow();
        });

        return { status: "SUCCESS", message: "Created gallery successfully!" };
      }
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A gallery with this slug already exists. Please try a different slug.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occured while creating gallery!",
      };
    }
  });

function getGalleryBasicQuery() {
  return db
    .selectFrom("galleries as g")
    .select([
      "g.id",
      "g.title",
      "g.slug",
      "g.seoDescription",
      "g.seoTitle",
      "g.seoKeywords",
      "g.status",
      "g.createdAt",
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("users")
          .select(["users.id", "users.name"])
          .whereRef("users.id", "=", "g.authorId")
          .limit(1),
      ).as("author"),
      jsonObjectFrom(
        eb
          .selectFrom("uploadedFiles")
          .select([
            "uploadedFiles.id",
            "uploadedFiles.name",
            "uploadedFiles.url",
            "uploadedFiles.fileType",
          ])
          .whereRef("uploadedFiles.id", "=", "g.coverFileId"),
      ).as("coverPhoto"),
      jsonArrayFrom(
        eb
          .selectFrom("galleryImages")
          .select([
            "galleryImages.fileId",
            "galleryImages.caption",
            "galleryImages.displayOrder",
          ])
          .select((ed) => [
            jsonObjectFrom(
              ed
                .selectFrom("uploadedFiles")
                .select([
                  "uploadedFiles.id",
                  "uploadedFiles.name",
                  "uploadedFiles.url",
                  "uploadedFiles.fileType",
                ])
                .whereRef("uploadedFiles.id", "=", "galleryImages.fileId"),
            ).as("file"),
          ])
          .whereRef("galleryImages.galleryId", "=", "g.id")
          .orderBy("galleryImages.displayOrder", "asc")
          .orderBy("galleryImages.displayOrder", "asc"),
      ).as("images"),
      sql<string>`left(regexp_replace(${eb.ref("g.content")}, '<[^>]*>', '', 'g'), 125)`.as(
        "truncatedContent",
      ),
    ]);
}

export const getGalleryByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    const result = await getGalleryBasicQuery()
      .where("g.id", "=", data)
      .select(["g.content"])
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const getGalleryBySlugFn = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const result = await getGalleryBasicQuery()
      .where("g.slug", "=", data)
      .select(["g.content"])
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const deleteGalleryFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db.deleteFrom("galleries").where("galleries.id", "=", data).execute();

    return { status: "SUCCESS", message: "Deleted gallery successfully!" };
  });

export const getAllGalleriesFn = createServerFn({ method: "GET" })
  .validator(getAllGalleriesSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search, status } = data;

    function createBaseQuery() {
      let query = db
        .selectFrom("galleries")
        .leftJoin("users", "users.id", "galleries.authorId");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;

        query = query.where((eb) =>
          eb.or([
            eb("galleries.title", "ilike", searchTerm),
            eb("galleries.slug", "ilike", searchTerm),
            eb("galleries.seoTitle", "ilike", searchTerm),
            eb("galleries.seoKeywords", "ilike", searchTerm),
            eb("users.name", "ilike", searchTerm),
          ]),
        );
      }

      if (status.length > 0) {
        query = query.where("galleries.status", "in", status);
      }

      return query;
    }

    let galleriesQuery = createBaseQuery()
      .select([
        "galleries.title",
        "galleries.id",
        "galleries.slug",
        "galleries.status",
        "galleries.createdAt",
        "galleries.updatedAt",
        "galleries.status",
      ])
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("uploadedFiles")
            .select([
              "uploadedFiles.id",
              "uploadedFiles.name",
              "uploadedFiles.url",
              "uploadedFiles.fileType",
            ])
            .whereRef("uploadedFiles.id", "=", "galleries.coverFileId"),
        ).as("coverPhoto"),
        jsonObjectFrom(
          eb
            .selectFrom("users")
            .select(["users.id", "users.name"])
            .whereRef("users.id", "=", "galleries.authorId")
            .limit(1),
        ).as("author"),
        sql<string>`left(regexp_replace(${eb.ref("galleries.content")}, '<[^>]*>', '', 'g'), 125)`.as(
          "truncatedContent",
        ),
      ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof data)["sort"];
      if (columnName === "author") {
        galleriesQuery = galleriesQuery.orderBy("users.name", direction);
      } else {
        galleriesQuery = galleriesQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    galleriesQuery = galleriesQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [galleries, countResult] = await Promise.all([
      galleriesQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      galleries,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
