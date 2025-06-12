import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Layers,
  LoaderCircleIcon,
  Plus,
  Trash2,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";

import { formOptions, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { doctorByIdOptions } from "../doctors.queries";
import { DoctorSchemaInput, doctorSchema } from "../doctors.schema";
import { saveDoctorFn } from "../server/functions/doctors";

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
  name: "",
  appointmentHours: [],
  description: "",
  education: [],
  experiences: [],
  slug: "",
  photoFileId: undefined as unknown as number,
  role: "",
  achievements: [],
  email: "",
  location: undefined,
  phoneNumber: undefined,
  departmentId: undefined,
} as DoctorSchemaInput;

const formOpts = formOptions({
  defaultValues: initialValues,
});

export function DoctorForm(
  props: {
    defaultValues?: DoctorSchemaInput;
    departments: { id: number; name: string }[];
  } & (
    | {
        id: number;
        photo: UploadedFile | null;
      }
    | {
        id?: undefined;
        photo?: undefined;
      }
  ),
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    ...formOpts,
    defaultValues: props.defaultValues || initialValues,
    onSubmit: async ({ value }) => {
      const response = await saveDoctorFn({
        data: { values: value, id: props.id },
      });
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        if (!props.id) navigate({ to: "/admin/doctors" });
        else
          await queryClient.invalidateQueries(
            doctorByIdOptions({ id: props.id }),
          );
      } else {
        toast.error(response.message);
      }
    },
    validators: {
      onChange: doctorSchema,
    },
  });

  const pageTitle = props.id
    ? `Edit ${props.defaultValues?.name} Doctor`
    : "Add New Doctor";

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
          breadcrumbs={[{ href: "/admin/doctors", label: "All Doctors" }]}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DoctorDetails
                form={form}
                departments={props.departments}
                photo={props.photo}
              />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <DoctorAppointmentHours form={form} />
              <DoctorEducation form={form} />
              <DoctorExperiences form={form} />
              <DoctorsAchievements form={form} />
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
        <Link to="/admin/doctors">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Doctor</span>
      </Button>
    </>
  );
}

