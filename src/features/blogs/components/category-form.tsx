import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";

import { useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { categoryByIdOptions } from "../blogs.queries";
import { CategorySchema, categorySchema } from "../blogs.schema";
import { saveCategoryFn } from "../server/functions/categories";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm, useFormContext } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { slugify } from "@/lib/slugify";

export function CategoryForm(props: {
  id?: number;
  defaultValues?: CategorySchema;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues:
      props.defaultValues ||
      ({
        name: "",
        slug: "",
      } as CategorySchema),
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value }) => {
      const response = await saveCategoryFn({
        data: { values: value, id: props.id },
      });

      if (response.status === "SUCCESS") {
        toast.success(response.message);
        if (!props.id) navigate({ to: "/admin/blog-categories" });
        else {
          await queryClient.invalidateQueries(
            categoryByIdOptions({ id: props.id }),
          );
        }
      } else {
        toast.error(response.message);
      }
    },
  });

  const nameValue = useStore(form.store, (store) => store.values.name);

  useEffect(() => {
    const slug = slugify(nameValue);

    form.setFieldValue("slug", slug);
  }, [nameValue]);

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Category`
    : "Add New Category";

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FormNavigationBlocker />
        <AdminPageWrapper
          breadcrumbs={[
            { label: "All Categories", href: "/admin/blog-categories" },
          ]}
          pageTitle={pageTitle}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <Card className="container px-0">
            <CardHeader>
              <CardTitle className="text-xl">Add Category</CardTitle>
              <CardDescription>
                Add a new category by entering suitable name, and slug.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid items-start gap-6 md:grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="gap-1">
                      Name <span className="text-destructive">*</span>
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="text"
                        placeholder="Psychiatry"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                    <field.FormDescription>
                      Enter a suitable category name.
                    </field.FormDescription>
                  </field.FormItem>
                )}
              />
              <form.AppField
                name="slug"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel className="gap-1">
                      Slug <span className="text-destructive">*</span>
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="text"
                        placeholder="psychiatry"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                    <field.FormDescription>
                      This will be used in URL of the category.
                    </field.FormDescription>
                  </field.FormItem>
                )}
              />
            </CardContent>
          </Card>
        </AdminPageWrapper>
      </form>
    </form.AppForm>
  );
}

function ActionButtons({ isEditing }: { isEditing?: boolean }) {
  const {
    state: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link to="/admin/blog-categories">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Category</span>
      </Button>
    </>
  );
}
