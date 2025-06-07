// import { FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DoctorCard({
  name,
  slug,
  photo,
  role,
}: {
  name: string;
  slug: string;
  photo?: string;
  role: string;
}) {
  return (
    <div className="group">
      <div className="relative mb-4 overflow-hidden rounded-xl shadow-sm">
        <Link to="/doctors/$slug" params={{ slug }} className="block">
          <img
            src={photo || "/placeholder.svg"}
            alt={name}
            className="h-[350px] w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="from-primary/70 absolute inset-0 flex items-end justify-center bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {/* <div className="mb-6 flex space-x-4">
              <a
                href={"/"}
                className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={"#"}
                className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href={"#"}
                className="bg-background hover:bg-primary hover:text-primary-foreground rounded-full p-2 transition-all"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div> */}
          </div>
        </Link>
      </div>
      <h3 className="text-primary text-xl font-semibold">
        <Link to="/doctors/$slug" params={{ slug }}>
          {name}
        </Link>
      </h3>
      <p className="text-foreground/80">{role}</p>
    </div>
  );
}
