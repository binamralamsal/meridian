import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllDoctorsSchema } from "./doctors.schema";
import {
  getAllDoctorsFn,
  getDoctorBySlugFn,
  getDoctorIdFn,
} from "./server/functions/doctors";

export const doctorByIdOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorIdFn({ data: id }),
  });

export const doctorBySlugOptions = ({ slug }: { slug: string }) =>
  queryOptions({
    queryKey: ["doctor", slug],
    queryFn: () => getDoctorBySlugFn({ data: slug }),
  });

export const allDoctorsOptions = (values: GetAllDoctorsSchema) =>
  queryOptions({
    queryKey: ["doctors", values],
    queryFn: () => getAllDoctorsFn({ data: values }),
    placeholderData: keepPreviousData,
  });
