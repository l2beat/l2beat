import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { BlockIndexerClient } from '../../clients'
import type { BlockNumberAtOrBeforeOptions } from '../../tools/getBlockNumberAtOrBefore'

interface BlockTimestampDataSource {
  readonly chain: string
  getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    start?: number,
    options?: BlockNumberAtOrBeforeOptions,
  ): Promise<number>
  getBlockTimestamp(blockNumber: number): Promise<UnixTime>
}

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockProviders: BlockTimestampDataSource[]
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  /**
   * Returns the last block with a timestamp at or before `timestamp`. Throws
   * TargetNotReadyError while the chain has no block after `timestamp` yet,
   * because until then blocks still to come may belong at or before it.
   *
   * The explorer answer costs two extra RPC calls: the block and the next one
   * are fetched to prove that the answer is the last block at or before
   * `timestamp`. An explorer that has not indexed that far yet, stepped back
   * to an earlier block or answered from another fork fails the check and the
   * RPC search is used instead. The RPC search reuses the tip it already
   * fetches, so it costs nothing extra. A chain with an explorer only has
   * nothing to check against, so its explorer answer is returned as it is.
   */
  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    chain: string,
  ): Promise<number> {
    const indexer = this.$.indexerClients.find((b) => b.chain === chain)
    const block = this.$.blockProviders.find((b) => b.chain === chain)

    if (!block) {
      assert(indexer, 'Missing block data source for chain', { chain })
      return await indexer.getBlockNumberAtOrBefore(timestamp)
    }

    if (indexer) {
      try {
        const blockNumber = await indexer.getBlockNumberAtOrBefore(timestamp)
        if (await isLastBlockAtOrBefore(block, blockNumber, timestamp)) {
          return blockNumber
        }
      } catch {
        // fall back to the RPC search below
      }
    }

    return await block.getBlockNumberAtOrBefore(timestamp, undefined, {
      requireLaterBlock: true,
    })
  }
}

async function isLastBlockAtOrBefore(
  source: BlockTimestampDataSource,
  blockNumber: number,
  timestamp: UnixTime,
): Promise<boolean> {
  try {
    const [blockTimestamp, nextTimestamp] = await Promise.all([
      source.getBlockTimestamp(blockNumber),
      source.getBlockTimestamp(blockNumber + 1),
    ])
    return blockTimestamp <= timestamp && nextTimestamp > timestamp
  } catch {
    // most likely the next block does not exist yet
    return false
  }
}
