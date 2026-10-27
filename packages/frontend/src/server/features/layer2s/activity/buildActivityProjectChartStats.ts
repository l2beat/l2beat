import type { ActivityPeak, ActivityTotals } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
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
  maxCount: MaxRate
  /** Only block and slot chains have them, and only for recent days */
  peaks: { sinceTimestamp: number; hour: MaxRate; minute: MaxRate } | undefined
  totalCount?: TotalCount
}

interface MaxRate {
  /** Per second */
  value: number
  /** Of the day it happened */
  timestamp: number
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

export interface ActivityMaxPeaks {
  since: UnixTime
  hour: ActivityPeak
  minute: ActivityPeak
}

interface Params {
  pastDayCount: number | null
  pastDayUopsCount: number | null
  sevenDaysAgoCount: number
  sevenDaysAgoUopsCount: number
  maxCounts: ActivityMaxCounts
  peaks: ActivityMaxPeaks | undefined
  totals: ActivityTotals | undefined
}

export function buildActivityProjectChartStats({
  pastDayCount,
  pastDayUopsCount,
  sevenDaysAgoCount,
  sevenDaysAgoUopsCount,
  maxCounts,
  peaks,
  totals,
}: Params): ActivityProjectChartStats {
  return {
    tps: buildMetricStats({
      pastDaySum: pastDayCount,
      sevenDaysAgoSum: sevenDaysAgoCount,
      maxCount: maxCounts.count,
      maxTimestamp: maxCounts.countTimestamp,
      peaks: toPeakRates(peaks, 'count'),
      totalCount: totals
        ? { value: totals.count, sinceTimestamp: totals.sinceTimestamp }
        : undefined,
    }),
    uops: buildMetricStats({
      pastDaySum: pastDayUopsCount,
      sevenDaysAgoSum: sevenDaysAgoUopsCount,
      maxCount: maxCounts.uopsCount,
      maxTimestamp: maxCounts.uopsTimestamp,
      peaks: toPeakRates(peaks, 'uops'),
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
  peaks,
  totalCount,
}: {
  pastDaySum: number | null
  sevenDaysAgoSum: number
  maxCount: number
  maxTimestamp: number
  peaks: ActivityMetricStats['peaks']
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
    peaks,
    totalCount,
  }
}

function toPeakRates(
  peaks: ActivityMaxPeaks | undefined,
  counted: 'count' | 'uops',
): ActivityMetricStats['peaks'] {
  if (!peaks) return undefined
  const toRate = (peak: ActivityPeak, seconds: number): MaxRate =>
    counted === 'count'
      ? { value: peak.count / seconds, timestamp: peak.countTimestamp }
      : { value: peak.uopsCount / seconds, timestamp: peak.uopsTimestamp }
  return {
    sinceTimestamp: peaks.since,
    hour: toRate(peaks.hour, UnixTime.HOUR),
    minute: toRate(peaks.minute, UnixTime.MINUTE),
  }
}
