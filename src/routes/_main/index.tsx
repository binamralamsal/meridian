import { ArrowRight, Calendar, Mail, MapPin, Phone } from "lucide-react";
import {
  Baby,
  Bone,
  Brain,
  Heart,
  Microscope,
  Stethoscope,
} from "lucide-react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <section className="bg-muted relative">
        <div className="relative z-10 container space-y-8 py-14 md:space-y-10 md:py-20 lg:space-y-12 lg:py-28">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <div className="bg-primary/10 text-primary inline-block justify-self-start rounded-full px-4 py-1 text-sm font-semibold">
                Your Trusted Healthcare Partner
              </div>
              <h1 className="text-meridian-dark text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                <span className="text-primary inline-block">
                  Your Partner in
                </span>{" "}
                <span className="text-secondary inline-block">
                  Health and Wellness
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed">
                We are committed to providing you with the best medical and
                healthcare services to help you live healthier and happier.
              </p>
              <div className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
                <Button className="group" size="lg">
                  Learn More{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  <Calendar size={18} /> Book Appointment
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="/hero-doctors.jpg"
                  alt="Healthcare professionals"
                  className="h-auto w-full rounded-lg object-cover"
                />
                <div className="from-primary/30 absolute inset-0 bg-gradient-to-t to-transparent"></div>
              </div>

              <div className="animate-float absolute bottom-4 left-4 max-w-xs rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-md lg:bottom-14 lg:-left-8">
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="font-bold text-white">30</span>
                  </div>
                  <div>
                    <p className="text-primary font-semibold">
                      Years of Excellence
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Serving since 1994
                    </p>
                  </div>
                </div>
                <div className="my-3 h-1 w-full bg-gray-100">
                  <div className="bg-secondary h-1 w-[80%]"></div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Trusted by thousands of patients every year
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-md px-6 py-12 shadow-md backdrop-blur-md">
            <div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <Phone className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Call Us</p>
                    <p className="font-medium">01-4720116/ 01-4720117</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <Mail className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email Us</p>
                    <p className="font-medium">meridian.sewa@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <MapPin className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Location</p>
                    <p className="font-medium">
                      Maharajgunj, Chakrapath, Kathmandu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-secondary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-primary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Services
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            Empowering Health, One Care at a Time
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            We provide a wide range of medical services to meet all your
            healthcare needs with the highest standards of quality and care.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-rose-50 p-4">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Cardiology
            </h3>
            <p className="text-muted-foreground">
              Comprehensive care for heart conditions with advanced diagnostic
              and treatment options.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-violet-50 p-4">
              <Brain className="h-6 w-6 text-violet-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Neurology
            </h3>
            <p className="text-muted-foreground">
              Expert diagnosis and treatment of disorders of the nervous system,
              brain, and spinal cord.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-amber-50 p-4">
              <Bone className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Orthopedics
            </h3>
            <p className="text-muted-foreground">
              Specialized care for musculoskeletal issues, including joint
              replacements and sports injuries.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-sky-50 p-4">
              <Baby className="h-6 w-6 text-sky-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Pediatrics
            </h3>
            <p className="text-muted-foreground">
              Compassionate healthcare for infants, children, and adolescents to
              ensure healthy development.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-emerald-50 p-4">
              <Stethoscope className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Primary Care
            </h3>
            <p className="text-muted-foreground">
              Comprehensive primary healthcare services for patients of all
              ages, focusing on prevention.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="group space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-indigo-50 p-4">
              <Microscope className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Laboratory
            </h3>
            <p className="text-muted-foreground">
              Advanced diagnostic testing with quick and accurate results to
              guide your treatment plan.
            </p>
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="group">
            View All Services{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  );
}
