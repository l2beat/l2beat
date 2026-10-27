import type { UnixTime } from '@l2beat/shared-pure'

/**
 * The data for a timestamp does not exist yet but is expected soon, e.g. the
 * chain has not produced a block past the timestamp, or CoinGecko has not
 * published the hourly point. Callers should wait and ask again instead of
 * storing an earlier value under the timestamp.
 */
export class DataNotReadyError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'DataNotReadyError'
  }
}

/** The chain has not produced a block after the target timestamp yet. */
export class TargetNotReadyError extends DataNotReadyError {
  constructor(
    readonly timestamp: UnixTime,
    /** The newest block or slot, the answer if the chain has stalled. */
    readonly tip: number,
    readonly tipTimestamp: UnixTime,
  ) {
    super('No block after the timestamp yet', {
      cause: { timestamp, tip, tipTimestamp },
    })
    this.name = 'TargetNotReadyError'
  }
}
