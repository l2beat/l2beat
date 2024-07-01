import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { BlockscoutClient } from './BlockscoutClient'
import { EtherscanClient } from './EtherscanClient'
import { HttpClient } from './HttpClient'

// If a given instance of Etherscan does not support some endpoint set a
// corresponding variable to true, otherwise do not set to anything -
// `undefined` is treated as supported.
export interface EtherscanUnsupportedMethods {
  getContractCreation?: boolean
}

export interface EtherscanExplorerConfig {
  type: 'etherscan'
  url: string
  apiKey: string
  unsupported?: EtherscanUnsupportedMethods
}

export interface BlockscoutExplorerConfig {
  type: 'blockscout'
  url: string
  unsupported?: EtherscanUnsupportedMethods
}

export type ExplorerConfig = EtherscanExplorerConfig | BlockscoutExplorerConfig

export interface ContractSource {
  name: string
  isVerified: boolean
  abi: string[]
  solidityVersion: string
  constructorArguments: string
  files: Record<string, string>
  remappings: string[]
}

export interface IEtherscanClient {
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
  getContractSource(address: EthereumAddress): Promise<ContractSource>
  getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined>

  getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime>
  getLast10OutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]>
}

export function getExplorerClient(
  httpClient: HttpClient,
  config: ExplorerConfig,
): IEtherscanClient {
  switch (config.type) {
    case 'etherscan': {
      return EtherscanClient.createForDiscovery(
        httpClient,
        config.url,
        config.apiKey,
        config.unsupported,
      )
    }
    case 'blockscout': {
      return new BlockscoutClient(httpClient, config.url, config.unsupported)
    }
    default: {
      throw new Error('Unknown explorer type')
    }
  }
}
