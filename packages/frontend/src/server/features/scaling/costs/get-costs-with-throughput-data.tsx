import { ProjectId } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getDb } from '~/server/database'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/get-project-da-throughput-chart'
import { getCostsChart } from './get-costs-chart'
import type { LatestCostsProjectResponse } from './types'
import { addIfDefined } from './utils/add-if-defined'
import { CostsTimeRange, getFullySyncedCostsRange } from './utils/range'

export type ProjectCostsChartParams = z.infer<typeof ProjectCostsChartParams>
export const ProjectCostsChartParams = z.object({
  range: CostsTimeRange,
  projectId: z.string(),
})

export async function getProjectCostsChart(params: ProjectCostsChartParams) {
  const [costs, da, uopsCount] = await Promise.all([
    getCostsChart({
      previewRecategorisation: false,
      filter: { type: 'projects', projectIds: [params.projectId] },
      range: params.range,
    }),
    getProjectDaThroughputChart(params),
    getLatestActivityForProject(params.projectId, params.range),
  ])

  const timestampedDaData = Object.fromEntries(da ?? [])
  const chart = costs.map((cost) => {
    const dailyTimestamp = UnixTime.toStartOf(cost[0], 'day')
    const isHourlyRange = params.range === '1d' || params.range === '7d'
    const posted = timestampedDaData[dailyTimestamp]
    return [
      ...cost,
      posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : null,
    ] as const
  })

  const summed = costs.reduce<Omit<LatestCostsProjectResponse, 'syncedUntil'>>(
    (acc, record) => {
      return {
        gas: {
          overhead: acc.gas.overhead + record[1],
          calldata: acc.gas.calldata + record[4],
          compute: acc.gas.compute + record[7],
          blobs: addIfDefined(acc.gas.blobs, record[10]),
        },
        eth: {
          overhead: acc.eth.overhead + record[2],
          calldata: acc.eth.calldata + record[5],
          compute: acc.eth.compute + record[8],
          blobs: addIfDefined(acc.eth.blobs, record[11]),
        },
        usd: {
          overhead: acc.usd.overhead + record[3],
          calldata: acc.usd.calldata + record[6],
          compute: acc.usd.compute + record[9],
          blobs: addIfDefined(acc.usd.blobs, record[12]),
        },
      }
    },
    {
      gas: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
      eth: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
      usd: {
        overhead: 0,
        calldata: 0,
        compute: 0,
        blobs: undefined,
      },
    },
  )

  const totalCosts = withTotal(summed)

  const perL2UopCost = uopsCount
    ? mapToPerL2UopsCost(totalCosts, uopsCount)
    : undefined

  return { chart, stats: { totalCosts, perL2UopCost, uopsCount } }
}

function withTotal(data: Omit<LatestCostsProjectResponse, 'syncedUntil'>) {
  return {
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
