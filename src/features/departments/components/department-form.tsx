import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import {
  ChevronDown,
  ChevronRight,
  Grid3X3,
  GripVertical,
  ImageIcon,
  Layers,
  LoaderCircleIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";

import { formOptions, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { departmentByIdOptions } from "../departments.queries";
import { DepartmentSchema, departmentSchema } from "../departments.schema";
import { saveDepartmentFn } from "../server/functions/departments";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import IconPicker from "@/components/icon-picker";
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
import { Textarea } from "@/components/ui/textarea";

import { DynamicIcon } from "@/lib/load-icon";
import { slugify } from "@/lib/slugify";
import { cn } from "@/util/cn";

const initialValues = {
  title: "",
  slug: "",
  icon: "",
  description: "",
  sections: [],
} as DepartmentSchema;

const formOpts = formOptions({
  defaultValues: initialValues,
});

export function DepartmentForm(props: {
  id?: number;
  defaultValues?: DepartmentSchema;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    ...formOpts,
    defaultValues: props.defaultValues || initialValues,
    onSubmit: async ({ value }) => {
      const response = await saveDepartmentFn({
        data: { values: value, id: props.id },
      });

      if (response.status === "SUCCESS") {
        toast.success(response.message);
        if (!props.id) navigate({ to: "/admin/departments" });
        else
          await queryClient.invalidateQueries(
            departmentByIdOptions({ id: props.id }),
          );
      } else {
        toast.error(response.message);
      }
    },
    validators: {
      onChange: departmentSchema,
    },
  });

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
          pageTitle="Add New Department"
          breadcrumbs={[
            { label: "All Departments", href: "/admin/departments" },
          ]}
          rightSideContent={<ActionButtons isEditing={!!props.id} />}
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DepartmentDetails form={form} />
            </div>

            <div className="lg:col-span-2">
              <DepartmentSections form={form} />
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
        <Link to="/admin/departments">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>{isEditing ? "Update" : "Add"} Department</span>
      </Button>
    </>
  );
}

