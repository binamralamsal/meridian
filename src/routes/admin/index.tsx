import { createFileRoute, redirect } from "@tanstack/react-router";

import { currentUserOptions } from "@/features/auth/auth.queries";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const data =
      await context.queryClient.ensureQueryData(currentUserOptions());
    if (!data)
      throw redirect({ to: "/login", search: { redirect_url: "/admin" } });
  },
});

function RouteComponent() {
  return <div>admin</div>;
}
