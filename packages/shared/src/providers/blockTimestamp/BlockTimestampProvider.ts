import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { BlockIndexerClient } from '../../clients'
import type { BlockProvider } from '../block/BlockProvider'

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockProviders: BlockProvider[]
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  async getBlockNumberAtOrBefore(
    timestamp: UnixTime,
    chain: string,
  ): Promise<number> {
    const indexers = this.$.indexerClients.filter((i) => i.chain === chain)
    for (const [index, client] of indexers.entries()) {
      try {
        return await client.getBlockNumberAtOrBefore(timestamp)
      } catch (error) {
        if (index === indexers.length - 1) {
          const block = this.$.blockProviders.find((b) => b.chain === chain)

          if (block) {
            return await block.getBlockNumberAtOrBefore(timestamp)
          } else {
            throw error
          }
        }
      }
    }

    const block = this.$.blockProviders.find((b) => b.chain === chain)
    assert(block, 'Missing BlockTimestamp data sources')

    return await block.getBlockNumberAtOrBefore(timestamp)
  }
}
