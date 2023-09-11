import { Logger } from '@l2beat/backend-tools'

import { ChainId } from './ChainId'
import { EtherscanLikeClient } from './EtherscanLikeClient'
import { HttpClient } from './HttpClient'
import { UnixTime } from './UnixTime'

export class EtherscanError extends Error {}

export class EtherscanClient extends EtherscanLikeClient {
  static API_URL = 'https://api.etherscan.io/api'

  constructor(
    httpClient: HttpClient,
    apiKey: string,
    minTimestamp: UnixTime,
    logger = Logger.SILENT,
  ) {
    super(httpClient, EtherscanClient.API_URL, apiKey, minTimestamp, logger)
  }

  getChainId(): ChainId {
    return ChainId.ETHEREUM
  }
}
