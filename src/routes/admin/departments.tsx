import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

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

import { departmentTableColumns } from "@/features/departments/components/departments-table-columns";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { getAllDepartmentsSchema } from "@/features/departments/departments.schema";

export const Route = createFileRoute("/admin/departments")({
  component: RouteComponent,
  validateSearch: getAllDepartmentsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      allDepartmentsOptions({ values: search }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(
    allDepartmentsOptions({ values: searchParams }),
  );

  return (
    <AdminPageWrapper pageTitle="All Departments">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              <p>Here are the list of departments</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/departments/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={departmentTableColumns}
            data={data?.departments || []}
            isLoading={isPending}
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
