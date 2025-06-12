import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { allCategoriesOptions } from "@/features/blogs/blogs.queries";
import { BlogForm } from "@/features/blogs/components/blog-form";

export const Route = createFileRoute("/admin/blogs_/new")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(
      allCategoriesOptions({ values: { page: 1, pageSize: 100 } }),
    );
  },
});

function RouteComponent() {
  const {
    data: { categories },
  } = useSuspenseQuery(
    allCategoriesOptions({ values: { page: 1, pageSize: 100 } }),
  );
  return <BlogForm categories={categories} />;
}
