import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { atom, useAtom } from "jotai";
import {
  ChevronDown,
  ChevronRight,
  Grid3X3,
  GripVertical,
  ImageIcon,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";

import { useState } from "react";

import { formOptions, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";

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
import { useAppForm, withForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/util/cn";

export const Route = createFileRoute("/admin/departments_/new")({
  component: RouteComponent,
});

export interface DepartmentCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  displayOrder: number;
  isExpanded: boolean;
}

export interface DepartmentSection {
  id: number;
  label: string;
  title: string;
  description: string;
  displayOrder: number;
  cards: DepartmentCard[];
  isExpanded: boolean;
}

export interface Department {
  title: string;
  icon: string;
  description: string;
  sections: DepartmentSection[];
}

const formOpts = formOptions({
  defaultValues: {
    title: "",
    icon: "",
    description: "",
    sections: [],
  } as {
    title: string;
    icon: string;
    description: string;
    sections: {
      id: number;
      label: string;
      title: string;
      description: string;
      displayOrder: number;
      new?: boolean;
      cards: {
        id: number;
        icon: string;
        title: string;
        description: string;
        displayOrder: number;
        new?: boolean;
      }[];
    }[];
  },
});

function RouteComponent() {
  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const [department, setDepartment] = useState<Department>({
    title: "",
    icon: "",
    description: "",
    sections: [],
  });

  const updateSections = (sections: DepartmentSection[]) => {
    setDepartment((prev) => ({ ...prev, sections }));
  };

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
        >
          <div className="container grid grid-cols-1 gap-6 px-0 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DepartmentDetails form={form} />
            </div>

            <div className="lg:col-span-2">
              <DepartmentSections
                sections={department.sections}
                onUpdate={updateSections}
              />
              <DepartmentSections2 form={form} />
            </div>
          </div>
        </AdminPageWrapper>
      </form>
    </form.AppForm>
  );
}

const activeSectionAtom = atom<string>();

const DepartmentDetails = withForm({
  ...formOpts,
  render: ({ form }) => {
    const sections = useStore(form.store, (store) => store.values.sections);

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
                          <span className="h-6 w-6">{field.state.value}</span>
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </Button>
                    </IconPicker>
                  </field.FormControl>
                  <field.FormLabel className="text-sm">
                    Set Icon
                  </field.FormLabel>
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

interface DepartmentSectionsProps {
  sections: DepartmentSection[];
  onUpdate: (sections: DepartmentSection[]) => void;
}

const DepartmentSections2 = withForm({
  ...formOpts,
  render: ({ form }) => {
    const sections = useStore(form.store, (store) => store.values.sections);
    const [activeSection, setActiveSection] = useState<number>();

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedSections = items.map((section, index) => ({
        ...section,
        displayOrder: index,
      }));

      form.setFieldValue("sections", updatedSections);
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Department Sections</CardTitle>
            <form.AppField
              name="sections"
              children={(field) => (
                <field.FormItem>
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
                </field.FormItem>
              )}
            />
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
              <Droppable droppableId="sections">
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
                          key={section.id}
                          form={form}
                          index={index}
                          isActive={section.id === activeSection}
                          onToggleActive={() => setActiveSection(activeSection)}
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
    );
  },
});

const SectionCard2 = withForm({
  ...formOpts,
  props: {} as { index: number; isActive: boolean; onToggleActive: () => void },
  render: ({ form, index, isActive, onToggleActive }) => {
    return (
      <form.AppField
        name={`sections[${index}]`}
        children={(field) => (
          <Draggable
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
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            )}
          </Draggable>
        )}
      />
    );
  },
});

const DepartmentSections = ({
  sections,
  onUpdate,
}: DepartmentSectionsProps) => {
  const addSection = () => {
    const newSection: DepartmentSection = {
      id: Date.now(),
      label: "",
      title: "",
      description: "",
      displayOrder: sections.length,
      cards: [],
      isExpanded: true,
    };

    // Collapse all other sections and add the new expanded one
    const updatedSections = sections.map((section) => ({
      ...section,
      isExpanded: false,
    }));

    onUpdate([...updatedSections, newSection]);
  };

  const updateSection = (
    sectionId: number,
    updates: Partial<DepartmentSection>,
  ) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section,
    );
    onUpdate(updatedSections);
  };

  const deleteSection = (sectionId: number) => {
    const updatedSections = sections
      .filter((section) => section.id !== sectionId)
      .map((section, index) => ({ ...section, displayOrder: index }));
    onUpdate(updatedSections);
  };

  const toggleExpanded = (sectionId: number) => {
    const updatedSections = sections.map((section) => ({
      ...section,
      isExpanded: section.id === sectionId ? !section.isExpanded : false,
    }));
    onUpdate(updatedSections);
  };

  const toggleCardExpanded = (sectionId: number, cardId: number) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      return {
        ...section,
        cards: section.cards.map((card) => ({
          ...card,
          isExpanded: card.id === cardId ? !card.isExpanded : false,
        })),
      };
    });
    onUpdate(updatedSections);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display orders
    const updatedSections = items.map((section, index) => ({
      ...section,
      displayOrder: index,
    }));

    onUpdate(updatedSections);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Department Sections</CardTitle>
          <Button onClick={addSection} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No sections created yet</p>
            <p className="text-sm">Click "Add Section" to get started</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {sections
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((section, index) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        index={index}
                        onUpdate={(updates) =>
                          updateSection(section.id, updates)
                        }
                        onDelete={() => deleteSection(section.id)}
                        onToggleExpanded={() => toggleExpanded(section.id)}
                        onToggleCardExpanded={toggleCardExpanded}
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
  );
};

