import {
  type HourlyActivityRecord,
  LIVE_BUFFER_SECONDS,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  getLiveBucketSeconds,
  LIVE_JUMP_SECONDS,
} from '~/utils/range/liveRanges'

/** The minute the rate right now is taken over starts on a multiple of it */
const LAST_MINUTE_STEP = 10

/** Seconds per bar of the overview of the whole buffer */
export const OVERVIEW_BUCKET_SECONDS = UnixTime.MINUTE

/** Read before the window, so one trailing its data on screen keeps its left edge */
export const LEAD_SECONDS = LIVE_JUMP_SECONDS

/**
 * Whether the chain's newest stored block is recent enough to show as live.
 * An older one means its blocks are no longer followed, or the follower is
 * stuck. Longer than the head of chains the RPC proxy syncs from Envio lags
 */
export function isLiveFresh(newest: UnixTime | undefined, now: UnixTime) {
  return newest !== undefined && newest >= now - 30 * UnixTime.MINUTE
}

/**
 * How much less than the buffer a full one may hold. Above the 10 minutes
 * between the runs of the backend's cleaner, which trims it
 */
const FILLING_MARGIN_SECONDS = 15 * UnixTime.MINUTE

/** Where the stored blocks start and end, so where a window may */
export interface LiveBuffer {
  from: UnixTime
  to: UnixTime
  /** Holding clearly less than it keeps, as after a chain is first followed */
  filling: boolean
}

/**
 * From the buffer's start, or while it fills, the oldest block, to the newest
 * one. It starts on a bar of the overview, and at least one back
 */
export function getLiveBuffer(
  newest: UnixTime,
  oldest: UnixTime | undefined,
): LiveBuffer {
  const start = Math.max(newest - LIVE_BUFFER_SECONDS, oldest ?? newest)
  return {
    from: Math.min(
      newest - OVERVIEW_BUCKET_SECONDS,
      start - (start % OVERVIEW_BUCKET_SECONDS),
    ),
    to: newest,
    filling:
      oldest !== undefined &&
      newest - oldest < LIVE_BUFFER_SECONDS - FILLING_MARGIN_SECONDS,
  }
}

/**
 * The window of `seconds` ending at the newest block. A bucket spans a whole
 * number of blocks, so a chain with a fixed block time has as many in each
 * instead of alternating, and only buckets the newest block is past are in,
 * so the live edge does not dip. `whole` reads the buffer from its start, for
 * a window moved through it
 */
export function getLiveWindow(
  seconds: number,
  buffer: Pick<LiveBuffer, 'from' | 'to'>,
  blockSeconds: number,
  whole = false,
) {
  // a sparse sample, as a stale block beside a new one, can't empty the window
  const block = Math.min(Math.max(1, blockSeconds), seconds / 10)
  const bucket = Math.ceil(getLiveBucketSeconds(seconds) / block) * block
  const end = Math.floor(buffer.to / bucket) * bucket
  const from = end - seconds
  const lead =
    Math.floor(from / bucket) * bucket -
    Math.ceil(LEAD_SECONDS / bucket) * bucket
  const readFrom = whole
    ? Math.min(lead, Math.floor(buffer.from / bucket) * bucket)
    : lead
  return { seconds, from, to: end, bucket, readFrom }
}

/**
 * Per second, over the minute up to the newest block, which starts on a
 * multiple of `LAST_MINUTE_STEP`. What the history view shows as "now"
 *
 * @param getBuckets The blocks between two times, both included, summed
 */
export async function getLastMinuteRates(
  newest: UnixTime,
  getBuckets: (
    from: UnixTime,
    to: UnixTime,
  ) => Promise<{ count: number; uopsCount: number }[]>,
) {
  const start =
    newest - (newest % LAST_MINUTE_STEP) - UnixTime.MINUTE + LAST_MINUTE_STEP
  const buckets = await getBuckets(start, newest)
  const seconds = newest - start + 1
  return {
    tps: buckets.reduce((sum, b) => sum + b.count, 0) / seconds,
    uops: buckets.reduce((sum, b) => sum + b.uopsCount, 0) / seconds,
  }
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
