import { UnixTime } from '@l2beat/shared-pure'
import { scaleUtc } from 'd3-scale'
import { formatMonthYear } from './format'

export const COLORS = {
  issuance: 'var(--chart-ethereum)',
  burn: 'var(--chart-orange)',
  net: 'var(--primary)',
  price: 'var(--chart-cyan)',
  staked: 'var(--chart-emerald)',
}

/** Nullable values grouped into runs without nulls, for gapped lines. */
export function nonNullRuns<T>(
  items: T[],
  value: (item: T) => number | null,
): { item: T; value: number }[][] {
  const runs: { item: T; value: number }[][] = []
  let run: { item: T; value: number }[] = []
  for (const item of items) {
    const v = value(item)
    if (v === null) {
      if (run.length > 0) runs.push(run)
      run = []
    } else {
      run.push({ item, value: v })
    }
  }
  if (run.length > 0) runs.push(run)
  return runs
}

/** Index of the item nearest to `x` in a sorted numeric accessor. */
export function nearestIndex<T>(
  items: T[],
  x: number,
  key: (item: T) => number,
): number {
  let lo = 0
  let hi = items.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (key(items[mid] as T) < x) lo = mid
    else hi = mid
  }
  const a = items[lo]
  const b = items[hi]
  if (a === undefined || b === undefined) return lo
  return Math.abs(key(a) - x) <= Math.abs(key(b) - x) ? lo : hi
}

/** Calendar-aligned ticks between two days, as unix seconds with labels. */
export function timeTicks(
  from: number,
  to: number,
  count: number,
): { timestamp: number; label: string }[] {
  const short = to - from < 120 * UnixTime.DAY
  const ticks = scaleUtc()
    .domain([new Date(from * 1000), new Date(to * 1000)])
    .ticks(count)
  // d3 only approximates the count, and month labels need the room.
  const every = Math.ceil(ticks.length / count)
  return ticks
    .filter((_, i) => i % every === 0)
    .map((d) => {
      const timestamp = d.getTime() / 1000
      return {
        timestamp,
        label: short
          ? d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              timeZone: 'UTC',
            })
          : formatMonthYear(timestamp),
      }
    })
}

/** Marker labels left to right, dropping one that would hit the last. */
export function placeLabels<T extends { name: string }>(
  items: T[],
  xOf: (item: T) => number,
  maxX: number,
  charWidth = 5.4,
): (T & { x: number; showLabel: boolean })[] {
  let end = Number.NEGATIVE_INFINITY
  return items.map((item) => {
    const x = xOf(item)
    const w = item.name.length * charWidth + 8
    const showLabel = x + 4 > end + 6 && x + 4 + w <= maxX
    if (showLabel) end = x + 4 + w
    return { ...item, x, showLabel }
  })
}
