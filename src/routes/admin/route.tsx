import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { currentUserOptions } from "@/features/auth/auth.queries";

const getSidebarStateFn = createServerFn({ method: "GET" }).handler(() => {
  const defaultOpen = getCookie("sidebar_state") === "true";
  return { defaultOpen };
});

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const data =
      await context.queryClient.ensureQueryData(currentUserOptions());
    if (!data || data.user.role !== "admin")
      throw redirect({ to: "/login", search: { redirect_url: "/admin" } });
  },
  loader: async () => {
    return await getSidebarStateFn();
  },
});

function RouteComponent() {
  const { defaultOpen } = Route.useLoaderData();

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
