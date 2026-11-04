import { UnixTime } from '@l2beat/shared-pure'

/**
 * Geometry shared by the audit timelines: the dashboard sparkline and the
 * project chart draw the same model, time left to right with audits above
 * the axis and upgrades below it, at different sizes.
 */

export interface TimeTick {
  /** Consecutive ticks differ by one, so labels can be thinned evenly. */
  ordinal: number
  label: string
  timestamp: number
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Every January 1st (UTC) strictly inside the range, ascending. */
export function getYearTicks(from: number, to: number): TimeTick[] {
  const ticks: TimeTick[] = []
  let year = new Date(from * 1000).getUTCFullYear()
  for (;;) {
    const timestamp = Date.UTC(year, 0, 1) / 1000
    if (timestamp >= to) break
    if (timestamp > from)
      ticks.push({ ordinal: year, label: `${year}`, timestamp })
    year++
  }
  return ticks
}

/** Every first of a month (UTC) strictly inside the range, ascending. */
export function getMonthTicks(from: number, to: number): TimeTick[] {
  const ticks: TimeTick[] = []
  const start = new Date(from * 1000)
  let year = start.getUTCFullYear()
  let month = start.getUTCMonth()
  for (;;) {
    const timestamp = Date.UTC(year, month, 1) / 1000
    if (timestamp >= to) break
    if (timestamp > from) {
      ticks.push({
        ordinal: year * 12 + month,
        label: `${MONTHS[month]} '${String(year).slice(2)}`,
        timestamp,
      })
    }
    month++
    if (month === 12) {
      month = 0
      year++
    }
  }
  return ticks
}

/** Years when the range spans at least two of them, months otherwise. */
export function getTimeTicks(from: number, to: number): TimeTick[] {
  const years = getYearTicks(from, to)
  return years.length >= 2 ? years : getMonthTicks(from, to)
}

/**
 * Labels every n-th tick so that labels are at least `minSpacing` px apart.
 * Anchored on multiples of n, so the labeled ticks do not shift as a project
 * ages.
 */
export function getLabeledTicks(
  ticks: TimeTick[],
  toX: (timestamp: number) => number,
  minSpacing: number,
): Set<number> {
  const first = ticks[0]
  const second = ticks[1]
  if (!first) return new Set()
  if (!second) return new Set([first.ordinal])
  const spacing = toX(second.timestamp) - toX(first.timestamp)
  const every = Math.max(1, Math.ceil(minSpacing / spacing))
  return new Set(
    ticks
      .filter((tick) => tick.ordinal % every === 0)
      .map((tick) => tick.ordinal),
  )
}

/** Maps the range onto [left, right] px. */
export function getTimeScale(
  from: number,
  to: number,
  left: number,
  right: number,
): (timestamp: number) => number {
  const span = Math.max(1, to - from)
  return (timestamp) => left + ((timestamp - from) / span) * (right - left)
}

/** Rough and readable: "2y 3mo", "5mo", "12d". */
export function formatDuration(seconds: number): string {
  const months = Math.round(seconds / (30.44 * UnixTime.DAY))
  if (months >= 12) {
    const years = Math.floor(months / 12)
    const rest = months % 12
    return rest === 0 ? `${years}y` : `${years}y ${rest}mo`
  }
  if (months >= 1) return `${months}mo`
  return `${Math.max(1, Math.round(seconds / UnixTime.DAY))}d`
}
