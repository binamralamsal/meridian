import { createFileRoute } from "@tanstack/react-router";

import { DepartmentForm } from "@/features/departments/components/department-form";

export const Route = createFileRoute("/admin/departments_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DepartmentForm />;
}
