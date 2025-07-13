import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";
import { emptyStringAsOptionalSchema } from "@/util/zod-empty-string-as-optional-schema";

export const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { message: "Title must be at least 10 characters long." })
    .max(1024, { message: "Title must be less than 1024 characters long." }),
  slug: z
    .string()
    .trim()
    .min(4, { message: "Slug must be at least 4 characters long." })
    .max(1024, { message: "Slug must be less than 1024 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
  status: z
    .enum(["draft", "published", "archived"], {
      errorMap: () => ({
        message: "Status must be 'draft', 'published', or 'archived'.",
      }),
    })
    .default("draft"),
  coverFileId: z.number({
    invalid_type_error: "Invalid Cover Photo",
    required_error: "Cover Photo is required",
  }),
  images: z.array(
    z.object({
      id: z.number().optional(),
      fileId: z.number({
        invalid_type_error: "Image is required",
        required_error: "Image is required",
      }),
      caption: z
        .string()
        .trim()
        .min(1, { message: "Caption is required" })
        .max(1024, {
          message: "Caption must be less than 1024 characters long.",
        }),
      displayOrder: z.number({
        required_error: "Display order is required",
        invalid_type_error: "Display order must be a number",
      }),
      new: z.boolean().optional(),
    }),
  ),
  content: z
    .string()
    .trim()
    .min(20, { message: "Content must be at least 20 characters long." }),
  seoTitle: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(10, { message: "SEO title must be at least 10 characters long." })
      .max(1024, {
        message: "SEO title must be less than 1024 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  seoDescription: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(15, {
        message: "SEO description must be at least 15 characters long.",
      })
      .max(2048, {
        message: "SEO description must be less than 2048 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  seoKeywords: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(10, {
        message: "SEO keywords must be at least 10 characters long.",
      })
      .max(2048, {
        message: "SEO keywords must be less than 2048 characters long.",
      })
      .optional()
      .nullable()
      .default(null),
  ),
  authorId: z
    .number({ message: "Invalid Author" })
    .int({ message: "Invalid Author" })
    .optional()
    .nullable()
    .default(null),
});
export type GallerySchema = z.infer<typeof gallerySchema>;
export type GallerySchemaInput = z.input<typeof gallerySchema>;

export const getAllGalleriesSchema = z.object({
  page: z.number().int().min(1).optional().default(1).catch(1),
  pageSize: z
    .number()
    .int()
    .min(5)
    .optional()
    .default(DATATABLE_PAGE_SIZE)
    .catch(DATATABLE_PAGE_SIZE),
  search: z.string().optional(),
  status: z
    .array(z.enum(["draft", "published", "archived"]))
    .optional()
    .default([])
    .catch([]),
  sort: z
    .record(
      z.enum([
        "id",
        "title",
        "slug",
        "status",
        "author",
        "createdAt",
        "updatedAt",
      ]),
      z.enum(["asc", "desc"]),
    )
    .optional()
    .default({ createdAt: "desc" })
    .catch({ createdAt: "desc" }),
});
export type GetAllGalleriesSchema = z.infer<typeof getAllGalleriesSchema>;
