import type { Logger } from '@l2beat/backend-tools'
import type { BlockTimestampProvider, IRpcClient } from '@l2beat/shared'
import { getBlockNumberAtOrBefore } from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'

const SLOT_SECONDS = 12
/** Enough for the token indexers, a few days apart, to share their hours. */
const MAX_REMEMBERED = 1_000

/**
 * Finds the last Ethereum block at or before a timestamp, over RPC. The
 * indexers walk consecutive hours and days, and at most one block comes per
 * 12-second slot, so the block found for an earlier timestamp bounds the
 * search to a few blocks. Only a timestamp with nothing earlier remembered
 * goes to the block timestamp provider, which asks Etherscan first, whose
 * daily limit the backfill would use up. RPC errors are thrown, not sent
 * there, so the indexer retries them.
 */
export class EthereumBlockFinder {
  private readonly found = new Map<UnixTime, Promise<number>>()
  private head = 0

  constructor(
    private readonly $: {
      rpc: Pick<IRpcClient, 'getBlockHeader' | 'getLatestBlockNumber'>
      blockTimestampProvider: Pick<
        BlockTimestampProvider,
        'getBlockNumberAtOrBefore'
      >
    },
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    chain: string,
  ): Promise<number> {
    assert(chain === 'ethereum', 'EthereumBlockFinder reads Ethereum only')
    let block = this.found.get(timestamp)
    if (!block) {
      block = this.find(timestamp)
      this.remember(timestamp, block)
    }
    return block
  }

  private async find(timestamp: UnixTime): Promise<number> {
    const earlier = this.latestBefore(timestamp)
    if (earlier !== undefined) {
      const block = await this.findAfter(earlier, timestamp)
      if (block !== undefined) return block
      this.logger.warn('Blocks came faster than slots', { earlier, timestamp })
    }
    return await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
      timestamp,
      'ethereum',
    )
  }

  /** Undefined when more blocks came than slots, so the bound doesn't hold. */
  private async findAfter(
    earlier: UnixTime,
    timestamp: UnixTime,
  ): Promise<number | undefined> {
    const from = await this.getBlockNumberAtOrBefore(earlier, 'ethereum')
    const bound = from + Math.ceil((timestamp - earlier) / SLOT_SECONDS)
    if (bound > this.head) {
      this.head = await this.$.rpc.getLatestBlockNumber()
    }
    const getBlock = (n: number) => this.$.rpc.getBlockHeader(n)
    const to = Math.min(bound, this.head)
    const block = await getBlockNumberAtOrBefore(timestamp, from, to, getBlock)
    if (block === bound && bound < this.head) {
      const next = await getBlock(bound + 1)
      if (next.timestamp <= timestamp) return undefined
    }
    return block
  }

  private latestBefore(timestamp: UnixTime): UnixTime | undefined {
    let latest: UnixTime | undefined
    for (const t of this.found.keys()) {
      if (t < timestamp && (latest === undefined || t > latest)) latest = t
    }
    return latest
  }

  private remember(timestamp: UnixTime, block: Promise<number>) {
    this.found.set(timestamp, block)
    block.catch(() => this.found.delete(timestamp))
    if (this.found.size > MAX_REMEMBERED) {
      const oldest = this.found.keys().next().value
      if (oldest !== undefined) this.found.delete(oldest)
    }
  }
}
