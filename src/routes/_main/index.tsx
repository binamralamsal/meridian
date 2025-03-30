import {
  ArrowRight,
  Baby,
  Bed,
  Bone,
  Brain,
  Calendar,
  CheckCircle2Icon,
  Facebook,
  Heart,
  Linkedin,
  Mail,
  MapPin,
  Microscope,
  Phone,
  Stethoscope,
  Twitter,
  User,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/")({
  component: Home,
});

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Amanda Rodriguez",
    specialty: "Pediatrician",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&h=400&auto=format&fit=crop",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&h=400&auto=format&fit=crop",
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

      <section className="bg-primary py-14 text-white">
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

            <div className="p animate-float bg-primary/80 absolute right-4 bottom-4 rounded-lg p-6 text-white shadow-lg backdrop-blur-md lg:-right-6 lg:-bottom-6">
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
              and the same specialists' team of doctors who have been serving
              the community since 2002 A.D.
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

            <Button className="group mt-2" size="lg">
              <span>Meet Our Doctors</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </div>
        </div>
      </section>

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
            <Button variant="outline" className="group" size="lg">
              <span>View all doctors</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="group">
                <div className="relative mb-4 overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-[350px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="from-primary/70 absolute inset-0 flex items-end justify-center bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="mb-6 flex space-x-4">
                      <a
                        href="#"
                        className="hover:bg-primary rounded-full bg-white p-2 transition-all hover:text-white"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        className="hover:bg-primary rounded-full bg-white p-2 transition-all hover:text-white"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        className="hover:bg-primary rounded-full bg-white p-2 transition-all hover:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
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

  const animateCount = () => {
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
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user-md":
        return <User className="h-10 w-10" />;
      case "heart":
        return <Heart className="h-10 w-10" />;
      case "bed":
        return <Bed className="h-10 w-10" />;
      case "calendar":
        return <Calendar className="h-10 w-10" />;
      default:
        return <User className="h-10 w-10" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col items-center" ref={countRef}>
      <div className="mb-4 rounded-full bg-sky-600 p-4">{getIcon(icon)}</div>
      <div className="mb-2 text-4xl font-bold">{formatNumber(count)}</div>
      <div className="text-sky-100">{label}</div>
    </div>
  );
}
