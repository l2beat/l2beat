import type { UnixTime } from '@l2beat/shared-pure'
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
    for (const client of indexers) {
      try {
        return await client.getBlockNumberAtOrBefore(timestamp)
      } catch (_) {}
    }

    const clients = this.$.blockProviders.filter((b) => b.chain === chain)
    for (const [index, client] of clients.entries()) {
      try {
        return await client.getBlockNumberAtOrBefore(timestamp)
      } catch (error) {
        if (index === clients.length - 1) throw error
      }
    }

    throw new Error(`BlockTimestamp data sources`)
  }
}
