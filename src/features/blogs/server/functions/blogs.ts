import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import pg from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { blogSchema, getAllBlogsSchema } from "../../blogs.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const saveBlogFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.object({ values: blogSchema, id: z.number().optional() }))
  .handler(async ({ data, context }) => {
    const { values, id } = data;

    if (!values.authorId) values.authorId = context.auth.user.id;

    try {
      if (id) {
        await db
          .updateTable("blogs")
          .set(values)
          .where("id", "=", id)
          .execute();

        return { status: "SUCCESS", message: "Updated blog successfully!" };
      } else {
        await db.insertInto("blogs").values(values).execute();

        return { status: "SUCCESS", message: "Created blog successfully!" };
      }
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A blog with this slug already exists. Please try a different slug.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occured while creating blog!",
      };
    }
  });

function getBlogBasicQuery() {
  return db
    .selectFrom("blogs as b")
    .select([
      "b.id",
      "b.title",
      "b.slug",
      "b.seoDescription",
      "b.seoTitle",
      "b.seoKeywords",
      "b.status",
      "b.createdAt",
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("blogCategories as cat")
          .select(["cat.id", "cat.name", "cat.slug"])
          .whereRef("cat.id", "=", "b.categoryId")
          .limit(1),
      ).as("category"),
      jsonObjectFrom(
        eb
          .selectFrom("users")
          .select(["users.id", "users.name"])
          .whereRef("users.id", "=", "b.authorId")
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
          .whereRef("uploadedFiles.id", "=", "b.coverFileId"),
      ).as("coverPhoto"),
      sql<string>`left(regexp_replace(${eb.ref("b.content")}, '<[^>]*>', '', 'g'), 125)`.as("truncatedContent"),
    ]);
}

export const getBlogByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    const result = await getBlogBasicQuery()
      .where("b.id", "=", data)
      .select(["b.content"])
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const getBlogBySlugFn = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const result = await getBlogBasicQuery()
      .where("b.slug", "=", data)
      .select(["b.content"])
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const deleteBlogFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db.deleteFrom("blogs").where("blogs.id", "=", data).execute();

    return { status: "SUCCESS", message: "Deleted blog successfully!" };
  });

export const getAllBlogsFn = createServerFn({ method: "GET" })
  .validator(getAllBlogsSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search, categories, status } = data;

    function createBaseQuery() {
      let query = db
        .selectFrom("blogs")
        .leftJoin("blogCategories", "blogCategories.id", "blogs.categoryId")
        .leftJoin("users", "users.id", "blogs.authorId");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;

        query = query.where((eb) =>
          eb.or([
            eb("blogs.title", "ilike", searchTerm),
            eb("blogs.slug", "ilike", searchTerm),
            eb("blogs.seoTitle", "ilike", searchTerm),
            eb("blogs.seoKeywords", "ilike", searchTerm),
            eb("users.name", "ilike", searchTerm),
          ]),
        );
      }

      if (categories.length > 0) {
        query = query.where("blogCategories.slug", "in", categories);
      }

      if (status.length > 0) {
        query = query.where("blogs.status", "in", status);
      }

      return query;
    }

    let blogsQuery = createBaseQuery()
      .select([
        "blogs.title",
        "blogs.id",
        "blogs.slug",
        "blogs.status",
        "blogs.createdAt",
        "blogs.updatedAt",
        "blogs.status",
        "blogCategories.id as categoryId",
        "blogCategories.name as categoryName",
        "blogCategories.slug as categorySlug",
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
            .whereRef("uploadedFiles.id", "=", "blogs.coverFileId"),
        ).as("coverPhoto"),
        jsonObjectFrom(
          eb
            .selectFrom("users")
            .select(["users.id", "users.name"])
            .whereRef("users.id", "=", "blogs.authorId")
            .limit(1),
        ).as("author"),
        sql<string>`left(${eb.ref("blogs.content")}, 125)`.as(
          "truncatedContent",
        ),
      ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof data)["sort"];
      if (columnName === "category") {
        blogsQuery = blogsQuery.orderBy("blogCategories.name", direction);
      } else if (columnName === "author") {
        blogsQuery = blogsQuery.orderBy("users.name", direction);
      } else {
        blogsQuery = blogsQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    blogsQuery = blogsQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [blogs, countResult] = await Promise.all([
      blogsQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      blogs,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
