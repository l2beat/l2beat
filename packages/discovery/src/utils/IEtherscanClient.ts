import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import type { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { CombiningEtherscanClient } from './CombiningEtherscanClient'

// If a given instance of Etherscan does not support some endpoint set a
// corresponding variable to true, otherwise do not set to anything -
// `undefined` is treated as supported.
export interface EtherscanUnsupportedMethods {
  getContractCreation?: boolean
}

interface EtherscanExplorerConfig {
  type: 'etherscan'
  url: string
  chainId: number
  apiKey: string
  unsupported?: EtherscanUnsupportedMethods
}

interface EtherscanV1ExplorerConfig {
  type: 'etherscan-v1'
  url: string
  apiKey: string
  unsupported?: EtherscanUnsupportedMethods
}

interface BlockscoutExplorerConfig {
  type: 'blockscout'
  url: string
  unsupported?: EtherscanUnsupportedMethods
}

interface RoutescanExplorerConfig {
  type: 'routescan'
  url: string
  unsupported?: EtherscanUnsupportedMethods
}

interface SourcifyExplorerConfig {
  type: 'sourcify'
  chainId: number
}

export interface Transaction {
  input: string
  to: EthereumAddress
  hash: Hash256
}

export type ExplorerConfig =
  | EtherscanExplorerConfig
  | EtherscanV1ExplorerConfig
  | BlockscoutExplorerConfig
  | RoutescanExplorerConfig
  | SourcifyExplorerConfig

export interface ContractSource {
  name: string
  rootFile: string | undefined
  isVerified: boolean
  abi: string[]
  solidityVersion: string
  constructorArguments: string
  files: Record<string, string>
  remappings: string[]
  libraries: Record<string, EthereumAddress>
  compilerSettings?: {
    optimizer?: { enabled?: boolean; runs?: number }
    evmVersion?: string
    viaIR?: boolean
    metadata?: {
      bytecodeHash?: string
      useLiteralContent?: boolean
      appendCBOR?: boolean
    }
    debug?: {
      revertStrings: string
      debugInfo?: string[]
    }
  }
}

export interface IEtherscanClient {
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
  getContractSource(address: EthereumAddress): Promise<ContractSource>
  getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined>

  getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime>
  getAtMost10RecentOutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Transaction[]>
}

export function getExplorerClient(
  httpClient: HttpClient,
  configs: ExplorerConfig[],
  logger: Logger = Logger.SILENT,
): IEtherscanClient {
  return new CombiningEtherscanClient(httpClient, configs, logger)
}
