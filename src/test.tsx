import { z } from "zod";

import { useForm } from "@tanstack/react-form";

const dataSchema = z.object({
  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .default("draft"),
});

type FormValues = z.infer<typeof dataSchema>;

export function Component() {
  const defaultValues: FormValues = {
    status: undefined,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onChange: dataSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  console.log(form);
}
