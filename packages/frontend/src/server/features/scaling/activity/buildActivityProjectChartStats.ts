import type { ActivityTotals } from '@l2beat/database'
import {
  calculatePercentageChange,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'
import { countPerSecond } from './utils/countPerSecond'

interface TotalCount {
  value: number
  sinceTimestamp: number
}

export interface ActivityMetricStats {
  pastDayCount: number | null
  pastDayChange: number
  pastDayChangePeriod: PercentageChangePeriod
  pastDaySum: number | null
  maxCount: {
    value: number
    timestamp: number
  }
  totalCount?: TotalCount
}

export interface ActivityProjectChartStats {
  tps: ActivityMetricStats
  uops: ActivityMetricStats
}

interface ActivityMaxCounts {
  count: number
  countTimestamp: number
  uopsCount: number
  uopsTimestamp: number
}

interface Params {
  pastDayCount: number | null
  pastDayUopsCount: number | null
  sevenDaysAgoCount: number
  sevenDaysAgoUopsCount: number
  maxCounts: ActivityMaxCounts
  totals: ActivityTotals | undefined
}

export function buildActivityProjectChartStats({
  pastDayCount,
  pastDayUopsCount,
  sevenDaysAgoCount,
  sevenDaysAgoUopsCount,
  maxCounts,
  totals,
}: Params): ActivityProjectChartStats {
  return {
    tps: buildMetricStats({
      pastDaySum: pastDayCount,
      sevenDaysAgoSum: sevenDaysAgoCount,
      maxCount: maxCounts.count,
      maxTimestamp: maxCounts.countTimestamp,
      totalCount: totals
        ? { value: totals.count, sinceTimestamp: totals.sinceTimestamp }
        : undefined,
    }),
    uops: buildMetricStats({
      pastDaySum: pastDayUopsCount,
      sevenDaysAgoSum: sevenDaysAgoUopsCount,
      maxCount: maxCounts.uopsCount,
      maxTimestamp: maxCounts.uopsTimestamp,
      totalCount:
        totals !== undefined &&
        totals.uopsSinceTimestamp === totals.sinceTimestamp
          ? {
              value: totals.uopsCount,
              sinceTimestamp: totals.sinceTimestamp,
            }
          : undefined,
    }),
  }
}

function buildMetricStats({
  pastDaySum,
  sevenDaysAgoSum,
  maxCount,
  maxTimestamp,
  totalCount,
}: {
  pastDaySum: number | null
  sevenDaysAgoSum: number
  maxCount: number
  maxTimestamp: number
  totalCount: TotalCount | undefined
}): ActivityMetricStats {
  return {
    pastDaySum,
    pastDayCount: pastDaySum !== null ? countPerSecond(pastDaySum) : null,
    pastDayChange:
      pastDaySum !== null
        ? calculatePercentageChange(pastDaySum, sevenDaysAgoSum)
        : 0,
    pastDayChangePeriod: '7D',
    maxCount: {
      value: countPerSecond(maxCount),
      timestamp: maxTimestamp,
    },
    totalCount,
  }
}
