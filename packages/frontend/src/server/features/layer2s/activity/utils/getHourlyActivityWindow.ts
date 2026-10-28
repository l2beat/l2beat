import type { SyncMetadataRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { type ChartRange, optionToDays } from '~/utils/range/range'

const HOUR = UnixTime.HOUR

/**
 * How far behind the others a project may fall before the hourly charts stop
 * waiting for it and leave it out
 */
const MAX_LAG = 2 * HOUR

const ROLLING_DAYS = [optionToDays('1d'), optionToDays('7d')]

export interface HourlyActivityWindow {
  start: UnixTime
  /** The last hour every project left in has fully synced */
  end: UnixTime
  /** Too far behind to wait for, with when their last full hour ends */
  behind: { id: string; syncedUntil: UnixTime }[]
}

/**
 * Hours, unlike days, need not stop at midnight: they end at the last hour
 * every project in the chart has finished. The 1D and 7D options then show
 * the last 24 and 168 of them
 */
export function getHourlyActivityWindow(
  range: ChartRange,
  syncMetadata: SyncMetadataRecord[],
  options?: {
    /** Never leave a project out, as on its own page */
    waitForAll?: boolean
  },
): HourlyActivityWindow {
  const projects = syncMetadata.flatMap((record) => {
    const syncedUntil = getFullySyncedUntil(record)
    return syncedUntil === undefined ? [] : [{ id: record.id, syncedUntil }]
  })

  const rangeEnd = UnixTime.toStartOf(range[1], 'hour') + HOUR
  const freshest =
    projects.length === 0
      ? rangeEnd
      : Math.min(rangeEnd, Math.max(...projects.map((p) => p.syncedUntil)))
  const isBehind = (p: { syncedUntil: UnixTime }) =>
    !options?.waitForAll && p.syncedUntil < freshest - MAX_LAG
  const end =
    Math.min(
      freshest,
      ...projects.filter((p) => !isBehind(p)).map((p) => p.syncedUntil),
    ) - HOUR

  const [from, to] = range
  assert(from !== null, 'Hourly range without a start')
  const days = getRollingDays(from, to)
  const start = days === undefined ? from : end - days * UnixTime.DAY + HOUR

  return { start, end, behind: projects.filter(isBehind) }
}

/** Until when a project holds every hour, if it has synced at all */
function getFullySyncedUntil(record: SyncMetadataRecord): UnixTime | undefined {
  if (record.syncedUntil === null) return undefined
  // Days and hours from an API are synced whole
  if (record.blockSyncedUntil === null) return record.syncedUntil
  // Block chains sync to the last block before an hourly target, so they hold
  // every block until it, even when they have had none for a while
  if (record.blockSyncedUntil === record.blockTarget) return record.target
  // Before that, they sync until the end of the hour of their latest block,
  // which can still get more
  return UnixTime.toStartOf(record.syncedUntil, 'hour') - HOUR
}

/**
 * The 1D and 7D options end on a recent hour and start whole days before its
 * day. Other ranges, like those from the calendar, keep their start
 */
function getRollingDays(from: UnixTime, to: UnixTime): number | undefined {
  if (!UnixTime.isFull(to, 'hour')) return
  const days = (UnixTime.toStartOf(to, 'day') - from) / UnixTime.DAY
  return ROLLING_DAYS.includes(days) ? days : undefined
}
