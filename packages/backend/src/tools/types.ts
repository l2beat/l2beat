import { branded } from '@l2beat/shared'
import { z } from 'zod'

export function stringAsInt(fallback?: number) {
  return z.preprocess((s) => {
    const res = z.string().safeParse(s)
    return res.success && s !== '' ? Number(res.data) : fallback
  }, z.number().int())
}

export function stringAs<T>(Brand: (s: string) => T) {
  return branded(z.string(), Brand)
}

export function numberAs<T>(Brand: (n: number) => T) {
  return branded(z.number(), Brand)
}
