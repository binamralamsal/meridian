import { LinkProps } from "@tanstack/react-router";

export const navLinks: { href: LinkProps["to"]; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/blogs", label: "Blogs" },
  // { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const site = {
  name: "Meridian Multi Speciality Polyclinic",
  version: "1.0.0",
  description:
    "Meridian Multi Speciality Polyclinic Pvt. Ltd. offers expert medical care with a dedicated team of specialists serving the community since 2002. Comprehensive, compassionate healthcare under one roof.",
  keywords:
    "Meridian Polyclinic, Meridian Multi Speciality, health care, Nepal clinic, Kathmandu medical, specialist doctors, Meridian Health Care Center, multi-specialty clinic",
  url: "https://meridianpolyclinic.com.np/",
  email: "meridian.sewa@gmail.com",
  facebook:
    "https://www.facebook.com/profile.php?id=61557565049689&mibextid=ZbWKwL",
  instagram:
    "https://www.instagram.com/meridianpolyclinic?igsh=YWt2MnJ6MW9ueHo=", //
  streetAddress: "Oppostite to US Embassy ",
  addressLocality: "Maharajgunj, Chakrapath, Kathmandu",
  addressRegion: "Bagmati",
  postalCode: "44600",
  addressCountry: "NP",
  telephone: "01-4720116, 01-4720117",
  previousName: "Meridian Health Care Center Pvt. Ltd.",
  since: "2002-01-01",
};
