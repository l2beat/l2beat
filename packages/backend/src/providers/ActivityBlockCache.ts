import { type Block, UnixTime } from '@l2beat/shared-pure'
import type { ActivityBlock } from '../modules/activity/services/txs/types'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'
import type { BlockProcessor } from '../modules/types'

/**
 * Chains covered by both block-sync and block-mode activity used to download
 * every block twice - once at the tip and once ~an hour later for the counts.
 * Block-sync now publishes the few numbers activity needs instead.
 *
 * 100k blocks is ~2.8h on the fastest chain we track, comfortably more than the
 * hour activity lags behind the tip.
 */
const DEFAULT_CAPACITY = 100_000
const NO_UOPS = -1

class ChainRing {
  private readonly numbers: Float64Array
  private readonly timestamps: Float64Array
  private readonly txsCounts: Int32Array
  private readonly uopsCounts: Int32Array

  constructor(private readonly capacity: number) {
    this.numbers = new Float64Array(capacity).fill(-1)
    this.timestamps = new Float64Array(capacity)
    this.txsCounts = new Int32Array(capacity)
    this.uopsCounts = new Int32Array(capacity)
  }

  set(block: ActivityBlock): void {
    const index = block.number % this.capacity
    this.numbers[index] = block.number
    this.timestamps[index] = block.timestamp
    this.txsCounts[index] = block.txsCount
    this.uopsCounts[index] = block.uopsCount ?? NO_UOPS
  }

  get(blockNumber: number): ActivityBlock | undefined {
    const index = blockNumber % this.capacity
    if (this.numbers[index] !== blockNumber) return undefined
    const uopsCount = this.uopsCounts[index]
    return {
      number: blockNumber,
      timestamp: UnixTime(this.timestamps[index]),
      txsCount: this.txsCounts[index],
      uopsCount: uopsCount === NO_UOPS ? null : uopsCount,
    }
  }
}

export class ActivityBlockCache {
  private readonly rings = new Map<string, ChainRing>()

  constructor(private readonly capacity: number = DEFAULT_CAPACITY) {}

  enable(chain: string): void {
    if (!this.rings.has(chain)) {
      this.rings.set(chain, new ChainRing(this.capacity))
    }
  }

  set(chain: string, block: ActivityBlock): void {
    this.rings.get(chain)?.set(block)
  }

  get(chain: string, blockNumber: number): ActivityBlock | undefined {
    return this.rings.get(chain)?.get(blockNumber)
  }
}

export class ActivityBlockCacheProcessor implements BlockProcessor {
  constructor(
    readonly chain: string,
    private readonly cache: ActivityBlockCache,
    private readonly uopsAnalyzer: UopsAnalyzer | undefined,
  ) {}

  processBlock(block: Block): Promise<void> {
    this.cache.set(this.chain, {
      number: block.number,
      timestamp: UnixTime(block.timestamp),
      txsCount: block.transactions.length,
      uopsCount: this.uopsAnalyzer?.calculateUops(block) ?? null,
    })
    return Promise.resolve()
  }
}
