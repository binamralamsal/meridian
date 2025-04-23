import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";

import { loginUserSchema } from "../../auth.schema";
import { verifyPassword } from "../use-cases/password";
import {
  createSession,
  generateSessionToken,
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
