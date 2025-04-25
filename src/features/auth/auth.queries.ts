import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllUsersSchema } from "./auth.schema";
import { getCurrentSessionFn } from "./server/functions/sessions";
import { getAllUsersFn, getCurrentUserFn } from "./server/functions/user";

export const currentUserSessionOptions = () =>
  queryOptions({
    queryKey: ["current-session"],
    queryFn: getCurrentSessionFn,
  });

export const currentUserOptions = () =>
  queryOptions({
    queryKey: ["current-user"],
    queryFn: getCurrentUserFn,
  });

export const allUsersOptions = ({ values }: { values: GetAllUsersSchema }) =>
  queryOptions({
    queryKey: ["users", values],
    queryFn: () => getAllUsersFn({ data: values }),
    placeholderData: keepPreviousData,
  });
