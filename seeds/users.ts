import { faker } from "@faker-js/faker";
import type { Kysely } from "kysely";

import { hashPassword } from "../src/features/auth/server/use-cases/password";

import { DB } from "@/types/database-schemas";

export async function seed(db: Kysely<DB>): Promise<void> {
  faker.seed(0);
  // const userCount = 43;
  // const roles = ["user", "admin"] as const;
  await db.transaction().execute(async (trx) => {
    const user = await trx
      .insertInto("users")
      .values({
        name: "Binamra Lamsal",
        password: await hashPassword("Binamra@1234"),
        role: "admin",
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    await trx
      .insertInto("emails")
      .values({
        email: "binamralamsal@gmail.com",
        userId: user.id,
        isPrimary: true,
        isVerified: true,
      })
      .executeTakeFirstOrThrow();
  });

  // await db.transaction().execute(async (trx) => {
  //   const users = Array.from({ length: userCount }, () => {
  //     const firstName = faker.person.firstName();
  //     const lastName = faker.person.lastName();

  //     return {
  //       firstName,
  //       lastName,
  //       userData: {
  //         name: `${firstName} ${lastName}`,
  //         password: faker.internet.password({
  //           length: faker.number.int({ min: 8, max: 12 }),
  //         }),
  //         role: faker.helpers.arrayElement(roles),
  //       },
  //     };
  //   });

  //   const userResults = await trx
  //     .insertInto("users")
  //     .values(users.map((u) => u.userData))
  //     .returning("id")
  //     .execute();

  //   const emails = users.map((user, index) => ({
  //     email: faker.internet.email({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //     }),
  //     userId: userResults[index].id,
  //   }));

  //   await trx.insertInto("emails").values(emails).execute();
  // });
}
