import { type AztecBlockClient, AztecBlockProvider } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'

export class AztecBlockProviders {
  private readonly blockProviders = new Map<string, AztecBlockProvider>()

  constructor(clients: AztecBlockClient[]) {
    const byChain = groupBy(clients, (client) => client.chain)
    for (const [chain, chainClients] of Object.entries(byChain)) {
      this.blockProviders.set(
        chain,
        new AztecBlockProvider(chain, chainClients),
      )
    }
  }

  getBlockProvider(chain: string): AztecBlockProvider {
    const blockProvider = this.blockProviders.get(chain)
    assert(blockProvider, `AztecBlockProvider not found: ${chain}`)
    return blockProvider
  }

  getAll(): AztecBlockProvider[] {
    return [...this.blockProviders.values()]
  }
}
