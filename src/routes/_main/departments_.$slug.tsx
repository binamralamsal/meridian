import {
  ArrowRightIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { departmentBySlugOptions } from "@/features/departments/departments.queries";
import { DynamicIcon } from "@/lib/load-icon";
import { cn } from "@/util/cn";

export const Route = createFileRoute("/_main/departments_/$slug")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const data = await queryClient.ensureQueryData(
      departmentBySlugOptions({ slug }),
    );

    if (!data) throw notFound();
  },
});

const doctors = [
  {
    name: "Dr. Emily Richards",
    specialty: "Adult Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Child & Adolescent Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Sarah Johnson",
    specialty: "Geriatric Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Addiction Psychiatrist",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&h=400&auto=format&fit=crop",
  },
];

function RouteComponent() {
  const params = Route.useParams();
  const { data: department } = useSuspenseQuery(
    departmentBySlugOptions({ slug: params.slug }),
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

              <div className="animate-float bg-background/80 absolute bottom-4 left-4 max-w-xs rounded-lg p-4 shadow-lg backdrop-blur-md lg:bottom-14 lg:-left-8">
                <p className="text-primary mb-2 font-semibold">
                  Available Specialists
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-blue-100">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="Dr. Lisa Mayer"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Dr. Lisa Mayer, MD</h3>
                      <p className="text-sm text-gray-500">
                        Clinical Psychiatrist
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-blue-100">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="Dr. Robert Klein"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">Dr. Robert Klein, MD</h3>
                      <p className="text-sm text-gray-500">
                        Psychiatric Specialist
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

      <section className="bg-muted relative py-14 md:py-20 lg:py-28">
        <div className="relative z-10 container">
          <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="grid gap-3">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Our <span className="text-secondary">Psychiatrists</span>
              </h2>
              <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
                Meet our team of board-certified psychiatrists dedicated to
                providing compassionate, personalized mental health care for
                patients of all ages.
              </p>
            </div>
            <Button variant="outline" className="group" size="lg">
              <span>View all specialists</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="h-[350px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="from-primary/70 absolute inset-0 flex items-end justify-center bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="mb-6 flex space-x-4">
                      <a
                        href="#"
                        className="hover:bg-primary bg-background hover:text-primary-foreground rounded-full p-2 transition-all"
                      >
                        <FacebookIcon className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        className="hover:bg-primary bg-background hover:text-primary-foreground rounded-full p-2 transition-all"
                      >
                        <TwitterIcon className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        className="hover:bg-primary bg-background hover:text-primary-foreground rounded-full p-2 transition-all"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <h3 className="text-primary text-xl font-semibold">
                  {doctor.name}
                </h3>
                <p className="text-foreground/80">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-secondary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>
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
