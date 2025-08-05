import type { ActivityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/getProjectDaThroughtputChart'
import { getActivityForProjectAndRange } from '../activity/getActivityForProjectAndRange'
import { type CostsChartDataPoint, getCostsChart } from './getCostsChart'
import { getCostsForProject } from './getCostsForProject'
import type { LatestCostsProjectResponse } from './types'
import { CostsTimeRange, rangeToResolution } from './utils/range'

export type ProjectCostsChartParams = v.infer<typeof ProjectCostsChartParams>
export const ProjectCostsChartParams = v.object({
  range: CostsTimeRange,
  projectId: v.string(),
})

type Stats<T extends number | null> = {
  gas: T
  eth: T
  usd: T
}

export type ProjectCostsChartResponse = {
  chart: [...CostsChartDataPoint, posted: number | null][]
  hasBlobs: boolean
  stats:
    | {
        total: Stats<number>
        perL2Uop: Stats<number | null> | undefined
        perDay: Stats<number>
      }
    | undefined
  syncedUntil: UnixTime
}

export async function getProjectCostsChart(
  params: ProjectCostsChartParams,
): Promise<ProjectCostsChartResponse> {
  const [costsChart, costs, throughputChart, activityRecords] =
    await Promise.all([
      getCostsChart({
        filter: { type: 'projects', projectIds: [params.projectId] },
        range: params.range,
      }),
      getCostsForProject(params.projectId, params.range),
      getProjectDaThroughputChart({
        range: { type: params.range },
        projectId: params.projectId,
        includeScalingOnly: false,
      }),
      getActivityForProjectAndRange(params.projectId, params.range),
    ])

  if (costsChart.chart.length === 0 || !costs) {
    return {
      chart: [],
      hasBlobs: false,
      stats: undefined,
      syncedUntil: Number.POSITIVE_INFINITY,
    }
  }

  const costsUopsCount = getSummedUopsCount(activityRecords, costs.range)

  const resolution = rangeToResolution({ type: params.range })

  const timestampedDaData = Object.fromEntries(throughputChart?.chart ?? [])
  const chart: ProjectCostsChartResponse['chart'] = costsChart.chart.map(
    (cost) => {
      const dailyTimestamp = UnixTime.toStartOf(
        cost[0],
        resolution === 'daily'
          ? 'day'
          : resolution === 'sixHourly'
            ? 'six hours'
            : 'hour',
      )
      const posted =
        dailyTimestamp <= costsChart.syncedUntil
          ? (timestampedDaData[dailyTimestamp] ?? null)
          : null
      return [...cost, posted]
    },
  )

  const total = getTotal(costs)
  const perL2Uop =
    costsUopsCount !== undefined && resolution !== 'hourly'
      ? getPerL2UopsCost(total, {
          costs: costsUopsCount,
        })
      : undefined
  const days = Math.round((costs.range[1] - costs.range[0]) / UnixTime.DAY)
  const perDay = getCostPerDay(total, days)

  return {
    chart,
    hasBlobs: costsChart.hasBlobs,
    stats: { total, perL2Uop, perDay },
    syncedUntil: costsChart.syncedUntil,
  }
}

function getTotal(data: Omit<LatestCostsProjectResponse, 'syncedUntil'>) {
  return {
    gas:
      data.gas.overhead +
      data.gas.calldata +
      data.gas.compute +
      (data.gas.blobs ?? 0),
    eth:
      data.eth.overhead +
      data.eth.calldata +
      data.eth.compute +
      (data.eth.blobs ?? 0),
    usd:
      data.usd.overhead +
      data.usd.calldata +
      data.usd.compute +
      (data.usd.blobs ?? 0),
  }
}

function getPerL2UopsCost(
  data: ReturnType<typeof getTotal>,
  uops: {
    costs: number
  },
) {
  function divideIfValid(value: number | null): number | null {
    return uops.costs && value !== null ? value / uops.costs : value
  }

  return {
    gas: divideIfValid(data.gas),
    eth: divideIfValid(data.eth),
    usd: divideIfValid(data.usd),
  }
}

function getCostPerDay(data: ReturnType<typeof getTotal>, days: number) {
  return {
    gas: data.gas / days,
    eth: data.eth / days,
    usd: data.usd / days,
  }
}

function getSummedUopsCount(
  records: ActivityRecord[],
  range: [UnixTime | null, UnixTime],
) {
  const [from, to] = range
  const filteredRecords = records.filter((record) => {
    return from !== null
      ? record.timestamp >= from && record.timestamp <= to
      : record.timestamp <= to
  })
  return filteredRecords.reduce((acc, record) => {
    return acc + (record.uopsCount ?? record.count)
  }, 0)
}
