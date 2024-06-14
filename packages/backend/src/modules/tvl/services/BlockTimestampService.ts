import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

export interface BlockTimestampServiceDependencies {
  readonly blockTimestampProvider?: EtherscanClient | BlockscoutClient
  readonly rpcClient: RpcClient
  logger: Logger
}

export class BlockTimestampService {
  constructor(private readonly $: BlockTimestampServiceDependencies) {
    this.$.logger = $.logger.for(this)
    if (!$.blockTimestampProvider) {
      this.$.logger.warn(
        'No block timestamp provider configured. Fetching blocks will take longer.',
      )
    }
  }

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    if (this.$.blockTimestampProvider) {
      try {
        return await this.$.blockTimestampProvider.getBlockNumberAtOrBefore(
          _timestamp,
        )
      } catch (error) {
        this.$.logger.warn(
          'Failed to fetch block number via indexing provider. Trying to fetch using RPC.',
          error,
        )
        return await this.$.rpcClient.getBlockNumberAtOrBefore(_timestamp)
      }
    }

    return await this.$.rpcClient.getBlockNumberAtOrBefore(_timestamp)
  }
}
