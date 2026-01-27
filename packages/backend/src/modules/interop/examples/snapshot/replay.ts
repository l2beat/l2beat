import type { Logger } from '@l2beat/backend-tools'
import {
  type CallParameters,
  type EVMBlock,
  type EVMBlockWithTransactions,
  type EVMFeeHistory,
  type EVMLog,
  type EVMTransaction,
  type MulticallV3Client,
  type MulticallV3Response,
  type Receipt,
  RpcClientCompat,
} from '@l2beat/shared'
import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { buildSnapshotKey, type ExampleInputs } from './service'

interface Dependencies {
  chain: string
  multicallClient?: MulticallV3Client
  inputs: ExampleInputs
  logger: Logger
}

export class RpcReplay implements Omit<RpcClientCompat, 'ethRpcClient'> {
  chain: string
  constructor(private readonly $: Dependencies) {
    this.chain = $.chain
  }

  static create(deps: Dependencies) {
    const logger = deps.logger
      .for(RpcClientCompat.name)
      .tag({ source: deps.chain })

    return new RpcReplay({
      chain: deps.chain,
      multicallClient: deps.multicallClient,
      inputs: deps.inputs,
      logger,
    })
  }

  isMulticallDeployed(blockNumber: number): boolean {
    return !!(
      this.$.multicallClient && this.$.multicallClient.sinceBlock <= blockNumber
    )
  }

  async getLatestBlockNumber(): Promise<number> {
    const key = this.buildSnapshotKey(['latestBlockNumber'])
    const snapshot = await this.$.inputs.readRpc<number>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<EVMBlockWithTransactions> {
    const key = this.buildSnapshotKey([
      'blockWithTransactions',
      blockNumber.toString(),
    ])
    const snapshot = await this.$.inputs.readRpc<EVMBlockWithTransactions>(key)
    if (snapshot) {
      return snapshot
    }
    throw new ReplayError(key)
  }

  async getBlockParentBeaconRoot(blockNumber: number): Promise<string> {
    const key = this.buildSnapshotKey([
      'blockParentBeaconRoot',
      blockNumber.toString(),
    ])
    const snapshot = await this.$.inputs.readRpc<string>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
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
    const key = this.buildSnapshotKey([
      'block',
      blockNumber.toString(),
      includeTxs.toString(),
    ])
    const snapshot = await this.$.inputs.readRpc<
      EVMBlock | EVMBlockWithTransactions
    >(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async getTransaction(txHash: string): Promise<EVMTransaction> {
    const key = this.buildSnapshotKey(['transaction', txHash])
    const snapshot = await this.$.inputs.readRpc<EVMTransaction>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async getTransactionReceipt(txHash: string): Promise<Receipt> {
    const key = this.buildSnapshotKey(['transactionReceipt', txHash])
    const snapshot = await this.$.inputs.readRpc<Receipt>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async getBalance(
    holder: EthereumAddress,
    blockNumber: number | 'latest',
  ): Promise<bigint> {
    const key = this.buildSnapshotKey([
      'balance',
      holder.toString(),
      blockNumber.toString(),
    ])
    const snapshot = await this.$.inputs.readRpc<string>(key)
    if (snapshot) {
      return BigInt(snapshot)
    }

    throw new ReplayError(key)
  }

  async getLogs(
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
    const snapshot = await this.$.inputs.readRpc<EVMLog[]>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async getFeeHistory(
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
    const snapshot = await this.$.inputs.readRpc<EVMFeeHistory>(key)
    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  async call(
    callParams: CallParameters,
    blockNumber: number | 'latest',
  ): Promise<Bytes> {
    const key = this.buildSnapshotKey([
      'call',
      callParams.to.toString(),
      callParams.data.toString(),
      blockNumber.toString(),
    ])
    const snapshot = await this.$.inputs.readRpc<string>(key)

    if (snapshot) {
      return Bytes.fromHex(snapshot)
    }

    throw new ReplayError(key)
  }

  async multicall(
    calls: CallParameters[],
    blockNumber: number,
  ): Promise<MulticallV3Response[]> {
    const callsKey = calls
      .map((c) => buildSnapshotKey([c.to.toString(), c.data.toString()]))
      .join('|')
    const key = this.buildSnapshotKey([
      'multicall',
      blockNumber.toString(),
      callsKey,
    ])
    const snapshot = await this.$.inputs.readRpc<MulticallV3Response[]>(key)

    if (snapshot) {
      return snapshot
    }

    throw new ReplayError(key)
  }

  private buildSnapshotKey(params: string[]): string {
    return buildSnapshotKey([this.$.chain, ...params])
  }
}

class ReplayError extends Error {
  constructor(key: string) {
    super(`missing snapshot data - ${key}`)
    this.name = 'ReplayError'
  }
}
