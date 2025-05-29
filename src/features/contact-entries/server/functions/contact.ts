import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import {
  contactEntrySchema,
  getAllContactEntriesSchema,
} from "../../contact-entries.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

export const newContactEntryFn = createServerFn()
  .validator(contactEntrySchema)
  .handler(async ({ data }) => {
    await db.insertInto("contactEntries").values(data).execute();

    return {
      status: "SUCCESS",
      message: "Message sent successfully! We'll get back to you soon.",
    };
  });

export const getAllContactEntriesFn = createServerFn({
  method: "GET",
})
  .middleware([ensureAdmin])
  .validator(getAllContactEntriesSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search } = data;

    function createBaseQuery() {
      let query = db.selectFrom("contactEntries");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("contactEntries.name", "ilike", searchTerm),
            eb("contactEntries.email", "ilike", searchTerm),
            eb("contactEntries.phone", "ilike", searchTerm),
            eb("contactEntries.message", "ilike", searchTerm),
          ]),
        );
      }

      return query;
    }

    let contactEntriesQuery = createBaseQuery().selectAll();

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      contactEntriesQuery = contactEntriesQuery.orderBy(
        column as keyof (typeof data)["sort"],
        direction,
      );
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    contactEntriesQuery = contactEntriesQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [contactEntries, countResult] = await Promise.all([
      contactEntriesQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      contactEntries: contactEntries,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const deleteContactEntryFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db
      .deleteFrom("contactEntries")
      .where("contactEntries.id", "=", data)
      .execute();

    return {
      status: "SUCCESS",
      message: "Deleted contact entry successfully!",
    };
  });
