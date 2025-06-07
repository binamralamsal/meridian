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
  Share2,
  Stethoscope,
  User,
} from "lucide-react";

import { Suspense, useEffect, useRef, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { DoctorCard } from "@/features/departments/components/doctor-card";
import { allDepartmentsOptions } from "@/features/departments/departments.queries";
import { allDoctorsOptions } from "@/features/departments/doctors.queries";
import { DynamicIcon } from "@/lib/load-icon";

export const Route = createFileRoute("/_main/")({
  component: Home,
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(
      allDepartmentsOptions({ values: { page: 1, pageSize: 20 } }),
    );

    queryClient.prefetchQuery(allDoctorsOptions({ page: 1, pageSize: 4 }));
  },
});

const blogPosts = [
  {
    id: 1,
    title: "Understanding Preventive Healthcare: Why Regular Check-ups Matter",
    excerpt:
      "Regular health check-ups can detect potential health issues before they become serious problems. Learn about the recommended screenings for every age.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop",
    date: "May 15, 2024",
    author: "Dr. Prem Khadga",
    category: "Preventive Care",
  },
  {
    id: 2,
    title: "Mindfulness and Mental Health: Techniques for Daily Wellness",
    excerpt:
      "Discover simple mindfulness techniques that can help manage stress, anxiety, and improve your overall mental wellbeing in just a few minutes a day.",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=400&auto=format&fit=crop",
    date: "May 10, 2024",
    author: "Dr. Saroj Prasad Ojha",
    category: "Mental Health",
  },
  {
    id: 3,
    title: "Nutrition Myths Debunked: What Science Actually Says About Diet",
    excerpt:
      "With so much conflicting information about nutrition, it's hard to know what to believe. We examine common food myths and what research really shows.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop",
    date: "May 5, 2024",
    author: "Dr. Roshan Bhandari",
    category: "Nutrition",
  },
];

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
                      30
                    </span>
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
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
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
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
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
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
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
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
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
            <Link
              to="/"
              className="text-primary group/link flex items-center gap-1 text-sm font-medium underline-offset-6 hover:underline"
            >
              <span>Learn more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/link:translate-x-1" />
            </Link>
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

      <section className="bg-primary dark:bg-muted py-14 text-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <StatsCounter number={870} label="Expert Doctors" icon="user-md" />
            <StatsCounter
              number={150000}
              label="Recovered Patients"
              icon="heart"
            />
            <StatsCounter number={450} label="Medical Beds" icon="bed" />
            <StatsCounter
              number={25}
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
              <div className="text-4xl font-bold">30+</div>
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
                  30+ Years of Excellence in Healthcare
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2Icon className="text-secondary h-5 w-5" />
                <p className="text-foreground/80">
                  Team of 50+ Experienced Specialists
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
          <Button variant="outline" className="group" size="lg">
            <span>View all articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              date={post.date}
              author={post.author}
              category={post.category}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

interface StatsCounterProps {
  number: number;
  label: string;
  icon: string;
}

function StatsCounter({ number, label, icon }: StatsCounterProps) {
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
      <div className="bg-primary mb-4 rounded-full p-4">{getIcon(icon)}</div>
      <div className="mb-2 text-4xl font-bold">{formatNumber(count)}</div>
      <div className="text-sky-100">{label}</div>
    </div>
  );
}

function BlogCard({
  title,
  excerpt,
  image,
  date,
  author,
  category,
}: {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
}) {
  return (
    <div className="group dark:bg-muted/20 dark:hover:bg-muted/50 rounded-md border shadow-slate-100 transition-all duration-300 hover:shadow-lg dark:shadow-slate-900">
      <div className="relative overflow-hidden">
        <a href="#">
          <img
            src={image}
            alt={title}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </a>
        <div className="bg-secondary/90 text-secondary-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-medium">
          {category}
        </div>
        <button className="text-primary bg-background absolute top-4 right-4 rounded-full p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Share2 size={16} />
        </button>
      </div>
      <div className="grid gap-3 p-6">
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {date}
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {author}
          </div>
        </div>
        <a href="#">
          <h3 className="text-primary line-clamp-2 text-xl font-bold">
            {title}
          </h3>
        </a>
        <p className="text-foreground/80 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <a
          href="#blog"
          className="text-primary group/link flex items-center font-medium underline-offset-6 hover:underline"
        >
          Read more
          <ArrowRight
            size={16}
            className="ml-2 transition-transform group-hover/link:translate-x-1"
          />
        </a>
      </div>
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
