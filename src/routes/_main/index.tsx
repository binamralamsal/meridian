import {
  ArrowRight,
  Baby,
  Bed,
  Bone,
  Brain,
  Calendar,
  CheckCircle2Icon,
  Heart,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { MedicalClinic } from "schema-dts";

import { Suspense, useEffect, useRef, useState } from "react";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { site } from "@/config/site";
import { pinnedNoticesOptions } from "@/features/admin/admin.queries";
import { allBlogsOptions } from "@/features/blogs/blogs.queries";
import { DoctorCard } from "@/features/departments/components/doctor-card";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { DynamicIcon } from "@/lib/load-icon";
import { seo } from "@/util/seo";

const jsonLdHomePage: MedicalClinic = {
  "@type": "MedicalClinic",
  name: site.name,
  alternateName: site.previousName,
  url: site.url,
  logo: `${site.url}/logo.png`,
  image: [`${site.url}/hero-doctors.jpg`],
  description: site.description,
  telephone: site.telephone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.streetAddress,
    addressLocality: site.addressLocality,
    addressRegion: site.addressRegion,
    postalCode: site.postalCode,
    addressCountry: site.addressCountry,
  },
  openingHours: "Mo-Su 07:00-20:00",
  foundingDate: site.since,
  sameAs: [site.facebook, site.instagram],
  keywords: site.keywords,
};

export const Route = createFileRoute("/_main/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(
      allDepartmentsOptions({ values: { page: 1, pageSize: 20 } }),
    );

    queryClient.prefetchQuery(allDoctorsOptions({ page: 1, pageSize: 4 }));
    queryClient.prefetchQuery(
      allBlogsOptions({ page: 1, pageSize: 3, status: ["published"] }),
    );
    queryClient.prefetchQuery(pinnedNoticesOptions());
  },
  head: () => ({
    meta: [
      ...seo({ title: `Home | ${site.name}`, image: "/hero-doctors.jpg" }),
    ],
  }),
});

