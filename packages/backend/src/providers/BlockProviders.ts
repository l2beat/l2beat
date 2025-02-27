import {
  type BlockClient,
  type BlockIndexerClient,
  BlockProvider,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { BlockTimestampProvider } from '../modules/tvl/services/BlockTimestampProvider'

export class BlockProviders {
  blockProviders: Map<string, BlockProvider> = new Map()
  timestampProviders: Map<string, BlockTimestampProvider> = new Map()

  constructor(clients: BlockClient[], indexerClients: BlockIndexerClient[]) {
    const byChain = groupBy(clients, (c) => c.chain)
    for (const [chain, clients] of Object.entries(byChain)) {
      const block = new BlockProvider(chain, clients)
      this.blockProviders.set(chain, block)

      const timestamp = new BlockTimestampProvider({
        blockProvider: block,
        indexerClients: indexerClients.filter((c) => c.chain === chain),
      })
      this.timestampProviders.set(chain, timestamp)
    }
  }

  getBlockProvider(chain: string) {
    const blockProvider = this.blockProviders.get(chain)
    assert(blockProvider, `BlockProvider not found: ${chain}`)
    return blockProvider
  }

  getBlockTimestampProvider(chain: string) {
    const timestampProvider = this.timestampProviders.get(chain)
    assert(timestampProvider, `TimestampProvider not found: ${chain}`)
    return timestampProvider
  }
}
