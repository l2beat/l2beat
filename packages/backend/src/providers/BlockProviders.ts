import { type BlockClient, BlockProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

export class BlockProviders {
  blockProviders: Map<string, BlockProvider> = new Map()

  constructor(clients: BlockClient[]) {
    const byChain = groupBy(clients, (c) => c.chain)
    for (const [chain, clients] of Object.entries(byChain)) {
      const block = new BlockProvider(chain, clients)
      this.blockProviders.set(chain, block)
    }
  }

  getBlockProvider(chain: string) {
    const blockProvider = this.blockProviders.get(chain)
    assert(blockProvider, `BlockProvider not found: ${chain}`)
    return blockProvider
  }
}
