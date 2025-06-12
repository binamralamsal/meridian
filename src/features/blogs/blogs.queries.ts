import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllBlogsSchema, GetAllCategoriesSchema } from "./blogs.schema";
import {
  getAllBlogsFn,
  getBlogByIdFn,
  getBlogBySlugFn,
} from "./server/functions/blogs";
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

export const blogByIdOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["blog", id],
    queryFn: () => getBlogByIdFn({ data: id }),
  });

export const blogBySlugOptions = ({ slug }: { slug: string }) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: () => getBlogBySlugFn({ data: slug }),
  });

export const allBlogsOptions = (values: GetAllBlogsSchema) =>
  queryOptions({
    queryKey: ["blogs", values],
    queryFn: () => getAllBlogsFn({ data: values }),
    placeholderData: keepPreviousData,
  });
