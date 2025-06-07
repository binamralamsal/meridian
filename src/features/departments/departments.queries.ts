import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllDepartmentsSchema } from "./departments.schema";
import {
  getAllDepartmentsFn,
  getDepartmentByIdFn,
  getDepartmentBySlugFn,
} from "./server/functions/departments";

export const departmentByIdOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["department", id],
    queryFn: () => getDepartmentByIdFn({ data: id }),
  });

export const departmentBySlugOptions = ({ slug }: { slug: string }) =>
  queryOptions({
    queryKey: ["department", slug],
    queryFn: () => getDepartmentBySlugFn({ data: slug }),
  });

export const allDepartmentsOptions = ({
  values,
}: {
  values: GetAllDepartmentsSchema;
}) =>
  queryOptions({
    queryKey: ["departments", values],
    queryFn: () => getAllDepartmentsFn({ data: values }),
    placeholderData: keepPreviousData,
  });
