import type {
  DataAvailabilityRecord,
  ProjectsSummedDataAvailabilityRecord,
} from '@l2beat/database'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
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
  for (const record of records) {
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
