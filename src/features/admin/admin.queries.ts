import { queryOptions } from "@tanstack/react-query";

import {
  getAdminStatsFn,
  getPinnedNoticesFn,
} from "./server/functions/admin-stats";

export const adminStatsOptions = () =>
  queryOptions({
    queryKey: ["admin", "stats"],
    queryFn: () => getAdminStatsFn(),
  });

export const pinnedNoticesOptions = () =>
  queryOptions({
    queryKey: ["admin", "pinnedNotices"],
    queryFn: () => getPinnedNoticesFn(),
  });
