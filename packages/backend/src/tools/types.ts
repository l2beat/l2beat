import { z } from 'zod'

export function stringAsInt(fallback?: number) {
  return z.preprocess((s) => {
    const res = z.string().safeParse(s)
    return res.success && s !== '' ? Number(res.data) : fallback
  }, z.number().int())
}

export function branded<T extends z.ZodTypeAny, B>(
  schema: T,
  Brand: (t: z.TypeOf<T>) => B,
) {
  return schema
    .refine((s: T) => {
      try {
        Brand(s)
        return true
      } catch {
        return false
      }
    })
    .transform(Brand)
}

export function stringAs<T>(Brand: (s: string) => T) {
  return branded(z.string(), Brand)
}

export function numberAs<T>(Brand: (n: number) => T) {
  return branded(z.number(), Brand)
}
