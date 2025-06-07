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

import { doctorsTableColumns } from "@/features/departments/components/doctors-table-columns";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { getAllDoctorsSchema } from "@/features/departments/doctors.schema";

export const Route = createFileRoute("/admin/doctors")({
  component: RouteComponent,
  validateSearch: getAllDoctorsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(allDoctorsOptions(search));
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const { data, isPending } = useQuery(allDoctorsOptions(searchParams));

  return (
    <AdminPageWrapper pageTitle="All Departments">
      <Card className="container px-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Doctors</CardTitle>
            <CardDescription>
              <p>Here are the list of doctors</p>
            </CardDescription>
          </div>
          <Button asChild>
            <Link to="/admin/doctors/new">Add new</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={doctorsTableColumns}
            data={
              data?.doctors.map((doctor) => ({
                createdAt: doctor.createdAt,
                updatedAt: doctor.updatedAt,
                id: doctor.id,
                name: doctor.name,
                slug: doctor.slug,
                role: doctor.role,
                email: doctor.email,
                department: doctor.departmentName,
              })) || []
            }
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
