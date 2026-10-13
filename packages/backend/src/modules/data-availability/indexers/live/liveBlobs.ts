import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { Retries } from '@l2beat/uif'

/**
 * Blocks kept back from the head: about 25 hours, so that a whole day back
 * from any moment of the day is there to sum
 */
export const LIVE_WINDOW_BLOCKS = 7500

/** The oldest block kept while `head` is the newest */
export function liveWindowStart(head: number) {
  return head - LIVE_WINDOW_BLOCKS
}

/**
 * Retries without end, as the hourly indexers do, but never waiting longer
 * than a slot: the view is only worth anything while it keeps up. The first
 * retry comes soon, as most failures at the head are a node behind a load
 * balancer that has not got the newest block yet, and the next one has
 */
export function getLiveRetryStrategy() {
  return Retries.exponentialBackOff({
    initialTimeoutMs: 200,
    maxAttempts: Number.POSITIVE_INFINITY,
    maxTimeoutMs: SLOT_SECONDS * 1000,
  })
}

export const LIVE_METRICS_CONTEXT = 'dataAvailability.live'

/** Seconds from `timestamp` to `now`, to the hundredth, for the logs */
export function secondsSince(timestamp: number, now: number) {
  return Math.round((now - timestamp) * 100) / 100
}

/** Unix seconds with the fraction, which `UnixTime.now` drops */
export function nowSeconds() {
  return Date.now() / 1000
}
