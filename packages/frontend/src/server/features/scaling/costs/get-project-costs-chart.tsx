import { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getDb } from '~/server/database'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/get-project-da-throughput-chart'
import { getCostsChart } from './get-costs-chart'
import { getCostsForProject } from './get-costs-for-project'
import type { LatestCostsProjectResponse } from './types'
import { CostsTimeRange, getFullySyncedCostsRange } from './utils/range'

export type ProjectCostsChartParams = z.infer<typeof ProjectCostsChartParams>
export const ProjectCostsChartParams = z.object({
  range: CostsTimeRange,
  projectId: z.string(),
})

type ProjectLatestCosts = Omit<LatestCostsProjectResponse, 'syncedUntil'> & {
  posted: number | undefined
}

export async function getProjectCostsChart(params: ProjectCostsChartParams) {
  const [costsChart, costs, da, uopsCount] = await Promise.all([
    getCostsChart({
      previewRecategorisation: false,
      filter: { type: 'projects', projectIds: [params.projectId] },
      range: params.range,
    }),
    getCostsForProject(params.projectId, params.range),
    getProjectDaThroughputChart(params),
    getLatestActivityForProject(params.projectId, params.range),
  ])

  const timestampedDaData = Object.fromEntries(da ?? [])
  const chart = costsChart.map((cost) => {
    const dailyTimestamp = UnixTime.toStartOf(cost[0], 'day')
    const isHourlyRange = params.range === '1d' || params.range === '7d'
    const posted = timestampedDaData[dailyTimestamp]
    return [
      ...cost,
      posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : undefined,
    ] as const
  })

  const summedThroughput = da.reduce((acc, [_, throughput]) => {
    return acc + throughput
  }, 0)
  const total = withTotal({ ...costs, posted: summedThroughput })
  const perL2Uop = uopsCount ? mapToPerL2UopsCost(total, uopsCount) : undefined

  return {
    chart,
    stats: { total, perL2Uop, uopsCount },
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
  uopsCount: number,
) {
  return {
    overhead: data.gas.total / uopsCount,
    gas: {
      overhead: data.gas.overhead / uopsCount,
      calldata: data.gas.calldata / uopsCount,
      compute: data.gas.compute / uopsCount,
      blobs:
        data.gas.blobs !== undefined ? data.gas.blobs / uopsCount : undefined,
      total: data.gas.total / uopsCount,
    },
    eth: {
      overhead: data.eth.overhead / uopsCount,
      calldata: data.eth.calldata / uopsCount,
      compute: data.eth.compute / uopsCount,
      blobs:
        data.eth.blobs !== undefined ? data.eth.blobs / uopsCount : undefined,
      total: data.eth.total / uopsCount,
    },
    usd: {
      overhead: data.usd.overhead / uopsCount,
      calldata: data.usd.calldata / uopsCount,
      compute: data.usd.compute / uopsCount,
      blobs:
        data.usd.blobs !== undefined ? data.usd.blobs / uopsCount : undefined,
      total: data.usd.total / uopsCount,
    },
    posted: data.posted !== undefined ? data.posted / uopsCount : undefined,
  }
}

async function getLatestActivityForProject(
  projectId: string,
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const range = getFullySyncedCostsRange(timeRange)
  return db.activity.getSummedUopsCountForProjectAndTimeRange(
    ProjectId(projectId),
    range,
  )
}
