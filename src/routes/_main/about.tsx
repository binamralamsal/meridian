import { createFileRoute } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_main/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={""} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