const DoctorDetails = withForm({
  ...formOpts,
  props: {} as {
    departments: { id: number; name: string }[];
    photo?: UploadedFile | null;
  },
  render: ({ form, departments, photo }) => {
    const nameValue = useStore(form.store, (store) => store.values.name);

    useEffect(() => {
      const slug = slugify(nameValue);

      form.setFieldValue("slug", slug);
    }, [nameValue]);

    return (
      <Card className="sticky top-6 h-fit">
        <CardHeader>
          <CardTitle>Doctor Details</CardTitle>
          <CardDescription>
            Enter name, role, and a suitable photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <form.AppField
            name="photoFileId"
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
            name="name"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Doctor Name</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="John Smith"
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
                <field.FormLabel>Slug</field.FormLabel>
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
            name="role"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Role</field.FormLabel>
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
                  Ex: Board-certified Psychiatrist, Psychiatric Nurse
                  Practitioner, etc.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="departmentId"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Department</field.FormLabel>

                <Select
                  value={field.state.value ? field.state.value.toString() : ""}
                  onValueChange={(value) =>
                    field.handleChange(
                      isNaN(parseInt(value)) ? undefined : parseInt(value),
                    )
                  }
                >
                  <field.FormControl>
                    <SelectTrigger
                      aria-label="Select a department"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </field.FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="description"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Description</field.FormLabel>
                <field.FormControl>
                  <Textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter doctor description"
                    rows={4}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="phoneNumber"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Phone Number</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="john-smith"
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>

                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="email"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Email Address</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="john@smith.com"
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>

                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="location"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Location</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="New York, NY"
                    name={field.name}
                    value={field.state.value ? field.state.value : ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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

const DoctorAppointmentHours = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.AppField
        name="appointmentHours"
        children={(field) => {
          const appointmentHours = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(appointmentHours);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedSections = items.map((appointmentHour, index) => ({
              ...appointmentHour,
              displayOrder: index,
            }));

            form.setFieldValue("appointmentHours", updatedSections);
          }

          function handleAppointmentHourDelete(id: number) {
            const newSections = appointmentHours.filter(
              (appointmentHour) => appointmentHour.id !== id,
            );
            form.setFieldValue("appointmentHours", newSections);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Appointment Hours</CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          field.pushValue({
                            id: Date.now(),
                            day: undefined as unknown as "sunday",
                            timeEnd: "",
                            timeStart: "",
                            displayOrder: appointmentHours.length,
                            new: true,
                          });
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add an Appointment Hour
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {appointmentHours.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No appointment hours created yet</p>
                      <p className="text-sm">
                        Click &quot;Add Appointment Hour&quot; to get started
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
                            {appointmentHours
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => {
                                const name =
                                  `appointmentHours[${index}]` as const;

                                return (
                                  <form.AppField
                                    key={index}
                                    name={name}
                                    children={(field) => (
                                      <Draggable
                                        key={field.state.value.id.toString()} // I don't know why but this is compulsory.
                                        draggableId={
                                          field.state.value.id.toString() || ""
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
                                                      name={`${name}.day`}
                                                      children={(field) => (
                                                        <field.FormItem>
                                                          <field.FormLabel>
                                                            Appointment Day
                                                          </field.FormLabel>
                                                          <field.FormControl>
                                                            <Select
                                                              value={
                                                                field.state
                                                                  .value
                                                              }
                                                              onValueChange={(
                                                                value,
                                                              ) =>
                                                                field.handleChange(
                                                                  value as DoctorSchemaInput["appointmentHours"][number]["day"],
                                                                )
                                                              }
                                                            >
                                                              <field.FormControl>
                                                                <SelectTrigger
                                                                  aria-label="Select day"
                                                                  className="w-full"
                                                                >
                                                                  <SelectValue placeholder="Select day" />
                                                                </SelectTrigger>
                                                              </field.FormControl>
                                                              <SelectContent>
                                                                <SelectItem
                                                                  value={
                                                                    "sunday"
                                                                  }
                                                                >
                                                                  Sunday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "monday"
                                                                  }
                                                                >
                                                                  Monday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "tuesday"
                                                                  }
                                                                >
                                                                  Tuesday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "wednesday"
                                                                  }
                                                                >
                                                                  Wednesday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "thursday"
                                                                  }
                                                                >
                                                                  Thursday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "friday"
                                                                  }
                                                                >
                                                                  Friday
                                                                </SelectItem>
                                                                <SelectItem
                                                                  value={
                                                                    "saturday"
                                                                  }
                                                                >
                                                                  Saturday
                                                                </SelectItem>
                                                              </SelectContent>
                                                            </Select>
                                                          </field.FormControl>
                                                          <field.FormMessage />
                                                        </field.FormItem>
                                                      )}
                                                    />

                                                    <div className="grid items-start gap-6 md:grid-cols-2">
                                                      <form.AppField
                                                        name={`${name}.timeStart`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Start Time
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                name={
                                                                  field.name
                                                                }
                                                                type="time"
                                                                onBlur={
                                                                  field.handleBlur
                                                                }
                                                                value={to24HourFormat(
                                                                  field.state
                                                                    .value,
                                                                )}
                                                                onChange={(
                                                                  event,
                                                                ) =>
                                                                  field.handleChange(
                                                                    to12HourFormat(
                                                                      event
                                                                        .target
                                                                        .value,
                                                                    ),
                                                                  )
                                                                }
                                                              />
                                                            </field.FormControl>
                                                            <field.FormMessage />
                                                          </field.FormItem>
                                                        )}
                                                      />
                                                      <form.AppField
                                                        name={`${name}.timeEnd`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              End Time
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                name={
                                                                  field.name
                                                                }
                                                                type="time"
                                                                onBlur={
                                                                  field.handleBlur
                                                                }
                                                                value={to24HourFormat(
                                                                  field.state
                                                                    .value,
                                                                )}
                                                                onChange={(
                                                                  event,
                                                                ) =>
                                                                  field.handleChange(
                                                                    to12HourFormat(
                                                                      event
                                                                        .target
                                                                        .value,
                                                                    ),
                                                                  )
                                                                }
                                                              />
                                                            </field.FormControl>
                                                            <field.FormMessage />
                                                          </field.FormItem>
                                                        )}
                                                      />
                                                    </div>
                                                  </div>
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (field.state.value.id)
                                                        handleAppointmentHourDelete(
                                                          field.state.value.id,
                                                        );
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        )}
                                      </Draggable>
                                    )}
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

const DoctorEducation = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.AppField
        name="education"
        children={(field) => {
          const education = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(education);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedEducation = items.map((appointmentHour, index) => ({
              ...appointmentHour,
              displayOrder: index,
            }));

            form.setFieldValue("education", updatedEducation);
          }

          function handleAppointmentHourDelete(id: number) {
            const newEducation = education.filter(
              (appointmentHour) => appointmentHour.id !== id,
            );
            form.setFieldValue("education", newEducation);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Education & Training
                    </CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          field.pushValue({
                            id: Date.now(),
                            degree: "",
                            institution: "",
                            yearOfCompletion: "",
                            displayOrder: education.length,
                            new: true,
                          });
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add an Education Detail
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {education.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No education details created yet</p>
                      <p className="text-sm">
                        Click &quot;Add an Education Detail&quot; to get started
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
                            {education
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => {
                                const name = `education[${index}]` as const;

                                return (
                                  <form.AppField
                                    key={index}
                                    name={name}
                                    children={(field) => (
                                      <Draggable
                                        key={field.state.value.id.toString()} // I don't know why but this is compulsory.
                                        draggableId={
                                          field.state.value.id.toString() || ""
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
                                                      name={`${name}.degree`}
                                                      children={(field) => (
                                                        <field.FormItem>
                                                          <field.FormLabel>
                                                            Degree
                                                          </field.FormLabel>
                                                          <field.FormControl>
                                                            <Input
                                                              type="text"
                                                              placeholder="Doctor of Medicine"
                                                              name={field.name}
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

                                                    <div className="grid items-start gap-6 md:grid-cols-2">
                                                      <form.AppField
                                                        name={`${name}.institution`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Institution
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                type="text"
                                                                placeholder="Harvard Medical School"
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
                                                      <form.AppField
                                                        name={`${name}.yearOfCompletion`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Year of Completion
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                type="text"
                                                                placeholder="2016"
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
                                                  </div>
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      if (field.state.value.id)
                                                        handleAppointmentHourDelete(
                                                          field.state.value.id,
                                                        );
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        )}
                                      </Draggable>
                                    )}
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

const DoctorExperiences = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.AppField
        name="experiences"
        children={(field) => {
          const experiences = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(experiences);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedExperiences = items.map((appointmentHour, index) => ({
              ...appointmentHour,
              displayOrder: index,
            }));

            form.setFieldValue("experiences", updatedExperiences);
          }

          function handleExperiencesDelete(id: number) {
            const newEducation = experiences.filter(
              (appointmentHour) => appointmentHour.id !== id,
            );
            form.setFieldValue("experiences", newEducation);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Experiences & Expertises
                    </CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          field.pushValue({
                            id: Date.now(),
                            role: "",
                            shortDescription: "",
                            displayOrder: experiences.length,
                            new: true,
                          });
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add an Experience
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {experiences.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No experiences created yet</p>
                      <p className="text-sm">
                        Click &quot;Add an Experience&quot; to get started
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
                            {experiences
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => {
                                const name = `experiences[${index}]` as const;

                                return (
                                  <form.AppField
                                    key={index}
                                    name={name}
                                    children={(field) => (
                                      <Draggable
                                        key={field.state.value.id.toString()} // I don't know why but this is compulsory.
                                        draggableId={
                                          field.state.value.id.toString() || ""
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
                                                      name={`${name}.role`}
                                                      children={(field) => (
                                                        <field.FormItem>
                                                          <field.FormLabel>
                                                            Degree
                                                          </field.FormLabel>
                                                          <field.FormControl>
                                                            <Input
                                                              type="text"
                                                              placeholder="Clinical Director, Specialization, Research Focus"
                                                              name={field.name}
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
                                                    <form.AppField
                                                      name={`${name}.shortDescription`}
                                                      children={(field) => (
                                                        <field.FormItem>
                                                          <field.FormLabel>
                                                            Short Description
                                                          </field.FormLabel>
                                                          <field.FormControl>
                                                            <Textarea
                                                              name={field.name}
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
                                                              placeholder="Enter short experience description"
                                                              rows={4}
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
                                                      if (field.state.value.id)
                                                        handleExperiencesDelete(
                                                          field.state.value.id,
                                                        );
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          </div>
                                        )}
                                      </Draggable>
                                    )}
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

const DoctorsAchievements = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.AppField
        name="achievements"
        children={(field) => {
          const achievements = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(achievements || []);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedAchievements = items.map((appointmentHour, index) => ({
              ...appointmentHour,
              displayOrder: index,
            }));

            form.setFieldValue("achievements", updatedAchievements);
          }

          function handleExperiencesDelete(id: number) {
            const newAchievements = achievements?.filter(
              (appointmentHour) => appointmentHour.id !== id,
            );
            form.setFieldValue("achievements", newAchievements);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Awards & Achievements
                    </CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          field.pushValue({
                            id: Date.now(),
                            title: "",
                            year: "",
                            displayOrder: achievements?.length || 1,
                            new: true,
                          });
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add an Achievement
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {achievements?.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No experiences created yet</p>
                      <p className="text-sm">
                        Click &quot;Add an Experience&quot; to get started
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
                            {achievements
                              ?.sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => {
                                const name = `achievements[${index}]` as const;

                                return (
                                  <form.AppField
                                    key={index}
                                    name={name}
                                    children={(field) => {
                                      if (!field.state.value) return null;

                                      return (
                                        <Draggable
                                          key={field.state.value.id.toString()} // I don't know why but this is compulsory.
                                          draggableId={
                                            field.state.value.id.toString() ||
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
                                                    <div className="grid flex-1 gap-6 md:grid-cols-2">
                                                      <form.AppField
                                                        name={`${name}.title`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Title
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                type="text"
                                                                placeholder="Excellence in Psychiatric Care Award"
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
                                                      <form.AppField
                                                        name={`${name}.year`}
                                                        children={(field) => (
                                                          <field.FormItem>
                                                            <field.FormLabel>
                                                              Year
                                                            </field.FormLabel>
                                                            <field.FormControl>
                                                              <Input
                                                                type="text"
                                                                placeholder="2018"
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
                                                          field.state.value?.id
                                                        )
                                                          handleExperiencesDelete(
                                                            field.state.value
                                                              .id,
                                                          );
                                                      }}
                                                    >
                                                      <Trash2 className="h-4 w-4" />
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

function UploadedFilesList() {
  const { uploadedFiles, deleteFile } = useFileUploader();

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

function to12HourFormat(time24: string) {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minuteStr.padStart(2, "0")} ${period}`;
}

function to24HourFormat(time12: string) {
  if (!time12) return "";

  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error("Invalid 12-hour format");

  const [, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);

  if (period.toUpperCase() === "AM") {
    hour = hour % 12;
  } else {
    hour = (hour % 12) + 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minuteStr}`;
}
