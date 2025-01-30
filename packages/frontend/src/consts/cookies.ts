import type { ZodTypeAny } from 'zod'
import { z } from 'zod'

/**
 * Known cookie definitions.
 */
export const knownCookies = {
  example: knownCookie('example', z.string(), 'example'),
} satisfies Record<string, KnownCookie>

/**
 * Helper function to define a known cookie. `satisfies` can't be used because it doesn't enforce type between schema and inferred type of default value.
 * @param key cookie name
 * @param schema cookie schema
 * @param defaultValue default value (required!)
 * @returns an object that can be used in `knownCookies` object
 */
function knownCookie<T extends ZodTypeAny = ZodTypeAny>(
  key: string,
  schema: T,
  defaultValue: z.infer<T>,
) {
  return { key, schema, defaultValue }
}

type KnownCookie<T extends ZodTypeAny = ZodTypeAny> = ReturnType<
  typeof knownCookie<T>
>

export type KnownCookieName = keyof typeof knownCookies
export type KnownCookieValue<T extends KnownCookieName> = z.infer<
  (typeof knownCookies)[T]['schema']
>