const DepartmentDetails = withForm({
  ...formOpts,
  render: ({ form }) => {
    const sections = useStore(form.store, (store) => store.values.sections);

    const nameValue = useStore(form.store, (store) => store.values.title);

    useEffect(() => {
      const slug = slugify(nameValue);

      form.setFieldValue("slug", slug);
    }, [nameValue]);

    return (
      <Card className="sticky top-6 h-fit">
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
          <CardDescription>
            Enter title, description, and a suitable icon for it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center space-y-2">
            <form.AppField
              name="icon"
              children={(field) => (
                <field.FormItem className="place-items-center">
                  <field.FormControl>
                    <IconPicker
                      asChild
                      onIconSelect={(icon) => field.handleChange(icon.name)}
                    >
                      <Button
                        variant="outline"
                        className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed p-0"
                      >
                        {field.state.value ? (
                          <DynamicIcon
                            iconName={field.state.value}
                            key={field.state.value}
                            className="size-10"
                            fallbackClassName="size-10 text-gray-500"
                          />
                        ) : (
                          <ImageIcon className="size-10 text-gray-500" />
                        )}
                      </Button>
                    </IconPicker>
                  </field.FormControl>
                  <field.FormLabel className="text-sm">
                    Set Icon
                  </field.FormLabel>
                  <field.FormMessage />
                </field.FormItem>
              )}
            ></form.AppField>
          </div>
          <form.AppField
            name="title"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Department Title</field.FormLabel>
                <field.FormControl>
                  <Input
                    type="text"
                    placeholder="Psychiatry Department"
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
                    placeholder="psychiatry-department"
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
                    placeholder="Enter department description"
                    rows={4}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Sections:</strong> {sections.length}
              </p>
              <p>
                <strong>Total Cards:</strong>{" "}
                {sections.reduce(
                  (acc, section) => acc + section.cards.length,
                  0,
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
});

const DepartmentSections = withForm({
  ...formOpts,
  render: ({ form }) => {
    const [activeSection, setActiveSection] = useState<number>();

    return (
      <form.AppField
        name="sections"
        children={(field) => {
          const sections = field.state.value;

          function onDragEnd(result: DropResult) {
            if (!result.destination) return;

            const items = Array.from(sections);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            const updatedSections = items.map((section, index) => ({
              ...section,
              displayOrder: index,
            }));

            form.setFieldValue("sections", updatedSections);
          }

          function handleSectionDelete(id: number) {
            const newSections = sections.filter((section) => section.id !== id);
            form.setFieldValue("sections", newSections);
          }

          return (
            <field.FormItem>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Department Sections
                    </CardTitle>

                    <field.FormControl>
                      <Button
                        onClick={() => {
                          const id = Date.now();

                          field.pushValue({
                            id: id,
                            title: "",
                            label: "",
                            cards: [],
                            description: "",
                            displayOrder: sections.length,
                            new: true,
                          });

                          setActiveSection(id);
                        }}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Section
                      </Button>
                    </field.FormControl>
                  </div>
                </CardHeader>
                <CardContent>
                  {sections.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No sections created yet</p>
                      <p className="text-sm">
                        Click &quot;Add Section&quot; to get started
                      </p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="sections-2">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {sections
                              .sort((a, b) => a.displayOrder - b.displayOrder)
                              .map((section, index) => (
                                <SectionCard2
                                  key={index} // TODO: Using id as key causes error—probably bug of Tanstack form
                                  form={form}
                                  index={index}
                                  isActive={section.id === activeSection}
                                  onToggleActive={() => {
                                    if (section.id === activeSection)
                                      setActiveSection(undefined);
                                    else setActiveSection(section.id);
                                  }}
                                  onDelete={() =>
                                    handleSectionDelete(section.id)
                                  }
                                />
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
              <field.FormMessage />
            </field.FormItem>
          );
        }}
      />
    );
  },
});

const SectionCard2 = withForm({
  ...formOpts,
  props: {} as {
    index: number;
    isActive: boolean;
    onToggleActive: () => void;
    onDelete: () => void;
  },
  render: ({ form, index, isActive, onToggleActive, onDelete }) => {
    const [activeCard, setActiveCard] = useState<number>();

    return (
      <form.AppField
        name={`sections[${index}]`}
        children={(field) => (
          <Draggable
            key={field.state.value.id.toString()} // I don't know why but this is compulsory.
            draggableId={field.state.value.id.toString()}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`transition-all duration-200 ${
                  snapshot.isDragging ? "scale-105 rotate-2 shadow-lg" : ""
                }`}
              >
                <Card
                  className={cn(
                    `hover:bg-muted/25 gap-4 p-0 shadow-none transition-all duration-200`,
                    isActive && "bg-muted/25",
                  )}
                >
                  <CardHeader
                    className="grid-rows-none py-4"
                    onClick={onToggleActive}
                    {...provided.dragHandleProps}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        {...provided.dragHandleProps}
                        className="hover:text-primary cursor-grab transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>

                      <div className="flex flex-1 items-center gap-3">
                        {isActive ? (
                          <ChevronDown className="text-primary h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}

                        <div className="flex-1 select-none">
                          {field.state.value.title ||
                          field.state.value.label ? (
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {field.state.value.title || "Untitled Section"}
                              </h3>
                              {field.state.value.label && (
                                <p className="text-sm text-gray-500">
                                  {field.state.value.label}
                                </p>
                              )}
                            </div>
                          ) : (
                            <h3 className="font-semibold text-gray-400">
                              New Section
                            </h3>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                          {field.state.value.cards.length} cards
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {isActive && (
                    <CardContent className="grid gap-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <form.AppField
                          name={`sections[${index}].label`}
                          children={(field) => (
                            <field.FormItem>
                              <field.FormLabel>Short Label</field.FormLabel>
                              <field.FormControl>
                                <Input
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="e.g., Overview, Features"
                                />
                              </field.FormControl>
                              <field.FormMessage />
                            </field.FormItem>
                          )}
                        />
                        <form.AppField
                          name={`sections[${index}].title`}
                          children={(field) => (
                            <field.FormItem>
                              <field.FormLabel>Section Title</field.FormLabel>
                              <field.FormControl>
                                <Input
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="Enter title"
                                />
                              </field.FormControl>
                              <field.FormMessage />
                            </field.FormItem>
                          )}
                        />
                        <form.AppField
                          name={`sections[${index}].description`}
                          children={(field) => (
                            <field.FormItem className="md:col-span-2">
                              <field.FormLabel>Description</field.FormLabel>
                              <field.FormControl>
                                <Textarea
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  placeholder="Enter section description"
                                  rows={4}
                                />
                              </field.FormControl>
                              <field.FormMessage />
                            </field.FormItem>
                          )}
                        />
                      </div>
                      <form.AppField
                        name={`sections[${index}].cards`}
                        children={function SectionCards(subField) {
                          const sectionId = field.state.value.id;
                          const cards = subField.state.value;

                          function onCardDragEnd(result: DropResult) {
                            if (!result.destination) return;

                            const items = Array.from(cards);
                            const [reorderedItem] = items.splice(
                              result.source.index,
                              1,
                            );
                            items.splice(
                              result.destination.index,
                              0,
                              reorderedItem,
                            );

                            const updatedCards = items.map((card, idx) => ({
                              ...card,
                              displayOrder: idx,
                            }));

                            subField.setValue(updatedCards);
                          }

                          return (
                            <div className="grid gap-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Section Cards</h4>
                                <Button
                                  onClick={() => {
                                    const id = Date.now();

                                    subField.pushValue({
                                      id: id,
                                      icon: "",
                                      title: "",
                                      description: "",
                                      displayOrder: cards.length,
                                      new: true,
                                    });

                                    setActiveCard(id);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                >
                                  <Plus className="h-4 w-4" />
                                  Add Card
                                </Button>
                              </div>
                              <div className="pb-6">
                                {cards.length === 0 ? (
                                  <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-gray-500">
                                    <Grid3X3 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                    <p className="text-sm">
                                      No cards in this section
                                    </p>
                                  </div>
                                ) : (
                                  <DragDropContext onDragEnd={onCardDragEnd}>
                                    <Droppable
                                      droppableId={`cards-${sectionId}`}
                                    >
                                      {(provided) => (
                                        <div
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                          className="space-y-3"
                                        >
                                          {cards
                                            .sort(
                                              (a, b) =>
                                                a.displayOrder - b.displayOrder,
                                            )
                                            .map((card, cardIndex) => (
                                              <CardItem2
                                                key={cardIndex}
                                                form={form}
                                                cardIndex={cardIndex}
                                                sectionIndex={index}
                                                isActive={
                                                  activeCard === card.id
                                                }
                                                onDelete={() =>
                                                  subField.removeValue(
                                                    cardIndex,
                                                  )
                                                }
                                                onToggleActive={() => {
                                                  if (card.id === activeCard)
                                                    setActiveCard(undefined);
                                                  else setActiveCard(card.id);
                                                }}
                                              />
                                            ))}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </DragDropContext>
                                )}
                                <field.FormMessage />
                              </div>
                            </div>
                          );
                        }}
                      />
                    </CardContent>
                  )}
                </Card>
              </div>
            )}
          </Draggable>
        )}
      />
    );
  },
});

const CardItem2 = withForm({
  ...formOpts,
  props: {} as {
    sectionIndex: number;
    cardIndex: number;
    isActive: boolean;
    onToggleActive: () => void;
    onDelete: () => void;
  },
  render: ({
    form,
    sectionIndex,
    cardIndex,
    isActive,
    onDelete,
    onToggleActive,
  }) => {
    const formName = `sections[${sectionIndex}].cards[${cardIndex}]` as const;

    return (
      <form.AppField
        name={formName}
        children={(field) => {
          const card = field.state.value;

          return (
            <Draggable
              key={card.id.toString()}
              draggableId={card.id.toString()}
              index={cardIndex}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`transition-all duration-200 ${
                    snapshot.isDragging
                      ? "z-50 scale-105 rotate-1 shadow-lg"
                      : ""
                  }`}
                >
                  <Card
                    className={`border transition-all duration-200 ${
                      snapshot.isDragging
                        ? "border-blue-300 bg-white shadow-lg"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <CardHeader
                      className={cn("grid-rows-none", isActive && "border-b")}
                      {...provided.dragHandleProps}
                      onClick={onToggleActive}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          {...provided.dragHandleProps}
                          className="hover:text-primary cursor-grab transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="flex flex-1 items-center gap-3">
                          {isActive ? (
                            <ChevronDown className="text-primary h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}

                          <div className="flex-1 select-none">
                            <h3 className="font-semibold text-gray-900">
                              {card.title || "Untitled Card"}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {isActive && (
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr]">
                          <form.AppField
                            name={`${formName}.icon`}
                            children={(field) => (
                              <field.FormItem className="row-span-2 content-start justify-center">
                                <field.FormControl>
                                  <IconPicker
                                    asChild
                                    onIconSelect={(icon) =>
                                      field.handleChange(icon.name)
                                    }
                                  >
                                    <Button
                                      variant="outline"
                                      className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed p-0"
                                    >
                                      {field.state.value ? (
                                        <DynamicIcon
                                          iconName={field.state.value}
                                          key={field.state.value}
                                          className="size-10"
                                          fallbackClassName="size-10 text-gray-500"
                                        />
                                      ) : (
                                        <ImageIcon className="size-10 text-gray-500" />
                                      )}
                                    </Button>
                                  </IconPicker>
                                </field.FormControl>
                                <field.FormLabel className="justify-center text-sm">
                                  Set Icon
                                </field.FormLabel>
                                <field.FormMessage />
                              </field.FormItem>
                            )}
                          ></form.AppField>

                          <form.AppField
                            name={`${formName}.title`}
                            children={(field) => (
                              <field.FormItem>
                                <field.FormLabel>Card Title</field.FormLabel>
                                <field.FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Psychiatry Department"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                  />
                                </field.FormControl>
                                <field.FormMessage />
                              </field.FormItem>
                            )}
                          />

                          <form.AppField
                            name={`${formName}.description`}
                            children={(field) => (
                              <field.FormItem>
                                <field.FormLabel>Description</field.FormLabel>
                                <field.FormControl>
                                  <Textarea
                                    placeholder="Psychiatry Department"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    rows={2}
                                  />
                                </field.FormControl>
                                <field.FormMessage />
                              </field.FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}
            </Draggable>
          );
        }}
      />
    );
  },
});
