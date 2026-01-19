import type { Logger } from '@l2beat/backend-tools'
import type {
  BlockRangeWithTimestamps,
  Database,
  InteropEventRecord,
  InteropPluginSyncedRangeRecord,
} from '@l2beat/database'
import type { EthRpcClient, RpcBlock, RpcLog } from '@l2beat/shared'
import {
  type Block,
  ChainSpecificAddress,
  type EthereumAddress,
  type Log,
  type LongChainName,
  type UnixTime,
} from '@l2beat/shared-pure'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  createEventParser,
  type EventSignature,
  type InteropEvent,
  type InteropPluginResyncable,
  type LogToCapture,
  type ParsedEvent,
  type TxEvents,
} from '../../plugins/types'
import { getItemsToCapture } from '../capture/getItemsToCapture'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { errorToString, toEventSelector } from '../utils'
import { FollowingState } from './FollowingState'

export class LogQuery {
  topic0s = new Set<string>()
  addresses = new Set<EthereumAddress>()
  isEmpty() {
    return this.topic0s.size === 0 || this.addresses.size === 0
  }
}

export function buildLogQueryForPlugin(
  plugin: InteropPluginResyncable,
  chain: LongChainName,
): LogQuery {
  const result = new LogQuery()
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
      const signatures = [
        eventRequest.signature,
        ...(eventRequest.includeTxEvents ?? []),
      ]
      for (const signature of signatures) {
        // TODO try also with `toEventSelector` straight from viem
        const topic0 = toEventSelector(signature)
        if (topic0) {
          result.topic0s.add(topic0)
        }
      }
    }
  }

  return result
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
  private parserCache = new Map<EventSignature, ReturnType<typeof createEventParser>>()

  constructor(
    readonly chain: LongChainName,
    readonly plugin: InteropPluginResyncable,
    readonly clusterPlugins: InteropPluginResyncable[],
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
        pluginName: this.plugin.name,
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
    // If you're in a cluster, go through plugins in order
    const pluginsToRun =
      this.clusterPlugins.length > 0 ? this.clusterPlugins : [this.plugin]

    for (const plugin of pluginsToRun) {
      const produced = this.captureFromDataRequests(plugin, logToCapture)
      if (produced) {
        return produced.map((p) => ({ ...p, plugin: this.plugin.name }))
      }
    }
  }

  private getParser(signature: EventSignature) {
    const existing = this.parserCache.get(signature)
    if (existing) return existing
    const parser = createEventParser(signature)
    this.parserCache.set(signature, parser)
    return parser
  }

  private captureFromDataRequests(
    plugin: InteropPluginResyncable,
    logToCapture: LogToCapture,
  ) {
    for (const request of plugin.getDataRequests()) {
      const addressesOnThisChain = request.addresses
        .filter(
          (address) => ChainSpecificAddress.longChain(address) === logToCapture.chain,
        )
        .map((address) => ChainSpecificAddress.address(address))

      if (addressesOnThisChain.length === 0) continue

      const parser = this.getParser(request.signature)
      const parsed = parser(logToCapture.log, addressesOnThisChain)
      if (!parsed) continue

      if (request.includeTxEvents === undefined) {
        return request.captureFn(parsed, logToCapture)
      }

      const txEventsBySignature = new Map<EventSignature, unknown[]>()
      for (const signature of request.includeTxEvents) {
        const txParser = this.getParser(signature)
        const events: unknown[] = []
        for (const log of logToCapture.txLogs) {
          const parsedTx = txParser(log, addressesOnThisChain)
          if (parsedTx) {
            events.push(parsedTx)
          }
        }
        txEventsBySignature.set(signature, events)
      }

      const txEvents = {
        get: <S extends (typeof request.includeTxEvents)[number]>(
          signature: S,
        ): ParsedEvent<S>[] => {
          return (txEventsBySignature.get(signature) ?? []) as ParsedEvent<S>[]
        },
      } as TxEvents<typeof request.includeTxEvents>

      return request.captureFn(parsed, txEvents, logToCapture)
    }
  }

  async saveProducedInteropEvents(
    interopEvents: InteropEvent[],
    fullRange: BlockRangeWithTimestamps,
  ) {
    await this.runInTransaction(async () => {
      await this.store.saveNewEvents(interopEvents) // TODO: make this idempotent?
      await this.db.interopPluginSyncedRange.upsert({
        pluginName: this.plugin.name,
        chain: this.chain,
        ...fullRange,
      })
      await this.clearChainSyncError()
    })

    this.logger.info('Events captured for resyncable plugin', {
      plugin: this.plugin.name,
      chain: this.chain,
      blockNumber: fullRange.toBlock,
      events: interopEvents.length,
    })
  }

  async clearChainSyncError() {
    await this.db.interopPluginSyncState.setLastError(
      this.plugin.name,
      this.chain,
      null,
    )
  }

  async saveChainSyncError(error: unknown) {
    await this.db.interopPluginSyncState.setLastError(
      this.plugin.name,
      this.chain,
      errorToString(error),
    )
  }

  async isResyncRequestedFrom(): Promise<UnixTime | undefined> {
    const syncState =
      await this.db.interopPluginSyncState.findByPluginNameAndChain(
        this.plugin.name,
        this.chain,
      )
    return syncState?.resyncRequestedFrom ?? undefined
  }

  buildLogQuery() {
    return buildLogQueryForPlugin(this.plugin, this.chain)
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

  getLastSyncedRange(): Promise<InteropPluginSyncedRangeRecord | undefined> {
    return this.db.interopPluginSyncedRange.findByPluginNameAndChain(
      this.plugin.name,
      this.chain,
    )
  }

  getOldestEventForPluginAndChain(): Promise<InteropEventRecord | undefined> {
    return this.db.interopEvent.getOldestEventForPluginAndChain(
      this.plugin.name,
      this.chain,
    )
  }

  getItemsToCapture(block: Block, logs: Log[]) {
    return getItemsToCapture(this.chain, block, logs)
  }

  async deleteAllClusterData() {
    const pluginsToWipe =
      this.clusterPlugins.length > 0 ? this.clusterPlugins : [this.plugin]

    await this.db.transaction(async () => {
      for (const plugin of pluginsToWipe) {
        // Delete messages:
        await this.db.interopMessage.deleteForPlugin(plugin.name)
        // Delete transfers:
        await this.db.interopTransfer.deleteForPlugin(plugin.name)
        // Delete events:
        await this.store.deleteAllForPlugin(plugin.name)
      }
    })
  }
}
