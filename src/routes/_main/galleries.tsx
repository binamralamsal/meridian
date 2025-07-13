import { ChevronRightIcon, Search } from "lucide-react";
import { z } from "zod";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { GalleryCard } from "@/components/gallery-card";
import { Button } from "@/components/ui/button";

import { site } from "@/config/site";
import { allGalleriesOptions } from "@/features/galleries/galleries.queries";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/galleries")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
    search: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await queryClient.ensureQueryData(
      allGalleriesOptions({ ...search, status: ["published"] }),
    );
  },
  head: () => ({
    meta: [
      ...seo({
        title: `Galleries | ${site.name}`,
        description:
          "Browse our curated galleries featuring medical imagery, wellness visuals, and insightful healthcare illustrations to enrich your understanding.",
        keywords: `health galleries, medical images, wellness visuals, healthcare illustrations, ${site.name}`,
      }),
      { name: "creator", content: site.name },
      { name: "publisher", content: site.name },
      { name: "robot", content: "index, follow" },
      { rel: "canonical", href: `${site.url}/galleries` },
    ],
  }),
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const {
    data: { galleries },
  } = useSuspenseQuery(
    allGalleriesOptions({ ...searchParams, status: ["published"] }),
  );

  return (
    <main>
      <section className="bg-primary/5 relative overflow-hidden">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative container grid gap-4 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="bg-background/95 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
              📰 Galleries
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-balance md:text-5xl lg:text-6xl">
              Explore Our Visual Gallery
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Discover stunning collections of moments, memories, and visual
              stories captured through our lens.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="hover:text-primary font-medium transition"
              >
                Home
              </Link>
              <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-primary font-medium">Galleries</span>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-14 md:py-20 lg:py-28">
        {galleries.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                title={gallery.title}
                image={gallery.coverPhoto?.url}
                date={gallery.createdAt}
                author={gallery.author?.name}
                slug={gallery.slug}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No galleries found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>

            <Button variant="outline" asChild>
              <Link to="/galleries" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
