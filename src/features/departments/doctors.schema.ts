import { z } from "zod";

import { DATATABLE_PAGE_SIZE } from "@/config/constants";
import { coerceToNumberSchema } from "@/util/src/util/zod-coerce-to-number-schema";

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;

const appointmentHourSchema = z.object({
  id: z.number(),
  day: z.enum(
    [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    {
      required_error: "Day of the week is required",
      invalid_type_error: "Invalid day provided",
    },
  ),
  timeStart: z
    .string({ required_error: "Start time is required" })
    .trim()
    .min(1, "Start time is required")
    .regex(timeRegex, "Invalid Time Format"),
  timeEnd: z
    .string({ required_error: "End time is required" })
    .trim()
    .min(1, "End time is required")
    .regex(timeRegex, "Invalid Time Format"),
  displayOrder: z.number({
    required_error: "Display order is required",
    invalid_type_error: "Display order must be a number",
  }),
  new: z.boolean().optional(),
});

const educationSchema = z.object({
  id: z.number(),
  institution: z
    .string({ required_error: "Institution name is required" })
    .min(2, "Institution name must be at least 2 characters long"),
  degree: z
    .string({ required_error: "Degree is required" })
    .min(2, "Degree must be at least 2 characters long"),
  yearOfCompletion: coerceToNumberSchema(
    z
      .number({
        required_error: "Year of completion is required",
        invalid_type_error: "Year must only include numbers.",
      })
      .min(1900, "Year must not be before 1900")
      .max(
        new Date().getFullYear() + 5,
        `Year must not be after ${new Date().getFullYear() + 5}`,
      ),
  ),
  displayOrder: z.number({
    required_error: "Display order is required",
    invalid_type_error: "Display order must be a number",
  }),
  new: z.boolean().optional(),
});

const experienceSchema = z.object({
  id: z.number(),
  role: z
    .string({ required_error: "Role is required" })
    .min(2, "Role must be at least 2 characters long"),
  shortDescription: z
    .string({ required_error: "Short description is required" })
    .min(3, "Description must be at least 3 characters long"),
  displayOrder: z.number({
    required_error: "Display order is required",
    invalid_type_error: "Display order must be a number",
  }),
  new: z.boolean().optional(),
});

const achievementSchema = z.object({
  id: z.number(),
  title: z
    .string({ required_error: "Title is required" })
    .min(2, "Title must be at least 2 characters long"),
  year: coerceToNumberSchema(
    z
      .number({
        required_error: "Year is required",
        invalid_type_error: "Year must only include numbers.",
      })
      .min(1900, "Year must not be before 1900")
      .max(
        new Date().getFullYear() + 5,
        `Year must not be after ${new Date().getFullYear() + 5}`,
      ),
  ),
  displayOrder: z.number({
    required_error: "Display order is required",
    invalid_type_error: "Display order must be a number",
  }),
  new: z.boolean().optional(),
});

export const doctorSchema = z.object({
  name: z
    .string({ required_error: "Doctor name is required" })
    .min(3, "Name must be at least 3 characters long"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Spaces are not allowed.",
    }),
  role: z
    .string({ required_error: "Role is required" })
    .min(2, "Role must be at least 2 characters long"),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must be at least 5 characters long"),
  photoFileId: z.number({
    invalid_type_error: "Invalid photo",
    required_error: "Photo is required",
  }),
  departmentId: z.number({
    required_error: "Department ID is required",
    invalid_type_error: "Department ID must be a number",
  }),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email("Invalid email format").nullable().optional(),
  location: z.string().nullable().optional(),
  appointmentHours: z
    .array(appointmentHourSchema, {
      required_error: "Appointment hours are required",
    })
    .min(1, "At least one appointment hour is required"),
  education: z
    .array(educationSchema, {
      required_error: "Education history is required",
    })
    .min(1, "At least one education entry is required"),
  experiences: z
    .array(experienceSchema, {
      required_error: "Experience history is required",
    })
    .min(1, "At least one experience entry is required"),
  achievements: z.array(achievementSchema).optional().default([]),
});
export type DoctorSchema = z.infer<typeof doctorSchema>;
export type DoctorSchemaInput = z.input<typeof doctorSchema>;

export const getAllDoctorsSchema = z.object({
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
      z.enum([
        "id",
        "name",
        "slug",
        "role",
        "email",
        "department",
        "createdAt",
        "updatedAt",
      ]),
      z.enum(["asc", "desc"]),
    )
    .optional()
    .default({ createdAt: "desc" })
    .catch({ createdAt: "desc" }),
  departments: z.array(z.string()).optional().default([]).catch([]),
});
export type GetAllDoctorsSchema = z.input<typeof getAllDoctorsSchema>;
