import { BlobsInBlock } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { providers, utils } from 'ethers'
import { ContractSource } from '../../utils/IEtherscanClient'
import { bytes32ToAddress } from '../utils/address'
import { isRevert } from '../utils/isRevert'
import { BatchingAndCachingProvider } from './BatchingAndCachingProvider'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { ContractDeployment, IProvider, RawProviders } from './IProvider'
import { ProviderStats, getZeroStats } from './Stats'

interface AllProviders {
  get(chain: string, blockNumber: number): IProvider
}

export class HighLevelProvider implements IProvider {
  public stats: ProviderStats = getZeroStats()

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

  call(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    this.stats.callCount++
    return this.provider.call(address, data, this.blockNumber)
  }

  callUnbatched(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    this.stats.callCount++
    return this.provider.callUnbatched(address, data, this.blockNumber)
  }

  async callMethod<T>(
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    this.stats.callCount++
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result
    try {
      const result = await this.provider.call(
        address,
        callData,
        this.blockNumber,
      )
      decodedResult = coder.decodeFunctionResult(fragment, result.toString())
    } catch (e) {
      if (isRevert(e)) {
        return undefined
      }
      throw e
    }
    return decodedResult.length === 1 ? decodedResult[0] : (decodedResult as T)
  }

  async callMethodUnbatched<T>(
    address: EthereumAddress,
    abi: string | utils.FunctionFragment,
    args: unknown[],
  ): Promise<T | undefined> {
    this.stats.callCount++
    const coder = new utils.Interface([abi])
    const fragment =
      typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
    assert(fragment, `Unknown fragment for method: ${abi}`)
    const callData = Bytes.fromHex(coder.encodeFunctionData(fragment, args))

    let decodedResult: utils.Result
    try {
      const result = await this.provider.callUnbatched(
        address,
        callData,
        this.blockNumber,
      )
      decodedResult = coder.decodeFunctionResult(fragment, result.toString())
    } catch (e) {
      if (isRevert(e)) {
        return undefined
      }
      throw e
    }
    return decodedResult.length === 1 ? decodedResult[0] : (decodedResult as T)
  }

  getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes> {
    this.stats.getStorageCount++
    return this.provider.getStorage(address, slot, this.blockNumber)
  }

  async getStorageAsAddress(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<EthereumAddress> {
    this.stats.getStorageCount++
    return bytes32ToAddress(
      await this.provider.getStorage(address, slot, this.blockNumber),
    )
  }

  async getStorageAsBigint(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<bigint> {
    this.stats.getStorageCount++
    const value = await this.provider.getStorage(
      address,
      slot,
      this.blockNumber,
    )
    return BigInt(value.toString())
  }

  getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
  ): Promise<providers.Log[]> {
    this.stats.getLogsCount += Array.isArray(topics[0]) ? topics[0].length : 1
    return this.provider.getLogs(address, topics, 0, this.blockNumber)
  }

  async getEvents(
    address: EthereumAddress,
    abi: string,
    args: unknown[] = [],
  ): Promise<{ log: providers.Log; event: utils.Result }[]> {
    this.stats.getLogsCount++
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
    return logs.map((log) => {
      const event = coder.decodeEventLog(fragment, log.data, log.topics)
      return { log, event }
    })
  }

  async getBlock(blockNumber: number): Promise<providers.Block | undefined> {
    this.stats.getBlockCount++
    return await this.provider.getBlock(blockNumber)
  }

  getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined> {
    this.stats.getTransactionCount++
    return this.provider.getTransaction(transactionHash)
  }

  getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    this.stats.getDebugTraceCount++
    return this.provider.getDebugTrace(transactionHash)
  }

  getBytecode(address: EthereumAddress): Promise<Bytes> {
    this.stats.getBytecodeCount++
    return this.provider.getBytecode(address, this.blockNumber)
  }

  getSource(address: EthereumAddress): Promise<ContractSource> {
    this.stats.getSourceCount++
    return this.provider.getSource(address)
  }

  getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined> {
    this.stats.getDeploymentCount++
    return this.provider.getDeployment(address)
  }

  getBlobs(txHash: string): Promise<BlobsInBlock> {
    return this.provider.getBlobs(txHash)
  }
}
