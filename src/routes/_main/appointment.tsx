import { Calendar, ChevronRightIcon, Clock, MapPin, Phone } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { site } from "@/config/site";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/appointment")({
  component: RouteComponent,

  head: () => ({
    meta: [
      ...seo({
        title: `Book an Appointment | ${site.name}`,
        description: `Easily schedule your medical appointments with ${site.name}. Choose your doctor, preferred time, and get the care you need without hassle.`,
        keywords: `book appointment, schedule doctor, medical appointment, online booking, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robots", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/appointments` },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="min-h-screen">
      <section className="bg-primary/5 relative overflow-hidden">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative container grid gap-4 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="bg-background/95 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
              🩺 Book an Appointment
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-balance md:text-5xl lg:text-6xl">
              Schedule a Consultation with Our Specialists
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Choose your preferred doctor and time slot — we’re here to ensure
              timely, personalized care for you and your loved ones.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="hover:text-primary font-medium transition"
              >
                Home
              </Link>
              <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-primary font-medium">Appointments</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20 lg:pt-20 lg:pb-28">
        <div className="mb-8 text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            Get Started
          </span>
          <h2 className="mb-6 text-3xl font-bold text-balance md:text-4xl">
            Schedule Your Visit with Our Expert Doctors
          </h2>
          <p className="text-foreground/80 mx-auto max-w-3xl text-lg text-balance">
            At Meridian Polyclinic, your health is our priority. Schedule an
            appointment with our experienced healthcare professionals today.
            Whether you&apos;re seeking a routine check-up or specialized care,
            we&apos;re here to provide personalized and comprehensive medical
            services.
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-balance">
            Simply fill out the form below or call us at{" "}
            <span className="font-semibold text-blue-600">
              01-000000 / 01-000000
            </span>{" "}
            to book your visit. Our friendly staff will assist you in finding a
            convenient time that fits your schedule.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="mx-auto mb-8 grid max-w-3xl gap-6 md:grid-cols-2">
          <Card className="border border-blue-100 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Phone</p>
                <p className="text-muted-foreground text-sm">
                  01-4720116 / 01-4720117
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Location</p>
                <p className="text-muted-foreground text-sm">
                  Book your visit at our central Kathmandu clinic
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mx-auto max-w-3xl py-0">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-xl px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <Calendar className="h-6 w-6" />
              Book a Consultation
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 mt-1">
              Kindly fill in the form to schedule your visit with our medical
              experts.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-8">
              <div className="space-y-2">
                <Label
                  htmlFor="doctor"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Doctor <span className="text-red-500">*</span>
                </Label>
                <Select required>
                  <SelectTrigger id="doctor" className="h-12 w-full">
                    <SelectValue placeholder="Choose your preferred doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">
                      Dr. Sarah Smith – General Medicine
                    </SelectItem>
                    <SelectItem value="dr-johnson">
                      Dr. Michael Johnson – Cardiology
                    </SelectItem>
                    <SelectItem value="dr-williams">
                      Dr. Emily Williams – Pediatrics
                    </SelectItem>
                    <SelectItem value="dr-brown">
                      Dr. David Brown – Orthopedics
                    </SelectItem>
                    <SelectItem value="dr-davis">
                      Dr. Lisa Davis – Dermatology
                    </SelectItem>
                    <SelectItem value="dr-wilson">
                      Dr. James Wilson – Internal Medicine
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    Appointment Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="time"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    Preferred Time <span className="text-red-500">*</span>
                  </Label>
                  <Select required>
                    <SelectTrigger id="time" className="w-full">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                      ].map((time) => (
                        <SelectItem key={time} value={time}>
                          {new Date(`1970-01-01T${time}`).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="98XXXXXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="Street, City, Area"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                  Medical Details
                </h3>
                <div className="space-y-2">
                  <Label
                    htmlFor="complaint"
                    className="text-sm font-medium text-gray-700"
                  >
                    Your Concern / Symptoms{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="complaint"
                    placeholder="Briefly describe your concern"
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pb-6">
                <Button type="submit" size="lg" className="w-full">
                  Confirm Booking
                </Button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  For urgent medical needs, please visit our emergency
                  department or call emergency services.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
