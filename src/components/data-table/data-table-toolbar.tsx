import { SearchIcon } from "lucide-react";

import { FormEvent, Fragment, useEffect, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FiltersType } from "./data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dataKey?: string;
  filters?: FiltersType[];
}

export function DataTableToolbar<TData>({
  table,
  dataKey = "data",
  filters,
}: DataTableToolbarProps<TData>) {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const searchQuery = useSearch({
    strict: false,
    select: (state) => state.search,
  });

  useEffect(() => {
    setQuery(searchQuery ? searchQuery : "");
  }, [searchQuery]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    navigate({
      to: ".",
      search: (prev) => {
        return { ...prev, search: query ? query : undefined };
      },
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <form
          className="flex flex-1 items-center space-x-2"
          onSubmit={handleSearchSubmit}
        >
          <Input
            placeholder={`Search ${dataKey}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-[150px] lg:w-[350px]"
          />
          <Button size="icon">
            <SearchIcon />
          </Button>
        </form>

        {filters?.map((filter) => (
          <Fragment key={filter.accessorKey}>
            {table.getColumn(filter.accessorKey) && (
              <DataTableFacetedFilter
                column={table.getColumn(filter.accessorKey)}
                title={filter.title}
                options={filter.options}
              />
            )}
          </Fragment>
        ))}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
