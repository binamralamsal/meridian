import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";

export const Route = createFileRoute("/admin/blog-categories_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper
      pageTitle="Add New Category"
      breadcrumbs={[
        { href: "/admin/blog-categories", label: "All Categories" },
      ]}
    >
      <div></div>
    </AdminPageWrapper>
  );
}
