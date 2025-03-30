import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_main/")({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["value"],
      queryFn: testServerfn,
    });
  },
});

function Home() {
  const valueQuery = useSuspenseQuery({
    queryKey: ["value"],
    queryFn: testServerfn,
  });

  const queryClient = useQueryClient();

  return (
    <div>
      <p>Value: {valueQuery.data.value}</p>
      <Button
        onClick={async () => {
          await queryClient.invalidateQueries({ queryKey: ["value"] });
        }}
      >
        Refetch
      </Button>
    </div>
  );
}

const testServerfn = createServerFn().handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { value: Math.random() };
});
