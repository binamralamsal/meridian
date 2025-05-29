import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllContactEntriesSchema } from "./contact-entries.schema";
import { getAllContactEntriesFn } from "./server/functions/contact";

export const allContactEntriesOptions = ({
  values,
}: {
  values: Partial<GetAllContactEntriesSchema>;
}) =>
  queryOptions({
    queryKey: ["contact-entries", values],
    queryFn: () => getAllContactEntriesFn({ data: values }),
    placeholderData: keepPreviousData,
  });
