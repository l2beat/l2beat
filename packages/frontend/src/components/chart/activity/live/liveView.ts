import { parseTimestamp } from '~/utils/dates'
import { toLiveLength } from '~/utils/range/liveRanges'

interface Edges {
  from: number
  to: number
}

/** The share of the window an arrow key moves it by */
const KEY_STEP = 1 / 10

/**
 * Where a window of `seconds` asked to end at `end` does: within the buffer,
 * and undefined, so following the newest block, once it reaches it
 */
export function clampTo(
  end: number | undefined,
  buffer: Edges | undefined,
  seconds: number,
) {
  if (end === undefined || buffer === undefined) return undefined
  const clamped = Math.max(buffer.from + seconds, end)
  return clamped >= buffer.to ? undefined : clamped
}

/** What the reads have without a break, in bars of `bucket` seconds */
interface Read extends Edges {
  bucket: number
}

/**
 * Whether the reads have the whole `view`: both edges, as a read can end well
 * before the newest block. A bar may be missing on the right, as a read ends
 * on the last whole one, short of the newest block
 */
export function isRead(
  view: [number, number] | undefined,
  read: Read | undefined,
): view is [number, number] {
  return (
    view !== undefined &&
    read !== undefined &&
    view[0] >= read.from &&
    view[1] <= read.to + read.bucket
  )
}

/**
 * What the charts show of the window asked for. The window itself when it is
 * the window read's `own`, which trails its data, or when the reads have it,
 * then ending no later than they do, as a slow chain's missing bar is wide.
 * Otherwise where the charts were `last` while the reads have that, and
 * without that either, the window read's own view, `live`
 */
export function getLiveView({
  asked,
  own,
  last,
  live,
  read,
}: {
  asked: [number, number] | undefined
  own: boolean
  last: [number, number] | undefined
  live: [number, number] | undefined
  read: Read | undefined
}): {
  view: [number, number] | undefined
  /** Whether the view is the window asked for */
  covered: boolean
  /** Whether the charts stay where they were */
  kept: boolean
} {
  if (own) return { view: asked, covered: true, kept: false }
  if (read && isRead(asked, read)) {
    const past = Math.min(Math.max(0, asked[1] - read.to), asked[0] - read.from)
    return {
      view: [asked[0] - past, asked[1] - past],
      covered: true,
      kept: false,
    }
  }
  if (isRead(last, read)) return { view: last, covered: false, kept: true }
  return { view: live, covered: false, kept: false }
}

/**
 * Whether the reads drawn are held as they are. Under the pointer, as
 * tooltips read where bars are drawn, once this window's data is read. And
 * looking back while either read is on its way, as a window read alone does
 * not have the window looked back to, and a new buffer read alone may not
 * meet the old window read
 */
export function holdsReads({
  hovered,
  lookingBack,
  window,
  whole,
}: {
  hovered: boolean
  lookingBack: boolean
  window: { isRead: boolean; pending: boolean }
  whole: { pending: boolean }
}) {
  return (
    (hovered && window.isRead) ||
    (lookingBack && (!window.isRead || window.pending || whole.pending))
  )
}

/** How long the charts take to cover 63% of the way to a window asked for */
export const CHASE_MS = 80

/**
 * The charts' view `elapsedMs` later on its way to `goal`: each edge covers
 * the same share of what it has left, so the view slows as it arrives.
 * Undefined once there, within a 2000th of the goal, under a pixel
 */
export function chase(
  view: [number, number],
  goal: [number, number],
  elapsedMs: number,
): [number, number] | undefined {
  const left = Math.exp(-Math.max(0, elapsedMs) / CHASE_MS)
  const from = goal[0] + (view[0] - goal[0]) * left
  const to = goal[1] + (view[1] - goal[1]) * left
  const near = (goal[1] - goal[0]) / 2000
  return Math.abs(from - goal[0]) < near && Math.abs(to - goal[1]) < near
    ? undefined
    : [from, to]
}

/** A window on the overview, before it is read */
export interface LiveTarget {
  /** Undefined at the newest block, as it moves on */
  end: number | undefined
  seconds: number
  /** A resize's: read ending on the bucket its edge is in, not the next one */
  exact?: boolean
  /** A resize by the left edge: the window keeps the end it was asked for */
  holdsEnd?: boolean
}

/**
 * Where a window asked for ends, undefined following the newest block, within
 * the buffer as it may have moved on since
 */
export function getTargetEnd(target: LiveTarget, buffer: Edges | undefined) {
  return clampTo(target.end, buffer, target.seconds)
}

/**
 * Where a window asked for ends once read: as the overview shows it, so
 * following the newest block is decided before rounding, then on a bucket,
 * so moves within one share a read
 */
