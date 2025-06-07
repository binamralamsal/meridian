import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { currentUserOptions } from "@/features/auth/auth.queries";
import { ConfirmProvider } from "@/stores/confirm-alert";

const getSidebarStateFn = createServerFn({ method: "GET" }).handler(() => {
  const sidebarState = getCookie("sidebar_state");
  const defaultOpen = sidebarState ? sidebarState === "true" : true;

  return { defaultOpen };
});

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const data =
      await context.queryClient.ensureQueryData(currentUserOptions());
    if (!data || data.user.role !== "admin")
      throw redirect({ to: "/login", search: { redirect_url: location.href } });
  },
  loader: async () => {
    return await getSidebarStateFn();
  },
});

function RouteComponent() {
  const { defaultOpen } = Route.useLoaderData();

  return (
    <ConfirmProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ConfirmProvider>
  );
}
