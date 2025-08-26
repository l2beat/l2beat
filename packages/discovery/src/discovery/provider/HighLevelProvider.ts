import type { Logger } from '@l2beat/backend-tools'
import type { BlobsInBlock } from '@l2beat/shared'
import {
  assert,
  Bytes,
  ChainSpecificAddress,
  type EthereumAddress,
  type Hash256,
  type UnixTime,
} from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import type { ContractSource } from '../../utils/IEtherscanClient'
import { bytes32ToAddress } from '../utils/address'
import { isRevert } from '../utils/isRevert'
import type { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { DebugTransactionCallResponse } from './DebugTransactionTrace'
import type { ContractDeployment, IProvider, RawProviders } from './IProvider'
import type { IStatelessProvider } from './IStatelessProvider'
import { ProviderMeasurement, ProviderStats } from './Stats'

interface AllProviders {
  get(chain: string, timestamp: UnixTime): Promise<IProvider>
  getByBlockNumber(chain: string, blockNumber: number): Promise<IProvider>
}

export class HighLevelProvider implements IProvider {
  public stats: ProviderStats = new ProviderStats()

  constructor(
    private readonly allProviders: AllProviders,
    private readonly provider: BatchingAndCachingProvider,
    readonly chain: string,
    readonly timestamp: UnixTime,
    readonly blockNumber: number,
  ) {}

  static createStateless(
    allProviders: AllProviders,
    provider: BatchingAndCachingProvider,
    chain: string,
  ): IStatelessProvider {
    return new HighLevelProvider(allProviders, provider, chain, 0, 0)
  }

  switchBlock(blockNumber: number): Promise<IProvider> {
    return this.allProviders.getByBlockNumber(this.chain, blockNumber)
  }

  switchChain(
    chain: string,
    timestamp: UnixTime | undefined = undefined,
  ): Promise<IProvider> {
    return this.allProviders.get(chain, timestamp ?? this.timestamp)
  }

  raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders, logger: Logger) => Promise<T>,
  ): Promise<T> {
    return this.provider.raw(cacheKey, fn)
  }

  async call(address: ChainSpecificAddress, data: Bytes): Promise<Bytes> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.call(rawAddress, data, this.blockNumber)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async callUnbatched(
    address: ChainSpecificAddress,
    data: Bytes,
  ): Promise<Bytes> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.callUnbatched(
      rawAddress,
      data,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async callMethod<T>(
    address: ChainSpecificAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result | undefined
    try {
      const result = await this.provider.call(
        rawAddress,
        callData,
        this.blockNumber,
      )
      decodedResult = coder.decodeFunctionResult(fragment, result.toString())
    } catch (e) {
      if (!isRevert(e)) {
        throw e
      }
      decodedResult = undefined
    }

    const result =
      decodedResult === undefined
        ? decodedResult
        : decodedResult.length === 1
          ? decodedResult[0]
          : (decodedResult as T)

    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async callMethodUnbatched<T>(
    address: ChainSpecificAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result | undefined
    try {
      const result = await this.provider.callUnbatched(
        rawAddress,
        callData,
        this.blockNumber,
      )
      decodedResult = coder.decodeFunctionResult(fragment, result.toString())
    } catch (e) {
      if (!isRevert(e)) {
        throw e
      }
      decodedResult = undefined
    }

    const result =
      decodedResult === undefined
        ? decodedResult
        : decodedResult.length === 1
          ? decodedResult[0]
          : (decodedResult as T)

    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async getStorage(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.getStorage(
      rawAddress,
      slot,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)

    return result
  }

  async getStorageAsAddress(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<ChainSpecificAddress> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = bytes32ToAddress(
      await this.provider.getStorage(rawAddress, slot, this.blockNumber),
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)

    return ChainSpecificAddress.fromLong(this.chain, result.toString())
  }

  async getStorageAsBigint(
    address: ChainSpecificAddress,
    slot: number | bigint | Bytes,
  ): Promise<bigint> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const value = await this.provider.getStorage(
      rawAddress,
      slot,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)
    return BigInt(value.toString())
  }

  async getLogs(
    address: ChainSpecificAddress,
    topics: (string | string[] | null)[],
  ): Promise<providers.Log[]> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.getLogs(
      rawAddress,
      topics,
      0,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(
      ProviderMeasurement.GET_LOGS,
      duration,
      Array.isArray(topics[0]) ? topics[0].length : 1,
    )

    return result
  }

  async getEvents(
    address: ChainSpecificAddress,
    abi: string,
    args: unknown[] = [],
  ): Promise<{ log: providers.Log; event: utils.Result }[]> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const coder = new utils.Interface([abi])
    const fragment = Object.values(coder.events)[0]
    assert(fragment, `Unknown fragment for event: ${abi}`)

    const topics = coder.encodeFilterTopics(fragment, args)
    const logs = await this.provider.getLogs(
      rawAddress,
      topics,
      0,
      this.blockNumber,
    )
    const result = logs.map((log) => {
      const event = coder.decodeEventLog(fragment, log.data, log.topics)
      return { log, event }
    })

    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_LOGS, duration)

    return result
  }

  async getBlock(blockNumber: number): Promise<providers.Block | undefined> {
    let duration = -performance.now()
    const result = await this.provider.getBlock(blockNumber)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_BLOCK, duration)
    return result
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let duration = -performance.now()
    const result = await this.provider.getBlockNumberAtOrBefore(timestamp)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_BLOCK_NUMBER_AT_OR_BEFORE, duration)
    return result
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined> {
    let duration = -performance.now()
    const result = await this.provider.getTransaction(transactionHash)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_TRANSACTION, duration)
    return result
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    let duration = -performance.now()
    const result = await this.provider.getDebugTrace(transactionHash)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_DEBUG_TRACE, duration)
    return result
  }

  async getBytecode(address: ChainSpecificAddress): Promise<Bytes> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.getBytecode(rawAddress, this.blockNumber)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_BYTECODE, duration)
    return result
  }

  async getSource(address: ChainSpecificAddress): Promise<ContractSource> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.getSource(rawAddress)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_SOURCE, duration)
    return result
  }

  async getDeployment(
    address: ChainSpecificAddress,
  ): Promise<ContractDeployment | undefined> {
    let duration = -performance.now()
    const rawAddress = this.safeGetRawAddress(address)
    const result = await this.provider.getDeployment(rawAddress)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_DEPLOYMENT, duration)
    return result
  }

  getBlobs(txHash: string): Promise<BlobsInBlock> {
    return this.provider.getBlobs(txHash)
  }

  celestiaBlobExists(height: number, namespace: string, commitment: string) {
    return this.provider.celestiaBlobExists(height, namespace, commitment)
  }

  getCelestiaBlockResultEvents(height: number) {
    return this.provider.getCelestiaBlockResultEvents(height)
  }

  private safeGetRawAddress(address: ChainSpecificAddress): EthereumAddress {
    assert(
      ChainSpecificAddress.longChain(address) === this.chain,
      'Chain mismatch',
    )
    return ChainSpecificAddress.address(address)
  }
}
