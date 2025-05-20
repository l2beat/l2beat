import { type SvmBlockClient, SvmBlockProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

export class SvmBlockProviders {
  blockProviders: Map<string, SvmBlockProvider> = new Map()

  constructor(clients: SvmBlockClient[]) {
    const byChain = groupBy(clients, (c) => c.chain)
    for (const [chain, clients] of Object.entries(byChain)) {
      const block = new SvmBlockProvider(chain, clients)
      this.blockProviders.set(chain, block)
    }
  }

  getBlockProvider(chain: string) {
    const blockProvider = this.blockProviders.get(chain)
    assert(blockProvider, `SvmBlockProvider not found: ${chain}`)
    return blockProvider
  }
}
