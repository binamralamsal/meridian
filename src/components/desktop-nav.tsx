import { Link } from "@tanstack/react-router";

import { navLinks } from "@/config/site";

export function DesktopNav() {
  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex">
          {navLinks.map((navLink) => (
            <li key={navLink.label}>
              <Link
                to={navLink.href}
                className="hover:text-primary p-4 text-sm transition-all ease-in-out"
                activeOptions={{ exact: navLink.href === "/" }}
                activeProps={{ className: "text-primary" }}
              >
                {navLink.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
