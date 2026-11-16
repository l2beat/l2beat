import type { SummedL2CostRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getChartStartTimestamp } from '../../utils/getChartStartTimestamp'
import { getCostsExpectedTimestamp } from './utils/getCostsExpectedTimestamp'
import { CostsProjectsFilter, getCostsProjects } from './utils/getCostsProjects'
import { isCostsSynced } from './utils/isCostsSynced'

export const CostsChartParams = v.object({
  range: ChartRange,
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
  range,
  filter,
}: CostsChartParams): Promise<CostsChartData> {
  if (env.MOCK) {
    return getMockCostsChartData({
      range,
      filter,
    })
  }

  const db = getDb()
  const projects = await getCostsProjects(filter)
  if (projects.length === 0) {
    return { chart: [], hasBlobs: false, syncedUntil: Number.POSITIVE_INFINITY }
  }
  const resolution = rangeToResolution(range)

  const projectIds = projects.map((p) => p.id)
  const [data, firstTimestamp] = await Promise.all([
    db.aggregatedL2Cost.getSummedByProjectsAndTimeRange(
      projectIds,
      range,
      resolution,
    ),
    db.aggregatedL2Cost.getFirstTimestampByProjects(projectIds),
  ])

  if (data.length === 0) {
    return { chart: [], hasBlobs: false, syncedUntil: Number.POSITIVE_INFINITY }
  }

  const syncedUntil = data.at(-1)?.lastTimestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const summedByTimestamp = toFullySyncedMap(data, resolution)
  const dataStart = UnixTime(Math.min(...summedByTimestamp.keys()))
  const maxTimestamp = UnixTime(Math.max(...summedByTimestamp.keys()))
  const blobsTimestamp = Array.from(summedByTimestamp.entries()).find(
    ([_, value]) => value.blobsGas !== null,
  )?.[0]

  const expectedTo = getCostsExpectedTimestamp(range[1], resolution)
  const adjustedTo = isCostsSynced({ to: range[1], syncedUntil })
    ? maxTimestamp
    : expectedTo

  const startTimestamp = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp: firstTimestamp,
    dataStart,
    resolution,
  })

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedTo],
    resolution,
  )

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

function getMockCostsChartData({ range }: CostsChartParams): CostsChartData {
  const resolution = rangeToResolution(range)

  const timestamps = generateTimestamps(
    [range[0] ?? 1573776000, range[1]],
    resolution,
  )

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

function toFullySyncedMap(
  records: SummedL2CostRecord[],
  resolution: ChartResolution,
) {
  const offset = UnixTime.toStartOf(UnixTime.now(), resolution)
  return new Map(
    records
      .filter((r) => r.timestamp < offset)
      .map((r) => [r.timestamp, r] as const),
  )
}
