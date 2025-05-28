import {
  ClockIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

import { useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_main/doctors")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "cardiology", name: "Cardiology" },
    { id: "neurology", name: "Neurology" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "dermatology", name: "Dermatology" },
  ];

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      department: "cardiology",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      department: "neurology",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      department: "pediatrics",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. David Williams",
      specialty: "Orthopedics",
      department: "orthopedics",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Jessica Lee",
      specialty: "Dermatology",
      department: "dermatology",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Robert Taylor",
      specialty: "Cardiology",
      department: "cardiology",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. Sophia Martinez",
      specialty: "Neurology",
      department: "neurology",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
    {
      name: "Dr. James Wilson",
      specialty: "Pediatrics",
      department: "pediatrics",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
    },
  ];

  const filteredDoctors =
    selectedDepartment === "all"
      ? doctors
      : doctors.filter((doctor) => doctor.department === selectedDepartment);

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

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-secondary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="relative container py-14 md:py-20 lg:py-28">
        {/* Department Filters */}
        <div className="mb-10">
          <Tabs
            defaultValue="all"
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
            className="mb-4 overflow-y-scroll"
          >
            <TabsList className="flex justify-start gap-2 bg-transparent p-0">
              {departments.map((dept) => (
                <TabsTrigger
                  key={dept.id}
                  value={dept.id}
                  className="bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border px-4 py-2"
                >
                  {dept.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredDoctors.map((doctor, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-xl shadow-sm">
                  <Link
                    to="/doctors/$slug"
                    params={{ slug: "a" }}
                    className="block"
                  >
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="h-[350px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="from-primary/70 absolute inset-0 flex items-end justify-center bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="mb-6 flex space-x-4">
                        <a
                          href={"/"}
                          className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
                        >
                          <FacebookIcon className="h-4 w-4" />
                        </a>
                        <a
                          href={"#"}
                          className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
                        >
                          <TwitterIcon className="h-4 w-4" />
                        </a>
                        <a
                          href={"#"}
                          className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </Link>
                </div>
                <h3 className="text-primary text-xl font-semibold">
                  <Link to="/doctors/$slug" params={{ slug: "a" }}>
                    {doctor.name}
                  </Link>
                </h3>
                <p className="text-foreground/80">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
