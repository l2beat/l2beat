import { ChainId, stringAsInt, UnixTime } from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import { EtherscanLikeClient } from '../etherscanlike/EtherscanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'

export class ArbiscanClient
  extends EtherscanLikeClient
  implements BlockNumberProvider
{
  static API_URL = 'https://api.arbiscan.io/api'

  constructor(httpClient: HttpClient, apiKey: string, logger = Logger.SILENT) {
    super(httpClient, ArbiscanClient.API_URL, apiKey, logger)
  }

  getChainId(): ChainId {
    return ChainId.ARBITRUM
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.call('block', 'getblocknobytime', {
      timestamp: timestamp.toString(),
      closest: 'before',
    })
    return stringAsInt().parse(result)
  }
}
