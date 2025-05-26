import type { ActivityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/get-project-da-throughput-chart'
import { getActivityForProjectAndRange } from '../activity/get-activity-for-project-and-range'
import { getCostsChart } from './get-costs-chart'
import { getCostsForProject } from './get-costs-for-project'
import type { LatestCostsProjectResponse } from './types'
import { CostsTimeRange, rangeToResolution } from './utils/range'

export type ProjectCostsChartParams = z.infer<typeof ProjectCostsChartParams>
export const ProjectCostsChartParams = z.object({
  range: CostsTimeRange,
  projectId: z.string(),
})

type ProjectLatestCosts = Omit<LatestCostsProjectResponse, 'syncedUntil'> & {
  posted: number | undefined
}

export type ProjectCostsChartResponse = Awaited<
  ReturnType<typeof getProjectCostsChart>
>

export async function getProjectCostsChart(params: ProjectCostsChartParams) {
  const [costsChart, costs, throughput, activityRecords] = await Promise.all([
    getCostsChart({
      previewRecategorisation: false,
      filter: { type: 'projects', projectIds: [params.projectId] },
      range: params.range,
    }),
    getCostsForProject(params.projectId, params.range),
    getProjectDaThroughputChart(params),
    getActivityForProjectAndRange(params.projectId, params.range),
  ])

  if (costsChart.length === 0 || !costs) {
    return {
      chart: [],
      stats: undefined,
    }
  }

  const costsUopsCount = getSummedUopsCount(activityRecords, costs.range)
  const throughputUopsCount = throughput
    ? getSummedUopsCount(activityRecords, throughput.range)
    : undefined

  const timestampedDaData = Object.fromEntries(throughput?.chart ?? [])
  const chart = costsChart.map((cost) => {
    const dailyTimestamp = UnixTime.toStartOf(cost[0], 'day')
    const isHourlyRange = params.range === '1d' || params.range === '7d'
    const posted = timestampedDaData[dailyTimestamp]
    return [
      ...cost,
      posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : undefined,
    ] as const
  })

  const summedThroughput = throughput?.chart.reduce((acc, [_, throughput]) => {
    return acc + throughput
  }, 0)
  const total = withTotal({
    ...costs,
    posted: summedThroughput,
  })

  const resolution = rangeToResolution(params.range)
  const perL2Uop =
    costsUopsCount !== undefined && resolution === 'daily'
      ? mapToPerL2UopsCost(total, {
          costs: costsUopsCount,
          throughput: throughputUopsCount,
        })
      : undefined

  return {
    chart,
    stats: { total, perL2Uop },
  }
}

function withTotal(data: ProjectLatestCosts) {
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
  uops: {
    costs: number
    throughput: number | undefined
  },
) {
  const divideIfValid = (value: number | undefined) =>
    uops.costs && value !== undefined ? value / uops.costs : undefined

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
      data.posted !== undefined && uops.throughput !== undefined
        ? data.posted / uops.throughput
        : undefined,
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
