import type { Logger } from '@l2beat/backend-tools'
import type {
  BlockRangeWithTimestamps,
  Database,
  InteropEventRecord,
  InteropPluginSyncedRangeRecord,
} from '@l2beat/database'
import {
  type EthRpcClient,
  type RpcBlock,
  type RpcLog,
  type RpcReceipt,
  type RpcTransaction,
  UpsertMap,
} from '@l2beat/shared'
import {
  type Block,
  ChainSpecificAddress,
  type EthereumAddress,
  type Log,
  type LongChainName,
  type UnixTime,
} from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import type {
  InteropEvent,
  InteropPluginResyncable,
  LogToCapture,
} from '../../plugins/types'
import { getItemsToCapture } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { errorToString, toEventSelector } from '../utils'
import { FollowingState } from './FollowingState'

export class LogQuery {
  topic0s = new Set<string>()
  addresses = new Set<EthereumAddress>()
  topicToTxEvents = new UpsertMap<string, Set<string>>()
  topic0sWithTx = new Set<string>()
  isEmpty() {
    return this.topic0s.size === 0 || this.addresses.size === 0
  }
}

export interface ResyncablePluginCluster {
  name: string
  plugins: InteropPluginResyncable[]
}

export function buildLogQueryForCluster(
  cluster: ResyncablePluginCluster,
  chain: LongChainName,
): LogQuery {
  const result = new LogQuery()
  for (const plugin of cluster.plugins) {
    addPluginDataRequests(result, plugin, chain)
  }
  return result
}

function addPluginDataRequests(
  result: LogQuery,
  plugin: InteropPluginResyncable,
  chain: LongChainName,
) {
  const eventRequests = plugin
    .getDataRequests()
    .filter((r) => r.type === 'event')

  for (const eventRequest of eventRequests) {
    let addressesOnThisChain = 0
    for (const address of eventRequest.addresses) {
      if (ChainSpecificAddress.longChain(address) !== chain) {
        continue
      }
      const ethAddress = ChainSpecificAddress.address(address)
      result.addresses.add(ethAddress)
      addressesOnThisChain++
    }
    if (addressesOnThisChain > 0) {
      // TODO try also with `toEventSelector` straight from viem
      const topic0 = toEventSelector(eventRequest.signature)
      result.topic0s.add(topic0)

      if (eventRequest.includeTxEvents?.length) {
        const txEvents = result.topicToTxEvents.getOrInsertComputed(
          topic0,
          () => new Set(),
        )
        for (const signature of eventRequest.includeTxEvents) {
          txEvents.add(toEventSelector(signature))
        }
      }
      if (eventRequest.includeTx) {
        result.topic0sWithTx.add(topic0)
      }
    }
  }
}

export type SyncerState = TimeloopState | BlockProcessorState

export interface TimeloopState {
  type: 'timeLoop'
  name: string
  status: string
  run(): Promise<SyncerState>
}
export interface BlockProcessorState {
  type: 'blockProcessor'
  name: string
  status: string
  processNewestBlock(block: Block, logs: Log[]): Promise<SyncerState>
}

export class InteropEventSyncer extends TimeLoop {
  public state: SyncerState
  public latestBlockNumber?: bigint
  public waitingForWipe = false

  constructor(
    readonly chain: LongChainName,
    readonly cluster: ResyncablePluginCluster,
    readonly rpcClient: EthRpcClient,
    readonly store: InteropEventStore,
    readonly db: Database,
    protected logger: Logger,
    intervalMs = 10000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
    this.state = new FollowingState(this, this.logger)
  }

  protected async triggerState<T extends SyncerState>(
    state: T,
    fn: (state: T) => Promise<SyncerState>,
  ) {
    try {
      await this.clearChainSyncError()
      this.state = await fn(state)
      if (this.state.type === 'timeLoop') {
        this.unpause()
      } else {
        this.pause()
      }
    } catch (error) {
      this.logger.error('Error syncing chain', error, {
        pluginName: this.cluster.name,
        chain: this.chain,
        syncerState: this.state.name,
      })
      await this.saveChainSyncError(error)
    }
  }

