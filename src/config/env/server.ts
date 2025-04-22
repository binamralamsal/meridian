import { z } from "zod";

export const serverEnv = z
  .object({
    DATABASE_URL: z.string().min(1),
  })
  .parse(process.env);
