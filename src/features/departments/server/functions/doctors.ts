import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import pg from "pg";
import { z } from "zod";

import { createServerFn } from "@tanstack/react-start";

import { doctorSchema, getAllDoctorsSchema } from "../../doctors.schema";

import { db } from "@/config/db";
import { ensureAdmin } from "@/features/auth/server/middlewares/ensure-admin";

const { DatabaseError } = pg;

export const saveDoctorFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.object({ values: doctorSchema, id: z.number().optional() }))
  .handler(async ({ data }) => {
    const { values, id } = data;
    try {
      if (id) {
        await db.transaction().execute(async (trx) => {
          await trx
            .updateTable("doctors")
            .where("id", "=", id)
            .set({
              name: values.name,
              slug: values.slug,
              role: values.role,
              description: values.description,
              email: values.email,
              phoneNumber: values.phoneNumber,
              location: values.location,
              photoFileId: values.photoFileId,
              departmentId: values.departmentId,
            })
            .executeTakeFirstOrThrow();

          // Handle appointment hours
          if (values.appointmentHours.length > 0) {
            const existingAppointmentHours = values.appointmentHours
              .filter((appointmentHour) => !appointmentHour.new)
              .map((v) => v.id);

            // Only delete if there are existing records to preserve
            if (existingAppointmentHours.length > 0) {
              await trx
                .deleteFrom("doctorsAppointmentHours")
                .where("doctorId", "=", id)
                .where("id", "not in", existingAppointmentHours)
                .execute();
            } else {
              // Delete all records if no existing ones to preserve
              await trx
                .deleteFrom("doctorsAppointmentHours")
                .where("doctorId", "=", id)
                .execute();
            }

            await trx
              .insertInto("doctorsAppointmentHours")
              .values(
                values.appointmentHours.map((value) => ({
                  ...(!value.new && { id: value.id }),
                  timeStart: value.timeStart,
                  timeEnd: value.timeEnd,
                  day: value.day,
                  displayOrder: value.displayOrder,
                  doctorId: id,
                })),
              )
              .onConflict((oc) =>
                oc.column("id").doUpdateSet((val) => ({
                  day: val.ref("excluded.day"),
                  timeStart: val.ref("excluded.timeStart"),
                  timeEnd: val.ref("excluded.timeEnd"),
                  displayOrder: val.ref("excluded.displayOrder"),
                })),
              )
              .execute();
          } else {
            // If appointment hours is empty, delete all existing records
            await trx
              .deleteFrom("doctorsAppointmentHours")
              .where("doctorId", "=", id)
              .execute();
          }

          // Handle education
          if (values.education.length > 0) {
            const existingEducationDetails = values.education
              .filter((ed) => !ed.new)
              .map((ed) => ed.id);

            if (existingEducationDetails.length > 0) {
              await trx
                .deleteFrom("doctorsEducation")
                .where("doctorId", "=", id)
                .where("id", "not in", existingEducationDetails)
                .execute();
            } else {
              await trx
                .deleteFrom("doctorsEducation")
                .where("doctorId", "=", id)
                .execute();
            }

            await trx
              .insertInto("doctorsEducation")
              .values(
                values.education.map((value) => ({
                  ...(!value.new && { id: value.id }),
                  degree: value.degree,
                  institution: value.institution,
                  displayOrder: value.displayOrder,
                  yearOfCompletion: value.yearOfCompletion,
                  doctorId: id,
                })),
              )
              .onConflict((oc) =>
                oc.column("id").doUpdateSet((val) => ({
                  degree: val.ref("excluded.degree"),
                  institution: val.ref("excluded.institution"),
                  displayOrder: val.ref("excluded.displayOrder"),
                  yearOfCompletion: val.ref("excluded.yearOfCompletion"),
                })),
              )
              .execute();
          } else {
            // If education is empty, delete all existing records
            await trx
              .deleteFrom("doctorsEducation")
              .where("doctorId", "=", id)
              .execute();
          }

          // Handle experiences
          if (values.experiences.length > 0) {
            const existingExperiences = values.experiences
              .filter((ex) => !ex.new)
              .map((ex) => ex.id);

            if (existingExperiences.length > 0) {
              await trx
                .deleteFrom("doctorsExperiences")
                .where("doctorId", "=", id)
                .where("id", "not in", existingExperiences)
                .execute();
            } else {
              await trx
                .deleteFrom("doctorsExperiences")
                .where("doctorId", "=", id)
                .execute();
            }

            await trx
              .insertInto("doctorsExperiences")
              .values(
                values.experiences.map((value) => ({
                  ...(!value.new && { id: value.id }),
                  role: value.role,
                  shortDescription: value.shortDescription,
                  displayOrder: value.displayOrder,
                  doctorId: id,
                })),
              )
              .onConflict((oc) =>
                oc.column("id").doUpdateSet((val) => ({
                  role: val.ref("excluded.role"),
                  shortDescription: val.ref("excluded.shortDescription"),
                  displayOrder: val.ref("excluded.displayOrder"),
                })),
              )
              .execute();
          } else {
            // If experiences is empty, delete all existing records
            await trx
              .deleteFrom("doctorsExperiences")
              .where("doctorId", "=", id)
              .execute();
          }

          // Handle achievements
          if (values.achievements.length > 0) {
            const existingAchievements = values.achievements
              .filter((ex) => !ex.new)
              .map((ex) => ex.id);

            if (existingAchievements.length > 0) {
              await trx
                .deleteFrom("doctorsAchievements")
                .where("doctorId", "=", id)
                .where("id", "not in", existingAchievements)
                .execute();
            } else {
              await trx
                .deleteFrom("doctorsAchievements")
                .where("doctorId", "=", id)
                .execute();
            }

            await trx
              .insertInto("doctorsAchievements")
              .values(
                values.achievements.map((value) => ({
                  ...(!value.new && { id: value.id }),
                  title: value.title,
                  year: value.year,
                  doctorId: id,
                  displayOrder: value.displayOrder,
                })),
              )
              .onConflict((oc) =>
                oc.column("id").doUpdateSet((val) => ({
                  title: val.ref("excluded.title"),
                  year: val.ref("excluded.year"),
                  displayOrder: val.ref("excluded.displayOrder"),
                })),
              )
              .execute();
          } else {
            // If achievements is empty, delete all existing records
            await trx
              .deleteFrom("doctorsAchievements")
              .where("doctorId", "=", id)
              .execute();
          }
        });

        return {
          status: "SUCCESS",
          message: "Updated doctor successfully!",
        };
      } else {
        await db.transaction().execute(async (trx) => {
          const response = await trx
            .insertInto("doctors")
            .values({
              name: values.name,
              slug: values.slug,
              role: values.role,
              description: values.description,
              email: values.email,
              phoneNumber: values.phoneNumber,
              location: values.location,
              photoFileId: values.photoFileId,
              departmentId: values.departmentId,
            })
            .returning("id")
            .executeTakeFirstOrThrow();

          // Only insert appointment hours if the array is not empty
          if (values.appointmentHours.length > 0) {
            await trx
              .insertInto("doctorsAppointmentHours")
              .values(
                values.appointmentHours.map((value) => ({
                  timeStart: value.timeStart,
                  timeEnd: value.timeEnd,
                  day: value.day,
                  displayOrder: value.displayOrder,
                  doctorId: response.id,
                })),
              )
              .execute();
          }

          // Only insert education if the array is not empty
          if (values.education.length > 0) {
            await trx
              .insertInto("doctorsEducation")
              .values(
                values.education.map((value) => ({
                  degree: value.degree,
                  institution: value.institution,
                  displayOrder: value.displayOrder,
                  yearOfCompletion: value.yearOfCompletion,
                  doctorId: response.id,
                })),
              )
              .execute();
          }

          // Only insert experiences if the array is not empty
          if (values.experiences.length > 0) {
            await trx
              .insertInto("doctorsExperiences")
              .values(
                values.experiences.map((value) => ({
                  role: value.role,
                  shortDescription: value.shortDescription,
                  displayOrder: value.displayOrder,
                  doctorId: response.id,
                })),
              )
              .execute();
          }

          // Only insert achievements if the array is not empty
          if (values.achievements.length > 0) {
            await trx
              .insertInto("doctorsAchievements")
              .values(
                values.achievements.map((value) => ({
                  title: value.title,
                  year: value.year,
                  displayOrder: value.displayOrder,
                  doctorId: response.id,
                })),
              )
              .execute();
          }
        });

        return {
          status: "SUCCESS",
          message: "Created doctor successfully!",
        };
      }
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return {
          status: "ERROR",
          message:
            "A doctor with this slug already exists. Please try a different slug.",
        };
      }

      return {
        status: "ERROR",
        message: "Internal server error occurred while saving doctor!",
      };
    }
  });

