import type { Logger } from '@l2beat/backend-tools'
import type { BlockRangeWithTimestamps, Database } from '@l2beat/database'
import type { EthRpcClient } from '@l2beat/shared'
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
import type { InteropEventStore } from '../capture/InteropEventStore'
import { errorToString, toEventSelector } from '../utils'
import { CatchingUpState } from './CatchingUpState'

export class LogQuery {
  topic0s = new Set<string>()
  addresses = new Set<EthereumAddress>()
  isEmpty() {
    return this.topic0s.size === 0 || this.addresses.size === 0
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
    this.state = new CatchingUpState(this, this.logger)
  }

  async triggerState(fn: () => Promise<SyncerState>) {
    try {
      this.state = await fn()
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
    if (this.state.type === 'timeLoop') {
      await this.triggerState(this.state.run)
    }
  }

  async processNewestBlock(block: Block, logs: Log[]) {
    if (this.state.type === 'blockProcessor') {
      const fn = this.state.processNewestBlock(block, logs)
      await this.triggerState(() => fn)
    }
  }

  captureLog(logToCapture: LogToCapture) {
    // If you're in a cluster, go through plugins in order
    const pluginsToRun =
      this.clusterPlugins.length > 0 ? this.clusterPlugins : [this.plugin]

    for (const plugin of pluginsToRun) {
      const produced = plugin.capture(logToCapture)
      if (produced) {
        return produced.map((p) => ({ ...p, plugin: this.plugin.name }))
      }
    }
  }

  async saveProducedInteropEvents(
    interopEvents: InteropEvent[],
    fullRange: BlockRangeWithTimestamps,
  ) {
    await this.db.transaction(async () => {
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
    const result = new LogQuery()
    const eventRequests = this.plugin
      .getDataRequests()
      .filter((r) => r.type === 'event')

    for (const eventRequest of eventRequests) {
      let addressesOnThisChain = 0
      for (const address of eventRequest.addresses) {
        if (ChainSpecificAddress.longChain(address) !== this.chain) {
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
      }
    }

    return result
  }
}
