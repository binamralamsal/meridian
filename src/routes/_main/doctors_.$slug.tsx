import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  Facebook,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_main/doctors_/$slug")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const name = "Dr. Sarah Lee, MD, MPH, FAPA";
  const title = "Board-certified Psychiatrist";
  const department = "Psychiatry Department";
  const image =
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=400&auto=format&fit=crop";
  const bio =
    "Dr. Lee is a board-certified psychiatrist with over 15 years of experience in treating a wide range of mental health conditions. She specializes in mood disorders, anxiety, and trauma-related conditions.";
  const phone = "+1 (555) 123-4567";
  const email = "dr.sarah.lee@medical.com";
  const location = "123 Medical Center Dr, Suite 456, New York, NY";

  const schedule = [
    { day: "Monday", hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "10:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 3:00 PM" },
  ];

  const degrees = [
    {
      institution: "Harvard Medical School",
      degree: "Doctor of Medicine",
      year: "2005",
    },
    {
      institution: "Johns Hopkins University",
      degree: "Master of Public Health",
      year: "2007",
    },
    {
      institution: "NYU Langone Medical Center",
      degree: "Residency in Psychiatry",
      year: "2010",
    },
  ];

  const experiences = [
    {
      title: "Clinical Director",
      description: "New York Psychiatric Institute",
    },
    {
      title: "Specialization",
      description: "Mood disorders, anxiety, and trauma-related conditions",
    },
    {
      title: "Research Focus",
      description: "Innovative approaches to treatment-resistant depression",
    },
  ];

  const awards = [
    { title: "Excellence in Psychiatric Care Award", year: "2018" },
    { title: "Top Mental Health Professional", year: "2020" },
    { title: "Research Innovation Award", year: "2022" },
  ];

  return (
    <>
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
      <section className="container">
        <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full border-r border-gray-100 bg-white md:w-80">
                <div className="flex h-full flex-col">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-100">
                      <Avatar className="h-full w-full rounded-none">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 bg-blue-600 px-4 py-2 text-center font-medium text-white">
                      {department}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-grow space-y-4 p-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Contact Information
                      </h3>

                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-600">{phone}</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-600">{email}</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {location}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Schedule */}
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg font-semibold text-gray-700">
                        Appointment Hours
                      </h3>
                      <div className="rounded-xl bg-gray-50 p-4">
                        {schedule.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-gray-200 py-2 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">
                                {item.day}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-600">
                                {item.hours}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Main Content */}
              <div className="flex-1 bg-white p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                      {name}
                    </h1>
                    <p className="mt-1 text-lg font-medium text-blue-600">
                      {title}
                    </p>
                  </div>
                  <div className="flex gap-3">
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
                  </div>
                </div>

                <div className="mt-6">
                  <p className="leading-relaxed text-gray-600">{bio}</p>
                </div>

                {/* Degrees Section */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Education & Training
                    </h2>
                  </div>
                  <div className="space-y-4 pl-7">
                    {degrees.map((degree, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-100 py-1 pl-4"
                      >
                        <p className="font-medium text-gray-800">
                          {degree.institution}
                        </p>
                        <p className="text-sm text-gray-600">
                          {degree.degree} • {degree.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Experience & Expertise
                    </h2>
                  </div>
                  <div className="space-y-3 pl-7">
                    {experiences.map((exp, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            {exp.title}:{" "}
                          </span>
                          <span className="text-gray-600">
                            {exp.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Awards Section */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Awards & Achievements
                    </h2>
                  </div>
                  <div className="space-y-3 pl-7">
                    {awards.map((award, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                        <div>
                          <span className="font-medium text-gray-800">
                            {award.title}{" "}
                          </span>
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs font-normal"
                          >
                            {award.year}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
