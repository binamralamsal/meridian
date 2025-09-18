import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  EducationalOccupationalCredential,
  EducationalOrganization,
  Person,
  WithContext,
} from "schema-dts";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";

import { site } from "@/config/site";
import { doctorBySlugOptions } from "@/features/departments/doctors.queries";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/doctors_/$slug")({
  component: RouteComponent,
  loader: async ({ params: { slug }, context: { queryClient } }) => {
    const doctor = await queryClient.ensureQueryData(
      doctorBySlugOptions({ slug }),
    );
    if (!doctor) throw notFound();

    return doctor;
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: `${loaderData?.name} - ${loaderData?.role} | ${site.name}`,
        description:
          loaderData?.description ||
          `${loaderData?.name} is a ${loaderData?.role} at ${site.name}. View education, experience, and appointment hours.`,
        image: loaderData?.photo?.url || "/placeholder.svg",
        keywords: `${loaderData?.name}, ${loaderData?.role}, ${loaderData?.department?.name || ""}, doctor, specialist, healthcare, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/doctors/${loaderData?.slug}` },
    ],
  }),
});

export default function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: doctor } = useSuspenseQuery(doctorBySlugOptions({ slug }));

  if (!doctor) return null;

  const doctorJsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: doctor.name,
    url: `${site.url}/doctors/${doctor.slug}`,
    image: doctor.photo?.url ? [`${site.url}${doctor.photo.url}`] : undefined,
    jobTitle: doctor.role,
    description: doctor.description,
    telephone: doctor.phoneNumber || undefined,
    email: doctor.email || undefined,
    hasCredential: doctor.education.map((edu) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Educational",
      educationalLevel: edu.degree,
      issuedBy: {
        "@type": "EducationalOrganization",
        name: edu.institution,
      },
    })) as EducationalOccupationalCredential[],
    address: doctor.location
      ? {
          "@type": "PostalAddress",
          streetAddress: doctor.location,
          addressLocality: site.addressLocality,
          addressRegion: site.addressRegion,
          postalCode: site.postalCode,
          addressCountry: site.addressCountry,
        }
      : undefined,
    worksFor: {
      "@type": "MedicalClinic",
      name: site.name,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.streetAddress,
        addressLocality: site.addressLocality,
        addressRegion: site.addressRegion,
        postalCode: site.postalCode,
        addressCountry: site.addressCountry,
      },
    },
    alumniOf: doctor.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
    })) as EducationalOrganization[],
    award:
      doctor.achievements.length > 0
        ? doctor.achievements.map((ach) => `${ach.title} (${ach.year})`)
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorJsonLd) }}
      />

      <section className="bg-primary/5 relative overflow-hidden">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative container py-8 md:py-10 lg:py-12">
          <div className="space-y-4">
            <div className="bg-background/95 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
              ℹ️ Doctor Details
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl">
              Introduce You to Our Experts
            </h1>
            <p className="text-muted-foreground max-w-[600px] text-lg">
              The list of certified doctors with years of professional
              experiences
            </p>
          </div>
        </div>
      </section>
      <section className="container py-10 md:py-16 lg:py-20">
        <div className="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-[4fr_12fr]">
          <div className="border-muted border-r">
            <div className="relative">
              <img
                src={doctor.photo?.url || "/placeholder.svg"}
                alt={doctor.name}
                className="aspect-square h-full w-full object-cover"
              />
              <Link
                className="bg-primary text-primary-foreground absolute right-0 bottom-0 left-0 px-4 py-2 text-center font-medium"
                to="/departments/$slug"
                params={{ slug: doctor.department?.slug || "" }}
              >
                {doctor.department?.name}
              </Link>
            </div>

            <div className="grid gap-8 p-6">
              {doctor.email || doctor.phoneNumber || doctor.location ? (
                <div className="grid gap-3">
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  {doctor.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-sm">
                        {doctor.phoneNumber}
                      </span>
                    </div>
                  )}

                  {doctor.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-sm">
                        {doctor.email}
                      </span>
                    </div>
                  )}

                  {doctor.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-sm">
                        {doctor.location}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

              {doctor.appointmentHours.length > 0 && (
  <div className="grid gap-3">
    <h3 className="text-lg font-semibold">Appointment Hours</h3>
    <div className="bg-muted/40 rounded-xl p-4">
      {doctor.appointmentHours.map((appointmentHour) => (
        <div
          key={appointmentHour.id}
          className="border-muted-foreground/10 grid gap-1 border-b py-2 first:pt-0 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <span className="text-sm font-medium capitalize">
              {appointmentHour.day}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-primary h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              {appointmentHour.timeStart} - {appointmentHour.timeEnd}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start justify-between">
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {doctor.name}
                </h1>
                <p className="text-primary text-lg font-medium">
                  {doctor.role}
                </p>
              </div>
              {/* <div className="flex gap-3">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-blue-600"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div> */}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {doctor.description}
            </p>

            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary h-5 w-5" />
                <h2 className="text-xl font-semibold">Education & Training</h2>
              </div>
              <div className="grid gap-4 pl-8">
                {doctor.education.map((education) => (
                  <div
                    key={education.id}
                    className="border-primary/20 border-l-2 py-1 pl-4"
                  >
                    <p className="text-primary font-medium">
                      {education.institution}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {education.degree} • {education.yearOfCompletion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  Experience & Expertise
                </h2>
              </div>
              <div className="grid gap-3 pl-8">
                {doctor.experiences.map((exp) => (
                  <div key={exp.id} className="flex items-start gap-2">
                    <div className="bg-primary mt-2 h-1.5 w-1.5 rounded-full"></div>
                    <div>
                      <span className="font-medium">{exp.role}: </span>
                      <span className="text-muted-foreground">
                        {exp.shortDescription}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {doctor.achievements.length > 0 && (
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Award className="text-primary h-5 w-5" />
                  <h2 className="text-xl font-semibold">
                    Awards & Achievements
                  </h2>
                </div>
                <div className="grid gap-3 pl-8">
                  {doctor.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-primary mt-2 h-1.5 w-1.5 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {achievement.title}{" "}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {achievement.year}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
