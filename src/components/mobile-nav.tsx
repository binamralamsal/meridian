"use client";

import { Menu } from "lucide-react";

import { useState } from "react";

import { Link } from "@tanstack/react-router";

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
          <SheetTitle>Meridian</SheetTitle>
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
      </SheetContent>
    </Sheet>
  );
}
