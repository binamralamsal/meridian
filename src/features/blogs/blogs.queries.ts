import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllCategoriesSchema } from "./blogs.schema";
import {
  getAllCategoriesFn,
  getCategoryByIdFn,
} from "./server/functions/categories";

export const allCategoriesOptions = ({
  values,
}: {
  values: Partial<GetAllCategoriesSchema>;
}) =>
  queryOptions({
    queryKey: ["categories", values],
    queryFn: () => getAllCategoriesFn({ data: values }),
    placeholderData: keepPreviousData,
  });

export const categoryByIdOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["category", id],
    queryFn: () => getCategoryByIdFn({ data: id }),
  });
