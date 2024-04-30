import { assert } from '@l2beat/backend-tools'
import { providers } from 'ethers'

import { Bytes } from '../../utils/Bytes'
import { EthereumAddress } from '../../utils/EthereumAddress'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { Hash256 } from '../../utils/Hash256'
import { UnixTime } from '../../utils/UnixTime'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'
import { RateLimitedProvider } from './RateLimitedProvider'
import { TraceTransactionResponse } from './TransactionTrace'

export interface ContractMetadata {
  name: string
  isVerified: boolean
  abi: string[]
  source: string
  solidityVersion: string
}
type Topics = (string | string[] | null)[]

/**
 * This class is meant as a wrapper for all interactions with the blockchain
 * and Etherscan for the purposes of discovery.
 *
 * The ultimate goal is for it to automatically handle batching, rate limiting,
 * error parsing and more low level stuff, so that the rest of the code can
 * remain simple and not worry about things like 429 Too Many Requests.
 *
 * It also has a set block number that will be kept constant.
 */
export class DiscoveryProvider {
  constructor(
    private readonly provider: providers.JsonRpcProvider | RateLimitedProvider,
    private readonly etherscanLikeClient: EtherscanLikeClient,
    private readonly logger: DiscoveryLogger,
    private readonly getLogsMaxRange?: number,
  ) {}

  async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const result = await this.provider.call(
      { to: address.toString(), data: data.toString() },
      blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const result = await this.provider.getStorageAt(
      address.toString(),
      slot instanceof Bytes ? slot.toString() : slot,
      blockNumber,
    )
    return Bytes.fromHex(result)
  }

  public async getLogs(
    address: EthereumAddress,
    topics: Topics,
    fromBlock: number,
    toBlock: number,
    options: {
      howManyEvents?: number
      maxRange?: number
      filter?: (log: providers.Log) => boolean
    } = {},
  ): Promise<providers.Log[]> {
    if (fromBlock > toBlock) {
      throw new Error(
        `fromBlock (${fromBlock}) can't be bigger than toBlock (${toBlock})`,
      )
    }

    // To support efficient caching, we divide the requested blocks range into
    // sequential boundaries of `maxRange` size, e.g [10k, 20k-1], [0,10k-1], ...
    // Otherwise ranges would depend on `fromBlock` and even small change to it
    // would make the previous cache useless.

    // Let's fetch to the deployment block number if it's higher than fromBlock
    const { blockNumber: deploymentBlockNumber } =
      (await this.getDeploymentInfo(address)) ?? { blockNumber: 0 } // for cases where API to get deployment info is not available

    let allLogs: providers.Log[] = []
    const ranges = [this.getLogsMaxRange, options.maxRange].filter(
      (x): x is number => !!x,
    )
    const maxRange = ranges.length > 0 ? Math.min(...ranges) : undefined

    const lowerLimitBlock = Math.max(fromBlock, deploymentBlockNumber)
    let end = toBlock
    do {
      const curBoundaryStart = maxRange
        ? Math.floor(end / maxRange) * maxRange
        : fromBlock - toBlock
      const start = Math.max(lowerLimitBlock, curBoundaryStart)

      const logs = await this.getLogsBatch(address, topics, start, end)
      const filtered = options.filter ? logs.filter(options.filter) : logs
      allLogs = filtered.concat(allLogs)
      end = start - 1

      if (
        options.howManyEvents !== undefined &&
        allLogs.length >= options.howManyEvents
      ) {
        return allLogs.slice(0, options.howManyEvents)
      }
    } while (end >= lowerLimitBlock)

    return allLogs
  }

  public async getLogsBatch(
    address: EthereumAddress,
    topics: Topics,
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    this.logger.logFetchingEvents(fromBlock, toBlock)
    return await this.provider.getLogs({
      address: address.toString(),
      fromBlock,
      toBlock,
      topics,
    })
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse> {
    return this.provider.getTransaction(transactionHash.toString())
  }

  async getTransactionTrace(
    transactionHash: Hash256,
  ): Promise<TraceTransactionResponse> {
    // trace_transaction seems much faster than debug_traceTransaction.
    const response = (await this.provider.send('trace_transaction', [
      transactionHash.toString(),
    ])) as unknown
    return TraceTransactionResponse.parse(response)
  }

  async getDebugTransactionTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    const response = (await this.provider.send('debug_traceTransaction', [
      transactionHash.toString(),
      { tracer: 'callTracer' },
    ])) as unknown
    return DebugTransactionCallResponse.parse(response)
  }

  async getBlock(blockNumber: number): Promise<providers.Block> {
    return this.provider.getBlock(blockNumber)
  }

  async getCode(address: EthereumAddress, blockNumber: number): Promise<Bytes> {
    const result = await this.provider.getCode(address.toString(), blockNumber)
    return Bytes.fromHex(result)
  }

  async getMetadata(address: EthereumAddress): Promise<ContractMetadata> {
    const result = await this.etherscanLikeClient.getContractSource(address)
    const isVerified = result.ABI !== 'Contract source code not verified'

    return {
      name: result.ContractName.trim(),
      isVerified,
      abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
      source: result.SourceCode,
      solidityVersion: result.CompilerVersion,
    }
  }

  async getConstructorArgs(address: EthereumAddress): Promise<string> {
    const result = await this.etherscanLikeClient.getContractSource(address)
    return result.ConstructorArguments
  }

  async getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    return this.etherscanLikeClient.getContractDeploymentTx(address)
  }

  async getDeployer(
    address: EthereumAddress,
  ): Promise<EthereumAddress | undefined> {
    const txHash = await this.getContractDeploymentTx(address)
    if (txHash === undefined) {
      // This is for situations where getContractDeploymentTx API is not available
      return undefined
    }
    const tx = await this.getTransaction(txHash)

    return EthereumAddress(tx.from)
  }

  async getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime> {
    return this.etherscanLikeClient.getFirstTxTimestamp(address)
  }

  async getDeploymentInfo(address: EthereumAddress): Promise<
    | {
        blockNumber: number
        timestamp: UnixTime
      }
    | undefined
  > {
    const txHash = await this.getContractDeploymentTx(address)
    if (txHash === undefined) {
      return undefined
    }

    const tx = await this.getTransaction(txHash)
    assert(tx.blockNumber, 'Transaction returned without a block number.')
    const block = await this.getBlock(tx.blockNumber)
    return {
      blockNumber: tx.blockNumber,
      timestamp: new UnixTime(block.timestamp),
    }
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber()
  }

  async getBlockNumberAt(timestampNumber: UnixTime): Promise<number> {
    return this.etherscanLikeClient.getBlockNumberAtOrBefore(timestampNumber)
  }

  async getLast10OutgoingTxs(
    address: EthereumAddress,
    toBlock: number,
  ): ReturnType<EtherscanLikeClient['getLast10OutgoingTxs']> {
    return await this.etherscanLikeClient.getLast10OutgoingTxs(address, toBlock)
  }
}
