import { z } from 'zod'

export function branded<B extends z.ZodTypeAny, R>(
  baseParser: B,
  Brand: (b: z.infer<B>) => R,
): z.ZodType<R> {
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

export function stringAs<T>(
  Brand: (s: string) => T,
): z.ZodType<T, z.ZodTypeDef, T> {
  return branded(z.string(), Brand)
}

export function stringAsInt(
  fallback?: number,
): z.ZodEffects<z.ZodNumber, number, unknown> {
  return z.preprocess((s) => {
    const res = z.string().safeParse(s)
    return res.success && s !== '' ? Number(res.data) : fallback
  }, z.number().int())
}
