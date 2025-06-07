import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

import { db } from "@/config/db";

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
          .selectAll()
          .whereRef("doctorsAppointmentHours.doctorId", "=", "d.id")
          .orderBy("doctorsAppointmentHours.displayOrder", "asc"),
      ).as("appointmentHours"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsEducation")
          .selectAll()
          .whereRef("doctorsEducation.doctorId", "=", "d.id")
          .orderBy("doctorsEducation.displayOrder", "asc"),
      ).as("education"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsExperiences")
          .selectAll()
          .whereRef("doctorsExperiences.doctorId", "=", "d.id")
          .orderBy("doctorsExperiences.displayOrder", "asc"),
      ).as("experiences"),
      jsonArrayFrom(
        eb
          .selectFrom("doctorsAchievements")
          .selectAll()
          .whereRef("doctorsAchievements.doctorId", "=", "d.id")
          .orderBy("doctorsAchievements.displayOrder", "asc"),
      ).as("achievements"),
    ]);
}

const data = await getDoctorBasicQuery().where("id", "=", 1).executeTakeFirst();
console.log(data);
