import { ZodEffects, ZodSchema, z } from "zod";

export function emptyStringAsOptionalSchema<T extends ZodSchema>(toSchema: T) {
  return z.preprocess((val) => {
    if (typeof val === "string" && val.trim().length === 0) {
      return undefined;
    }
    return val;
  }, toSchema) as ZodEffects<T, z.infer<T>, z.input<T> | string>;
}
