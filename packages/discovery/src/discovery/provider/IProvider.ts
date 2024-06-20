import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { Bytes, providers } from 'ethers'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { RateLimitedProvider } from './RateLimitedProvider'

export interface ContractSource {
  name: string
  isVerified: boolean
  abi: string[]
  source: string
  solidityVersion: string
  constructorArguments: string
}

export interface ContractDeployment {
  deployer: EthereumAddress
  transactionHash: Hash256
  blockNumber: number
  timestamp: UnixTime
}

export interface IProvider {
  readonly blockNumber: number
  readonly chain: string

  switchBlock(blockNumber: number): IProvider
  switchChain(chain: string, blockNumber: number): IProvider

  /** Needs to return values that survive JSON serialization! */
  raw<T>(
    cacheKey: string,
    fn: (providers: {
      baseProvider: providers.JsonRpcProvider | RateLimitedProvider
      eventProvider: providers.JsonRpcProvider | RateLimitedProvider
      etherscanLikeClient: EtherscanLikeClient
    }) => Promise<T>,
  ): Promise<T>

  call(address: EthereumAddress, data: Bytes): Promise<Bytes>
  callMethod<T>(
    address: EthereumAddress,
    abi: string,
    args: unknown[],
  ): Promise<T | undefined>

  getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes>
  getStorageAsAddress(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<EthereumAddress>
  getStorageAsBigint(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<bigint>

  getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
  ): Promise<providers.Log[]>
  getEvents(
    address: EthereumAddress,
    abi: string,
    args: unknown[],
    // biome-ignore lint/suspicious/noExplicitAny: TODO: LogDescription
  ): Promise<{ log: providers.Log; event: any }[]>

  getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse>
  getDebugTrace(transactionHash: Hash256): Promise<DebugTransactionCallResponse>

  getBytecode(address: EthereumAddress): Promise<Bytes>
  getSource(address: EthereumAddress): Promise<ContractSource>
  getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined>
}
