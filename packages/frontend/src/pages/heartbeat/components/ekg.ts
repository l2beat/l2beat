import type { UnixTime } from '@l2beat/shared-pure'

/** Seconds a beat takes, from its first bump to its last */
export const BEAT_SECONDS = 0.8
/** The beat of a block with no transactions, so an idle chain still shows it is alive */
const IDLE_AMPLITUDE = 0.08

/**
 * A heartbeat as on an electrocardiogram: a bump, a dip, the tall spike, a
 * deeper dip and a wider bump. Takes the position within the beat from -0.5
 * to 0.5 and returns a height where the spike reaches 1
 */
export function beatShape(position: number): number {
  return (
    wave(position, -0.32, 0.05, 0.12) +
    wave(position, -0.07, 0.02, -0.12) +
    wave(position, 0, 0.025, 1) +
    wave(position, 0.07, 0.025, -0.28) +
    wave(position, 0.3, 0.07, 0.2)
  )
}

function wave(x: number, centre: number, width: number, height: number) {
  const d = (x - centre) / width
  return height * Math.exp(-0.5 * d * d)
}

/**
 * How tall a second's beat is next to the busiest second shown. The square
 * root keeps a single busy second from flattening the rest
 */
export function beatAmplitude(transactions: number, busiest: number): number {
  if (busiest <= 0 || transactions <= 0) return IDLE_AMPLITUDE
  return Math.max(IDLE_AMPLITUDE, Math.sqrt(transactions / busiest))
}

export interface TraceWindow {
  /** The seconds at the left and right edges */
  from: number
  to: number
  /** In pixels */
  width: number
}

/**
 * The trace's height at every pixel column, where 1 is the tallest spike. A
 * beat is drawn at the middle of its second, and beats close together add up
 */
export function traceHeights(
  beats: [UnixTime, number][],
  window: TraceWindow,
): Float32Array {
  const heights = new Float32Array(Math.max(0, Math.ceil(window.width)) + 1)
  const pixelsPerSecond = window.width / (window.to - window.from)
  const beatWidth = BEAT_SECONDS * pixelsPerSecond
  const busiest = Math.max(
    0,
    ...beats
      .filter(([second]) => second >= window.from - 1 && second <= window.to)
      .map(([, transactions]) => transactions),
  )
  for (const [second, transactions] of beats) {
    const centre = (second + 0.5 - window.from) * pixelsPerSecond
    if (centre + beatWidth / 2 < 0 || centre - beatWidth / 2 > window.width) {
      continue
    }
    const amplitude = beatAmplitude(transactions, busiest)
    const first = Math.max(0, Math.floor(centre - beatWidth / 2))
    const last = Math.min(heights.length - 1, Math.ceil(centre + beatWidth / 2))
    for (let x = first; x <= last; x++) {
      heights[x] =
        (heights[x] ?? 0) + amplitude * beatShape((x - centre) / beatWidth)
    }
  }
  return heights
}
