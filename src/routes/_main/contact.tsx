import {
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { site } from "@/config/site";
import { ContactForm } from "@/features/contact-entries/components/contact-form";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/contact")({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...seo({
        title: `Contact Us | ${site.name}`,
        description:
          "Have questions or need assistance? Contact our team at your convenience. We're here to help with appointments, inquiries, and support.",
        keywords: `contact, contact us, get in touch, support, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/contact` },
    ],
  }),
});

function RouteComponent() {
  return (
    <main className="bg-background min-h-screen">
      <section className="bg-primary/5 relative overflow-hidden">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative container grid gap-4 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="bg-background/95 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
              🤝 Let&apos;s Connect
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-balance md:text-5xl lg:text-6xl">
              Get in Touch with Our Team
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Have questions or want to discuss a project? We&apos;re here to
              help you succeed.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="hover:text-primary font-medium transition"
              >
                Home
              </Link>
              <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-primary font-medium">Contact</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-muted-foreground text-lg">
            Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:p-8">
              <MapPinIcon className="text-primary" />
              <h3 className="text-lg font-bold">Office Address</h3>
              <div>
                {site.addressLocality} - {site.streetAddress}
              </div>
            </div>
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:p-8">
              <PhoneIcon className="text-primary" />
              <h3 className="text-lg font-bold">Call us</h3>
              <div>
                Let&apos;s work together towards a common goal - get in touch!
              </div>
              <div className="flex flex-wrap gap-1">
                {/* <Button
                  variant="link"
                  className="inline-block h-auto px-1 py-2"
                  asChild
                >
                  <Link
                    to="."
                    href="https://api.whatsapp.com/send?phone=9779800000000"
                    target="_blank"
                  > */}
                {site.telephone}
                {/* </Link>
                </Button> */}
              </div>
            </div>
            <div className="bg-primary/10 flex h-full flex-col justify-center gap-4 rounded-md border p-6 shadow-sm lg:col-span-2 lg:p-8">
              <MailIcon className="text-primary" />
              <h3 className="text-lg font-bold">Email us</h3>
              <div>
                We&apos;re on top of things and aim to respond to all inquiries
                within 24 hours.
              </div>
              <Button variant="link" className="inline-block p-0" asChild>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-card self-center rounded-xl border p-6 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </section>

      <section className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d524.9320811370936!2d85.33575134757635!3d27.73864327334833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900452543bf%3A0x71c15277c20eb9b1!2sMeridian%20Multi%20Speciality%20Polyclinic%20Pvt.%20Ltd!5e0!3m2!1sen!2snp!4v1751182356399!5m2!1sen!2snp"
          className="h-[400px] w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </section>
    </main>
  );
}
