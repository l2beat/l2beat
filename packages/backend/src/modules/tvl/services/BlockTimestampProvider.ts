import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

interface Dependencies {
  readonly blockTimestampClient?: EtherscanClient | BlockscoutClient
  readonly rpcClient: RpcClient
  logger: Logger
}

export class BlockTimestampProvider {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
    if (!$.blockTimestampClient) {
      this.$.logger.warn(
        'No blockTimestampClient configured. Fetching blocks will take longer.',
      )
    }
  }

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    if (this.$.blockTimestampClient) {
      try {
        return await this.$.blockTimestampClient.getBlockNumberAtOrBefore(
          _timestamp,
        )
      } catch (error) {
        this.$.logger.warn(
          'Failed to fetch block number via blockTimestampClient. Trying to fetch using RPC.',
          error,
        )
        return await this.$.rpcClient.getBlockNumberAtOrBefore(_timestamp)
      }
    }

    return await this.$.rpcClient.getBlockNumberAtOrBefore(_timestamp)
  }
}
