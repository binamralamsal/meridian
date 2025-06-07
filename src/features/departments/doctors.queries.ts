import { queryOptions } from "@tanstack/react-query";

import { getDoctorBySlugFn, getDoctorIdFn } from "./server/functions/doctors";

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
