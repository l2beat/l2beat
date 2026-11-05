import type { HourlyActivityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import { generateTimestamps } from '../../../utils/generateTimestamps'

/**
 * Ethereum's latest block is the chain's head, seconds old, or, while the
 * head isn't followed, the finalized block, about 15 minutes old. Older than
 * this means finality or the indexer has stalled
 */
const LIVE_ACTIVITY_MAX_AGE = UnixTime.HOUR

/** Before the hour so far, so that the rates span about a day */
export const LIVE_RATE_FULL_HOURS = 23

/** The hours up to the latest block the counts include, as read together */
export interface LatestHours {
  latestBlockTimestamp: UnixTime
  records: HourlyActivityRecord[]
}

export interface LiveActivityRates {
  asOf: UnixTime
  tps: number
  uops: number
}

/**
 * Per second over the 23 full hours before the hour of the latest block and
 * that hour up to the block
 */
export function getLiveActivityRates({
  latestBlockTimestamp,
  records,
}: LatestHours): LiveActivityRates {
  const partialHour = UnixTime.toStartOf(latestBlockTimestamp, 'hour')
  const from = partialHour - LIVE_RATE_FULL_HOURS * UnixTime.HOUR
  const inWindow = records.filter(
    (r) => r.timestamp >= from && r.timestamp <= partialHour,
  )
  const seconds =
    LIVE_RATE_FULL_HOURS * UnixTime.HOUR + (latestBlockTimestamp - partialHour)

  let count = 0
  let uopsCount = 0
  for (const record of inWindow) {
    count += record.count
    uopsCount += record.uopsCount ?? record.count
  }
  return {
    asOf: latestBlockTimestamp,
    tps: count / seconds,
    uops: uopsCount / seconds,
  }
}

export function getLiveActivitySyncWarning(
  latestBlockTimestamp: UnixTime,
  now: UnixTime,
): string | undefined {
  if (now - latestBlockTimestamp <= LIVE_ACTIVITY_MAX_AGE) return
  return `No activity data since ${formatTimestamp(latestBlockTimestamp, {
    mode: 'datetime',
  })}.`
}

/**
 * Counts of the full hours from `from`, then of the hour of the latest block
 * up to it, unless that block starts the hour
 */
export function getLiveHourlyPoints(
  { latestBlockTimestamp, records }: LatestHours,
  from: UnixTime,
): {
  points: ReturnType<typeof toHourlyPoints>
  partialHour: { from: UnixTime; until: UnixTime } | undefined
} {
  const lastHour = UnixTime.toStartOf(latestBlockTimestamp, 'hour')
  const hasPartialHour = latestBlockTimestamp > lastHour
  const to = hasPartialHour ? lastHour : lastHour - UnixTime.HOUR

  return {
    points: toHourlyPoints(records, [from, to]),
    partialHour: hasPartialHour
      ? { from: lastHour, until: latestBlockTimestamp }
      : undefined,
  }
}

/** Every hour of the range, with zeros for hours without blocks */
export function toHourlyPoints(
  records: HourlyActivityRecord[],
  range: [UnixTime, UnixTime],
): [timestamp: number, count: number, uopsCount: number][] {
  const byTimestamp = new Map(records.map((r) => [r.timestamp, r]))
  return generateTimestamps(range, 'hour').map((timestamp) => {
    const record = byTimestamp.get(timestamp)
    return [
      timestamp,
      record?.count ?? 0,
      record?.uopsCount ?? record?.count ?? 0,
    ]
  })
}
