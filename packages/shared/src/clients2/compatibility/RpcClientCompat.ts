import { MetricsAggregator } from '@l2beat/backend-tools'
import { assert, Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import type { ClientCoreDependencies } from '../../clients/ClientCore'
import type {
  MulticallV3Client,
  MulticallV3Response,
} from '../../clients/rpc/multicall/MulticallV3Client'
import {
  isLimitExceededError,
  NotFoundOnRpcError,
} from '../../clients/rpc/RpcClient'
import type { RpcMetricsAggregator } from '../../clients/rpc/RpcMetricsAggregator'
import type {
  CallParameters,
  EVMBlock,
  EVMBlockWithTransactions,
  EVMFeeHistory,
  EVMLog,
  EVMTransaction,
} from '../../clients/rpc/types'
import type {
  BlockClient,
  BlockHeader,
  LogsClient,
  LogsTopicFilter,
} from '../../clients/types'
import { RetryHandler } from '../../tools'
import {
  EthRpcClient,
  hasErrorStatus,
  type RpcBlock,
  type RpcBlockWithTransactions,
  type RpcLog,
  type RpcReceipt,
  type RpcTransaction,
} from '../EthRpcClient'
import { Http } from '../Http'

export interface Receipt {
  blockHash?: string
  gasUsed?: bigint
  effectiveGasPrice?: bigint
  /** 1 on success, 0 on revert; absent before Byzantium. */
  status?: number
  logs: ReceiptLog[]
}

export interface ReceiptLog {
  address: string
  topics: string[]
  data: string
  logIndex: number
}

interface Dependencies extends Omit<ClientCoreDependencies, 'sourceName'> {
  url: string
  chain: string
  generateId?: () => string
  multicallClient?: MulticallV3Client
  rpcMetricsAggregator?: RpcMetricsAggregator
  timeout?: number
  maxBatchSize?: number
  /** See `share` in `RateLimiterOptions.stepDownOnThrottle`. */
  stepDownOnThrottle?: number
}

export interface IRpcClient extends BlockClient, LogsClient {
  multicallClient?: MulticallV3Client
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions>
  getBlockTimestamp(blockNumber: number): Promise<number>
  getBlockParentBeaconRoot(blockNumber: number): Promise<string>
  getBlock(blockNumber: 'latest' | number, includeTxs: false): Promise<EVMBlock>
  getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  getBlockTimestamps(blockNumbers: number[]): Promise<Map<number, number>>
  getTransaction(txHash: string): Promise<EVMTransaction>
  getTransactionReceipt(txHash: string): Promise<Receipt>
  /** In batch requests, in the order of `txHashes` */
  getTransactionReceipts(txHashes: string[]): Promise<Receipt[]>
  /** Every receipt of a block in one call (eth_getBlockReceipts). */
  getBlockReceipts(blockNumber: number): Promise<Receipt[]>
  getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint>
  getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: LogsTopicFilter,
  ): Promise<EVMLog[]>
  getFeeHistory(
    blockCount: number,
    newestBlock: number,
    rewardPercentiles: number[],
  ): Promise<EVMFeeHistory>
  /** What the node suggests as a tip (eth_maxPriorityFeePerGas), wei */
  getMaxPriorityFeePerGas(): Promise<bigint>
  call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes>
  isMulticallDeployed(blockNumber: number): boolean
  multicall(
    calls: CallParameters[],
    blockNumber: number,
  ): Promise<MulticallV3Response[]>
}

export class RpcClientCompat implements IRpcClient {
  constructor(
    private ethRpcClient: EthRpcClient,
    readonly chain: string,
    public multicallClient?: MulticallV3Client,
  ) {}

  static create(deps: Dependencies) {
    const logger = deps.logger
      .for(RpcClientCompat.name)
      .tag({ source: deps.chain, chain: deps.chain })
    const http = new Http({
      logger,
      metricsEnabled: MetricsAggregator.metricsEnabled,
      maxCallsPerMinute: deps.callsPerMinute,
      stepDownOnThrottle: deps.stepDownOnThrottle,
    })
    const client = new EthRpcClient(
      http,
      deps.url,
      deps.generateId,
      deps.timeout,
      deps.rpcMetricsAggregator?.createRecorder({
        rpcChain: deps.chain,
        rpcClient: RpcClientCompat.name,
      }),
      { maxBatchSize: deps.maxBatchSize, logger },
      RetryHandler.create(deps.retryStrategy, logger.tag({ tag: deps.chain })),
    )
    return new RpcClientCompat(client, deps.chain, deps.multicallClient)
  }

  async getLatestBlockNumber(): Promise<number> {
    return Number(await this.ethRpcClient.getBlockNumber())
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions> {
    return await this.getBlock(blockNumber, true)
  }

  async getBlockHeader(blockNumber: number | 'latest'): Promise<BlockHeader> {
    return await this.getBlock(blockNumber, false)
  }

  async getBlockTimestamp(blockNumber: number): Promise<number> {
    const header = await this.getBlockHeader(blockNumber)
    return header.timestamp
  }

  async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    const block = await this.getBlock(blockNumber, false)
    if (!block.parentBeaconBlockRoot) {
      throw new Error(`Block ${block}: parentBeaconBlockRoot should be defined`)
    }
    return block.parentBeaconBlockRoot
  }

