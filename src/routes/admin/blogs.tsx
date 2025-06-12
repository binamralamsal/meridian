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

import {
  allBlogsOptions,
  allCategoriesOptions,
} from "@/features/blogs/blogs.queries";
import { getAllBlogsSchema } from "@/features/blogs/blogs.schema";
import { blogsTableColumns } from "@/features/blogs/components/blogs-table-columns";

export const Route = createFileRoute("/admin/blogs")({
  component: RouteComponent,
  validateSearch: getAllBlogsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(allBlogsOptions(search));
    context.queryClient.prefetchQuery(
      allCategoriesOptions({ values: { page: 1, pageSize: 1000 } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(allBlogsOptions(searchParams));
  const { data: categoriesData } = useQuery(
    allCategoriesOptions({ values: { page: 1, pageSize: 1000 } }),
  );

  return (
    <AdminPageWrapper pageTitle="All Doctors">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Blogs</CardTitle>
            <CardDescription>
              <p>Here are the list of blogs</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/blogs/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={blogsTableColumns}
            data={
              data?.blogs.map((blog) => ({
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
                id: blog.id,
                slug: blog.slug,
                title: blog.title,
                status: blog.status,
                category: blog.categoryName,
                author: blog.author?.name,
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
              {
                accessorKey: "category",
                queryKey: "categories",
                title: "Category",
                options: (categoriesData?.categories || []).map((c) => ({
                  value: c.slug,
                  label: c.name,
                })),
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

const blogStatus = ["published", "archived", "draft"];

const productStatusIcons: Record<
  (typeof blogStatus)[number],
  ComponentType<{ className?: string }>
> = {
  draft: FileIcon,
  published: CircleCheckIcon,
  archived: ArchiveIcon,
};

const statuses = blogStatus.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
  icon: productStatusIcons[status],
}));
