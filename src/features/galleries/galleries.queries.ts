import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllGalleriesSchema } from "./galleries.schema";
import {
  getAllGalleriesFn,
  getGalleryByIdFn,
  getGalleryBySlugFn,
} from "./server/functions/galleries";

export const galleryByIdOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["gallery", id],
    queryFn: () => getGalleryByIdFn({ data: id }),
  });

export const galleryBySlugOptions = ({ slug }: { slug: string }) =>
  queryOptions({
    queryKey: ["blog", slug],
    queryFn: () => getGalleryBySlugFn({ data: slug }),
  });

export const allGalleriesOptions = (values: Partial<GetAllGalleriesSchema>) =>
  queryOptions({
    queryKey: ["blogs", values],
    queryFn: () => getAllGalleriesFn({ data: values }),
    placeholderData: keepPreviousData,
  });
