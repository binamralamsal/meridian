import { Check, PlusCircle } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Column } from "@tanstack/react-table";

import { FiltersOptionsType } from "./data-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/util/cn";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FiltersOptionsType[];
}

function areSetsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();

  const [selectedValues, setSelectedValues] = useState(() => {
    const filteredValues = column?.getFilterValue() as string[];

    return new Set(filteredValues);
  });

  const navigate = useNavigate();

  const searchParams = useSearch({
    strict: false,
  });

  useEffect(() => {
    // @ts-expect-error -- ignore this
    const values = searchParams[column.id] as string[];
    if (!Array.isArray(values)) return;

    const newSet = new Set(values);
    if (!areSetsEqual(selectedValues, newSet)) setSelectedValues(newSet);
    setSelectedValues(new Set(values));
  }, [searchParams]);

  useEffect(() => {
    if (!column) return;

    const filterValues = Array.from(selectedValues);
    column.setFilterValue(filterValues.length ? filterValues : undefined);

    navigate({
      to: ".",
      search: (prev) => {
        return {
          ...prev,
          [column.id]:
            selectedValues.size === 0 ? undefined : Array.from(selectedValues),
        };
      },
    });
  }, [selectedValues]);

  function handleFilterItemChange(option: FiltersOptionsType) {
    if (!column) return;
    const newSelectedValues = new Set(selectedValues);
    const isSelected = newSelectedValues.has(option.value);

    if (isSelected) {
      newSelectedValues.delete(option.value);
    } else {
      newSelectedValues.add(option.value);
    }

    setSelectedValues(newSelectedValues);
  }

  function handleClearFilters() {
    if (!column) return;

    setSelectedValues(new Set());
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleFilterItemChange(option)}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearFilters}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
