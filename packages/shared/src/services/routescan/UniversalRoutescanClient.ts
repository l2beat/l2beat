import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { RoutescanLikeClient } from '../routescan/RoutescanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'

export class UniversalRoutescanClient
  extends RoutescanLikeClient
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
