import { LinkProps } from "@tanstack/react-router";

export const navLinks: { href: LinkProps["to"]; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Services" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export const site = {
  name: "Meridian Polyclinic",
  version: "1.0.0",
  description:
    "Meridian Multi Speciality Polyclinic Pvt. Ltd. offers expert medical care with a dedicated team of specialists serving the community since 2002. Comprehensive, compassionate healthcare under one roof.",
  keywords:
    "Meridian Polyclinic, Meridian Multi Speciality, health care, Nepal clinic, Kathmandu medical, specialist doctors, Meridian Health Care Center, multi-specialty clinic",
  url: "https://meridianpolyclinic.com", // replace with the actual domain if different
  facebook: "https://www.facebook.com/meridianpolyclinic", // replace with actual if available
  instagram: "https://www.instagram.com/meridianpolyclinic", // replace with actual if available
  streetAddress: "lorem ipsum doler set amitio owdio iwbd",
  addressLocality: "Kathmandu",
  addressRegion: "Bagmati",
  postalCode: "44600",
  addressCountry: "NP",
  telephone: "01-XXXXXXX, +977-98XXXXXXXX", // replace with correct numbers
  foundingDate: "2024-01-01", // new name registration date
  previousName: "Meridian Health Care Center Pvt. Ltd.",
  since: "2002-01-01", // community service start date
};
