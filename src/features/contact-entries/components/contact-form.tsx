import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  ContactEntrySchema,
  contactEntrySchema,
} from "../contact-entries.schema";
import { newContactEntryFn } from "../server/functions/contact";

import { FormNavigationBlocker } from "@/components/form-navigation-blocker";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      phone: "",
    } as ContactEntrySchema,
    validators: {
      onChange: contactEntrySchema,
    },
    onSubmit: async ({ value }) => {
      const response = await newContactEntryFn({ data: value });
      if (response.status === "SUCCESS") {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },
  });

  return (
    <form.AppForm>
      <FormNavigationBlocker />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.AppField
          name="name"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Full Name</field.FormLabel>
              <field.FormControl>
                <Input
                  type="text"
                  placeholder="John Smith"
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
          name="email"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Email</field.FormLabel>
              <field.FormControl>
                <Input
                  type="email"
                  placeholder="email@website.com"
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
          name="phone"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Phone</field.FormLabel>
              <field.FormControl>
                <Input
                  type="text"
                  placeholder="98XXXXXXXX"
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
          name="message"
          children={(field) => (
            <field.FormItem>
              <field.FormLabel>Message</field.FormLabel>
              <field.FormControl>
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={5}
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={form.state.isSubmitting}
        >
          {form.state.isSubmitting ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </form.AppForm>
  );
}