function getDoctorBasicQuery() {
  return db
    .selectFrom("doctors as d")
    .select((eb) => [
      "d.id",
      "d.name",
      "d.slug",
      "d.role",
      "d.description",
      "d.phoneNumber",
      "d.email",
      "d.location",
      "d.createdAt",
      "d.updatedAt",
      jsonObjectFrom(
        eb
          .selectFrom("uploadedFiles")
          .select([
            "uploadedFiles.id",
            "uploadedFiles.name",
            "uploadedFiles.url",
            "uploadedFiles.fileType",
          ])
          .whereRef("uploadedFiles.id", "=", "d.photoFileId"),
      ).as("photo"),
      jsonObjectFrom(
        eb
          .selectFrom("departments")
          .select(["departments.name", "departments.id", "departments.slug"])
          .whereRef("departments.id", "=", "d.departmentId"),
      ).as("department"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsAppointmentHours")
          .select([
            "doctorsAppointmentHours.id",
            "doctorsAppointmentHours.day",
            "doctorsAppointmentHours.timeEnd",
            "doctorsAppointmentHours.timeStart",
            "doctorsAppointmentHours.displayOrder",
          ])
          .whereRef("doctorsAppointmentHours.doctorId", "=", "d.id")
          .orderBy("doctorsAppointmentHours.displayOrder", "asc"),
      ).as("appointmentHours"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsEducation")
          .select([
            "doctorsEducation.id",
            "doctorsEducation.institution",
            "doctorsEducation.degree",
            "doctorsEducation.yearOfCompletion",
            "doctorsEducation.displayOrder",
          ])
          .whereRef("doctorsEducation.doctorId", "=", "d.id")
          .orderBy("doctorsEducation.displayOrder", "asc"),
      ).as("education"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsExperiences")
          .select([
            "doctorsExperiences.id",
            "doctorsExperiences.role",
            "doctorsExperiences.shortDescription",
            "doctorsExperiences.displayOrder",
          ])
          .whereRef("doctorsExperiences.doctorId", "=", "d.id")
          .orderBy("doctorsExperiences.displayOrder", "asc"),
      ).as("experiences"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsAchievements")
          .select([
            "doctorsAchievements.id",
            "doctorsAchievements.title",
            "doctorsAchievements.year",
            "doctorsAchievements.displayOrder",
          ])
          .whereRef("doctorsAchievements.doctorId", "=", "d.id")
          .orderBy("doctorsAchievements.displayOrder", "asc"),
      ).as("achievements"),
    ]);
}

