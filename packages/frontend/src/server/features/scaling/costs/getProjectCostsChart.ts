import type { ActivityRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getActivityForProjectAndRange } from '../activity/getActivityForProjectAndRange'
import { type CostsChartData, getCostsChart } from './getCostsChart'
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
}

type StatsValues<T extends number | null> = {
  overhead: T
  calldata: T
  compute: T
  blobs: number | null
  total: T
}

export type ProjectCostsChartResponse = CostsChartData & {
  stats:
    | {
        total: Stats<number>
        perL2Uop: Stats<number | null> | undefined
      }
    | undefined
}

export async function getProjectCostsChart(
  params: ProjectCostsChartParams,
): Promise<ProjectCostsChartResponse> {
  const [chartData, costs, activityRecords] = await Promise.all([
    getCostsChart({
      filter: { type: 'projects', projectIds: [params.projectId] },
      range: params.range,
    }),
    getCostsForProject(params.projectId, params.range),
    getActivityForProjectAndRange(params.projectId, params.range),
  ])

  if (!costs) {
    return {
      chart: [],
      hasBlobs: false,
      stats: undefined,
    }
  }

  const costsUopsCount = getSummedUopsCount(activityRecords, costs.range)

  const resolution = rangeToResolution(params.range)

  const total = withTotal(costs)

  const perL2Uop =
    costsUopsCount !== undefined && resolution !== 'hourly'
      ? mapToPerL2UopsCost(total, costsUopsCount)
      : undefined

  return {
    ...chartData,
    stats: { total, perL2Uop },
  }
}

function withTotal(data: LatestCostsProjectResponse) {
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

function mapToPerL2UopsCost(data: ReturnType<typeof withTotal>, uops: number) {
  function divideIfValid(value: number | null): number | null {
    return uops && value !== null ? value / uops : value
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
