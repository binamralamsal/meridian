import { ClockIcon } from "lucide-react";
import { z } from "zod";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { DoctorCard } from "@/features/departments/components/doctor-card";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { cn } from "@/util/cn";

export const Route = createFileRoute("/_main/doctors")({
  component: RouteComponent,
  validateSearch: z.object({
    departments: z.array(z.string()).optional().default([]).catch([]),
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await queryClient.ensureQueryData(allDoctorsOptions(search));

    await queryClient.ensureQueryData(
      allDepartmentsOptions({ values: { page: 1, pageSize: 12 } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const {
    data: { doctors },
  } = useSuspenseQuery(allDoctorsOptions(searchParams));
  const {
    data: { departments },
  } = useSuspenseQuery(
    allDepartmentsOptions({ values: { page: 1, pageSize: 12 } }),
  );

  return (
    <main>
      <section className="bg-background relative overflow-hidden py-20 lg:py-28">
        <div className="relative z-10 container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
                Introduce You to{" "}
                <span className="text-primary">Our Experts</span>
              </h1>
              <p className="text-foreground/80 mb-8 text-xl text-balance">
                The list of certified doctors with years of professional
                experiences
              </p>
            </div>

            <div className="relative mx-auto h-[450px] w-full max-w-md">
              <div className="from-primary/20 to-secondary/20 relative h-full w-full rounded-2xl bg-gradient-to-br p-6">
                <img
                  src="/hero-doctors.jpg"
                  alt="Doctor"
                  className="mx-auto h-full w-auto rounded-xl object-cover shadow-lg"
                />

                <div className="animate-float bg-background/80 absolute top-10 left-10 max-w-[220px] rounded-lg p-4 shadow-lg backdrop-blur-md md:top-20 md:-left-16">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <ClockIcon className="text-primary-foreground h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-primary font-semibold">
                        24 Hours Doctor
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Can help your needs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="animate-float-delayed bg-background/80 absolute right-10 bottom-10 max-w-[220px] rounded-lg p-4 shadow-lg backdrop-blur-md md:-right-16 md:bottom-20">
                  <div className="grid items-center">
                    <p className="text-secondary font-semibold">
                      90% Client Satisfaction
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Based on 1000+ reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-secondary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="relative container grid gap-4 py-14 md:py-20 lg:py-28">
        <div className="overflow-y-scroll">
          <div className="flex justify-start gap-2 bg-transparent p-0">
            <Link
              to="/doctors"
              search={{ departments: [] }}
              className={cn(
                "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                searchParams.departments.length === 0 &&
                  "text-primary-foreground bg-primary",
              )}
              resetScroll={false}
            >
              All
            </Link>
            {departments.map((dept) => {
              let values = [...searchParams.departments];
              if (searchParams.departments.includes(dept.slug)) {
                values = searchParams.departments.filter(
                  (dep) => dep !== dept.slug,
                );
              } else {
                values.push(dept.slug);
              }

              return (
                <Link
                  key={dept.id}
                  to="/doctors"
                  search={{ departments: values }}
                  className={cn(
                    "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                    searchParams.departments.includes(dept.slug) &&
                      "text-primary-foreground bg-primary",
                  )}
                  resetScroll={false}
                >
                  {dept.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              name={doctor.name}
              role={doctor.role}
              slug={doctor.slug}
              photo={doctor.photo?.url}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
