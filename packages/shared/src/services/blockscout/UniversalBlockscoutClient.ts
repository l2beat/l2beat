import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'
import { BlockscoutLikeClient } from './BlockscoutLikeClient'

export class UniversalBlockscoutClient
  extends BlockscoutLikeClient
  implements BlockNumberProvider
{
  constructor(
    httpClient: HttpClient,
    apiUrl: string,
    minTimestamp: UnixTime,
    private readonly chainId: ChainId,
    logger = Logger.SILENT,
  ) {
    super(httpClient, apiUrl, minTimestamp, logger)
  }

  getChainId(): ChainId {
    return this.chainId
  }
}
