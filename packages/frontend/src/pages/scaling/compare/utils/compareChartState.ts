import { UnixTime } from '@l2beat/shared-pure'
import type { ChartScale } from '~/components/chart/types'
import type { ChartRangeOptionValue } from '~/components/core/chart/ChartRangeControls'
import {
  type ChartRange,
  optionToDays,
  optionToRange,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const COMPARE_METRIC_IDS = ['tvs', 'activity', 'costs'] as const
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

/**
 * The TVS component filter, restricting the compared value to a single
 * component of the split. A single field rather than one field per grouping:
 * the data carries the groupings as independent axes with no cross-product
 * (bridge type now, asset category later), so only one grouping can be
 * non-"all" at a time.
 */
export const COMPARE_TVS_FILTERS = ['all', ...COMPARE_TVS_BRIDGE_TYPES] as const
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
export interface CompareClientState {
  metric: CompareMetricId
  projects: string[]
  scale: ChartScale
  mode: CompareViewMode
  activityUnit: CompareActivityUnit
  tvsUnit: CompareTvsUnit
  tvsFilter: CompareTvsFilter
  costsUnit: CompareCostsUnit
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
  chartRange: ChartRange
}

export function toCompareUrlState(
  state: CompareClientState,
): CompareChartState {
  return {
    metric: state.metric,
    projects: state.projects,
    scale: state.scale,
    mode: state.mode,
    activityUnit: state.activityUnit,
    tvsUnit: state.tvsUnit,
    tvsFilter: state.tvsFilter,
    costsUnit: state.costsUnit,
    excludeAssociatedTokens: state.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: state.excludeRwaRestrictedTokens,
    range: chartRangeToCompareRange(state.chartRange),
  }
}

export function toCompareClientState(
  state: CompareChartState,
  chartRange: ChartRange = compareRangeToChartRange(state.range),
): CompareClientState {
  return {
    metric: state.metric,
    projects: state.projects,
    scale: state.scale,
    mode: state.mode,
    activityUnit: state.activityUnit,
    tvsUnit: state.tvsUnit,
    tvsFilter: state.tvsFilter,
    costsUnit: state.costsUnit,
    excludeAssociatedTokens: state.excludeAssociatedTokens,
    excludeRwaRestrictedTokens: state.excludeRwaRestrictedTokens,
    chartRange,
  }
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

export function compareRangeToChartRange(range: CompareRange): ChartRange {
  if (typeof range === 'string') {
    return optionToRange(range)
  }
  return [range.from, range.to]
}

/**
 * Maps a resolved chart range back to its URL representation. Mirrors the
 * predefined-option detection of `ChartRangeControls` so the URL matches the
 * highlighted control.
 */
export function chartRangeToCompareRange([from, to]: ChartRange): CompareRange {
  if (from === null) return 'max'
  if (
    UnixTime.toStartOf(to, 'day') === UnixTime.toStartOf(UnixTime.now(), 'day')
  ) {
    const days = rangeToDays([from, to])
    const option = COMPARE_RANGE_OPTIONS.find(
      (option) => optionToDays(option) === days,
    )
    if (option) return option
  }
  return { from, to }
}

export function isSameCompareState(
  left: CompareChartState,
  right: CompareChartState,
): boolean {
  return (
    left.metric === right.metric &&
    left.mode === right.mode &&
    // The scale toggle is hidden in indexed mode, so two states that differ
    // solely by a hidden scale map to the same URL.
    (left.mode === 'indexed' || left.scale === right.scale) &&
    // Per-metric controls are only encoded for the metric they belong to,
    // so two states that differ solely by a hidden control map to the same
    // URL.
    (left.metric !== 'activity' || left.activityUnit === right.activityUnit) &&
    (left.metric !== 'costs' || left.costsUnit === right.costsUnit) &&
    (left.metric !== 'tvs' ||
      (left.tvsUnit === right.tvsUnit &&
        left.tvsFilter === right.tvsFilter &&
        left.excludeAssociatedTokens === right.excludeAssociatedTokens &&
        left.excludeRwaRestrictedTokens ===
          right.excludeRwaRestrictedTokens)) &&
    isSameRange(left.range, right.range) &&
    left.projects.length === right.projects.length &&
    left.projects.every((slug, index) => slug === right.projects[index])
  )
}

function isSameRange(left: CompareRange, right: CompareRange): boolean {
  if (typeof left === 'string' || typeof right === 'string') {
    return left === right
  }
  return left.from === right.from && left.to === right.to
}
