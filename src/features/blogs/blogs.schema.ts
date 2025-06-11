import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name must be less than 50 characters long." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Category name can only contain letters and spaces.",
    }),
  slug: z
    .string()
    .trim()
    .min(2, { message: "Slug must be at least 2 characters long." })
    .max(50, { message: "Slug must be less than 50 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
});
export type CategorySchema = z.infer<typeof categorySchema>;

export const getAllCategoriesSchema = z.object({
  page: z.number().int().min(1).optional().default(1).catch(1),
  pageSize: z
    .number()
    .int()
    .min(5)
    .optional()
    .default(DATATABLE_PAGE_SIZE)
    .catch(DATATABLE_PAGE_SIZE),
  search: z.string().optional(),
  sort: z
    .record(
      z.enum(["id", "name", "slug", "createdAt", "updatedAt"]),
      z.enum(["asc", "desc"]),
    )
    .optional()
    .default({ createdAt: "desc" })
    .catch({ createdAt: "desc" }),
});
export type GetAllCategoriesSchema = z.infer<typeof getAllCategoriesSchema>;
