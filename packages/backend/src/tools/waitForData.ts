import { setTimeout as sleep } from 'node:timers/promises'
import type { Logger } from '@l2beat/backend-tools'
import { DataNotReadyError, TargetNotReadyError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

export const DEFAULT_NOT_READY_POLL_INTERVAL_MS = 60_000

// Data that is minutes away must not go through the indexer retry strategy,
// whose exponential back-off grows to an hour and would add the lag back. Each
// wait is logged, which also satisfies the alerting that expects an indexer to
// log at least hourly. The log messages are static because monitoring queries
// Kibana for them.

/**
 * Resolves the block or slot for a target timestamp, waiting while the chain
 * tip has not passed the timestamp yet.
 */
export async function waitForTarget<T>(
  resolve: () => Promise<T>,
  options: {
    logger: Logger
    chain: string
    timestamp: UnixTime
    pollIntervalMs?: number
  },
): Promise<T> {
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
      attempts++
      logger.info('Target not ready, waiting', {
        chain,
        timestamp,
        tipTimestamp: error.tipTimestamp,
        lagSeconds: timestamp - error.tipTimestamp,
        attempt: attempts,
      })
      await sleep(options.pollIntervalMs ?? DEFAULT_NOT_READY_POLL_INTERVAL_MS)
    }
  }
}

/** Fetches prices, waiting while CoinGecko has not published the hour yet. */
export async function waitForPrices<T>(
  fetch: () => Promise<T>,
  options: { logger: Logger; priceId: string; pollIntervalMs?: number },
): Promise<T> {
  let attempts = 0
  while (true) {
    try {
      return await fetch()
    } catch (error) {
      if (!(error instanceof DataNotReadyError)) throw error
      attempts++
      options.logger.info('Price not published, waiting', {
        priceId: options.priceId,
        attempt: attempts,
      })
      await sleep(options.pollIntervalMs ?? DEFAULT_NOT_READY_POLL_INTERVAL_MS)
    }
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
