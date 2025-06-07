import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DoctorForm } from "@/features/departments/components/doctor-form";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";

export const Route = createFileRoute("/admin/doctors_/new")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(
      allDepartmentsOptions({ values: { page: 1, pageSize: 100 } }),
    );
  },
});

function RouteComponent() {
  const {
    data: { departments },
  } = useSuspenseQuery(
    allDepartmentsOptions({ values: { page: 1, pageSize: 100 } }),
  );

  return <DoctorForm departments={departments} />;
}
