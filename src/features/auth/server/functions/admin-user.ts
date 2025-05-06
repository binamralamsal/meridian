import { DatabaseError } from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { getAllUsersSchema, newUserSchema } from "../../auth.schema";
import { ensureAdmin } from "../middlewares/ensure-admin";
import { hashPassword } from "../use-cases/password";

import { db } from "@/config/db";

export const getAllUsersFn = createServerFn({ method: "GET" })
  .validator(getAllUsersSchema)
  .middleware([ensureAdmin])
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search, role } = data;

    function createBaseQuery() {
      let query = db
        .selectFrom("users")
        .innerJoin("emails", "emails.userId", "users.id");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.where((eb) =>
          eb.or([
            eb("users.name", "ilike", searchTerm),
            eb("emails.email", "ilike", searchTerm),
          ]),
        );
      }

      if (role && role.length > 0) {
        query = query.where("users.role", "in", role);
      }

      return query;
    }

    let usersQuery = createBaseQuery().select([
      "users.id",
      "users.name",
      "users.role",
      "users.createdAt",
      "users.updatedAt",
      "emails.email",
    ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      if (column === "email") {
        usersQuery = usersQuery.orderBy("emails.email", direction);
      } else {
        const columnName = `users.${column}` as Exclude<
          keyof (typeof data)["sort"],
          "email"
        >;
        usersQuery = usersQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    usersQuery = usersQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [users, countResult] = await Promise.all([
      usersQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      users,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });

export const deleteUserFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data, context: { auth } }) => {
    if (data === auth.user.id)
      return { status: "ERROR", message: "Oops! You can not delete yourself!" };

    await db.deleteFrom("users").where("users.id", "=", data).execute();

    return { status: "SUCCESS", message: "Deleted user successfully!" };
  });

export const createUserFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(newUserSchema)
  .handler(async ({ data }) => {
    const hashedPassword = await hashPassword(data.password);

    try {
      await db.transaction().execute(async (trx) => {
        const { id: userId } = await trx
          .insertInto("users")
          .values({
            name: data.name,
            password: hashedPassword,
            role: data.role,
          })
          .returning(["id"])
          .executeTakeFirstOrThrow();
        await trx
          .insertInto("emails")
          .values({ userId, email: data.email })
          .executeTakeFirstOrThrow();
      });
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A user with this email address already exists. Please try a different email.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occured while creating user!",
      };
    }

    return { status: "SUCCESS", message: "User created successfully!" };
  });
