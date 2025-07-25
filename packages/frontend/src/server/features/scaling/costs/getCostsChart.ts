import type { AggregatedL2CostRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRange, getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { addIfDefined } from './utils/addIfDefined'
import { CostsProjectsFilter, getCostsProjects } from './utils/getCostsProjects'
import { CostsTimeRange, rangeToResolution } from './utils/range'

export const CostsChartParams = v.object({
  range: CostsTimeRange,
  filter: CostsProjectsFilter,
})
export type CostsChartParams = v.infer<typeof CostsChartParams>

export type CostsChartDataPoint = [
  timestamp: number,
  overheadGas: number | null,
  overheadGasEth: number | null,
  overheadGasUsd: number | null,
  calldataGas: number | null,
  calldataGasEth: number | null,
  calldataGasUsd: number | null,
  computeGas: number | null,
  computeGasEth: number | null,
  computeGasUsd: number | null,
  blobsGas: number | null,
  blobsGasEth: number | null,
  blobsGasUsd: number | null,
]

export type CostsChartData = {
  chart: CostsChartDataPoint[]
  hasBlobs: boolean
}

/**
 * A function that computes values for chart data of the costs over time.
 * @returns [timestamp, overheadGas, overheadEth, overheadUsd, calldataGas, calldataEth, calldataUsd, computeGas, computeEth, computeUsd, blobsGas, blobsEth, blobsUsd][] - all numbers
 */
export async function getCostsChart({
  range: timeRange,
  filter,
}: CostsChartParams): Promise<CostsChartData> {
  if (env.MOCK) {
    return getMockCostsChartData({
      range: timeRange,
      filter,
    })
  }

  const db = getDb()
  const projects = await getCostsProjects(filter)
  if (projects.length === 0) {
    return { chart: [], hasBlobs: false }
  }
  const resolution = rangeToResolution(timeRange)
  const [from, to] = getRangeWithMax({ type: timeRange }, resolution)

  const data = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    projects.map((p) => p.id),
    [from, to],
  )

  if (data.length === 0) {
    return { chart: [], hasBlobs: false }
  }

  const summedByTimestamp = sumByTimestamp(data, resolution)

  const minTimestamp = UnixTime(Math.min(...summedByTimestamp.keys()))

  const timestamps = generateTimestamps([minTimestamp, to], resolution)
  const blobsTimestamp = Array.from(summedByTimestamp.entries()).find(
    ([_, value]) => value.blobsGas !== null,
  )?.[0]

  const chart: CostsChartDataPoint[] = timestamps.map((timestamp) => {
    const entry = summedByTimestamp.get(timestamp)
    const blobsFallback =
      blobsTimestamp && timestamp >= blobsTimestamp ? 0 : null
    if (!entry) {
      return [
        timestamp,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ] as const
    }
    return [
      timestamp,
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
  return { chart, hasBlobs: blobsTimestamp !== undefined }
}

function getMockCostsChartData({
  range: timeRange,
}: CostsChartParams): CostsChartData {
  const resolution = rangeToResolution(timeRange)
  const range = getRange(
    timeRange === 'max' ? { type: '1y' } : { type: timeRange },
    resolution,
  )

  const timestamps = generateTimestamps(range, resolution)

  return {
    chart: timestamps.map((timestamp) => [
      timestamp,
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
    ]),
    hasBlobs: true,
  }
}

function sumByTimestamp(
  records: AggregatedL2CostRecord[],
  resolution: 'daily' | 'hourly' | 'sixHourly',
) {
  const result = new Map<
    number,
    {
      blobsGas: number | null
      blobsGasEth: number | null
      blobsGasUsd: number | null
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
    const timestamp = UnixTime.toStartOf(
      record.timestamp,
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    )

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
      blobsGas: record.blobsGas ?? null,
      blobsGasEth: record.blobsGasEth ?? null,
      blobsGasUsd: record.blobsGasUsd ?? null,
    })
  }

  return result
}
