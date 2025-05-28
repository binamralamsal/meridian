import { createFileRoute } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import IconPicker from "@/components/icon-picker";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/doctors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminPageWrapper pageTitle="All Doctors">
      <div>
        <IconPicker asChild>
          <Button>Choose Icon</Button>
        </IconPicker>
      </div>
    </AdminPageWrapper>
  );
}
