import { UnixTime } from '@l2beat/shared-pure'
import { WEEK_DAYS } from '~/server/features/home/homeSeries'
import type { ChartRange } from '~/utils/range/range'

export const SCALING_SUMMARY_TVS_CHART_RANGE_ARGS = ['1y'] as const
export const SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS = ['1y'] as const
export const SCALING_SUMMARY_UNIT = 'usd'

/**
 * What the activity chart fetches: its range plus the days before it that
 * its first trailing week sums, so the line starts where the axis does.
 */
export function getSummaryActivityFetchRange([
  from,
  to,
]: ChartRange): ChartRange {
  return [from === null ? null : from - (WEEK_DAYS - 1) * UnixTime.DAY, to]
}
