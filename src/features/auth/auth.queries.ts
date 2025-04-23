import { queryOptions } from "@tanstack/react-query";

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