  async run() {
    const state = this.state
    if (state.type === 'timeLoop') {
      await this.triggerState(state, (current) => current.run())
    }
  }

  async processNewestBlock(block: Block, logs: Log[]) {
    this.latestBlockNumber = BigInt(block.number)
    const state = this.state
    if (state.type === 'blockProcessor') {
      await this.triggerState(state, (current) =>
        current.processNewestBlock(block, logs),
      )
    }
  }

  captureLog(logToCapture: LogToCapture) {
    for (const plugin of this.cluster.plugins) {
      const produced = plugin.capture(logToCapture)
      if (produced) {
        return produced.map((p) => ({ ...p, plugin: plugin.name }))
      }
    }
  }

  async saveProducedInteropEvents(
    interopEvents: InteropEvent[],
    fullRange: BlockRangeWithTimestamps,
  ) {
    await this.runInTransaction(async () => {
      await this.store.saveNewEvents(interopEvents) // TODO: make this idempotent?
      await this.db.interopPluginSyncedRange.upsert({
        pluginName: this.cluster.name,
        chain: this.chain,
        ...fullRange,
      })
      await this.clearChainSyncError()
    })

    this.logger.info('Events captured for resyncable cluster', {
      plugin: this.cluster.name,
      chain: this.chain,
      blockNumber: fullRange.toBlock,
      events: interopEvents.length,
    })
  }

  async clearChainSyncError() {
    await this.db.interopPluginSyncState.setLastError(
      this.cluster.name,
      this.chain,
      null,
    )
  }

  async saveChainSyncError(error: unknown) {
    await this.db.interopPluginSyncState.setLastError(
      this.cluster.name,
      this.chain,
      errorToString(error),
    )
  }

  async isResyncRequestedFrom(): Promise<UnixTime | undefined> {
    const { resyncFrom } = await this.getResyncState()
    return resyncFrom
  }

  async getResyncState(): Promise<{
    resyncFrom?: UnixTime
    wipeRequired: boolean
  }> {
    const syncState =
      await this.db.interopPluginSyncState.findByPluginNameAndChain(
        this.cluster.name,
        this.chain,
      )
    return {
      resyncFrom: syncState?.resyncRequestedFrom ?? undefined,
      wipeRequired: syncState?.wipeRequired ?? false,
    }
  }

  buildLogQuery() {
    return buildLogQueryForCluster(this.cluster, this.chain)
  }

  protected runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.db.transaction(fn)
  }

  getBlockByNumber(blockNumber: bigint): Promise<RpcBlock | null> {
    return this.rpcClient.getBlockByNumber(blockNumber, false)
  }

  getLogs(filter: {
    fromBlock: bigint
    toBlock: bigint
    address: EthereumAddress[]
    topics: string[][]
  }): Promise<RpcLog[]> {
    return this.rpcClient.getLogs(filter)
  }

  getTransactionReceipt(hash: string): Promise<RpcReceipt | null> {
    return this.rpcClient.getTransactionReceipt(hash)
  }

  getTransactionByHash(hash: string): Promise<RpcTransaction | null> {
    return this.rpcClient.getTransactionByHash(hash)
  }

  getLastSyncedRange(): Promise<InteropPluginSyncedRangeRecord | undefined> {
    return this.db.interopPluginSyncedRange.findByPluginNameAndChain(
      this.cluster.name,
      this.chain,
    )
  }

  getOldestEventForPluginAndChain(): Promise<InteropEventRecord | undefined> {
    return this.db.interopEvent.getOldestEventForPluginAndChain(
      this.cluster.plugins.map((plugin) => plugin.name),
      this.chain,
    )
  }

  getItemsToCapture(block: Block, logs: Log[]) {
    return getItemsToCapture(this.chain, block, logs)
  }
}
