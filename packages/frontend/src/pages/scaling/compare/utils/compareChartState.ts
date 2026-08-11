import type { ChartScale } from '~/components/chart/types'
import {
  type ChartRangeOptionValue,
  rangeToOption,
} from '~/components/core/chart/ChartRangeControls'
import { type ChartRange, optionToRange } from '~/utils/range/range'

export const COMPARE_METRIC_IDS = [
  'tvs',
  'activity',
  'costs',
  'data-posted',
] as const
export type CompareMetricId = (typeof COMPARE_METRIC_IDS)[number]

export const COMPARE_ACTIVITY_UNITS = ['uops', 'tps'] as const
export type CompareActivityUnit = (typeof COMPARE_ACTIVITY_UNITS)[number]

export const COMPARE_TVS_UNITS = ['usd', 'eth'] as const
export type CompareTvsUnit = (typeof COMPARE_TVS_UNITS)[number]

export const COMPARE_TVS_BRIDGE_TYPES = [
  'canonical',
  'native',
  'external',
] as const
export type CompareTvsBridgeType = (typeof COMPARE_TVS_BRIDGE_TYPES)[number]

export const COMPARE_TVS_ASSET_CATEGORIES = [
  'ether',
  'stablecoin',
  'btc',
  'rwaPublic',
  'rwaRestricted',
  'other',
] as const
export type CompareTvsAssetCategory =
  (typeof COMPARE_TVS_ASSET_CATEGORIES)[number]

/**
 * The TVS component filter, restricting the compared value to a single
 * component of the split. A single field rather than one field per grouping:
 * the data carries the two groupings (bridge type and asset category) as
 * independent axes with no cross-product, so only one grouping can be
 * non-"all" at a time.
 */
export const COMPARE_TVS_FILTERS = [
  'all',
  ...COMPARE_TVS_BRIDGE_TYPES,
  ...COMPARE_TVS_ASSET_CATEGORIES,
] as const
export type CompareTvsFilter = (typeof COMPARE_TVS_FILTERS)[number]

export const COMPARE_COSTS_UNITS = ['usd', 'eth', 'gas'] as const
export type CompareCostsUnit = (typeof COMPARE_COSTS_UNITS)[number]

export const COMPARE_VIEW_MODES = ['absolute', 'indexed'] as const
export type CompareViewMode = (typeof COMPARE_VIEW_MODES)[number]

export const COMPARE_RANGE_OPTIONS = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const satisfies readonly ChartRangeOptionValue[]
export type CompareRangeOption = (typeof COMPARE_RANGE_OPTIONS)[number]

/** A predefined range option or a custom calendar range in unix seconds. */
export type CompareRange = CompareRangeOption | { from: number; to: number }

export interface CompareChartState {
  metric: CompareMetricId
  /** Project slugs in selection order. */
  projects: string[]
  range: CompareRange
  scale: ChartScale
  /** Absolute values or every series rebased to 100 at range start. */
  mode: CompareViewMode
  /** Per-metric control of the activity metric; ignored elsewhere. */
  activityUnit: CompareActivityUnit
  /** Per-metric controls of the TVS metric; ignored elsewhere. */
  tvsUnit: CompareTvsUnit
  tvsFilter: CompareTvsFilter
  /** Per-metric control of the costs metric; ignored elsewhere. */
  costsUnit: CompareCostsUnit
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
}

/**
 * The client-side chart state: identical to `CompareChartState` except the
 * range is always resolved to concrete timestamps, so there is a single
 * source of truth for what the chart queries.
 */
export type CompareClientState = Omit<CompareChartState, 'range'> & {
  chartRange: ChartRange
}

export function toCompareUrlState({
  chartRange,
  ...state
}: CompareClientState): CompareChartState {
  return { ...state, range: chartRangeToCompareRange(chartRange) }
}

export function toCompareClientState(
  { range, ...state }: CompareChartState,
  chartRange: ChartRange = compareRangeToChartRange(range),
): CompareClientState {
  return { ...state, chartRange }
}

export const DEFAULT_COMPARE_METRIC: CompareMetricId = 'tvs'
export const DEFAULT_COMPARE_RANGE: CompareRangeOption = '1y'
export const DEFAULT_COMPARE_SCALE: ChartScale = 'linear'
export const DEFAULT_COMPARE_VIEW_MODE: CompareViewMode = 'absolute'
export const DEFAULT_COMPARE_ACTIVITY_UNIT: CompareActivityUnit = 'uops'
export const DEFAULT_COMPARE_TVS_UNIT: CompareTvsUnit = 'usd'
export const DEFAULT_COMPARE_TVS_FILTER: CompareTvsFilter = 'all'
export const DEFAULT_COMPARE_COSTS_UNIT: CompareCostsUnit = 'usd'
// The TVS control defaults match the /scaling/tvs page so the default
// comparison reproduces the numbers shown there.
export const DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS = false
export const DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS = true
export const MAX_COMPARE_PROJECTS = 10
export const DEFAULT_COMPARE_PROJECTS_COUNT = 5

/**
 * The exclude-restricted-RWA toggle conflicts with the Restricted RWAs
 * filter: combined they would render an all-zero chart. While that filter is
 * active the toggle is disabled and overridden to false; the stored value is
 * kept so switching the filter away restores the user's choice.
 */
export function effectiveExcludeRwaRestrictedTokens(state: {
  tvsFilter: CompareTvsFilter
  excludeRwaRestrictedTokens: boolean
}): boolean {
  return state.tvsFilter === 'rwaRestricted'
    ? false
    : state.excludeRwaRestrictedTokens
}

export function compareRangeToChartRange(range: CompareRange): ChartRange {
  if (typeof range === 'string') {
    return optionToRange(range)
  }
  return [range.from, range.to]
}

/**
 * Maps a resolved chart range back to its URL representation, reusing the
 * predefined-option detection of `ChartRangeControls` so the URL always
 * matches the highlighted control.
 */
export function chartRangeToCompareRange([from, to]: ChartRange): CompareRange {
  if (from === null) return 'max'
  const option = rangeToOption([from, to], COMPARE_RANGE_OPTIONS)
  return option === 'custom' ? { from, to } : option
}
