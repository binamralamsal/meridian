import {
  ArrowRight,
  AwardIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  HandHeartIcon,
  HeartIcon,
  MicroscopeIcon,
  ShieldIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { StatsCounter } from ".";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_main/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <section className="bg-muted relative overflow-hidden">
        <div className="relative z-10 container space-y-8 py-14 md:space-y-10 md:py-20 lg:space-y-12 lg:py-28">
          <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="grid gap-6">
              <div className="bg-primary/10 text-primary inline-block justify-self-start rounded-full px-4 py-1 text-sm font-semibold">
                About Meridian Polyclinic
              </div>
              <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                <span className="text-primary inline-block">
                  Advancing Health
                </span>{" "}
                <span className="text-secondary inline-block">Since 2002</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-balance">
                From a simple start to a leading provider, we remain committed
                to care, excellence, and community health.
              </p>
              <div className="mt-2 flex flex-col flex-wrap gap-2 md:flex-row">
                <Button className="group" size="lg" asChild>
                  <Link to="/doctors">
                    Our Doctors{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#team">
                    <UsersIcon size={18} /> Meet Our Team
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="transform overflow-hidden rounded-lg shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="/modern-medical-facility-exterior-with-glass-window.png"
                  alt="Meridian Polyclinic building"
                  className="h-auto w-full rounded-lg object-cover"
                />
                <div className="from-primary/30 absolute inset-0 bg-gradient-to-t to-transparent"></div>
              </div>

              <div className="animate-float bg-background/90 absolute right-4 bottom-4 max-w-xs rounded-lg p-4 shadow-lg backdrop-blur-md lg:-right-8 lg:bottom-14">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full">
                    <AwardIcon className="text-secondary-foreground h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-secondary font-semibold">Well Known</p>
                    <p className="text-muted-foreground text-sm">
                      Quality Healthcare
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

      <section id="our-story" className="container py-14 md:py-20 lg:py-28">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
              Our Journey
            </span>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">
              Two Decades of Medical Excellence
            </h2>
            <div className="text-foreground/80 space-y-4 leading-relaxed text-balance">
              <p>
                What began in 2002 as Meridian Health Care Center Pvt. Ltd. has
                evolved into a comprehensive healthcare institution. In 2024, we
                proudly transformed into
                <strong className="text-foreground">
                  {" "}
                  Meridian Multi Speciality Polyclinic Pvt. Ltd.
                </strong>
                , marking a new chapter in our commitment to advanced medical
                care.
              </p>
              <p>
                Our transformation reflects not just a change in name, but a
                complete evolution in our capabilities, technology, and scope of
                services. We&apos;ve maintained our core team of dedicated
                specialists while expanding our facilities and expertise to meet
                the growing healthcare needs of our community.
              </p>
              <p>
                Today, we stand as a beacon of hope and healing, combining
                decades of experience with cutting-edge medical technology and a
                patient-first approach that has earned the trust of thousands of
                families.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Founded in 2002 with a vision for accessible healthcare
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Rebranded in 2024 as Multi Speciality Polyclinic
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Same trusted doctors, enhanced facilities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5 flex-shrink-0" />
                <p className="text-foreground/80">
                  Serving thousands of patients annually
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-xl">
              <img
                src="/about-doctors.png"
                alt="Medical team collaboration"
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="animate-float bg-primary/90 text-primary-foreground absolute top-4 left-4 rounded-lg p-4 shadow-lg backdrop-blur-md lg:-top-6 lg:-left-6">
              <div className="text-2xl font-bold">2002</div>
              <div className="text-sm opacity-90">Founded</div>
            </div>

            <div className="animate-float bg-secondary/90 text-secondary-foreground absolute right-4 bottom-4 rounded-lg p-4 shadow-lg backdrop-blur-md lg:-right-6 lg:-bottom-6">
              <div className="text-2xl font-bold">
                {new Date().getFullYear()}
              </div>
              <div className="text-sm opacity-90">Transformed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              Our Foundation
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Mission, Vision & Values
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              The principles that guide every decision we make and every patient
              we serve.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <TargetIcon className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide compassionate, comprehensive, and accessible
                  healthcare services that improve the quality of life for our
                  patients and strengthen our community&apos;s overall health
                  and wellbeing.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-secondary/10 group-hover:bg-secondary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <EyeIcon className="text-secondary h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading multi-specialty healthcare provider in the
                  region, recognized for clinical excellence, innovative
                  treatments, and exceptional patient experiences that set new
                  standards in medical care.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 transition-colors group-hover:bg-rose-100 dark:bg-rose-500/20 dark:group-hover:bg-rose-500/30">
                  <HandHeartIcon className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="mb-4 text-xl font-bold">Our Values</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compassion, integrity, excellence, and innovation guide
                  everything we do. We believe in treating every patient with
                  dignity, respect, and the highest standard of medical care
                  available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-primary dark:bg-muted py-14 text-white">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Impact in Numbers</h2>
            <p className="text-primary-foreground/80 text-lg">
              Two decades of serving our community with dedication and
              excellence
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StatsCounter
              number={150000}
              label="Patients Treated"
              icon="users"
            />
            <StatsCounter
              number={20}
              suffix="+"
              label="Medical Specialists"
              icon="stethoscope"
            />
            <StatsCounter number={17} label="Departments" icon="building" />
            <StatsCounter
              number={20}
              label="Years of Service"
              icon="calendar"
            />
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Why Choose Us
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            What Sets Us Apart
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            Discover the unique advantages that make Meridian Polyclinic your
            trusted healthcare partner.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-blue-50 p-3 dark:bg-blue-500/20">
              <MicroscopeIcon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold">Advanced Technology</h3>
            <p className="text-muted-foreground">
              State-of-the-art medical equipment and diagnostic tools ensure
              accurate diagnoses and effective treatments for all our patients.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-green-50 p-3 dark:bg-green-500/20">
              <ClockIcon className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">24/7 Emergency Care</h3>
            <p className="text-muted-foreground">
              Round-the-clock emergency services with experienced medical staff
              ready to handle any urgent medical situation.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-purple-50 p-3 dark:bg-purple-500/20">
              <ShieldIcon className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold">Patient Safety First</h3>
            <p className="text-muted-foreground">
              Rigorous safety protocols and infection control measures ensure
              the highest standards of patient safety and care quality.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-orange-50 p-3 dark:bg-orange-500/20">
              <HeartIcon className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Compassionate Care</h3>
            <p className="text-muted-foreground">
              Our healthcare professionals are trained not just in medical
              expertise but also in providing empathetic, patient-centered care.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-teal-50 p-3 dark:bg-teal-500/20">
              <TrendingUpIcon className="h-6 w-6 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold">Continuous Innovation</h3>
            <p className="text-muted-foreground">
              We continuously invest in new technologies, treatments, and
              training to provide the most advanced healthcare solutions
              available.
            </p>
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-indigo-50 p-3 dark:bg-indigo-500/20">
              <GlobeIcon className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">Community Focus</h3>
            <p className="text-muted-foreground">
              Deeply rooted in our community, we understand local health needs
              and provide culturally sensitive, accessible healthcare services.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14 md:py-20 lg:py-28" id="team">
        <div className="container">
          <div className="mb-16 text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
              Leadership
            </span>
            <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
              Meet Our Leadership Team
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              Experienced healthcare leaders dedicated to advancing medical
              excellence and patient care.
            </p>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Medical Director"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Dr. Sarah Johnson</h3>
                <p className="text-primary mb-3 font-medium">
                  Medical Director & Chief of Staff
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  With over 25 years of experience in healthcare administration
                  and clinical practice, Dr. Johnson leads our medical team with
                  vision and expertise.
                </p>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Medical Director"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Michael Chen</h3>
                <p className="text-primary mb-3 font-medium">
                  Chief Executive Officer
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Michael brings strategic leadership and operational excellence
                  to ensure our facility operates at the highest standards of
                  efficiency and patient care.
                </p>
              </CardContent>
            </Card>
            <Card className="group overflow-hidden border-0 pt-0 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative overflow-hidden">
                <img
                  src="/doctor-1.png"
                  alt="Medical Director"
                  className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <CardContent>
                <h3 className="mb-2 text-xl font-bold">Maria Rodriguez</h3>
                <p className="text-primary mb-3 font-medium">
                  Chief Nursing Officer
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Maria oversees our nursing staff and ensures the highest
                  quality of patient care through evidence-based practices and
                  compassionate nursing excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
