import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";

export const Route = createFileRoute("/admin/blog-categories")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper pageTitle="All Categories">
      <div></div>
    </AdminPageWrapper>
  );
}
