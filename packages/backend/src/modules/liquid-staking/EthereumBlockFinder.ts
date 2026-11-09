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
 * daily limit the backfill would use up.
 */
export class EthereumBlockFinder {
  private readonly found = new Map<UnixTime, Promise<number>>()

  constructor(
    private readonly $: {
      rpc: Pick<IRpcClient, 'getBlockHeader'>
      blockTimestampProvider: Pick<
        BlockTimestampProvider,
        'getBlockNumberAtOrBefore'
      >
    },
  ) {}

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
      try {
        return await this.findAfter(earlier, timestamp)
      } catch {
        // The bound can pass the chain's head, or the earlier search failed
      }
    }
    return await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
      timestamp,
      'ethereum',
    )
  }

  private async findAfter(
    earlier: UnixTime,
    timestamp: UnixTime,
  ): Promise<number> {
    const from = await this.getBlockNumberAtOrBefore(earlier, 'ethereum')
    const to = from + Math.ceil((timestamp - earlier) / SLOT_SECONDS)
    const getBlock = (n: number) => this.$.rpc.getBlockHeader(n)
    const block = await getBlockNumberAtOrBefore(timestamp, from, to, getBlock)
    // The bound holds for 12-second slots only; a block after it at or before
    // the timestamp means it didn't
    if (block === to) {
      const next = await getBlock(to + 1)
      assert(next.timestamp > timestamp, 'More blocks than slots')
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
