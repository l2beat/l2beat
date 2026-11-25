import { UnixTime } from '@l2beat/shared-pure'

export const LIVE_RANGE_KEYS = ['5m', '15m', '1h', '4h'] as const
export type LiveRange = (typeof LIVE_RANGE_KEYS)[number]

/**
 * Each range's length, the seconds between its time ticks, and how it reads
 * after "last"
 */
export const LIVE_RANGES: Record<
  LiveRange,
  { seconds: number; tick: number; label: string }
> = {
  '5m': { seconds: 5 * UnixTime.MINUTE, tick: UnixTime.MINUTE, label: '5 min' },
  '15m': {
    seconds: 15 * UnixTime.MINUTE,
    tick: 3 * UnixTime.MINUTE,
    label: '15 min',
  },
  '1h': { seconds: UnixTime.HOUR, tick: 15 * UnixTime.MINUTE, label: 'hour' },
  '4h': { seconds: 4 * UnixTime.HOUR, tick: UnixTime.HOUR, label: '4 hours' },
}
/** What the live view opens on */
export const DEFAULT_LIVE_RANGE: LiveRange = '15m'
/** The whole buffer, `LIVE_BUFFER_SECONDS` */
export const LIVE_BUFFER_RANGE: LiveRange = '4h'

/** The fewest seconds per bar, 150 bars whatever the range */
export function getLiveBucketSeconds(range: LiveRange) {
  return LIVE_RANGES[range].seconds / 150
}

/** Days before today whose same hours make the usual rate */
export const LIVE_USUAL_DAYS = 7

/**
 * Behind where it heads by more, as after a hidden tab, a window following
 * the newest block jumps there. The server reads as much before the window,
 * so one that far behind still has its left edge
 */
export const LIVE_JUMP_SECONDS = 60
