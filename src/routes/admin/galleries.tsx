import { ArchiveIcon, CircleCheckIcon, FileIcon } from "lucide-react";

import { ComponentType } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { galleriesTableColumns } from "@/features/galleries/components/galleries-table-columns";
import { allGalleriesOptions } from "@/features/galleries/galleries.queries";
import { getAllGalleriesSchema } from "@/features/galleries/galleries.schema";

export const Route = createFileRoute("/admin/galleries")({
  component: RouteComponent,
  validateSearch: getAllGalleriesSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(allGalleriesOptions(search));
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(allGalleriesOptions(searchParams));

  return (
    <AdminPageWrapper pageTitle="All Doctors">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Galleries</CardTitle>
            <CardDescription>
              <p>Here are the list of galleries</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/galleries/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={galleriesTableColumns}
            data={
              data?.galleries.map((gallery) => ({
                createdAt: gallery.createdAt,
                updatedAt: gallery.updatedAt,
                id: gallery.id,
                slug: gallery.slug,
                title: gallery.title,
                status: gallery.status,
                author: gallery.author?.name,
              })) || []
            }
            isLoading={isPending}
            filters={[
              {
                accessorKey: "status",
                queryKey: "status",
                title: "Status",
                options: statuses,
              },
            ]}
            options={{
              pageCount: data?.pagination.totalPages,
              initialState: {
                columnVisibility: { updatedAt: false },
                sorting: Object.entries(searchParams.sort).map(
                  ([key, value]) => ({
                    desc: value === "desc",
                    id: key,
                  }),
                ),
              },
            }}
          />
        </CardContent>
      </Card>
    </AdminPageWrapper>
  );
}

const galleryStatus = ["published", "archived", "draft"];

const productStatusIcons: Record<
  (typeof galleryStatus)[number],
  ComponentType<{ className?: string }>
> = {
  draft: FileIcon,
  published: CircleCheckIcon,
  archived: ArchiveIcon,
};

const statuses = galleryStatus.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: productStatusIcons[status],
}));
