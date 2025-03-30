import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import { DesktopNav } from "./desktop-nav";
import { Logo } from "./icons/logo";
import { MobileNav } from "./mobile-nav";

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
      </div>
    </header>
  );
}