function Home() {
  const { data: pinnedNotices } = useQuery(pinnedNoticesOptions());
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [hasShownNotices, setHasShownNotices] = useState(false);
  const [dialogWidth, setDialogWidth] = useState("auto");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (pinnedNotices && pinnedNotices.length > 0 && !hasShownNotices) {
      setShowNoticeDialog(true);
      setCurrentNoticeIndex(0);
      setHasShownNotices(true);
    }
  }, [pinnedNotices, hasShownNotices]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const totalWidth = img.offsetWidth + 96;
      setDialogWidth(`${Math.min(totalWidth, window.innerWidth * 0.95)}px`);
    }
  };

  useEffect(() => {
    setDialogWidth("auto");
  }, [currentNoticeIndex]);

  const handleCloseNotice = () => {
    if (pinnedNotices && currentNoticeIndex < pinnedNotices.length - 1) {
      setCurrentNoticeIndex(currentNoticeIndex + 1);
    } else {
      setShowNoticeDialog(false);
    }
  };

  const currentNotice =
    pinnedNotices && pinnedNotices[currentNoticeIndex]
      ? pinnedNotices[currentNoticeIndex]
      : null;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHomePage) }}
      />
      {currentNotice && (
        <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
          <DialogContent
            style={{
              width: dialogWidth,
              maxWidth: "95vw",
              maxHeight: "90vh",
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {currentNotice.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {currentNotice.file && (
                <div className="flex justify-center">
                  <img
                    ref={imageRef}
                    src={currentNotice.file.url}
                    alt={currentNotice.title}
                    className="max-h-[60vh] w-auto rounded-lg object-contain"
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: "100%",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                {currentNoticeIndex + 1} of {pinnedNotices?.length || 0}
              </p>
              <Button onClick={handleCloseNotice}>
                {pinnedNotices && currentNoticeIndex < pinnedNotices.length - 1
                  ? "Next"
                  : "Close"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
                <Button className="group" size="lg" asChild>
                  <Link to="/about">
                    Learn More{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/appointment">
                    <Calendar size={18} /> Book Appointment
                  </Link>
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

              <div className="animate-float bg-background/80 absolute bottom-4 left-4 max-w-xs rounded-lg p-4 shadow-lg backdrop-blur-md lg:bottom-14 lg:-left-8">
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="text-primary-foreground font-bold">
                      20
                    </span>
                  </div>
                  <div>
                    <p className="text-primary font-semibold">
                      Years of Excellence
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Serving since 2002
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
                    <p className="font-medium">{site.telephone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <Mail className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email Us</p>
                    <a className="font-medium" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
                    <MapPin className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Location</p>
                    <p className="font-medium">{site.addressLocality}</p>
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
          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-rose-50 p-4 dark:bg-rose-500">
              <Heart className="h-6 w-6 text-rose-500 dark:text-rose-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Cardiology
            </h3>
            <p className="text-muted-foreground">
              Comprehensive care for heart conditions with advanced diagnostic
              and treatment options.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-violet-50 p-4 dark:bg-violet-500">
              <Brain className="h-6 w-6 text-violet-500 dark:text-violet-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Neurology
            </h3>
            <p className="text-muted-foreground">
              Expert diagnosis and treatment of disorders of the nervous system,
              brain, and spinal cord.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-amber-50 p-4 dark:bg-amber-500">
              <Bone className="h-6 w-6 text-amber-500 dark:text-amber-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Orthopedics
            </h3>
            <p className="text-muted-foreground">
              Specialized care for musculoskeletal issues, including joint
              replacements and sports injuries.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-sky-50 p-4 dark:bg-sky-500">
              <Baby className="h-6 w-6 text-sky-500 dark:text-sky-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Pediatrics
            </h3>
            <p className="text-muted-foreground">
              Compassionate healthcare for infants, children, and adolescents to
              ensure healthy development.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-emerald-50 p-4 dark:bg-emerald-500">
              <Stethoscope className="h-6 w-6 text-emerald-500 dark:text-emerald-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Primary Care
            </h3>
            <p className="text-muted-foreground">
              Comprehensive primary healthcare services for patients of all
              ages, focusing on prevention.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>

          <div className="group dark:bg-muted/20 dark:hover:bg-muted space-y-3 rounded-xl border p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="inline-block rounded-lg bg-indigo-50 p-4 dark:bg-indigo-500">
              <Microscope className="h-6 w-6 text-indigo-500 dark:text-indigo-50" />
            </div>
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors duration-500">
              Laboratory
            </h3>
            <p className="text-muted-foreground">
              Advanced diagnostic testing with quick and accurate results to
              guide your treatment plan.
            </p>
            {/*<Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>*/}
          </div>
        </div>

        {/*<div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="group">
            View All Services{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>*/}
      </section>

      <section className="bg-primary dark:bg-muted py-14 text-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <StatsCounter
              number={20}
              suffix="+"
              label="Expert Doctors"
              icon="user-md"
            />
            <StatsCounter
              number={150000}
              label="Recovered Patients"
              icon="heart"
            />
            {/*<StatsCounter number={450} label="Medical Beds" icon="bed" />*/}
            <StatsCounter
              number={20}
              label="Years Experience"
              icon="calendar"
            />
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="rounded-lg shadow-xl">
              <img
                src="/medical-team.jpeg"
                alt="Medical team"
                className="h-auto w-full"
              />
            </div>

            <div className="p animate-float bg-primary/80 text-primary-foreground absolute right-4 bottom-4 rounded-lg p-6 shadow-lg backdrop-blur-md lg:-right-6 lg:-bottom-6">
              <div className="text-4xl font-bold">20+</div>
              <div className="text-sm">Years of Experience</div>
            </div>

            <div className="bg-secondary absolute -top-6 -left-6 h-20 w-20 rounded-lg opacity-20"></div>
          </div>

          <div className="space-y-4">
            <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm font-medium">
              About Us
            </span>
            <h2 className="text-3xl font-bold text-balance md:text-4xl">
              Meridian is a team of experienced medical professionals
            </h2>
            <p className="text-foreground/80 leading-relaxed">
              Dedicated to providing top-quality healthcare services. We believe
              in a holistic approach to healthcare that focuses on treating the
              whole person, not just the illness or symptoms.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              The organization formerly known as Meridian Health Care Center
              Pvt. Ltd. has undergone a remarkable transformation and has been
              established under a new name as Meridian Multi Speciality
              Polyclinic Pvt. Ltd. in 2024 A.D. with an amazing management team
              and the same specialists&apos; team of doctors who have been
              serving the community since 2002 A.D.
            </p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5" />
                <p className="text-foreground/80">
                  20+ Years of Excellence in Healthcare
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5" />
                <p className="text-foreground/80">
                  Team of 20+ Experienced Specialists
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5" />
                <p className="text-foreground/80">
                  Modern Facilities & Advanced Equipment
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5" />
                <p className="text-foreground/80">
                  Patient-Centered Approach to Care
                </p>
              </div>
            </div>

            <Button className="group mt-2" size="lg" asChild>
              <Link to="/doctors">
                <span>Meet Our Doctors</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={<div>Loading</div>}>
        <DepartmentsSection />
      </Suspense>

      <section className="bg-muted relative py-14 md:py-20 lg:py-28">
        <div className="relative z-10 container">
          <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="grid gap-3">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Meet Our Expert <span className="text-secondary">Doctors</span>
              </h2>
              <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
                Our team of highly qualified medical professionals are here to
                provide exceptional care tailored to your individual needs.
              </p>
            </div>
            <Button variant="outline" className="group" size="lg" asChild>
              <Link to="/doctors">
                <span>View all doctors</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<div>Loading</div>}>
            <DoctorsList />
          </Suspense>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-72 -right-72 h-[800px] w-[800px] rounded-full blur-3xl"></div>
          <div className="bg-secondary/10 absolute -bottom-72 -left-72 h-[600px] w-[600px] rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:py-28">
        <div className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="grid gap-3">
            <h2 className="text-3xl font-bold text-balance md:text-4xl">
              Latest <span className="text-secondary">Health Insights</span>
            </h2>
            <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
              Explore our latest articles and stay informed about health topics
              that matter to you.
            </p>
          </div>
          <Button variant="outline" className="group" size="lg" asChild>
            <Link to="/blogs">
              <span>View all articles</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <Suspense fallback={<div>Loading</div>}>
          <BlogsList />
        </Suspense>
      </section>
    </main>
  );
}

interface StatsCounterProps {
  number: number;
  label: string;
  icon: string;
  suffix?: string;
}

export function StatsCounter({
  number,
  label,
  icon,
  suffix,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  function animateCount() {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = (t: number) => t * (2 - t);

    let frame = 0;
    const countTo = number;

    const counter = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = Math.round(countTo * progress);

      if (currentCount >= countTo) {
        setCount(countTo);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
  }

  function getIcon(iconName: string) {
    switch (iconName) {
      case "user-md":
        return <User className="text-primary-foreground h-10 w-10" />;
      case "heart":
        return <Heart className="text-primary-foreground h-10 w-10" />;
      case "bed":
        return <Bed className="text-primary-foreground h-10 w-10" />;
      case "calendar":
        return <Calendar className="text-primary-foreground h-10 w-10" />;
      default:
        return <User className="text-primary-foreground h-10 w-10" />;
    }
  }

  function formatNumber(num: number) {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  }

  return (
    <div className="flex flex-col items-center" ref={countRef}>
      <div className="bg-primary rounded-full p-4">{getIcon(icon)}</div>
      <div className="mb-2 text-4xl font-bold">
        {formatNumber(count)}
        {suffix ? suffix : ""}
      </div>
      <div className="text-sky-100">{label}</div>
    </div>
  );
}

function DepartmentsSection() {
  const {
    data: { departments },
  } = useSuspenseQuery(
    allDepartmentsOptions({ values: { page: 1, pageSize: 20 } }),
  );

  return (
    <section className="relative container py-14 md:py-20 lg:pt-20 lg:pb-28">
      <div className="from-primary/5 to-primary/30 absolute top-0 right-0 bottom-30 left-0 -z-10 rounded-xl bg-gradient-to-tl md:bottom-50 md:rounded-2xl lg:rounded-4xl"></div>
      <h2 className="text-primary mb-4 text-center text-3xl font-bold md:mb-6 md:text-4xl lg:mb-10 lg:text-5xl">
        Departments
      </h2>
      <Carousel
        opts={{ loop: true, align: "start" }}
        className="group/carousel"
      >
        <CarouselContent className="-ml-4">
          {departments.map((department, index) => (
            <CarouselItem
              key={index}
              className="xs:basis-1/1 my-2 pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              <Link to="/departments/$slug" params={{ slug: department.slug }}>
                <div className="hover:bg-primary hover:text-primary-foreground group bg-background relative grid place-items-center gap-4 rounded-xl px-4 py-14 shadow-md shadow-slate-100 transition-all duration-500">
                  <DynamicIcon
                    iconName={department.icon}
                    key={department.icon}
                    className="text-primary group-hover:text-primary-foreground h-20 w-20 transition-all duration-500"
                    fallbackClassName="text-primary group-hover:text-primary-foreground h-20 w-20 transition-all duration-500"
                  />
                  <p className="text-center text-xl leading-tight">
                    {department.name}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hover:bg-background left-0 h-12 rounded-md opacity-100 transition-all group-hover/carousel:opacity-100 md:opacity-0" />
        <CarouselNext className="hover:bg-background right-0 h-12 rounded-md opacity-100 transition-all group-hover/carousel:opacity-100 md:opacity-0" />
      </Carousel>
    </section>
  );
}

function DoctorsList() {
  const {
    data: { doctors },
  } = useSuspenseQuery(allDoctorsOptions({ page: 1, pageSize: 4 }));

  return (
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
  );
}

function BlogsList() {
  const {
    data: { blogs },
  } = useSuspenseQuery(
    allBlogsOptions({ page: 1, pageSize: 3, status: ["published"] }),
  );

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          title={blog.title}
          excerpt={blog.truncatedContent}
          image={blog.coverPhoto?.url}
          date={blog.createdAt}
          author={blog.author?.name}
          slug={blog.slug}
          category={blog.categoryName}
        />
      ))}
    </div>
  );
}
