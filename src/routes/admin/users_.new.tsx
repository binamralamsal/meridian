import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/isers/add"!</div>;
}
