import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

export const getAdminStatsFn = createServerFn({ method: "GET" })
  .middleware([ensureAdmin])
  .handler(async () => {
    const [
      blogsCount,
      usersCount,
      contactEntriesCount,
      doctorsCount,
      departmentsCount,
      galleriesCount,
      pinnedNoticesCount,
    ] = await Promise.all([
      db
        .selectFrom("blogs")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("users")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("contactEntries")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("doctors")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("departments")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("galleries")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
      db
        .selectFrom("pinnedNotices")
        .select(db.fn.countAll().as("count"))
        .executeTakeFirst(),
    ]);

    const usersByRole = await db
      .selectFrom("users")
      .select(["role", db.fn.countAll().as("count")])
      .groupBy("role")
      .execute();

    const contactEntriesByDay = await db
      .selectFrom("contactEntries")
      .select((cb) => [
        sql<string>`DATE(${cb.ref("createdAt")})`.as("date"),
        db.fn.countAll().as("count"),
      ])
      .where("createdAt", ">=", sql<Date>`NOW() - INTERVAL '30 days'`)
      .groupBy((cb) => sql`DATE(${cb.ref("createdAt")})`)
      .orderBy("date", "asc")
      .execute();

    const blogsByDay = await db
      .selectFrom("blogs")
      .select((cb) => [
        sql<string>`DATE(${cb.ref("createdAt")})`.as("date"),
        db.fn.countAll().as("count"),
      ])
      .where("createdAt", ">=", sql<Date>`NOW() - INTERVAL '30 days'`)
      .groupBy((cb) => sql`DATE(${cb.ref("createdAt")})`)
      .orderBy("date", "asc")
      .execute();

    return {
      counts: {
        blogs: Number(blogsCount?.count || 0),
        users: Number(usersCount?.count || 0),
        contactEntries: Number(contactEntriesCount?.count || 0),
        doctors: Number(doctorsCount?.count || 0),
        departments: Number(departmentsCount?.count || 0),
        galleries: Number(galleriesCount?.count || 0),
        pinnedNotices: Number(pinnedNoticesCount?.count || 0),
      },
      usersByRole: usersByRole.map((r) => ({
        role: r.role,
        count: Number(r.count),
      })),
      contactEntriesByDay: contactEntriesByDay.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
      blogsByDay: blogsByDay.map((d) => ({
        date: d.date,
        count: Number(d.count),
      })),
    };
  });

export const getPinnedNoticesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const notices = await db
      .selectFrom("pinnedNotices")
      .select(["id", "title", "createdAt"])
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
            .whereRef("uploadedFiles.id", "=", "pinnedNotices.fileId"),
        ).as("file"),
      ])
      .orderBy("createdAt", "desc")
      .execute();

    return notices;
  },
);

export const addPinnedNoticeFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(
    z.object({
      title: z.string().min(1, "Title is required"),
      fileId: z.number().int().positive("File is required"),
    }),
  )
  .handler(async ({ data }) => {
    await db.insertInto("pinnedNotices").values(data).execute();

    return { status: "SUCCESS", message: "Notice pinned successfully!" };
  });

export const removePinnedNoticeFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    await db.deleteFrom("pinnedNotices").where("id", "=", data).execute();

    return { status: "SUCCESS", message: "Notice removed successfully!" };
  });
