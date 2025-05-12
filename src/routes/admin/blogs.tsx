import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";

export const Route = createFileRoute("/admin/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper pageTitle="All Blogs">
      <div></div>
    </AdminPageWrapper>
  );
}
