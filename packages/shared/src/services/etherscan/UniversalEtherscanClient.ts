import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import { EtherscanLikeClient } from '../etherscanlike/EtherscanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'

export class UniversalEtherscanClient
  extends EtherscanLikeClient
  implements BlockNumberProvider
{
  constructor(
    httpClient: HttpClient,
    apiUrl: string,
    apiKey: string,
    minTimestamp: UnixTime,
    private readonly chainId: ChainId,
    logger = Logger.SILENT,
  ) {
    super(httpClient, apiUrl, apiKey, minTimestamp, logger)
  }

  getChainId(): ChainId {
    return this.chainId
  }
}
