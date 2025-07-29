import type {
  DataAvailabilityRecord,
  ProjectsSummedDataAvailabilityRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { DaThroughputTimeRange, rangeToResolution } from './utils/range'

export type DaThroughputChart = {
  data: DaThroughputDataPoint[]
  syncStatus?: Record<string, number>
}

export type DaThroughputDataPoint = [
  timestamp: number,
  ethereum: number,
  celestia: number,
  avail: number,
  eigenda: number,
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
  const [from, to] = getRangeWithMax({ type: range }, resolution, {
    now: UnixTime.toStartOf(UnixTime.now(), 'hour') - UnixTime.HOUR,
  })
  const throughput = includeScalingOnly
    ? await db.dataAvailability.getSummedProjectsByDaLayersAndTimeRange(
        THROUGHPUT_ENABLED_DA_LAYERS,
        [from, to],
      )
    : await db.dataAvailability.getByProjectIdsAndTimeRange(
        THROUGHPUT_ENABLED_DA_LAYERS,
        [from, to],
      )

  if (throughput.length === 0) {
    return { data: [] }
  }
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

  const timestamps = generateTimestamps(
    [minTimestamp, maxTimestamp],
    resolution,
  )
  const data: DaThroughputDataPoint[] = timestamps.map((timestamp) => {
    const timestampValues = grouped[timestamp] ?? {}

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

    return [
      timestamp,
      layerValues.ethereum ?? 0,
      layerValues.celestia ?? 0,
      layerValues.avail ?? 0,
      layerValues.eigenda ?? 0,
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

  const grouped = groupBy(records, (r) =>
    UnixTime.toStartOf(
      r.timestamp,
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    ),
  )

  const expectedLength =
    resolution === 'daily' ? 24 : resolution === 'sixHourly' ? 6 : 1

  for (const [timestamp, records] of Object.entries(grouped)) {
    const unixTimestamp = Number(timestamp)
    const groupedByDaLayer = groupBy(records, (r) => r.daLayer)

    for (const [daLayerId, daLayerRecords] of Object.entries(
      groupedByDaLayer,
    )) {
      if (daLayerRecords.length !== expectedLength) {
        continue
      }

      const value = daLayerRecords.reduce((acc, r) => acc + r.totalSize, 0n)

      if (!result[unixTimestamp]) {
        result[unixTimestamp] = {}
      }
      if (!result[unixTimestamp][daLayerId]) {
        result[unixTimestamp][daLayerId] = Number(value)
      }
    }

    minTimestamp = Math.min(minTimestamp, unixTimestamp)
    maxTimestamp = Math.max(maxTimestamp, unixTimestamp)
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
