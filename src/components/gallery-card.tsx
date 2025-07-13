import { Calendar, Eye, User } from "lucide-react";

import { Link } from "@tanstack/react-router";

export function GalleryCard({
  title,
  slug,
  image,
  date,
  author,
}: {
  title: string;
  image?: string | null;
  slug: string;
  date: Date;
  author?: string | null;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 dark:from-slate-900 dark:to-slate-800 dark:hover:shadow-slate-900/50">
      <Link to="/galleries/$slug" params={{ slug }}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-all duration-500 group-hover:opacity-100" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
              <Eye size={24} className="text-white" />
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-0 bottom-0 left-0 p-6 text-white duration-300">
        <div className="grid gap-1">
          <Link
            to="/galleries/$slug"
            params={{ slug }}
            className="relative block translate-y-6 transition-transform duration-300 group-hover:translate-y-0 group-hover:delay-100"
          >
            <h3 className="line-clamp-2 text-lg leading-tight font-bold drop-shadow-sm">
              {title}
            </h3>
          </Link>

          <div className="flex translate-y-2 items-center gap-4 text-sm text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{date.toLocaleDateString()}</span>
            </div>
            {author && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{author}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/10" />
    </div>
  );
}
