import type { AggregatedL2CostRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getBucketValuesRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { addIfDefined } from './utils/addIfDefined'
import { getCostsExpectedTimestamp } from './utils/getCostsExpectedTimestamp'
import { CostsProjectsFilter, getCostsProjects } from './utils/getCostsProjects'
import { isCostsSynced } from './utils/isCostsSynced'
import { CostsTimeRange, getCostsRange, rangeToResolution } from './utils/range'

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

type CostsChartData = {
  chart: CostsChartDataPoint[]
  hasBlobs: boolean
  syncedUntil: UnixTime
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
    return { chart: [], hasBlobs: false, syncedUntil: Number.POSITIVE_INFINITY }
  }
  const resolution = rangeToResolution({ type: timeRange })
  const [from, to] = getCostsRange({ type: timeRange })

  const data = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    projects.map((p) => p.id),
    [from, to],
  )

  if (data.length === 0) {
    return { chart: [], hasBlobs: false, syncedUntil: Number.POSITIVE_INFINITY }
  }

  const syncedUntil = data.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const summedByTimestamp = sumByTimestamp(data, resolution)
  const minTimestamp = UnixTime(Math.min(...summedByTimestamp.keys()))
  const maxTimestamp = UnixTime(Math.max(...summedByTimestamp.keys()))
  const blobsTimestamp = Array.from(summedByTimestamp.entries()).find(
    ([_, value]) => value.blobsGas !== null,
  )?.[0]

  const expectedTo = getCostsExpectedTimestamp(resolution)
  const adjustedTo = isCostsSynced(syncedUntil) ? maxTimestamp : expectedTo

  const timestamps = generateTimestamps([minTimestamp, adjustedTo], resolution)

  const chart: CostsChartDataPoint[] = timestamps.map((timestamp) => {
    const entry = summedByTimestamp.get(timestamp)
    const isSynced = timestamp <= maxTimestamp
    const blobsFallback =
      blobsTimestamp && timestamp >= blobsTimestamp ? 0 : null
    if (!entry) {
      const value = isSynced ? 0 : null
      return [
        timestamp,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
        value,
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

  return {
    chart,
    hasBlobs: blobsTimestamp !== undefined,
    syncedUntil,
  }
}

function getMockCostsChartData({
  range: timeRange,
}: CostsChartParams): CostsChartData {
  const resolution = rangeToResolution({ type: timeRange })
  const [from, to] = getBucketValuesRange(
    timeRange === 'max' ? { type: '1y' } : { type: timeRange },
    resolution,
  )

  const timestamps = generateTimestamps([from ?? 1573776000, to], resolution)

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
    // biome-ignore lint/style/noNonNullAssertion: it's there
    syncedUntil: timestamps.at(-1)!,
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

  const offset = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'daily'
      ? 'day'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'hour',
  )

  // Dismiss ranges that are not full
  const fullySyncedRecords = records.filter((r) => r.timestamp < offset)

  for (const record of fullySyncedRecords) {
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
