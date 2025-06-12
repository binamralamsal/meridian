import { ChevronRightIcon, Search } from "lucide-react";
import { z } from "zod";

import { FormEvent, useEffect, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  allBlogsOptions,
  allCategoriesOptions,
} from "@/features/blogs/blogs.queries";
import { cn } from "@/util/cn";

export const Route = createFileRoute("/_main/blogs")({
  component: RouteComponent,
  validateSearch: z.object({
    categories: z.array(z.string()).optional().default([]).catch([]),
    page: z.number().int().min(1).optional().default(1).catch(1),
    pageSize: z.number().int().min(5).optional().default(12).catch(12),
    search: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps: search }) => {
    await queryClient.ensureQueryData(
      allBlogsOptions({ ...search, status: ["published"] }),
    );
    await queryClient.ensureQueryData(
      allCategoriesOptions({ values: { page: 1, pageSize: 100 } }),
    );
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = Route.useNavigate();

  const {
    data: { blogs },
  } = useSuspenseQuery(
    allBlogsOptions({ ...searchParams, status: ["published"] }),
  );

  const {
    data: { categories },
  } = useSuspenseQuery(
    allCategoriesOptions({ values: { page: 1, pageSize: 100 } }),
  );

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, search: searchQuery }),
      resetScroll: false,
    });
  }

  useEffect(() => {
    setSearchQuery(searchParams.search || "");
  }, [searchParams.search]);

  return (
    <main>
      <section className="bg-primary/5 relative overflow-hidden">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative container grid gap-4 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="bg-background/95 inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium">
              📰 Blogs
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-balance md:text-5xl lg:text-6xl">
              Explore Our Latest Insights
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Discover expert-written articles, news, and guides designed to
              keep you informed and inspired.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="hover:text-primary font-medium transition"
              >
                Home
              </Link>
              <ChevronRightIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-primary font-medium">Blogs</span>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-14 md:py-20 lg:py-28">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[4fr_2fr]">
          <div className="mb-8 overflow-y-auto">
            <div className="flex flex-wrap justify-start gap-2 bg-transparent p-0">
              <Link
                to="/blogs"
                search={{ categories: [] }}
                className={cn(
                  "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                  searchParams.categories.length === 0 &&
                    "text-primary-foreground bg-primary",
                )}
                resetScroll={false}
              >
                All
              </Link>
              {categories.map((cat) => {
                let values = [...searchParams.categories];
                if (searchParams.categories.includes(cat.slug)) {
                  values = searchParams.categories.filter(
                    (c) => c !== cat.slug,
                  );
                } else {
                  values.push(cat.slug);
                }

                return (
                  <Link
                    key={cat.id}
                    to="/blogs"
                    search={{ categories: values }}
                    className={cn(
                      "bg-muted rounded-full border px-4 py-2 transition-all duration-300",
                      searchParams.categories.includes(cat.slug) &&
                        "text-primary-foreground bg-primary",
                    )}
                    resetScroll={false}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full self-start"
          >
            <Input
              type="text"
              placeholder="Search blogs by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full px-6 py-6"
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-r-full has-[>svg]:pr-4"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium">
              {blogs.length} blog{blogs.length !== 1 ? "s" : ""} found
            </p>
            {searchParams.search && (
              <p className="text-muted-foreground text-sm">
                Results for &quot;{searchParams.search}&quot;
              </p>
            )}
          </div>
          {(searchParams.search || searchParams.categories.length > 0) && (
            <Button variant="ghost" asChild className="text-sm">
              <Link to="/blogs" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          )}
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.truncatedContent}
                image={blog.coverPhoto?.url}
                date={blog.createdAt}
                author={blog.author?.name}
                slug={blog.slug}
                category={blog.categoryName}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No blogs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>

            <Button variant="outline" asChild>
              <Link to="/blogs" resetScroll={false}>
                Clear all
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
