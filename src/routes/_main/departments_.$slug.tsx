import {
  ArrowRightIcon,
  BrainIcon,
  FacebookIcon,
  HeadphonesIcon,
  HeartPulseIcon,
  LinkedinIcon,
  PillIcon,
  TwitterIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/departments_/$slug")({
  component: RouteComponent,
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
  return (
    <main>
      <section className="bg-muted relative">
        <div className="relative z-10 container space-y-8 py-14 md:space-y-10 md:py-20 lg:space-y-12 lg:py-28">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <h1 className="text-meridian-dark text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                Psychiatry Department
              </h1>
              <p className="max-w-xl text-lg leading-relaxed">
                Our Psychiatry Department specializes in the diagnosis,
                treatment, and prevention of mental, emotional, and behavioral
                disorders. We provide compassionate care through evidence-based
                approaches to help patients achieve mental wellness and improved
                quality of life.
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

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Specialized Services
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            Comprehensive Mental Health Care
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            Our psychiatry department offers a wide range of specialized
            treatments and therapies to address various mental health conditions
            with compassion and expertise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-purple-50 p-4 dark:bg-purple-500">
              <BrainIcon className="h-6 w-6 text-purple-500 dark:text-purple-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Cognitive Behavioral Therapy
            </h3>
            <p className="text-muted-foreground">
              Evidence-based approach that helps identify and change negative
              thought patterns affecting emotions and behaviors.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-teal-50 p-4 dark:bg-teal-500">
              <PillIcon className="h-6 w-6 text-teal-500 dark:text-teal-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Medication Management
            </h3>
            <p className="text-muted-foreground">
              Personalized psychiatric medication plans with ongoing monitoring
              to ensure optimal effectiveness and minimal side effects.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-blue-50 p-4 dark:bg-blue-500">
              <UsersIcon className="h-6 w-6 text-blue-500 dark:text-blue-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Group Therapy
            </h3>
            <p className="text-muted-foreground">
              Therapeutic sessions in a supportive group setting to share
              experiences, build coping skills, and foster connection.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-amber-50 p-4 dark:bg-amber-500">
              <HeadphonesIcon className="h-6 w-6 text-amber-500 dark:text-amber-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Telepsychiatry
            </h3>
            <p className="text-muted-foreground">
              Virtual psychiatric consultations and therapy sessions providing
              convenient access to mental health care from anywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Conditions We Treat
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            Specialized Mental Health Care
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            Our psychiatry department provides expert diagnosis and treatment
            for a wide range of mental health conditions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-rose-50 p-4 dark:bg-rose-500">
              <HeartPulseIcon className="h-6 w-6 text-rose-500 dark:text-rose-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Anxiety Disorders
            </h3>
            <p className="text-muted-foreground">
              Treatment for generalized anxiety, panic disorder, social anxiety,
              and specific phobias through therapy and medication.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-indigo-50 p-4 dark:bg-indigo-500">
              <BrainIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Mood Disorders
            </h3>
            <p className="text-muted-foreground">
              Comprehensive care for depression, bipolar disorder, and other
              mood conditions with personalized treatment plans.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500">
              <UserIcon className="h-6 w-6 text-emerald-500 dark:text-emerald-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              PTSD & Trauma
            </h3>
            <p className="text-muted-foreground">
              Specialized trauma-focused therapies to help process traumatic
              experiences and reduce symptoms of PTSD.
            </p>
          </div>
        </div>
      </section>

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
