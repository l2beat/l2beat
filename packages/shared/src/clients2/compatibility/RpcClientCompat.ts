import { MetricsAggregator } from '@l2beat/backend-tools'
import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import type { ClientCoreDependencies } from '../../clients/ClientCore'
import type {
  MulticallV3Client,
  MulticallV3Response,
} from '../../clients/rpc/multicall/MulticallV3Client'
import type {
  CallParameters,
  EVMBlock,
  EVMBlockWithTransactions,
  EVMFeeHistory,
  EVMLog,
  EVMTransaction,
} from '../../clients/rpc/types'
import type { BlockClient, LogsClient } from '../../clients/types'
import { toRetryOptions } from '../../tools'
import {
  EthRpcClient,
  type RpcBlock,
  type RpcBlockWithTransactions,
  type RpcLog,
  type RpcTransaction,
} from '../EthRpcClient'
import { Http } from '../Http'
import { withRetries } from '../retries'

export interface Receipt {
  logs: {
    topics: string[]
    data: string
  }[]
}

interface Dependencies extends Omit<ClientCoreDependencies, 'sourceName'> {
  url: string
  chain: string
  generateId?: () => string
  multicallClient?: MulticallV3Client
}

export interface IRpcClient extends BlockClient, LogsClient {
  multicallClient?: MulticallV3Client
  getLatestBlockNumber(): Promise<number>
  getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions>
  getBlockParentBeaconRoot(blockNumber: number): Promise<string>
  getBlock(blockNumber: 'latest' | number, includeTxs: false): Promise<EVMBlock>
  getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  getTransaction(txHash: string): Promise<EVMTransaction>
  getTransactionReceipt(txHash: string): Promise<Receipt>
  getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint>
  getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: string[],
  ): Promise<EVMLog[]>
  getFeeHistory(
    blockCount: number,
    newestBlock: number,
    rewardPercentiles: number[],
  ): Promise<EVMFeeHistory>
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
      .tag({ source: deps.chain })
    const http = new Http({
      logger,
      metricsEnabled: MetricsAggregator.metricsEnabled,
      maxCallsPerMinute: deps.callsPerMinute,
    })
    const client = new EthRpcClient(
      http,
      deps.url,
      `${RpcClientCompat.name}:${deps.chain}`,
      deps.generateId,
    )
    const retryOptions = toRetryOptions(deps.retryStrategy)
    const compat = new RpcClientCompat(client, deps.chain, deps.multicallClient)
    const wrapped = withRetries(compat, {
      initialTimeoutMs: retryOptions.initialRetryDelayMs,
      maxAttempts: retryOptions.maxRetries,
      maxTimeoutMs: retryOptions.maxRetryDelayMs,
      logger,
    })
    return wrapped
  }

  async getLatestBlockNumber(): Promise<number> {
    return Number(await this.ethRpcClient.getBlockNumber())
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions> {
    return await this.getBlock(blockNumber, true)
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
    const block = includeTxs
      ? await this.ethRpcClient.getBlockByNumber(bnParam, true)
      : await this.ethRpcClient.getBlockByNumber(bnParam, false)
    return toEVMBlock(blockNumber, block)
  }

  async getTransaction(txHash: string): Promise<EVMTransaction> {
    const tx = await this.ethRpcClient.getTransactionByHash(txHash)
    if (tx === null) {
      throw new Error(`Transaction ${txHash} not found`)
    }
    return toTx(tx)
  }

  async getTransactionReceipt(txHash: string): Promise<Receipt> {
    const receipt = await this.ethRpcClient.getTransactionReceipt(txHash)
    if (receipt === null) {
      throw new Error(`Transaction ${txHash} not found`)
    }
    return {
      logs: receipt.logs.map((log) => ({
        topics: log.topics,
        data: log.data,
      })),
    }
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
    topics?: string[],
  ): Promise<EVMLog[]> {
    try {
      const logs = await this.ethRpcClient.getLogs({
        fromBlock: BigInt(from),
        toBlock: BigInt(to),
        address: addresses as EthereumAddress[] | undefined,
        topics: topics,
      })
      return logs.map(toEVMLog)
    } catch (e) {
      if (isLimitExceededError(e)) {
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
    return { ...feeHistory, oldestBlock: Number(feeHistory.oldestBlock) }
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const result = await this.ethRpcClient.call(
      {
        to: callParams.to,
        input: callParams.data.toString(),
      },
      blockNumber === 'latest' ? 'latest' : BigInt(blockNumber),
    )
    if (result.reverted) {
      throw new Error('Call reverted')
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

function toTx(tx: RpcTransaction): EVMTransaction {
  return {
    from: tx.from,
    to: tx.to ?? undefined,
    data: tx.input,
    hash: tx.hash,
    type: tx.type?.toString(),
    value: tx.value,
    blobVersionedHashes: tx.blobVersionedHashes ?? undefined,
    blockNumber: tx.blockNumber !== null ? Number(tx.blockNumber) : null,
  }
}

function isLimitExceededError(e: unknown) {
  return (
    e instanceof Error &&
    e.message.startsWith('RPC call failed') &&
    (e.message.includes('Log response size exceeded') ||
      e.message.includes('query exceeds max block range 100000') ||
      e.message.includes('eth_getLogs is limited to a 10,000 range') ||
      e.message.includes('returned more than 10000'))
  )
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
  }
}

export function toEVMBlock(
  blockNumber: number | 'latest',
  block: RpcBlock | null,
): EVMBlock
export function toEVMBlock(
  blockNumber: number | 'latest',
  block: RpcBlockWithTransactions | null,
): EVMBlockWithTransactions
export function toEVMBlock(
  blockNumber: number | 'latest',
  block: RpcBlock | RpcBlockWithTransactions | null,
): EVMBlock | EVMBlockWithTransactions
export function toEVMBlock(
  blockNumber: number | 'latest',
  block: RpcBlock | RpcBlockWithTransactions | null,
): EVMBlock | EVMBlockWithTransactions {
  if (block === null) {
    throw new Error(`Block ${blockNumber} not found`)
  }
  if (block.hash === null || block.number === null) {
    throw new Error(`Block ${blockNumber} is pending`)
  }
  const base: EVMBlock = {
    hash: block.hash,
    number: Number(block.number),
    timestamp: Number(block.timestamp),
    logsBloom: block.logsBloom,
    parentBeaconBlockRoot: block.parentBeaconBlockRoot,
  }
  if (block.transactions) {
    return {
      ...base,
      transactions: block.transactions.map((tx) => toTx(tx as RpcTransaction)),
    } satisfies EVMBlockWithTransactions
  }
  return base
}