export const getDoctorIdFn = createServerFn({ method: "GET" })
  .validator(z.number().int().positive())
  .handler(async ({ data }) => {
    const result = await getDoctorBasicQuery()
      .where("d.id", "=", data)
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const getDoctorBySlugFn = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data }) => {
    const result = await getDoctorBasicQuery()
      .where("d.slug", "=", data)
      .executeTakeFirst();
    if (!result) return null;
    return result;
  });

export const deleteDoctorFn = createServerFn()
  .middleware([ensureAdmin])
  .validator(z.number().int())
  .handler(async ({ data }) => {
    await db.deleteFrom("doctors").where("doctors.id", "=", data).execute();

    return { status: "SUCCESS", message: "Deleted doctor successfully!" };
  });

export const getAllDoctorsFn = createServerFn({ method: "GET" })
  .validator(getAllDoctorsSchema)
  .handler(async ({ data }) => {
    const { sort, page, pageSize, search, departments } = data;
    console.log({ page, pageSize });

    function createBaseQuery() {
      let query = db
        .selectFrom("doctors")
        .leftJoin("departments", "departments.id", "doctors.departmentId");

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;

        query = query.where((eb) =>
          eb.or([
            eb("doctors.name", "ilike", searchTerm),
            eb("doctors.slug", "ilike", searchTerm),
            eb("doctors.role", "ilike", searchTerm),
            eb("doctors.email", "ilike", searchTerm),
          ]),
        );
      }

      if (departments.length > 0) {
        query = query.where("departments.slug", "in", departments);
      }

      return query;
    }

    let doctorsQuery = createBaseQuery()
      .select([
        "doctors.name",
        "doctors.id",
        "doctors.slug",
        "doctors.role",
        "doctors.email",
        "doctors.createdAt",
        "doctors.updatedAt",
        "departments.id as departmentId",
        "departments.name as departmentName",
        "departments.slug as departmentSlug",
      ])
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("uploadedFiles")
            .select([
              "uploadedFiles.id",
              "uploadedFiles.name",
              "uploadedFiles.url",
              "uploadedFiles.fileType",
            ])
            .whereRef("uploadedFiles.id", "=", "doctors.photoFileId"),
        ).as("photo"),
      ]);

    Object.entries(sort).forEach(([column, direction]) => {
      if (!direction) return;

      const columnName = column as keyof (typeof data)["sort"];
      if (columnName === "department") {
        doctorsQuery = doctorsQuery.orderBy("departments.name", direction);
      } else {
        doctorsQuery = doctorsQuery.orderBy(columnName, direction);
      }
    });

    const offset = Math.max(0, (page - 1) * pageSize);
    doctorsQuery = doctorsQuery.limit(pageSize).offset(offset);

    const countQuery = createBaseQuery().select(db.fn.countAll().as("count"));

    const [doctors, countResult] = await Promise.all([
      doctorsQuery.execute(),
      countQuery.executeTakeFirst(),
    ]);

    const totalCount = Number(countResult?.count || 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      doctors,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages,
      },
    };
  });
