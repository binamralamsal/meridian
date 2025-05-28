import { ChevronDown } from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import { DesktopNav } from "./desktop-nav";
import { Logo } from "./icons/logo";
import { MobileNav } from "./mobile-nav";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/util/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        return setScrolled(true);
      }

      return setScrolled(false);
    };

    document.addEventListener("scroll", handleScroll);

    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "py-8",
        scrolled &&
          "animate-headerSticky supports-[backdrop-filter]:bg-background/90 sticky top-0 z-50 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur",
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <Logo className="h-10" />
        </Link>

        <DesktopNav />
        <MobileNav />

        <div className="hidden md:block lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
              >
                Links <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem asChild>
                <Link to="/appointment" className="w-full">
                  📅 Make an Appointment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="http://202.51.74.38:10050/?authCode=%22674e58f5-91a5-42e6-aada-2f8aea985875%22"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  🩺 Patient Portal
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="hidden gap-2 lg:flex">
          <li>
            <Button size="lg" asChild>
              <Link to="/appointment">Make an appointment</Link>
            </Button>
          </li>
          <li>
            <Button size="lg" variant="outline" asChild>
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
      </div>
    </header>
  );
}
