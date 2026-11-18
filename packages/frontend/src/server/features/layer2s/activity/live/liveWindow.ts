import type { HourlyActivityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  LIVE_BUCKET_SECONDS,
  LIVE_BUFFER_SECONDS,
  LIVE_RANGES,
  type LiveRange,
} from './liveRanges'

/** Seconds per bucket the rate right now is taken from, a minute's divisor */
export const LAST_MINUTE_BUCKET = 10

/** Read before the window, so a window scrolling between reads keeps its left edge */
const LEAD_SECONDS = UnixTime.MINUTE

/**
 * The range ending at `to`, or at the newest block, within the buffer. A
 * bucket spans a whole number of blocks, so a chain with a fixed block time
 * has as many in each instead of alternating, and only buckets the newest
 * block is past are in, so the live edge does not dip
 */
export function getLiveWindow(
  range: LiveRange,
  newest: UnixTime,
  blockSeconds: number,
  to?: UnixTime,
) {
  // a sparse sample, as a stale block beside a new one, can't empty the window
  const block = Math.min(Math.max(1, blockSeconds), LIVE_RANGES[range] / 10)
  const bucket = Math.ceil(LIVE_BUCKET_SECONDS[range] / block) * block
  const oldestEnd = newest - LIVE_BUFFER_SECONDS + LIVE_RANGES[range]
  const end =
    Math.floor(Math.min(Math.max(to ?? newest, oldestEnd), newest) / bucket) *
    bucket
  const from = end - LIVE_RANGES[range]
  const readFrom =
    Math.floor(from / bucket) * bucket -
    Math.ceil(LEAD_SECONDS / bucket) * bucket
  return { from, to: end - 1, bucket, readFrom }
}

/**
 * Per second, over the minute up to the newest block: its bucket and the five
 * before it, counted up to that block. What every view calls "now"
 *
 * @param buckets Of `LAST_MINUTE_BUCKET` seconds, from the epoch
 */
export function getLastMinuteRates(
  buckets: { timestamp: UnixTime; count: number; uopsCount: number }[],
  newest: UnixTime,
) {
  const start = getLastMinuteStart(newest)
  const inMinute = buckets.filter((b) => b.timestamp >= start)
  const seconds = newest - start + 1
  return {
    tps: inMinute.reduce((sum, b) => sum + b.count, 0) / seconds,
    uops: inMinute.reduce((sum, b) => sum + b.uopsCount, 0) / seconds,
  }
}

/** Where the minute `getLastMinuteRates` takes starts */
export function getLastMinuteStart(newest: UnixTime) {
  return (
    newest -
    (newest % LAST_MINUTE_BUCKET) -
    UnixTime.MINUTE +
    LAST_MINUTE_BUCKET
  )
}

/**
 * The smallest gap between consecutive blocks, the slot of a chain with a
 * fixed block time even when a slot was missed
 */
export function getBlockSeconds(timestamps: UnixTime[]) {
  const gaps = timestamps.slice(1).map((t, i) => t - (timestamps[i] ?? t))
  return gaps.length === 0 ? 1 : Math.min(...gaps)
}

/** Per second, over the same hour on the days given */
export interface UsualRange {
  median: number
  min: number
  max: number
}

export interface UsualHour {
  hour: UnixTime
  tps: UsualRange
  uops: UsualRange
}

/**
 * Each hour from `first` to `last`, as it was on the days given. The median,
 * as a single busy day would pull an average far above a usual one
 */
export function getUsualRates(
  hours: HourlyActivityRecord[],
  first: UnixTime,
  last: UnixTime,
): UsualHour[] {
  const usual: UsualHour[] = []
  for (let hour = first; hour <= last; hour += UnixTime.HOUR) {
    const sameHour = hours.filter(
      (h) => (hour - h.timestamp) % UnixTime.DAY === 0,
    )
    if (sameHour.length === 0) continue
    usual.push({
      hour,
      tps: toUsualRange(sameHour.map((h) => h.count)),
      uops: toUsualRange(sameHour.map((h) => h.uopsCount ?? h.count)),
    })
  }
  return usual
}

function toUsualRange(counts: number[]): UsualRange {
  const rates = counts.map((c) => c / UnixTime.HOUR).sort((a, b) => a - b)
  const middle = Math.floor(rates.length / 2)
  const median =
    rates.length % 2 === 1
      ? (rates[middle] ?? 0)
      : ((rates[middle - 1] ?? 0) + (rates[middle] ?? 0)) / 2
  return { median, min: rates[0] ?? 0, max: rates.at(-1) ?? 0 }
}
