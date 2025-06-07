import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";

const cardSchema = z.object({
  id: z.number(),
  icon: z
    .string({ required_error: "Card icon is required" })
    .min(1, "Card icon cannot be empty"),
  title: z
    .string({ required_error: "Card title is required" })
    .min(3, "Card title must be at least 3 characters"),
  description: z
    .string({ required_error: "Card description is required" })
    .min(3, "Card description must be at least 3 characters"),
  displayOrder: z.number({ required_error: "Card display order is required" }),
  new: z.boolean().optional(),
});

const sectionSchema = z.object({
  id: z.number(),
  label: z
    .string({ required_error: "Section label is required" })
    .min(1, "Section label cannot be empty"),
  title: z
    .string({ required_error: "Section title is required" })
    .min(3, "Section title must be at least 3 characters"),
  description: z
    .string({ required_error: "Section description is required" })
    .min(3, "Section description must be at least 3 characters"),
  displayOrder: z.number({
    required_error: "Section display order is required",
  }),
  new: z.boolean().optional(),
  cards: z
    .array(cardSchema, { required_error: "Section cards are required" })
    .min(1, "Each section must have at least one card"),
});

export const departmentSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
  icon: z
    .string({ required_error: "Icon is required" })
    .min(1, "Icon cannot be empty"),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, "Description must be at least 3 characters"),
  sections: z
    .array(sectionSchema, { required_error: "Sections are required" })
    .min(1, "There must be at least one section"),
});
export type DepartmentSchema = z.infer<typeof departmentSchema>;

export const getAllDepartmentsSchema = z.object({
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
export type GetAllDepartmentsSchema = z.infer<typeof getAllDepartmentsSchema>;
