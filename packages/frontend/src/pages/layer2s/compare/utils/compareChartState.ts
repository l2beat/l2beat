import {
  type ChartRangeOptionValue,
  rangeToOption,
} from '~/components/core/chart/utils/rangeToOption'
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

/**
 * The configuration of a single chart card: its metric plus every per-metric
 * control. Controls of inactive metrics are kept so switching a card's
 * metric back and forth preserves its settings; only the active metric's
 * controls are encoded in the URL, by that metric's `urlControls` codec in
 * `COMPARE_METRIC_DEFS`.
 */
export interface CompareChartConfig {
  metric: CompareMetricId
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

/** The per-metric controls of a chart card, without the metric itself. */
export type CompareChartControls = Omit<CompareChartConfig, 'metric'>

export interface CompareChartState {
  /** Project slugs in selection order, shared by every chart. */
  projects: string[]
  /** Time range shared by every chart, so synced hovers line up. */
  range: CompareRange
  /** One entry per chart card, in display order. Never empty. */
  charts: CompareChartConfig[]
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
export const MAX_COMPARE_CHARTS = 4
export const DEFAULT_COMPARE_RANGE: CompareRangeOption = '1y'
export const DEFAULT_COMPARE_ACTIVITY_UNIT: CompareActivityUnit = 'uops'
export const DEFAULT_COMPARE_TVS_UNIT: CompareTvsUnit = 'usd'
export const DEFAULT_COMPARE_TVS_FILTER: CompareTvsFilter = 'all'
export const DEFAULT_COMPARE_COSTS_UNIT: CompareCostsUnit = 'usd'
// The TVS control defaults match the /layer2s/tvs page so the default
// comparison reproduces the numbers shown there.
export const DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS = false
export const DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS = true
export const DEFAULT_COMPARE_PROJECTS_COUNT = 5

export function createDefaultChartConfig(
  metric: CompareMetricId = DEFAULT_COMPARE_METRIC,
): CompareChartConfig {
  return {
    metric,
    activityUnit: DEFAULT_COMPARE_ACTIVITY_UNIT,
    tvsUnit: DEFAULT_COMPARE_TVS_UNIT,
    tvsFilter: DEFAULT_COMPARE_TVS_FILTER,
    costsUnit: DEFAULT_COMPARE_COSTS_UNIT,
    excludeAssociatedTokens: DEFAULT_COMPARE_EXCLUDE_ASSOCIATED_TOKENS,
    excludeRwaRestrictedTokens: DEFAULT_COMPARE_EXCLUDE_RWA_RESTRICTED_TOKENS,
  }
}

/**
 * The metric of a newly added chart: the first one not shown yet, so adding
 * a chart to the default TVS view gives TVS + activity without any clicks.
 */
export function nextChartMetric(charts: CompareChartConfig[]): CompareMetricId {
  const used = new Set(charts.map((chart) => chart.metric))
  return (
    COMPARE_METRIC_IDS.find((metric) => !used.has(metric)) ??
    DEFAULT_COMPARE_METRIC
  )
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
