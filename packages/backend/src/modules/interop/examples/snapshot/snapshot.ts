import { MetricsAggregator } from '@l2beat/backend-tools'
import {
  type CallParameters,
  type ClientCoreDependencies,
  EthRpcClient,
  type EVMBlock,
  type EVMBlockWithTransactions,
  type EVMFeeHistory,
  type EVMLog,
  type EVMTransaction,
  Http,
  type MulticallV3Client,
  type MulticallV3Response,
  type Receipt,
  RpcClientCompat,
  toRetryOptions,
  withRetries,
} from '@l2beat/shared'
import type { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { buildSnapshotKey, type ExampleInputs } from './service'

interface Dependencies extends Omit<ClientCoreDependencies, 'sourceName'> {
  url: string
  chain: string
  generateId?: () => string
  multicallClient?: MulticallV3Client
  inputs: ExampleInputs
}

export class RpcSnapshotClient extends RpcClientCompat {
  constructor(
    ethRpcClient: EthRpcClient,
    chain: string,
    private readonly exampleInputs: ExampleInputs,
    multicallClient?: MulticallV3Client,
  ) {
    super(ethRpcClient, chain, multicallClient)
  }

  static override create(deps: Dependencies) {
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
      `${RpcSnapshotClient.name}:${deps.chain}`,
      deps.generateId,
    )
    const retryOptions = toRetryOptions(deps.retryStrategy)
    const compat = new RpcSnapshotClient(
      client,
      deps.chain,
      deps.inputs,
      deps.multicallClient,
    )
    const wrapped = withRetries(compat, {
      initialTimeoutMs: retryOptions.initialRetryDelayMs,
      maxAttempts: retryOptions.maxRetries,
      maxTimeoutMs: retryOptions.maxRetryDelayMs,
      logger,
    })

    return wrapped
  }

  override async getLatestBlockNumber(): Promise<number> {
    const key = this.buildSnapshotKey(['latestBlockNumber'])

    const latestBlockNumber = await super.getLatestBlockNumber()
    await this.exampleInputs.write(key, latestBlockNumber)
    return latestBlockNumber
  }

  override async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions> {
    const key = this.buildSnapshotKey([
      'blockWithTransactions',
      blockNumber.toString(),
    ])

    const blockWithTransactions = await super.getBlockWithTransactions(
      blockNumber,
    )
    await this.exampleInputs.write(key, blockWithTransactions)
    return blockWithTransactions
  }

  override async getBlockParentBeaconRoot(
    blockNumber: number,
  ): Promise<string> {
    const key = this.buildSnapshotKey([
      'blockParentBeaconRoot',
      blockNumber.toString(),
    ])
    const parentBeaconRoot = await super.getBlockParentBeaconRoot(blockNumber)
    await this.exampleInputs.write(key, parentBeaconRoot)
    return parentBeaconRoot
  }

  override getBlock(
    blockNumber: 'latest' | number,
    includeTxs: false,
  ): Promise<EVMBlock>
  override getBlock(
    blockNumber: 'latest' | number,
    includeTxs: true,
  ): Promise<EVMBlockWithTransactions>
  override async getBlock(
    blockNumber: number | 'latest',
    includeTxs: boolean,
  ): Promise<EVMBlock | EVMBlockWithTransactions> {
    const key = this.buildSnapshotKey([
      'block',
      blockNumber.toString(),
      includeTxs.toString(),
    ])

    const block = await super.getBlock(
      blockNumber,
      // biome-ignore lint/suspicious/noExplicitAny: don't judge me
      includeTxs as any,
    )
    await this.exampleInputs.write(key, block)
    return block
  }

  override async getTransaction(txHash: string): Promise<EVMTransaction> {
    const key = this.buildSnapshotKey(['transaction', txHash])

    const transaction = await super.getTransaction(txHash)
    await this.exampleInputs.write(key, transaction)
    return transaction
  }

  override async getTransactionReceipt(txHash: string): Promise<Receipt> {
    const key = this.buildSnapshotKey(['transactionReceipt', txHash])

    const receipt = await super.getTransactionReceipt(txHash)
    await this.exampleInputs.write(key, receipt)
    return receipt
  }

  override async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    const key = this.buildSnapshotKey([
      'balance',
      holder.toString(),
      blockNumber.toString(),
    ])

    const balance = await super.getBalance(holder, blockNumber)
    await this.exampleInputs.write(key, balance.toString())
    return balance
  }

  override async getLogs(
    from: number,
    to: number,
    addresses?: string[],
    topics?: string[],
  ): Promise<EVMLog[]> {
    const addressKey = addresses?.join(',') ?? 'all'
    const topicsKey = topics?.join(',') ?? 'all'
    const key = this.buildSnapshotKey([
      'logs',
      from.toString(),
      to.toString(),
      addressKey,
      topicsKey,
    ])

    const logs = await super.getLogs(from, to, addresses, topics)
    await this.exampleInputs.write(key, logs)
    return logs
  }

  override async getFeeHistory(
    blockCount: number,
    newestBlock: number,
    rewardPercentiles: number[],
  ): Promise<EVMFeeHistory> {
    const percentilesKey = rewardPercentiles.join(',')
    const key = this.buildSnapshotKey([
      'feeHistory',
      blockCount.toString(),
      newestBlock.toString(),
      percentilesKey,
    ])

    const feeHistory = await super.getFeeHistory(
      blockCount,
      newestBlock,
      rewardPercentiles,
    )
    await this.exampleInputs.write(key, feeHistory)
    return feeHistory
  }

  override async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const key = this.buildSnapshotKey([
      'call',
      callParams.to.toString(),
      callParams.data.toString(),
      blockNumber.toString(),
    ])

    const result = await super.call(callParams, blockNumber)
    await this.exampleInputs.write(key, result.toString())
    return result
  }

  override async multicall(
    calls: CallParameters[],
    blockNumber: number,
  ): Promise<MulticallV3Response[]> {
    const callsKey = calls
      .map((c) => this.buildSnapshotKey([c.to.toString(), c.data.toString()]))
      .join('|')
    const key = this.buildSnapshotKey([
      'multicall',
      blockNumber.toString(),
      callsKey,
    ])

    const results = await super.multicall(calls, blockNumber)
    await this.exampleInputs.write(key, results)
    return results
  }

  private buildSnapshotKey(params: string[]): string {
    return buildSnapshotKey([this.chain, ...params])
  }
}
