import { z } from 'zod/v4'

declare const __brand: unique symbol
type Brand<B> = { [__brand]: B }
export type Branded<T, B> = T & Brand<B>

export function branded<B extends z.ZodTypeAny, R>(
  base: B,
  Brand: (v: z.infer<B>) => R,
) {
  return base.transform((v, ctx) => {
    try {
      return Brand(v)
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Failed to transform to ${Brand.name}`,
      })
      return v as R
    }
  })
}

export function stringAs<T>(Brand: (s: string) => T) {
  return branded(z.string(), Brand)
}

export function numberAs<T>(Brand: (n: number) => T) {
  return branded(z.number(), Brand)
}

export function stringAsInt(fallback?: number) {
  return z.preprocess((s) => {
    const res = z.string().safeParse(s)
    return res.success && s !== '' ? Number(res.data) : fallback
  }, z.number().int())
}

export function stringAsBoolean(fallback?: boolean) {
  return z.preprocess((s) => {
    const res = z.enum(['true', 'false', '1', '0']).safeParse(s)
    return res.success ? ['true', '1'].includes(res.data) : fallback
  }, z.boolean())
}
