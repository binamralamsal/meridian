import { ZodEffects, ZodSchema, z } from "zod";

export function coerceToNumberSchema<T extends ZodSchema>(toSchema: T) {
  return z.preprocess((val) => {
    if (typeof val === "string" && !isNaN(+val)) {
      if (!val.trim()) return undefined;
      return +val;
    }
    return val;
  }, toSchema) as ZodEffects<T, z.infer<T>, z.input<T> | string>;
}
