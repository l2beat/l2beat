import { UnixTime } from '@l2beat/shared-pure'

import { BlockIndexerClient } from '@l2beat/shared'

type BaseClient = {
  getBlockNumberAtOrBefore(timestamp: UnixTime, start?: number): Promise<number>
}

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockClients: BaseClient[]
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {}

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    for (const client of this.$.indexerClients) {
      try {
        return await client.getBlockNumberAtOrBefore(_timestamp)
      } catch (_) {}
    }

    for (const [index, client] of this.$.blockClients.entries()) {
      try {
        return await client.getBlockNumberAtOrBefore(_timestamp)
      } catch (error) {
        if (index === this.$.blockClients.length - 1) throw error
      }
    }

    throw new Error('Programmer error: Clients should not be empty')
  }
}
