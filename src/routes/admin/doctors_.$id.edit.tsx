import { ArrowLeftIcon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { Button } from "@/components/ui/button";

import { DoctorForm } from "@/features/departments/components/doctor-form";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { doctorByIdOptions } from "@/features/departments/doctors.queries";

export const Route = createFileRoute("/admin/doctors_/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const data = await queryClient.ensureQueryData(
      doctorByIdOptions({ id: parseInt(id) }),
    );

    if (!data) throw notFound();

    queryClient.prefetchQuery(
      allDepartmentsOptions({ values: { page: 1, pageSize: 100 } }),
    );
  },
  notFoundComponent: () => <DoctorNotFound />,
});

function RouteComponent() {
  const params = Route.useParams();
  const id = parseInt(params.id);

  const { data: doctor } = useSuspenseQuery(doctorByIdOptions({ id }));

  if (!doctor) return <DoctorNotFound />;

  const {
    data: { departments },
  } = useSuspenseQuery(
    allDepartmentsOptions({ values: { page: 1, pageSize: 100 } }),
  );

  return (
    <DoctorForm
      id={doctor.id}
      photo={doctor.photo}
      departments={departments}
      defaultValues={{
        name: doctor.name,
        slug: doctor.slug,
        departmentId: doctor.department?.id as unknown as number,
        description: doctor.description,
        role: doctor.role,
        achievements: doctor.achievements,
        appointmentHours: doctor.appointmentHours,
        education: doctor.education,
        experiences: doctor.experiences,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        location: doctor.location,
        photoFileId: doctor.photo?.id as unknown as number,
      }}
    />
  );
}

function DoctorNotFound() {
  return (
    <AdminPageWrapper
      pageTitle="Edit Doctor"
      breadcrumbs={[{ label: "All Doctors", href: "/admin/doctors" }]}
    >
      <div className="grid min-h-[80vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Doctor Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn&apos;t find the doctor you&apos;re looking for.
              It may have been deleted or never existed.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/admin/doctors">
              <ArrowLeftIcon size={16} />
              Back to Doctors
            </Link>
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
