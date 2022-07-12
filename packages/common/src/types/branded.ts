import { z } from 'zod'

export function branded<B extends z.ZodTypeAny, R>(
  baseParser: B,
  Brand: (b: z.infer<B>) => R,
) {
  return baseParser
    .refine((a: z.infer<B>) => {
      try {
        Brand(a)
        return true
      } catch {
        return false
      }
    })
    .transform(Brand)
}
