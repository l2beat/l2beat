import { useCallback, useMemo } from 'react'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import {
  capTimeRange,
  formatActivityPeriod,
  getActivityPeriodEnd,
} from './utils/activityPeriod'

interface Counts {
  tx: number | null
  uops: number | null
}

/** A chart row's counts: the project's on its own chart, and Ethereum's */
export interface ActivityChartCounts {
  timestamp: number
  projects?: Counts
  ethereum: Counts
}

/**
 * A chart's rows as rates of the metric, each chain's period under way spread
 * over its own seconds so far, with the UOPS/TPS ratio of the project, or of
 * Ethereum on its own chart, and the range and period titles they span
 */
export function useActivityChartPoints<R>(
  chart:
    | {
        data: R[]
        liveUntil: number | undefined
        ethereumLiveUntil: number | undefined
      }
    | undefined,
  toCounts: (row: R) => ActivityChartCounts,
  resolution: ActivityResolution,
  metric: ActivityMetric,
) {
  const liveUntil = chart?.liveUntil
  const ethereumLiveUntil = chart?.ethereumLiveUntil
  const counts = useMemo(
    () => chart?.data.map(toCounts),
    [chart?.data, toCounts],
  )
  const chartData = useMemo(
    () =>
      counts?.map(({ timestamp, projects, ethereum }) => {
        const periodEnd = getActivityPeriodEnd(timestamp, resolution, liveUntil)
        const rate = ({ tx, uops }: Counts, end: number) => {
          const count = metric === 'tps' ? tx : uops
          return count !== null ? count / (end - timestamp) : null
        }
        return {
          timestamp,
          periodEnd,
          ethereum: rate(
            ethereum,
            getActivityPeriodEnd(timestamp, resolution, ethereumLiveUntil),
          ),
          ...(projects && { projects: rate(projects, periodEnd) }),
        }
      }),
    [counts, resolution, liveUntil, ethereumLiveUntil, metric],
  )
  const ratioData = useMemo(
    () =>
      counts?.map(({ timestamp, projects, ethereum }) => {
        const { tx, uops } = projects ?? ethereum
        return {
          timestamp,
          ratio:
            tx !== null && uops !== null ? (tx === 0 ? 1 : uops / tx) : null,
        }
      }),
    [counts],
  )
  const timeRange = capTimeRange(
    getChartTimeRangeFromData(chartData, { bucket: resolution }),
    liveUntil,
  )
  const formatPeriod = useCallback(
    (timestamp: number) =>
      formatActivityPeriod(
        timestamp,
        resolution,
        getActivityPeriodEnd(timestamp, resolution, liveUntil),
      ),
    [resolution, liveUntil],
  )
  return { chartData, ratioData, timeRange, formatPeriod }
}
