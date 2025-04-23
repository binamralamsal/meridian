import { z } from "zod";

import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/features/auth/components/login-form";

export const Route = createFileRoute("/_main/login")({
  component: RouteComponent,
  validateSearch: z.object({
    redirect_url: z.string().startsWith("/").optional().catch(undefined),
  }),
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          NBU Bags
        </a>
        <LoginForm redirectUrl={searchParams.redirect_url} />
      </div>
    </div>
  );
}
