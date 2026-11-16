import type { Logger } from '@l2beat/backend-tools'
import { DataNotReadyError, TargetNotReadyError } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer, Retries, type RetryStrategy } from '@l2beat/uif'

const POLL_INTERVAL_MS = 60_000

// A chain with no block for this long after the target has stalled, and its
// tip is the last block at or before the target. It equals the default clock
// offset, so at that offset a stalled chain's tip is used at once.
const MAX_TARGET_WAIT = UnixTime.HOUR

/**
 * Retries DataNotReadyError every minute and other errors with `otherwise`.
 * Data that is minutes away must not go through the exponential back-off,
 * which grows to an hour and would add the lag back.
 */
export function retryWhileNotReady(
  otherwise: RetryStrategy = Indexer.getInfiniteRetryStrategy(),
): RetryStrategy {
  return Retries.withExpectedWait({
    isExpected: (error) => error instanceof DataNotReadyError,
    intervalMs: POLL_INTERVAL_MS,
    otherwise,
  })
}

/**
 * Resolves the block or slot for a target timestamp. Once the chain has had
 * MAX_TARGET_WAIT to produce a block after the timestamp, returns its tip
 * instead of throwing TargetNotReadyError, so a stalled chain cannot stop the
 * indexer.
 */
export async function useTipIfStalled(
  resolve: () => Promise<number>,
  options: {
    logger: Logger
    chain: string
    timestamp: UnixTime
  },
): Promise<number> {
  const { logger, chain, timestamp } = options
  try {
    return await resolve()
  } catch (error) {
    if (
      !(error instanceof TargetNotReadyError) ||
      UnixTime.now() - timestamp < MAX_TARGET_WAIT
    ) {
      throw error
    }
    logger.warn('Chain stalled, using tip', {
      chain,
      timestamp,
      tip: error.tip,
      tipTimestamp: error.tipTimestamp,
    })
    return error.tip
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