interface SectionCardProps {
  section: DepartmentSection;
  index: number;
  onUpdate: (updates: Partial<DepartmentSection>) => void;
  onDelete: () => void;
  onToggleExpanded: () => void;
  onToggleCardExpanded: (sectionId: number, cardId: number) => void;
}

const SectionCard = ({
  section,
  index,
  onUpdate,
  onDelete,
  onToggleExpanded,
  onToggleCardExpanded,
}: SectionCardProps) => {
  const addCard = () => {
    const newCard: DepartmentCard = {
      id: Date.now(),
      icon: "",
      title: "",
      description: "",
      displayOrder: section.cards.length,
      isExpanded: true,
    };

    onUpdate({
      cards: [...section.cards, newCard],
    });
  };

  const updateCard = (cardId: number, updates: Partial<DepartmentCard>) => {
    const updatedCards = section.cards.map((card) =>
      card.id === cardId ? { ...card, ...updates } : card,
    );
    onUpdate({ cards: updatedCards });
  };

  const deleteCard = (cardId: number) => {
    const updatedCards = section.cards
      .filter((card) => card.id !== cardId)
      .map((card, idx) => ({ ...card, displayOrder: idx }));
    onUpdate({ cards: updatedCards });
  };

  const onCardDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(section.cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedCards = items.map((card, idx) => ({
      ...card,
      displayOrder: idx,
    }));

    onUpdate({ cards: updatedCards });
  };

  return (
    <Draggable draggableId={section.id.toString()} index={index}>
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
              section.isExpanded && "bg-muted/25",
            )}
          >
            <CardHeader
              className="grid-rows-none py-4"
              onClick={onToggleExpanded}
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
                  {section.isExpanded ? (
                    <ChevronDown className="text-primary h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}

                  <div className="flex-1 select-none">
                    {section.title || section.label ? (
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {section.title || "Untitled Section"}
                        </h3>
                        {section.label && (
                          <p className="text-sm text-gray-500">
                            {section.label}
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
                    {section.cards.length} cards
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {section.isExpanded && (
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`label-${section.id}`}>Short Label</Label>
                    <Input
                      id={`label-${section.id}`}
                      value={section.label}
                      onChange={(e) => onUpdate({ label: e.target.value })}
                      placeholder="e.g., Overview, Features"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                    <Input
                      id={`title-${section.id}`}
                      value={section.title}
                      onChange={(e) => onUpdate({ title: e.target.value })}
                      placeholder="Enter section title"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`desc-${section.id}`}>Description</Label>
                    <Textarea
                      id={`desc-${section.id}`}
                      value={section.description}
                      onChange={(e) =>
                        onUpdate({ description: e.target.value })
                      }
                      placeholder="Enter section description"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Section Cards</h4>
                    <Button
                      onClick={addCard}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Card
                    </Button>
                  </div>

                  <div className="pb-6">
                    {section.cards.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-gray-500">
                        <Grid3X3 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p className="text-sm">No cards in this section</p>
                      </div>
                    ) : (
                      <DragDropContext onDragEnd={onCardDragEnd}>
                        <Droppable droppableId={`cards-${section.id}`}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-3"
                            >
                              {section.cards
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((card, cardIndex) => (
                                  <CardItem
                                    key={card.id}
                                    card={card}
                                    index={cardIndex}
                                    onUpdate={(updates) =>
                                      updateCard(card.id, updates)
                                    }
                                    onDelete={() => deleteCard(card.id)}
                                    onToggleExpanded={() =>
                                      onToggleCardExpanded(section.id, card.id)
                                    }
                                  />
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};

interface CardItemProps {
  card: DepartmentCard;
  index: number;
  onUpdate: (updates: Partial<DepartmentCard>) => void;
  onDelete: () => void;
  onToggleExpanded: () => void;
}

const CardItem = ({
  card,
  index,
  onUpdate,
  onDelete,
  onToggleExpanded,
}: CardItemProps) => {
  return (
    <Draggable draggableId={card.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-all duration-200 ${
            snapshot.isDragging ? "z-50 scale-105 rotate-1 shadow-lg" : ""
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
              className="grid-rows-none"
              {...provided.dragHandleProps}
              onClick={onToggleExpanded}
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
                  {card.isExpanded ? (
                    <ChevronDown className="text-primary h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}

                  <div className="flex-1 select-none">
                    <h3 className="font-semibold text-gray-900">
                      {card.title || "Untitled Section"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {card.isExpanded && (
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    {...provided.dragHandleProps}
                    className="mt-1 cursor-grab transition-colors hover:text-blue-600"
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`card-title-${card.id}`}>
                          Card Title
                        </Label>
                        <Input
                          id={`card-title-${card.id}`}
                          value={card.title}
                          onChange={(e) => onUpdate({ title: e.target.value })}
                          placeholder="Enter card title"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`card-icon-${card.id}`}>Icon</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            console.log(
                              "Card icon selection will be handled by user",
                            );
                          }}
                        >
                          <ImageIcon className="mr-2 h-3 w-3" />
                          {card.icon ? `Selected: ${card.icon}` : "Set Icon"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`card-desc-${card.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`card-desc-${card.id}`}
                        value={card.description}
                        onChange={(e) =>
                          onUpdate({ description: e.target.value })
                        }
                        placeholder="Enter card description"
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="mt-1 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};
