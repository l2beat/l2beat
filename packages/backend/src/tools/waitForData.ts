import type { Logger } from '@l2beat/backend-tools'
import { DataNotReadyError, TargetNotReadyError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

const POLL_INTERVAL_MS = 60_000

// A chain with no block for this long after the target has stalled, and its
// tip is the last block at or before the target. It equals the default clock
// offset, so at that offset a stalled chain's tip is used at once.
const MAX_TARGET_WAIT = UnixTime.HOUR

// Data that is minutes away must not go through the indexer retry strategy,
// whose exponential back-off grows to an hour and would add the lag back. Each
// wait is logged, which also satisfies the alerting that expects an indexer to
// log at least hourly. The log messages are static because monitoring queries
// Kibana for them.

/**
 * Resolves the block or slot for a target timestamp, waiting while the chain
 * tip has not passed the timestamp yet. Returns the tip once the chain has
 * had MAX_TARGET_WAIT to produce a block after the timestamp.
 */
export async function waitForTarget(
  resolve: () => Promise<number>,
  options: {
    logger: Logger
    chain: string
    timestamp: UnixTime
  },
): Promise<number> {
  const { logger, chain, timestamp } = options
  const start = Date.now()
  let attempts = 0
  while (true) {
    try {
      const result = await resolve()
      if (attempts > 0) {
        const waitedMs = Date.now() - start
        logger.info('Target ready after wait', {
          chain,
          timestamp,
          waitedMs,
          attempts,
        })
      }
      return result
    } catch (error) {
      if (!(error instanceof TargetNotReadyError)) throw error
      if (UnixTime.now() - timestamp >= MAX_TARGET_WAIT) {
        logger.warn('Chain stalled, using tip', {
          chain,
          timestamp,
          tip: error.tip,
          tipTimestamp: error.tipTimestamp,
        })
        return error.tip
      }
      attempts++
      logger.info('Target not ready, waiting', {
        chain,
        timestamp,
        tipTimestamp: error.tipTimestamp,
        lagSeconds: timestamp - error.tipTimestamp,
        attempt: attempts,
      })
      await sleep(POLL_INTERVAL_MS)
    }
  }
}

/**
 * Fetches prices, waiting while CoinGecko has not published the hour yet.
 * Stops waiting once `signal` is aborted.
 */
export async function waitForPrices<T>(
  fetch: () => Promise<T>,
  options: { logger: Logger; priceId: string; signal?: AbortSignal },
): Promise<T> {
  let attempts = 0
  while (true) {
    try {
      return await fetch()
    } catch (error) {
      if (!(error instanceof DataNotReadyError)) throw error
      if (options.signal?.aborted) throw error
      attempts++
      options.logger.info('Price not published, waiting', {
        priceId: options.priceId,
        attempt: attempts,
      })
      await sleep(POLL_INTERVAL_MS, options.signal)
      if (options.signal?.aborted) throw error
    }
  }
}

/**
 * Promise.all for a batch of waitForPrices calls. Once one item fails the
 * batch is rejected, so the signal stops the waits of the others.
 */
export async function allOrCancel<T, R>(
  items: T[],
  run: (item: T, signal: AbortSignal) => Promise<R>,
): Promise<R[]> {
  const controller = new AbortController()
  try {
    return await Promise.all(items.map((item) => run(item, controller.signal)))
  } finally {
    controller.abort()
  }
}

/**
 * CoinGecko may not have published the last hours of the range for some coins
 * yet. Keeps the records up to the last hour every coin has, so the next
 * update fetches the rest again.
 */
export function keepPublishedHours<T extends { timestamp: number }>(
  results: { records: T[]; lastHour: number }[],
  range: { from: number; to: number },
  logger: Logger,
): { records: T[]; syncedTo: number } {
  const syncedTo = Math.min(range.to, ...results.map((r) => r.lastHour))
  if (syncedTo < range.to) {
    logger.info('Price range shrunk to available hours', {
      from: range.from,
      to: range.to,
      adjustedTo: syncedTo,
      missingHours: (range.to - syncedTo) / UnixTime.HOUR,
    })
  }
  const records = results
    .flatMap((r) => r.records)
    .filter((r) => r.timestamp <= syncedTo)
  return { records, syncedTo }
}

// The global setTimeout, unlike node:timers/promises, is replaced by fake
// timers, so tests skip the wait.
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const onAbort = () => {
      clearTimeout(timeout)
      resolve()
    }
    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
