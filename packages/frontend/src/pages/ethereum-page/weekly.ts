import { formatRange } from '~/utils/dates'
import { posterWeights, type SimulatedPoster } from './live/simulatedHead'
import type { DailyPoint } from './live/simulatedHistory'
import { median } from './metrics'

/**
 * The section stories compare the last seven complete days with the seven
 * before them. A week evens out weekday swings, and complete days keep a
 * half-finished today from dragging every figure down.
 */
export interface Weeks {
  current: DailyPoint[]
  previous: DailyPoint[]
  /** "5 — 12 Nov 2026", the site's range format */
  label: string
}

const DAY = 86_400
const WEEK = 7
const SLOTS_PER_DAY = DAY / 12
export function lastTwoWeeks(history: DailyPoint[]): Weeks | undefined {
  if (history.length < 2 * WEEK) return undefined
  const current = history.slice(-WEEK)
  const previous = history.slice(-2 * WEEK, -WEEK)
  const first = current[0]
  const last = current.at(-1)
  if (!first || !last) return undefined
  return {
    current,
    previous,
    label: formatRange(first.timestamp, last.timestamp + DAY).replace(
      '\n',
      ' ',
    ),
  }
}

export function sumOf(days: DailyPoint[], pick: (p: DailyPoint) => number) {
  return days.reduce((sum, p) => sum + pick(p), 0)
}

export function medianOf(days: DailyPoint[], pick: (p: DailyPoint) => number) {
  return median(days.map(pick)) ?? 0
}

/** Relative change, e.g. 0.12 for 12% more */
export function changeOf(current: number, previous: number) {
  return previous === 0 ? 0 : current / previous - 1
}

export const blocksOf = (p: DailyPoint) => SLOTS_PER_DAY - p.missedSlots
export const txsOf = (p: DailyPoint) => p.tps * DAY

export interface PosterShare {
  posterId: string
  blobs: number
  share: number
}

/**
 * Blobs per poster over the days given, biggest first. The prototype's
 * history has no per-poster split, so it spreads each day's blobs by the
 * simulation's long-run shares with a seeded wobble; the real page reads the
 * per-poster daily rollup the blobs page already has.
 */
export function posterShares(
  days: DailyPoint[],
  posters: SimulatedPoster[],
): PosterShare[] {
  const weights = posterWeights(posters)
  const totals = new Map<string, number>()
  for (const day of days) {
    const wobbled = weights.map((w) => ({
      id: w.id,
      weight: w.weight * (0.8 + 0.4 * wobble(day.timestamp, w.id)),
    }))
    const sum = wobbled.reduce((s, w) => s + w.weight, 0)
    for (const w of wobbled) {
      const blobs = Math.round((day.blobs * w.weight) / sum)
      totals.set(w.id, (totals.get(w.id) ?? 0) + blobs)
    }
  }
  const all = [...totals.values()].reduce((s, b) => s + b, 0)
  return [...totals.entries()]
    .map(([posterId, blobs]) => ({
      posterId,
      blobs,
      share: all === 0 ? 0 : blobs / all,
    }))
    .sort((a, b) => b.blobs - a.blobs)
}

/** 0..1, the same for the same day and poster on the server and in the browser */
function wobble(timestamp: number, id: string) {
  let h = timestamp
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
  return (h % 10_000) / 10_000
}
