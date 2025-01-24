import type { BlobsInBlock } from '@l2beat/shared'
import {
  assert,
  Bytes,
  type EthereumAddress,
  type Hash256,
} from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import type { ContractSource } from '../../utils/IEtherscanClient'
import { bytes32ToAddress } from '../utils/address'
import { isRevert } from '../utils/isRevert'
import type { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import type { DebugTransactionCallResponse } from './DebugTransactionTrace'
import type { ContractDeployment, IProvider, RawProviders } from './IProvider'
import { ProviderMeasurement, ProviderStats } from './Stats'

interface AllProviders {
  get(chain: string, blockNumber: number): IProvider
}

export class HighLevelProvider implements IProvider {
  public stats: ProviderStats = new ProviderStats()

  constructor(
    private readonly allProviders: AllProviders,
    private readonly provider: BatchingAndCachingProvider,
    readonly chain: string,
    readonly blockNumber: number,
  ) {}

  switchBlock(blockNumber: number): IProvider {
    return this.allProviders.get(this.chain, blockNumber)
  }

  switchChain(chain: string, blockNumber: number): IProvider {
    return this.allProviders.get(chain, blockNumber)
  }

  raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders) => Promise<T>,
  ): Promise<T> {
    return this.provider.raw(cacheKey, fn)
  }

  async call(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    let duration = -performance.now()
    const result = await this.provider.call(address, data, this.blockNumber)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async callUnbatched(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    let duration = -performance.now()
    const result = await this.provider.callUnbatched(
      address,
      data,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.CALL, duration)
    return result
  }

  async callMethod<T>(
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    let duration = -performance.now()
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result | undefined
    try {
      const result = await this.provider.call(
        address,
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
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    let duration = -performance.now()
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result | undefined
    try {
      const result = await this.provider.callUnbatched(
        address,
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
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes> {
    let duration = -performance.now()
    const result = await this.provider.getStorage(
      address,
      slot,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)

    return result
  }

  async getStorageAsAddress(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<EthereumAddress> {
    let duration = -performance.now()
    const result = bytes32ToAddress(
      await this.provider.getStorage(address, slot, this.blockNumber),
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)

    return result
  }

  async getStorageAsBigint(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<bigint> {
    let duration = -performance.now()
    const value = await this.provider.getStorage(
      address,
      slot,
      this.blockNumber,
    )
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)
    return BigInt(value.toString())
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
  ): Promise<providers.Log[]> {
    let duration = -performance.now()
    const result = await this.provider.getLogs(
      address,
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
    address: EthereumAddress,
    abi: string,
    args: unknown[] = [],
  ): Promise<{ log: providers.Log; event: utils.Result }[]> {
    let duration = -performance.now()
    const coder = new utils.Interface([abi])
    const fragment = Object.values(coder.events)[0]
    assert(fragment, `Unknown fragment for event: ${abi}`)

    const topics = coder.encodeFilterTopics(fragment, args)
    const logs = await this.provider.getLogs(
      address,
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

  async getBytecode(address: EthereumAddress): Promise<Bytes> {
    let duration = -performance.now()
    const result = await this.provider.getBytecode(address, this.blockNumber)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_BYTECODE, duration)
    return result
  }

  async getSource(address: EthereumAddress): Promise<ContractSource> {
    let duration = -performance.now()
    const result = await this.provider.getSource(address)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_SOURCE, duration)
    return result
  }

  async getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined> {
    let duration = -performance.now()
    const result = await this.provider.getDeployment(address)
    duration += performance.now()
    this.stats.mark(ProviderMeasurement.GET_DEPLOYMENT, duration)
    return result
  }

  getBlobs(txHash: string): Promise<BlobsInBlock> {
    return this.provider.getBlobs(txHash)
  }
}
