import pg from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { categorySchema, getAllCategoriesSchema } from "../../blogs.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const saveCategoryFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.object({ values: categorySchema, id: z.number().optional() }))
  .handler(async ({ data }) => {
    try {
      if (data.id) {
        await db
          .updateTable("blogCategories")
          .set(data.values)
          .where("blogCategories.id", "=", data.id)
          .execute();
        return { status: "SUCCESS", message: "Updated category successfully!" };
      } else {
        await db.insertInto("blogCategories").values(data.values).execute();
        return { status: "SUCCESS", message: "Created category successfully!" };
      }
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A category with this slug already exists. Please try a different slug.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occured while creating category!",
      };
    }
  });

export const getAllCategoriesFn = createServerFn({ method: "GET" })
  .validator(getAllCategoriesSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search } = data;

    function createBaseQuery() {
      let query = db.selectFrom("blogCategories");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("blogCategories.name", "ilike", searchTerm),
            eb("blogCategories.slug", "ilike", searchTerm),
          ]),
        );
      }

      return query;
    }

    let categoriesQuery = createBaseQuery().select([
      "id",
      "name",
      "slug",
      "createdAt",
      "updatedAt",
    ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      categoriesQuery = categoriesQuery.orderBy(
        column as keyof (typeof data)["sort"],
        direction,
      );
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    categoriesQuery = categoriesQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [categories, countResult] = await Promise.all([
      categoriesQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      categories,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const getCategoryByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    const result = await db
      .selectFrom("blogCategories")
      .selectAll()
      .where("id", "=", data)
      .executeTakeFirst();

    return result;
  });

export const deleteCategoryFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db
      .deleteFrom("blogCategories")
      .where("blogCategories.id", "=", data)
      .execute();

    return { status: "SUCCESS", message: "Deleted category successfully!" };
  });
