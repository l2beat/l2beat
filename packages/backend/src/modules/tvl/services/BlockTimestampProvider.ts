import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { BlockIndexerClient } from '@l2beat/shared'

type BaseClient = {
  getBlockNumberAtOrBefore(timestamp: UnixTime, start?: number): Promise<number>
}

interface Dependencies {
  readonly indexerClients: BlockIndexerClient[]
  readonly blockClients: BaseClient[]
  logger: Logger
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
    if ($.indexerClients.length === 0) {
      this.$.logger.warn(
        'No blockExplorerClient configured. Fetching blocks will take longer.',
      )
    }
  }

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    for (const client of this.$.indexerClients) {
      try {
        return await client.getBlockNumberAtOrBefore(_timestamp)
      } catch (_) {}
    }

    this.$.logger.warn(
      'Failed to fetch block number via blockExplorerClient. Trying to fetch using RPC.',
    )

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
