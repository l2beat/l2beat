import type { DataAvailabilityRecord2 } from '@l2beat/database'
import type { ProjectsSummedDataAvailabilityRecord } from '@l2beat/database/dist/da-beat/data-availability/entity'
import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { rangeToDays } from '~/utils/range/range-to-days'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

export type DaThroughputDataPoint = [
  timestamp: number,
  ethereum: number,
  celestia: number,
  avail: number,
]

export const DaThroughputChartParams = z.object({
  range: DaThroughputTimeRange,
  includeScalingOnly: z.boolean(),
})
export type DaThroughputChartParams = z.infer<typeof DaThroughputChartParams>

export async function getDaThroughputChart({
  range,
  includeScalingOnly,
}: DaThroughputChartParams): Promise<DaThroughputDataPoint[]> {
  if (env.MOCK) {
    return getMockDaThroughputChartData({ range, includeScalingOnly })
  }

  const db = getDb()
  const days = rangeToDays(range)
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = days ? to - days * UnixTime.DAY : null
  const daLayerIds = ['ethereum', 'celestia', 'avail']
  const throughput = includeScalingOnly
    ? await db.dataAvailability2.getSummedProjectsByDaLayersAndTimeRange(
        daLayerIds,
        [from, to],
      )
    : await db.dataAvailability2.getByProjectIdsAndTimeRange(daLayerIds, [
        from,
        to,
      ])

  if (throughput.length === 0) {
    return []
  }
  const { grouped, minTimestamp, maxTimestamp } =
    groupByTimestampAndDaLayerId(throughput)

  const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
  return timestamps.map((timestamp) => {
    const timestampValues = grouped[timestamp]
    return [
      timestamp,
      timestampValues?.ethereum ?? 0,
      timestampValues?.celestia ?? 0,
      timestampValues?.avail ?? 0,
    ]
  })
}

export function groupByTimestampAndDaLayerId(
  records: (DataAvailabilityRecord2 | ProjectsSummedDataAvailabilityRecord)[],
) {
  let minTimestamp = Infinity
  let maxTimestamp = -Infinity
  const result: Record<number, Record<string, number>> = {}
  for (const record of records) {
    const timestamp = UnixTime.toStartOf(record.timestamp, 'day')
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

    return [
      timestamp,
      Math.round(ethereum),
      Math.round(celestia),
      Math.round(avail),
    ]
  })
}
