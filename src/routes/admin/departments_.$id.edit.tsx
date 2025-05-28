import { ArrowLeftIcon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { Button } from "@/components/ui/button";

import { DepartmentForm } from "@/features/departments/components/department-form";
import { departmentByIdOptions } from "@/features/departments/departments.queries";

export const Route = createFileRoute("/admin/departments_/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const data = await queryClient.ensureQueryData(
      departmentByIdOptions({ id: parseInt(id) }),
    );

    if (!data) throw notFound();
  },
  notFoundComponent: () => <DepartmentNotFound />,
});

function RouteComponent() {
  const params = Route.useParams();
  const id = parseInt(params.id);

  const { data: department } = useSuspenseQuery(departmentByIdOptions({ id }));

  if (!department) return <DepartmentNotFound />;

  return <DepartmentForm id={department.id} defaultValues={department} />;
}

function DepartmentNotFound() {
  return (
    <AdminPageWrapper
      pageTitle="Edit Department"
      breadcrumbs={[{ label: "All Departments", href: "/admin/departments" }]}
    >
      <div className="grid min-h-[80vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Department Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn&apos;t find the department you&apos;re looking
              for. It may have been deleted or never existed.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/admin/departments">
              <ArrowLeftIcon size={16} />
              Back to Departments
            </Link>
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
