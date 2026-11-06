import type { BlobFeeHourlyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { generateTimestamps } from '../../utils/generateTimestamps'

/**
 * One bucket of the chart's resolution, in gwei per blob gas: the blob base
 * fee averaged over the bucket's blocks and the highest it reached. Null
 * where no block was indexed
 */
export type BlobFeeChartPoint = [
  timestamp: number,
  avgBlobBaseFee: number | null,
  maxBlobBaseFee: number | null,
]

export interface BlobFeeChart {
  chart: BlobFeeChartPoint[]
  syncedUntil: UnixTime
}

export const BlobFeeChartParams = v.object({ range: ChartRange })
export type BlobFeeChartParams = v.infer<typeof BlobFeeChartParams>

const WEI_PER_GWEI = 1e9

export async function getBlobFeeChart({
  range,
}: BlobFeeChartParams): Promise<BlobFeeChart | undefined> {
  if (env.MOCK) {
    return getMockBlobFeeChart({ range })
  }
  const resolution = rangeToResolution(range)
  const [from, to] = range
  const hours = await getDb().blobFeeHourly.getByTimeRange(
    from ?? UnixTime(0),
    to,
  )
  const first = hours[0]
  const newest = hours.at(-1)
  if (!first || !newest) return undefined

  const buckets = groupByBucket(hours, resolution)
  const start = UnixTime.toStartOf(from ?? first.timestamp, resolution)
  const end = UnixTime.toStartOf(newest.timestamp, resolution)
  const timestamps = generateTimestamps([start, end], resolution)

  return {
    chart: timestamps.map((timestamp) => {
      const bucket = buckets.get(timestamp)
      if (!bucket) return [timestamp, null, null]
      return [
        timestamp,
        bucket.blobBaseFeeSum / bucket.blocks / WEI_PER_GWEI,
        bucket.maxBlobBaseFee / WEI_PER_GWEI,
      ]
    }),
    syncedUntil: newest.timestamp,
  }
}

interface Bucket {
  blocks: number
  blobBaseFeeSum: number
  maxBlobBaseFee: number
}

/** Hours summed into buckets of the resolution, each hour weighing its blocks */
function groupByBucket(
  hours: BlobFeeHourlyRecord[],
  resolution: ChartResolution,
): Map<number, Bucket> {
  const buckets = new Map<number, Bucket>()
  for (const hour of hours) {
    const timestamp = UnixTime.toStartOf(hour.timestamp, resolution)
    const bucket = buckets.get(timestamp) ?? {
      blocks: 0,
      blobBaseFeeSum: 0,
      maxBlobBaseFee: 0,
    }
    bucket.blocks += hour.blocks
    bucket.blobBaseFeeSum += Number(hour.avgBlobBaseFee) * hour.blocks
    bucket.maxBlobBaseFee = Math.max(
      bucket.maxBlobBaseFee,
      Number(hour.maxBlobBaseFee),
    )
    buckets.set(timestamp, bucket)
  }
  return buckets
}

function getMockBlobFeeChart({ range }: BlobFeeChartParams): BlobFeeChart {
  const days = rangeToDays(range) ?? 730
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = range[0] ?? to - days * UnixTime.DAY
  const timestamps = generateTimestamps([from, to], 'day')
  return {
    chart: timestamps.map((timestamp) => {
      const avg = 0.002 + Math.random() * 0.01
      return [timestamp, avg, avg * (2 + Math.random() * 20)]
    }),
    syncedUntil: to,
  }
}
