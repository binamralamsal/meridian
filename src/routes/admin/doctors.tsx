import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";

export const Route = createFileRoute("/admin/doctors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper pageTitle="All Doctors">
      <div></div>
    </AdminPageWrapper>
  );
}
