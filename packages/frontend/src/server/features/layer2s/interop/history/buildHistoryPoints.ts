import { UnixTime } from '@l2beat/shared-pure'
import type { InteropHistoryResolution } from './types'

/** Hourly snapshots are kept for 14 days before retention thins them. */
export const HOURLY_HISTORY_DAYS = 14

export interface HistoryPointSnapshot {
  timestamp: UnixTime
  snapshot: UnixTime | undefined
}

/**
 * One point per UTC day (its earliest snapshot) or per hour of the last 14
 * days, from the first to the last snapshot. Points without a snapshot stay
 * in, so gaps show.
 */
export function buildHistoryPoints(
  snapshots: UnixTime[],
  resolution: InteropHistoryResolution,
): HistoryPointSnapshot[] {
  if (snapshots.length === 0) return []
  const sorted = [...snapshots].sort((a, b) => a - b)
  const last = sorted.at(-1) as UnixTime

  if (resolution === 'hourly') {
    const existing = new Set(sorted)
    const to = UnixTime.toStartOf(last, 'hour')
    const from = to - HOURLY_HISTORY_DAYS * UnixTime.DAY + UnixTime.HOUR
    const points: HistoryPointSnapshot[] = []
    for (let t = from; t <= to; t += UnixTime.HOUR) {
      const timestamp = UnixTime(t)
      points.push({
        timestamp,
        snapshot: existing.has(timestamp) ? timestamp : undefined,
      })
    }
    return points
  }

  const earliestByDay = new Map<number, UnixTime>()
  for (const snapshot of sorted) {
    const day = UnixTime.toStartOf(snapshot, 'day')
    if (!earliestByDay.has(day)) earliestByDay.set(day, snapshot)
  }
  const from = UnixTime.toStartOf(sorted[0] as UnixTime, 'day')
  const to = UnixTime.toStartOf(last, 'day')
  const points: HistoryPointSnapshot[] = []
  for (let t = from; t <= to; t += UnixTime.DAY) {
    points.push({ timestamp: UnixTime(t), snapshot: earliestByDay.get(t) })
  }
  return points
}

/**
 * The median of the values whose timestamps are within `window` seconds of
 * the one at `index`, without it. Skips points without a value.
 */
export function getWindowMedian(
  timestamps: number[],
  values: (number | undefined)[],
  index: number,
  window: number,
): number {
  const center = timestamps[index] as number
  const neighbours: number[] = []
  for (let i = 0; i < timestamps.length; i++) {
    const value = values[i]
    if (i === index || value === undefined) continue
    if (Math.abs((timestamps[i] as number) - center) <= window) {
      neighbours.push(value)
    }
  }
  if (neighbours.length === 0) return 0
  neighbours.sort((a, b) => a - b)
  const middle = Math.floor(neighbours.length / 2)
  return neighbours.length % 2 === 1
    ? (neighbours[middle] as number)
    : ((neighbours[middle - 1] as number) + (neighbours[middle] as number)) / 2
}
