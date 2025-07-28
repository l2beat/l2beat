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
  gas: StatsValues<T>
  eth: StatsValues<T>
  usd: StatsValues<T>
  posted: number | null
}

type StatsValues<T extends number | null> = {
  overhead: T
  calldata: T
  compute: T
  blobs: number | null
  total: T
}

export type ProjectCostsChartResponse = {
  chart: [...CostsChartDataPoint, posted: number | null][]
  hasBlobs: boolean
  stats:
    | {
        total: Stats<number>
        perL2Uop: Stats<number | null> | undefined
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
  const throughputUopsCount = throughputChart
    ? getSummedUopsCount(activityRecords, throughputChart.range)
    : undefined

  const resolution = rangeToResolution(params.range)

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
      const posted = timestampedDaData[dailyTimestamp]
      return [...cost, posted ?? null]
    },
  )

  const summedThroughput =
    throughputChart?.chart.reduce((acc, [_, throughput]) => {
      return acc + (throughput ?? 0)
    }, 0) ?? null
  const total = withTotal({
    ...costs,
    posted: summedThroughput,
  })

  const perL2Uop =
    costsUopsCount !== undefined && resolution !== 'hourly'
      ? mapToPerL2UopsCost(total, {
          costs: costsUopsCount,
          throughput: throughputUopsCount,
        })
      : undefined

  return {
    chart,
    hasBlobs: costsChart.hasBlobs,
    stats: { total, perL2Uop },
    syncedUntil: costsChart.syncedUntil,
  }
}

function withTotal(
  data: LatestCostsProjectResponse & { posted: number | null },
) {
  return {
    ...data,
    gas: {
      ...data.gas,
      total:
        data.gas.overhead +
        data.gas.calldata +
        data.gas.compute +
        (data.gas.blobs ?? 0),
    },
    eth: {
      ...data.eth,
      total:
        data.eth.overhead +
        data.eth.calldata +
        data.eth.compute +
        (data.eth.blobs ?? 0),
    },
    usd: {
      ...data.usd,
      total:
        data.usd.overhead +
        data.usd.calldata +
        data.usd.compute +
        (data.usd.blobs ?? 0),
    },
  }
}

function mapToPerL2UopsCost(
  data: ReturnType<typeof withTotal>,
  uops: { costs: number; throughput: number | undefined },
) {
  function divideIfValid(value: number | null): number | null {
    return uops.costs && value !== null ? value / uops.costs : value
  }

  return {
    overhead: divideIfValid(data.gas.total),
    gas: {
      overhead: divideIfValid(data.gas.overhead),
      calldata: divideIfValid(data.gas.calldata),
      compute: divideIfValid(data.gas.compute),
      blobs: divideIfValid(data.gas.blobs),
      total: divideIfValid(data.gas.total),
    },
    eth: {
      overhead: divideIfValid(data.eth.overhead),
      calldata: divideIfValid(data.eth.calldata),
      compute: divideIfValid(data.eth.compute),
      blobs: divideIfValid(data.eth.blobs),
      total: divideIfValid(data.eth.total),
    },
    usd: {
      overhead: divideIfValid(data.usd.overhead),
      calldata: divideIfValid(data.usd.calldata),
      compute: divideIfValid(data.usd.compute),
      blobs: divideIfValid(data.usd.blobs),
      total: divideIfValid(data.usd.total),
    },
    posted:
      data.posted !== null && uops.throughput !== undefined
        ? data.posted / uops.throughput
        : null,
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
