import type { BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

interface Anchor {
  blockNumber: number
  timestamp: UnixTime
}

const BLOCK_TIME_SAMPLE = 1000
const BLOCK_TIME_SMOOTHING = 0.3

/**
 * Resolves "highest block at or before `target`" for a target that only moves
 * forward. A range search re-probes the whole [lastKnown, tip] window every
 * tick; extrapolating from the previously resolved block instead costs at most
 * one eth_getBlockByNumber. The answer may sit up to `toleranceSeconds` behind
 * the exact one, which makes ticks that barely move the target free.
 */
export class TipBlockTracker {
  private anchor: Anchor | undefined
  private blockTime: number | undefined

  constructor(
    private readonly provider: BlockProvider,
    private readonly toleranceSeconds: number,
    private readonly maxProbes = 4,
  ) {}

  async getBlockNumberAtOrBefore(target: UnixTime): Promise<number> {
    const anchor = this.anchor
    if (anchor === undefined || this.blockTime === undefined) {
      return await this.bootstrap(target)
    }

    if (target - anchor.timestamp <= this.toleranceSeconds) {
      return anchor.blockNumber
    }

    return await this.extrapolate(target, anchor)
  }

  private async extrapolate(target: UnixTime, from: Anchor): Promise<number> {
    let anchor = from
    // Exclusive upper bound: lowest block known to be past the target.
    let upperBound = (await this.provider.getLatestBlockNumber()) + 1

    for (let probe = 0; probe < this.maxProbes; probe++) {
      const behind = target - anchor.timestamp
      if (behind <= this.toleranceSeconds) break

      const blockTime = this.blockTime ?? 1
      const step = Math.max(1, Math.round(behind / blockTime))
      const guess = Math.min(anchor.blockNumber + step, upperBound - 1)
      if (guess <= anchor.blockNumber) break

      const timestamp = await this.provider.getBlockTimestamp(guess)
      this.recordBlockTime(
        (timestamp - anchor.timestamp) / (guess - anchor.blockNumber),
      )

      if (timestamp <= target) {
        anchor = { blockNumber: guess, timestamp }
      } else {
        upperBound = guess
      }
    }

    this.anchor = anchor
    return anchor.blockNumber
  }

  private async bootstrap(target: UnixTime): Promise<number> {
    const blockNumber = await this.provider.getBlockNumberAtOrBefore(
      target,
      this.anchor?.blockNumber ?? 1,
    )
    const sampleFrom = Math.max(1, blockNumber - BLOCK_TIME_SAMPLE)
    const [timestamp, sampleTimestamp] = await Promise.all([
      this.provider.getBlockTimestamp(blockNumber),
      sampleFrom === blockNumber
        ? undefined
        : this.provider.getBlockTimestamp(sampleFrom),
    ])

    if (sampleTimestamp !== undefined) {
      this.recordBlockTime(
        (timestamp - sampleTimestamp) / (blockNumber - sampleFrom),
      )
    }
    this.anchor = { blockNumber, timestamp: UnixTime(timestamp) }
    return blockNumber
  }

  private recordBlockTime(sample: number): void {
    if (!Number.isFinite(sample) || sample <= 0) return
    this.blockTime =
      this.blockTime === undefined
        ? sample
        : this.blockTime * (1 - BLOCK_TIME_SMOOTHING) +
          sample * BLOCK_TIME_SMOOTHING
  }
}
