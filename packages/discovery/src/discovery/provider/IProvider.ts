import type { Logger } from '@l2beat/backend-tools'
import type {
  BlobClient,
  BlobsInBlock,
  CelestiaApiClient,
  CoingeckoClient,
} from '@l2beat/shared'
import type {
  Bytes,
  ChainSpecificAddress,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import type { providers, utils } from 'ethers'
import type {
  ContractSource,
  IEtherscanClient,
} from '../../utils/IEtherscanClient'
import type { DebugTransactionCallResponse } from './DebugTransactionTrace'
import type { IStatelessProvider } from './IStatelessProvider'

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
  coingeckoClient: CoingeckoClient
  celestiaApiClient?: CelestiaApiClient
  blobClient?: BlobClient
}

export interface IProvider extends IStatelessProvider {
  readonly timestamp: UnixTime
  readonly blockNumber: number
  readonly chain: string

  switchBlock(blockNumber: number): Promise<IProvider>
  switchChain(chain: string): Promise<IProvider>
  switchChain(chain: string, timestamp: UnixTime): Promise<IProvider>

  /** Needs to return values that survive JSON serialization! */
  raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders, logger: Logger) => Promise<T>,
  ): Promise<T>

  call(address: ChainSpecificAddress, data: Bytes): Promise<Bytes>
  callUnbatched(address: ChainSpecificAddress, data: Bytes): Promise<Bytes>
  callMethod<T>(
    address: ChainSpecificAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined>
  callMethodUnbatched<T>(
    address: ChainSpecificAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined>

  getStorage(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes>
  getStorageAsAddress(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<ChainSpecificAddress>
  getStorageAsBigint(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<bigint>

  getLogs(
    address: ChainSpecificAddress,
    topics: (string | string[] | null)[],
  ): Promise<providers.Log[]>
  getEvents(
    address: ChainSpecificAddress,
    abi: string,
    args: unknown[],
    // biome-ignore lint/suspicious/noExplicitAny: TODO: LogDescription
  ): Promise<{ log: providers.Log; event: any }[]>

  getBlock(blockNumber: number): Promise<providers.Block | undefined>
  getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined>
  getDebugTrace(transactionHash: Hash256): Promise<DebugTransactionCallResponse>

  getBytecode(address: ChainSpecificAddress): Promise<Bytes>
  getSource(address: ChainSpecificAddress): Promise<ContractSource>
  getDeployment(
    address: ChainSpecificAddress,
  ): Promise<ContractDeployment | undefined>

  getBlobs(txHash: string): Promise<BlobsInBlock>

  celestiaBlobExists(
    height: number,
    namespace: string,
    commitment: string,
  ): Promise<boolean>
  getCelestiaBlockResultLogs(height: number): Promise<string[]>
}
