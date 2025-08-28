import {
  AlertCircleIcon,
  Calendar,
  ChevronRightIcon,
  LoaderCircleIcon,
  MapPin,
  Phone,
  RefreshCwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { emptyStringAsOptionalSchema } from "@/util/zod-empty-string-as-optional-schema";

const getAppointmentDoctorsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const response = await fetch(
      "https://api.dgcloudapp.com/api/appointment/getAllDoctors",
      {
        headers: {
          "remote-user": "EZGOldZxU2VstPb",
          Authorization: `Basic ${btoa("7U8KznoMtlt2QA2:3JbLFHGpYrB7YyX")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }

    const data = await response.json();

    const doctorsSchema = z.object({
      status: z.boolean(),
      message: z.string(),
      data: z.array(
        z.object({
          doctorId: z.string(),
          doctorName: z.string(),
          sex: z.enum(["Male", "Female"]),
          phone: z.string().nullable(),
          email: z.string().nullable(),
          qualification1: z.string(),
          qualification2: z.string().nullable(),
        }),
      ),
    });

    return doctorsSchema.parse(data).data;
  },
);

export const Route = createFileRoute("/_main/appointment")({
  component: RouteComponent,
  loader: async () => {
    const doctors = await getAppointmentDoctorsFn();
    return { doctors };
  },
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
  errorComponent: ({ reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Server Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            A server error occurred while loading the appointment page. Please
            try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={reset} className="w-full" variant="default">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
});

function RouteComponent() {
  const { doctors } = Route.useLoaderData();

  const form = useAppForm({
    defaultValues: {
      doctorId: "" as unknown as number,
      appointmentDate: "",
      dob: "",
      firstName: "",
      middleName: undefined,
      lastName: "",
      address: "",
      mobile: "",
      complain: "",
      remarks: "",
    } as AppointmentSchema,
    validators: {
      onChange: appointmentSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      const response = await fetch(
        "https://api.dgcloudapp.com/api/Appointment/create",
        {
          method: "POST",
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
            "remote-user": "EZGOldZxU2VstPb",
            Authorization: `Basic ${btoa("7U8KznoMtlt2QA2:3JbLFHGpYrB7YyX")}`,
          },
        },
      );

      const data = await response.json();
      const responseSchema = z.object({
        status: z.boolean(),
        message: z.string(),
      });

      try {
        const parsedData = responseSchema.parse(data);
        if (parsedData.status) {
          toast.success(parsedData.message);
          form.reset();
        } else {
          toast.error(parsedData.message);
        }
      } catch {
        toast.error("Failed to book appointment. Please try again.");
      }
    },
  });

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
          <Card className="border-primary/10 flex justify-center border shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="grid grid-cols-[1fr_10fr] items-start gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <Phone className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Phone</p>
                <p className="text-muted-foreground text-sm">
                  01-4720116 / 01-4720117
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 flex justify-center border shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="grid grid-cols-[1fr_10fr] items-start gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Location</p>
                <p className="text-muted-foreground text-sm">
                  Maharajgunj, Chakrapath, Kathmandu - Oppostite to US Embassy
                </p>
                <Button variant="link" asChild className="p-0">
                  {/* @ts-expect-error -- shut up */}
                  <Link to="/contact#map">Map</Link>
                </Button>
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
            <form.AppForm>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <FormNavigationBlocker />
                <form.AppField
                  name="doctorId"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>
                        Select Doctor <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Select
                          value={field.state.value.toString()}
                          onValueChange={(v) => field.handleChange(Number(v))}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose your preferred doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem
                                key={doctor.doctorId}
                                value={doctor.doctorId}
                              >
                                {doctor.doctorName} – {doctor.qualification1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="appointmentDate"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>
                        <Calendar className="mr-1 h-4 w-4" />
                        Appointment Date <span className="text-red-500">*</span>
                      </field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="date"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <form.AppField
                      name="firstName"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            First Name <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="text"
                              placeholder="John"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="middleName"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>Middle Name</field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="text"
                              placeholder="Sr."
                              name={field.name}
                              value={field.state.value ? field.state.value : ""}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="lastName"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Last Name <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="text"
                              placeholder="Smith"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="sex"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Gender <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Select
                              value={field.state.value}
                              onValueChange={(v) =>
                                field.handleChange(
                                  v as "Male" | "Female" | "Others",
                                )
                              }
                              required
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose your gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </field.FormControl>
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="maritalStatus"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Marrital Status{" "}
                            <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Select
                              value={field.state.value}
                              onValueChange={(v) =>
                                field.handleChange(
                                  v as "Married" | "UnMarried" | "Others",
                                )
                              }
                              required
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose your gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="UnMarried">
                                  Unmarried
                                </SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          </field.FormControl>
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="dob"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            <Calendar className="mr-1 h-4 w-4" />
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="date"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="address"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Address <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="text"
                              placeholder="Kathmandu"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                    <form.AppField
                      name="mobile"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormLabel>
                            Mobile Number{" "}
                            <span className="text-red-500">*</span>
                          </field.FormLabel>
                          <field.FormControl>
                            <Input
                              type="text"
                              placeholder="98XXXXXXXX"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
                    Medical Details
                  </h3>
                  <form.AppField
                    name="complain"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>
                          Complain <span className="text-red-500">*</span>
                        </field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="text"
                            placeholder="Headache"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="remarks"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>
                          Remarks <span className="text-red-500">*</span>
                        </field.FormLabel>
                        <field.FormControl>
                          <Textarea
                            placeholder="Briefly describe your concern"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="min-h-[100px]"
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="pb-6">
                  <Button
                    size="lg"
                    type="submit"
                    className="w-full"
                    disabled={form.state.isSubmitting}
                  >
                    {form.state.isSubmitting && (
                      <LoaderCircleIcon className="animate-spin" />
                    )}
                    Confirm Booking
                  </Button>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    For urgent medical needs, please visit our emergency
                    department or call emergency services.
                  </p>
                </div>
              </form>
            </form.AppForm>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

const phoneNumberSchema = z
  .string({
    required_error: "Mobile number is required",
    invalid_type_error: "Mobile number must be a string",
  })
  .refine((val) => /^\d+$/.test(val), {
    message: "Mobile number must contain only digits",
  })
  .refine((val) => val.length === 10, {
    message: "Mobile number must be exactly 10 digits long",
  })
  .refine((val) => val.startsWith("97") || val.startsWith("98"), {
    message: "Mobile number must start with 97 or 98",
  });

const appointmentSchema = z.object({
  doctorId: z.number({
    required_error: "Doctor is required",
    invalid_type_error: "Doctor is required",
  }),
  appointmentDate: z.string({ required_error: "Appointment Date is required" }),
  dob: z.string({ required_error: "DOB is required" }),
  firstName: z
    .string({ required_error: "FirstName is required" })
    .min(2, { message: "FirstName must be at least 2 characters long" }),
  middleName: emptyStringAsOptionalSchema(
    z
      .string()
      .trim()
      .min(2, { message: "Middle name must be at least 2 characters long." })
      .optional(),
  ),
  lastName: z
    .string({ required_error: "LastName is required" })
    .min(2, { message: "LastName must be at least 2 characters long" }),
  address: z
    .string({ required_error: "Address is required" })
    .min(5, { message: "Address must be at least 5 characters long" }),
  mobile: phoneNumberSchema,
  complain: z
    .string({ required_error: "Complain is required" })
    .min(3, { message: "Complain must be at least 3 characters long" }),
  remarks: z
    .string({ required_error: "Remarks is required" })
    .min(3, { message: "Remarks must be at least 3 characters long" }),
  sex: z.enum(["Male", "Female", "Others"], {
    required_error: "Sex is required",
  }),
  maritalStatus: z.enum(["UnMarried", "Married", "Others"], {
    required_error: "Marital Status is required",
  }),
});

type AppointmentSchema = z.input<typeof appointmentSchema>;
