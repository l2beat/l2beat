import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'

import { Logger } from '../../tools'
import { EtherscanLikeClient } from '../etherscanlike/EtherscanLikeClient'
import { HttpClient } from '../HttpClient'
import { BlockNumberProvider } from '../providers/BlockNumberProvider'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
} from './model'

export class EtherscanError extends Error {}

export class EtherscanClient
  extends EtherscanLikeClient
  implements BlockNumberProvider
{
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
