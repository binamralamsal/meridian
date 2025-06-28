import {
  Facebook,
  Instagram,
  // Linkedin,
  Mail,
  MapPin,
  Phone,
  // Twitter,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

import { Logo } from "./icons/logo";
import { Button } from "./ui/button";

import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <>
      <section className="bg-primary dark:bg-muted text-primary-foreground dark:text-foreground w-full py-14 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid place-items-center gap-4 text-center">
            <div className="space-y-2">
              <h2 className="max-w-[25ch] text-3xl leading-tight font-bold tracking-tighter text-balance sm:text-4xl md:text-5xl">
                Ready to Take Control of Your Health?
              </h2>
              <p className="mx-auto max-w-[50ch] text-balance md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Schedule an appointment today and take the first step towards a
                healthier life with ProHealth&apos;s expert medical team.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/appointment">Book Appointment</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:text-foreground border-white bg-transparent text-white hover:bg-white"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-footer-background text-primary-foreground dark:text-foreground pt-16">
        <div className="container">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center space-x-2">
                <Logo className="h-10" />
              </div>
              <p className="text-primary-foreground/80 dark:text-foreground/80 mb-6 leading-relaxed">
                Dedicated to providing top-quality healthcare services with a
                holistic approach that focuses on treating the whole person, not
                just the illness or symptoms.
              </p>
              <div className="flex space-x-4">
                <a
                  href={site.facebook}
                  className="hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                {/* <a
                  href="#"
                  className="hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a> */}
                <a
                  href={site.instagram}
                  className="hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/doctors"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold">Services</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Primary Care
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Specialized Clinic
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Diagnostics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Pharmacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground text-primary-foreground/80 dark:text-foreground/80 dark:hover:text-primary transition-colors"
                  >
                    Health Checkups
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-lg font-bold">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <MapPin className="text-primary-foreground dark:text-foreground mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="text-primary-foreground/80 dark:text-foreground/80">
                    {site.addressLocality} - {site.streetAddress}
                  </span>
                </li>
                <li className="flex">
                  <Phone className="text-primary-foreground dark:text-foreground mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="text-primary-foreground/80 dark:text-foreground/80">
                    {site.telephone}
                  </span>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="flex">
                    <Mail className="text-primary-foreground dark:text-foreground mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-primary-foreground/80 dark:text-foreground/80">
                      {site.email}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-primary-foreground dark:text-foreground border-t border-white/10 py-8 text-center text-sm dark:border-white/25">
            <p>
              © {new Date().getFullYear()} Meridian Polyclinic. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
