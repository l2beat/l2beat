import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
} from '../etherscan/model'
import { EtherscanLikeClient } from '../etherscanlike/EtherscanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'

export class ArbiscanClient
  extends EtherscanLikeClient
  implements BlockNumberProvider
{
  static API_URL = 'https://api.arbiscan.io/api'

  constructor(
    httpClient: HttpClient,
    apiKey: string,
    minTimestamp: UnixTime,
    logger = Logger.SILENT,
  ) {
    super(httpClient, ArbiscanClient.API_URL, apiKey, minTimestamp, logger)
  }

  getChainId(): ChainId {
    return ChainId.ARBITRUM
  }
  async getContractSource(address: EthereumAddress) {
    const response = await this.call('contract', 'getsourcecode', {
      address: address.toString(),
    })
    return ContractSourceResult.parse(response)[0]
  }

  async getContractDeploymentTx(address: EthereumAddress): Promise<Hash256> {
    const response = await this.call('contract', 'getcontractcreation', {
      contractaddresses: address.toString(),
    })

    return ContractCreatorAndCreationTxHashResult.parse(response)[0].txHash
  }
}
