import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/departments")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/departments"!</div>;
}
