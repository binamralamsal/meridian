import { ArrowRightIcon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { site } from "@/config/site";
import { DoctorCard } from "@/features/departments/components/doctor-card";
import { departmentBySlugOptions } from "@/features/departments/departments.queries";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { DynamicIcon } from "@/lib/load-icon";
import { cn } from "@/util/cn";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/departments_/$slug")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const data = await queryClient.ensureQueryData(
      departmentBySlugOptions({ slug }),
    );

    if (!data) throw notFound();

    queryClient.prefetchQuery(
      allDoctorsOptions({ page: 1, pageSize: 4, departments: [slug] }),
    );

    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: `${loaderData?.title} | ${site.name}`,
        description: loaderData?.description,
        keywords: `${loaderData?.title}, ${loaderData?.title} department, health care, medical services, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robots", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/departments/${loaderData?.slug}` },
    ],
  }),
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: department } = useSuspenseQuery(
    departmentBySlugOptions({ slug: params.slug }),
  );

  const {
    data: { doctors },
  } = useSuspenseQuery(
    allDoctorsOptions({ page: 1, pageSize: 4, departments: [params.slug] }),
  );

  if (!department) return null;

  return (
    <main>
      <section className="bg-muted relative">
        <div className="relative z-10 container space-y-8 py-14 md:space-y-10 md:py-20 lg:space-y-12 lg:py-28">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <h1 className="text-meridian-dark text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                {department.title}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed">
                {department.description}
              </p>
            </div>

            <div className="relative">
              <div className="transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?q=80&w=2071&auto=format&fit=crop"
                  alt="Psychiatry professionals in consultation"
                  className="h-auto w-full rounded-lg object-cover"
                />
                <div className="from-primary/30 absolute inset-0 bg-gradient-to-t to-transparent"></div>
              </div>

              {doctors.length > 0 && (
                <div className="animate-float bg-background/80 absolute bottom-4 left-4 max-w-xs rounded-lg p-4 shadow-lg backdrop-blur-md lg:bottom-14 lg:-left-8">
                  <p className="text-primary mb-2 font-semibold">
                    Available Specialists
                  </p>
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                          <img
                            src={doctor.photo?.url}
                            alt={doctor.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{doctor.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {doctor.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {department.sections.map((section) => (
        <section key={section.id} className="container py-14 md:py-20 lg:py-28">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              {section.label}
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              {section.title}
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              {section.description}
            </p>
          </div>

          <div
            className={cn(
              "grid gap-8",
              section.cards.length > 3
                ? "md:grid-cols-3 lg:grid-cols-4"
                : "md:grid-cols-3",
            )}
          >
            {section.cards.map((card) => (
              <div
                key={card.id}
                className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div
                  className={cn(
                    "inline-block rounded-lg p-4",
                    getCardColorClasses(card.title).background,
                  )}
                >
                  <DynamicIcon
                    iconName={card.icon}
                    key={card.icon}
                    className={getCardColorClasses(card.title).icon}
                    fallbackClassName="h-6 w-6 text-purple-500 dark:text-purple-50"
                  />
                </div>
                <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {doctors.length > 0 && (
        <section className="bg-muted relative py-14 md:py-20 lg:py-28">
          <div className="relative z-10 container">
            <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="grid gap-3">
                <h2 className="text-3xl font-bold text-balance md:text-4xl">
                  Our <span className="text-secondary">Specialists</span> for{" "}
                  {department.title}
                </h2>
                <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
                  Meet our team of board-certified specialists dedicated to
                  providing compassionate, personalized health care for patients
                  of all ages.
                </p>
              </div>
              <Button variant="outline" className="group" size="lg" asChild>
                <Link to="/doctors" search={{ departments: [params.slug] }}>
                  <span>View all specialists</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  name={doctor.name}
                  role={doctor.role}
                  slug={doctor.slug}
                  photo={doctor.photo?.url}
                  key={doctor.id}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            <div className="bg-primary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
            <div className="bg-secondary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
          </div>
        </section>
      )}
    </main>
  );
}

const colors = ["purple", "teal", "blue", "amber", "rose", "indigo", "emerald"];

const tailwindColorMap = colors.map((color) => ({
  background: `bg-${color}-50 dark:bg-${color}-500`,
  icon: `text-${color}-500 dark:text-${color}-50`,
}));

function hashStringToIndex(str: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 2_147_483_647;
  }
  return hash % mod;
}

export function getCardColorClasses(cardName: string): {
  background: string;
  icon: string;
} {
  const index = hashStringToIndex(cardName, colors.length);
  return tailwindColorMap[index];
}
