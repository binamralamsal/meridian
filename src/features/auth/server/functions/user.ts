import { z } from "zod";

import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";

import { getAllUsersSchema, loginUserSchema } from "../../auth.schema";
import { ensureAdmin } from "../middlewares/ensure-admin";
import { verifyPassword } from "../use-cases/password";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
} from "../use-cases/sessions";
import { getCurrentSessionFn } from "./sessions";

import { db } from "@/config/db";

export const loginUserFn = createServerFn({ method: "POST" })
  .validator(loginUserSchema)
  .handler(async (ctx) => {
    const { email, password } = ctx.data;

    const user = await db
      .selectFrom("users")
      .innerJoin("emails", "emails.userId", "users.id")
      .select([
        "users.id as id",
        "users.name",
        "users.password",
        "users.role",
        "emails.email",
      ])
      .where("email", "=", email)
      .executeTakeFirst();

    const errorMessage = "Oops! Incorrect email or password. Please try again";

    if (!user) return { status: "ERROR", message: errorMessage };

    const isPasswordValid = await verifyPassword({
      hashedPassword: user.password,
      password,
    });

    if (!isPasswordValid) return { status: "ERROR", message: errorMessage };

    const ip = getHeader("x-forwarded-for") || "0.0.0.0";
    const userAgent = getHeader("user-agent") || "unknown";

    const token = generateSessionToken();
    await createSession({ token, userId: user.id, ip, userAgent });

    setSessionTokenCookie(token);

    return { status: "SUCCESS", message: "Login successful" };
  });

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const currentSesion = await getCurrentSessionFn();
    if (!currentSesion) return null;

    const currentUser = await db
      .selectFrom("users")
      .innerJoin("emails", "emails.userId", "users.id")
      .select([
        "users.id",
        "users.name",
        "users.createdAt",
        "users.updatedAt",
        "users.role",
        "emails.email",
      ])
      .where("users.id", "=", currentSesion.userId)
      .executeTakeFirst();

    if (!currentUser) return null;

    return { session: currentSesion, user: currentUser };
  },
);

export const logoutUserFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const currentSesion = await getCurrentSessionFn();
    if (currentSesion) {
      await invalidateSession(currentSesion.id);
      deleteSessionTokenCookie();
    }

    throw redirect({ to: "/login", search: { redirect_url: "/admin" } });
  },
);

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
  .handler(async ({ data }) => {
    await db.deleteFrom("users").where("users.id", "=", data).execute();

    return { status: "SUCCESS", message: "Deleted user successfully!" };
  });
