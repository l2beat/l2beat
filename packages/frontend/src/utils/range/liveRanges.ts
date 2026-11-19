import { UnixTime } from '@l2beat/shared-pure'

// Shared with the client, so nothing server-only here

/**
 * Whether the chain's newest stored block is recent enough to show as live.
 * An older one means its blocks are no longer followed, or the follower is
 * stuck. Longer than the head of chains the RPC proxy syncs from Envio lags
 */
export function isLiveFresh(newest: UnixTime | undefined, now: UnixTime) {
  return newest !== undefined && newest >= now - 30 * UnixTime.MINUTE
}

export const LIVE_RANGE_KEYS = ['5m', '15m', '1h', '4h'] as const
export type LiveRange = (typeof LIVE_RANGE_KEYS)[number]

/**
 * Each range's length, the seconds between its time ticks, and how it reads
 * after "last". The longest is the whole buffer, `LIVE_BUFFER_SECONDS`
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

/** The fewest seconds per bar, 150 bars whatever the range */
export function getLiveBucketSeconds(range: LiveRange) {
  return LIVE_RANGES[range].seconds / 150
}
