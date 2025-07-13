import { LoaderCircleIcon, TrashIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";

import { formOptions, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { blogByIdOptions } from "../blogs.queries";
import { BlogSchemaInput, blogSchema } from "../blogs.schema";
import { saveBlogFn } from "../server/functions/blogs";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import {
  FileIcon,
  FileList,
  FileName,
  FileUpload,
  FileUploader,
  UploadedFile,
  useFileUploader,
} from "@/components/file-upload";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import { TextEditor } from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm, useFormContext, withForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { slugify } from "@/lib/slugify";

const initialValues = {
  title: "",
  slug: "",
  content: "",
  status: "draft",
  coverFileId: undefined as unknown as number,
  authorId: undefined,
  categoryId: undefined,
  seoDescription: undefined,
  seoKeywords: undefined,
  seoTitle: undefined,
} as BlogSchemaInput;

const formOpts = formOptions({
  defaultValues: initialValues,
});

type User = { id: number; name: string };

export function BlogForm(
  props: {
    defaultValues?: BlogSchemaInput;
    categories: { id: number; name: string }[];
  } & (
    | {
        id: number;
        photo: UploadedFile | null;
        users: User[];
      }
    | {
        id?: undefined;
        photo?: undefined;
        users?: undefined;
      }
  ),
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    ...formOpts,
    defaultValues: props.defaultValues || initialValues,
    onSubmit: async ({ value }) => {
      const response = await saveBlogFn({
        data: { values: value, id: props.id },
      });
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        if (!props.id) navigate({ to: "/admin/blogs" });
        else
          await queryClient.invalidateQueries(
            blogByIdOptions({ id: props.id }),
          );
      } else {
        toast.error(response.message);
      }
    },
    validators: {
      onChange: blogSchema,
    },
  });

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.title} Blog`
    : "Add New Blog";

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
          pageTitle={pageTitle}
          breadcrumbs={[{ href: "/admin/blogs", label: "All Blogs" }]}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <BlogDetails
                categories={props.categories}
                form={form}
                photo={props.photo}
                users={props.users}
              />
            </div>
            <div className="lg:col-span-2">
              <BlogContent form={form} />
            </div>
          </div>
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
        <Link to="/admin/blogs">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Blog</span>
      </Button>
    </>
  );
}

const BlogDetails = withForm({
  ...formOpts,
  props: {} as {
    categories: { id: number; name: string }[];
    users?: User[];
    photo?: UploadedFile | null;
  },
  render: ({ form, categories, photo, users }) => {
    const titleValue = useStore(form.store, (store) => store.values.title);

    useEffect(() => {
      const slug = slugify(titleValue);

      form.setFieldValue("slug", slug);
    }, [titleValue]);

    return (
      <Card className="sticky top-6 h-fit">
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>
            Enter name, status, and a suitable featured image.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form.AppField
            name="coverFileId"
            children={(field) => (
              <field.FormItem>
                <FileUploader
                  maxFilesCount={1}
                  maxFileSize="5mb"
                  accept={["image/*"]}
                  onChange={(files) => field.handleChange(files[0]?.id)}
                  initialFiles={photo ? [photo] : []}
                >
                  <field.FormControl>
                    <FileUpload />
                  </field.FormControl>
                  <UploadingFilesList />
                  <UploadedFilesList />
                </FileUploader>

                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="title"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel className="gap-1">
                  Blog Title <span className="text-destructive">*</span>
                </field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="Ways to Maintain Clean Hygiene"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
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
                    placeholder="john-smith"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormDescription>
                  Slug is the value that appears in the URL
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="categoryId"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Category</field.FormLabel>

                <Select
                  value={field.state.value ? field.state.value.toString() : ""}
                  onValueChange={(value) => field.handleChange(parseInt(value))}
                >
                  <field.FormControl>
                    <SelectTrigger
                      aria-label="Select a category"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </field.FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          {users ? (
            <form.AppField
              name="authorId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel>Author</field.FormLabel>

                  <Select
                    value={
                      field.state.value ? field.state.value.toString() : ""
                    }
                    onValueChange={(value) =>
                      field.handleChange(parseInt(value))
                    }
                  >
                    <field.FormControl>
                      <SelectTrigger
                        aria-label="Select an author"
                        className="w-full"
                      >
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                    </field.FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          ) : null}
          <form.AppField
            name="status"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Status</field.FormLabel>

                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as "draft" | "archived" | "published")
                  }
                >
                  <field.FormControl>
                    <SelectTrigger
                      aria-label="Select a status"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </field.FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>

                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="seoTitle"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>SEO Title</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="Ways to Maintain Clean Hygiene"
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
                <field.FormDescription>
                  This is for SEO only. You can leave it empty if you want to
                  use blog title for SEO.
                </field.FormDescription>
              </field.FormItem>
            )}
          />
          <form.AppField
            name="seoDescription"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Description</field.FormLabel>
                <field.FormControl>
                  <Textarea
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Having a healthy life is essential..."
                    rows={5}
                  />
                </field.FormControl>
                <field.FormMessage />
                <field.FormDescription>
                  This is for SEO only. You can leave it empty but it&apos;s
                  recommended to give a short description for SEO.
                </field.FormDescription>
              </field.FormItem>
            )}
          />
          <form.AppField
            name="seoKeywords"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>SEO Title</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="hygiene, clinic, sanitation"
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>
                <field.FormMessage />
                <field.FormDescription>
                  This is for SEO only. Enter keywords of this article separated
                  by commas.
                </field.FormDescription>
              </field.FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  },
});

function UploadingFilesList() {
  const { uploadingFiles, cancelUpload } = useFileUploader();

  if (uploadingFiles.length === 0) return null;

  return (
    <div>
      <p>Uploading Cover Photo</p>
      <div className="mt-2 space-y-2">
        {uploadingFiles.map(({ file, preview, progress }) => (
          <FileList key={file.name}>
            <FileIcon fileType={file.type} name={file.name} preview={preview} />

            <FileName name={file.name} progress={progress} />
            <Button
              onClick={() => cancelUpload(file)}
              size="icon"
              variant="destructive"
              type="button"
              className="justify-self-end"
            >
              <XIcon />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

function UploadedFilesList() {
  const { uploadedFiles, deleteFile } = useFileUploader();

  if (uploadedFiles.length === 0) return null;

  return (
    <div>
      <p>Uploaded Cover Photo</p>
      <div className="mt-2 space-y-2">
        {uploadedFiles.map(({ name, url, fileType, id }) => (
          <FileList key={id} className="flex-grow">
            <FileIcon fileType={fileType} name={name} preview={url} />

            <FileName name={name} />
            <Button
              onClick={() => deleteFile(url)}
              size="icon"
              variant="destructive"
              type="button"
              className="justify-self-end"
            >
              <TrashIcon />
            </Button>
          </FileList>
        ))}
      </div>
    </div>
  );
}

const BlogContent = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-lg">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="content"
            children={(field) => (
              <field.FormItem>
                <field.FormControl>
                  <TextEditor
                    content={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                    toolbarClassName="top-16"
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </CardContent>
      </Card>
    );
  },
});
