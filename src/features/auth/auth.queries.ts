import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { GetAllUsersSchema } from "./auth.schema";
import { getAllUsersFn, getUserFn } from "./server/functions/admin-user";
import { getCurrentSessionFn } from "./server/functions/sessions";
import { getCurrentUserFn } from "./server/functions/user";

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

export const getUserOptions = (userId: number) =>
  queryOptions({
    queryKey: ["user", userId],
    queryFn: () => getUserFn({ data: userId }),
  });
