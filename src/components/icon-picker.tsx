import { Slot } from "@radix-ui/react-slot";
import { Loader2Icon, Search, XIcon } from "lucide-react";

import {
  ComponentProps,
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const loadIcons = () =>
  import("@/components/lucide-icons-list").then(
    (module) => module.AVAILABLE_ICONS,
  );

type IconType = React.ComponentType<{ className: string }>;

interface IconPickerProps {
  onIconSelect?: (icon: { name: string; component: IconType }) => void;
  asChild?: boolean;
}

export const IconItem = memo(
  ({
    icon,
    onSelect,
  }: {
    icon: {
      name: string;
      component: IconType;
      tags: string[];
    };
    onSelect: (icon: { name: string; component: IconType }) => void;
  }) => {
    const IconComponent = icon.component;

    return (
      <Button
        variant="ghost"
        className="hover:bg-muted h-16 w-16 flex-col gap-1 p-2"
        onClick={() => onSelect({ name: icon.name, component: icon.component })}
        title={`${icon.name} - ${icon.tags.join(", ")}`}
      >
        <Suspense
          fallback={
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          }
        >
          <IconComponent className="h-6 w-6" />
        </Suspense>
        <span className="w-full truncate text-xs">{icon.name}</span>
      </Button>
    );
  },
);

IconItem.displayName = "IconItem";

export default function IconPicker({
  onIconSelect,
  asChild = false,
  ...props
}: IconPickerProps & ComponentProps<typeof Button>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [icons, setIcons] = useState<
    Array<{
      name: string;
      component: IconType;
      tags: string[];
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && icons.length === 0) {
      setIsLoading(true);
      loadIcons()
        .then((loadedIcons) => {
          setIcons(loadedIcons);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, icons.length]);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return icons;

    const query = searchQuery.toLowerCase();
    return icons.filter((icon) => {
      if (icon.name.toLowerCase().includes(query)) return true;

      return icon.tags.some((tag) => tag.toLowerCase().includes(query));
    });
  }, [icons, searchQuery]);

  const ITEMS_PER_ROW = 6;
  const ITEM_HEIGHT = 80;

  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredIcons.length; i += ITEMS_PER_ROW) {
      result.push(filteredIcons.slice(i, i + ITEMS_PER_ROW));
    }
    return result;
  }, [filteredIcons]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  // I don't know what it does but it fixes my issue.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        virtualizer.measure();
      }, 0);
    }
  }, [isOpen]);

  const handleIconSelect = (icon: { name: string; component: IconType }) => {
    onIconSelect?.(icon);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (virtualizer) {
      virtualizer.scrollToIndex(0);
    }
  };

  const Component = asChild ? Slot : Button;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Component {...props} />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search icons by name or tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pr-10 pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0"
                onClick={() => setSearchQuery("")}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isLoading && (
            <div className="flex h-96 items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading icons...</span>
            </div>
          )}

          {!isLoading && (
            <div
              ref={parentRef}
              className="h-96 overflow-auto rounded-md border"
              style={{ contain: "strict" }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  if (!row) return null;

                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="grid grid-cols-6 gap-2 p-2">
                        {row.map((icon, colIndex) => (
                          <IconItem
                            key={`${virtualRow.index}-${colIndex}`}
                            icon={icon}
                            onSelect={handleIconSelect}
                          />
                        ))}
                        {row.length < ITEMS_PER_ROW &&
                          Array.from({
                            length: ITEMS_PER_ROW - row.length,
                          }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-16 w-16" />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && !isLoading && (
                <div className="text-muted-foreground flex h-32 items-center justify-center">
                  No icons found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}

          {!isLoading && filteredIcons.length > 0 && (
            <div className="text-muted-foreground text-center text-sm">
              Showing {filteredIcons.length} of {icons.length} icons
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
