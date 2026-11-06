import type { IRpcClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { toActivityBlock } from '../../../providers/ActivityBlockProviders'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import type { BlockTxsCountService } from '../services/txs/BlockTxsCountService'
import type { UopsAnalyzer } from '../services/uops/types'
import type { BlockFetcher, LinkedBlock } from './HeadFollower'
import type { BlockHashSource } from './StoredBlockSource'

/** Counts each block as the activity indexer would, so a stored block can stand in for fetching it */
export class RpcBlockFetcher implements BlockFetcher, BlockHashSource {
  constructor(
    private readonly rpc: IRpcClient,
    private readonly uopsAnalyzer: UopsAnalyzer | undefined,
    private readonly counter: BlockTxsCountService,
  ) {}

  getLatestBlockNumber(): Promise<number> {
    return this.rpc.getLatestBlockNumber()
  }

  /** Asked by the activity indexer, outside the follower's metrics */
  getBlockHash(number: number): Promise<string> {
    return withCoreFeatureRpcMetricsContext(
      'activity.live',
      { chain: this.rpc.chain, mode: 'verify' },
      async () => (await this.rpc.getBlock(number, false)).hash,
    )
  }

  async getBlocks(from: number, to: number): Promise<LinkedBlock[]> {
    return await Promise.all(
      range(from, to + 1).map(async (number) => {
        const block = await this.rpc.getBlockWithTransactions(number)
        assert(
          block.number === number,
          `Invalid response: expected block number ${number}, got ${block.number}`,
        )
        return {
          ...this.counter.adjust(toActivityBlock(block, this.uopsAnalyzer)),
          hash: block.hash,
          parentHash: block.parentHash,
          gasUsed: block.gasUsed,
        }
      }),
    )
  }
}
