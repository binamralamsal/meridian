import { jsonArrayFrom } from "kysely/helpers/postgres";
import pg from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import {
  departmentSchema,
  getAllDepartmentsSchema,
} from "../../departments.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const saveDepartmentFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.object({ values: departmentSchema, id: z.number().optional() }))
  .handler(async ({ data }) => {
    const {
      values: { sections, ...departmentValues },
      id,
    } = data;

    try {
      if (id) {
        await db.transaction().execute(async (trx) => {
          await trx
            .updateTable("departments")
            .where("id", "=", id)
            .set({
              name: departmentValues.title,
              slug: departmentValues.slug,
              icon: departmentValues.icon,
              headerDescription: departmentValues.description,
            })
            .executeTakeFirstOrThrow();

          const existingSectionIds = sections
            ?.filter((section) => !section.new)
            .map((section) => section.id);

          if (existingSectionIds.length > 0) {
            await trx
              .deleteFrom("departmentSections")
              .where("departmentId", "=", id)
              .where("id", "not in", existingSectionIds)
              .execute();
          } else {
            await trx
              .deleteFrom("departmentSections")
              .where("departmentId", "=", id)
              .execute();
          }

          for (const section of sections) {
            const { cards, new: isNew, ...sectionValues } = section;

            let currentSectionId: number;

            if (isNew) {
              const insertedSection = await trx
                .insertInto("departmentSections")
                .values({
                  label: sectionValues.label,
                  title: sectionValues.title,
                  description: sectionValues.description,
                  displayOrder: sectionValues.displayOrder,
                  departmentId: id,
                })
                .returning("id")
                .executeTakeFirstOrThrow();
              currentSectionId = insertedSection.id;
            } else {
              await trx
                .updateTable("departmentSections")
                .where("id", "=", sectionValues.id)
                .set({
                  label: sectionValues.label,
                  title: sectionValues.title,
                  description: sectionValues.description,
                  displayOrder: sectionValues.displayOrder,
                })
                .executeTakeFirstOrThrow();
              currentSectionId = sectionValues.id;
            }

            const existingCardIds = cards
              .filter((card) => !card.new)
              .map((card) => card.id);

            if (existingCardIds.length > 0) {
              await trx
                .deleteFrom("departmentSectionCards")
                .where("sectionId", "=", currentSectionId)
                .where("id", "not in", existingCardIds)
                .execute();
            } else {
              await trx
                .deleteFrom("departmentSectionCards")
                .where("sectionId", "=", currentSectionId)
                .execute();
            }

            for (const card of cards) {
              const { new: isNewCard, ...cardValues } = card;

              if (isNewCard) {
                await trx
                  .insertInto("departmentSectionCards")
                  .values({
                    icon: cardValues.icon,
                    title: cardValues.title,
                    description: cardValues.description,
                    displayOrder: cardValues.displayOrder,
                    sectionId: currentSectionId,
                  })
                  .executeTakeFirstOrThrow();
              } else {
                await trx
                  .updateTable("departmentSectionCards")
                  .where("id", "=", cardValues.id)
                  .set({
                    icon: cardValues.icon,
                    title: cardValues.title,
                    description: cardValues.description,
                    displayOrder: cardValues.displayOrder,
                  })
                  .executeTakeFirstOrThrow();
              }
            }
          }
        });

        return {
          status: "SUCCESS",
          message: "Updated department successfully!",
        };
      } else {
        await db.transaction().execute(async (trx) => {
          const department = await trx
            .insertInto("departments")
            .values({
              name: departmentValues.title,
              slug: departmentValues.slug,
              icon: departmentValues.icon,
              headerDescription: departmentValues.description,
            })
            .returning("id")
            .executeTakeFirstOrThrow();

          for (const section of sections) {
            const { cards, ...sectionValues } = section;

            const insertedSection = await trx
              .insertInto("departmentSections")
              .values({
                label: sectionValues.label,
                title: sectionValues.title,
                description: sectionValues.description,
                displayOrder: sectionValues.displayOrder,
                departmentId: department.id,
              })
              .returning("id")
              .executeTakeFirstOrThrow();

            const cardData = cards.map((card) => ({
              icon: card.icon,
              title: card.title,
              description: card.description,
              displayOrder: card.displayOrder,
              sectionId: insertedSection.id,
            }));

            await trx
              .insertInto("departmentSectionCards")
              .values(cardData)
              .execute();
          }
        });

        return {
          status: "SUCCESS",
          message: "Created department successfully!",
        };
      }
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A department with this slug already exists. Please try a different slug.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occurred while saving department!",
      };
    }
  });

function getDepartmentBasicQuery() {
  return db.selectFrom("departments as d").select((eb) => [
    "d.id",
    "d.name as title",
    "d.slug",
    "d.icon",
    "d.headerDescription as description",
    "d.createdAt",
    "d.updatedAt",
    jsonArrayFrom(
      eb
        .selectFrom("departmentSections as ds")
        .select([
          "ds.id",
          "ds.title",
          "ds.description",
          "ds.label",
          "ds.displayOrder",
        ])
        .select((eb) => [
          jsonArrayFrom(
            eb
              .selectFrom("departmentSectionCards as dsc")
              .select([
                "dsc.id",
                "dsc.title",
                "dsc.description",
                "dsc.icon",
                "dsc.displayOrder",
              ])
              .whereRef("dsc.sectionId", "=", "ds.id")
              .orderBy("dsc.displayOrder", "asc"),
          ).as("cards"),
        ])
        .whereRef("ds.departmentId", "=", "d.id")
        .orderBy("ds.displayOrder", "asc"),
    ).as("sections"),
  ]);
}

export const getDepartmentByIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    const result = await getDepartmentBasicQuery()
      .where("d.id", "=", data)
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const getDepartmentBySlugFn = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const result = await getDepartmentBasicQuery()
      .where("d.slug", "=", data)
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const deleteDepartmentFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db
      .deleteFrom("departments")
      .where("departments.id", "=", data)
      .execute();

    return { status: "SUCCESS", message: "Deleted department successfully!" };
  });

export const getAllDepartmentsFn = createServerFn({ method: "GET" })
  .validator(getAllDepartmentsSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search } = data;

    function createBaseQuery() {
      let query = db.selectFrom("departments");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("departments.name", "ilike", searchTerm),
            eb("departments.slug", "ilike", searchTerm),
          ]),
        );
      }

      return query;
    }

    let departmentsQuery = createBaseQuery().select([
      "id",
      "name",
      "slug",
      "icon",
      "createdAt",
      "updatedAt",
    ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof data)["sort"];
      departmentsQuery = departmentsQuery.orderBy(columnName, direction);
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    departmentsQuery = departmentsQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [departments, countResult] = await Promise.all([
      departmentsQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      departments,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
