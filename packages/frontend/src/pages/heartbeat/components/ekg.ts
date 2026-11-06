import type { UnixTime } from '@l2beat/shared-pure'

/**
 * A heartbeat as on an electrocardiogram, as [x, y] points from x = -0.5 to
 * 0.5: a bump, a dip, the spike that reaches y = 1, a deeper dip and a wider
 * bump. Drawn as lines between the points, so the spike's tip moves smoothly
 * between pixels rather than flickering
 */
export const BEAT_SHAPE: [number, number][] = [
  [-0.5, 0],
  [-0.38, 0],
  [-0.33, 0.09],
  [-0.27, 0.11],
  [-0.22, 0],
  [-0.09, 0],
  [-0.05, -0.12],
  [0, 1],
  [0.05, -0.3],
  [0.09, 0],
  [0.2, 0],
  [0.27, 0.14],
  [0.34, 0.18],
  [0.41, 0.08],
  [0.5, 0],
]
/** Pixels a beat takes, whatever the chain's pace */
export const BEAT_WIDTH = 22
/** Pixels at least from one beat to the next, so each reads as a beat */
const MIN_BEAT_SPACING = 32
/** The beat of seconds with no transactions, so an idle chain still shows it is alive */
const IDLE_AMPLITUDE = 0.08

/**
 * Seconds summed into one beat: a whole number, as short as the spacing
 * allows. Busy chains have a block every second, too close to tell apart
 */
export function secondsPerBeat(pixelsPerSecond: number): number {
  return Math.max(1, Math.ceil(MIN_BEAT_SPACING / pixelsPerSecond))
}

/**
 * Sums the seconds into beats of `seconds` each, counted from the epoch so a
 * beat holds the same seconds as it scrolls. Keyed by the beat's first second
 */
export function toBeats(
  seconds: [UnixTime, number][],
  perBeat: number,
): [UnixTime, number][] {
  const beats = new Map<UnixTime, number>()
  for (const [second, transactions] of seconds) {
    const start = second - (second % perBeat)
    beats.set(start, (beats.get(start) ?? 0) + transactions)
  }
  return [...beats].sort(([a], [b]) => a - b)
}

/**
 * How tall a beat is next to the busiest one, at most the full height: a
 * sweep keeps the scale it starts with, so a later beat can be busier. The
 * square root keeps a single busy beat from flattening the rest
 */
export function beatAmplitude(transactions: number, busiest: number): number {
  if (busiest <= 0 || transactions <= 0) return IDLE_AMPLITUDE
  return Math.min(
    1,
    Math.max(IDLE_AMPLITUDE, Math.sqrt(transactions / busiest)),
  )
}

export interface TraceWindow {
  /** The seconds at the left and right edges */
  from: number
  to: number
  /** In pixels */
  width: number
}

/**
 * The trace across the window as points, in pixels across and heights where
 * 1 is the tallest spike. Each beat is drawn in the middle of its seconds,
 * and the line runs flat between beats
 */
export function tracePoints(
  beats: [UnixTime, number][],
  perBeat: number,
  busiest: number,
  window: TraceWindow,
): [number, number][] {
  const pixelsPerSecond = window.width / (window.to - window.from)
  const points: [number, number][] = [[-BEAT_WIDTH, 0]]
  for (const [start, transactions] of beats) {
    const centre = (start + perBeat / 2 - window.from) * pixelsPerSecond
    if (centre + BEAT_WIDTH / 2 < 0) continue
    if (centre - BEAT_WIDTH / 2 > window.width) break
    const amplitude = beatAmplitude(transactions, busiest)
    for (const [x, y] of BEAT_SHAPE) {
      points.push([centre + x * BEAT_WIDTH, y * amplitude])
    }
  }
  points.push([window.width + BEAT_WIDTH, 0])
  return points
}

/**
 * The part of the line between `from` and `to` across, cut where it crosses
 * them, so a beat the pen is drawing shows only as far as the pen
 */
export function clipPoints(
  points: [number, number][],
  from: number,
  to: number,
): [number, number][] {
  const clipped: [number, number][] = []
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1] ?? [0, 0]
    const [x1, y1] = points[i] ?? [0, 0]
    if (x1 < from || x0 > to || x1 === x0) continue
    const at = (x: number): [number, number] => [
      x,
      y0 + ((y1 - y0) * (x - x0)) / (x1 - x0),
    ]
    if (clipped.length === 0) clipped.push(x0 < from ? at(from) : [x0, y0])
    clipped.push(x1 > to ? at(to) : [x1, y1])
  }
  return clipped
}
