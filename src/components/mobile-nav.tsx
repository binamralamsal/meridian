import { Menu } from "lucide-react";

import { useState } from "react";

import { Link } from "@tanstack/react-router";

import { Logo } from "./icons/logo";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navLinks } from "@/config/site";

export function MobileNav() {
  const [isSheetOpened, setIsSheetOpened] = useState(false);

  return (
    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Logo className="h-10" />
          </SheetTitle>
        </SheetHeader>

        <ul className="flex flex-col gap-2 px-4">
          {navLinks.map((navLink) => (
            <li key={navLink.label}>
              <Link
                to={navLink.href}
                className="hover:text-primary block py-1 text-sm transition-all ease-in-out"
                activeOptions={{ exact: navLink.href === "/" }}
                activeProps={{ className: "text-primary font-medium" }}
                onClick={() => setIsSheetOpened(false)}
              >
                {navLink.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="grid gap-2 px-4">
          <li>
            <Button size="lg" className="w-full" asChild>
              <Link to="/appointment">Make an appointment</Link>
            </Button>
          </li>
          <li>
            <Button size="lg" className="w-full" variant="outline" asChild>
              <a
                href="http://202.51.74.38:10050/?authCode=%22674e58f5-91a5-42e6-aada-2f8aea985875%22"
                target="_blank"
                rel="noreferrer"
              >
                Go to Patient Portal
              </a>
            </Button>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
