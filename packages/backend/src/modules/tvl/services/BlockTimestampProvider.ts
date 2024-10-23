import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { BlockIndexerClient } from '@l2beat/shared'

export type BaseClient = {
  getBlockNumberAtOrBefore(timestamp: UnixTime, start?: number): Promise<number>
}

interface Dependencies {
  readonly blockExplorerClient?: BlockIndexerClient
  readonly client: BaseClient
  logger: Logger
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
    if (!$.blockExplorerClient) {
      this.$.logger.warn(
        'No blockExplorerClient configured. Fetching blocks will take longer.',
      )
    }
  }

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    if (this.$.blockExplorerClient) {
      try {
        return await this.$.blockExplorerClient.getBlockNumberAtOrBefore(
          _timestamp,
        )
      } catch (error) {
        this.$.logger.warn(
          'Failed to fetch block number via blockExplorerClient. Trying to fetch using RPC.',
          error,
        )
      }
    }

    return await this.$.client.getBlockNumberAtOrBefore(_timestamp)
  }
}
