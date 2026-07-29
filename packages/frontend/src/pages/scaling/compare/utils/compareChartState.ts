import { UnixTime } from '@l2beat/shared-pure'
import type { ChartScale } from '~/components/chart/types'
import type { ChartRangeOptionValue } from '~/components/core/chart/ChartRangeControls'
import {
  type ChartRange,
  optionToDays,
  optionToRange,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const COMPARE_METRIC_IDS = ['tvs'] as const
export type CompareMetricId = (typeof COMPARE_METRIC_IDS)[number]

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
}

export const DEFAULT_COMPARE_METRIC: CompareMetricId = 'tvs'
export const DEFAULT_COMPARE_RANGE: CompareRangeOption = '1y'
export const DEFAULT_COMPARE_SCALE: ChartScale = 'linear'
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
    left.scale === right.scale &&
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
