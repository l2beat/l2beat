/**
 * Order of the per-project values in `ProjectTvsChartDataPoint`. The single
 * source of truth for the server serializer and the client's index lookups,
 * so adding or reordering a value can't silently shift indexes. Kept free of
 * server imports because chart components import it at runtime.
 */
export const PROJECT_TVS_CHART_VALUE_KEYS = [
  'value',
  'canonical',
  'external',
  'native',
  'ether',
  'stablecoin',
  'btc',
  'rwaRestricted',
  'rwaPublic',
  'other',
] as const

export type ProjectTvsChartValueKey =
  (typeof PROJECT_TVS_CHART_VALUE_KEYS)[number]

// Generic so the mapped type stays a tuple (the array special case only
// applies to homomorphic mappings over a type parameter).
type SameLengthNumberTuple<Keys extends readonly unknown[]> = {
  -readonly [K in keyof Keys]: number
}

/** One number per entry of `PROJECT_TVS_CHART_VALUE_KEYS`, in that order. */
export type ProjectTvsChartDataPoint = SameLengthNumberTuple<
  typeof PROJECT_TVS_CHART_VALUE_KEYS
>
