import { ArrowLeftIcon } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { Button } from "@/components/ui/button";

import { allUsersOptions } from "@/features/auth/auth.queries";
import {
  allCategoriesOptions,
  blogByIdOptions,
} from "@/features/blogs/blogs.queries";
import { BlogForm } from "@/features/blogs/components/blog-form";

export const Route = createFileRoute("/admin/blogs_/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const data = await queryClient.ensureQueryData(
      blogByIdOptions({ id: parseInt(id) }),
    );

    if (!data) throw notFound();

    queryClient.prefetchQuery(
      allCategoriesOptions({ values: { page: 1, pageSize: 100 } }),
    );
    queryClient.prefetchQuery(
      allUsersOptions({ values: { page: 1, pageSize: 100, role: ["admin"] } }),
    );
  },
  notFoundComponent: () => <BlogNotFound />,
});

function RouteComponent() {
  const params = Route.useParams();
  const id = parseInt(params.id);

  const { data: blog } = useSuspenseQuery(blogByIdOptions({ id }));

  if (!blog) return <BlogNotFound />;

  const {
    data: { categories },
  } = useSuspenseQuery(
    allCategoriesOptions({
      values: { page: 1, pageSize: 100 },
    }),
  );
  const {
    data: { users },
  } = useSuspenseQuery(
    allUsersOptions({ values: { page: 1, pageSize: 100, role: ["admin"] } }),
  );

  return (
    <BlogForm
      id={blog.id}
      photo={blog?.coverPhoto}
      users={users}
      categories={categories}
      defaultValues={{
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        coverFileId: blog.coverPhoto?.id as unknown as number,
        authorId: blog.author?.id,
        categoryId: blog.category?.id,
        seoDescription: blog.seoDescription,
        seoKeywords: blog.seoKeywords,
        seoTitle: blog.seoTitle,
        status: blog.status,
      }}
    />
  );
}

function BlogNotFound() {
  return (
    <AdminPageWrapper
      pageTitle="Edit Blog"
      breadcrumbs={[{ label: "All Blogs", href: "/admin/blogs" }]}
    >
      <div className="grid min-h-[80vh] place-items-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Blog Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn&apos;t find the blog you&apos;re looking for. It
              may have been deleted or never existed.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/admin/doctors">
              <ArrowLeftIcon size={16} />
              Back to Blogs
            </Link>
          </Button>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
