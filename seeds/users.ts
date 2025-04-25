import { faker } from "@faker-js/faker";
import type { Kysely } from "kysely";

import { DB } from "@/types/database-schemas";

export async function seed(db: Kysely<DB>): Promise<void> {
  faker.seed(0);
  const userCount = 43;
  const roles = ["user", "admin"] as const;

  await db.transaction().execute(async (trx) => {
    const users = Array.from({ length: userCount }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      return {
        firstName,
        lastName,
        userData: {
          name: `${firstName} ${lastName}`,
          password: faker.internet.password({
            length: faker.number.int({ min: 8, max: 12 }),
          }),
          role: faker.helpers.arrayElement(roles),
        },
      };
    });

    const userResults = await trx
      .insertInto("users")
      .values(users.map((u) => u.userData))
      .returning("id")
      .execute();

    const emails = users.map((user, index) => ({
      email: faker.internet.email({
        firstName: user.firstName,
        lastName: user.lastName,
      }),
      userId: userResults[index].id,
    }));

    await trx.insertInto("emails").values(emails).execute();
  });
}
