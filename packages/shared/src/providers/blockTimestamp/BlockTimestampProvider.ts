import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { BlockIndexerClient } from '../../clients'

interface BlockTimestampDataSource {
  readonly chain: string
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
}

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockProviders: BlockTimestampDataSource[]
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    chain: string,
  ): Promise<number> {
    const indexer = this.$.indexerClients.find((b) => b.chain === chain)
    const block = this.$.blockProviders.find((b) => b.chain === chain)

    if (!indexer) {
      assert(block, `Missing BlockTimestamp data sources for chain ${chain}`)
      return await block.getBlockNumberAtOrBefore(timestamp)
    }

    try {
      return await indexer.getBlockNumberAtOrBefore(timestamp)
    } catch (error) {
      if (block) {
        return await block.getBlockNumberAtOrBefore(timestamp)
      }
      throw error
    }
  }
}
