import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import { DesktopNav } from "./desktop-nav";
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
        "w-full px-4 py-8",
        scrolled &&
          "animate-headerSticky supports-[backdrop-filter]:bg-background/90 sticky top-0 z-50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur",
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">Meridian</Link>

        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
}
