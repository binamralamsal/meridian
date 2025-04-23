import { Slot } from "@radix-ui/react-slot";

import { ComponentProps, createContext, useContext, useId } from "react";

import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";

import { Button } from "./button";
import { Label } from "./label";

import { cn } from "@/util/cn";

const {
  fieldContext,
  formContext,
  useFieldContext: _useFieldContext,
  useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem,
  },
  formComponents: { Button },
});

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ...props }: ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function useFieldContext() {
  const { id } = useContext(FormItemContext);
  const { name, store, getMeta, ...fieldContext } = _useFieldContext();

  const { isTouched } = getMeta();

  const errors = useStore(store, (state) => state.meta.errors);
  if (!fieldContext) {
    throw new Error("useFieldContext should be used within <FormItem>");
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    store,
    getMeta,
    shouldShowError: isTouched && !!errors.length,
    ...fieldContext,
  };
}

function FormLabel({ className, ...props }: ComponentProps<typeof Label>) {
  const { formItemId, shouldShowError } = useFieldContext();

  return (
    <Label
      data-slot="form-label"
      data-error={shouldShowError}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const {
    errors,
    formItemId,
    formDescriptionId,
    formMessageId,
    shouldShowError,
  } = useFieldContext();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !errors.length
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={shouldShowError}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFieldContext();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { errors, formMessageId, shouldShowError } = useFieldContext();
  const body = errors.length
    ? String(errors.at(0)?.message ?? "")
    : props.children;

  if (!body || !shouldShowError) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { useAppForm, useFormContext, useFieldContext, withForm };
