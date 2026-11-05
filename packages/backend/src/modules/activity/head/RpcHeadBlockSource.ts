import type { IRpcClient } from '@l2beat/shared'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import type { UopsAnalyzer } from '../services/uops/types'
import type { HeadBlock, HeadBlockSource } from './ActivityHeadTracker'

/** Counts blocks the way the stored counts do, with their ancestry */
export class RpcHeadBlockSource implements HeadBlockSource {
  constructor(
    private readonly rpc: IRpcClient,
    private readonly uopsAnalyzer: UopsAnalyzer | undefined,
  ) {}

  getLatestBlockNumber(): Promise<number> {
    return this.withMetrics(() => this.rpc.getLatestBlockNumber())
  }

  getBlock(number: number): Promise<HeadBlock> {
    return this.withMetrics(async () => {
      const block = await this.rpc.getBlock(number, true)
      return {
        number: block.number,
        hash: block.hash,
        parentHash: block.parentHash,
        timestamp: block.timestamp,
        count: block.transactions.length,
        uopsCount: this.uopsAnalyzer?.calculateUops(block) ?? null,
      }
    })
  }

  private withMetrics<T>(fn: () => Promise<T>): Promise<T> {
    return withCoreFeatureRpcMetricsContext(
      'activity.head',
      { chain: this.rpc.chain, mode: 'head' },
      fn,
    )
  }
}
