import { UnixTime } from '@l2beat/shared-pure'

// Shared with the client, so nothing server-only here

/** How long the backend keeps blocks, so how far back the live view reaches */
export const LIVE_BUFFER_SECONDS = 4 * UnixTime.HOUR

/**
 * Whether the chain's newest stored block is recent enough to show as live.
 * An older one means its blocks are no longer followed, or the follower is
 * stuck. Longer than the head of chains the RPC proxy syncs from Envio lags
 */
export function isLiveFresh(newest: UnixTime | undefined, now: UnixTime) {
  return newest !== undefined && newest >= now - 30 * UnixTime.MINUTE
}

export const LIVE_RANGES = {
  '5m': 5 * UnixTime.MINUTE,
  '15m': 15 * UnixTime.MINUTE,
  '1h': UnixTime.HOUR,
  '4h': LIVE_BUFFER_SECONDS,
} as const
export type LiveRange = keyof typeof LIVE_RANGES
/** What the live view opens on */
export const DEFAULT_LIVE_RANGE: LiveRange = '15m'

/** The fewest seconds per bar, 150 bars whatever the range */
export const LIVE_BUCKET_SECONDS: Record<LiveRange, number> = {
  '5m': 2,
  '15m': 6,
  '1h': 24,
  '4h': 96,
}

/** [timestamp, transactions, user operations, blocks, gas] of a bucket with blocks */
export type LiveActivityPoint = [UnixTime, number, number, number, number]
