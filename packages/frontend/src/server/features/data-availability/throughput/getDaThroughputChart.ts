import type {
  DataAvailabilityRecord,
  ProjectsSummedDataAvailabilityRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './utils/consts'
import { DaThroughputTimeRange, rangeToResolution } from './utils/range'
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
}: DaThroughputChartParams): Promise<DaThroughputDataPoint[]> {
  if (env.MOCK) {
    return getMockDaThroughputChartData({ range, includeScalingOnly })
  }
  const db = getDb()
  const resolution = rangeToResolution(range)
  const [from, to] = getRangeWithMax(range, resolution, {
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
    return []
  }
  const { grouped, minTimestamp, maxTimestamp } = groupByTimestampAndDaLayerId(
    throughput,
    resolution,
  )

  const lastEigenDAData = Object.entries(grouped).findLast(([_, values]) => {
    return values.eigenda && values.eigenda > 0
  })

  const timestamps = generateTimestamps(
    [minTimestamp, maxTimestamp],
    resolution,
  )
  return timestamps.map((timestamp) => {
    const timestampValues = grouped[timestamp]

    // For EigenDA we only have data for projects for past day, but for whole DA layer hourly, so we want to fill the gaps with the last known value for most recent data
    let eigenda = timestampValues?.eigenda ?? 0
    if (
      includeScalingOnly &&
      lastEigenDAData &&
      timestamp > Number(lastEigenDAData[0])
    ) {
      eigenda = lastEigenDAData[1]['eigenda'] ?? 0
    }

    return [
      timestamp,
      timestampValues?.ethereum ?? 0,
      timestampValues?.celestia ?? 0,
      timestampValues?.avail ?? 0,
      eigenda,
    ]
  })
}

export function groupByTimestampAndDaLayerId(
  records: (DataAvailabilityRecord | ProjectsSummedDataAvailabilityRecord)[],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
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
  const days = rangeToDays(range) ?? 730
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
