import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import { EtherscanLikeClient } from '../etherscanlike/EtherscanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'

export class OptiscanClient
  extends EtherscanLikeClient
  implements BlockNumberProvider
{
  static API_URL = 'https://api-optimistic.etherscan.io/api'

  constructor(
    httpClient: HttpClient,
    apiKey: string,
    minTimestamp: UnixTime,
    logger = Logger.SILENT,
  ) {
    super(httpClient, OptiscanClient.API_URL, apiKey, minTimestamp, logger)
  }

  getChainId(): ChainId {
    return ChainId.OPTIMISM
  }
}
