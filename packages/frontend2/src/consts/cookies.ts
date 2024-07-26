import { type z, type ZodTypeAny } from 'zod'
import { TvlChartRange } from '~/server/features/tvl/range-utils'

/**
 * Known cookie definitions.
 */
export const knownCookies = {
  // Chart range used for preloads.
  chartRange: knownCookie('chart-range', TvlChartRange, '1y'),
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

export type KnownCookie<T extends ZodTypeAny = ZodTypeAny> = ReturnType<
  typeof knownCookie<T>
>

export type KnownCookieName = keyof typeof knownCookies
export type KnownCookieValue<T extends KnownCookieName> = z.infer<
  (typeof knownCookies)[T]['schema']
>
