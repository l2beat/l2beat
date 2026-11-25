import { UnixTime } from '@l2beat/shared-pure'

export const LIVE_RANGE_KEYS = ['5m', '15m', '1h', '4h'] as const
export type LiveRange = (typeof LIVE_RANGE_KEYS)[number]

/** The preset lengths, in seconds */
export const LIVE_RANGES: Record<LiveRange, number> = {
  '5m': 5 * UnixTime.MINUTE,
  '15m': 15 * UnixTime.MINUTE,
  '1h': UnixTime.HOUR,
  '4h': 4 * UnixTime.HOUR,
}
/** What the live view opens on */
export const DEFAULT_LIVE_RANGE: LiveRange = '15m'
/** The whole buffer, `LIVE_BUFFER_SECONDS` */
export const LIVE_BUFFER_RANGE: LiveRange = '4h'

const MIN_SECONDS = LIVE_RANGES['5m']
const MAX_SECONDS = LIVE_RANGES[LIVE_BUFFER_RANGE]
/** A resized window's length is a multiple, so a drag reads once a step */
const LENGTH_STEP = UnixTime.MINUTE

/**
 * A window's length as it is read: in whole steps, from the shortest preset
 * to the buffer, and to `max` when that is longer than the shortest
 */
export function toLiveLength(seconds: number, max = MAX_SECONDS) {
  const longest = Math.max(
    MIN_SECONDS,
    Math.floor(Math.min(max, MAX_SECONDS) / LENGTH_STEP) * LENGTH_STEP,
  )
  const rounded = Math.round(seconds / LENGTH_STEP) * LENGTH_STEP
  return Math.min(Math.max(rounded, MIN_SECONDS), longest)
}

/** The preset of this length */
export function getLiveRange(seconds: number) {
  return LIVE_RANGE_KEYS.find((key) => LIVE_RANGES[key] === seconds)
}

/** The fewest whole seconds per bar, about 150 bars whatever the length */
export function getLiveBucketSeconds(seconds: number) {
  return Math.ceil(seconds / 150)
}

const TICKS = [1, 2, 3, 5, 10, 15, 30, 60].map((m) => m * UnixTime.MINUTE)

/** The seconds between time ticks, four or five to a window */
export function getLiveTick(seconds: number) {
  return TICKS.find((tick) => tick >= seconds / 5) ?? UnixTime.HOUR
}

/** How the length reads after "last" */
export function formatLiveLength(seconds: number) {
  const hours = Math.floor(seconds / UnixTime.HOUR)
  const minutes = Math.round((seconds % UnixTime.HOUR) / UnixTime.MINUTE)
  if (hours === 0) return `${minutes} min`
  if (minutes > 0) return `${hours} h ${minutes} min`
  return hours === 1 ? 'hour' : `${hours} hours`
}

/** Days before today whose same hours make the usual rate */
export const LIVE_USUAL_DAYS = 7

/**
 * Behind where it heads by more, as after a hidden tab, a window following
 * the newest block jumps there. The server reads as much before the window,
 * so one that far behind still has its left edge
 */
export const LIVE_JUMP_SECONDS = 60
