import { z } from "zod";

import { useForm } from "@tanstack/react-form";

const dataSchema = z.object({
  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .default("draft"),
});

export function Component() {
  const form = useForm({
    defaultValues: { status: "draft" },
    validators: {
      onChange: dataSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  console.log(form);
}
