import { UnixTime } from '@l2beat/shared-pure'

/**
 * Excluded: a lane-day above this. It is the promotion rule `maxLaneVolume`,
 * which the backend applies to new snapshots; history from before it was
 * never checked.
 */
export const LANE_CAP_USD = 1_000_000_000

/**
 * Flagged, not excluded: a protocol's token-day, over all its lanes and after
 * the lane cap, above this and many times its usual day. Real whale moves
 * look the same, so these stay in the data.
 */
export const FLAG_TOKEN_VOLUME_USD = 500_000_000
export const FLAG_TOKEN_MULTIPLIER = 50
/** "Usual" is the token's median on the protocol over this window. */
export const FLAG_BASELINE_WINDOW = 14 * UnixTime.DAY

/**
 * Zero day, marked only: a protocol with no transfers at a point while its
 * median over ±7 days is at least this.
 */
export const ZERO_DAY_MIN_USUAL_TRANSFERS = { daily: 50, hourly: 5 }
export const ZERO_DAY_WINDOW = 7 * UnixTime.DAY

/** Fewer timed transfers than this make no transfer-time point. */
export const MIN_TIMED_TRANSFERS = 20
