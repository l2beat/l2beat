import { type ZodTypeAny, z } from 'zod'
import { TvlChartRange } from '~/server/features/tvl/range-utils'

/**
 * Known cookie definitions.
 */
export const knownCookies = {
  // Chart range used for preloads.
  scalingSummaryChartRange: knownCookie(
    'scaling-summary-chart-range',
    TvlChartRange,
    '1y',
  ),
  scalingSummaryChartType: knownCookie(
    'scaling-summary-chart-type',
    z.object({ type: z.literal('layer2') }).or(
      z.object({
        type: z.literal('projects'),
        projectIds: z.array(z.string()),
      }),
    ),
    {
      type: 'layer2',
    },
  ),
  scalingSummaryExcludeAssociatedTokens: knownCookie(
    'scaling-summary-exclude-associated-tokens',
    z.boolean(),
    false,
  ),
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
