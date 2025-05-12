import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";

export const Route = createFileRoute("/admin/doctors_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper
      pageTitle="Add New Doctor"
      breadcrumbs={[{ href: "/admin/doctors", label: "All Doctors" }]}
    >
      <div></div>
    </AdminPageWrapper>
  );
}
