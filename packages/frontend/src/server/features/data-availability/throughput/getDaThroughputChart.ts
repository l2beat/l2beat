import type {
  DataAvailabilityRecord,
  ProjectsSummedDataAvailabilityRecord,
} from '@l2beat/database'
import { assert, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { isThroughputSynced } from './isThroughputSynced'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { getThroughputExpectedTimestamp } from './utils/getThroughputExpectedTimestamp'
import {
  DaThroughputTimeRange,
  getThroughputRange,
  rangeToResolution,
} from './utils/range'

export type DaThroughputChart = {
  data: DaThroughputDataPoint[]
  syncStatus?: Record<string, number>
}

export type DaThroughputDataPoint = [
  timestamp: number,
  ethereum: number | null,
  celestia: number | null,
  avail: number | null,
  eigenda: number | null,
]

export const DaThroughputChartParams = v.object({
  range: DaThroughputTimeRange,
  includeScalingOnly: v.boolean(),
})
export type DaThroughputChartParams = v.infer<typeof DaThroughputChartParams>

export async function getDaThroughputChart({
  range,
  includeScalingOnly,
}: DaThroughputChartParams): Promise<DaThroughputChart> {
  if (env.MOCK) {
    return { data: getMockDaThroughputChartData({ range, includeScalingOnly }) }
  }
  const db = getDb()
  const resolution = rangeToResolution({ type: range })
  const [from, to] = getThroughputRange({ type: range })
  const daLayers = await ps.getProjects({
    select: ['daLayer'],
  })
  const sovereignProjectsIds = daLayers
    .flatMap((da) =>
      da.daLayer.sovereignProjectsTrackingConfig?.map((c) => c.projectId),
    )
    .filter(notUndefined)

  const throughput = includeScalingOnly
    ? await db.dataAvailability.getSummedProjectsByDaLayersAndTimeRange(
        THROUGHPUT_ENABLED_DA_LAYERS,
        [from, to],
        sovereignProjectsIds,
      )
    : await db.dataAvailability.getByProjectIdsAndTimeRange(
        THROUGHPUT_ENABLED_DA_LAYERS,
        [from, to],
      )

  if (throughput.length === 0) {
    return { data: [] }
  }
  const syncedUntil = throughput.at(-1)?.timestamp
  assert(syncedUntil, 'syncedUntil is undefined')

  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndDaLayerId(
    throughput,
    resolution,
  )

  const lastDataForLayers: Record<
    string,
    { timestamp: number; value: number }
  > = {}
  for (const layer of THROUGHPUT_ENABLED_DA_LAYERS) {
    const lastValue = Object.entries(grouped).findLast(
      ([_, values]) => values[layer] && values[layer] > 0,
    )
    if (lastValue) {
      const [timestamp, value] = lastValue
      lastDataForLayers[layer] = {
        timestamp: Number(timestamp),
        value: value[layer] ?? 0,
      }
    }
  }

  const expectedTo = getThroughputExpectedTimestamp(resolution)

  const adjustedTo = isThroughputSynced(syncedUntil, false)
    ? maxTimestamp
    : expectedTo

  const timestamps = generateTimestamps([minTimestamp, adjustedTo], resolution)
  const data: DaThroughputDataPoint[] = timestamps.map((timestamp) => {
    const timestampValues = grouped[timestamp] ?? {}

    const isSynced = timestamp <= maxTimestamp

    const layerValues: Record<string, number | undefined> = {}
    for (const layer of THROUGHPUT_ENABLED_DA_LAYERS) {
      const lastData = lastDataForLayers[layer]
      const isSynced = lastData && timestamp <= lastData.timestamp
      if (isSynced) {
        layerValues[layer] = timestampValues[layer]
        continue
      }

      layerValues[layer] = lastData?.value
    }

    const fallbackValue = isSynced ? 0 : null

    return [
      timestamp,
      layerValues.ethereum ?? fallbackValue,
      layerValues.celestia ?? fallbackValue,
      layerValues.avail ?? fallbackValue,
      layerValues.eigenda ?? fallbackValue,
    ]
  })
  return {
    data,
    syncStatus: Object.fromEntries(
      Object.entries(lastDataForLayers).map(([layer, { timestamp }]) => [
        layer,
        timestamp,
      ]),
    ),
  }
}

export function groupByTimestampAndDaLayerId(
  records: (DataAvailabilityRecord | ProjectsSummedDataAvailabilityRecord)[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  let minTimestamp = Number.POSITIVE_INFINITY
  let maxTimestamp = Number.NEGATIVE_INFINITY
  const result: Record<number, Record<string, number>> = {}

  const offset = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'daily'
      ? 'day'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'hour',
  )

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
    const daLayerId = record.daLayer
    const value = record.totalSize
    if (!result[timestamp]) {
      result[timestamp] = {}
    }
    if (!result[timestamp][daLayerId]) {
      result[timestamp][daLayerId] = Number(value)
    } else {
      result[timestamp][daLayerId] += Number(value)
    }
    minTimestamp = Math.min(minTimestamp, timestamp)
    maxTimestamp = Math.max(maxTimestamp, timestamp)
  }

  return {
    grouped: result,
    minTimestamp: UnixTime(minTimestamp),
    maxTimestamp: UnixTime(maxTimestamp),
  }
}

function getMockDaThroughputChartData({
  range,
}: DaThroughputChartParams): DaThroughputDataPoint[] {
  const days = rangeToDays({ type: range }) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - days * UnixTime.DAY

  const timestamps = generateTimestamps([from, to], 'daily')
  return timestamps.map((timestamp) => {
    // Generate random but somewhat realistic values
    const ethereum = Math.random() * 900_000_000 + 90_000_000
    const celestia = ethereum * Math.max(21 * Math.random(), 1)
    const avail = ethereum * 1.5 * Math.random()
    const eigenda = ethereum * 3 * Math.random()

    return [
      timestamp,
      Math.round(ethereum),
      Math.round(celestia),
      Math.round(avail),
      Math.round(eigenda),
    ]
  })
}
