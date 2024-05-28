import { Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { BlockscoutClient, EtherscanClient } from '@l2beat/shared'
import {} from '../../../peripherals/multicall/codecs'
import {} from '../../../peripherals/multicall/types'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'

export interface BlockTimestampServiceDependencies {
  readonly blockTimestampProvider: EtherscanClient | BlockscoutClient
  readonly rpcClient: RpcClient
  logger: Logger
}

export class BlockTimestampService {
  constructor(private readonly $: BlockTimestampServiceDependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    //TODO
    return await Promise.resolve(-1)
  }
}
