import { EyeIcon, EyeOffIcon } from "lucide-react";

import { ComponentProps, useState } from "react";

import { Input } from "./input";

import { cn } from "@/util/cn";

export function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="relative">
      <Input
        className={cn("pe-9", className)}
        type={isVisible ? "text" : "password"}
        {...props}
      />
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <EyeOffIcon size={16} aria-hidden="true" />
        ) : (
          <EyeIcon size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
