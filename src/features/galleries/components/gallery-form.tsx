import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  LayersIcon,
  LoaderCircleIcon,
  PlusIcon,
  Trash2Icon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";

import { formOptions, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { GallerySchemaInput, gallerySchema } from "../galleries.schema";
import { saveGalleryFn } from "../server/functions/galleries";

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

import { blogByIdOptions } from "@/features/blogs/blogs.queries";
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
  images: [],
} as GallerySchemaInput;

const formOpts = formOptions({
  defaultValues: initialValues,
});

type User = { id: number; name: string };

export function GalleryForm(
  props: {
    defaultValues?: GallerySchemaInput;
  } & (
    | {
        id: number;
        photo: UploadedFile | null;
        users: User[];
        images: UploadedFile[];
      }
    | {
        id?: undefined;
        photo?: undefined;
        users?: undefined;
        images?: undefined;
      }
  ),
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    ...formOpts,
    defaultValues: props.defaultValues || initialValues,
    onSubmit: async ({ value }) => {
      const response = await saveGalleryFn({
        data: { values: value, id: props.id },
      });
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        if (!props.id) navigate({ to: "/admin/galleries" });
        else
          await queryClient.invalidateQueries(
            blogByIdOptions({ id: props.id }),
          );
      } else {
        toast.error(response.message);
      }
    },
    validators: {
      onChange: gallerySchema,
    },
  });

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.title} Gallery`
    : "Add New Gallery";

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
          breadcrumbs={[{ href: "/admin/galleries", label: "All Galleries" }]}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <GalleryDetails
                form={form}
                photo={props.photo}
                users={props.users}
              />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-2">
              <GalleryContent form={form} />
              <GalleryImages form={form} images={props.images} />
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
        <Link to="/admin/galleries">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Gallery</span>
      </Button>
    </>
  );
}

const GalleryDetails = withForm({
  ...formOpts,
  props: {} as {
    users?: User[];
    photo?: UploadedFile | null;
  },
  render: ({ form, photo, users }) => {
    const titleValue = useStore(form.store, (store) => store.values.title);

    useEffect(() => {
      const slug = slugify(titleValue);

      form.setFieldValue("slug", slug);
    }, [titleValue]);

    return (
      <Card className="sticky top-6 h-fit">
        <CardHeader>
          <CardTitle>Gallery Details</CardTitle>
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
                  Gallery Title <span className="text-destructive">*</span>
                </field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="Training on maintaining good health"
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
                    placeholder="training-on-maintaining-good-health"
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
                  use gallery title for SEO.
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
      <p>Uploading Photo</p>
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
  console.log(uploadedFiles);
  if (uploadedFiles.length === 0) return null;

  return (
    <div>
      <p>Uploaded Photo</p>
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

const GalleryContent = withForm({
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

const GalleryImages = withForm({
  ...formOpts,
  props: { images: [] as UploadedFile[] | undefined },
  render: ({ form, images: initialImages }) => {
    return (
      <form.AppField
        name="images"
        children={(field) => {
          const images = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(images);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const newImages = items.map((image, index) => ({
              ...image,
              displayOrder: index,
            }));

            form.setFieldValue("images", newImages);
          }

          function handleImageDelete(id: number) {
            const newImage = images.filter((image) => image.id !== id);
            form.setFieldValue("images", newImage);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Images</CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          field.pushValue({
                            id: Date.now(),
                            caption: "",
                            fileId: undefined as unknown as number,
                            displayOrder: images.length,
                            new: true,
                          });
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add an image
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {images.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <LayersIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No images uploaded yet</p>
                      <p className="text-sm">
                        Click &quot;Add an Image&quot; to get started
                      </p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="appointment-hours">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {images
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => {
                                const name = `images[${index}]` as const;

                                return (
                                  <form.AppField
                                    key={index}
                                    name={name}
                                    children={(field) => {
                                      const isNewImage = field.state.value.new;

                                      return (
                                        <Draggable
                                          key={field.state.value.id?.toString()} // I don't know why but this is compulsory.
                                          draggableId={
                                            field.state.value.id?.toString() ||
                                            ""
                                          }
                                          index={index}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`transition-all duration-200 ${
                                                snapshot.isDragging
                                                  ? "scale-105 rotate-2 shadow-lg"
                                                  : ""
                                              }`}
                                            >
                                              <Card className="hover:bg-muted/25 gap-4 py-6 shadow-none transition-all duration-200">
                                                <CardContent className="pr-4 pl-2">
                                                  <div className="flex items-start gap-3">
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className="hover:text-primary cursor-grab p-2 transition-colors"
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                    >
                                                      <GripVertical className="h-5 w-5" />
                                                    </div>
                                                    <div className="grid flex-1 gap-6">
                                                      <form.AppField
                                                        name={`${name}.fileId`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <FileUploader
                                                              maxFilesCount={1}
                                                              maxFileSize="5mb"
                                                              accept={[
                                                                "image/*",
                                                              ]}
                                                              onChange={(
                                                                files,
                                                              ) =>
                                                                field.handleChange(
                                                                  files[0]?.id,
                                                                )
                                                              }
                                                              initialFiles={
                                                                initialImages &&
                                                                !isNewImage
                                                                  ? [
                                                                      initialImages.filter(
                                                                        (
                                                                          image,
                                                                        ) =>
                                                                          image.id ===
                                                                          field
                                                                            .state
                                                                            .value,
                                                                      )[0],
                                                                    ]
                                                                  : []
                                                              }
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
                                                        name={`${name}.caption`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Caption
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                type="text"
                                                                placeholder="Clinical Director, Specialization, Research Focus"
                                                                name={
                                                                  field.name
                                                                }
                                                                value={
                                                                  field.state
                                                                    .value
                                                                }
                                                                onBlur={
                                                                  field.handleBlur
                                                                }
                                                                onChange={(e) =>
                                                                  field.handleChange(
                                                                    e.target
                                                                      .value,
                                                                  )
                                                                }
                                                              />
                                                            </field.FormControl>
                                                            <field.FormMessage />
                                                          </field.FormItem>
                                                        )}
                                                      />
                                                    </div>
                                                    <Button
                                                      variant="destructive"
                                                      size="sm"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (
                                                          field.state.value.id
                                                        )
                                                          handleImageDelete(
                                                            field.state.value
                                                              .id,
                                                          );
                                                      }}
                                                    >
                                                      <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            </div>
                                          )}
                                        </Draggable>
                                      );
                                    }}
                                  />
                                );
                              })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                  <field.FormMessage />
                </CardContent>
              </Card>
            </field.FormItem>
          );
        }}
      />
    );
  },
});
