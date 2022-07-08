import { z } from 'zod'

export function stringAs<T>(Brand: (s: string) => T) {
  return z
    .string()
    .refine((s) => {
      try {
        Brand(s)
        return true
      } catch {
        return false
      }
    })
    .transform(Brand)
}