  getBlock(blockNumber: 'latest' | number, includeTxs: false): Promise<EVMBlock>
  getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  async getBlock(
    blockNumber: number | 'latest',
    includeTxs: boolean,
  ): Promise<EVMBlock | EVMBlockWithTransactions> {
    const bnParam = blockNumber === 'latest' ? 'latest' : BigInt(blockNumber)
    if (!includeTxs) {
      const header = await this.ethRpcClient.getBlockByNumber(bnParam, false)
      return toEVMBlock(blockNumber, header)
    }
    const block = await this.ethRpcClient.getBlockByNumber(bnParam, true)
    return {
      ...toEVMBlock(blockNumber, block),
      transactions: (block?.transactions ?? []).map(toTx),
    }
  }

  async getBlockTimestamps(
    blockNumbers: number[],
  ): Promise<Map<number, number>> {
    const blocks = await this.ethRpcClient.getBlocksByNumber(
      blockNumbers.map(BigInt),
    )
    const result = new Map<number, number>()
    for (const [index, rpcBlock] of blocks.entries()) {
      const expectedBlockNumber = blockNumbers[index]
      assert(expectedBlockNumber !== undefined)
      const block = toEVMBlock(expectedBlockNumber, rpcBlock)
      if (block.number !== expectedBlockNumber) {
        throw new Error('Unexpected block number', {
          cause: { expected: expectedBlockNumber, got: block.number },
        })
      }
      result.set(expectedBlockNumber, block.timestamp)
    }
    return result
  }

  async getTransaction(txHash: string): Promise<EVMTransaction> {
    const tx = await this.ethRpcClient.getTransactionByHash(txHash)
    if (tx === null) {
      throw new NotFoundOnRpcError('Transaction not found', {
        cause: { txHash },
      })
    }
    return toTx(tx)
  }

  async getTransactionReceipt(txHash: string): Promise<Receipt> {
    const receipt = await this.ethRpcClient.getTransactionReceipt(txHash)
    if (receipt === null) {
      throw new NotFoundOnRpcError('Receipt not found', { cause: { txHash } })
    }
    return toReceipt(receipt)
  }

  async getTransactionReceipts(txHashes: string[]): Promise<Receipt[]> {
    const receipts = await this.ethRpcClient.getTransactionReceipts(txHashes)
    const found = receipts.filter((r): r is RpcReceipt => r !== null)
    if (found.length < receipts.length) {
      throw new NotFoundOnRpcError('Receipts not found', {
        cause: { txHashes: txHashes.filter((_, i) => receipts[i] === null) },
      })
    }
    return found.map(toReceipt)
  }

  async getBlockReceipts(blockNumber: number): Promise<Receipt[]> {
    const receipts = await this.ethRpcClient.getBlockReceipts(
      BigInt(blockNumber),
    )
    if (receipts === null) {
      throw new NotFoundOnRpcError('Block not found', {
        cause: { blockNumber },
      })
    }
    return receipts.map(toReceipt)
  }

  async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    return await this.ethRpcClient.getBalance(
      holder,
      blockNumber === 'latest' ? 'latest' : BigInt(blockNumber),
    )
  }

  async getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: LogsTopicFilter,
  ): Promise<EVMLog[]> {
    try {
      const logs = await this.ethRpcClient.getLogs({
        fromBlock: BigInt(from),
        toBlock: BigInt(to),
        address: addresses as EthereumAddress[] | undefined,
        topics,
      })
      return logs.map((log) => ({
        ...toEVMLog(log),
        address: rpcAddress(log.address),
      }))
    } catch (e) {
      if (from < to && isLimitAnswer(e)) {
        const midpoint = Math.floor((from + to) / 2)
        const results = await Promise.all([
          this.getLogs(from, midpoint, addresses, topics),
          this.getLogs(midpoint + 1, to, addresses, topics),
        ])
        return results.flat()
      }
      throw e
    }
  }

  async getFeeHistory(
    blockCount: number,
    newestBlock: number,
    rewardPercentiles: number[],
  ): Promise<EVMFeeHistory> {
    const feeHistory = await this.ethRpcClient.getFeeHistory(
      blockCount,
      newestBlock,
      rewardPercentiles,
    )
    return {
      baseFeePerGas: feeHistory.baseFeePerGas,
      gasUsedRatio: feeHistory.gasUsedRatio,
      baseFeePerBlobGas: feeHistory.baseFeePerBlobGas,
      blobGasUsedRatio: feeHistory.blobGasUsedRatio,
      oldestBlock: Number(feeHistory.oldestBlock),
    }
  }

  async getMaxPriorityFeePerGas(): Promise<bigint> {
    return await this.ethRpcClient.getMaxPriorityFeePerGas()
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const result = await this.ethRpcClient
      .call(
        {
          to: callParams.to,
          input: callParams.input.toString(),
        },
        blockNumber === 'latest' ? 'latest' : BigInt(blockNumber),
      )
      .catch((error: unknown) => {
        // Callers read "revert" in a message as a revert, and a failed
        // request, whatever its body says, is not one
        throw new Error('RPC call failed', { cause: error })
      })
    if (result.reverted) {
      throw new Error('Call reverted', {
        cause: { reason: result.reason, to: callParams.to, blockNumber },
      })
    }
    return Bytes.fromHex(result.data)
  }

  isMulticallDeployed(blockNumber: number): boolean {
    return !!(
      this.multicallClient && this.multicallClient.sinceBlock <= blockNumber
    )
  }

  async multicall(calls: CallParameters[], blockNumber: number) {
    const client = this.multicallClient
    if (!(client && client.sinceBlock <= blockNumber)) {
      throw new Error(`Multicall not configured for block ${blockNumber}`)
    }
    const batches = client.encodeBatches(calls)
    const batchedResults = await Promise.all(
      batches.map(async (batch) =>
        client.decode(await this.call(batch, blockNumber)),
      ),
    )
    return batchedResults.flat()
  }
}

