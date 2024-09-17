import { type AggregatedL2CostRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { z } from 'zod'
import { env } from '~/env'
import { db } from '~/server/database'
import { getRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { addIfDefined } from './utils/add-if-defined'
import {
  CostsProjectsFilter,
  getCostsProjects,
} from './utils/get-costs-projects'
import { CostsTimeRange, rangeToResolution } from './utils/range'

export const CostsChartParams = z.object({
  range: CostsTimeRange,
  filter: CostsProjectsFilter,
})
export type CostsChartParams = z.infer<typeof CostsChartParams>

/**
 * A function that computes values for chart data of the costs over time.
 * @returns [timestamp, overheadGas, overheadEth, overheadUsd, calldataGas, calldataEth, calldataUsd, computeGas, computeEth, computeUsd, blobsGas, blobsEth, blobsUsd][] - all numbers
 */
export function getCostsChart(
  ...parameters: Parameters<typeof getCachedCostsChart>
) {
  if (env.MOCK) {
    return getMockCostsChart(...parameters)
  }
  noStore()
  return getCachedCostsChart(...parameters)
}

export type CostsChartData = Awaited<ReturnType<typeof getCachedCostsChart>>
const getCachedCostsChart = cache(
  async ({ range: timeRange, filter }: CostsChartParams) => {
    const projects = getCostsProjects(filter)
    if (projects.length === 0) {
      return []
    }
    const resolution = rangeToResolution(timeRange)
    const range = getRange(timeRange, resolution)

    const data = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )

    const summed = sumByTimestamp(data, resolution)

    return summed
  },
  ['costsChart'],
  { revalidate: 10 * UnixTime.MINUTE },
)

function getMockCostsChart({ range: timeRange }: CostsChartParams) {
  const resolution = rangeToResolution(timeRange)
  const range = getRange(timeRange, resolution)

  const timestamps = generateTimestamps(range, resolution)

  return timestamps.map(
    (timestamp) =>
      [
        timestamp.toNumber(),
        20000,
        0.5,
        1000,
        400000,
        10,
        20000,
        600000,
        15,
        30000,
        1000000,
        0.25,
        500,
      ] as const,
  )
}

function sumByTimestamp(
  records: AggregatedL2CostRecord[],
  resolution: 'daily' | 'hourly',
) {
  const result = new Map<
    number,
    {
      blobsGas: number | undefined
      blobsGasEth: number | undefined
      blobsGasUsd: number | undefined
      calldataGas: number
      calldataGasEth: number
      calldataGasUsd: number
      computeGas: number
      computeGasEth: number
      computeGasUsd: number
      overheadGas: number
      overheadGasEth: number
      overheadGasUsd: number
    }
  >()

  for (const record of records) {
    const timestamp = record.timestamp
      .toStartOf(resolution === 'daily' ? 'day' : 'hour')
      .toNumber()
    const existing = result.get(timestamp)
    if (existing) {
      result.set(timestamp, {
        overheadGas: existing.overheadGas + record.overheadGas,
        overheadGasEth: existing.overheadGasEth + record.overheadGasEth,
        overheadGasUsd: existing.overheadGasUsd + record.overheadGasUsd,
        calldataGas: existing.calldataGas + record.calldataGas,
        calldataGasEth: existing.calldataGasEth + record.calldataGasEth,
        calldataGasUsd: existing.calldataGasUsd + record.calldataGasUsd,
        computeGas: existing.computeGas + record.computeGas,
        computeGasEth: existing.computeGasEth + record.computeGasEth,
        computeGasUsd: existing.computeGasUsd + record.computeGasUsd,
        blobsGas: addIfDefined(existing.blobsGas, record.blobsGas),
        blobsGasEth: addIfDefined(existing.blobsGasEth, record.blobsGasEth),
        blobsGasUsd: addIfDefined(existing.blobsGasUsd, record.blobsGasUsd),
      })
      continue
    }

    result.set(timestamp, {
      overheadGas: record.overheadGas,
      overheadGasEth: record.overheadGasEth,
      overheadGasUsd: record.overheadGasUsd,
      calldataGas: record.calldataGas,
      calldataGasEth: record.calldataGasEth,
      calldataGasUsd: record.calldataGasUsd,
      computeGas: record.computeGas,
      computeGasEth: record.computeGasEth,
      computeGasUsd: record.computeGasUsd,
      blobsGas: record.blobsGas ?? undefined,
      blobsGasEth: record.blobsGasEth ?? undefined,
      blobsGasUsd: record.blobsGasUsd ?? undefined,
    })
  }

  const asArray = Array.from(result.entries()).map(
    ([timestamp, record]) =>
      [
        timestamp,
        record.overheadGas,
        record.overheadGasEth,
        record.overheadGasUsd,
        record.calldataGas,
        record.calldataGasEth,
        record.calldataGasUsd,
        record.computeGas,
        record.computeGasEth,
        record.computeGasUsd,
        record.blobsGas,
        record.blobsGasEth,
        record.blobsGasUsd,
      ] as const,
  )

  return asArray
}
