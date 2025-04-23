"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useRouter } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const zodSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

export function LoginForm({ redirectUrl }: { redirectUrl?: string }) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: zodSchema,
      onBlur: zodSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      const response = { status: "a", message: "Login successful" };

      if (response.status === "SUCCESS") {
        toast.success(response.message);
        router.navigate({
          href: redirectUrl || "/",
        });
      } else {
        toast.error(response.message);
      }
    },
  });

  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <form.AppField
                    name="email"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Email</field.FormLabel>
                        <field.FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
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
                    name="password"
                    children={(field) => (
                      <field.FormItem>
                        <div className="flex items-center">
                          <field.FormLabel>Password</field.FormLabel>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <field.FormControl>
                          <Input
                            type="password"
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

                  <form.Button type="submit" className="w-full">
                    Login
                  </form.Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