/**
 * The RPC answered that the range holds too many logs. Sent with an HTTP
 * error status it is a refusal like any other, which RpcClient retried.
 */
function isLimitAnswer(error: unknown): boolean {
  return (
    error instanceof Error &&
    // A JSON-RPC error, not a body that only mentions a limit
    error.message.startsWith('RPC call failed. RPC code') &&
    isLimitExceededError(error) &&
    !hasErrorStatus(error.cause)
  )
}

/**
 * Lowercase, as the RPC sends it and as RpcClient passed it on: callers of
 * IRpcClient compare and store these strings as they are
 */
function rpcAddress(address: EthereumAddress): string {
  return address.toLowerCase()
}

function toTx(tx: RpcTransaction): EVMTransaction {
  return {
    hash: tx.hash,
    from: rpcAddress(tx.from),
    to: tx.to && rpcAddress(tx.to),
    data: tx.input,
    type: tx.type?.toString(),
    value: tx.value,
    calls: tx.calls?.map((call) => ({
      to: call.to && rpcAddress(call.to),
      data: call.input ?? call.data,
      value: call.value,
    })),
    blobVersionedHashes: tx.blobVersionedHashes ?? undefined,
    blockNumber: tx.blockNumber !== null ? Number(tx.blockNumber) : null,
  }
}

export function toEVMLog(log: RpcLog): EVMLog {
  return {
    address: log.address,
    blockHash: log.blockHash ?? '',
    blockNumber: Number(log.blockNumber ?? 0),
    data: log.data,
    logIndex: Number(log.logIndex ?? -1),
    topics: log.topics,
    transactionHash: log.transactionHash ?? '',
    blockTimestamp:
      log.blockTimestamp !== undefined ? Number(log.blockTimestamp) : undefined,
  }
}

export function toEVMBlock(
  blockNumber: number | 'latest',
  block: RpcBlock | RpcBlockWithTransactions | null,
): EVMBlock {
  if (block === null) {
    throw new NotFoundOnRpcError('Block not found', { cause: { blockNumber } })
  }
  if (block.hash === null || block.number === null) {
    throw new Error(`Block ${blockNumber} is pending`)
  }
  const base: EVMBlock = {
    hash: block.hash,
    parentHash: block.parentHash,
    number: Number(block.number),
    timestamp: Number(block.timestamp),
    gasUsed: Number(block.gasUsed),
    logsBloom: block.logsBloom,
    parentBeaconBlockRoot: block.parentBeaconBlockRoot,
  }
  if (block.settledHeight !== undefined) {
    base.settledHeight = Number(block.settledHeight)
  }
  // Absent only in partial headers built by tests
  if (block.miner !== undefined) {
    base.miner = rpcAddress(block.miner)
  }
  if (block.baseFeePerGas !== undefined) {
    base.baseFeePerGas = block.baseFeePerGas
  }
  if (block.withdrawals !== undefined) {
    base.withdrawals = block.withdrawals.map((w) => ({ amount: w.amount }))
  }
  return base
}

function toReceipt(receipt: RpcReceipt): Receipt {
  return {
    blockHash: receipt.blockHash,
    ...(receipt.gasUsed !== undefined && { gasUsed: receipt.gasUsed }),
    ...(receipt.effectiveGasPrice != null && {
      effectiveGasPrice: receipt.effectiveGasPrice,
    }),
    ...(receipt.status !== undefined && { status: Number(receipt.status) }),
    logs: receipt.logs.map((log) => {
      // Only pending logs lack an index, and a receipt implies a mined transaction.
      assert(
        log.logIndex !== null,
        `Receipt ${receipt.transactionHash} has a pending log`,
      )
      return {
        address: rpcAddress(log.address),
        topics: log.topics,
        data: log.data,
        logIndex: Number(log.logIndex),
      }
    }),
  }
}
