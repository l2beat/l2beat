import type { UnixTime } from '@l2beat/shared-pure'

import type { BlockIndexerClient, BlockProvider } from '@l2beat/shared'

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockProvider: BlockProvider
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    for (const client of this.$.indexerClients) {
      try {
        return await client.getBlockNumberAtOrBefore(_timestamp)
      } catch (_) {}
    }

    return await this.$.blockProvider.getBlockNumberAtOrBefore(_timestamp)
  }
}
