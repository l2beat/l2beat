import type { BlobClient, BlobsInBlock } from '@l2beat/shared'
import type {
  Bytes,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import type { providers, utils } from 'ethers'
import type { IEtherscanClient } from '../../utils/IEtherscanClient'
import type { ContractSource } from '../../utils/IEtherscanClient'
import type { DebugTransactionCallResponse } from './DebugTransactionTrace'

export interface ContractDeployment {
  deployer: EthereumAddress
  transactionHash: Hash256
  blockNumber: number
  timestamp: UnixTime
}

export interface RawProviders {
  baseProvider: providers.JsonRpcProvider
  eventProvider: providers.JsonRpcProvider
  etherscanClient: IEtherscanClient
  blobClient?: BlobClient
}

export interface IProvider {
  readonly blockNumber: number
  readonly chain: string

  switchBlock(blockNumber: number): IProvider
  switchChain(chain: string, blockNumber: number): IProvider

  /** Needs to return values that survive JSON serialization! */
  raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders) => Promise<T>,
  ): Promise<T>

  call(address: EthereumAddress, data: Bytes): Promise<Bytes>
  callUnbatched(address: EthereumAddress, data: Bytes): Promise<Bytes>
  callMethod<T>(
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined>
  callMethodUnbatched<T>(
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
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

  getBlock(blockNumber: number): Promise<providers.Block | undefined>
  getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined>
  getDebugTrace(transactionHash: Hash256): Promise<DebugTransactionCallResponse>

  getBytecode(address: EthereumAddress): Promise<Bytes>
  getSource(address: EthereumAddress): Promise<ContractSource>
  getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined>

  getBlobs(txHash: string): Promise<BlobsInBlock>
}