export function getMoveEnd(
  target: LiveTarget,
  buffer: Edges | undefined,
  bucket: number,
) {
  const end = getTargetEnd(target, buffer)
  if (end === undefined) return undefined
  const down = end - (end % bucket)
  if (target.exact || buffer === undefined) return down
  // a move up to a bucket while that stays short of the newest block, so a
  // key's step back and one forward return to it
  const up = Math.ceil(end / bucket) * bucket
  return clampTo(up < buffer.to ? up : down, buffer, target.seconds)
}

const back = (end: number, _: Edges, seconds: number) =>
  end - seconds * KEY_STEP
// in whole steps back from the newest block, as it moves on between presses,
// so a step back and one forward return to it
const forward = (end: number, buffer: Edges, seconds: number) => {
  const step = seconds * KEY_STEP
  const steps = Math.round((buffer.to - end) / step)
  return buffer.to - Math.max(0, steps - 1) * step
}
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

export type LiveEdge = 'from' | 'to'

/**
 * The edge of the window `[left, right]` at `x`, within `reach` outside it
 * and at most `inside` within, so a narrow window's middle still moves it
 */
export function getEdgeAt(
  x: number,
  [left, right]: [number, number],
  reach: number,
  inside = reach,
): LiveEdge | undefined {
  const inner = Math.min(inside, (right - left) / 3)
  if (x >= left - reach && x <= left + inner) return 'from'
  if (x >= right - inner && x <= right + reach) return 'to'
}

/**
 * A window resized by its left edge, ending where the strip shows it, at
 * `end`. It holds the end asked for, or after a move not yet read, where the
 * move put it
 */
export function holdEnd(
  end: number | undefined,
  seconds: number,
  moved: boolean,
): LiveTarget {
  return moved
    ? { end, seconds, exact: true }
    : { end, seconds, holdsEnd: true }
}

/**
 * The window the left edge makes, dragged `by` seconds in (negative out) from
 * a window drawn `drawn` long, ending at `end`, or at the newest block for
 * undefined, at the length it is read. Not dragged in, the buffer's start
 * does not shorten it below `current`, the length asked for
 */
export function getResizedFrom(
  drawn: number,
  by: number,
  current: number,
  end: number | undefined,
  buffer: Edges,
  moved: boolean,
): LiveTarget {
  const next = toLiveLength(drawn - by, (end ?? buffer.to) - buffer.from)
  return holdEnd(end, by <= 0 ? Math.max(next, current) : next, moved)
}

/**
 * The window the right edge dragged to `at` makes, starting at `start`, at
 * the length it is read. Dragged to the newest block it follows it
 */
export function getResizedTo(
  at: number,
  start: number,
  buffer: Edges,
): LiveTarget {
  if (at >= buffer.to) {
    return {
      end: undefined,
      seconds: toLiveLength(buffer.to - start),
      exact: true,
    }
  }
  // short of the newest block, so rounding doesn't end it there
  const seconds = toLiveLength(at - start, buffer.to - start - 1)
  return { end: start + seconds, seconds, exact: true }
}

/**
 * Where a finger, reaching edges only from outside the window, finds them. An
 * edge within `reach` of the strip's side is moved inside the window, by at
 * most a third of its width, so it can be reached and the middle still moves
 * the window
 */
export function getTouchEdges(
  [left, right]: [number, number],
  width: number,
  reach: number,
): [number, number] {
  const most = (right - left) / 3
  return [
    Math.max(left, Math.min(reach, left + most)),
    Math.min(right, Math.max(width - reach, right - most)),
  ]
}

/**
 * The length a key with Shift asks a window ending at `end` for, moving its
 * left edge: back to lengthen, forward to shorten. Undefined for a key that
 * resizes nothing
 */
export function getKeyLength(
  key: string,
  seconds: number,
  end: number,
  buffer: Edges,
) {
  if (!key.startsWith('Arrow')) return undefined
  const longer = key === 'ArrowLeft' || key === 'ArrowDown'
  const next = toLiveLength(
    seconds * (1 + (longer ? KEY_STEP : -KEY_STEP)),
    end - buffer.from,
  )
  // the buffer's start may cap a length under the one it has
  return longer ? Math.max(next, seconds) : Math.min(next, seconds)
}

/** Every multiple of `step` from `from` to `to` */
export function ticksOf(from: number, to: number, step: number) {
  const ticks: number[] = []
  for (let t = Math.ceil(from / step) * step; t <= to; t += step) ticks.push(t)
  return ticks
}

/** Without "UTC", which the axis would repeat on every tick */
export function formatTick(timestamp: number) {
  return parseTimestamp(timestamp).time
}
