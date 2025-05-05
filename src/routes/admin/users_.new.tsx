import { LoaderCircleIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { AdminPageWrapper } from "@/components/admin-page-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm, useFormContext } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/users_/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },

    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <AdminPageWrapper
          breadcrumbs={[{ label: "Users", href: "/admin/users" }]}
          pageTitle="Add New User"
          rightSideContent={<ActionButtons />}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add User</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="Name"
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
                  name="role"
                  children={(field) => (
                    <field.FormItem className="md:col-span-2 lg:col-auto">
                      <field.FormLabel>Role</field.FormLabel>
                      <field.FormControl>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value)}
                        >
                          <SelectTrigger
                            aria-label="Select role"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Normal User</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </field.FormControl>
                      <field.FormMessage />
                      <field.FormDescription>
                        Admins can access the admin panel, and do whatever they
                        want.
                      </field.FormDescription>
                    </field.FormItem>
                  )}
                />
              </div>
              <div className="grid items-start gap-6 md:grid-cols-2">
                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Password</field.FormLabel>
                      <field.FormControl>
                        <PasswordInput
                          placeholder="********"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                      <field.FormDescription>
                        Enter a suitable password with at least 8 characters,
                        one number, one uppercase letter, and one symbol.
                      </field.FormDescription>
                    </field.FormItem>
                  )}
                />
                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Confirm Password</field.FormLabel>
                      <field.FormControl>
                        <PasswordInput
                          placeholder="********"
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
              </div>
            </CardContent>
          </Card>
        </AdminPageWrapper>
      </form>
    </form.AppForm>
  );
}

function ActionButtons() {
  const {
    state: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Button variant="outline" size="sm" type="button" asChild>
        <Link to="/admin/users">Discard</Link>
      </Button>
      <Button size="sm" type="submit" disabled={isSubmitting}>
        {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
        <span>Add User</span>
      </Button>
    </>
  );
}
