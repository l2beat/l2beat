import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/get-project-da-throughput-chart'
import { getSummedActivityForProject } from '../activity/get-summed-activity-for-project'
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

export async function getProjectCostsChart(params: ProjectCostsChartParams) {
  const [costsChart, costs, throughput] = await Promise.all([
    getCostsChart({
      previewRecategorisation: false,
      filter: { type: 'projects', projectIds: [params.projectId] },
      range: params.range,
    }),
    getCostsForProject(params.projectId, params.range),
    getProjectDaThroughputChart(params),
  ])

  const [costsUopsCount, throughputUopsCount] = await Promise.all([
    getSummedActivityForProject(params.projectId, costs.range),
    getSummedActivityForProject(params.projectId, throughput.range),
  ])

  const timestampedDaData = Object.fromEntries(throughput.chart ?? [])
  const chart = costsChart.map((cost) => {
    const dailyTimestamp = UnixTime.toStartOf(cost[0], 'day')
    const isHourlyRange = params.range === '1d' || params.range === '7d'
    const posted = timestampedDaData[dailyTimestamp]
    return [
      ...cost,
      posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : undefined,
    ] as const
  })

  const summedThroughput = throughput.chart.reduce((acc, [_, throughput]) => {
    return acc + throughput
  }, 0)
  const total = withTotal({
    ...costs,
    posted: summedThroughput,
  })

  const resolution = rangeToResolution(params.range)
  const perL2Uop =
    throughputUopsCount !== undefined &&
    costsUopsCount !== undefined &&
    resolution === 'daily'
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
    throughput: number
  },
) {
  return {
    overhead: uops.costs ? data.gas.total / uops.costs : undefined,
    gas: {
      overhead: uops.costs ? data.gas.overhead / uops.costs : undefined,
      calldata: uops.costs ? data.gas.calldata / uops.costs : undefined,
      compute: uops.costs ? data.gas.compute / uops.costs : undefined,
      blobs:
        data.gas.blobs !== undefined && uops.costs
          ? data.gas.blobs / uops.costs
          : undefined,
      total: uops.costs ? data.gas.total / uops.costs : undefined,
    },
    eth: {
      overhead: uops.costs ? data.eth.overhead / uops.costs : undefined,
      calldata: uops.costs ? data.eth.calldata / uops.costs : undefined,
      compute: uops.costs ? data.eth.compute / uops.costs : undefined,
      blobs:
        data.eth.blobs !== undefined && uops.costs
          ? data.eth.blobs / uops.costs
          : undefined,
      total: uops.costs ? data.eth.total / uops.costs : undefined,
    },
    usd: {
      overhead: uops.costs ? data.usd.overhead / uops.costs : undefined,
      calldata: uops.costs ? data.usd.calldata / uops.costs : undefined,
      compute: uops.costs ? data.usd.compute / uops.costs : undefined,
      blobs:
        data.usd.blobs !== undefined && uops.costs
          ? data.usd.blobs / uops.costs
          : undefined,
      total: uops.costs ? data.usd.total / uops.costs : undefined,
    },
    posted:
      data.posted !== undefined && uops.throughput
        ? data.posted / uops.throughput
        : undefined,
  }
}
