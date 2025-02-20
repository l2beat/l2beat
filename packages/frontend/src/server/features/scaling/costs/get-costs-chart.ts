import type { AggregatedL2CostRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { z } from 'zod'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRange, getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { addIfDefined } from './utils/add-if-defined'
import {
  CostsProjectsFilter,
  getCostsProjects,
} from './utils/get-costs-projects'
import { getCostsTargetTimestamp } from './utils/get-costs-target-timestamp'
import { CostsTimeRange, rangeToResolution } from './utils/range'

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

export const CostsChartParams = z.object({
  range: CostsTimeRange,
  filter: CostsProjectsFilter,
  previewRecategorisation: z.boolean().default(false),
})
export type CostsChartParams = z.infer<typeof CostsChartParams>

/**
 * A function that computes values for chart data of the costs over time.
 * @returns [timestamp, overheadGas, overheadEth, overheadUsd, calldataGas, calldataEth, calldataUsd, computeGas, computeEth, computeUsd, blobsGas, blobsEth, blobsUsd][] - all numbers
 */
export function getCostsChart(
  ...parameters: Parameters<typeof getCachedCostsChartData>
) {
  if (env.MOCK) {
    return getMockCostsChartData(...parameters)
  }
  return getCachedCostsChartData(...parameters)
}

export type CostsChartData = Awaited<ReturnType<typeof getCachedCostsChartData>>

export const getCachedCostsChartData = cache(
  async ({
    range: timeRange,
    filter,
    previewRecategorisation,
  }: CostsChartParams) => {
    const db = getDb()
    const projects = getCostsProjects(filter, previewRecategorisation)
    if (projects.length === 0) {
      return []
    }
    const resolution = rangeToResolution(timeRange)
    const targetTimestamp = getCostsTargetTimestamp()
    const [from, to] = getRangeWithMax(timeRange, resolution, {
      now: targetTimestamp,
    })

    const fromToQuery = from
      ? // one-off
        from.add(-1, resolution === 'daily' ? 'days' : 'hours')
      : MIN_TIMESTAMPS.costs

    // to is exclusive
    const rangeForQuery: [UnixTime, UnixTime] = [fromToQuery, to]

    const data = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
      projects.map((p) => p.id),
      rangeForQuery,
    )

    if (data.length === 0) {
      return []
    }

    const summedByTimestamp = sumByTimestamp(data, resolution)
    const timestamps = generateTimestamps(
      [fromToQuery, to.add(-1, resolution === 'daily' ? 'days' : 'hours')],
      resolution,
    )
    const result = timestamps.map((timestamp) => {
      const entry = summedByTimestamp.get(timestamp.toNumber())
      const blobsFallback =
        timestamp.toNumber() >= DENCUN_UPGRADE_TIMESTAMP ? 0 : undefined
      if (!entry) {
        return [
          timestamp.toNumber(),
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          blobsFallback,
          blobsFallback,
          blobsFallback,
        ] as const
      }
      return [
        timestamp.toNumber(),
        entry.overheadGas,
        entry.overheadGasEth,
        entry.overheadGasUsd,
        entry.calldataGas,
        entry.calldataGasEth,
        entry.calldataGasUsd,
        entry.computeGas,
        entry.computeGasEth,
        entry.computeGasUsd,
        entry.blobsGas ?? blobsFallback,
        entry.blobsGasEth ?? blobsFallback,
        entry.blobsGasUsd ?? blobsFallback,
      ] as const
    })
    return result
  },
  ['costs-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockCostsChartData({
  range: timeRange,
}: CostsChartParams): CostsChartData {
  const resolution = rangeToResolution(timeRange)
  const range = getRange(timeRange === 'max' ? '1y' : timeRange, resolution)

  const timestamps = generateTimestamps(range, resolution)

  return timestamps.map((timestamp) => [
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
  ])
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

  return result
}
