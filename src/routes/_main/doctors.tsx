import { Award, ClockIcon, Search, Star, Users } from "lucide-react";
import { z } from "zod";

import { FormEvent, useEffect, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { site } from "@/config/site";
import { DoctorCard } from "@/features/departments/components/doctor-card";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { cn } from "@/util/cn";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/doctors")({
  component: RouteComponent,
  validateSearch: z.object({
    departments: z.array(z.string()).optional().default([]).catch([]),
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
    search: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await queryClient.ensureQueryData(allDoctorsOptions(search));
    await queryClient.ensureQueryData(
      allDepartmentsOptions({ values: { page: 1, pageSize: 12 } }),
    );
  },
  head: () => ({
    meta: [
      ...seo({
        title: `Doctors | ${site.name}`,
        description:
          "Explore our directory of certified doctors and medical specialists with years of professional experience to guide your health journey.",
        keywords: `doctors, medical specialists, healthcare, health experts, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/doctors` },
    ],
  }),
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = Route.useNavigate();

  const {
    data: { doctors },
  } = useSuspenseQuery(allDoctorsOptions(searchParams));
  const {
    data: { departments },
  } = useSuspenseQuery(
    allDepartmentsOptions({ values: { page: 1, pageSize: 12 } }),
  );

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();

    navigate({
      to: ".",
      search: (prev) => ({ ...prev, search: searchQuery }),
      resetScroll: false,
    });
  }

  useEffect(() => {
    setSearchQuery(searchParams.search || "");
  }, [searchParams.search]);

  return (
    <main>
      <section className="from-background via-background to-primary/5 relative overflow-hidden bg-gradient-to-br py-14 md:py-20 lg:py-28">
        <div className="relative z-10 container">
          <div className="grid items-center gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="grid gap-6">
                <div className="bg-primary/10 text-primary inline-block justify-self-start rounded-full px-4 py-1 text-sm font-semibold">
                  Meet Our Medical Team
                </div>
                <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                  World-Class{" "}
                  <span className="text-primary">Medical Experts</span> at Your
                  Service
                </h1>
                <p className="max-w-xl text-lg leading-relaxed">
                  Connect with our certified specialists who bring years of
                  experience and cutting-edge medical expertise to your
                  healthcare journey.
                </p>

                <div className="grid grid-cols-3 gap-6 py-3 lg:grid-cols-6">
                  <div className="text-center lg:text-left">
                    <div className="mb-2 flex items-center justify-center lg:justify-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Users className="text-primary h-6 w-6" />
                      </div>
                    </div>
                    <div className="text-foreground text-2xl font-bold">
                      200+
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Expert Doctors
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="mb-2 flex items-center justify-center lg:justify-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Award className="text-primary h-6 w-6" />
                      </div>
                    </div>
                    <div className="text-foreground text-2xl font-bold">
                      15+
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Specializations
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="mb-2 flex items-center justify-center lg:justify-start">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Star className="text-primary h-6 w-6" />
                      </div>
                    </div>
                    <div className="text-foreground text-2xl font-bold">
                      4.9
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Patient Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative mx-auto h-[500px] w-full max-w-md">
                <div className="from-primary/20 via-primary/10 to-secondary/20 relative h-full w-full rounded-3xl bg-gradient-to-br p-8">
                  <img
                    src="/hero-doctors.jpg"
                    alt="Professional medical team"
                    className="h-full w-full rounded-2xl object-cover shadow-2xl"
                  />

                  <div className="animate-float bg-background/95 absolute -top-4 -left-6 rounded-xl border p-3 shadow-xl backdrop-blur-sm lg:-left-8">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                        <ClockIcon className="text-primary-foreground h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-primary text-sm font-semibold">
                          24/7 Available
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Emergency Care
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="animate-float-delayed bg-background/95 absolute -right-6 -bottom-4 rounded-xl border p-3 shadow-xl backdrop-blur-sm lg:-right-8">
                    <p className="text-secondary text-sm font-semibold">
                      95% Success Rate
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Treatment Outcomes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/5 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-secondary/5 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <header className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Doctors
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            Find Your Perfect Doctor
          </h2>
          <p className="text-foreground/80 mx-auto mb-10 max-w-3xl text-lg text-balance">
            Search for medical professionals by name, explore by specialty, or
            simply browse our complete directory of trusted healthcare
            providers.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[4fr_2fr]">
          <div className="mb-8 overflow-y-auto">
            <div className="flex flex-wrap justify-start gap-2 bg-transparent p-0">
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

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full self-start"
          >
            <Input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full px-6 py-6"
            />

            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-r-full has-[>svg]:pr-4"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {doctors.length} doctor
              {doctors.length !== 1 ? "s" : ""} found
            </p>
            {searchParams.search && (
              <p className="text-muted-foreground text-sm">
                Results for &quot;{searchParams.search}&quot;
              </p>
            )}
          </div>
          {(searchParams.search || searchParams.departments.length > 0) && (
            <Button variant="ghost" asChild className="text-sm">
              <Link to="/doctors" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          )}
        </div>

        {doctors.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard
                name={doctor.name}
                role={doctor.role}
                slug={doctor.slug}
                key={doctor.id}
                photo={doctor.photo?.url}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No doctors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>

            <Button variant="outline" asChild>
              <Link to="/doctors" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
