import { formatRange, parseTimestamp } from '~/utils/dates'

interface Edges {
  from: number
  to: number
}

/** The share of the window an arrow key moves it by */
const KEY_STEP = 1 / 10
/**
 * The share of the window its end may be from the newest block and still
 * follow it. Under a key's step, so one press back from there stops following
 */
const FOLLOW_WITHIN = KEY_STEP / 2

/**
 * Where a window of `seconds` asked to end at `end` does: within the buffer,
 * and undefined, so following the newest block, once close to it
 */
export function clampTo(
  end: number | undefined,
  buffer: Edges | undefined,
  seconds: number,
) {
  if (end === undefined || buffer === undefined) return undefined
  const clamped = Math.max(buffer.from + seconds, end)
  return clamped >= buffer.to - seconds * FOLLOW_WITHIN ? undefined : clamped
}

const back = (end: number, _: Edges, seconds: number) =>
  end - seconds * KEY_STEP
const forward = (end: number, _: Edges, seconds: number) =>
  end + seconds * KEY_STEP
const KEY_ENDS = new Map<
  string,
  (end: number, buffer: Edges, seconds: number) => number
>([
  ['ArrowLeft', back],
  ['ArrowDown', back],
  ['ArrowRight', forward],
  ['ArrowUp', forward],
  ['Home', (_, buffer, seconds) => buffer.from + seconds],
  ['End', (_, buffer) => buffer.to],
])

export function isMoveKey(key: string) {
  return KEY_ENDS.has(key)
}

/**
 * Where the key asks a window of `seconds` ending at `end` to end, before it
 * is clamped. Undefined for a key that moves nothing
 */
export function getKeyEnd(
  key: string,
  end: number,
  buffer: Edges,
  seconds: number,
) {
  return KEY_ENDS.get(key)?.(end, buffer, seconds)
}

/** Every multiple of `step` from `from` to `to` */
export function ticksOf(from: number, to: number, step: number) {
  const ticks: number[] = []
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t)
  return ticks
}

/** Buckets are counted from the epoch, so any time in one gives its start */
export function formatBucket(timestamp: number, bucket: number) {
  const start = Math.floor(timestamp / bucket) * bucket
  return formatRange(start, start + bucket, { seconds: true })
}

/** Without "UTC", which the axis would repeat on every tick */
export function formatTick(timestamp: number) {
  return parseTimestamp(timestamp).time
}
