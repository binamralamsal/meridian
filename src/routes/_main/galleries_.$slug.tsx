import LightGallery from "lightgallery/react";
import { Calendar, ChevronRight, Share2Icon } from "lucide-react";
import { BlogPosting, WithContext } from "schema-dts";
import { toast } from "sonner";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";

import { Button } from "@/components/ui/button";

import { site } from "@/config/site";
import { galleryBySlugOptions } from "@/features/galleries/galleries.queries";
import { seo } from "@/util/seo";

export const Route = createFileRoute("/_main/galleries_/$slug")({
  component: RouteComponent,
  loader: async ({ params: { slug }, context: { queryClient } }) => {
    const gallery = await queryClient.ensureQueryData(
      galleryBySlugOptions({ slug }),
    );
    if (!gallery) throw notFound();

    return gallery;
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: loaderData?.seoTitle || `${loaderData?.title} | ${site.name}`,
        description: loaderData?.seoDescription || loaderData?.truncatedContent,
        image: loaderData?.coverPhoto?.url || "/placeholder.svg",
        keywords:
          loaderData?.seoKeywords ||
          `health gallery, medical tips, ${site.name}`,
      }),
      { name: "author", content: loaderData?.author?.name || site.name },
      { name: "robot", content: "index, follow" },
      {
        name: "canonical",
        content: `${site.url}/galleries/${loaderData?.slug}`,
      },
    ],
  }),
});
function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: gallery } = useSuspenseQuery(galleryBySlugOptions({ slug }));

  if (!gallery) return null;

  const galleryJsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: gallery.title,
    description: gallery.truncatedContent,
    url: `${site.url}/galleries/${gallery.slug}`,
    datePublished: gallery.createdAt.toISOString(),
    author: gallery.author
      ? {
          "@type": "Person",
          name: gallery.author.name,
        }
      : undefined,
    image: gallery.coverPhoto?.url
      ? {
          "@type": "ImageObject",
          url: `${site.url}${gallery.coverPhoto.url}`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/galleries/${gallery.slug}`,
    },
  };

  function handleShareButtonClick() {
    if (!gallery) return;

    if (navigator.share) {
      navigator
        .share({
          title: `${gallery.title} | ${site.name}`,
          text: `Checkout this wonderful gallery`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 md:py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />

      <header className="mb-12">
        <nav className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
          <Link
            className="hover:text-primary transition-colors"
            to="/galleries"
          >
            Galleries
          </Link>
          <ChevronRight className="h-4 w-4" />

          <span className="text-foreground font-medium">{gallery.title}</span>
        </nav>

        <h1 className="mb-8 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl">
          {gallery.title}
        </h1>

        <div className="text-muted-foreground mb-8 flex flex-wrap items-center gap-4 text-sm">
          {gallery.author && (
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-primary text-xs font-semibold">
                  {gallery.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-foreground font-medium">
                {gallery.author.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{gallery.createdAt.toLocaleDateString()}</span>
          </div>
          <Button
            variant="link"
            className="cursor-pointer hover:no-underline"
            size="sm"
            onClick={handleShareButtonClick}
          >
            <Share2Icon className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="bg-muted relative overflow-hidden rounded-lg">
          <img
            src={gallery.coverPhoto?.url || "/placeholder.svg"}
            alt={gallery.title}
            className="h-auto w-full object-cover"
          />
        </div>
      </header>

      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: gallery.content }}
      ></article>

      <div className="my-12">
        <div className="border-border border-t"></div>
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-semibold lg:text-3xl">
          Gallery Images
        </h2>
        <LightGallery speed={500} elementClassNames="grid grid-cols-3 gap-4">
          {gallery.images.map((image, index) => (
            <a
              href={image.file?.url}
              key={image.fileId}
              className="group relative mb-4 block transform cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg transition-all duration-500 ease-out before:absolute before:inset-0 before:z-10 before:bg-gradient-to-t before:from-black/60 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 before:group-hover:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:z-20 after:translate-x-full after:-skew-x-12 after:transform after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:opacity-0 after:transition-transform after:duration-1000 after:ease-out after:group-hover:translate-x-[-200%] after:group-hover:opacity-100 hover:-translate-y-1 hover:scale-[1.02] hover:animate-none hover:shadow-md"
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: "0.7s",
                animationFillMode: "both",
              }}
            >
              <img
                alt={image.caption}
                src={image.file?.url}
                className="block h-auto w-full transform object-cover brightness-100 contrast-100 filter transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
              />
              <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
                <p className="bg-primary pointer-events-none scale-90 transform rounded-lg px-4 py-2 text-center text-lg font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
                  {image.caption}
                </p>
              </div>
            </a>
          ))}
        </LightGallery>
      </section>

      <div className="my-12">
        <div className="border-border border-t"></div>
      </div>

      <footer className="space-y-6">
        {gallery.author && (
          <div className="border-border bg-muted/30 flex items-center gap-4 rounded-lg border p-6">
            <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
              <span className="text-primary text-lg font-semibold">
                {gallery.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-semibold">
                Posted by {gallery.author.name}
              </h3>
              <Link
                to="/galleries"
                className="text-muted-foreground mt-1 text-sm"
              >
                Published on {gallery.createdAt.toLocaleDateString()}
              </Link>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareButtonClick}
            >
              <Share2Icon className="h-4 w-4" />
              Share
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>{gallery.createdAt.toLocaleDateString()}</span>
          </div>
          <Link
            to="/galleries"
            className="text-primary hover:text-primary/80 flex gap-2 text-sm font-medium transition-colors"
          >
            <span>←</span> Back to all galleries
          </Link>
        </div>
      </footer>
    </div>
  );
}
