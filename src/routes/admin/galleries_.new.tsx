import { createFileRoute } from "@tanstack/react-router";

import { GalleryForm } from "@/features/galleries/components/gallery-form";

export const Route = createFileRoute("/admin/galleries_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GalleryForm />;
}
